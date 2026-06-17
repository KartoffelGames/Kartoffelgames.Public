import { expect } from '@kartoffelgames/core-test';
import { FlowConjunctionNodeDefinition } from '../../../source/project/node_definition/potatno-flow-conjunction-node-definition.ts';
import type { PotatnoTestProjectTypesDefinition } from '../../helper/potatno_test_project/potatno-test-project-types-definition.ts';

Deno.test('FlowConjunctionNodeDefinition.DEFINITION_ID', async (pContext) => {
    await pContext.step('Returns stable definition id', () => {
        // Setup. Process.
        const lResult: string = FlowConjunctionNodeDefinition.DEFINITION_ID;

        // Evaluation.
        expect(lResult).toBe('23e9319b-3b62-4dd8-858a-17d97ddee94e');
    });
});

Deno.test('new FlowConjunctionNodeDefinition()', async (pContext) => {
    await pContext.step('Constructs flow conjunction ports', () => {
        // Setup. Process.
        const lDefinition = new FlowConjunctionNodeDefinition<PotatnoTestProjectTypesDefinition>();

        // Evaluation.
        expect(lDefinition.id).toBe(FlowConjunctionNodeDefinition.DEFINITION_ID);
        expect(lDefinition.label).toBe('Flow Conjunction');
        expect(lDefinition.category).toBe('Conjunction');
        expect(lDefinition.inputs.length).toBe(1);
        expect(lDefinition.inputs[0].id).toBe('in');
        expect(lDefinition.inputs[0].portType).toBe('flow');
        expect(lDefinition.outputs.length).toBe(1);
        expect(lDefinition.outputs[0].id).toBe('out');
        expect(lDefinition.outputs[0].portType).toBe('flow');
    });

    await pContext.step('Error - Code generator is not callable for conjunction nodes', () => {
        // Setup.
        const lDefinition = new FlowConjunctionNodeDefinition<PotatnoTestProjectTypesDefinition>();

        // Process.
        const lAction = (): void => {
            lDefinition.codeGenerator({ inputs: {}, outputs: {}, code: { next: '' } });
        };

        // Evaluation.
        expect(lAction).toThrow('Conjunction node code generators should never be called.');
    });
});
