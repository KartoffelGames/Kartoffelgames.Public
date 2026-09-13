import { Exception } from '@kartoffelgames/core';
import type { LexerToken } from '../lexer/lexer-token.ts';
import { CodeParserTrace } from './code-parser-trace.ts';
import type { GraphNode } from './graph/graph-node.ts';
import type { Graph } from './graph/graph.ts';

export class CodeParserProcessState<TTokenType extends string> {
    private static readonly MAX_JUNCTION_CIRCULAR_REFERENCES: number = 1000;

    private mCurrentGraph: CodeParserCursorGraph<TTokenType>;
    private readonly mGraphFailureCache: Map<Graph<TTokenType>, Set<number>>;
    private readonly mIncidentTrace: CodeParserTrace<TTokenType>;
    private readonly mLastTokenPosition: CodeParserCursorPosition;
    private readonly mTokenCache: Array<LexerToken<TTokenType> | null>;
    private readonly mTokenGenerator: Generator<LexerToken<TTokenType>, any, any>;

    /**
     * Get the current graph the cursor is in.
     * Graph can be null. But in normal cases it should not be null.
     */
    public get currentGraph(): Graph<TTokenType> {
        // Return the graph.
        return this.mCurrentGraph.graph!;
    }

    /**
     * Read the current token from the stream.
     * 
     * @returns The next token if available, otherwise null if the end of the stream is reached.
     */
    public get currentToken(): LexerToken<TTokenType> | null {
        // Read token from cache.
        return this.mTokenCache[this.mCurrentGraph.token.cursor];
    }

    /**
     * Get the trace of parser state.
     */
    public get incidentTrace(): CodeParserTrace<TTokenType> {
        return this.mIncidentTrace;
    }

    /**
     * Constructor.
     * 
     * @param pLexerGenerator - A generator that produces LexerToken objects of the specified token type.
     * @param pKeepTraceIncidents - Keep a complete trace of incidents.
     */
    public constructor(pLexerGenerator: Generator<LexerToken<TTokenType>, any, any>, pKeepTraceIncidents: boolean) {
        this.mTokenGenerator = pLexerGenerator;
        this.mLastTokenPosition = {
            column: 1,
            line: 1
        };
        this.mTokenCache = new Array<LexerToken<TTokenType>>();

        // Create trace objects.
        this.mIncidentTrace = new CodeParserTrace<TTokenType>(pKeepTraceIncidents);
        this.mGraphFailureCache = new Map<Graph<TTokenType>, Set<number>>();

        // Start with a placeholder root graph.
        this.mCurrentGraph = {
            graph: null as any,
            parent: null,
            token: {
                start: 0,
                cursor: -1
            }
        };
    }

    /**
     * Moves the cursor to the end of the token stream and returns all unused token.
     * Irreversible deconstruction of this cursor.
     * 
     * @returns {Array<LexerToken<TTokenType>>} An array of lexer tokens from the current position to the end.
     * 
     * @throws {Exception} Throws an exception if there is a graph on the stack.
     */
    public collapse(): Array<LexerToken<TTokenType>> {
        // Copy all unused token of the current token cache. 
        const lUnusedToken: Array<LexerToken<TTokenType>> = this.mTokenCache.slice(this.mCurrentGraph.token.cursor) as Array<LexerToken<TTokenType>>;

        // When the last token is the "end of token"-marker (null), remove it.
        if (lUnusedToken.length !== 0 && lUnusedToken.at(-1) === null) {
            lUnusedToken.pop();
        }

        // Generate all remaining tokens and cached unused tokens.
        for (const lToken of this.mTokenGenerator) {
            lUnusedToken.push(lToken);
        }

        return lUnusedToken;
    }

    /**
     * Returns the start and end tokens that bound the current graph in the parser.
     * 
     * This method retrieves the first and last tokens associated with the current graph stack.
     * If either the start or end token is not available, it defaults to the other token.
     * If neither is available, both will be null.
     * 
     * @returns A tuple containing the start and end LexerToken objects (or null if not available).
     */
    public getGraphBoundingToken(): [LexerToken<TTokenType> | null, LexerToken<TTokenType> | null] {
        // Get top graph.
        const lCurrentGraphStack: CodeParserCursorGraph<TTokenType> = this.mCurrentGraph;

        // Get start and end token from current graph stack.
        let lStartToken: LexerToken<TTokenType> | null = this.mTokenCache[lCurrentGraphStack.token.start];
        let lEndToken: LexerToken<TTokenType> | null = this.mTokenCache[lCurrentGraphStack.token.cursor - 1];

        // When either of the token is not set, assign the other token.
        lStartToken ??= lEndToken;
        lEndToken ??= lStartToken;

        // Default to last generated token when token was not set.
        return [
            lStartToken ?? null,
            lEndToken ?? null
        ];
    }

    /**
     * Retrieves the current position of the parser cursor within the code graph.
     *
     * This method calculates the start and end positions (line and column) of the current token
     * within the graph stack. If no tokens are available, it defaults to the current cursor position.
     *
     * The returned object contains:
     * - `lineStart`: The starting line number of the token.
     * - `columnStart`: The starting column number of the token.
     * - `lineEnd`: The ending line number of the token.
     * - `columnEnd`: The ending column number of the token.
     * 
     * If there is no current token, the start and end positions will be the same as the last generated token.
     * 
     * @returns - An object representing the start and end positions of the current graph, including line and column numbers.
     */
    public getGraphPosition(): CodeParserProcessCursorPosition<TTokenType> {
        // Get top graph.
        const lCurrentGraphStack: CodeParserCursorGraph<TTokenType> = this.mCurrentGraph;

        // Define start and end token.
        let lStartToken: LexerToken<TTokenType> | null;
        let lEndToken: LexerToken<TTokenType> | null;

        // Get start and end token from current graph stack.
        lStartToken = this.mTokenCache[lCurrentGraphStack.token.start];
        lEndToken = this.mTokenCache[lCurrentGraphStack.token.cursor - 1];

        // When either of the token is not set, assign the other token.
        lStartToken ??= lEndToken;
        lEndToken ??= lStartToken;

        // One of them is not set at this point, none of them is set.
        // So we can return the last token position.
        if (!lStartToken || !lEndToken) {
            return {
                graph: lCurrentGraphStack.graph,
                columnEnd: this.mLastTokenPosition.column,
                columnStart: this.mLastTokenPosition.column,
                lineEnd: this.mLastTokenPosition.line,
                lineStart: this.mLastTokenPosition.line
            };
        }

        let lColumnEnd: number;
        let lLineEnd: number;

        // Extends the end token line end when token contains a newline.
        if (lEndToken.value.includes('\n')) {
            // Split the end token into lines.
            const lTokenLines = lEndToken.value.split('\n');

            lLineEnd = lEndToken.lineNumber + lTokenLines.length - 1;
            lColumnEnd = 1 + lTokenLines[lTokenLines.length - 1]!.length;
        } else {
            lColumnEnd = lEndToken.columnNumber + lEndToken.value.length;
            lLineEnd = lEndToken.lineNumber;
        }

        return {
            graph: lCurrentGraphStack.graph,
            lineStart: lStartToken.lineNumber,
            columnStart: lStartToken.columnNumber,
            lineEnd: lLineEnd,
            columnEnd: lColumnEnd,
        };
    }

    /**
     * Calculates and returns the current token's position within the code.
     * 
     * The returned object contains:
     * - `lineStart`: The starting line number of the token.
     * - `columnStart`: The starting column number of the token.
     * - `lineEnd`: The ending line number of the token.
     * - `columnEnd`: The ending column number of the token.
     * 
     * If there is no current token, the start and end positions will be the same as the last generated token.
     * 
     * @returns - An object representing the start and end positions of the current token, including line and column numbers.
     */
    public getTokenPosition(): CodeParserProcessCursorPosition<TTokenType> {
        // Calculate token position.
        const lPositionToken: LexerToken<TTokenType> | null = this.currentToken;

        // No start token means there is also no endtoken.
        if (!lPositionToken) {
            return {
                graph: this.mCurrentGraph.graph,
                columnEnd: this.mLastTokenPosition.column,
                columnStart: this.mLastTokenPosition.column,
                lineEnd: this.mLastTokenPosition.line,
                lineStart: this.mLastTokenPosition.line
            };
        }

        let lColumnEnd: number;
        let lLineEnd: number;

        // Extends the end token line end when token contains a newline.
        if (lPositionToken.value.includes('\n')) {
            // Split the end token into lines.
            const lTokenLines = lPositionToken.value.split('\n');

            lLineEnd = lPositionToken.lineNumber + lTokenLines.length - 1;
            lColumnEnd = 1 + lTokenLines[lTokenLines.length - 1]!.length;
        } else {
            lColumnEnd = lPositionToken.columnNumber + lPositionToken.value.length;
            lLineEnd = lPositionToken.lineNumber;
        }

        return {
            graph: this.mCurrentGraph.graph,
            lineStart: lPositionToken.lineNumber,
            columnStart: lPositionToken.columnNumber,
            lineEnd: lLineEnd,
            columnEnd: lColumnEnd,
        };
    }

    /**
     * Checks if the given graph would be called circular.
     *
     * @param pGraph - The graph node to check for circularity.
     * @returns `true` if the graph is circular, otherwise `false`.
     */
    public graphIsCircular(pGraph: Graph<TTokenType>): boolean {
        let lGraphCallCount: number = 0;

        // Count the same graph in the stack iteratively. But only when they share the same start token. 
        let lCurrentGraphStack: CodeParserCursorGraph<TTokenType> | null = this.mCurrentGraph;
        while (lCurrentGraphStack !== null && lCurrentGraphStack.token.cursor === lCurrentGraphStack.token.start) {
            if (lCurrentGraphStack.graph === pGraph) {
                lGraphCallCount++;
            }

            lCurrentGraphStack = lCurrentGraphStack.parent;
        }

        // No graph circular.
        if (lGraphCallCount === 0) {
            return false;
        }

        // When the graph is a junction, we allow circular call, but prevent absurde call counts.
        if (pGraph.isJunction) {
            // When a junction graph is called too often, we consider it critical circular and throw an error.
            if (lGraphCallCount > CodeParserProcessState.MAX_JUNCTION_CIRCULAR_REFERENCES) {
                throw new Exception(`Junction graph called circular too often.`, this);
            }

            return false;
        }

        // Graph is circular.
        return true;
    }

    /**
     * Checks if the graph has ever failed on the same token.
     *
     * @param pGraph - The graph node to check for the current token.
     *
     * @returns `true` when the graph has already failed on the current token, otherwise `false`.
     */
    public isKnownGraphFailure(pGraph: Graph<TTokenType>): boolean {
        // Read every token the graph has failed on.
        const lFailedTokenIndices: Set<number> | undefined = this.mGraphFailureCache.get(pGraph);
        if (!lFailedTokenIndices) {
            return false;
        }

        // A graph is always entered on the cursor of its parent graph.
        return lFailedTokenIndices.has(this.mCurrentGraph.token.cursor);
    }

    /**
     * Advances the cursor to the next token in the current graph stack.
     */
    public moveNextToken(): void {
        // Get top graph.
        const lCurrentGraphStack: CodeParserCursorGraph<TTokenType> = this.mCurrentGraph;

        // Restrict junction graphs from processing own tokens.
        // Otherwise these graphs are not junctions.
        if (lCurrentGraphStack.graph && lCurrentGraphStack.graph.isJunction) {
            throw new Exception('Junction graph must not have own nodes.', this);
        }

        lCurrentGraphStack.token.cursor++;

        // Skip generation when token is already generated.
        if (lCurrentGraphStack.token.cursor < this.mTokenCache.length) {
            return;
        }

        // Read token from generator.
        const lToken: IteratorResult<LexerToken<TTokenType>, any> = this.mTokenGenerator.next();
        if (lToken.done) {
            this.mTokenCache.push(null);
            return;
        }

        // Update cursor position on any new generated token.
        this.mLastTokenPosition.column = lToken.value.columnNumber;
        this.mLastTokenPosition.line = lToken.value.lineNumber;

        // Store token in cache.
        this.mTokenCache.push(lToken.value);
    }

    /**
     * Pops the current graph from the graph stack and updates the parent graph stack accordingly.
     * 
     * @param pFailed - A boolean indicating whether the current graph failed with an error.
     */
    public popGraphStack(pFailed: boolean): void {
        // Set parent graph as current. (pop stack).
        const lCurrentTokenStack: CodeParserCursorGraph<TTokenType> = this.mCurrentGraph;
        this.mCurrentGraph =  lCurrentTokenStack.parent!;

        // Revert current stack index when the graph failed with an error.
        if (pFailed) {
            lCurrentTokenStack.token.cursor = lCurrentTokenStack.token.start;

            // Create a new token index list for any graph that has not failed yet.
            if (!this.mGraphFailureCache!.has(lCurrentTokenStack.graph!)) {
                this.mGraphFailureCache!.set(lCurrentTokenStack.graph!, new Set<number>());
            }

            // Save index of the failed token.
            this.mGraphFailureCache!.get(lCurrentTokenStack.graph!)!.add(lCurrentTokenStack.token.start);
        }

        // Move parent stack index to the last graphs stack index.
        this.mCurrentGraph.token.cursor = lCurrentTokenStack.token.cursor;
    }

    /**
     * Pushes a new graph onto the graph stack and manages the token stack.
     * 
     * @param pGraph - The graph to be pushed onto the stack.
     *
     * @template TGraph - The type of the graph.
     */
    public pushGraphStack<TGraph extends Graph<TTokenType>>(pGraph: TGraph): void {
        // Read the current stack state.
        const lLastGraphStack: CodeParserCursorGraph<TTokenType> = this.mCurrentGraph;

        // Create new empty graph stack by linking its parent.
        this.mCurrentGraph = {
            graph: pGraph,
            parent: lLastGraphStack,
            token: {
                start: lLastGraphStack.token.cursor,
                cursor: lLastGraphStack.token.cursor
            }
        };
    }
}

/*
 * Graph stack types.
 */
type CodeParserCursorGraph<TTokenType extends string> = {
    graph: Graph<TTokenType> | null;
    parent: CodeParserCursorGraph<TTokenType> | null;
    token: {
        start: number;
        cursor: number;
    };
};

/*
 * Cursor types.
 */
type CodeParserCursorPosition = {
    column: number;
    line: number;
};

export type CodeParserProcessCursorPosition<TTokenType extends string> = {
    graph: Graph<TTokenType> | null;
    columnEnd: number;
    columnStart: number;
    lineEnd: number;
    lineStart: number;
};

/**
 * Process stack types.
 */
type CodeParserProcessStackMapping<TTokenType extends string> = {
    // Parse graph.
    graphParse: {
        type: 'graphParse',
        parameter: {
            graph: Graph<TTokenType>;
        };
    };

    // Parse node.
    nodeParse: {
        type: 'nodeParse',
        parameter: {
            node: GraphNode<TTokenType>;
        };
    };

    // Node value parse.
    nodeValueParse: {
        type: 'nodeValueParse',
        parameter: {
            node: GraphNode<TTokenType>;
        };
    };

    // Node next parse
    nodeNextParse: {
        type: 'nodeNextParse',
        parameter: {
            node: GraphNode<TTokenType>;
        };
    };
};

export type CodeParserProcessStackItem<TTokenType extends string> = CodeParserProcessStackMapping<TTokenType>[keyof CodeParserProcessStackMapping<TTokenType>];