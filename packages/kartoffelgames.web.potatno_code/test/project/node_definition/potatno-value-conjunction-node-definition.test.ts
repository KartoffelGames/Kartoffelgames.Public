import { expect } from '@kartoffelgames/core-test';
import { ValueConjunctionNodeDefinition } from '../../../source/project/node_definition/potatno-value-conjunction-node-definition.ts';
import type { PotatnoTestProjectTypesDefinition } from '../../helper/potatno_test_project/potatno-test-project-types-definition.ts';

Deno.test('ValueConjunctionNodeDefinition.DEFINITION_ID', async (pContext) => {
    await pContext.step('Returns stable definition id', () => {
        // Setup. Process.
        const lResult: string = ValueConjunctionNodeDefinition.DEFINITION_ID;

        // Evaluation.
        expect(lResult).toBe('a579584d-5d35-42b5-b2ba-3daddee488e0');
    });
});

Deno.test('new ValueConjunctionNodeDefinition()', async (pContext) => {
    await pContext.step('Constructs value conjunction ports', () => {
        // Setup. Process.
        const lDefinition = new ValueConjunctionNodeDefinition<PotatnoTestProjectTypesDefinition>();

        // Evaluation.
        expect(lDefinition.id).toBe(ValueConjunctionNodeDefinition.DEFINITION_ID);
        expect(lDefinition.label).toBe('Value Conjunction');
        expect(lDefinition.category).toBe('Conjunction');
        expect(lDefinition.inputs.length).toBe(1);
        expect(lDefinition.inputs[0].id).toBe('in');
        expect(lDefinition.inputs[0].portType).toBe('value');
        expect(lDefinition.inputs[0].dataType).toBe('<T>');
        expect(lDefinition.outputs.length).toBe(1);
        expect(lDefinition.outputs[0].id).toBe('out');
        expect(lDefinition.outputs[0].portType).toBe('value');
        expect(lDefinition.outputs[0].dataType).toBe('<T>');
    });

    await pContext.step('Error - Code generator is not callable for conjunction nodes', () => {
        // Setup.
        const lDefinition = new ValueConjunctionNodeDefinition<PotatnoTestProjectTypesDefinition>();

        // Process.
        const lAction = (): void => {
            lDefinition.codeGenerator({ inputs: {}, outputs: {}, code: { next: '' } });
        };

        // Evaluation.
        expect(lAction).toThrow('Conjunction node code generators should never be called.');
    });
});
