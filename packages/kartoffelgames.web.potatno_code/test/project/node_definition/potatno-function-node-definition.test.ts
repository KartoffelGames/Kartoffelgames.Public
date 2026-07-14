import { expect } from '@kartoffelgames/core-test';
import { PotatnoDocument } from '../../../source/document/potatno-document.ts';
import { PotatnoFunctionNodeDefinition } from '../../../source/project/node_definition/potatno-function-node-definition.ts';
import { PotatnoHelper } from '../../helper/potatno-helper.ts';
import type { PotatnoTestProjectTypesDefinition } from '../../helper/potatno_test_project/potatno-test-project-types-definition.ts';

Deno.test('new PotatnoFunctionNodeDefinition()', async (pContext) => {
    await pContext.step('Constructs from document function identity', () => {
        // Setup.
        const lDocument = new PotatnoDocument<PotatnoTestProjectTypesDefinition>(PotatnoHelper.TEST_PROJECT);
        const lFunction = PotatnoHelper.newHelperFunction(lDocument, 'FunctionOne', 'Function One');

        // Process.
        const lDefinition = new PotatnoFunctionNodeDefinition(lFunction);

        // Evaluation.
        expect(lDefinition.id).toBe('USERFUNCTION_FunctionOne');
        expect(lDefinition.label).toBe('Function One');
        expect(lDefinition.category.name).toBe('user function');
        expect(lDefinition.category.icon).toBe('ƒ');
        expect(lDefinition.function).toBe(lFunction);
    });

    await pContext.step('Creates value ports from function signature', () => {
        // Setup.
        const lDocument = new PotatnoDocument<PotatnoTestProjectTypesDefinition>(PotatnoHelper.TEST_PROJECT);
        const lFunction = PotatnoHelper.newHelperFunction(lDocument, 'FunctionOne', 'Function One');
        lFunction.addInput({ label: 'inputNumber', dataType: 'number' });
        lFunction.addOutput({ label: 'outputNumber', dataType: 'number' });

        // Process.
        const lDefinition = new PotatnoFunctionNodeDefinition(lFunction);

        // Evaluation.
        expect(lDefinition.inputs.length).toBe(1);
        expect(lDefinition.inputs[0].id).toBe('inputNumber');
        expect(lDefinition.inputs[0].portType).toBe('value');
        expect(lDefinition.inputs[0].dataType).toBe('number');
        expect(lDefinition.outputs.length).toBe(1);
        expect(lDefinition.outputs[0].id).toBe('outputNumber');
        expect(lDefinition.outputs[0].portType).toBe('value');
        expect(lDefinition.outputs[0].dataType).toBe('number');
    });

    await pContext.step('Creates flow ports when function has no outputs', () => {
        // Setup.
        const lDocument = new PotatnoDocument<PotatnoTestProjectTypesDefinition>(PotatnoHelper.TEST_PROJECT);
        const lFunction = PotatnoHelper.newHelperFunction(lDocument, 'FunctionOne', 'Function One');

        // Process.
        const lDefinition = new PotatnoFunctionNodeDefinition(lFunction);

        // Evaluation.
        expect(lDefinition.inputs.length).toBe(1);
        expect(lDefinition.inputs[0].id).toBe('Input');
        expect(lDefinition.inputs[0].portType).toBe('flow');
        expect(lDefinition.outputs.length).toBe(1);
        expect(lDefinition.outputs[0].id).toBe('Output');
        expect(lDefinition.outputs[0].portType).toBe('flow');
    });
});

Deno.test('PotatnoFunctionNodeDefinition.function', async (pContext) => {
    await pContext.step('Returns mirrored document function', () => {
        // Setup.
        const lDocument = new PotatnoDocument<PotatnoTestProjectTypesDefinition>(PotatnoHelper.TEST_PROJECT);
        const lFunction = PotatnoHelper.newHelperFunction(lDocument, 'FunctionOne', 'Function One');
        const lDefinition = new PotatnoFunctionNodeDefinition(lFunction);

        // Process.
        const lResult = lDefinition.function;

        // Evaluation.
        expect(lResult).toBe(lFunction);
    });
});

Deno.test('PotatnoFunctionNodeDefinition.label', async (pContext) => {
    await pContext.step('Returns current document function label', () => {
        // Setup.
        const lDocument = new PotatnoDocument<PotatnoTestProjectTypesDefinition>(PotatnoHelper.TEST_PROJECT);
        const lFunction = PotatnoHelper.newHelperFunction(lDocument, 'FunctionOne', 'Function One');
        const lDefinition = new PotatnoFunctionNodeDefinition(lFunction);
        lFunction.label = 'Renamed Function';

        // Process.
        const lResult: string = lDefinition.label;

        // Evaluation.
        expect(lResult).toBe('Renamed Function');
    });
});

Deno.test('PotatnoFunctionNodeDefinition.codeGenerator', async (pContext) => {
    await pContext.step('Delegates to mirrored function definition value generator', () => {
        // Setup.
        const lDocument = new PotatnoDocument<PotatnoTestProjectTypesDefinition>(PotatnoHelper.TEST_PROJECT);
        const lFunction = PotatnoHelper.newHelperFunction(lDocument, 'FunctionOne', 'FunctionOne');
        const lDefinition = new PotatnoFunctionNodeDefinition(lFunction);

        // Process.
        const lResult: string = lDefinition.codeGenerator({
            inputs: {},
            outputs: {
                exec: {
                    value: '',
                    code: {
                        inner: 'NextCode'
                    }
                }
            },
            code: {
                next: ''
            }
        });

        // Evaluation.
        expect(lResult).toBe('FunctionOne(); NextCode');
    });
});
