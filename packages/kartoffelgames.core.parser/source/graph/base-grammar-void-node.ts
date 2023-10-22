import { BaseGrammarNode } from './base-grammar-node';
import { GrammarNodeType } from './grammar-node-type.enum';

export abstract class BaseGrammarVoidNode<TTokenType> extends BaseGrammarNode<TTokenType> {

    /**
     * Constructor.
     * 
     * @param pValueIdentifier - Identifier wich the token value can be mapped. 
     */
    public constructor() {
        super(GrammarNodeType.Void);
    }

    // TODO: retriveNext. Should be the same for all void nodes.
} 