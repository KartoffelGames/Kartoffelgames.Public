import { Exception } from '@kartoffelgames/core.data';
import { BaseGrammarNode, GrammarGraphValue } from './base-grammar-node';
import { GrammarNodeValueType } from './grammer-node-value-type.enum';

/**
 * Anonymous node.
 * Acts as a starting point of a branch.
 * Does not set itself a the previous node when it got chained.
 * 
 * Overrides every chain method.
 * 
 * @typeparam TTokenType - Type of all tokens the graph can handle.
 */
export class AnonymoutGrammarNode<TTokenType extends string> extends BaseGrammarNode<TTokenType> {
    /**
     * Throws an error.
     * This node should not be uses in any graph. Only exist when this node does't get chained.
     */
    public get nodeValues(): Array<GrammarGraphValue<TTokenType>> {
        throw new Exception(`Anonymous nodes can't act as a ordinary node. To start a branch, this node needs to be chained.`, this);
    }

    /**
     * Constructor.
     */
    public constructor() {
        super(null, false, GrammarNodeValueType.Single, null);
    }

    // TODO: Override single, optional, branch, optionalBranch and loop.

    /**
     * Throws an error.
     * This node should not be uses in any graph. Only exist when this node does't get chained.
     * 
     * @internal
     */
    public override next(): Array<BaseGrammarNode<TTokenType> | null> {
        throw new Exception(`Anonymous nodes can't act as a ordinary node. To start a branch, this node needs to be chained.`, this);
    }
}