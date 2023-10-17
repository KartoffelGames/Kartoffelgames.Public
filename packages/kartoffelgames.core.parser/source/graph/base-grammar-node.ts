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

    public loop(pPath?: SingleTokenPath<TTokenType>) {

    }

    public optional(pPath?: SingleTokenPath<TTokenType>) {

    }

    public or(pPath: MultiTokenPath<TTokenType>) {

    }

    public then(pPath?: SingleTokenPath<TTokenType>) {

    }

    public end(pResultName: string, pResultCollector: any) {

    }

    public trunk() {

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