import { GrammarNodeValueType } from './grammer-node-value-type.enum';
import { GraphPartReference } from './graph-part-reference';

/**
 * Basic grammar node. Base parent for all native nodes.
 * 
 * @typeparam TTokenType - Type of all tokens the graph can handle.
 */
export abstract class BaseGrammarNode<TTokenType extends string> {
    private readonly mIdentifier: string | null;
    private mNextNode: BaseGrammarNode<TTokenType> | null;
    private readonly mPreviousNode: BaseGrammarNode<TTokenType> | null;
    private readonly mSkipable: boolean;

    /**
     * Node value. Can be a set of tokens or a graph part reference.
     */
    public abstract readonly nodeValues: Array<TTokenType | GraphPartReference<TTokenType>>;

    /**
     * Node value. Can be a set of tokens or a graph part reference.
     */
    public abstract readonly nodeValueType: GrammarNodeValueType;

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
     * Node value identifier.
     */
    public get identifier(): string | null {
        return this.mIdentifier;
    }

    /**
     * If this node is optional or is needed to fit perfectly.
     */
    public get optional(): boolean {
        return this.mSkipable;
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
     * @param pSkipable - If this node is skipable or is needed to fit perfectly.
     */
    constructor(pPreviousNode: BaseGrammarNode<TTokenType> | null, pSkipable: boolean, pIdentifier: string | null) {
        this.mPreviousNode = pPreviousNode;
        this.mNextNode = null;
        this.mSkipable = pSkipable;
        this.mIdentifier = pIdentifier;
    }

    // TODO: optionalLoop, loop, single, optionalSingle, branch, optionalBranch, reference, optionalReference // Chain created node into mNextNode

    /**
     * Retrieve next grammar nodes or graph parts that are possible chained after this node.
     * 
     * @returns The next grammar nodes or null when the end of this chain is reached.
     * 
     * @internal
     */
    public abstract next(): Array<BaseGrammarNode<TTokenType> | null>;
}

export type GrammarGrapthValue<TTokenType extends string> = GraphPartReference<TTokenType> | TTokenType;