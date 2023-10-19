import { BaseGrammarNode } from '../base-grammar-node';
import { GrammarNodeType } from '../grammar-node-type.enum';

/**
 * Empty grammar node. Hold no data and should be used to start new chains.
 * They should be skipped and not be used to progress a lexer token.
 * 
 * @typeparam TTokenType - Underlying token types of attached parser.
 * 
 * @public
 */
export class GrammarVoidNode<TTokenType> extends BaseGrammarNode<TTokenType> {
    /**
     * Void node type.
     */
    public get type(): GrammarNodeType.Void {
        return GrammarNodeType.Void;
    }

    /**
     * Deep clone grammer node. Clones chained nodes as well.
     * 
     * @returns Cloned void node with cloned chain node.
     */
    public override clone(): BaseGrammarNode<TTokenType> {
        // Clone this node and add cloned chained node as well. 
        const lClonedNode: GrammarVoidNode<TTokenType> = new GrammarVoidNode<TTokenType>();
        if (this.chainedNode) {
            lClonedNode.chain(this.chainedNode.clone());
        }

        return lClonedNode;
    }

    /**
     * Retrive next grammar node for the specified type of token.
     * 
     * @param pToken - Current token.
     * 
     * @returns Next chained node but only when it is valid.
     * 
     */
    public override retrieveNextFor(pToken: TTokenType): BaseGrammarNode<TTokenType> | null {
        // Only for valid token else null.
        if (!this.chainedNode) {
            return null;
        }

        if (!this.chainedNode.validFor(pToken)) {
            return null;
        }

        // Forward token node.
        return this.chainedNode;
    }

    /**
     * Check if this node can handle the specified token type.
     * Void nodes can handle every token but don't proceed the process.
     * 
     * @param _pToken - Token type that this node can handle.
     * 
     * @internal
     */
    public override validFor(_pToken: TTokenType): boolean {
        return true;
    }
}