import { Exception } from "@kartoffelgames/core";
import { NodeCategory } from '../../parser/node/node-category.enum.ts';
import { PotatnoProject } from '../potatno-project.ts';
import { PotatnoNodeDefinition } from './potatno-node-definition.ts';

export class FlowConjunctionNodeDefinition<TProject extends PotatnoProject<any>> extends PotatnoNodeDefinition<TProject> {
    /**
     * Create a new FlowConjunctionNodeDefinition.
     */
    public static new<TProject extends PotatnoProject<any>>(): FlowConjunctionNodeDefinition<TProject> {
        return new FlowConjunctionNodeDefinition<TProject>();
    }

    /**
     * Constructor.
     */
    protected constructor() {
        super({
            id: '3f7c1a2b-5d4e-4890-b6f8-9a0c3e7d2f1b',
            label: 'Flow Conjunction',
            category: NodeCategory.Reroute,
            generators: {
                ports: {
                    inputs: () => {
                        return [{ label: 'in', id: 'in', portType: 'flow' }];
                    },
                    outputs: () => {
                        return [{ label: 'out', id: 'out', portType: 'flow' }];
                    }
                },
                code: () => { throw new Exception('Conjunction node code generators should never be called.', FlowConjunctionNodeDefinition); }
            }
        });
    }
}
