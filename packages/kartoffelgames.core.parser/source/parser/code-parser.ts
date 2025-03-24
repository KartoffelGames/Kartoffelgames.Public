import { Exception, Stack } from '@kartoffelgames/core';
import { CodeParserException, LexerException } from '../index.ts';
import type { LexerToken } from '../lexer/lexer-token.ts';
import type { Lexer } from '../lexer/lexer.ts';
import type { CodeParserErrorSymbol } from './code-parser-exception.ts';
import { CodeParserState, type CodeParserCursorGraphPosition, type CodeParserCursorTokenPosition } from './code-parser-state.ts';
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
     * Parse a text with the set syntax from {@link CodeParser.setRootGraph} into a sytnax tree
     * or custom data structure.
     * 
     * @param pCodeText - Code as text.
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

        // Create a parser cursor for the code text.
        const lCursor: CodeParserState<TTokenType> = new CodeParserState<TTokenType>(this.mLexer.tokenize(pCodeText, pProgressTracker), this.mDebugMode);

        // Parse root graph part.
        const lRootParseData: unknown | CodeParserErrorSymbol = (() => {
            try {
                return this.beginParseProcess(lCursor, this.mRootPart as Graph<TTokenType>)!;
            } catch (pError) {
                // The graph is still in the right state the error was thrown, so we can still extract data from it.

                // Lexer error can be directly added to the trace.
                if (pError instanceof LexerException) {
                    lCursor.trace.push(pError.message, lCursor.graph, pError.lineStart, pError.columnStart, pError.lineEnd, pError.columnEnd, true, pError);
                    return CodeParserException.PARSER_ERROR;
                }

                // Read error message from error object. Default to toString.
                const lErrorMessage: string = pError instanceof Error ? pError.message : (<any>pError).toString();

                // Read current graph position, as errors can only be thrown in the data converter functions.
                const lCursorPosition: CodeParserCursorGraphPosition<TTokenType> = lCursor.getGraphPosition();

                // Add error as trace incident and return an error.
                lCursor.trace.push(lErrorMessage, lCursor.graph, lCursorPosition.lineStart, lCursorPosition.columnStart, lCursorPosition.lineEnd, lCursorPosition.columnEnd, true, pError);
                return CodeParserException.PARSER_ERROR;
            }
        })();

        // Or throw a normal parser exception when it was handled.
        if (lRootParseData === CodeParserException.PARSER_ERROR) {
            throw new CodeParserException(lCursor.trace);
        }

        // Convert parse data of null into index 0 token index. Null means no token was processed.
        const lRemainingToken: Array<LexerToken<TTokenType>> = lCursor.collapse();

        // Validate, that every token was parsed.
        if (lRemainingToken.length !== 0) {
            const lNextToken: LexerToken<TTokenType> = lRemainingToken[0];
            const lLastToken: LexerToken<TTokenType> = lRemainingToken.at(-1)!;

            // Create a error message and add a incident.
            const lErrorMessage: string = `Tokens could not be parsed. Graph end meet without reaching last token. Current: "${lNextToken.value}" (${lNextToken.type})`;
            lCursor.trace.push(lErrorMessage, this.mRootPart as Graph<TTokenType>, lNextToken.lineNumber, lNextToken.columnNumber, lLastToken.lineNumber, lLastToken.columnNumber);

            // Throw error with pushed incident.
            throw new CodeParserException(lCursor.trace);
        }

        return lRootParseData as TParseResult;
    }

    /**
     * Set the root graph part of this parser.
     * 
     * @param pPartName - Graph part name.
     * 
     * @throws {@link Exception}
     * When the graph part is not defined or has no defined data collector.
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
     * @param pCursor - The current state of the code parser.
     * @param pRootGraph - The root graph to start parsing from.
     * 
     * @returns The result of the parsing process, which can be either an unknown value or a CodeParserErrorSymbol.
     */
    private beginParseProcess(pCursor: CodeParserState<TTokenType>, pRootGraph: Graph<TTokenType>): unknown | CodeParserErrorSymbol {
        const lProcessStack: Stack<CodeParserProcessStackItem<TTokenType>> = new Stack<CodeParserProcessStackItem<TTokenType>>();

        // TODO: Combine the pop-pushError-continue pattern into a function.
        // TODO: Wrap the switch in a function. And the return value gets pushed as STACK_RETURN ?
        // TODO: Technically all processes can be split into seperate methods.

        // Push the first process.
        lProcessStack.push({ type: 'graph-parse', parameter: { graph: pRootGraph, linear: true }, state: 0 });

        // Process stack as long as something is stacked.
        MAIN_LOOP: while (lProcessStack.top) {
            // Check for stack return
            let lStackResult: unknown | undefined = undefined;
            if (lProcessStack.top.type === 'STACK_RETURN') {
                const lResultStackItem: CodeParserStackResultItem = lProcessStack.pop()! as CodeParserStackResultItem;
                lStackResult = lResultStackItem.result;
            }

            // Return current stack result when no more processes are in the stack.
            if (!lProcessStack.top) {
                return lStackResult;
            }

            // Process current process
            const lCurrentProcess: CodeParserProcessStackItem<TTokenType> = lProcessStack.top;
            switch (lCurrentProcess.type) {
                /**
                 * Parse graph.
                 */
                case 'graph-parse': {
                    const lGraph: Graph<TTokenType> = lCurrentProcess.parameter.graph;

                    // State 0: Start graph parse.
                    if (lCurrentProcess.state === 0) {
                        // Prevent circular graph calls that doesnt progressed itself.
                        if (pCursor.graphIsCircular(lGraph)) {
                            // Read the current graph position.
                            const lGraphPosition: CodeParserCursorGraphPosition<TTokenType> = pCursor.getGraphPosition();

                            // Add a circular graph incident.
                            pCursor.trace.push(`Circular graph detected.`, lGraph, lGraphPosition.lineStart, lGraphPosition.columnStart, lGraphPosition.lineEnd, lGraphPosition.columnEnd);

                            // Pop itself from stack.
                            lProcessStack.pop();

                            // Set return value to error.
                            lProcessStack.push({ type: 'STACK_RETURN', result: CodeParserException.PARSER_ERROR });

                            // Exit parsing without pushing a new process.
                            continue MAIN_LOOP;
                        }

                        // Read linear parameter of the graph.
                        const lCalledLinear: boolean = lCurrentProcess.parameter.linear;

                        // Add graph to parser state graph stack.
                        pCursor.pushGraph(lGraph, lCalledLinear);

                        // Proceed to next state.
                        lCurrentProcess.state++;

                        // Parse node of graph.
                        lProcessStack.push({ type: 'node-parse', parameter: { node: lGraph.node }, state: 0, values: {} });

                        // Proceed next stack item.
                        continue MAIN_LOOP;
                    }

                    // State 1: End graph parse.
                    if (lCurrentProcess.state === 1) {
                        // Read node parse result.
                        const lNodeParseResult: object | CodeParserErrorSymbol = lStackResult as (object | CodeParserErrorSymbol);

                        if (lNodeParseResult === CodeParserException.PARSER_ERROR) {
                            // Pop graph with an error.
                            pCursor.popGraph(true);

                            // Pop itself from stack.
                            lProcessStack.pop();

                            // Set return value to error.
                            lProcessStack.push({ type: 'STACK_RETURN', result: CodeParserException.PARSER_ERROR });

                            // Exit parsing without pushing a new process.
                            continue MAIN_LOOP;
                        }

                        // Try to convert data.
                        const lConvertedData: object | symbol = lGraph.convert(lNodeParseResult);
                        if (typeof lConvertedData === 'symbol') {
                            // Read the current graph position.
                            const lGraphPosition: CodeParserCursorGraphPosition<TTokenType> = pCursor.getGraphPosition();

                            // Integrate exception into parser exception, this should never be a code parser exception.
                            pCursor.trace.push(lConvertedData.description ?? 'Unknown data convert error', lGraphPosition.graph, lGraphPosition.lineStart, lGraphPosition.columnStart, lGraphPosition.lineEnd, lGraphPosition.columnEnd);

                            // Pop graph with an error.
                            pCursor.popGraph(true);

                            // Pop itself from stack.
                            lProcessStack.pop();

                            // Set return value to error.
                            lProcessStack.push({ type: 'STACK_RETURN', result: CodeParserException.PARSER_ERROR });

                            // Exit parsing without pushing a new process.
                            continue MAIN_LOOP;
                        }

                        // Pop graph with success.
                        pCursor.popGraph(false);

                        // Pop itself from stack.
                        lProcessStack.pop();

                        // Set return value to converted data.
                        lProcessStack.push({ type: 'STACK_RETURN', result: lConvertedData });

                        continue MAIN_LOOP;
                    }

                    throw new Exception(`Invalid graph parse state "${lCurrentProcess.state}".`, this);
                }

                /**
                 * Parse node.
                 */
                case 'node-parse': {
                    const lNode: GraphNode<TTokenType> = lCurrentProcess.parameter.node;

                    // State 0: Start node parse.
                    if (lCurrentProcess.state === 0) {
                        // Continue with node parse end after node value parse
                        lProcessStack.push({ type: 'node-value-parse', parameter: { node: lNode, valueIndex: 0 }, state: 0, values: {} });

                        // Proceed to next state.
                        lCurrentProcess.state++;

                        continue MAIN_LOOP;
                    }

                    // State 1: Save node value parse result and proceed to parse next node.
                    if (lCurrentProcess.state === 1) {
                        // Read node value parse result.
                        const lNodeParseResult: unknown | CodeParserErrorSymbol = lStackResult;

                        // Exit on node parse error.
                        if (lNodeParseResult === CodeParserException.PARSER_ERROR) {
                            // Pop itself from stack.
                            lProcessStack.pop();

                            // Set return value to error.
                            lProcessStack.push({ type: 'STACK_RETURN', result: CodeParserException.PARSER_ERROR });

                            // Exit parsing without pushing a new process.
                            continue MAIN_LOOP;
                        }

                        // Save node value parse result in values.
                        lCurrentProcess.values.nodeValueResult = lNodeParseResult;

                        // Proceed with next node parse.
                        lProcessStack.push({ type: 'node-next-parse', parameter: { node: lNode }, state: 0 });

                        // Proceed to next state.
                        lCurrentProcess.state++;

                        continue MAIN_LOOP;
                    }

                    // State 2: Save node next parse and return value.
                    if (lCurrentProcess.state === 2) {
                        // Read node next parse result.
                        const lNodeNextParseResult: object | CodeParserErrorSymbol = lStackResult as (object | CodeParserErrorSymbol);

                        // Exit on node parse error.
                        if (lNodeNextParseResult === CodeParserException.PARSER_ERROR) {
                            // Pop itself from stack.
                            lProcessStack.pop();

                            // Set return value to error.
                            lProcessStack.push({ type: 'STACK_RETURN', result: CodeParserException.PARSER_ERROR });

                            // Exit parsing without pushing a new process.
                            continue MAIN_LOOP;
                        }

                        // Merge data.
                        const lMergedData: object = lNode.mergeData(lCurrentProcess.values.nodeValueResult, lNodeNextParseResult);

                        // Pop itself from stack.
                        lProcessStack.pop();

                        // Set return value to node parse result.
                        lProcessStack.push({ type: 'STACK_RETURN', result: lMergedData });

                        continue MAIN_LOOP;
                    }

                    throw new Exception(`Invalid node parse state "${lCurrentProcess.state}".`, this);
                }

                /**
                 * Parse node value.
                 */
                case 'node-value-parse': {
                    const lNode: GraphNode<TTokenType> = lCurrentProcess.parameter.node;

                    // State 0: Iterate over node values.
                    if (lCurrentProcess.state === 0) {
                        // When the last process hat returned a value, use at parse result when it is not a error value.
                        if (lStackResult && lStackResult !== CodeParserException.PARSER_ERROR) {
                            // Set parsed value to last stack result.
                            lCurrentProcess.values.parseResult = lStackResult;

                            // Proceed to next state.
                            lCurrentProcess.state++;

                            continue MAIN_LOOP;
                        }

                        // Read current value index.
                        const lValueIndex: number = lCurrentProcess.parameter.valueIndex;

                        // Read node connections.
                        const lNodeConnections: GraphNodeConnections<TTokenType> = lNode.connections;

                        // Check if node has any more values.
                        if (lValueIndex >= lNodeConnections.values.length) {
                            // Set parsed value to null.
                            lCurrentProcess.values.parseResult = null;

                            // Proceed to next state.
                            lCurrentProcess.state++;

                            continue MAIN_LOOP;
                        }

                        // Increment value.
                        lCurrentProcess.parameter.valueIndex++;

                        // Read current token. Can fail when lexer fails.
                        const lCurrentToken: LexerToken<TTokenType> | null = pCursor.currentToken;

                        // Check of node has any branches or is linear.
                        const lNodeValueIsLinear: boolean = lNodeConnections.values.length === 1;

                        const lNodeValue = lNodeConnections.values[lValueIndex];
                        if (typeof lNodeValue === 'string') {
                            // When no current token was found, skip node value parsing.
                            if (!lCurrentToken) {
                                // Append error when node was required.
                                if (lNodeConnections.required) {
                                    // Get current token position.
                                    const lTokenPosition: CodeParserCursorTokenPosition<TTokenType> = pCursor.getTokenPosition();

                                    // Push parser incident as the current token position.
                                    pCursor.trace.push(`Unexpected end of statement. Token "${lNodeValue}" expected.`, pCursor.graph, lTokenPosition.lineStart, lTokenPosition.columnStart, lTokenPosition.lineEnd, lTokenPosition.columnEnd);
                                }

                                // No token was found, try next value.
                                continue MAIN_LOOP;
                            }

                            // Push possible parser error when token type does not match node value.
                            if (lNodeValue !== lCurrentToken.type) {
                                if (lNodeConnections.required) {
                                    // Get current token position.
                                    const lTokenPosition: CodeParserCursorTokenPosition<TTokenType> = pCursor.getTokenPosition();

                                    // Push parser incident as the current token position.
                                    pCursor.trace.push(`Unexpected token "${lCurrentToken.value}". "${lNodeValue}" expected`, pCursor.graph, lTokenPosition.lineStart, lTokenPosition.columnStart, lTokenPosition.lineEnd, lTokenPosition.columnEnd);
                                }

                                // No token was found, try next value.
                                continue MAIN_LOOP;
                            }

                            // Move cursor to next token.
                            pCursor.moveNext();

                            // Dont pop current process.

                            // Set value as result. The next iteration reads it and proceeds to the next state.
                            lProcessStack.push({ type: 'STACK_RETURN', result: lCurrentToken.value });
                        } else {
                            // Push parser process for graph value.
                            lProcessStack.push({ type: 'graph-parse', parameter: { graph: lNodeValue, linear: lNodeValueIsLinear }, state: 0 });
                        }

                        continue MAIN_LOOP;
                    }

                    // State 1: Validate parsed value.
                    if (lCurrentProcess.state === 1) {
                        // Read node value parse result.
                        const lNodeResult: unknown = lCurrentProcess.values.parseResult;

                        // Read node connections.
                        const lNodeConnections: GraphNodeConnections<TTokenType> = lNode.connections;

                        // Empty result when no node value was found and node is optional.
                        if (lNodeResult === null && !lNodeConnections.required) {
                            // Pop itself from stack.
                            lProcessStack.pop();

                            // Set return value to node parse result.
                            lProcessStack.push({ type: 'STACK_RETURN', result: undefined });

                            continue MAIN_LOOP;
                        }

                        // When no result was added, node was required and should fail.
                        if (lNodeResult === null) {
                            // Pop itself from stack.
                            lProcessStack.pop();

                            // Set return value to error.
                            lProcessStack.push({ type: 'STACK_RETURN', result: CodeParserException.PARSER_ERROR });

                            continue MAIN_LOOP;
                        }

                        // Pop itself from stack.
                        lProcessStack.pop();

                        // Set return value to node parse result.
                        lProcessStack.push({ type: 'STACK_RETURN', result: lNodeResult });

                        continue MAIN_LOOP;
                    }

                    throw new Exception(`Invalid node value parse state "${lCurrentProcess.state}".`, this);
                }

                /**
                 * Parse chained node.
                 */
                case 'node-next-parse': {
                    // Read parameters.
                    const lNode: GraphNode<TTokenType> = lCurrentProcess.parameter.node;

                    // State 0: Start node next parse.
                    if (lCurrentProcess.state === 0) {
                        // Read node connections.
                        const lNodeConnections: GraphNodeConnections<TTokenType> = lNode.connections;

                        // Next chained node.
                        const lNextNode: GraphNode<TTokenType, object> | null = lNodeConnections.next;

                        // No result when branch end was meet.
                        if (lNextNode === null) {
                            // Pop itself from stack.
                            lProcessStack.pop();

                            // Set return value to an empty chain result.
                            lProcessStack.push({ type: 'STACK_RETURN', result: {} });

                            continue MAIN_LOOP;
                        }

                        // Proceed to next state.
                        lCurrentProcess.state++;

                        // Start parsing next node.
                        lProcessStack.push({ type: 'node-parse', parameter: { node: lNextNode }, state: 0, values: {} });

                        continue MAIN_LOOP;
                    }

                    // State 1: End node next parse.
                    if (lCurrentProcess.state === 1) {
                        // Read parameters.
                        const lChainResult: object | CodeParserErrorSymbol = lStackResult as (object | CodeParserErrorSymbol);

                        // Exit on node parse error.
                        if (lChainResult === CodeParserException.PARSER_ERROR) {
                            // Pop itself from stack.
                            lProcessStack.pop();

                            // Set return value to error.
                            lProcessStack.push({ type: 'STACK_RETURN', result: CodeParserException.PARSER_ERROR });

                            continue MAIN_LOOP;
                        }

                        // Pop itself from stack.
                        lProcessStack.pop();

                        // Set return value to node parse result.
                        lProcessStack.push({ type: 'STACK_RETURN', result: lChainResult });

                        continue MAIN_LOOP;
                    }

                    throw new Exception(`Invalid node next parse state "${lCurrentProcess.state}".`, this);
                }

                default: {
                    throw new Exception(`Invalid process type "${lCurrentProcess.type}".`, this);
                }
            }
        }

        throw new Exception('Parser process stack reached an unexpected end.', this);
    }
}

/*
 * State control types.
 */

type CodeParserProcessStackMapping<TTokenType extends string> = {

    // Parse graph.
    graphParse: {
        type: 'graph-parse',
        state: number;
        parameter: {
            graph: Graph<TTokenType>;
            linear: boolean;
        },
    };

    // Parse node.
    nodeParse: {
        type: 'node-parse',
        state: number;
        parameter: {
            node: GraphNode<TTokenType>;
        },
        values: {
            nodeValueResult?: unknown;
        };
    };

    // Node value parse.
    nodeValueParse: {
        type: 'node-value-parse',
        state: number;
        parameter: {
            node: GraphNode<TTokenType>;
            valueIndex: number;
        },
        values: {
            parseResult?: unknown | null;
        };
    };

    // Node next parse
    nodeNextParse: {
        type: 'node-next-parse',
        state: number;
        parameter: {
            node: GraphNode<TTokenType>;
        },
    };
};

type CodeParserStackResultItem = {
    type: 'STACK_RETURN';
    result: unknown;
};

type CodeParserProcessStackItem<TTokenType extends string> = CodeParserProcessStackMapping<TTokenType>[keyof CodeParserProcessStackMapping<TTokenType>] | CodeParserStackResultItem;

export type CodeParserProgressTracker = (pPosition: number, pLine: number, pColumn: number) => void;