import { BaseGrammarNode } from './base-grammar-node';
import { GrammarNodeType } from './grammar-node-type.enum';

export abstract class BaseGrammarTokenNode<TTokenType> extends BaseGrammarNode<TTokenType> {
    private readonly mValueIdentifier: string | null;

    /**
     * Current node value identifier.
     * Used to save the value of a token, this node is used for.
     */
    public get valueIdentifier(): string | null{
        return this.mValueIdentifier;
    }

    /**
     * Constructor.
     * 
     * @param pValueIdentifier - Identifier wich the token value can be mapped. 
     */
    public constructor(pValueIdentifier?: string) {
        super(GrammarNodeType.Value);

        this.mValueIdentifier = pValueIdentifier ?? null;
    }
} 