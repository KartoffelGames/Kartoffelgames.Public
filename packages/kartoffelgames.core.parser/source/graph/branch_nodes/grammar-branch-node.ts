import { Exception } from '@kartoffelgames/core.data';
import { BaseGrammarNode } from '../base-grammar-node';
import { BaseGrammarVoidNode } from '../base-grammar-void-node';

/**
 * Empty grammar node. Hold no data and should be used to start new chains.
 * They should be skipped and not be used to progress a lexer token.
 * 
 * @typeparam TTokenType - Underlying token types of attached parser.
 * 
 * @public
 */
export class GrammarBranchNode<TTokenType> extends BaseGrammarVoidNode<TTokenType> {
    private readonly mCollector: BranchCollectorFunction | null;

    /**
     * Branch node has a collector.
     */
    public get hasCollector(): boolean {
        return !!this.mCollector;
    }

    /**
     * Constructor.
     * Init branch start node with an optional collector.
     * 
     * @remarks
     * Collector receives all token data from nodes attached with an identifire.
     * 
     * @param pCollector 
     */
    public constructor(pCollector: BranchCollectorFunction | null = null) {
        super();

        this.mCollector = pCollector;
    }

    /**
     * Executes the data collector of this branch.
     * When child branches doesn't had any collectors, these data are processed here as well.
     * 
     * @param pData - Collected branch data.
     * 
     * @returns Bundled data from previous collected token data. 
     * 
     * @throws {@link Exception}
     * When no collector is set for this branch node.
     * 
     */
    public executeCollector(pData: Record<string, Array<string>>): any {
        if(!this.mCollector){
            throw new Exception('Branch node has no data collector', this);
        }

        return this.mCollector(pData);
    }

    /**
     * Retrieve next grammer node for the next token.
     * 
     * @param pToken - Token type that the next path should take.
     * 
     * @throws {@link Exception}
     * When no valid path exists for the specified token.
     * 
     * @returns The next grammar node of specified path or null when the end of this chain is reached.
     * 
     * @internal
     */
    public override retrieveNext(pToken: TTokenType): BaseGrammarNode<TTokenType> | null {
        // Only for valid token else null.
        if (!this.chainedNode) {
            return null;
        }

        // Chained node is not valid for 
        if (!this.chainedNode.validFor(pToken)) {
            throw new Exception('Unexpected token.', this);
        }

        // Forward token node.
        return this.chainedNode;
    }

    /**
     * Check if this node can handle the specified token type.
     * When this returns false, this path, node or branch should not be used to process with this token.
     * 
     * @param pToken - Token type that this node can handle.
     * 
     * @returns If this node is configured to proceed for the specifed token.
     * 
     * @remarks
     * Void nodes can handle every token but shouldn't proceed the process.
     * So this call, and hopefully all void nodes, simply forwards the {@link BaseGrammarNode.validFor} call of the chained node. 
     * 
     * @internal
     */
    public override validFor(pToken: TTokenType): boolean {
        // Nothing is chained. So nothing can be checked.
        if (!this.chainedNode) {
            return false;
        }

        return this.chainedNode.validFor(pToken);
    }
}

export type BranchCollectorFunction = (pData: Record<string, Array<string>>) => object;