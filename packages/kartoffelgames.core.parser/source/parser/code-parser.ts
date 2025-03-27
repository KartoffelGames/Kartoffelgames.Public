import { Exception } from '@kartoffelgames/core';
import { CodeParserException, LexerException } from '../index.ts';
import type { LexerToken } from '../lexer/lexer-token.ts';
import type { Lexer } from '../lexer/lexer.ts';
import type { CodeParserErrorSymbol } from './code-parser-exception.ts';
import { type CodeParserProcessCursorPosition, type CodeParserProcessStackItem, type CodeParserProcessStackMapping, CodeParserProcessState } from './code-parser-process-state.ts';
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
    private mDebugMode: boolean;
    private readonly mLexer: Lexer<TTokenType>;
    private mMaxRecursion: number;
    private mRootPart: Graph<TTokenType, any, TParseResult> | null;

    /**
     * Get debug mode.
     */
    public get debugMode(): boolean {
        return this.mDebugMode;
    } set debugMode(pValue: boolean) {
        this.mDebugMode = pValue;
    }

    /**
     * Get lexer.
     */
    public get lexer(): Lexer<TTokenType> {
        return this.mLexer;
    }

    /**
     * Set max recursion count for detecting circular part dependencies.
     */
    public get maxRecursion(): number {
        return this.mMaxRecursion;
    } set maxRecursion(pValue: number) {
        this.mMaxRecursion = pValue;
    }

    /**
     * Constructor.
     * 
     * @param pLexer - Token lexer.
     */
    public constructor(pLexer: Lexer<TTokenType>) {
        this.mLexer = pLexer;
        this.mMaxRecursion = 100;
        this.mRootPart = null;
        this.mDebugMode = false;
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
     */
    public parse(pCodeText: string, pProgressTracker?: CodeParserProgressTracker): TParseResult {
        // Validate lazy parameters.
        if (this.mRootPart === null) {
            throw new Exception('Parser has not root part set.', this);
        }

        // Create a parser state for the code text.
        const lParseProcessState: CodeParserProcessState<TTokenType> = new CodeParserProcessState<TTokenType>(this.mLexer.tokenize(pCodeText, pProgressTracker), this.mDebugMode);

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
            const lLastToken: LexerToken<TTokenType> = lRemainingToken.at(-1)!;

            // Create a error message and add a incident.
            const lErrorMessage: string = `Tokens could not be parsed. Graph end meet without reaching last token. Current: "${lNextToken.value}" (${lNextToken.type})`;
            lParseProcessState.incidentTrace.push(lErrorMessage, this.mRootPart as Graph<TTokenType>, lNextToken.lineNumber, lNextToken.columnNumber, lLastToken.lineNumber, lLastToken.columnNumber);

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
        // Push the first process.
        pParsingProcessState.processStack.push({ type: 'graph-parse', parameter: { graph: pRootGraph, linear: true }, state: 0 });

        // Process stack as long as something is stacked.
        let lStackResult: unknown = undefined;
        while (pParsingProcessState.processStack.top) {
            lStackResult = this.processStack(pParsingProcessState, pParsingProcessState.processStack.top, lStackResult);
        }

        return lStackResult;
    }

    /**
     * Processes the chained node parse process.
     * 
     * This method handles the state transitions for parsing a chained node in the code parser process stack.
     * 
     * @param pParsingProcessState - The current state of the code parser.
     * @param pCurrentProcess - The current process state and parameters for the node next parse.
     * @param pStackResult - The result from the previous process in the stack.
     * 
     * @returns The result of the node parse process, which can be an object, an empty chain result, or a parser error symbol.
     * 
     * @throws {Exception} Throws an exception if an invalid state is encountered.
     */
    private processChainedNodeParseProcess(pParsingProcessState: CodeParserProcessState<TTokenType>, pCurrentProcess: CodeParserProcessStackMapping<TTokenType>['nodeNextParse'], pStackResult: unknown): undefined | CodeParserErrorSymbol | object {
        switch (pCurrentProcess.state) {
            // State 0: Start node next parse.
            case 0: {
                // Read parameters.
                const lNode: GraphNode<TTokenType> = pCurrentProcess.parameter.node;

                // Read node connections.
                const lNodeConnections: GraphNodeConnections<TTokenType> = lNode.connections;

                // Next chained node.
                const lNextNode: GraphNode<TTokenType, object> | null = lNodeConnections.next;

                // No result when branch end was meet.
                if (lNextNode === null) {
                    // Pop itself from stack.
                    pParsingProcessState.processStack.pop();

                    // Set return value to an empty chain result.
                    return {};
                }

                // Proceed to next state.
                pCurrentProcess.state++;

                // Start parsing next node.
                pParsingProcessState.processStack.push({ type: 'node-parse', parameter: { node: lNextNode }, state: 0, values: {} });

                return;
            }

            // State 1: End node next parse.
            case 1: {
                // Read parameters.
                const lChainResult: object | CodeParserErrorSymbol = pStackResult as object | CodeParserErrorSymbol;

                // Exit on node parse error.
                if (lChainResult === CodeParserException.PARSER_ERROR) {
                    // Pop itself from stack.
                    pParsingProcessState.processStack.pop();

                    // Set return value to error.
                    return CodeParserException.PARSER_ERROR;
                }

                // Pop itself from stack.
                pParsingProcessState.processStack.pop();

                // Set return value to node parse result.
                return lChainResult;
            }
        }

        throw new Exception(`Invalid node next parse state "${pCurrentProcess.state}".`, this);
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
    private processGraphParseProcess(pParsingProcessState: CodeParserProcessState<TTokenType>,  pCurrentProcess: CodeParserProcessStackMapping<TTokenType>['graphParse'], pStackResult: unknown): unknown {
        const lGraph: Graph<TTokenType> = pCurrentProcess.parameter.graph;

        switch (pCurrentProcess.state) {
            // State 0: Start graph parse.
            case 0: {
                // Prevent circular graph calls that doesnt progressed itself.
                if (pParsingProcessState.graphIsCircular(lGraph)) {
                    // Read the current graph position.
                    const lGraphPosition: CodeParserProcessCursorPosition<TTokenType> = pParsingProcessState.getGraphPosition();

                    // Add a circular graph incident.
                    pParsingProcessState.incidentTrace.push(`Circular graph detected.`, lGraph, lGraphPosition.lineStart, lGraphPosition.columnStart, lGraphPosition.lineEnd, lGraphPosition.columnEnd);

                    // Pop itself from stack.
                    pParsingProcessState.processStack.pop();

                    // Exit parsing without pushing a new process.
                    return CodeParserException.PARSER_ERROR;
                }

                // Read linear parameter of the graph.
                const lCalledLinear: boolean = pCurrentProcess.parameter.linear;

                // Add graph to parser state graph stack.
                pParsingProcessState.pushGraphStack(lGraph, lCalledLinear);

                // Proceed to next state.
                pCurrentProcess.state++;

                // Parse node of graph.
                pParsingProcessState.processStack.push({ type: 'node-parse', parameter: { node: lGraph.node }, state: 0, values: {} });

                // Proceed next stack item.
                return;
            }

            // State 1: End graph parse.
            case 1: {
                // Read node parse result.
                const lNodeParseResult: object | CodeParserErrorSymbol = pStackResult as (object | CodeParserErrorSymbol);

                if (lNodeParseResult === CodeParserException.PARSER_ERROR) {
                    // Pop graph with an error.
                    pParsingProcessState.popGraphStack(true);

                    // Pop itself from stack.
                    pParsingProcessState.processStack.pop();

                    // Exit parsing without pushing a new process.
                    return CodeParserException.PARSER_ERROR;
                }

                // Try to convert data.
                const lConvertedData: object | symbol = lGraph.convert(lNodeParseResult);
                if (typeof lConvertedData === 'symbol') {
                    // Read the current graph position.
                    const lGraphPosition: CodeParserProcessCursorPosition<TTokenType> = pParsingProcessState.getGraphPosition();

                    // Integrate exception into parser exception, this should never be a code parser exception.
                    pParsingProcessState.incidentTrace.push(lConvertedData.description ?? 'Unknown data convert error', lGraphPosition.graph, lGraphPosition.lineStart, lGraphPosition.columnStart, lGraphPosition.lineEnd, lGraphPosition.columnEnd);

                    // Pop graph with an error.
                    pParsingProcessState.popGraphStack(true);

                    // Pop itself from stack.
                    pParsingProcessState.processStack.pop();

                    // Exit parsing without pushing a new process.
                    return CodeParserException.PARSER_ERROR;
                }

                // Pop graph with success.
                pParsingProcessState.popGraphStack(false);

                // Pop itself from stack.
                pParsingProcessState.processStack.pop();

                // Set return value to converted data.
                return lConvertedData;
            }
        }

        throw new Exception(`Invalid graph parse state "${pCurrentProcess.state}".`, this);
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
    private processNodeParseProcess(pParsingProcessState: CodeParserProcessState<TTokenType>, pCurrentProcess: CodeParserProcessStackMapping<TTokenType>['nodeParse'], pStackResult: unknown): unknown {
        const lNode: GraphNode<TTokenType> = pCurrentProcess.parameter.node;

        switch (pCurrentProcess.state) {
            // State 0: Start node parse.
            case 0: {
                // Continue with node parse end after node value parse
                pParsingProcessState.processStack.push({ type: 'node-value-parse', parameter: { node: lNode, valueIndex: 0 }, state: 0, values: {} });

                // Proceed to next state.
                pCurrentProcess.state++;

                return;
            }

            // State 1: Save node value parse result and proceed to parse next node.
            case 1: {
                // Read node value parse result.
                const lNodeParseResult: unknown | CodeParserErrorSymbol = pStackResult;

                // Exit on node parse error.
                if (lNodeParseResult === CodeParserException.PARSER_ERROR) {
                    // Pop itself from stack.
                    pParsingProcessState.processStack.pop();

                    // Exit parsing without pushing a new process.
                    return CodeParserException.PARSER_ERROR;
                }

                // Save node value parse result in values.
                pCurrentProcess.values.nodeValueResult = lNodeParseResult;

                // Proceed with next node parse.
                pParsingProcessState.processStack.push({ type: 'node-next-parse', parameter: { node: lNode }, state: 0 });

                // Proceed to next state.
                pCurrentProcess.state++;

                return;
            }

            // State 2: Save node next parse and return value.
            case 2: {
                // Read node next parse result.
                const lNodeNextParseResult: object | CodeParserErrorSymbol = pStackResult as (object | CodeParserErrorSymbol);

                // Exit on node parse error.
                if (lNodeNextParseResult === CodeParserException.PARSER_ERROR) {
                    // Pop itself from stack.
                    pParsingProcessState.processStack.pop();

                    // Set return value to error.
                    return CodeParserException.PARSER_ERROR;
                }

                // Merge data.
                const lMergedData: object = lNode.mergeData(pCurrentProcess.values.nodeValueResult, lNodeNextParseResult);

                // Pop itself from stack.
                pParsingProcessState.processStack.pop();

                // Set return value to node parse result.
                return lMergedData;
            }
        }

        throw new Exception(`Invalid node parse state "${pCurrentProcess.state}".`, this);
    }

    /**
     * Processes the node value parsing for the given current process.
     *
     * @param pParsingProcessState - The current state of the code parser.
     * @param pCurrentProcess - The current process stack mapping for node value parsing.
     * @param pStackResult - The result of the previous stack process.
     * 
     * @returns The parsed node value or an error value.
     * 
     * @throws {Exception} When an invalid node value parse state is encountered.
     */
    private processNodeValueParseProcess(pParsingProcessState: CodeParserProcessState<TTokenType>, pCurrentProcess: CodeParserProcessStackMapping<TTokenType>['nodeValueParse'], pStackResult: unknown): unknown {
        const lNode: GraphNode<TTokenType> = pCurrentProcess.parameter.node;

        switch (pCurrentProcess.state) {
            // State 0: Iterate over node values.
            case 0: {
                // When the last process has returned a value, use the parse result when it is not a error value.
                if (pStackResult && pStackResult !== CodeParserException.PARSER_ERROR) {
                    // Set parsed value to last stack result.
                    pCurrentProcess.values.parseResult = pStackResult;

                    // Proceed to next state.
                    pCurrentProcess.state++;

                    return;
                }

                // Read current value index.
                const lValueIndex: number = pCurrentProcess.parameter.valueIndex;

                // Read node connections.
                const lNodeConnections: GraphNodeConnections<TTokenType> = lNode.connections;

                // Check if node has any more values.
                if (lValueIndex >= lNodeConnections.values.length) {
                    // Set parsed value to null.
                    pCurrentProcess.values.parseResult = null;

                    // Proceed to next state.
                    pCurrentProcess.state++;

                    return;
                }

                // Increment value.
                pCurrentProcess.parameter.valueIndex++;

                // Read current token. Can fail when lexer fails.
                const lCurrentToken: LexerToken<TTokenType> | null = pParsingProcessState.currentToken;

                // Read and parse node value based on type.
                const lNodeValue = lNodeConnections.values[lValueIndex];
                if (typeof lNodeValue === 'string') {
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
                        return;
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
                        return;
                    }

                    // Move cursor to next token.
                    pParsingProcessState.moveNextToken();

                    // Dont pop current process.

                    // Set value as result. The next iteration reads it and proceeds to the next state.
                    return lCurrentToken.value;
                } else {
                    // Check of current node value is linear.
                    const lNodeValueIsLinear: boolean = lNodeConnections.values.length === 1 || lNodeConnections.values.length === (lValueIndex + 1);

                    // Push parser process for graph value.
                    pParsingProcessState.processStack.push({ type: 'graph-parse', parameter: { graph: lNodeValue, linear: lNodeValueIsLinear }, state: 0 });

                    return;
                }
            }

            // State 1: Validate parsed value.
            case 1: {
                // Read node value parse result.
                const lNodeResult: unknown = pCurrentProcess.values.parseResult;

                // Read node connections.
                const lNodeConnections: GraphNodeConnections<TTokenType> = lNode.connections;

                // Empty result when no node value was found and node is optional.
                // Null means it has not found any fitting node value but meet the end of the node value parse.
                if (lNodeResult === null && !lNodeConnections.required) {
                    // Pop itself from stack.
                    pParsingProcessState.processStack.pop();

                    // Set return value to node parse result. Yes undefined. Thats correct.
                    return undefined;
                }

                // When no result was added, node was required and should fail.
                if (lNodeResult === null) {
                    // Pop itself from stack.
                    pParsingProcessState.processStack.pop();

                    // Set return value to error.
                    return CodeParserException.PARSER_ERROR;
                }

                // Pop itself from stack.
                pParsingProcessState.processStack.pop();

                // Set return value to node parse result.
                return lNodeResult;
            }
        }

        throw new Exception(`Invalid node value parse state "${pCurrentProcess.state}".`, this);
    }

    /**
     * Processes the current stack of parsing operations.
     * 
     * The function processes different types of parsing operations, including:
     * - 'graph-parse': Parses a graph structure.
     * - 'node-parse': Parses a node within a graph.
     * - 'node-value-parse': Parses the value of a node.
     * - 'node-next-parse': Parses the next node in a chain of nodes.
     *
     * @param pParsingProcessState - The current state of the code parser.
     * @param pCurrentProcess - The current parsing operation being processed.
     * @param pStackResult - The result of the previous parsing operation.
     * 
     * @returns The result of the current parsing operation, or an error symbol if an error occurred.
     *
     * @throws {Exception} If an invalid state is encountered during processing.
     */
    private processStack(pParsingProcessState: CodeParserProcessState<TTokenType>, pCurrentProcess: CodeParserProcessStackItem<TTokenType>, pStackResult: unknown): unknown {
        // Process current process
        switch (pCurrentProcess.type) {
            case 'graph-parse': {
                return this.processGraphParseProcess(pParsingProcessState, pCurrentProcess, pStackResult);
            }
            case 'node-parse': {
                return this.processNodeParseProcess(pParsingProcessState, pCurrentProcess, pStackResult);
            }
            case 'node-value-parse': {
                return this.processNodeValueParseProcess(pParsingProcessState, pCurrentProcess, pStackResult);
            }
            case 'node-next-parse': {
                return this.processChainedNodeParseProcess(pParsingProcessState, pCurrentProcess, pStackResult);
            }
        }
    }
}

export type CodeParserProgressTracker = (pPosition: number, pLine: number, pColumn: number) => void;