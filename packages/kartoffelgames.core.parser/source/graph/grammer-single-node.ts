import { Exception } from '@kartoffelgames/core.data';
import { BaseGrammarNode, GrammarGrapthValue } from './base-grammar-node';

export class GrammarSingleNode<TTokenType extends string> extends BaseGrammarNode<TTokenType> {
    private readonly mNodeValue: TTokenType;

    
    public constructor(pPreviousNode: BaseGrammarNode<TTokenType> | null, pNodeValue: TTokenType, pOptional: boolean, pIdentifier: string | null) {
        super(pPreviousNode, pOptional, pIdentifier);

        this.mNodeValue = pNodeValue;
    }

    public override next(pRevisited: boolean): Array<GrammarGrapthValue<TTokenType>> {
        // Restrict revisiting.
        if (pRevisited) {
            throw new Exception('Single node can not be visited again. Node holds no inner branch.', this);
        }

        return [this.nextNode];
    }

    /**
     * Get valid tokens for this node.
     * 
     * @returns All valid token types for this node.
     */
    public override validTokens(): Array<TTokenType> {
        return [this.mNodeValue];
    }
}