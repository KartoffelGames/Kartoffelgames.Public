import { BaseGrammarNode } from '../node/base-grammar-node';

/**
 * Graph part.
 * 
 * @typeparam TTokenType - Type of all tokens the graph part can handle.
 */
export class GraphPart<TTokenType extends string> {
    private readonly mDataCollector: GraphPartDataCollector | null;
    private readonly mRootNode: BaseGrammarNode<TTokenType>;

    /**
     * Graph part data collector.
     */
    public get dataCollector(): GraphPartDataCollector | null {
        return this.mDataCollector;
    }

    /**
     * Graph part root node.
     */
    public get graph(): BaseGrammarNode<TTokenType> {
        return this.mRootNode;
    }

    /**
     * Constructor.
     * 
     * @param pGraph - Graph part branch.
     * @param pCollector - Data collector that parses raw node data into another type.
     */
    public constructor(pGraph: BaseGrammarNode<TTokenType>, pCollector?: GraphPartDataCollector) {
        this.mRootNode = pGraph.branchRoot;
        this.mDataCollector = pCollector ?? null;
    }
}

export type GraphPartDataCollector = (pRawData: any) => unknown;