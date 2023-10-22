import { Exception } from '@kartoffelgames/core.data';
import { GrammarBranchNode } from './branch_nodes/grammar-branch-node';
import { GrammarOptionalNode } from './branch_nodes/grammar-optional-node';
import { GrammarThenNode } from './branch_nodes/grammar-then-node';
import { GrammarNodeType } from './grammar-node-type.enum';
import { BaseGrammarTokenNode } from './base-grammar-token-node';

export abstract class BaseGrammarNode<TTokenType> {
    private mChainedNode: BaseGrammarNode<TTokenType> | null | undefined;
    private readonly mNodeType: GrammarNodeType;
    private readonly mParentNode: BaseGrammarNode<TTokenType> | null;

    /**
     * Get the root node of this branch.
     */
    public get branchRoot(): GrammarBranchNode<TTokenType> {
        // Get parent of parent when a parent exists.
        // Real cool property recursion.
        if (this.mParentNode) {
            return this.mParentNode.branchRoot;
        }

        if (!(this instanceof GrammarBranchNode)) {
            throw new Exception('Branch root is not a GrammarBranchNode. Something very bad happened', this);
        }

        // When no parent exists, you have offically reached the endpoint (root).
        return this;
    }

    /**
     * Type of grammar token.
     */
    public get type(): GrammarNodeType {
        return this.mNodeType;
    }

    /**
     * Chained node that was chained after.
     * 
     * @remarks
     * Is set when calling {@link BaseGrammarNode.optional},
     * {@link BaseGrammarNode.or}, {@link BaseGrammarNode.end}, {@link BaseGrammarNode.then} or {@link BaseGrammarNode.trunk}
     * 
     * @internal
     */
    protected get chainedNode(): BaseGrammarNode<TTokenType> | null {
        // Branch was not ended or nothing was chanied.
        if (typeof this.mChainedNode === 'undefined') {
            throw new Exception(`Chain end reached. Chain was not closed or nothing was after this node chained.`, this);
        }

        return this.mChainedNode;
    }

    /**
     * Constructor.
     */
    constructor(pNodeType: GrammarNodeType, pParentNode: BaseGrammarNode<TTokenType>) {
        this.mNodeType = pNodeType;
        this.mParentNode = pParentNode;

        this.mChainedNode = undefined;
    }

    /**
     * Ends the branch.
     */
    public end(): void {
        this.mChainedNode = null;
    }

    public optional(pPath?: SingleTokenPath<TTokenType>, pValueIdentifier?: string): GrammarOptionalNode<TTokenType> {

    }

    public then(pNextToken: SingleTokenPath<TTokenType>, pValueIdentifier?: string): GrammarThenNode<TTokenType> {

    }

    /**
     * Chain node after this node.
     * @param pNode - Grammar node.
     */
    private chain(pNode: BaseGrammarNode<TTokenType>): void {
        // Prevent chain override.
        if (typeof this.mChainedNode !== 'undefined') {
            throw new Exception(`Node couldn't be changed. Branch has already a chained node or was ended.`, this);
        }

        this.mChainedNode = pNode;
    }

    /**
     * Retrieve next grammer node for the next token.
     * When this returns false, this path, node or branch should not be used to process with this token.
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
    public abstract retrieveNext(pToken: TTokenType, pParentNode: BaseGrammarTokenNode<TTokenType>): BaseGrammarNode<TTokenType> | null;

    /**
     * Check if this node can handle the specified token type.
     * 
     * @param pToken - Token type that this node can handle.
     */
    public abstract validFor(pToken: TTokenType): boolean;
}