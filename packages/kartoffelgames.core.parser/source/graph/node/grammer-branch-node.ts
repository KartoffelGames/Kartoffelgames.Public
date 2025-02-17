import { BaseGrammarNode, GrammarGraphValue } from './base-grammar-node.ts';
import { GrammarNodeValueType } from './grammer-node-value-type.enum.ts';

/**
 * Branch value node.
 * Contains multiple values, but only one must be valid.
 * The node can be set optional.
 * 
 * @typeparam TTokenType - Type of all tokens the graph can handle.
 */
export class GrammarBranchNode<TTokenType extends string> extends BaseGrammarNode<TTokenType> {
    private readonly mNodeBranches: Array<GrammarGraphValue<TTokenType>>;

    /**
     * Node values. Can be a set of tokens or a graph part reference.
     */
    public get nodeValues(): Array<GrammarGraphValue<TTokenType>> {
        return this.mNodeBranches;
    }

    /**
     * Constructor.
     * 
     * @param pPreviousNode - Node that is chained before this node.
     * @param pNodeBranches - List of values or graph parts this node can branch into.
     * @param pRequired - If this node is required or is needed to fit perfectly.
     * @param pIdentifier - Name of the property, the node token value will be stored.
     */
    public constructor(pPreviousNode: BaseGrammarNode<TTokenType> | null, pNodeBranches: Array<GrammarGraphValue<TTokenType>>, pRequired: boolean, pIdentifier: string | null) {
        super(pPreviousNode, pRequired, GrammarNodeValueType.Single, pIdentifier);

        this.mNodeBranches = pNodeBranches;
    }

    /**
     * Retrieve next grammar nodes that are chained after this node.
     * Null value is used to represent a node chain end.
     * 
     * @returns The next grammar nodes or null when the end of this chain is reached.
     * 
     * @internal
     */
    public override next(): Array<BaseGrammarNode<TTokenType> | null> {
        return [this.chainedNode];
    }
}