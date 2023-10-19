import { BaseGrammarNode } from './base-grammar-node';

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
        super();

        this.mValueIdentifier = pValueIdentifier ?? null;
    }
} 