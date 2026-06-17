import { expect } from '@kartoffelgames/core-test';
import { PotatnoStaticNodeDefinition } from '../../../source/project/node_definition/potatno-static-node-definition.ts';
import type { PotatnoTestProjectTypesDefinition } from '../../helper/potatno_test_project/potatno-test-project-types-definition.ts';

Deno.test('new PotatnoStaticNodeDefinition()', async (pContext) => {
    await pContext.step('Constructs static ports and generator', () => {
        // Setup.
        const lCodeGenerator = (): string => 'StaticCode';

        // Process.
        const lDefinition = new PotatnoStaticNodeDefinition<PotatnoTestProjectTypesDefinition>({
            id: 'StaticNode',
            label: 'Static Node',
            category: 'StaticCategory',
            regions: { add: ['RegionAdd'] },
            ports: {
                inputs: [
                    { id: 'exec', label: 'Exec', portType: 'flow' },
                    { id: 'value', label: 'Value', portType: 'value', dataType: 'number' }
                ],
                outputs: [
                    { id: 'result', label: 'Result', portType: 'value', dataType: 'number' }
                ]
            },
            generators: {
                code: lCodeGenerator
            }
        });

        // Evaluation.
        expect(lDefinition.id).toBe('StaticNode');
        expect(lDefinition.label).toBe('Static Node');
        expect(lDefinition.category).toBe('StaticCategory');
        expect(lDefinition.inputs.map((pPort) => pPort.id)).toEqual(['exec', 'value']);
        expect(lDefinition.outputs.map((pPort) => pPort.id)).toEqual(['result']);
        expect(lDefinition.regions.add).toEqual(['RegionAdd']);
        expect(lDefinition.codeGenerator).toBe(lCodeGenerator);
    });
});
