import { BaseGrammarNode } from '../base-grammar-node';
import { GrammarNodeType } from '../grammar-node-type.enum';

/**
 * Empty grammar node. Hold no data and does not chain.
 * 
 * @public
 */
export class GrammarTrunkNode<TTokenType> extends BaseGrammarNode<TTokenType> {
    /**
     * Grammar node type.
     */
    public get type(): GrammarNodeType {
        return GrammarNodeType.Trunk;
    }

    public create(pEndpointData: Record<string, any>): any {
        // TODO: Run own parser function that should build own data object with all endpoint data.
    }

    public override retrieveNextFor(pToken: TTokenType) {
        throw new Error('Method not implemented.');
    }
}