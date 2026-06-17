import { PotatnoStaticNodeDefinition } from '../../../../source/project/node_definition/potatno-static-node-definition.ts';
import { PotatnoImportDefinition } from '../../../../source/project/potatno-import-definition.ts';
import type { CanvasProjectTypesDefinition } from '../canvas-project-types-definition.ts';

/**
 * Time import definition for the canvas shader playground.
 */
export class CanvasProjectTimeImportDefinition extends PotatnoImportDefinition<CanvasProjectTypesDefinition> {
    /**
     * Create the time import definition.
     */
    public constructor() {
        super('Time', 'Time');

        // Register time value nodes.
        this.addNode(new PotatnoStaticNodeDefinition({
            id: 'CurrentTime',
            label: 'CurrentTime',
            category: 'value',
            ports: {
                inputs: [],
                outputs: [
                    { label: 'seconds', id: 'seconds', portType: 'value', dataType: 'number' }
                ]
            },
            generators: {
                code: (pContext): string => `const ${pContext.outputs['seconds'].value} = (performance.now() / 1000);`
            }
        }));
    }
}
