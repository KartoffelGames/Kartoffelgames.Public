import { Exception } from "@kartoffelgames/core";
import { NodeCategory } from '../../parser/node/node-category.enum.ts';
import { PotatnoProject } from '../potatno-project.ts';
import { PotatnoNodeDefinition } from './potatno-node-definition.ts';

export class ValueConjunctionNodeDefinition<TProject extends PotatnoProject<any>> extends PotatnoNodeDefinition<TProject> {
    /**
     * Create a new ValueConjunctionNodeDefinition.
     */
    public static newConjunctionNode<TProject extends PotatnoProject<any>>(): ValueConjunctionNodeDefinition<TProject> {
        return new ValueConjunctionNodeDefinition<TProject>();
    }

    /**
     * Constructor.
     */
    protected constructor() {
        super({
            id: 'a579584d-5d35-42b5-b2ba-3daddee488e0',
            label: 'Value Conjunction',
            category: NodeCategory.Reroute,
            generators: {
                ports: {
                    inputs: (pAddPort) => {
                        pAddPort({ label: 'in', id: 'in', portType: 'value', dataType: '<T>' });
                    },
                    outputs: (pAddPort) => {
                        pAddPort({ label: 'out', id: 'out', portType: 'value', dataType: '<T>' });
                    }
                },
                code: () => { throw new Exception('Conjunction node code generators should never be called.', ValueConjunctionNodeDefinition); }
            }
        });
    }
}
