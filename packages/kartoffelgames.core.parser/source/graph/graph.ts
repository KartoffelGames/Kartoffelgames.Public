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
    public static define<TTokenType extends string, TRawData extends object>(pGraph: GraphCollector<TTokenType, TRawData, TRawData>): Graph<TTokenType, TRawData>;


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
            this.mResolvedGraphNode = this.mGraphCollector(this);
        }

        return this.mResolvedGraphNode;
    }

    /**
     * Constructor.
     * 
     * @param pGraph - Graph collector function.
     * @param pDataCollector - Data collector function.
     */
    public constructor(pGraph: GraphCollector<TTokenType, Graph<TTokenType, TResult>>, pDataCollector: GraphDataCollector<object, TResult>) {
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

type GraphCollector<TTokenType extends string, TRawData extends object = object, TResult = unknown> = (pSelf: Graph<TTokenType, TResult>) => GraphNode<TTokenType, TRawData>;
type GraphDataCollector<TRawData extends object = object, TResult = unknown> = (pRawData: TRawData) => TResult;



// TODO: Fix typing of this.
/*
    1
*/
const lShitHead1 = Graph.define(() => {
    return GraphNode.new().required('MYLIST[]', 'mytoken').optional('MYLIST<-MYLIST', lShitHead1);
}, (_pData) => {
    return 1;
});

/*
    {
        MYLIST: Array<string>
    }
*/
const lShitHead1111 = Graph.define((pNode) => {
    return GraphNode.new().required('MYLIST[]', 'mytoken').required('MYLIST<-MYLIST', pNode);
});

/*
    {
        MYLIST: Array<string>
    }
*/
const lShitHead2 = Graph.define(() => {
    return GraphNode.new().required('MYLIST[]', 'mytoken').optional('MYLIST<-MYLIST', lShitHead2);
});

/*
    {
        MYVAL: Array<string>,
    }
*/
const lShitHead3 = Graph.define(() => {
    return GraphNode.new().required('MYVAL[]', 'mytoken').optional('MYVAL<-MYVAL2', 
        GraphNode.new().required('MYVAL2', 'mytoken2')
    );
});

/*
    {
        MYVAL: Array<string>,
        MYVAL2?: {
            MYVAL2: string
        }
    }
*/
const lShitHead4 = Graph.define(() => {
    return GraphNode.new().required('MYVAL[]', 'mytoken').optional('MYVAL2', 
        GraphNode.new().required('MYVAL2', 'mytoken2')
    );
});

/*
    {
        MYVAL: string
    }
*/
const lShitHead5 = Graph.define(() => {
    return GraphNode.new().required('MYVAL', 'mytoken').optional('->', 
        GraphNode.new().required('MYVAL', 'mytoken2')
    );
});


const lShitHead223 = Graph.define(() => {
    return GraphNode.new().required('MYVAL[]', 'mytoken').required('MYVAL<-MYVAL2', 
        GraphNode.new().required('MYVAL2', 'mytoken2')
    );
});


const lShitHead3223 = Graph.define(() => {
    return GraphNode.new().required('MYVAL<-MYVAL2', 
        GraphNode.new().required('MYVAL2[]', 'mytoken2')
    );
});