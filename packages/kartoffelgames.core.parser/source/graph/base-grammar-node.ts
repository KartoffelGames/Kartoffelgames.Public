import { GrammarEndNode } from './chain_nodes/grammar-end-node';
import { GrammarLoopNode } from './chain_nodes/grammar-loop-node';
import { GrammarOptionalNode } from './chain_nodes/grammar-optional-node';
import { GrammarOrNode } from './chain_nodes/grammar-or-node';
import { GrammarThenNode } from './chain_nodes/grammar-then-node';
import { GrammarTrunkNode } from './chain_nodes/grammar-trunk-node';
import { GrammarNodeType } from './grammar-node-type.enum';

export abstract class BaseGrammarNode<TTokenType> {
    private mChainedNode: BaseGrammarNode<TTokenType> | null;

    /**
     * Type of grammar token.
     */
    public abstract readonly type: GrammarNodeType;

    /**
     * Chained node that was chained after.
     * 
     * @remarks
     * Is set when calling, {@link BaseGrammarNode.loop}, {@link BaseGrammarNode.optional},
     * {@link BaseGrammarNode.or}, {@link BaseGrammarNode.end}, {@link BaseGrammarNode.then} or {@link BaseGrammarNode.trunk}
     */
    protected get chainedNode(): BaseGrammarNode<TTokenType> | null {
        return this.mChainedNode;
    }

    /**
     * Constructor.
     */
    constructor() {
        this.mChainedNode = null;
    }

    public loop(pPath?: SingleTokenPath<TTokenType>): GrammarLoopNode<TTokenType> {

    }

    public optional(pPath?: SingleTokenPath<TTokenType>): GrammarOptionalNode<TTokenType> {

    }

    public or(pPath: MultiTokenPath<TTokenType>): GrammarOrNode<TTokenType> {

    }

    public then(pPath?: SingleTokenPath<TTokenType>): GrammarThenNode<TTokenType> {

    }

    public end(pPath?: SingleTokenPath<TTokenType>, pResultName: string, pResultCollector: any): GrammarEndNode<TTokenType> {

    }

    public trunk(): GrammarTrunkNode<TTokenType> {

    }

    /**
     * Retrieve next grammer node for the next token.
     * 
     * @param pToken - Token type that the next path should take.
     * 
     * @internal
     */
    public abstract retrieveNextFor(pToken: TTokenType): BaseGrammarNode<TTokenType> | null;
}

type SingleTokenPath<TTokenType> = TTokenType | SingleTokenPathFunction<TTokenType>;
type SingleTokenPathFunction<TTokenType> = () => (TTokenType | BaseGrammarNode<TTokenType>);

type MultiTokenPath<TTokenType> = () => (Array<BaseGrammarNode<TTokenType>>);