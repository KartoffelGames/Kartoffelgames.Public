import { CodeParser } from '../code-parser';
import { BaseGrammarNode } from './base-grammar-node';

export class GraphPartReference<TTokenType extends string> {
    private readonly mParser: CodeParser<TTokenType, unknown>;
    private readonly mPartName: string;

    /**
     * Constructor.
     * 
     * @param pParser - Parser reference.
     * @param pPartName - Referenced part name.
     */
    public constructor(pParser: CodeParser<TTokenType, unknown>, pPartName: string) {
        this.mParser = pParser;
        this.mPartName = pPartName;
    }

    public graph(): BaseGrammarNode<TTokenType> {
        
    }

}