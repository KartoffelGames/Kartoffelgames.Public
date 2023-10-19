import { BaseGrammarNode } from '../base-grammar-node';
import { BaseGrammarTokenNode } from '../base-grammar-token-node';
import { GrammarNodeType } from '../grammar-branch-reference.enum';

export class GrammarThenNode<TTokenType extends string> extends BaseGrammarTokenNode<TTokenType>{
    private readonly mTokenBranch: SingleTokenPath<TTokenType>;

    /**
     * Grammar node type.
     */
    public get type(): GrammarNodeType {
        return GrammarNodeType.Then;
    }


    public constructor(pNextToken: SingleTokenPath<TTokenType>, pValueIdentifier?: string) {
        super(pValueIdentifier);

        this.mTokenBranch = pNextToken;
    }

    /**
     * Deep clone grammer node. Clones chained nodes as well.
     * 
     * @returns Cloned void node with cloned chain node.
     */
    public override clone(): GrammarThenNode<TTokenType> {
        const lClonedNode: GrammarThenNode<TTokenType> = new GrammarThenNode<TTokenType>(this.mTokenBranch, this.valueIdentifier ?? undefined);
        if (this.chainedNode) {
            lClonedNode.chain(this.chainedNode.clone());
        }

        return lClonedNode;
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
        // Check if token branch is a single token type or a complete branch..
        if (typeof this.mTokenBranch === 'function') {
            // Read start end end of branch. Use a copy to not change any source data.
            const lBranchEndNode: BaseGrammarNode<TTokenType> = this.mTokenBranch().clone();
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
        // Check if token branch is a single token type or a complete branch..
        if (typeof this.mTokenBranch === 'function') {
            // Read root node of branch.
            const lBranchEndNode: BaseGrammarNode<TTokenType> = this.mTokenBranch().branchRoot;

            // Validate token for root node of branch.
            return lBranchEndNode.validFor(pToken);
        }

        // Or validate node type is the same.
        return this.mTokenBranch === pToken;
    }
}

type SingleTokenPath<TTokenType> = TTokenType | SingleTokenPathFunction<TTokenType>;
type SingleTokenPathFunction<TTokenType> = () => BaseGrammarNode<TTokenType>;