import { BaseGrammarNode } from '../base-grammar-node';
import { BaseGrammarTokenNode } from '../base-grammar-token-node';
import { GrammarBranchNode } from './grammar-branch-node';

export class GrammarThenNode<TTokenType extends string> extends BaseGrammarTokenNode<TTokenType>{
    private readonly mTokenBranchRoot: TTokenType | GrammarBranchNode<TTokenType>;


    public constructor(pNextToken: ThenTokenPath<TTokenType>, pValueIdentifier?: string) {
        super(pValueIdentifier);

        // Save token type or root of branch.
        if (typeof pNextToken === 'string') {
            this.mTokenBranchRoot = pNextToken;
        } else {
            this.mTokenBranchRoot = pNextToken.branchRoot;
        }
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
        // Check if token branch is a single token type or a complete branch..
        if (this.mTokenBranchRoot instanceof GrammarBranchNode) {
            // Read start end end of branch. Use a copy to not change any source data.
            const lBranchEndNode: BaseGrammarNode<TTokenType> = this.mTokenBranchRoot().clone();
            const lBranchStartNode: BaseGrammarNode<TTokenType> = lBranchEndNode.branchRoot;

            // Check if the next node (the branch start) can handle the next token type.
            if (!lBranchStartNode.validFor(pToken)) {
                return null;
            }

            // Clone current node and chained node to not change any source data.
            const lCurrentNodeClone: GrammarThenNode<TTokenType> = this.clone();
            const lCurrentNodeChainNodeClone: BaseGrammarNode<TTokenType> | null = this.chainedNode?.clone() ?? null;

            // Unravel branch by attaching current node at the start of the branch and current node chained node as end of branch.
            lCurrentNodeClone.chain(lBranchStartNode);
            if (lCurrentNodeChainNodeClone) {
                lBranchEndNode.chain(lCurrentNodeChainNodeClone);
            }

            return lBranchStartNode;
        }

        // No chained set.
        if (!this.chainedNode) {
            return null;
        }

        // Validate chained node type.
        if (!this.chainedNode.validFor(pToken)) {
            return null;
        }

        return this.chainedNode;
    }

    /**
     * Check if this node can handle the specified token type.
     * 
     * @param pToken - Token type that this node can handle.
     * 
     * @remarks
     * Forwards {@link BaseGrammarNode.validFor} when the next token is a branch and not a token type.  
     */
    public override validFor(pToken: TTokenType): boolean {
        // Check if token branch is a single token type or a complete branch.
        if (typeof this.mTokenBranchRoot === 'string') {
            return this.mTokenBranchRoot === pToken;
        }

        // Read root node of branch.
        const lBranchEndNode: BaseGrammarNode<TTokenType> = this.mTokenBranchRoot;

        // Validate token for root node of branch.
        return lBranchEndNode.validFor(pToken);
    }
}

type ThenTokenPath<TTokenType> = TTokenType | BaseGrammarNode<TTokenType>;