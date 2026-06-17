import { expect } from '@kartoffelgames/core-test';
import type { PotatnoCodeGeneratorDocumentResult } from '../../source/parser/result/potatno-code-generator-document-result.ts';
import { PotatnoPreviewFunctionExecutor, type PotatnoPreviewFunctionExecutorPortTarget } from '../../source/preview/potatno-preview-function-executor.ts';
import { PotatnoHelper } from '../helper/potatno-helper.ts';
import type { PotatnoTestProjectTypesDefinition } from '../helper/potatno_test_project/potatno-test-project-types-definition.ts';

const gGeneratorResult = {
    entryPoint: {
        function: {
            project: {
                types: PotatnoHelper.TEST_PROJECT.types
            }
        }
    }
} as unknown as PotatnoCodeGeneratorDocumentResult<PotatnoTestProjectTypesDefinition>;

Deno.test('PotatnoPreviewFunctionExecutor.MAIN', async (pContext) => {
    await pContext.step('Returns full function preview type', () => {
        // Setup. Process.
        const lResult: string = PotatnoPreviewFunctionExecutor.MAIN;

        // Evaluation.
        expect(lResult).toBe('MAIN');
    });
});

Deno.test('new PotatnoPreviewFunctionExecutor()', async (pContext) => {
    await pContext.step('Constructs with function, defaults, types, and build callback', () => {
        // Setup. Process.
        const lExecutor = new PotatnoPreviewFunctionExecutor<PotatnoTestProjectTypesDefinition, Record<string, unknown>, 'number'>(PotatnoHelper.TEST_PROJECT.entryPoint, {
            defaultParameters: { base: 1 },
            types: ['number'],
            build: (): { execute: () => number; type: 'number' } => {
                return {
                    type: 'number',
                    execute: (): number => 1
                };
            }
        });

        // Evaluation.
        expect(lExecutor.function).toBe(PotatnoHelper.TEST_PROJECT.entryPoint);
        expect(lExecutor.defaultParameters).toEqual({ base: 1 });
        expect(lExecutor.types.has('number')).toBe(true);
    });
});

Deno.test('PotatnoPreviewFunctionExecutor.defaultParameters', async (pContext) => {
    await pContext.step('Returns configured default parameters', () => {
        // Setup.
        const lDefaultParameters = { base: 1 };
        const lExecutor = new PotatnoPreviewFunctionExecutor<PotatnoTestProjectTypesDefinition, Record<string, unknown>, 'number'>(PotatnoHelper.TEST_PROJECT.entryPoint, {
            defaultParameters: lDefaultParameters,
            types: ['number'],
            build: (): { execute: () => number; type: 'number' } => {
                return {
                    type: 'number',
                    execute: (): number => 1
                };
            }
        });

        // Process.
        const lResult = lExecutor.defaultParameters;

        // Evaluation.
        expect(lResult).toBe(lDefaultParameters);
    });
});

Deno.test('PotatnoPreviewFunctionExecutor.function', async (pContext) => {
    await pContext.step('Returns configured function definition', () => {
        // Setup.
        const lExecutor = new PotatnoPreviewFunctionExecutor<PotatnoTestProjectTypesDefinition, Record<string, unknown>, 'number'>(PotatnoHelper.TEST_PROJECT.entryPoint, {
            defaultParameters: {},
            types: ['number'],
            build: (): { execute: () => number; type: 'number' } => {
                return {
                    type: 'number',
                    execute: (): number => 1
                };
            }
        });

        // Process.
        const lResult = lExecutor.function;

        // Evaluation.
        expect(lResult).toBe(PotatnoHelper.TEST_PROJECT.entryPoint);
    });
});

Deno.test('PotatnoPreviewFunctionExecutor.types', async (pContext) => {
    await pContext.step('Returns configured result type set', () => {
        // Setup.
        const lExecutor = new PotatnoPreviewFunctionExecutor(PotatnoHelper.TEST_PROJECT.entryPoint, {
            defaultParameters: {},
            types: ['number', 'boolean'],
            build: (): { execute: () => number; type: 'number' } => {
                return {
                    type: 'number',
                    execute: (): number => 1
                };
            }
        });

        // Process.
        const lResult = lExecutor.types;

        // Evaluation.
        expect(lResult.has('number')).toBe(true);
        expect(lResult.has('boolean')).toBe(true);
    });
});

Deno.test('PotatnoPreviewFunctionExecutor.compile()', async (pContext) => {
    await pContext.step('Forwards context, generator result, and port target to build callback', () => {
        // Setup.
        const lPortTarget = { nodeHook: 'TestHook', value: 'TestValue' } as PotatnoPreviewFunctionExecutorPortTarget<PotatnoTestProjectTypesDefinition, 'number'>;
        let lCapturedDefaultParameters: Record<string, unknown> | null = null;
        let lCapturedFunctionId: string = '';
        let lCapturedGeneratorResult: PotatnoCodeGeneratorDocumentResult<PotatnoTestProjectTypesDefinition> | null = null;
        let lCapturedPortTarget: PotatnoPreviewFunctionExecutorPortTarget<PotatnoTestProjectTypesDefinition, 'number'> | null = null;
        const lExecutor = new PotatnoPreviewFunctionExecutor<PotatnoTestProjectTypesDefinition, Record<string, unknown>, 'number'>(PotatnoHelper.TEST_PROJECT.entryPoint, {
            defaultParameters: { base: 1 },
            types: ['number'],
            build: (pExecutor, pGeneratorResult, pPortTarget): { execute: () => number; type: 'number' } => {
                lCapturedDefaultParameters = pExecutor.defaultParameters;
                lCapturedFunctionId = pExecutor.function.id;
                lCapturedGeneratorResult = pGeneratorResult;
                lCapturedPortTarget = pPortTarget;

                return {
                    type: 'number',
                    execute: (): number => 7
                };
            }
        });

        // Process.
        const lResult = lExecutor.compile(gGeneratorResult, lPortTarget);

        // Evaluation.
        expect(lCapturedDefaultParameters).toEqual({ base: 1 });
        expect(lCapturedFunctionId).toBe(PotatnoHelper.TEST_PROJECT.entryPoint.id);
        expect(lCapturedGeneratorResult).toBe(gGeneratorResult);
        expect(lCapturedPortTarget).toBe(lPortTarget);
        expect(lResult.type).toBe('number');
        expect(lResult.execute({})).toBe(7);
    });
});
