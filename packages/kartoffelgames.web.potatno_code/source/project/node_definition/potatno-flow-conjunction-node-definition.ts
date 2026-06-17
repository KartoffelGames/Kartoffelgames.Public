import { Exception } from '@kartoffelgames/core';
import type { PotatnoProjectTypesDefinition } from '../potatno-project-types-definition.ts';
import { PotatnoNodeDefinition } from './potatno-node-definition.ts';

export class FlowConjunctionNodeDefinition<TProjectTypes extends PotatnoProjectTypesDefinition> extends PotatnoNodeDefinition<TProjectTypes> {
    /**
     * Stable definition id for this built-in node. Exposed so the code
     * generator can detect conjunction nodes and skip them during walks.
     */
    public static readonly DEFINITION_ID: string = '23e9319b-3b62-4dd8-858a-17d97ddee94e';

    /**
     * Constructor.
     */
    public constructor() {
        super({
            id: FlowConjunctionNodeDefinition.DEFINITION_ID,
            label: 'Flow Conjunction',
            category: 'Conjunction',
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
