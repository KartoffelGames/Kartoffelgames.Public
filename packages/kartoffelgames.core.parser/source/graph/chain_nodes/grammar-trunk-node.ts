import { BaseGrammarNode } from '../base-grammar-node';
import { GrammarNodeType } from '../grammar-node-type.enum';

/**
 * Trunk Grammar node. 
 * Collects Data from {@link GrammarEndNode}s or other {@link GrammarTrunkNode}s and parses these data into another result type.
 * 
 * @typeparam TTokenType - Underlying token types of attached parser.
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

    public constructor(){
        super();
    }

    public create(pEndpointData: Record<string, any>): any {
        // TODO: Run own parser function that should build own data object with all endpoint data.
    }

    public override retrieveNextFor(pToken: TTokenType) {
        throw new Error('Method not implemented.');
    }
}