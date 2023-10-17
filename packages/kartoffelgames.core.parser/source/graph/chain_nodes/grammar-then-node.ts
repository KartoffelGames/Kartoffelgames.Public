import { BaseGrammarNode } from '../base-grammar-node';
import { GrammarNodeType } from '../grammar-node-type.enum';

export class GrammarThenNode<TTokenType> extends BaseGrammarNode<TTokenType>{
    /**
     * Grammar node type.
     */
    public get type(): GrammarNodeType {
        return GrammarNodeType.Then;
    }

    /**
     * Retrieve chained node but only when it has the specified token type. 
     * 
     * @param pToken - The token type the next node should have.
     * 
     * @returns The next chained node with the specified node type. 
     * When nothing is changed or the node type does not match, null is returned.
     */
    public override retrieveNextFor(pToken: TTokenType): BaseGrammarNode<TTokenType> | null {
        // No chained set.
        if(!this.chainedNode) {
            return null;
        }

        // Validate chained node type.
        if(this.chainedNode.tokenType !== pToken){
            return null;
        }

        return this.chainedNode;
    }
}