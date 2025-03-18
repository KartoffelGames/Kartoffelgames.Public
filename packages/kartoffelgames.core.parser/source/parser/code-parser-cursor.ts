import { Dictionary, Stack } from '@kartoffelgames/core';
import { CodeParserException } from "../exception/code-parser-exception.ts";
import { Graph } from "../graph/graph.ts";
import type { LexerToken } from '../lexer/lexer-token.ts';

export class CodeParserCursor<TTokenType extends string> {
    private static readonly MAX_CIRULAR_REFERENCES: number = 1;

    private readonly mGraphStack: Stack<CodeParserCursorGraph<TTokenType>>;
    private readonly mGenerator: Generator<LexerToken<TTokenType>, any, any>;
    private readonly mDebug: boolean;

    /**
     * Read the current token from the stream.
     * 
     * @returns The next token if available, otherwise null if the end of the stream is reached.
     */
    public get current(): LexerToken<TTokenType> | null {
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

            // Store token in cache.
            lCurrentGraphStack.token.cache.push(lToken.value);
        }

        // Read token from cache.
        return lCurrentGraphStack.token.cache[lCurrentGraphStack.token.index];
    }

    /**
     * Get current graphs error bucket.
     */
    public get error(): CodeParserException<TTokenType> {
        return this.mGraphStack.top!.errorBucket;
    }

    /**
     * Constructor.
     * 
     * @param pLexerGenerator - A generator that produces LexerToken objects of the specified token type.
     */
    public constructor(pLexerGenerator: Generator<LexerToken<TTokenType>, any, any>, pDebug: boolean) {
        this.mGenerator = pLexerGenerator;
        this.mGraphStack = new Stack<CodeParserCursorGraph<TTokenType>>();
        this.mDebug = pDebug;

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
            errorBucket: new CodeParserException<TTokenType>(this.mDebug)
        });
    }

    /**
     * Add incident to the current cursor.
     * 
     * @param pError - The error to add to the current graph stack.
     */
    public addIncident(pError: Error, pSingleToken: boolean): void {
        const lCurrentGraphStack: CodeParserCursorGraph<TTokenType> = this.mGraphStack.top!;

        // Read current token.
        const lGraphEndToken: LexerToken<TTokenType> = lCurrentGraphStack.token.cache[lCurrentGraphStack.token.index];

        // Read graph start token.
        const lGraphStartToken: LexerToken<TTokenType> = pSingleToken ? lGraphEndToken : lCurrentGraphStack.token.cache[0];

        console.log(lGraphStartToken, lGraphEndToken, lCurrentGraphStack.token.cache.length)

        this.mGraphStack.top!.errorBucket.push(pError, lCurrentGraphStack.graph, lGraphStartToken, lGraphEndToken);
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
        return lCurrentGraphStack.circularGraphs.get(pGraph)! > CodeParserCursor.MAX_CIRULAR_REFERENCES;
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
     * Pushes a new graph onto the graph stack, executes a callback function with the graph, and manages the token stack.
     * 
     * @param pStackCall - The callback function to be executed with the graph.
     * @param pGraph - The graph to be pushed onto the stack.
     * @param pLinear - A boolean indicating whether the graph is linear and not part of branch.
     * @returns An object containing the result of the callback function and the range of tokens used.
     * 
     * @template TGraph - The type of the graph.
     * @template TResult - The type of the result returned by the callback function.
     * 
     * @throws Will rethrow any error encountered during the execution of the callback function.
     */
    public pushGraph<TGraph extends Graph<TTokenType>, TResult>(pStackCall: CoderParserCursorStackCallback<TTokenType, TGraph, TResult>, pGraph: TGraph, pLinear: boolean): TResult {
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
            isRoot: false,
            errorBucket: new CodeParserException<TTokenType>(this.mDebug)
        };

        // Add itself to the circular graph list.
        const lCurrentGraphCirularCount: number = lNewTokenStack.circularGraphs.get(pGraph) ?? 0;
        lNewTokenStack.circularGraphs.set(pGraph, lCurrentGraphCirularCount + 1);

        // Push the new graph stack on the stack.
        this.mGraphStack.push(lNewTokenStack);

        // Call pushed graph.
        try {
            return pStackCall(pGraph);
        } catch (lError) {
            // Revert current stack index.
            lNewTokenStack.token.index = 0;

            // Rethrow error.
            throw lError;
        } finally {
            // Pop graph.
            this.mGraphStack.pop()!;

            // When the current graph has progressed any token, event deep circular graphs process a new token and eventually reach the end token.
            if (lNewTokenStack.token.index !== 0 && lLastGraphStack.circularGraphs.size > 0) {
                lLastGraphStack.circularGraphs = new Dictionary<Graph<TTokenType>, number>();
            }

            // Truncate parent graphs token cache to the current token.
            // So the token memory gets marked as disposeable.
            if (lNewTokenStack.linear) {
                // Reset parent index to zero.
                lLastGraphStack.token.cache = lNewTokenStack.token.cache.slice(lNewTokenStack.token.index);
                lLastGraphStack.token.index = 0;
            } else {
                // Read only the new tokens that are added to the stack and are not present in the parent stack.
                const lNewTokenStackCache: Array<LexerToken<TTokenType>> = lNewTokenStack.token.cache.slice(lLastGraphStack.token.cache.length - lLastGraphStack.token.index);

                // Move parent stack index to the last graphs stack index.
                lLastGraphStack.token.index += lNewTokenStack.token.index;

                // Add the new tokens to the parent stack.
                lLastGraphStack.token.cache.splice(lLastGraphStack.token.cache.length, 0, ...lNewTokenStackCache);
            }

            // Add error to the parent error bucket.
            lLastGraphStack.errorBucket.integrate(lNewTokenStack.errorBucket);
        }
    }
}

type CoderParserCursorStackCallback<TTokenType extends string, TGraph extends Graph<TTokenType>, TResult> = (pGraph: TGraph) => TResult;

type CodeParserCursorGraph<TTokenType extends string> = {
    graph: Graph<TTokenType>;
    linear: boolean;
    circularGraphs: Dictionary<Graph<TTokenType>, number>;
    token: {
        cache: Array<LexerToken<TTokenType>>,
        index: number;
    };
    isRoot: boolean;
    errorBucket: CodeParserException<TTokenType>;
};