import { BaseGrammarTokenNode } from '../base-grammar-token-node';
import { GrammarNodeType } from '../grammar-branch-reference.enum';

export class GrammarEndNode<TTokenType, TResult extends object> extends BaseGrammarTokenNode<TTokenType>{
    /**
     * Grammar node type.
     */
    public get type(): GrammarNodeType {
        return GrammarNodeType.End;
    }
}