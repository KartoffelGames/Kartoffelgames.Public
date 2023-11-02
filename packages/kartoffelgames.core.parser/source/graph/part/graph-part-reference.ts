import { CodeParser } from '../../code-parser';
import { GraphPart } from './graph-part';

/**
 * Reference to a graph part.
 * The Part must not exist at the point of reference creation.
 * 
 * @typeparam TTokenType - Type of all tokens the referenced graph can handle.
 */
export class GraphPartReference<TTokenType extends string> {
    private readonly mParser: CodeParser<TTokenType, any>;
    private readonly mPartName: string;

    /**
     * Constructor.
     * 
     * @param pParser - Parser reference.
     * @param pPartName - Referenced part name.
     */
    public constructor(pParser: CodeParser<TTokenType, any>, pPartName: string) {
        this.mParser = pParser;
        this.mPartName = pPartName;
    }

    /**
     * Resolve reference and get the actual graph part.
     * 
     * @returns Resolved graph part.
     */
    public resolveReference(): GraphPart<TTokenType> {
        return this.mParser.getGraphPart(this.mPartName);
    }
}