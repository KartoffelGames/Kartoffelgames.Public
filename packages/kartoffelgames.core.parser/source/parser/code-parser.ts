import { Exception, Stack } from '@kartoffelgames/core';
import { LexerException } from '../lexer/lexer-exception.ts';
import type { LexerToken } from '../lexer/lexer-token.ts';
import type { Lexer } from '../lexer/lexer.ts';
import { CodeParserException, type CodeParserErrorSymbol } from './code-parser-exception.ts';
import { CodeParserProcessState, type CodeParserProcessCursorPosition, type CodeParserProcessStackItem, type CodeParserProcessStackMapping } from './code-parser-process-state.ts';
import type { GraphNode, GraphNodeConnections } from './graph/graph-node.ts';
import type { Graph } from './graph/graph.ts';

/**
 * Code parser turns a text with the help of a setup lexer into a syntax tree.
 * The data gets converted in the last step into another data type.
 * 
 * Parser moves a syntax graph along with the tokens to match a syntax and invoke specialized data collectors.
 * 
 * @typeparam TTokenType - Type of tokens the parser should handle. Must match with the lexter token types.
 * @typeparam TParseResult - The result object the parser returns on success.
 */
export class CodeParser<TTokenType extends string, TParseResult> {
    public static readonly NODE_VALUE_LIST_END_MEET: symbol = Symbol('FAILED_NODE_VALUE_PARSE');

    private readonly mConfiguration: Required<CodeParserConfiguration>;
    private readonly mLexer: Lexer<TTokenType>;
    private mRootPart: Graph<TTokenType, any, TParseResult> | null;

    /**
     * Get lexer.
     */
    public get lexer(): Lexer<TTokenType> {
        return this.mLexer;
    }

    /**
     * Constructor.
     * 
     * @param pLexer - Token lexer.
     */
    public constructor(pLexer: Lexer<TTokenType>, pConfiguration?: CodeParserConfiguration) {
        this.mLexer = pLexer;
        this.mRootPart = null;

        // Set configuration.
        this.mConfiguration = {
            keepTraceIncidents: false,
            trimTokenCache: false,
            ...pConfiguration
        };
    }

    /**
     * Parse a text with the set syntax from {@link CodeParser.setRootGraph} into a syntax tree
     * or custom data structure.
     * 
     * @param pCodeText - Code as text.
     * @param pProgressTracker - Optional progress tracker for the parsing progress.
     * 
     * @returns The code as {@link TTokenType} data structure.
     * 
     * @throws {@link ParserException}
     * When the graph could not be resolved with the set code text.
     * Or {@link Exception} when no tokenizeable text should be parsed.
     * 
     * @internal
     */
    public parse(pCodeText: string, pProgressTracker?: CodeParserProgressTracker): TParseResult {
        // Validate lazy parameters.
        if (this.mRootPart === null) {
            throw new Exception('Parser has not root part set.', this);
        }

        // Create a parser state for the code text.
        const lParseProcessState: CodeParserProcessState<TTokenType> = new CodeParserProcessState<TTokenType>(
            this.mLexer.tokenize(pCodeText, pProgressTracker),
            this.mConfiguration.keepTraceIncidents,
            this.mConfiguration.trimTokenCache
        );

        // Parse root graph part.
        const lRootParseData: unknown | CodeParserErrorSymbol = (() => {
            try {
                return this.beginParseProcess(lParseProcessState, this.mRootPart as Graph<TTokenType>)!;
            } catch (pError) {
                // Lexer error can be directly added to the trace.
                if (pError instanceof LexerException) {
                    lParseProcessState.incidentTrace.push(pError.message, lParseProcessState.currentGraph, pError.lineStart, pError.columnStart, pError.lineEnd, pError.columnEnd, true, pError);
                    return CodeParserException.PARSER_ERROR;
                }

                // The graph stack is still in the state the error was thrown, so we can still extract data from it.

                // Read error message from error object. Default to toString.
                const lErrorMessage: string = pError instanceof Error ? pError.message : (<any>pError).toString();

                // Read current graph position, as errors can only be thrown in the data converter functions.
                const lCursorPosition: CodeParserProcessCursorPosition<TTokenType> = lParseProcessState.getGraphPosition();

                // Add error as trace incident and return an error.
                lParseProcessState.incidentTrace.push(lErrorMessage, lParseProcessState.currentGraph, lCursorPosition.lineStart, lCursorPosition.columnStart, lCursorPosition.lineEnd, lCursorPosition.columnEnd, true, pError);
                return CodeParserException.PARSER_ERROR;
            }
        })();

        // Or throw a normal parser exception when it was handled.
        if (lRootParseData === CodeParserException.PARSER_ERROR) {
            throw new CodeParserException(lParseProcessState.incidentTrace);
        }

        // Convert parse data of null into index 0 token index. Null means no token was processed.
        const lRemainingToken: Array<LexerToken<TTokenType>> = lParseProcessState.collapse();

        // Validate, that every token was parsed.
        if (lRemainingToken.length !== 0) {
            const lNextToken: LexerToken<TTokenType> = lRemainingToken[0];

            // Only add an incident for the unparsed token when there is no other incident.
            // By doing that, we prevent a useful error message from being hidden by a useless "buhu there still tokens left"-error.
            if (lParseProcessState.incidentTrace.top.range.lineEnd === 1 && lParseProcessState.incidentTrace.top.range.columnEnd === 1) {
                // Create a error message and add a incident.
                const lErrorMessage: string = `Tokens could not be parsed. Graph end meet without reaching last token. Current: "${lNextToken.value}" (${lNextToken.type})`;
                lParseProcessState.incidentTrace.push(lErrorMessage, this.mRootPart as Graph<TTokenType>, lNextToken.lineNumber, lNextToken.columnNumber, lNextToken.lineNumber, lNextToken.columnNumber);
            }

            // Throw error with pushed incident.
            throw new CodeParserException(lParseProcessState.incidentTrace);
        }

        return lRootParseData as TParseResult;
    }

    /**
     * Set the root graph part of this parser.
     * 
     * @param pGraph - Graph.
     * 
     * @throws {@link Exception}
     * If the graph part is not defined or lacks a defined data collector.
     * 
     * @internal
     */
    public setRootGraph(pGraph: Graph<TTokenType, any, TParseResult>): void {
        this.mRootPart = pGraph;
    }

    /**
     * Begins the parsing process for the given cursor and root graph.
     * 
     * The parsing process involves managing a stack of parsing tasks, each represented by a `CodeParserProcessStackItem`.
     * The main loop processes each item on the stack until it is empty, handling different types of parsing tasks such as
     * graph parsing, node parsing, node value parsing, and chained node parsing.
     * 
     * The function handles various states within each parsing task, ensuring proper transitions and error handling.
     * It also manages circular graph detection, token validation, and data conversion.
     * 
     * The function throws exceptions for invalid states or process types, ensuring robust error handling.
     * 
     * @param pParsingProcessState - The current state of the code parser.
     * @param pRootGraph - The root graph to start parsing from.
     * 
     * @returns The result of the parsing process, which can be either an unknown value or a CodeParserErrorSymbol.
     */
    private beginParseProcess(pParsingProcessState: CodeParserProcessState<TTokenType>, pRootGraph: Graph<TTokenType>): unknown | CodeParserErrorSymbol {
        // Move to first token.
        pParsingProcessState.moveNextToken();

        // Create process stack and push the first graph parse process.
        const lProcessStack: Stack<CodeParserProcess<TTokenType>> = new Stack<CodeParserProcess<TTokenType>>();
        lProcessStack.push(this.createProcess(pParsingProcessState, { type: 'graphParse', parameter: { graph: pRootGraph, linear: true } }));

        // Process stack as long as something is stacked.
        let lStackResult: object | CodeParserErrorSymbol = CodeParserException.PARSER_ERROR;
        while (lProcessStack.top) {
            // Process current stack process.
            const lProcessResult: IteratorResult<CodeParserProcessStackItem<TTokenType>, unknown | CodeParserErrorSymbol> = lProcessStack.top.next(lStackResult);

            // When its done, it can only be an error state ot the actual value.
            if (lProcessResult.done) {
                lProcessStack.pop();

                // When the code is correct, it really can only be the result or an error symbol.
                lStackResult = lProcessResult.value as (object | CodeParserErrorSymbol);
                continue;
            }

            // If its not done, it ALLWAYS (hopefully) yield a CodeParserProcessState.
            lProcessStack.push(this.createProcess(pParsingProcessState, lProcessResult.value));
        }

        return lStackResult;
    }

    /**
     * Processes the chained node parse process.
     * 
     * This method handles the state transitions for parsing a chained node in the code parser process stack.
     * 
     * @param pNode - Chained graphNode  
     * 
     * @returns The result of the node parse process, which can be an object, an empty chain result, or a parser error symbol.
     */
    private * createChainedNodeParseProcess(pNode: GraphNode<TTokenType, object>): CodeParserProcess<TTokenType> {
        // Next chained node.
        const lNextNode: GraphNode<TTokenType, object> | null = pNode.connections.next;

        // No result when branch end was meet.
        if (lNextNode === null) {
            // Set return value to an empty chain result.
            return {};
        }

        // Start parsing next node and passthrough errors.
        const lChainResult: object | CodeParserErrorSymbol = yield { type: 'nodeParse', parameter: { node: lNextNode } };
        if (lChainResult === CodeParserException.PARSER_ERROR) {
            return CodeParserException.PARSER_ERROR;
        }

        // Set return value to node parse result.
        return lChainResult;
    }

    /**
     * Processes the graph parsing based on the current state of the parsing process.
     * 
     * @param pParsingProcessState - The current state of the code parser.
     * @param pCurrentProcess - The current process stack mapping for graph parsing.
     * @param pStackResult - The result from the previous stack process.
     * 
     * @returns The result of the grap parsing, which can be an unknown value, an object, or a CodeParserErrorSymbol.
     * 
     * @throws {Exception} If an invalid graph parse state is encountered.
     */
    private * createGraphParseProcess(pParsingProcessState: CodeParserProcessState<TTokenType>, pGraph: Graph<TTokenType, object, object>, pLinear: boolean): CodeParserProcess<TTokenType> {
        // Prevent circular graph calls that doesnt progressed itself.
        if (pParsingProcessState.graphIsCircular(pGraph)) {
            // Read the current graph position.
            const lGraphPosition: CodeParserProcessCursorPosition<TTokenType> = pParsingProcessState.getGraphPosition();

            // Add a circular graph incident.
            pParsingProcessState.incidentTrace.push(`Circular graph detected.`, pGraph, lGraphPosition.lineStart, lGraphPosition.columnStart, lGraphPosition.lineEnd, lGraphPosition.columnEnd);

            // Exit parsing without pushing a new process.
            return CodeParserException.PARSER_ERROR;
        }

        // Add graph to parser state graph stack.
        pParsingProcessState.pushGraphStack(pGraph, pLinear);

        // Parse node of graph and passthrough errors.
        const lNodeParseResult: object | CodeParserErrorSymbol = yield { type: 'nodeParse', parameter: { node: pGraph.node } };
        if (lNodeParseResult === CodeParserException.PARSER_ERROR) {
            // Pop graph with an error.
            pParsingProcessState.popGraphStack(true);

            // Exit parsing without pushing a new process.
            return CodeParserException.PARSER_ERROR;
        }

        // Try to convert data.
        const lConvertedData: object | symbol = pGraph.convert(lNodeParseResult, pParsingProcessState);
        if (typeof lConvertedData === 'symbol') {
            // Read the current graph position.
            const lGraphPosition: CodeParserProcessCursorPosition<TTokenType> = pParsingProcessState.getGraphPosition();

            // Integrate exception into parser exception, this should never be a code parser exception.
            pParsingProcessState.incidentTrace.push(lConvertedData.description ?? 'Unknown data convert error', lGraphPosition.graph, lGraphPosition.lineStart, lGraphPosition.columnStart, lGraphPosition.lineEnd, lGraphPosition.columnEnd);

            // Pop graph with an error.
            pParsingProcessState.popGraphStack(true);

            // Exit parsing without pushing a new process.
            return CodeParserException.PARSER_ERROR;
        }

        // Pop graph with success.
        pParsingProcessState.popGraphStack(false);

        // Set return value to converted data.
        return lConvertedData;
    }

    /**
     * Processes the node parsing based on the current state of the parsing process.
     * 
     * @param pParsingProcessState - The current state of the code parser.
     * @param pCurrentProcess - The current process stack mapping for node parsing.
     * @param pStackResult - The result from the previous stack process.
     * 
     * @returns The result of the node parsing, which can be an unknown value, an object, or a CodeParserErrorSymbol.
     * 
     * @throws {Exception} If an invalid node parse state is encountered.
     */
    private * createNodeParseProcess(pNode: GraphNode<TTokenType, object>): CodeParserProcess<TTokenType> {
        // Wait for node value parse and passthrough errors.
        const lNodeParseResult: unknown | CodeParserErrorSymbol = yield { type: 'nodeValueParse', parameter: { node: pNode } };
        if (lNodeParseResult === CodeParserException.PARSER_ERROR) {
            return CodeParserException.PARSER_ERROR;
        }

        // Proceed with next node parse.
        const lNodeNextParseResult: object | CodeParserErrorSymbol = yield { type: 'nodeNextParse', parameter: { node: pNode } };
        if (lNodeNextParseResult === CodeParserException.PARSER_ERROR) {
            return CodeParserException.PARSER_ERROR;
        }

        // Merge data and set return value to node parse result.
        return pNode.mergeData(lNodeParseResult, lNodeNextParseResult);
    }

    /**
     * Processes the node value parsing for the given current process.
     *
     * @param pParsingProcessState - The current state of the code parser.
     * @param pNode - Node that should be processed.
     * 
     * @returns The parsed node value or an error value.
     */
    private * createNodeValueParseProcess(pParsingProcessState: CodeParserProcessState<TTokenType>, pNode: GraphNode<TTokenType, object>): CodeParserProcess<TTokenType> {
        // Read node connections.
        const lNodeConnections: GraphNodeConnections<TTokenType> = pNode.connections;

        for (let lValueIndex: number = 0; lValueIndex < lNodeConnections.values.length; lValueIndex++) {
            // Read and parse node value based on type.
            const lNodeValue = lNodeConnections.values[lValueIndex];
            if (typeof lNodeValue === 'string') {
                // Read current token. Can fail when lexer fails.
                const lCurrentToken: LexerToken<TTokenType> | null = pParsingProcessState.currentToken;

                // When no current token was found, skip node value parsing.
                if (!lCurrentToken) {
                    // Append error when node was required.
                    if (lNodeConnections.required) {
                        // Get current token position.
                        const lTokenPosition: CodeParserProcessCursorPosition<TTokenType> = pParsingProcessState.getTokenPosition();

                        // Push parser incident as the current token position.
                        pParsingProcessState.incidentTrace.push(`Unexpected end of statement. Token "${lNodeValue}" expected.`, pParsingProcessState.currentGraph, lTokenPosition.lineStart, lTokenPosition.columnStart, lTokenPosition.lineEnd, lTokenPosition.columnEnd);
                    }

                    // No token was found, try next value.
                    continue;
                }

                // Push possible parser error when token type does not match node value.
                if (lNodeValue !== lCurrentToken.type) {
                    if (lNodeConnections.required) {
                        // Get current token position.
                        const lTokenPosition: CodeParserProcessCursorPosition<TTokenType> = pParsingProcessState.getTokenPosition();

                        // Push parser incident as the current token position.
                        pParsingProcessState.incidentTrace.push(`Unexpected token "${lCurrentToken.value}". "${lNodeValue}" expected`, pParsingProcessState.currentGraph, lTokenPosition.lineStart, lTokenPosition.columnStart, lTokenPosition.lineEnd, lTokenPosition.columnEnd);
                    }

                    // No token was found, try next value.
                    continue;
                }

                // Move cursor to next token.
                pParsingProcessState.moveNextToken();

                // Set token value as result.
                return lCurrentToken.value;
            } else {
                // Check of current node value is linear.
                const lNodeValueIsLinear: boolean = lNodeConnections.values.length === 1 || lNodeConnections.values.length === (lValueIndex + 1);

                // Push parser process for graph value.
                const lGraphParseResult: object | typeof CodeParserException.PARSER_ERROR = yield { type: 'graphParse', parameter: { graph: lNodeValue, linear: lNodeValueIsLinear } };

                // When the graph has successfully parsed, use its value as result.
                if (lGraphParseResult !== CodeParserException.PARSER_ERROR) {
                    return lGraphParseResult;
                }
            }
        }

        // Empty result when no node value was found and node is optional.
        // Null means it has not found any fitting node value but meet the end of the node value parse.
        if (!lNodeConnections.required) {
            // Set return value to node parse result. Yes undefined. Thats correct.
            return undefined;
        }

        // When no result was added, node was required and should fail.
        return CodeParserException.PARSER_ERROR;
    }

    /**
     * Creates a new process for parsing operations.
     * 
     * The function creates different types of parsing operations:
     * - 'graphParse': Parses a graph structure.
     * - 'nodeParse': Parses a node within a graph.
     * - 'nodeValueParse': Parses the value of a node.
     * - 'nodeNextParse': Parses the next node in a chain of nodes.
     *
     * @param pParsingProcessState - The current state of the code parser.
     * @param pCurrentProcess - The current parsing operation being processed.
     * 
     * @returns The created process.
     */
    private createProcess(pParsingProcessState: CodeParserProcessState<TTokenType>, pCurrentProcess: CodeParserProcessStackItem<TTokenType>): CodeParserProcess<TTokenType> {
        // Process current process
        switch (pCurrentProcess.type) {
            case 'graphParse': {
                return this.createGraphParseProcess(pParsingProcessState, pCurrentProcess.parameter.graph, pCurrentProcess.parameter.linear);
            }
            case 'nodeParse': {
                return this.createNodeParseProcess(pCurrentProcess.parameter.node);
            }
            case 'nodeValueParse': {
                return this.createNodeValueParseProcess(pParsingProcessState, pCurrentProcess.parameter.node);
            }
            case 'nodeNextParse': {
                return this.createChainedNodeParseProcess(pCurrentProcess.parameter.node);
            }
        }
    }
}

type CodeParserProcess<TTokenType extends string> = Generator<CodeParserProcessStackItem<TTokenType>, unknown | CodeParserErrorSymbol, object | CodeParserErrorSymbol>;

export type CodeParserProgressTracker = (pPosition: number, pLine: number, pColumn: number) => void;

export type CodeParserConfiguration = {
    /**
     * Keep a list of parsing incidents of every parsing branch.
     * Uses more memory, but allows to keep track of parsing errors.
     * More of a debugging feature.
     * 
     * Default: false
     */
    keepTraceIncidents?: boolean;

    /**
     * When true, the parser will trim the current token cache when a static branch was parsed.
     * This is useful to reduce memory usage when parsing large texts without complex structures like xml.
     * 
     * Enabling will reduce the accuracy of the current token positions in graph converter and related functions,
     * 
     * Default: false
     */
    trimTokenCache?: boolean;
};
