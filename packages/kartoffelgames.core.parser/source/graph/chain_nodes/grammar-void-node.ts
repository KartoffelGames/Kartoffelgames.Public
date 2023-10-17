import { Exception } from '@kartoffelgames/core.data';
import { BaseGrammarNode } from '../base-grammar-node';
import { GrammarNodeType } from '../grammar-node-type.enum';

/**
 * Empty grammar node. Hold no data and does only forward {@link BaseGrammarNode.retrieveNextFor} calls.
 * They should only appear as the starting node of a chain and no where else.
 * 
 * @public
 */
export class GrammarVoidNode<TTokenType> extends BaseGrammarNode<TTokenType> {
    /**
     * Forwarded grammar node type.
     * 
     * @throws {@link Exception}
     * When no node was chained on this void node.
     */
    public get type(): GrammarNodeType {
        if (!this.chainedNode) {
            throw new Exception('Grammer void nodes needs a chained grammer node.', this);
        }

        return this.chainedNode.type;
    }

    /**
     * Retrive next grammar node for the specified type of token.
     * 
     * @param pToken - Current token.
     * 
     * @returns Forwarded {@link BaseGrammarNode.retrieveNextFor} call of the chained node.
     * 
     * @throws {@link Exception}
     * When no node was chained on this void node.
     */
    public override retrieveNextFor(pToken: TTokenType): BaseGrammarNode<TTokenType> | null {
        // Nothing when nothing was chained. Could be an error.
        if (!this.chainedNode) {
            throw new Exception('Grammer void nodes needs a chained grammer node.', this);
        }

        // Forward token node request.
        return this.chainedNode.retrieveNextFor(pToken);
    }
}