import { expect } from '@kartoffelgames/core-test';
import { PotatnoDynamicNodeDefinition } from '../../../source/project/node_definition/potatno-dynamic-node-definition.ts';
import type { PotatnoTestProjectTypesDefinition } from '../../helper/potatno_test_project/potatno-test-project-types-definition.ts';

Deno.test('new PotatnoDynamicNodeDefinition()', async (pContext) => {
    await pContext.step('Constructs from dynamic generators', () => {
        // Setup.
        let lInputCallCount: number = 0;
        const lCodeGenerator = (): string => 'DynamicCode';

        // Process.
        const lDefinition = new PotatnoDynamicNodeDefinition<PotatnoTestProjectTypesDefinition>({
            id: 'DynamicNode',
            label: 'Dynamic Node',
            category: {
                name: 'DynamicCategory'
            },
            regions: { requires: ['RegionRequired'] },
            generators: {
                ports: {
                    inputs: (pAddPort): void => {
                        lInputCallCount++;
                        pAddPort({ id: `input${lInputCallCount}`, label: `Input ${lInputCallCount}`, portType: 'value', dataType: 'number' });
                    },
                    outputs: (pAddPort): void => {
                        pAddPort({ id: 'result', label: 'Result', portType: 'value', dataType: 'number' });
                    }
                },
                code: lCodeGenerator
            }
        });

        // Evaluation.
        expect(lDefinition.id).toBe('DynamicNode');
        expect(lDefinition.label).toBe('Dynamic Node');
        expect(lDefinition.category.name).toBe('DynamicCategory');
        expect(lDefinition.category.icon).toBe('◆');
        expect(lDefinition.inputs[0].id).toBe('input1');
        expect(lDefinition.inputs[0].id).toBe('input2');
        expect(lDefinition.outputs[0].id).toBe('result');
        expect(lDefinition.regions.requires).toEqual(['RegionRequired']);
        expect(lDefinition.codeGenerator).toBe(lCodeGenerator);
    });

    await pContext.step('Constructs from dynamic generators and icon', () => {
        // Setup.
        let lInputCallCount: number = 0;
        const lCodeGenerator = (): string => 'DynamicCode';

        // Process.
        const lDefinition = new PotatnoDynamicNodeDefinition<PotatnoTestProjectTypesDefinition>({
            id: 'DynamicNode',
            label: 'Dynamic Node',
            category: {
                name: 'DynamicCategory',
                icon: 'what'
            },
            regions: { requires: ['RegionRequired'] },
            generators: {
                ports: {
                    inputs: (pAddPort): void => {
                        lInputCallCount++;
                        pAddPort({ id: `input${lInputCallCount}`, label: `Input ${lInputCallCount}`, portType: 'value', dataType: 'number' });
                    },
                    outputs: (pAddPort): void => {
                        pAddPort({ id: 'result', label: 'Result', portType: 'value', dataType: 'number' });
                    }
                },
                code: lCodeGenerator
            }
        });

        // Evaluation.
        expect(lDefinition.id).toBe('DynamicNode');
        expect(lDefinition.label).toBe('Dynamic Node');
        expect(lDefinition.category.name).toBe('DynamicCategory');
        expect(lDefinition.category.icon).toBe('what');
        expect(lDefinition.inputs[0].id).toBe('input1');
        expect(lDefinition.inputs[0].id).toBe('input2');
        expect(lDefinition.outputs[0].id).toBe('result');
        expect(lDefinition.regions.requires).toEqual(['RegionRequired']);
        expect(lDefinition.codeGenerator).toBe(lCodeGenerator);
    });
});
