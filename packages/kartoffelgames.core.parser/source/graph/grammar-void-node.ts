import { BaseGrammarNode } from './base-grammar-node';
import { GrammarNodeType } from './grammar-node-type.enum';

/**
 * Empty grammar node. Hold no data and does not chain.
 * 
 * @public
 */
export class GrammarVoidNode<TTokenType> extends BaseGrammarNode<TTokenType> {
    /**
     * Grammar node type.
     */
    public get type(): GrammarNodeType {
        return GrammarNodeType.Void;
    }
    
    public override retrieveNextFor(pToken: TTokenType) {
        throw new Error('Method not implemented.');
    }
}