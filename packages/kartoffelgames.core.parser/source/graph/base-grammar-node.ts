import { GrammarEndNode } from './chain_nodes/grammar-end-node';
import { GrammarOptionalNode } from './chain_nodes/grammar-optional-node';
import { GrammarOrNode } from './chain_nodes/grammar-or-node';
import { GrammarThenNode } from './chain_nodes/grammar-then-node';
import { GrammarTrunkNode } from './chain_nodes/grammar-trunk-node';
import { GrammarNodeType } from './grammar-node-type.enum';

export abstract class BaseGrammarNode<TTokenType> {
    private mChainedNode: BaseGrammarNode<TTokenType> | null;
    private mParentNode: BaseGrammarNode<TTokenType> | null;

    /**
     * Type of grammar token.
     */
    public abstract readonly type: GrammarNodeType;

    /**
     * Get the root node of this branch.
     */
    public get branchRoot(): BaseGrammarNode<TTokenType> {
        // Get parent of parent when a parent exists.
        // Real cool property recursion.
        if(this.mParentNode){
            return this.mParentNode.branchRoot;
        }

        // When no parent exists, you have offically reached the endpoint (root).
        return this;
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
        return this.mChainedNode;
    }

    /**
     * Constructor.
     */
    constructor() {
        this.mChainedNode = null;
        this.mParentNode = null;
    }

    /**
     * Chain node after this node.
     * @param pNode - Grammar node.
     */
    public chain(pNode: BaseGrammarNode<TTokenType>): void {
        this.mChainedNode = pNode;
        pNode.mParentNode = this;
    }


    public optional(pPath?: SingleTokenPath<TTokenType>, pValueIdentifier?: string): GrammarOptionalNode<TTokenType> {

    }

    public or(pPath: MultiTokenPath<TTokenType>): GrammarOrNode<TTokenType> {

    }

    public then(pNextToken: SingleTokenPath<TTokenType>, pValueIdentifier?: string): GrammarThenNode<TTokenType> {

    }

    public end(pPath?: SingleTokenPath<TTokenType>, pResultName: string, pResultCollector: any): GrammarEndNode<TTokenType> {

    }

    public trunk(): GrammarTrunkNode<TTokenType> {

    }

    /**
     * Deep clone grammer branch.
     * Clones parent and chained nodes as well.
     */
    public abstract cloneBranch(): BaseGrammarNode<TTokenType>;

    /**
     * Retrieve next grammer node for the next token.
     * 
     * @param pToken - Token type that the next path should take.
     * 
     * @internal
     */
    public abstract retrieveNextFor(pToken: TTokenType): BaseGrammarNode<TTokenType> | null;

    /**
     * Check if this node can handle the specified token type.
     * 
     * @param pToken - Token type that this node can handle.
     */
    public abstract validFor(pToken: TTokenType): boolean;
}

type SingleTokenPath<TTokenType> = TTokenType | SingleTokenPathFunction<TTokenType>;
type SingleTokenPathFunction<TTokenType> = () => (TTokenType | BaseGrammarNode<TTokenType>);

type MultiTokenPath<TTokenType> = () => (Array<BaseGrammarNode<TTokenType>>);