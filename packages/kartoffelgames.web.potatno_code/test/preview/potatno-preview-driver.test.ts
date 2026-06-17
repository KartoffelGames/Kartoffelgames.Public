import { expect } from '@kartoffelgames/core-test';
import { PotatnoPreviewDisplay } from '../../source/preview/potatno-preview-display.ts';
import { PotatnoPreviewFunctionExecutor, type PotatnoPreviewFunctionExecutorPortTarget } from '../../source/preview/potatno-preview-function-executor.ts';
import { PotatnoHelper } from '../helper/potatno-helper.ts';
import type { PotatnoTestProjectTypesDefinition } from '../helper/potatno_test_project/potatno-test-project-types-definition.ts';

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

        const lExecutor = new PotatnoPreviewFunctionExecutor(PotatnoHelper.TestProject.entryPoint, {
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
});
