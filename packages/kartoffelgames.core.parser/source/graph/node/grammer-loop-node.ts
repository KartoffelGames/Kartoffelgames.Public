import { BaseGrammarNode, GrammarGraphValue } from './base-grammar-node';
import { GrammarNodeValueType } from './grammer-node-value-type.enum';

/**
 * Loop value node.
 * Contains a single graph part that can loop inifinitly.
 * A loop is allways optional.
 * 
 * @typeparam TTokenType - Type of all tokens the graph can handle.
 */
export class GrammarLoopNode<TTokenType extends string> extends BaseGrammarNode<TTokenType> {
    private readonly mNodeValue: GrammarGraphValue<TTokenType>;

    /**
     * Node values. Can be a set of tokens or a graph part reference.
     */
    public get nodeValues(): Array<GrammarGraphValue<TTokenType>> {
        return [this.mNodeValue];
    }

    /**
     * Constructor.
     * 
     * @param pPreviousNode - Node that is chained before this node.
     * @param pNodeValue - Single value of this node. Can be a token type or a graph part.
     * @param pRequired - If this node is required or is needed to fit perfectly.
     * @param pIdentifier - Name of the property, the node token value will be stored.
     */
    public constructor(pPreviousNode: BaseGrammarNode<TTokenType> | null, pNodeValue: GrammarGraphValue<TTokenType>, pIdentifier: string | null) {
        super(pPreviousNode, false, GrammarNodeValueType.List, pIdentifier);

        this.mNodeValue = pNodeValue;
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
        return [this, this.nextNode];
    }
}