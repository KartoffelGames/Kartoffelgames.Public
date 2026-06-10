import { Exception } from "@kartoffelgames/core";
import { PotatnoProject } from '../potatno-project.ts';
import { PotatnoNodeDefinition } from './potatno-node-definition.ts';

export class ValueConjunctionNodeDefinition<TProject extends PotatnoProject> extends PotatnoNodeDefinition<TProject> {
    /**
     * Stable definition id for this built-in node. Exposed so the code
     * generator can detect conjunction nodes and skip them during walks.
     */
    public static readonly DEFINITION_ID: string = 'a579584d-5d35-42b5-b2ba-3daddee488e0';

    /**
     * Constructor.
     */
    public constructor() {
        super({
            id: ValueConjunctionNodeDefinition.DEFINITION_ID,
            label: 'Value Conjunction',
            category: 'Conjunction',
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
