import { Exception } from "@kartoffelgames/core";
import { NodeCategory } from '../../parser/node/node-category.enum.ts';
import { PotatnoProject } from '../potatno-project.ts';
import { PotatnoNodeDefinition } from './potatno-node-definition.ts';

export class FlowConjunctionNodeDefinition<TProject extends PotatnoProject> extends PotatnoNodeDefinition<TProject> {
    /**
     * Stable definition id for this built-in node. Exposed so the code
     * generator can detect conjunction nodes and skip them during walks.
     */
    public static readonly DEFINITION_ID: string = '23e9319b-3b62-4dd8-858a-17d97ddee94e';

    /**
     * Create a new FlowConjunctionNodeDefinition.
     */
    public static newConjunctionNode<TProject extends PotatnoProject>(): FlowConjunctionNodeDefinition<TProject> {
        return new FlowConjunctionNodeDefinition<TProject>();
    }

    /**
     * Constructor.
     */
    protected constructor() {
        super({
            id: FlowConjunctionNodeDefinition.DEFINITION_ID,
            label: 'Flow Conjunction',
            category: NodeCategory.Reroute,
            generators: {
                ports: {
                    inputs: (pAddPort) => {
                        pAddPort({ label: 'in', id: 'in', portType: 'flow' });
                    },
                    outputs: (pAddPort) => {
                        pAddPort({ label: 'out', id: 'out', portType: 'flow' });
                    }
                },
                code: () => { throw new Exception('Conjunction node code generators should never be called.', FlowConjunctionNodeDefinition); }
            }
        });
    }
}
