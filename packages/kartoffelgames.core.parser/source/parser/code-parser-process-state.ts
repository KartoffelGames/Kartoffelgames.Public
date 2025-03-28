import { Dictionary, Stack } from '@kartoffelgames/core';
import type { LexerToken } from '../lexer/lexer-token.ts';
import { CodeParserTrace } from './code-parser-trace.ts';
import type { GraphNode } from './graph/graph-node.ts';
import type { Graph } from './graph/graph.ts';

export class CodeParserProcessState<TTokenType extends string> {
    private static readonly MAX_CIRULAR_REFERENCES: number = 1;

    private readonly mTokenGenerator: Generator<LexerToken<TTokenType>, any, any>;
    private readonly mGraphStack: Stack<CodeParserCursorGraph<TTokenType>>;
    private readonly mIncidentTrace: CodeParserTrace<TTokenType>;
    private readonly mLastTokenPosition: CodeParserCursorPosition;
    private readonly mProcessStack: Stack<CodeParserProcessStackItem<TTokenType>>;
    private readonly mTokenCache: Array<LexerToken<TTokenType> | null>;

    /**
     * Get the current graph the cursor is in.
     * Graph can be null. But in normal cases it should not be null.
     */
    public get currentGraph(): Graph<TTokenType> {
        // Get top graph.
        const lCurrentGraphStack: CodeParserCursorGraph<TTokenType> = this.mGraphStack.top!;

        // Return the graph.
        return lCurrentGraphStack.graph!;
    }

    /**
     * Read the current token from the stream.
     * 
     * @returns The next token if available, otherwise null if the end of the stream is reached.
     */
    public get currentToken(): LexerToken<TTokenType> | null {
        // Get top graph.
        const lCurrentGraphStack: CodeParserCursorGraph<TTokenType> = this.mGraphStack.top!;

        // Read token from cache.
        return this.mTokenCache[lCurrentGraphStack.token.cursor];
    }

    /**
     * Get the trace of parser state.
     */
    public get incidentTrace(): CodeParserTrace<TTokenType> {
        return this.mIncidentTrace;
    }

    /**
     * Gets the current process stack of the code parser.
     * 
     * The process stack contains items of type `CodeParserProcessStackItem<TTokenType>`,
     * which represent the current state of the parsing process.
     */
    public get processStack(): Stack<CodeParserProcessStackItem<TTokenType>> {
        return this.mProcessStack;
    }

    /**
     * Constructor.
     * 
     * @param pLexerGenerator - A generator that produces LexerToken objects of the specified token type.
     */
    public constructor(pLexerGenerator: Generator<LexerToken<TTokenType>, any, any>, pDebug: boolean) {
        this.mTokenGenerator = pLexerGenerator;
        this.mGraphStack = new Stack<CodeParserCursorGraph<TTokenType>>();
        this.mLastTokenPosition = {
            column: 1,
            line: 1
        };
        this.mTokenCache = new Array<LexerToken<TTokenType>>();
        this.mProcessStack = new Stack<CodeParserProcessStackItem<TTokenType>>();

        // Create trace.
        this.mIncidentTrace = new CodeParserTrace<TTokenType>(pDebug);

        // Push a placeholder root graph on the stack.
        this.mGraphStack.push({
            graph: null as any,
            linear: true,
            circularGraphs: new Dictionary<Graph<TTokenType>, number>(),
            token: {
                start: 0,
                cursor: -1
            }
        });
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
        const lCurrentGraphStack: CodeParserCursorGraph<TTokenType> = this.mGraphStack.top!;

        // Copy all unused token of the current token cache. 
        let lUnusedToken: Array<LexerToken<TTokenType>> = this.mTokenCache.slice(lCurrentGraphStack.token.cursor) as Array<LexerToken<TTokenType>>;
        if (lUnusedToken[lUnusedToken.length - 1] === null) {
            lUnusedToken = new Array<LexerToken<TTokenType>>();
        }

        // Generate all remaining tokens and cached unused tokens.
        for (const lToken of this.mTokenGenerator) {
            lUnusedToken.push(lToken);
        }

        return lUnusedToken;
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
        const lCurrentGraphStack: CodeParserCursorGraph<TTokenType> = this.mGraphStack.top!;

        // Define start and end token.
        let lStartToken: LexerToken<TTokenType> | null;
        let lEndToken: LexerToken<TTokenType> | null;

        // Get start and end token from current graph stack.
        lStartToken = this.mTokenCache[lCurrentGraphStack.token.start];
        lEndToken = this.mTokenCache[lCurrentGraphStack.token.cursor - 1];

        // Default to last generated token when token was not set.
        lStartToken = lStartToken ?? lEndToken;
        lEndToken = lEndToken ?? lStartToken;

        // No start token means there is also no endtoken.
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
        // Get top graph.
        const lCurrentGraphStack: CodeParserCursorGraph<TTokenType> = this.mGraphStack.top!;

        // Calculate token position.
        const lPositionToken: LexerToken<TTokenType> | null = this.currentToken;

        // No start token means there is also no endtoken.
        if (!lPositionToken) {
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
        if (lPositionToken.value.includes('\n')) {
            // Split the end token into lines.
            const lTokenLines = lPositionToken.value.split('\n');

            lLineEnd = lPositionToken.lineNumber + lTokenLines.length - 1;
            lColumnEnd = 1 + lTokenLines[lTokenLines.length - 1]!.length;
        } else {
            lColumnEnd = lPositionToken.columnNumber + lPositionToken.value.length;;
            lLineEnd = lPositionToken.lineNumber;
        }

        return {
            graph: lCurrentGraphStack.graph,
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
        // Get top graph.
        const lCurrentGraphStack: CodeParserCursorGraph<TTokenType> = this.mGraphStack.top!;

        // Check if the graph is circular.
        if (!lCurrentGraphStack.circularGraphs.has(pGraph)) {
            return false;
        }

        // Graph is circular if the graph is visited more than once.
        return lCurrentGraphStack.circularGraphs.get(pGraph)! > CodeParserProcessState.MAX_CIRULAR_REFERENCES;
    }

    /**
     * Advances the cursor to the next token in the current graph stack.
     */
    public moveNextToken(): void {
        // Get top graph.
        const lCurrentGraphStack: CodeParserCursorGraph<TTokenType> = this.mGraphStack.top!;

        // When the current graph has progressed, even deep circular graphs process a new token and eventually reach the end token.
        if (lCurrentGraphStack.circularGraphs.size > 0) {
            lCurrentGraphStack.circularGraphs = new Dictionary<Graph<TTokenType>, number>();
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
        // Pop graph.
        const lCurrentTokenStack: CodeParserCursorGraph<TTokenType> = this.mGraphStack.pop()!;
        const lParentGraphStack: CodeParserCursorGraph<TTokenType> = this.mGraphStack.top!;

        // Revert current stack index when the graph failed with an error.
        if (pFailed) {
            lCurrentTokenStack.token.cursor = lCurrentTokenStack.token.start;
        }

        // When the current graph has progressed any token, event deep circular graphs process a new token and eventually reach the end token.
        if (lCurrentTokenStack.token.cursor !== lCurrentTokenStack.token.start && lParentGraphStack.circularGraphs.size > 0) {
            lParentGraphStack.circularGraphs = new Dictionary<Graph<TTokenType>, number>();
        }

        // Truncate parent graphs token cache to the current token.
        // So the token memory gets cleared from memory.
        if (lCurrentTokenStack.linear) {
            // Reset parent index to zero.
            this.mTokenCache.splice(0, lCurrentTokenStack.token.cursor);
            lParentGraphStack.token.start = 0;
            lParentGraphStack.token.cursor = 0;
        } else {
            // Move parent stack index to the last graphs stack index.
            lParentGraphStack.token.cursor = lCurrentTokenStack.token.cursor;
        }
    }

    /**
     * Pushes a new graph onto the graph stack and manages the token stack.
     * 
     * @param pGraph - The graph to be pushed onto the stack.
     * @param pLinear - A boolean indicating whether the graph is linear and not part of branch.
     * 
     * @template TGraph - The type of the graph.
     */
    public pushGraphStack<TGraph extends Graph<TTokenType>>(pGraph: TGraph, pLinear: boolean): void {
        // Read the current stack state.
        const lLastGraphStack: CodeParserCursorGraph<TTokenType> | undefined = this.mGraphStack.top!;

        // Create a new empty graph stack.
        const lNewGraphStack: CodeParserCursorGraph<TTokenType> = {
            graph: pGraph,
            linear: pLinear && lLastGraphStack.linear, // If a parent graph is not linear, the child graph is not linear.
            circularGraphs: new Dictionary<Graph<TTokenType>, number>(lLastGraphStack.circularGraphs),
            token: {
                start: lLastGraphStack.token.cursor,
                cursor: lLastGraphStack.token.cursor
            }
        };

        // Add itself to the circular graph list.
        const lCurrentGraphCirularCount: number = lNewGraphStack.circularGraphs.get(pGraph) ?? 0;
        lNewGraphStack.circularGraphs.set(pGraph, lCurrentGraphCirularCount + 1);

        // Push the new graph stack on the stack.
        this.mGraphStack.push(lNewGraphStack);
    }
}

/*
 * Graph stack types.
 */
type CodeParserCursorGraph<TTokenType extends string> = {
    graph: Graph<TTokenType> | null;
    linear: boolean;
    circularGraphs: Dictionary<Graph<TTokenType>, number>;
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
export type CodeParserProcessStackMapping<TTokenType extends string> = {
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

export type CodeParserProcessStackItem<TTokenType extends string> = CodeParserProcessStackMapping<TTokenType>[keyof CodeParserProcessStackMapping<TTokenType>];