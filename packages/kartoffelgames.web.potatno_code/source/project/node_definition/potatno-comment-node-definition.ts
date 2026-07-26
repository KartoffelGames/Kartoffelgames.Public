import { Exception } from '@kartoffelgames/core';
import type { PotatnoProjectTypesDefinition } from '../potatno-project-types-definition.ts';
import { PotatnoNodeDefinition } from './potatno-node-definition.ts';

export class PotatnoCommentNodeDefinition<TProjectTypes extends PotatnoProjectTypesDefinition> extends PotatnoNodeDefinition<TProjectTypes> {
    /**
     * Stable definition id for this built-in node. 
     * Exposed so the code generator can detect comment nodes and skip them during walks.
     */
    public static readonly DEFINITION_ID: string = '8124c652-3a8e-4333-b405-f905522a4610';

    /**
     * Constructor.
     */
    public constructor() {
        super({
            id: PotatnoCommentNodeDefinition.DEFINITION_ID,
            label: 'Comment',
            category: {
                name: 'Comment',
                icon: '✎'
            },
            generators: {
                ports: {
                    inputs: () => { },
                    outputs: () => { }
                },
                code: () => { throw new Exception('Comment node code generators should never be called.', PotatnoCommentNodeDefinition); }
            }
        });
    }
}
