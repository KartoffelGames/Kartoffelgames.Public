import { expect } from '@kartoffelgames/core-test';
import { PotatnoPreviewDisplay } from '../../source/preview/potatno-preview-display.ts';
import { PotatnoPreviewDriver, type PotatnoPreviewDriverDisplay } from '../../source/preview/potatno-preview-driver.ts';
import { PotatnoPreviewFunctionExecutor, type PotatnoPreviewFunctionExecutorPortTarget } from '../../source/preview/potatno-preview-function-executor.ts';
import { PotatnoHelper } from '../helper/potatno-helper.ts';
import type { PotatnoTestProjectTypesDefinition } from '../helper/potatno_test_project/potatno-test-project-types-definition.ts';

Deno.test('new PotatnoPreviewDriver()', async (pContext) => {
    await pContext.step('Constructs with display and target function', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lDisplay = {
            executor: {
                defaultParameters: {}
            }
        } as unknown as PotatnoPreviewDriverDisplay<PotatnoTestProjectTypesDefinition>;

        // Process.
        const lDriver = new PotatnoPreviewDriver(lDisplay, lFunction);

        // Evaluation.
        expect(lDriver.display).toBe(lDisplay);
    });
});

Deno.test('PotatnoPreviewDriver.display', async (pContext) => {
    await pContext.step('Returns configured display', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lDisplay = {
            executor: {
                defaultParameters: {}
            }
        } as unknown as PotatnoPreviewDriverDisplay<PotatnoTestProjectTypesDefinition>;
        const lDriver = new PotatnoPreviewDriver(lDisplay, lFunction);

        // Process.
        const lResult = lDriver.display;

        // Evaluation.
        expect(lResult).toBe(lDisplay);
    });
});

Deno.test('PotatnoPreviewDriver.element', async (pContext) => {
    await pContext.step('Lazily generates and caches display element', () => {
        // Setup.
        const lElement = { name: 'PreviewElement' } as unknown as Element;
        let lGenerateCallCount: number = 0;
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lDisplay = {
            executor: {
                defaultParameters: {}
            },
            generate: (): Element => {
                lGenerateCallCount++;
                return lElement;
            }
        } as unknown as PotatnoPreviewDriverDisplay<PotatnoTestProjectTypesDefinition>;
        const lDriver = new PotatnoPreviewDriver(lDisplay, lFunction);

        // Process.
        const lFirstResult = lDriver.element;
        const lSecondResult = lDriver.element;

        // Evaluation.
        expect(lFirstResult).toBe(lElement);
        expect(lSecondResult).toBe(lElement);
        expect(lGenerateCallCount).toBe(1);
    });
});

Deno.test('PotatnoPreviewDriver.execute()', async (pContext) => {
    await pContext.step('No-ops before refresh created a callable', async () => {
        // Setup.
        let lUpdateCallCount: number = 0;
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lDisplay = {
            executor: {
                defaultParameters: {}
            },
            update: (): void => {
                lUpdateCallCount++;
            }
        } as unknown as PotatnoPreviewDriverDisplay<PotatnoTestProjectTypesDefinition>;
        const lDriver = new PotatnoPreviewDriver(lDisplay, lFunction);

        // Process.
        await lDriver.execute();

        // Evaluation.
        expect(lUpdateCallCount).toBe(0);
    });

    await pContext.step('Runs display update with cached callable', async () => {
        // Setup.
        const { function: lFunction, defaultEntry: lDefaultEntry, defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();
        const lElement = { name: 'PreviewElement' } as unknown as Element;
        let lCapturedValue: unknown = null;
        PotatnoHelper.connectFlow(lDefaultEntry, lDefaultExit);
        PotatnoHelper.connectValue(lDefaultEntry, 'a', lDefaultExit, 'result');

        const lExecutor = new PotatnoPreviewFunctionExecutor<PotatnoTestProjectTypesDefinition, Record<string, unknown>, 'number'>(PotatnoHelper.TEST_PROJECT.entryPoint, {
            defaultParameters: { base: 1 },
            types: ['number'],
            build: (): { execute: (pParameters: Record<string, unknown>) => number; type: 'number' } => {
                return {
                    type: 'number',
                    execute: (pParameters: Record<string, unknown>): number => {
                        return Number(pParameters['base']) + Number(pParameters['user']) + Number(pParameters['display']);
                    }
                };
            }
        });
        const lDisplay = new PotatnoPreviewDisplay(lExecutor, {
            id: 'test-display',
            name: 'Test Display',
            typeAdapter: {
                number: (pValue: unknown): number => Number(pValue) * 2
            },
            generate: (): Element => {
                return lElement;
            },
            update: async (pElement, pExecutor): Promise<void> => {
                expect(pElement).toBe(lElement);
                lCapturedValue = await pExecutor({ display: 3 });
            }
        });
        const lDriver = lDisplay.createDriver(lFunction);
        lDriver.specifyParameters({ user: 2 });
        lDriver.refresh();

        // Process.
        await lDriver.execute();

        // Evaluation.
        expect(lCapturedValue).toBe(12);
    });
});

Deno.test('PotatnoPreviewDriver.refresh()', async (pContext) => {
    await pContext.step('Resolves output port hook and value', () => {
        // Setup.
        const { function: lFunction, defaultEntry: lDefaultEntry, defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();
        const lAddNode = PotatnoHelper.addProjectNode(lFunction, 'Add');
        const lPort = lAddNode.outputs.map.get('result')!;
        let lCapturedTarget: PotatnoPreviewFunctionExecutorPortTarget<PotatnoTestProjectTypesDefinition, 'number'> | null = null;
        let lExpectedNodeHook: string = '';
        let lExpectedValue: string = '';

        PotatnoHelper.connectFlow(lDefaultEntry, lDefaultExit);
        PotatnoHelper.connectValue(lDefaultEntry, 'a', lAddNode, 'a');
        PotatnoHelper.connectValue(lDefaultEntry, 'b', lAddNode, 'b');
        PotatnoHelper.connectValue(lAddNode, 'result', lDefaultExit, 'result');

        const lExecutor = new PotatnoPreviewFunctionExecutor<PotatnoTestProjectTypesDefinition, Record<string, unknown>, 'number'>(PotatnoHelper.TEST_PROJECT.entryPoint, {
            defaultParameters: {},
            types: ['number'],
            build: (pExecutor, pGeneratorResult, pPortTarget) => {
                void pExecutor;
                lCapturedTarget = pPortTarget;

                const lGraph = pGeneratorResult.entryPoint.graphs.find((pGraph) => pPortTarget !== null && pGraph.ports.has(pPortTarget.documentPort))!;
                const lNodeId: string = lGraph.nodes.get(pPortTarget!.documentPort.node)!;
                lExpectedNodeHook = pPortTarget!.documentPort.project.generator.values.hook(`end-${lNodeId}`);
                lExpectedValue = lGraph.ports.get(pPortTarget!.documentPort)!;

                return {
                    type: 'number',
                    execute: (): number => 0
                };
            }
        });
        const lDisplay = new PotatnoPreviewDisplay(lExecutor, {
            id: 'test-display',
            name: 'Test Display',
            typeAdapter: {
                number: (pValue: unknown): unknown => pValue
            },
            generate: (): Element => {
                return {} as Element;
            },
            update: (pElement): void => {
                expect(pElement).toBeDefined();
            }
        });
        const lDriver = lDisplay.createDriver(lPort);

        // Process.
        lDriver.refresh();

        // Evaluation.
        expect(lCapturedTarget).not.toBeNull();
        expect(lCapturedTarget!.nodeHook).toBe(lExpectedNodeHook);
        expect(lCapturedTarget!.value).toBe(lExpectedValue);
    });

    await pContext.step('Skips execution when display does not allow compiled result type', async () => {
        // Setup.
        const { function: lFunction, defaultEntry: lDefaultEntry, defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();
        let lUpdateCallCount: number = 0;
        PotatnoHelper.connectFlow(lDefaultEntry, lDefaultExit);
        PotatnoHelper.connectValue(lDefaultEntry, 'a', lDefaultExit, 'result');

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
        const lDisplay = new PotatnoPreviewDisplay(lExecutor, {
            id: 'test-display',
            name: 'Test Display',
            typeAdapter: {
                boolean: (pValue: unknown): unknown => pValue
            } as any,
            generate: (): Element => {
                return { name: 'PreviewElement' } as unknown as Element;
            },
            update: (): void => {
                lUpdateCallCount++;
            }
        });
        const lDriver = lDisplay.createDriver(lFunction);

        // Process.
        lDriver.refresh();
        await lDriver.execute();

        // Evaluation.
        expect(lUpdateCallCount).toBe(0);
    });
});

Deno.test('PotatnoPreviewDriver.specifyParameters()', async (pContext) => {
    await pContext.step('Merges parameters over defaults and previous specified values', async () => {
        // Setup.
        const { function: lFunction, defaultEntry: lDefaultEntry, defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();
        let lCapturedParameters: Record<string, unknown> | null = null;
        PotatnoHelper.connectFlow(lDefaultEntry, lDefaultExit);
        PotatnoHelper.connectValue(lDefaultEntry, 'a', lDefaultExit, 'result');

        const lExecutor = new PotatnoPreviewFunctionExecutor<PotatnoTestProjectTypesDefinition, Record<string, unknown>, 'number'>(PotatnoHelper.TEST_PROJECT.entryPoint, {
            defaultParameters: { base: 1, value: 2 },
            types: ['number'],
            build: (): { execute: (pParameters: Record<string, unknown>) => number; type: 'number' } => {
                return {
                    type: 'number',
                    execute: (pParameters: Record<string, unknown>): number => {
                        lCapturedParameters = pParameters;
                        return 1;
                    }
                };
            }
        });
        const lDisplay = new PotatnoPreviewDisplay(lExecutor, {
            id: 'test-display',
            name: 'Test Display',
            typeAdapter: {
                number: (pValue: unknown): unknown => pValue
            },
            generate: (): Element => {
                return { name: 'PreviewElement' } as unknown as Element;
            },
            update: async (pElement, pExecutor): Promise<void> => {
                void pElement;
                await pExecutor({ value: 5, display: 6 });
            }
        });
        const lDriver = lDisplay.createDriver(lFunction);
        lDriver.specifyParameters({ user: 3 });
        lDriver.specifyParameters({ value: 4 });
        lDriver.refresh();

        // Process.
        await lDriver.execute();

        // Evaluation.
        expect(lCapturedParameters).toEqual({ base: 1, value: 5, user: 3, display: 6 });
    });
});
