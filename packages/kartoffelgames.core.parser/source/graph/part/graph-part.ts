import type { LexerToken } from '../../lexer/lexer-token.ts';
import type { BaseGrammarNode } from '../node/base-grammar-node.ts';

/**
 * Graph part.
 * 
 * @typeparam TTokenType - Type of all tokens the graph part can handle.
 */
export class GraphPart<TTokenType extends string, TResult extends object = object> {
    private readonly mDataCollector: GraphPartDataCollector<TTokenType, TResult> | null;
    private readonly mRootNode: BaseGrammarNode<TTokenType>;

    /**
     * Graph part data collector.
     */
    public get dataCollector(): GraphPartDataCollector<TTokenType, TResult> | null {
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
    public constructor(pGraph: BaseGrammarNode<TTokenType, TResult>, pCollector?: GraphPartDataCollector<TTokenType, TResult>) {
        this.mRootNode = pGraph.branchRoot;
        this.mDataCollector = pCollector ?? null;
    }
}

export type GraphPartDataCollector<TTokenType extends string, TRawData extends object> = (pRawData: TRawData, pStartToken: LexerToken<TTokenType> | undefined, pEndToken: LexerToken<TTokenType> | undefined) => unknown;