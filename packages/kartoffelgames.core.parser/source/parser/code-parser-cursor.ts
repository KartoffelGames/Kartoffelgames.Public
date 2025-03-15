import { Exception, Stack } from "@kartoffelgames/core";
import { GraphNode } from "../graph/graph-node.ts";
import { LexerToken } from "../lexer/lexer-token.ts";

export class CodeParserCursor<TTokenType extends string> {
    private readonly mGenerator: Generator<LexerToken<TTokenType>, any, any>;
    private readonly mBranchStack: Stack<CodeParserCursorBranchStack<TTokenType>>;
    private readonly mUnprogressedCircularBranches: WeakSet<GraphNode<TTokenType>>;

    /**
     * Constructor.
     * 
     * @param pLexerGenerator - A generator that produces LexerToken objects of the specified token type.
     */
    public constructor(pLexerGenerator: Generator<LexerToken<TTokenType>, any, any>) {
        this.mGenerator = pLexerGenerator;
        this.mBranchStack = new Stack<CodeParserCursorBranchStack<TTokenType>>();
        this.mUnprogressedCircularBranches = new WeakSet<GraphNode<TTokenType>>();
    }

    /**
     * Checks if the given graph branch is circular.
     *
     * @param pBranch - The graph node to check for circularity.
     * @returns `true` if the branch is circular, otherwise `false`.
     */
    public graphBranchIsCircular(pBranch: GraphNode<TTokenType>): boolean {
        return this.mUnprogressedCircularBranches.has(pBranch);
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
        // Pop branch.
        const lCurrentBranchStack: CodeParserCursorBranchStack<TTokenType> | undefined = this.mBranchStack.top;
        if (!lCurrentBranchStack) {
            throw new Exception("No graph branch on the stack.", this);
        }

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
     * Moves the cursor to the end of the token stream.
     * Irreversible deconstruction of this cursor.
     * 
     * @returns {Array<LexerToken<TTokenType>>} An array of lexer tokens from the current position to the end.
     * 
     * @throws {Exception} Throws an exception if there is a graph branch on the stack.
     */
    public moveEnd(): Array<LexerToken<TTokenType>> {
        // Prevent moving to end while there is a graph branch on the stack.
        if (this.mBranchStack.top) {
            throw new Exception("Cannot move to end while there is a graph branch on the stack.", this);
        }

        return [...this.mGenerator];
    }

    /**
     * Advances the cursor to the next token in the current branch stack.
     * 
     * @throws {Exception} If there is no branch on the stack.
     */
    public moveNext(): void {
        // Get top branch.
        const lCurrentBranchStack: CodeParserCursorBranchStack<TTokenType> | undefined = this.mBranchStack.top;
        if (!lCurrentBranchStack) {
            throw new Exception("No graph branch on the stack.", this);
        }

        // When the current branch has progressed, so it has read after the first token, remove it from the unprogressed circular call list.
        if (lCurrentBranchStack.token.index > 0) {
            this.mUnprogressedCircularBranches.delete(lCurrentBranchStack.branch);
        }

        lCurrentBranchStack.token.index++;
    }

    /**
     * Moves the cursor to the previous token in the current branch stack.
     * 
     * @throws {@link Exception} If there is no graph branch on the stack.
     * @throws {@link Exception} If there is no previous token available.
     */
    public movePrevious(): void {
        // Get top branch.
        const lCurrentBranchStack: CodeParserCursorBranchStack<TTokenType> | undefined = this.mBranchStack.top;
        if (!lCurrentBranchStack) {
            throw new Exception("No graph branch on the stack.", this);
        }

        // Cant move back if no token is available.
        if (lCurrentBranchStack.token.index === 0) {
            throw new Exception("No previous token available.", this);
        }

        // Move index back.
        lCurrentBranchStack.token.index--;
    }

    /**
     * 
     * @param pStackCall - Call that happend on the stack. 
     * @param pBranch - Branch that is pushed on the stack.
     * @param pLinear - If the branch is linear, so a token cache is not needed.
     * @returns 
     */
    public pushGraphBranch<TBranch extends GraphNode<TTokenType>, TResult>(pStackCall: (pBranch: TBranch) => TResult, pBranch: TBranch, pLinear: boolean): TResult {
        // Read the current stack state.
        let lLastBranchStack: CodeParserCursorBranchStack<TTokenType> | undefined = this.mBranchStack.top;
        if (!lLastBranchStack) {
            // Create placeholder branch stack.
            lLastBranchStack = {
                branch: null as any,
                linear: true,
                token: {
                    cache: [],
                    index: 0
                }
            };
        }

        // Copy the current token stack from parent from its current token stack index index.
        const lTokenStack: Array<LexerToken<TTokenType>> = lLastBranchStack.token.cache.slice(lLastBranchStack.token.index);

        // Create a new empty branch stack.
        this.mBranchStack.push({
            branch: pBranch,
            linear: pLinear && lLastBranchStack.linear, // If a parent branch is not linear, the child branch is not linear.
            token: {
                cache: lTokenStack,
                index: 0
            }
        });

        // Call pushed branch.
        try {
            return pStackCall(pBranch);
        } catch (lError) {
            // Revert current stack index.
            this.mBranchStack.top!.token.index = 0;

            // Rethrow error.
            throw lError;
        } finally {
            // Pop branch.
            const lCurrentBranchStack: CodeParserCursorBranchStack<TTokenType> = this.mBranchStack.pop()!;

            // Read only the new tokens that are added to the stack and are not present in the parent stack.
            const lNewTokenStackCache: Array<LexerToken<TTokenType>> = lCurrentBranchStack.token.cache.slice(lLastBranchStack.token.cache.length - lLastBranchStack.token.index);

            // Move parent stack index to the last branch stack index.
            lLastBranchStack.token.index += lCurrentBranchStack.token.index;

            // Add the new tokens to the parent stack.
            lLastBranchStack.token.cache.push(...lNewTokenStackCache);

            // TODO: When do we need to move the parent stack index? Only when child has no exception?
            // TODO: When do we need to cut down the parent token cache, so the memory gets freed?
        }
    }
}

type CodeParserCursorBranchStack<TTokenType extends string> = {
    branch: GraphNode<TTokenType>;
    linear: boolean;
    token: {
        cache: Array<LexerToken<TTokenType>>,
        index: number;
    };
};