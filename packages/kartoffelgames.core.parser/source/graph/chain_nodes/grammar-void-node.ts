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
     * Grammar node type.
     */
    public get type(): GrammarNodeType {
        return GrammarNodeType.Void;
    }
    
    /**
     * Retrive next grammar node for the specified type of token.
     * 
     * @param pToken - Current token.
     * @returns Forwarded {@link BaseGrammarNode.retrieveNextFor} call of the chained node or null when no node was chained.
     */
    public override retrieveNextFor(pToken: TTokenType): BaseGrammarNode<TTokenType> | null {
        // Nothing when nothing was chained. Could be an error.
        if(!this.chainedNode){
            return null;
        }

        // Forward token node request.
        return this.chainedNode.retrieveNextFor(pToken);
    }
}