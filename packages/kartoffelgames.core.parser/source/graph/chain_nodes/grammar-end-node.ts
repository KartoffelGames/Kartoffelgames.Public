import { BaseGrammarNode } from '../base-grammar-node';
import { GrammarNodeType } from '../grammar-node-type.enum';

export class GrammarEndNode<TTokenType, TResult> extends BaseGrammarNode<TTokenType>{
    /**
     * Grammar node type.
     */
    public get type(): GrammarNodeType {
        return GrammarNodeType.End;
    }
}