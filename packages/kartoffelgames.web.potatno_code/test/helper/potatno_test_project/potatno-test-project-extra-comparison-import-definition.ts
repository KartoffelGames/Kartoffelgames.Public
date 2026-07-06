import { PotatnoStaticNodeDefinition } from '../../../source/project/node_definition/potatno-static-node-definition.ts';
import { PotatnoImportDefinition } from '../../../source/project/potatno-import-definition.ts';
import type { PotatnoTestProjectTypesDefinition } from './potatno-test-project-types-definition.ts';

/**
 * Extra comparison import definition for the PotatnoCode test project.
 */
export class PotatnoTestProjectExtraComparisonImportDefinition extends PotatnoImportDefinition<PotatnoTestProjectTypesDefinition> {
    /**
     * Create the extra comparison import definition.
     */
    public constructor() {
        super('ExtraComparison', 'Extra Comparison');

        // Register extra comparison nodes.
        this.addNode(new PotatnoStaticNodeDefinition({
            id: 'GreaterOrEqual',
            label: 'greaterOrEqual',
            category: { name: 'operator' },
            ports: {
                inputs: [
                    { label: 'a', id: 'a', portType: 'value', dataType: 'number' },
                    { label: 'b', id: 'b', portType: 'value', dataType: 'number' }
                ],
                outputs: [
                    { label: 'result', id: 'result', portType: 'value', dataType: 'boolean' }
                ]
            },
            generators: {
                code: (pContext): string => `const ${pContext.outputs['result'].value} = ${pContext.inputs['a'].value} >= ${pContext.inputs['b'].value};`
            }
        }));
        this.addNode(new PotatnoStaticNodeDefinition({
            id: 'SmallerOrEqual',
            label: 'smallerOrEqual',
            category: { name: 'operator' },
            ports: {
                inputs: [
                    { label: 'a', id: 'a', portType: 'value', dataType: 'number' },
                    { label: 'b', id: 'b', portType: 'value', dataType: 'number' }
                ],
                outputs: [
                    { label: 'result', id: 'result', portType: 'value', dataType: 'boolean' }
                ]
            },
            generators: {
                code: (pContext): string => `const ${pContext.outputs['result'].value} = ${pContext.inputs['a'].value} <= ${pContext.inputs['b'].value};`
            }
        }));
    }
}
