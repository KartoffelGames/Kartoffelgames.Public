import { BaseGrammarTokenNode } from '../base-grammar-token-node';
import { GrammarNodeType } from '../grammar-node-type.enum';

export class GrammarOptionalNode<TTokenType> extends BaseGrammarTokenNode<TTokenType>{
    /**
     * Grammar node type.
     */
    public get type(): GrammarNodeType {
        return GrammarNodeType.Optional;
    }
}