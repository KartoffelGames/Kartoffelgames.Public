import { Stack } from '@kartoffelgames/core.data';

/**
 * Basic grammar node. Base parent for all native nodes.
 * 
 * @typeparam TTokenType - Type of all tokens the graph can handle.
 */
export abstract class BaseGrammarNode<TTokenType extends string> {
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
     * Node that is directly chained after this node.
     */
    protected get nextNode(): BaseGrammarNode<TTokenType> | null {
        return this.mNextNode;
    }

    /**
     * Node that is directly chained before this node.
     */
    protected get previousNode(): BaseGrammarNode<TTokenType> | null {
        return this.mPreviousNode;
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
     * Retrieve next grammer node for the next token.
     * When this returns false, this path, node or branch should not be used to process with this token.
     * 
     * @param pToken - Token type that the next path should take.
     * @param pParentStack - Nodes that host this nodes branch. Not the node that is chained before this node. 
     * @param pRequestingNode - Node that requests this information. 
     * 
     * @throws {@link Exception}
     * When no valid path exists for the specified token.
     * 
     * @returns The next grammar node of specified path or null when the end of this chain is reached.
     * 
     * @internal
     */
    public abstract retrieveNext(pToken: TTokenType, pParentStack: Stack<BaseGrammarNode<TTokenType>>, pRequestingNode: BaseGrammarNode<TTokenType> | null): Array<BaseGrammarNode<TTokenType>>;

    /**
     * Get all token types that are valid for this node.
     * When this node does not hold any information itself, it should return the valid tokens of the next branches.
     * 
     * @param pParentStack - Nodes that host this nodes branch. Not the node that is chained before this node.  
     * @param pRequestingNode - Node that requests this information. 
     * 
     * @return All valid token types for this node. 
     * 
     * @internal
     */
    public abstract validTokens(pParentStack: Stack<BaseGrammarNode<TTokenType>>, pRequestingNode: BaseGrammarNode<TTokenType> | null): Array<TTokenType>;
}