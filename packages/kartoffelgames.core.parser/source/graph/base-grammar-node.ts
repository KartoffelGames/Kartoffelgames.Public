import { GrammarNodeType } from './grammar-node-type.enum';

export abstract class BaseGrammarNode<TTokenType> {
    /**
     * Type of grammar token.
     */
    public abstract readonly type: GrammarNodeType;

    /**
     * 
     */
    constructor() {

    }

    public then(pPath?: TTokenType | SingleTokenPathFunction<TTokenType>) {

    }

    public or(pPath: MultiTokenPathFunction<TTokenType>) {
        
    }

    /**
     * Retrieve next grammer node for the next token.
     * 
     * @param pToken - Token type that the next path should take.
     * 
     * @internal
     */
    public abstract retrieveNextFor(pToken: TTokenType): BaseGrammarNode<TTokenType>;
}

type SingleTokenPathFunction<TTokenType> = () => TTokenType;

type MultiTokenPathFunction<TTokenType> = () => Array<TTokenType>;