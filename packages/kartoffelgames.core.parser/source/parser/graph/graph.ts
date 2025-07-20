import { LexerToken } from "../../lexer/lexer-token.ts";
import { CodeParserProcessState } from "../code-parser-process-state.ts";
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

    private readonly mDataConverterList: Array<GraphDataCollector<TTokenType>>;
    private readonly mGraphCollector: GraphNodeCollector<TTokenType, TOriginalData>;
    private mResolvedGraphNode: GraphNode<TTokenType> | null;

    /**
     * Get the resolved graph.
     */
    public get node(): GraphNode<TTokenType, TOriginalData> {
        // Resolve node when not already resolved.
        if (!this.mResolvedGraphNode) {
            // Resolve and cache root node.
            this.mResolvedGraphNode = this.mGraphCollector().root;
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
        this.mDataConverterList = new Array<GraphDataCollector<TTokenType>>();
        this.mResolvedGraphNode = null;
    }

    /**
     * Resolve the graph data.
     * 
     * @param pRawData - Raw data to resolve.
     * 
     * @returns Resolved data.
     */
    public convert(pRawData: TOriginalData, pParsingProcessState: CodeParserProcessState<TTokenType>): TResultData | symbol {
        // No parser skip any converter.
        if (this.mDataConverterList.length === 0) {
            return pRawData as unknown as TResultData;
        }

        // Get start and end token of graph.
        let [pStartToken, pEndToken] = pParsingProcessState.getGraphBoundingToken();

        // Fill in an empty token when no start or end token is provided.
        // That can only happen when the graph is empty.
        if(!pStartToken || !pEndToken) {
            pStartToken = new LexerToken<TTokenType>('EMPTY_GRAPH_START' as TTokenType, 'EMPTY GRAPH START', 0, 0);
            pEndToken = new LexerToken<TTokenType>('EMPTY_GRAPH_END' as TTokenType, 'EMPTY GRAPH END', 0, 0);
        }

        // Single parser, skip iteration.
        if (this.mDataConverterList.length === 1) {
            return this.mDataConverterList[0](pRawData, pStartToken, pEndToken);
        }

        // Convert data with each added data converter.
        let lData: any = pRawData;
        for (const lDataConverter of this.mDataConverterList) {
            // Convert data and skip parsing when result is a symbol (error).
            lData = lDataConverter(lData, pStartToken, pEndToken);
            if (typeof lData === 'symbol') {
                return lData;
            }
        }

        return lData as TResultData;
    }

    /**
     * Add a data converter to the graph.
     * Data converters can mutate the current data into another form.
     * 
     * @param pConverter - Data converter
     */
    public converter<TConvertedData>(pConverter: GraphDataCollector<TTokenType, TResultData, TConvertedData>): Graph<TTokenType, TOriginalData, TConvertedData> {
        const lNewGraph: Graph<TTokenType, TOriginalData, TConvertedData> = new Graph<TTokenType, TOriginalData, TConvertedData>(this.mGraphCollector);

        // Add all previous data converters and the new converter to the new graph.
        lNewGraph.mDataConverterList.push(...this.mDataConverterList, pConverter);

        return lNewGraph;
    }
}

type GraphNodeCollector<TTokenType extends string = string, TResultData extends object = object> = () => GraphNode<TTokenType, TResultData>;
type GraphDataCollector<TTokenType extends string, TCurrentData = any, TResult = any> = (pRawData: TCurrentData, pStartToken: LexerToken<TTokenType>, pEndToken: LexerToken<TTokenType>) => TResult | symbol;

export type GraphRef<TResultType> = Graph<string, any, TResultType>;