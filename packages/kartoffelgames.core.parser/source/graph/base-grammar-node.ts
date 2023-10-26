/**
 * Basic grammar node. Base parent for all native nodes.
 * 
 * @typeparam TTokenType - Type of all tokens the graph can handle.
 */
export abstract class BaseGrammarNode<TTokenType> {
    private mNextNode: BaseGrammarNode<TTokenType> | null;
    private readonly mPreviousNode: BaseGrammarNode<TTokenType> | null;
    
    /**
     * Get the root node of this branch.
     */
    public get branchRoot(): BaseGrammarNode<TTokenType> {
        // Get parent of parent when a parent exists.
        // Real cool property recursion.
        if (this.mPreviousNode) {
            return this.mPreviousNode.branchRoot;
        }

        // When no parent exists, you have offically reached the endpoint (root).
        return this;
    }

    /**
     * Constructor.
     * 
     * @param pPreviousNode - Node that is chained before this node.
     */
    constructor(pPreviousNode?: BaseGrammarNode<TTokenType>) {
        this.mPreviousNode = pPreviousNode ?? null;
        this.mNextNode = null;
    }

    // TODO: loop, single, optional, branch. // Chain created node into mNextNode

    /**
     * Get all token tyes that can be changed after this node.
     * 
     * @param pParentNode - Node that host this nodes branch. Not the node that is chained before this node. 
     */
    public abstract chainableTokens(pParentNode: BaseGrammarNode<TTokenType>): Array<TTokenType>;

    /**
     * Retrieve next grammer node for the next token.
     * When this returns false, this path, node or branch should not be used to process with this token.
     * 
     * @param pToken - Token type that the next path should take.
     * @param pParentNode - Node that host this nodes branch. Not the node that is chained before this node. 
     * 
     * @throws {@link Exception}
     * When no valid path exists for the specified token.
     * 
     * @returns The next grammar node of specified path or null when the end of this chain is reached.
     * 
     * @internal
     */
    public abstract retrieveNext(pToken: TTokenType, pParentNode: BaseGrammarNode<TTokenType>): Array<BaseGrammarNode<TTokenType>>;
}