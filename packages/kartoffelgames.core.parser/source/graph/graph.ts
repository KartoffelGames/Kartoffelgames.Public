import { GraphNode } from "./graph-node.ts";

/**
 * Represents a generic graph structure that can be defined with a graph collector and an optional data collector.
 *
 * @template TTokenType - The type of tokens used in the graph.
 * @template TResult - The type of the result produced by the graph.
 */
export class Graph<TTokenType extends string, TResult = unknown> {
    /**
     * Defines a graph with the provided graph collector.
     *
     * @param pGraph - The graph collector containing the graph data.
     * 
     * @returns A new instance of the Graph class with the provided graph.
     */
    public static define<TTokenType extends string, TRawData extends object>(pGraph: GraphCollector<TTokenType, TRawData>): Graph<TTokenType, TRawData>;


    /**
     * Defines a graph with the provided graph collector and data collector.
     * The collector can be used to mutate the raw data into a desired result.
     *
     * @param pGraph - The graph collector containing the graph data.
     * @param pDataCollector - Optional. A function to collect and process raw data. If not provided, a default collector that returns the raw data will be used.
     * 
     * @returns A new instance of the Graph class with the provided graph and data collector.
     */
    public static define<TTokenType extends string, TRawData extends object, TResult>(pGraph: GraphCollector<TTokenType, TRawData>, pDataCollector: GraphDataCollector<TRawData, TResult>): Graph<TTokenType, TResult>;

    /**
     * Defines a graph with the provided graph collector and optional data collector.
     * The collector can be used to mutate the raw data into a desired result.
     *
     * @param pGraph - The graph collector containing the graph data.
     * @param pDataCollector - Optional. A function to collect and process raw data. If not provided, a default collector that returns the raw data will be used.
     * 
     * @returns A new instance of the Graph class with the provided graph and data collector.
     */
    public static define(pGraph: GraphCollector<string, object>, pDataCollector?: GraphDataCollector): Graph<string, unknown> {
        // Create a generic data collector if none is provided.
        let lDataCollector: GraphDataCollector | undefined = pDataCollector;
        if (!lDataCollector) {
            lDataCollector = (pRawData: object) => {
                return pRawData;
            };
        }

        return new Graph(pGraph, lDataCollector);
    }

    private readonly mGraphCollector: GraphCollector<TTokenType>;
    private readonly mDataCollector: GraphDataCollector<object, TResult>;
    private mResolvedGraphNode: GraphNode<TTokenType> | null;

    /**
     * Get the resolved graph.
     */
    public get node(): GraphNode<TTokenType> {
        if (!this.mResolvedGraphNode) {
            this.mResolvedGraphNode = this.mGraphCollector(GraphNode.new(), {});
        }

        return this.mResolvedGraphNode;
    }

    /**
     * Constructor.
     * 
     * @param pGraph - Graph collector function.
     * @param pDataCollector - Data collector function.
     */
    public constructor(pGraph: GraphCollector<TTokenType>, pDataCollector: GraphDataCollector<object, TResult>) {
        this.mGraphCollector = pGraph;
        this.mDataCollector = pDataCollector;
        this.mResolvedGraphNode = null;
    }

    /**
     * Resolve the graph data.
     * 
     * @param pRawData - Raw data to resolve.
     * 
     * @returns Resolved data.
     */
    public resolve(pRawData: object): TResult {
        return this.mDataCollector(pRawData);
    }
}

type GraphCollector<TTokenType extends string, TRawData extends object = object> = (pNode: GraphNode<TTokenType, TRawData>, pRawData: TRawData) => GraphNode<TTokenType, TRawData>;
type GraphDataCollector<TRawData extends object = object, TResult = unknown> = (pRawData: TRawData) => TResult;



// TODO: Fix typing of this.
const lShitHead1 = Graph.define(() => {
    return GraphNode.new().required('MYVAL').optional('->', lShitHead1);
}, (pData) => {
    return 1;
});

const lShitHead2 = Graph.define(() => {
    return GraphNode.new().required('MYVAL').optional('->', lShitHead2);
});

const lShitHead3 = Graph.define(() => {
    return GraphNode.new().required('MYVAL').optional('->', 
        GraphNode.new().required('MYVAL2')
    );
});

const lShitHead4 = Graph.define(() => {
    return GraphNode.new().required('MYVAL').optional('->', 
        GraphNode.new().required('MYVAL')
    );
});