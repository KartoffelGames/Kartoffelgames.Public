import { Dictionary, Stack } from '@kartoffelgames/core';
import type { LexerToken } from '../lexer/lexer-token.ts';
import { CodeParserException, type CodeParserErrorSymbol } from './code-parser-exception.ts';
import { CodeParserTrace } from './code-parser-trace.ts';
import type { Graph } from './graph/graph.ts';

export class CodeParserState<TTokenType extends string> {
    private static readonly MAX_CIRULAR_REFERENCES: number = 1;

    private readonly mGenerator: Generator<LexerToken<TTokenType>, any, any>;
    private readonly mGraphStack: Stack<CodeParserCursorGraph<TTokenType>>;
    private readonly mPosition: CodeParserCursorPosition;
    private readonly mTrace: CodeParserTrace<TTokenType>;

    /**
     * Read the current token from the stream.
     * 
     * @returns The next token if available, otherwise null if the end of the stream is reached.
     */
    public get currentToken(): LexerToken<TTokenType> | null {
        // Get top graph.
        const lCurrentGraphStack: CodeParserCursorGraph<TTokenType> = this.mGraphStack.top!;

        // Performance reasons: Dont start a iterator when we dont need to.
        if (lCurrentGraphStack.token.index < lCurrentGraphStack.token.cache.length) {
            // Read token from cache.
            return lCurrentGraphStack.token.cache[lCurrentGraphStack.token.index];
        }

        // Fill up cache until the current index is reached.
        for (let lCacheLength = lCurrentGraphStack.token.cache.length; lCacheLength <= lCurrentGraphStack.token.index; lCacheLength++) {
            // Read token from generator.
            const lToken: IteratorResult<LexerToken<TTokenType>, any> = this.mGenerator.next();
            if (lToken.done) {
                return null;
            }

            // Update cursor position on any new generated token.
            this.mPosition.column = lToken.value.columnNumber;
            this.mPosition.line = lToken.value.lineNumber;

            // Store token in cache.
            lCurrentGraphStack.token.cache.push(lToken.value);
        }

        // Read token from cache.
        return lCurrentGraphStack.token.cache[lCurrentGraphStack.token.index];
    }

    /**
     * Get the current graph the cursor is in.
     * Graph can be null. But in normal cases it should not be null.
     */
    public get graph(): Graph<TTokenType> {
        // Get top graph.
        const lCurrentGraphStack: CodeParserCursorGraph<TTokenType> = this.mGraphStack.top!;

        // Return the graph.
        return lCurrentGraphStack.graph!;
    }

    /**
     * Get the trace of parser state.
     */
    public get trace(): CodeParserTrace<TTokenType> {
        return this.mTrace;
    }

    /**
     * Constructor.
     * 
     * @param pLexerGenerator - A generator that produces LexerToken objects of the specified token type.
     */
    public constructor(pLexerGenerator: Generator<LexerToken<TTokenType>, any, any>, pDebug: boolean) {
        this.mGenerator = pLexerGenerator;
        this.mGraphStack = new Stack<CodeParserCursorGraph<TTokenType>>();
        this.mPosition = {
            column: 1,
            line: 1
        };

        // Create trace.
        this.mTrace = new CodeParserTrace<TTokenType>(pDebug);

        // Push a placeholder root graph on the stack.
        this.mGraphStack.push({
            graph: null as any,
            linear: true,
            circularGraphs: new Dictionary<Graph<TTokenType>, number>(),
            token: {
                cache: [],
                index: 0
            },
            isRoot: true,
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

        // Generate all remaining tokens and cached unused tokens.
        const lUngeneratedToken: Array<LexerToken<TTokenType>> = [...this.mGenerator];
        const lUnusedToken: Array<LexerToken<TTokenType>> = lCurrentGraphStack.token.cache.slice(lCurrentGraphStack.token.index);

        return [...lUnusedToken, ...lUngeneratedToken];
    }

    /**
     * Retrieves the current position of the parser cursor within the code graph.
     *
     * This method calculates the start and end positions (line and column) of the current token
     * within the graph stack. If no tokens are available, it defaults to the current cursor position.
     * 
     * @returns - An object representing the start and end positions of the current graph, including line and column numbers.
     *
     * The returned object contains:
     * - `lineStart`: The starting line number of the token.
     * - `columnStart`: The starting column number of the token.
     * - `lineEnd`: The ending line number of the token.
     * - `columnEnd`: The ending column number of the token.
     * 
     * If there is no current token, the start and end positions will be the same as the current cursor position.
     */
    public getGraphPosition(): CodeParserCursorGraphPosition<TTokenType> {
        // Get top graph.
        const lCurrentGraphStack: CodeParserCursorGraph<TTokenType> = this.mGraphStack.top!;

        // Define start and end token.
        let lStartToken: LexerToken<TTokenType>;
        let lEndToken: LexerToken<TTokenType>;

        // Get start and end token from current graph stack.
        lStartToken = lCurrentGraphStack.token.cache[0];
        lEndToken = lCurrentGraphStack.token.cache[lCurrentGraphStack.token.index - 1];

        // Default to last generated token when token was not set.
        lStartToken = lStartToken ?? lEndToken;
        lEndToken = lEndToken ?? lStartToken;

        // No start token means there is also no endtoken.
        if (!lStartToken || !lEndToken) {
            return {
                graph: lCurrentGraphStack.graph,
                columnEnd: this.mPosition.column,
                columnStart: this.mPosition.column,
                lineEnd: this.mPosition.line,
                lineStart: this.mPosition.line
            };
        }

        // Split the end token into lines.
        const lEndTokenLines = lEndToken.value.split('\n');

        // Extends the end token line end.
        const lLineEnd: number = lEndToken.lineNumber + lEndTokenLines.length - 1;

        // Set column end based on, if the token is multiline or not.
        let lColumnEnd: number = (lEndTokenLines.length > 1) ? 1 : lEndToken.columnNumber;
        lColumnEnd += lEndTokenLines.at(-1)!.length;

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
     * @returns - An object representing the start and end positions of the current token, including line and column numbers.
     * 
     * The returned object contains:
     * - `lineStart`: The starting line number of the token.
     * - `columnStart`: The starting column number of the token.
     * - `lineEnd`: The ending line number of the token.
     * - `columnEnd`: The ending column number of the token.
     * 
     * If there is no current token, the start and end positions will be the same as the current cursor position.
     */
    public getTokenPosition(): CodeParserCursorTokenPosition<TTokenType> {
        // Get top graph.
        const lCurrentGraphStack: CodeParserCursorGraph<TTokenType> = this.mGraphStack.top!;

        // Calculate token position.
        const lPositionToken: LexerToken<TTokenType> | null = this.currentToken;

        // No start token means there is also no endtoken.
        if (!lPositionToken) {
            return {
                graph: lCurrentGraphStack.graph,
                columnEnd: this.mPosition.column,
                columnStart: this.mPosition.column,
                lineEnd: this.mPosition.line,
                lineStart: this.mPosition.line
            };
        }

        // Split the end token into lines.
        const lTokenLines = lPositionToken.value.split('\n');

        // Extends the end token line end.
        const lLineEnd: number = lPositionToken.lineNumber + lTokenLines.length - 1;

        // Set column end based on, if the token is multiline or not.
        let lColumnEnd: number = (lTokenLines.length > 1) ? 1 : lPositionToken.columnNumber;
        lColumnEnd += lTokenLines.at(-1)!.length;

        return {
            graph: lCurrentGraphStack.graph,
            lineStart: lPositionToken.lineNumber,
            columnStart: lPositionToken.columnNumber,
            lineEnd: lLineEnd,
            columnEnd: lColumnEnd,
        };
    }

    /**
     * Checks if the given graph is circular.
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
        return lCurrentGraphStack.circularGraphs.get(pGraph)! > CodeParserState.MAX_CIRULAR_REFERENCES;
    }

    /**
     * Advances the cursor to the next token in the current graph stack.
     * 
     * @throws {Exception} If there is no graph on the stack.
     */
    public moveNext(): void {
        // Get top graph.
        const lCurrentGraphStack: CodeParserCursorGraph<TTokenType> = this.mGraphStack.top!;

        // When the current graph has progressed, even deep circular graphs process a new token and eventually reach the end token.
        if (lCurrentGraphStack.circularGraphs.size > 0) {
            lCurrentGraphStack.circularGraphs = new Dictionary<Graph<TTokenType>, number>();
        }

        lCurrentGraphStack.token.index++;
    }

    /**
     * Pushes a new graph onto the graph stack and manages the token stack.
     * 
     * @param pGraph - The graph to be pushed onto the stack.
     * @param pLinear - A boolean indicating whether the graph is linear and not part of branch.
     * 
     * @template TGraph - The type of the graph.
     */
    public pushGraph<TGraph extends Graph<TTokenType>>(pGraph: TGraph, pLinear: boolean): void {
        // Read the current stack state.
        const lLastGraphStack: CodeParserCursorGraph<TTokenType> | undefined = this.mGraphStack.top!;

        // Copy the current token stack from parent from its current token stack index index.
        const lTokenStack: Array<LexerToken<TTokenType>> = lLastGraphStack.token.cache.slice(lLastGraphStack.token.index);

        // Create a new empty graph stack.
        const lNewTokenStack: CodeParserCursorGraph<TTokenType> = {
            graph: pGraph,
            linear: pLinear && lLastGraphStack.linear, // If a parent graph is not linear, the child graph is not linear.
            circularGraphs: new Dictionary<Graph<TTokenType>, number>(lLastGraphStack.circularGraphs),
            token: {
                cache: lTokenStack,
                index: 0
            },
            isRoot: false
        };

        // Add itself to the circular graph list.
        const lCurrentGraphCirularCount: number = lNewTokenStack.circularGraphs.get(pGraph) ?? 0;
        lNewTokenStack.circularGraphs.set(pGraph, lCurrentGraphCirularCount + 1);

        // Push the new graph stack on the stack.
        this.mGraphStack.push(lNewTokenStack);
    }

    /**
     * Pops the current graph from the graph stack and updates the parent graph stack accordingly.
     * 
     * @param pFailed - A boolean indicating whether the current graph failed with an error.
     */
    public popGraph(pFailed: boolean): void {
        // Pop graph.
        const lCurrentTokenStack: CodeParserCursorGraph<TTokenType> = this.mGraphStack.pop()!;
        const lParentGraphStack: CodeParserCursorGraph<TTokenType> = this.mGraphStack.top!;

        // Revert current stack index when the graph failed with an error.
        if (pFailed) {
            lCurrentTokenStack.token.index = 0;
        }

        // When the current graph has progressed any token, event deep circular graphs process a new token and eventually reach the end token.
        if (lCurrentTokenStack.token.index !== 0 && lParentGraphStack.circularGraphs.size > 0) {
            lParentGraphStack.circularGraphs = new Dictionary<Graph<TTokenType>, number>();
        }

        // Truncate parent graphs token cache to the current token.
        // So the token memory gets marked as disposeable.
        if (lCurrentTokenStack.linear) {
            // Reset parent index to zero.
            lParentGraphStack.token.cache = lCurrentTokenStack.token.cache.slice(lCurrentTokenStack.token.index);
            lParentGraphStack.token.index = 0;
        } else {
            // Read only the new tokens that are added to the stack and are not present in the parent stack.
            const lNewTokenStackCache: Array<LexerToken<TTokenType>> = lCurrentTokenStack.token.cache.slice(lParentGraphStack.token.cache.length - lParentGraphStack.token.index);

            // Move parent stack index to the last graphs stack index.
            lParentGraphStack.token.index += lCurrentTokenStack.token.index;

            // Add the new tokens to the parent stack.
            lParentGraphStack.token.cache.splice(lParentGraphStack.token.cache.length, 0, ...lNewTokenStackCache);
        }
    }
}

type CoderParserCursorStackCallback<TTokenType extends string, TGraph extends Graph<TTokenType>, TResult> = (pGraph: TGraph) => TResult;

type CodeParserCursorGraph<TTokenType extends string> = {
    graph: Graph<TTokenType> | null;
    linear: boolean;
    circularGraphs: Dictionary<Graph<TTokenType>, number>;
    token: {
        cache: Array<LexerToken<TTokenType>>,
        index: number;
    };
    isRoot: boolean;
};

type CodeParserCursorPosition = {
    column: number;
    line: number;
};

export type CodeParserCursorTokenPosition<TTokenType extends string> = {
    graph: Graph<TTokenType> | null;
    columnEnd: number;
    columnStart: number;
    lineEnd: number;
    lineStart: number;
};
export type CodeParserCursorGraphPosition<TTokenType extends string> = {
    graph: Graph<TTokenType> | null;
    columnEnd: number;
    columnStart: number;
    lineEnd: number;
    lineStart: number;
};
