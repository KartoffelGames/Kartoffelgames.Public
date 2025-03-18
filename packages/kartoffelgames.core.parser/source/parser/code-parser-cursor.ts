import { Dictionary, Stack } from '@kartoffelgames/core';
import type { GraphNode } from '../graph/graph-node.ts';
import type { LexerToken } from '../lexer/lexer-token.ts';

export class CodeParserCursor<TTokenType extends string> {
    private static readonly MAX_CIRULAR_REFERENCES: number = 1;

    private readonly mBranchStack: Stack<CodeParserCursorGraphBranch<TTokenType>>;
    private readonly mGenerator: Generator<LexerToken<TTokenType>, any, any>;


    /**
     * Constructor.
     * 
     * @param pLexerGenerator - A generator that produces LexerToken objects of the specified token type.
     */
    public constructor(pLexerGenerator: Generator<LexerToken<TTokenType>, any, any>) {
        this.mGenerator = pLexerGenerator;
        this.mBranchStack = new Stack<CodeParserCursorGraphBranch<TTokenType>>();

        // Push a placeholder root branch on the stack.
        this.mBranchStack.push({
            branch: null as any,
            linear: true,
            circularBranches: new Dictionary<GraphNode<TTokenType>, number>(),
            token: {
                cache: [],
                index: 0
            },
            isRoot: true
        });
    }

    /**
     * Moves the cursor to the end of the token stream and returns all unused token.
     * Irreversible deconstruction of this cursor.
     * 
     * @returns {Array<LexerToken<TTokenType>>} An array of lexer tokens from the current position to the end.
     * 
     * @throws {Exception} Throws an exception if there is a graph branch on the stack.
     */
    public collapse(): Array<LexerToken<TTokenType>> {
        const lCurrentBranchStack: CodeParserCursorGraphBranch<TTokenType> = this.mBranchStack.top!;

        // Generate all remaining tokens and cached unused tokens.
        const lUngeneratedToken: Array<LexerToken<TTokenType>> = [...this.mGenerator];
        const lUnusedToken: Array<LexerToken<TTokenType>> = lCurrentBranchStack.token.cache.slice(lCurrentBranchStack.token.index);

        return [...lUnusedToken, ...lUngeneratedToken];
    }

    /**
     * Advances the cursor to the next token in the lexer stream.
     * 
     * @returns The next token if available, otherwise null if the end of the stream is reached.
     * 
     * @throws {@link Exception}
     * If there is no graph branch on the stack.
     */
    public current(): LexerToken<TTokenType> | null {
        // Get top branch.
        const lCurrentBranchStack: CodeParserCursorGraphBranch<TTokenType> = this.mBranchStack.top!;

        // Performance reasons: Dont start a iterator when we dont need to.
        if (lCurrentBranchStack.token.index < lCurrentBranchStack.token.cache.length) {
            // Read token from cache.
            return lCurrentBranchStack.token.cache[lCurrentBranchStack.token.index];
        }

        // Fill up cache until the current index is reached.
        for (let lCacheLength = lCurrentBranchStack.token.cache.length; lCacheLength <= lCurrentBranchStack.token.index; lCacheLength++) {
            // Read token from generator.
            const lToken: IteratorResult<LexerToken<TTokenType>, any> = this.mGenerator.next();
            if (lToken.done) {
                return null;
            }

            // Store token in cache.
            lCurrentBranchStack.token.cache.push(lToken.value);
        }

        // Read token from cache.
        return lCurrentBranchStack.token.cache[lCurrentBranchStack.token.index];
    }

    /**
     * Checks if the given graph branch is circular.
     *
     * @param pBranch - The graph node to check for circularity.
     * @returns `true` if the branch is circular, otherwise `false`.
     */
    public graphBranchIsCircular(pBranch: GraphNode<TTokenType>): boolean {
        // Get top branch.
        const lCurrentBranchStack: CodeParserCursorGraphBranch<TTokenType> = this.mBranchStack.top!;

        // Check if the branch is circular.
        if (!lCurrentBranchStack.circularBranches.has(pBranch)) {
            return false;
        }

        // Branch is circular if the branch is visited more than once.
        return lCurrentBranchStack.circularBranches.get(pBranch)! > CodeParserCursor.MAX_CIRULAR_REFERENCES;
    }

    /**
     * Advances the cursor to the next token in the current branch stack.
     * 
     * @throws {Exception} If there is no branch on the stack.
     */
    public moveNext(): void {
        // Get top branch.
        const lCurrentBranchStack: CodeParserCursorGraphBranch<TTokenType> = this.mBranchStack.top!;

        // When the current branch has progressed, event deep circular branches process a new token and eventually reach the end token.
        if (lCurrentBranchStack.circularBranches.size > 0) {
            lCurrentBranchStack.circularBranches = new Dictionary<GraphNode<TTokenType>, number>();
        }

        lCurrentBranchStack.token.index++;
    }

    /**
     * Pushes a new branch onto the graph branch stack, executes a callback function with the branch, and manages the token stack.
     * 
     * @param pStackCall - The callback function to be executed with the branch.
     * @param pBranch - The branch node to be pushed onto the stack.
     * @param pLinear - A boolean indicating whether the branch is linear.
     * @returns An object containing the result of the callback function and the range of tokens used.
     * 
     * @template TBranch - The type of the branch node.
     * @template TResult - The type of the result returned by the callback function.
     * 
     * @throws Will rethrow any error encountered during the execution of the callback function.
     */
    public pushGraphBranch<TBranch extends GraphNode<TTokenType>, TResult>(pStackCall: (pBranch: TBranch) => TResult, pBranch: TBranch, pLinear: boolean): CodeParserCursorGraphBranchResult<TTokenType, TResult> {
        // Read the current stack state.
        const lLastBranchStack: CodeParserCursorGraphBranch<TTokenType> | undefined = this.mBranchStack.top!;

        // Copy the current token stack from parent from its current token stack index index.
        const lTokenStack: Array<LexerToken<TTokenType>> = lLastBranchStack.token.cache.slice(lLastBranchStack.token.index);

        // Create a new empty branch stack.
        const lNewTokenStack: CodeParserCursorGraphBranch<TTokenType> = {
            branch: pBranch,
            linear: pLinear && lLastBranchStack.linear, // If a parent branch is not linear, the child branch is not linear.
            circularBranches: new Dictionary<GraphNode<TTokenType>, number>(lLastBranchStack.circularBranches),
            token: {
                cache: lTokenStack,
                index: 0
            },
            isRoot: false
        };

        // Add itself to the circular branch list.
        const lCurrentBranchCirularCount: number = lNewTokenStack.circularBranches.get(pBranch) ?? 0;
        lNewTokenStack.circularBranches.set(pBranch, lCurrentBranchCirularCount + 1);

        // Push the new branch stack on the stack.
        this.mBranchStack.push(lNewTokenStack);

        // Call pushed branch.
        try {
            return {
                result: pStackCall(pBranch),
                token: {
                    // Read first used token from the new token stack.
                    start: lNewTokenStack.token.cache[0],
                    // -1 because the index is already moved to the next token.
                    end: lNewTokenStack.token.cache[lNewTokenStack.token.index - 1]
                }
            };
        } catch (lError) {
            // Revert current stack index.
            lNewTokenStack.token.index = 0;

            // Rethrow error.
            throw lError;
        } finally {
            // Pop branch.
            this.mBranchStack.pop()!;

            // FIXME: Parent circular must be cleared, when any cursor movement happens.

            // Truncate parent graph branches token cache to the current token.
            // So the token memory gets marked as disposeable.
            if (lNewTokenStack.linear) {
                // Reset parent index to zero.
                lLastBranchStack.token.cache = lNewTokenStack.token.cache.slice(lNewTokenStack.token.index);
                lLastBranchStack.token.index = 0;
            } else {
                // Read only the new tokens that are added to the stack and are not present in the parent stack.
                const lNewTokenStackCache: Array<LexerToken<TTokenType>> = lNewTokenStack.token.cache.slice(lLastBranchStack.token.cache.length - lLastBranchStack.token.index);

                // Move parent stack index to the last branch stack index.
                lLastBranchStack.token.index += lNewTokenStack.token.index;

                // Add the new tokens to the parent stack.
                lLastBranchStack.token.cache.splice(lLastBranchStack.token.cache.length, 0, ...lNewTokenStackCache);
            }
        }
    }
}

type CodeParserCursorGraphBranch<TTokenType extends string> = {
    branch: GraphNode<TTokenType>;
    linear: boolean;
    circularBranches: Dictionary<GraphNode<TTokenType>, number>;
    token: {
        cache: Array<LexerToken<TTokenType>>,
        index: number;
    };
    isRoot: boolean;
};

type CodeParserCursorGraphBranchResult<TTokenType extends string, TResult> = {
    result: TResult;
    token: {
        start: LexerToken<TTokenType>;
        end: LexerToken<TTokenType>;
    };
};