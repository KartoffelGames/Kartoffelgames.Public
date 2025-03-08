import { GraphNode } from "./graph-node.ts";

/**
 * Represents a generic graph structure that can be defined with a graph collector and an optional data collector.
 *
 * @template TTokenType - The type of tokens used in the graph.
 * @template TResultData - The type of the result produced by the graph.
 */
export class Graph<TTokenType extends string, TOriginalData extends object, TResultData = TOriginalData> {
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

    private readonly mGraphCollector: GraphNodeCollector<TTokenType, TOriginalData>;
    private readonly mDataConverterList: Array<GraphDataCollector>;
    private mResolvedGraphNode: GraphNode<TTokenType> | null;

    /**
     * Get the resolved graph.
     */
    public get node(): GraphNode<TTokenType, TOriginalData> {
        if (!this.mResolvedGraphNode) {
            this.mResolvedGraphNode = this.mGraphCollector();
        }

        return this.mResolvedGraphNode;
    }

    /**
     * Constructor.
     * 
     * @param pGraph - Graph collector function.
     * @param pDataCollector - Data collector function.
     */
    private constructor(pGraph: GraphNodeCollector) {
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
    public dataConvert<TConvertedData>(pConverter: GraphDataCollector<TResultData, TConvertedData>): Graph<TTokenType, TOriginalData, TConvertedData> {
        const lNewGraph: Graph<TTokenType, TOriginalData, TConvertedData> = new Graph<TTokenType, TOriginalData, TConvertedData>(this.mGraphCollector);
        
        // Add all previous data converters and the new converter to the new graph.
        lNewGraph.mDataConverterList.push(...this.mDataConverterList, pConverter);

        return lNewGraph;
    }
}

type GraphNodeCollector<TTokenType extends string = string, TResultData extends object = object> = () => GraphNode<TTokenType, TResultData>;
type GraphDataCollector<TCurrentData = any, TResult = any> = (pRawData: TCurrentData) => TResult;

export type GraphRef<TResultType> = Graph<any, any, TResultType>;



// TODO: Fix typing of this.
/*
    1
*/
const lShitHead1 = Graph.define(() => {
    const lSelf: GraphRef<{MYLIST: string[]}> = lShitHead1;

    return GraphNode.new().required('MYLIST[]', 'mytoken').optional('MYLIST<-MYLIST', lSelf);
}).dataConvert((pData) => {
    return pData;
});


/*
    {
        MYLIST: Array<string>
    }
*/
const lShitHead1111 = Graph.define(() => {
    return GraphNode.new().required('MYLIST[]', 'mytoken').required('MYLIST2<-MYLIST', lShitHead1);
});

/*
    {
        MYLIST: Array<string>
    }
*/
const lShitHead2 = Graph.define(() => {
    const lSelf: GraphRef<{MYLIST: string[]}> = lShitHead2;
    return GraphNode.new().required('MYLIST[]', 'mytoken').optional('MYLIST<-MYLIST', lSelf);
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
    return GraphNode.new().required('MYVAL[]', 'mytoken').required('MYVAL<-MYVAL2x',
        GraphNode.new().required('MYVAL2', 'mytoken2')
    );
});


const lShitHead3223 = Graph.define(() => {
    return GraphNode.new().required('MYVAL<-MYVAL2',
        GraphNode.new().required('MYVAL2[]', 'mytoken2')
    );
});