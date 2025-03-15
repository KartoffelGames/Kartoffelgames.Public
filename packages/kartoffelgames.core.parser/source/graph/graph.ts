import type { GraphNode } from './graph-node.ts';

/**
 * Represents a generic graph structure that can be defined with a graph collector and an optional data collector.
 *
 * @template TTokenType - The type of tokens used in the graph.
 * @template TResultData - The type of the result produced by the graph.
 */
export class Graph<TTokenType extends string, TOriginalData extends object = object, TResultData = TOriginalData> {
    /**
     * Defines a graph with the provided graph collector and optional data collector.
     * The collector can be used to mutate the raw data into a desired result.
     *
     * @param pNodeCollector - The node collector containing the graph data.
     * 
     * @returns A new instance of the Graph class with the provided graph and data collector.
     */
    public static define<TTokenType extends string, TResultData extends object>(pNodeCollector: GraphNodeCollector<TTokenType, TResultData>): Graph<TTokenType, TResultData> {
        return new Graph(pNodeCollector);
    }

    private readonly mDataConverterList: Array<GraphDataCollector>;
    private readonly mGraphCollector: GraphNodeCollector<TTokenType, TOriginalData>;
    private mResolvedGraphNode: GraphNode<TTokenType> | null;

    /**
     * Get the resolved graph.
     */
    public get node(): GraphNode<TTokenType, TOriginalData> {
        if (!this.mResolvedGraphNode) {
            this.mResolvedGraphNode = this.mGraphCollector();
        }

        return this.mResolvedGraphNode as GraphNode<TTokenType, TOriginalData>;
    }

    /**
     * Constructor.
     * 
     * @param pGraph - Graph collector function.
     * @param pDataCollector - Data collector function.
     */
    private constructor(pGraph: GraphNodeCollector<TTokenType, TOriginalData>) {
        this.mGraphCollector = pGraph;
        this.mDataConverterList = new Array<GraphDataCollector>();
        this.mResolvedGraphNode = null;
    }

    /**
     * Resolve the graph data.
     * 
     * @param pRawData - Raw data to resolve.
     * 
     * @returns Resolved data.
     */
    public convert(pRawData: TOriginalData): TResultData {
        // Convert data with each added data converter.
        let lData: any = pRawData;
        for(const lDataConverter of this.mDataConverterList) {
            lData = lDataConverter(lData);
        }

        return lData as TResultData;
    }

    /**
     * Add a data converter to the graph.
     * Data converters can mutate the current data into another form.
     * 
     * @param pConverter - Data converter
     */
    public converter<TConvertedData>(pConverter: GraphDataCollector<TResultData, TConvertedData>): Graph<TTokenType, TOriginalData, TConvertedData> {
        const lNewGraph: Graph<TTokenType, TOriginalData, TConvertedData> = new Graph<TTokenType, TOriginalData, TConvertedData>(this.mGraphCollector);
        
        // Add all previous data converters and the new converter to the new graph.
        lNewGraph.mDataConverterList.push(...this.mDataConverterList, pConverter);

        return lNewGraph;
    }
}

type GraphNodeCollector<TTokenType extends string = string, TResultData extends object = object> = () => GraphNode<TTokenType, TResultData>;
type GraphDataCollector<TCurrentData = any, TResult = any> = (pRawData: TCurrentData) => TResult;

export type GraphRef<TResultType> = Graph<string, any, TResultType>;