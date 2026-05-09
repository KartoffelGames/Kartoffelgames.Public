import { Exception } from "@kartoffelgames/core";
import { NodeCategory } from '../../parser/node/node-category.enum.ts';
import { PotatnoProject } from '../potatno-project.ts';
import { PotatnoNodeDefinition } from './potatno-node-definition.ts';

export class ValueConjunctionNodeDefinition<TProject extends PotatnoProject<any>> extends PotatnoNodeDefinition<TProject> {
    /**
     * Create a new ValueConjunctionNodeDefinition.
     */
    public static new<TProject extends PotatnoProject<any>>(): ValueConjunctionNodeDefinition<TProject> {
        return new ValueConjunctionNodeDefinition<TProject>();
    }

    /**
     * Constructor.
     */
    protected constructor() {
        super({
            id: '8b2e4a6c-1f3d-4750-a9e2-7c5b0d8f3e4a',
            label: 'Value Conjunction',
            category: NodeCategory.Reroute,
            generators: {
                ports: {
                    inputs: () => {
                        return [{ label: 'in', id: 'in', portType: 'value', dataType: '<T>' }];
                    },
                    outputs: () => {
                        return [{ label: 'out', id: 'out', portType: 'value', dataType: '<T>' }];
                    }
                },
                code: () => { throw new Exception('Conjunction node code generators should never be called.', ValueConjunctionNodeDefinition); }
            }
        });
    }
}
