import { Exception } from "@kartoffelgames/core";
import { NodeCategory } from '../../parser/node/node-category.enum.ts';
import { PotatnoProject } from '../potatno-project.ts';
import { PotatnoNodeDefinition } from './potatno-node-definition.ts';

export class FlowConjunctionNodeDefinition<TProject extends PotatnoProject<any>> extends PotatnoNodeDefinition<TProject> {
    /**
     * Create a new FlowConjunctionNodeDefinition.
     */
    public static newConjunctionNode<TProject extends PotatnoProject<any>>(): FlowConjunctionNodeDefinition<TProject> {
        return new FlowConjunctionNodeDefinition<TProject>();
    }

    /**
     * Constructor.
     */
    protected constructor() {
        super({
            id: '23e9319b-3b62-4dd8-858a-17d97ddee94e',
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
