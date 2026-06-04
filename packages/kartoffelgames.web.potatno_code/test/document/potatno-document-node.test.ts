import { expect } from '@kartoffelgames/core-test';
import { PotatnoStaticNodeDefinition } from '../../source/project/node_definition/potatno-static-node-definition.ts';
import { PotatnoHelper } from '../helper/potatno-helper.ts';
import { TestProject } from '../helper/test-project.ts';

Deno.test('PotatnoDocumentNode.constructor()', async (pContext) => {
    await pContext.step('Sets category snapshot from constructor', () => {
        // Setup. Process.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(defaultEntry.category).toBe('event');
    });

    await pContext.step('Sets definitionId', () => {
        // Setup.
        const lEntryDefinition = TestProject.entryPoint;
        const { defaultEntry, function: lFunction } = PotatnoHelper.setupCalculatorDocument();

        // Process.
        const lExpectedId = lEntryDefinition.getNodeDefinitions(lFunction).entry[0].id;

        // Evaluation.
        expect(defaultEntry.definitionId).toBe(lExpectedId);
    });

    await pContext.step('Sets label', () => {
        // Setup. Process.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation. Label is sourced from the entry node definition's label.
        expect(defaultEntry.label).toBeDefined();
    });

    await pContext.step('Sets isSystem', () => {
        // Setup. Process.
        const { defaultEntry, function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lAddNode = PotatnoHelper.addProjectNode(lFunction, 'Add');

        // Evaluation. defaultEntry was created with isSystem=true; lAddNode defaults to false.
        expect(defaultEntry.isSystem).toBe(true);
        expect(lAddNode.isSystem).toBe(false);
    });

    await pContext.step('Stores transformation', () => {
        // Setup. Process.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(defaultEntry.transformation).toEqual({ x: 0, y: 0, width: 6, height: 4 });
    });

    await pContext.step('Builds input ports from configuration', () => {
        // Setup. Process. The Default Exit node has one flow input plus one value input.
        const { defaultExit } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(defaultExit.inputs.list.length).toBe(2);
    });

    await pContext.step('Builds output ports from configuration', () => {
        // Setup. Process. The Default Entry node has one flow output plus two value outputs.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(defaultEntry.outputs.list.length).toBe(3);
    });

    await pContext.step('Buckets flow ports into inputs.flow / outputs.flow', () => {
        // Setup. Process.
        const { defaultEntry, defaultExit } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(defaultEntry.outputs.flow.length).toBe(1);
        expect(defaultExit.inputs.flow.length).toBe(1);
    });

    await pContext.step('Buckets value ports into inputs.value / outputs.value', () => {
        // Setup. Process.
        const { defaultEntry, defaultExit } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(defaultEntry.outputs.value.length).toBe(2);
        expect(defaultExit.inputs.value.length).toBe(1);
    });

    await pContext.step('Builds the inputs.map / outputs.map keyed by definitionId', () => {
        // Setup. Process.
        const { defaultEntry, defaultExit } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(defaultEntry.outputs.map.has('a')).toBe(true);
        expect(defaultEntry.outputs.map.has('b')).toBe(true);
        expect(defaultExit.inputs.map.has('result')).toBe(true);
    });
});

Deno.test('PotatnoDocumentNode.definitionId', async (pContext) => {
    await pContext.step('Returns the provided definition id', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lAddNode = PotatnoHelper.addProjectNode(lFunction, 'Add');

        // Process.
        const lResult: string = lAddNode.definitionId;

        // Evaluation.
        expect(lResult).toBe('Add');
    });
});

Deno.test('PotatnoDocumentNode.document', async (pContext) => {
    await pContext.step('Returns the provided document', () => {
        // Setup. Process.
        const { document, defaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(defaultEntry.document).toBe(document);
    });
});

Deno.test('PotatnoDocumentNode.function', async (pContext) => {
    await pContext.step('Returns the provided function', () => {
        // Setup. Process.
        const { function: lFunction, defaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(defaultEntry.function).toBe(lFunction);
    });
});

Deno.test('PotatnoDocumentNode.project', async (pContext) => {
    await pContext.step('Returns the provided project', () => {
        // Setup. Process.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(defaultEntry.project).toBe(TestProject);
    });
});

Deno.test('PotatnoDocumentNode.category', async (pContext) => {
    await pContext.step('Returns the snapshot from construction even if the definition later changes', () => {
        // Setup. Place an Add node, then re-register an Add definition under the same id with a different category.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lAddNode = PotatnoHelper.addProjectNode(lFunction, 'Add');
        const lOriginalCategory: string = lAddNode.category;
        TestProject.addNodeDefinition(PotatnoStaticNodeDefinition.newStaticNode({
            id: 'Add', label: 'Add', category: 'new-category',
            ports: { inputs: [], outputs: [] }, generators: { code: (): string => '' }
        }));

        // Process.
        const lResult: string = lAddNode.category;

        // Evaluation. The node's category is the snapshot at creation time, not the live category.
        expect(lResult).toBe(lOriginalCategory);

        // Cleanup. Re-register the original Add so other tests in the suite are not polluted.
        TestProject.addNodeDefinition(PotatnoStaticNodeDefinition.newStaticNode({
            id: 'Add', label: 'Add', category: 'operator',
            ports: {
                inputs: [
                    { label: 'a', id: 'a', portType: 'value', dataType: 'number' as never },
                    { label: 'b', id: 'b', portType: 'value', dataType: 'number' as never }
                ],
                outputs: [
                    { label: 'result', id: 'result', portType: 'value', dataType: 'number' as never }
                ]
            },
            generators: {
                code: (pContext): string => `const ${pContext.outputs['result'].value} = ${pContext.inputs['a'].value} + ${pContext.inputs['b'].value};`
            }
        }));
    });
});

Deno.test('PotatnoDocumentNode.label', async (pContext) => {
    await pContext.step('Getter returns the constructor value', () => {
        // Setup. Process.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lAddNode = PotatnoHelper.addProjectNode(lFunction, 'Add');

        // Evaluation. Add's definition label is 'Add'.
        expect(lAddNode.label).toBe('Add');
    });

    await pContext.step('Setter updates the label', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lAddNode = PotatnoHelper.addProjectNode(lFunction, 'Add');

        // Process.
        lAddNode.label = 'Renamed';

        // Evaluation.
        expect(lAddNode.label).toBe('Renamed');
    });
});

Deno.test('PotatnoDocumentNode.isSystem', async (pContext) => {
    await pContext.step('Returns true when constructed as system', () => {
        // Setup. Process.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(defaultEntry.isSystem).toBe(true);
    });

    await pContext.step('Returns false otherwise', () => {
        // Setup. Process.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lAddNode = PotatnoHelper.addProjectNode(lFunction, 'Add');

        // Evaluation.
        expect(lAddNode.isSystem).toBe(false);
    });
});

Deno.test('PotatnoDocumentNode.transformation', async (pContext) => {
    await pContext.step('Returns the stored transformation', () => {
        // Setup. Process.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lDefinition = TestProject.nodeDefinitions.find((pDef) => pDef.id === 'Add')!;
        const lAddNode = lFunction.addNodeByDefinition(lDefinition, { x: 5, y: 6, width: 7, height: 8 });

        // Evaluation.
        expect(lAddNode.transformation).toEqual({ x: 5, y: 6, width: 7, height: 8 });
    });
});

Deno.test('PotatnoDocumentNode.inputs', async (pContext) => {
    await pContext.step('Returns an ordered list', () => {
        // Setup. Process.
        const { defaultExit } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation. Default exit has [exec (flow), result (value)] in that order.
        expect(defaultExit.inputs.list[0].definitionId).toBe('exec');
        expect(defaultExit.inputs.list[1].definitionId).toBe('result');
    });

    await pContext.step('Map lookup by definitionId returns the port', () => {
        // Setup. Process.
        const { defaultExit } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(defaultExit.inputs.map.get('result')).toBe(defaultExit.inputs.list[1]);
    });

    await pContext.step('Flow array contains only flow ports', () => {
        // Setup. Process.
        const { defaultExit } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(defaultExit.inputs.flow.every((pPort) => pPort.portType === 'flow')).toBe(true);
    });

    await pContext.step('Value array contains only value ports', () => {
        // Setup. Process.
        const { defaultExit } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(defaultExit.inputs.value.every((pPort) => pPort.portType === 'value')).toBe(true);
    });
});

Deno.test('PotatnoDocumentNode.outputs', async (pContext) => {
    await pContext.step('Returns an ordered list', () => {
        // Setup. Process.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation. Default entry outputs are [exec, a, b] in that order.
        expect(defaultEntry.outputs.list[0].definitionId).toBe('exec');
        expect(defaultEntry.outputs.list[1].definitionId).toBe('a');
        expect(defaultEntry.outputs.list[2].definitionId).toBe('b');
    });

    await pContext.step('Map lookup by definitionId returns the port', () => {
        // Setup. Process.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(defaultEntry.outputs.map.get('a')).toBe(defaultEntry.outputs.list[1]);
    });

    await pContext.step('Flow array contains only flow ports', () => {
        // Setup. Process.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(defaultEntry.outputs.flow.every((pPort) => pPort.portType === 'flow')).toBe(true);
    });

    await pContext.step('Value array contains only value ports', () => {
        // Setup. Process.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(defaultEntry.outputs.value.every((pPort) => pPort.portType === 'value')).toBe(true);
    });
});

Deno.test('PotatnoDocumentNode.hasFlowPorts', async (pContext) => {
    await pContext.step('True when input flow port present', () => {
        // Setup. Process.
        const { defaultExit } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(defaultExit.hasFlowPorts).toBe(true);
    });

    await pContext.step('True when output flow port present', () => {
        // Setup. Process.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(defaultEntry.hasFlowPorts).toBe(true);
    });

    await pContext.step('False when no flow ports', () => {
        // Setup. Process. Add is a pure-value node.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lAddNode = PotatnoHelper.addProjectNode(lFunction, 'Add');

        // Evaluation.
        expect(lAddNode.hasFlowPorts).toBe(false);
    });
});

Deno.test('PotatnoDocumentNode.hasValuePorts', async (pContext) => {
    await pContext.step('True when input value port present', () => {
        // Setup. Process.
        const { defaultExit } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(defaultExit.hasValuePorts).toBe(true);
    });

    await pContext.step('True when output value port present', () => {
        // Setup. Process.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(defaultEntry.hasValuePorts).toBe(true);
    });

    await pContext.step('False when no value ports', () => {
        // Setup. Process. Pass is a flow-only node.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lPassNode = PotatnoHelper.addProjectNode(lFunction, 'Pass');

        // Evaluation.
        expect(lPassNode.hasValuePorts).toBe(false);
    });
});

Deno.test('PotatnoDocumentNode.moveTo()', async (pContext) => {
    await pContext.step('Updates transformation.x and transformation.y', () => {
        // Setup.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Process.
        defaultEntry.moveTo(50, 60);

        // Evaluation.
        expect(defaultEntry.transformation.x).toBe(50);
        expect(defaultEntry.transformation.y).toBe(60);
    });
});

Deno.test('PotatnoDocumentNode.resizeTo()', async (pContext) => {
    await pContext.step('Updates width and height', () => {
        // Setup.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Process.
        defaultEntry.resizeTo(20, 30);

        // Evaluation.
        expect(defaultEntry.transformation.width).toBe(20);
        expect(defaultEntry.transformation.height).toBe(30);
    });

    await pContext.step('Clamps width to minimum 4', () => {
        // Setup.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Process.
        defaultEntry.resizeTo(1, 10);

        // Evaluation.
        expect(defaultEntry.transformation.width).toBe(4);
    });

    await pContext.step('Clamps height to minimum 2', () => {
        // Setup.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Process.
        defaultEntry.resizeTo(10, 1);

        // Evaluation.
        expect(defaultEntry.transformation.height).toBe(2);
    });
});

Deno.test('PotatnoDocumentNode - Validation', async (pContext) => {
    await pContext.step('Missing definition', () => {
        // Setup. Place an Add node, then re-register Add to remove it from the project lookup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lDefinition = PotatnoStaticNodeDefinition.newStaticNode({
            id: 'TempMissing', label: 'TempMissing', category: 'operator',
            ports: { inputs: [], outputs: [] },
            generators: { code: (): string => '' }
        });
        TestProject.addNodeDefinition(lDefinition);
        const lNode = lFunction.addNodeByDefinition(lDefinition, { x: 0, y: 0, width: 4, height: 2 });
        // Make the project forget the definition by swapping it for a different id.
        (TestProject as any).mNodeDefinitions.delete('TempMissing');

        // Process.
        const lErrors = lNode.validate(new Set<string>());

        // Evaluation.
        expect(lErrors.length).toBeGreaterThan(0);
        expect(lErrors[0].message).toBe(`Node "${lNode.label}" definition "TempMissing" could not be found.`);
    });

    await pContext.step('Region required and present', () => {
        // Setup. Definition that requires region 'X'.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lDefinition = PotatnoStaticNodeDefinition.newStaticNode({
            id: 'RequiresXOnly', label: 'RequiresXOnly', category: 'operator',
            regions: { requires: ['X'] },
            ports: { inputs: [], outputs: [] },
            generators: { code: (): string => '' }
        });
        TestProject.addNodeDefinition(lDefinition);
        const lNode = lFunction.addNodeByDefinition(lDefinition, { x: 0, y: 0, width: 4, height: 2 });

        // Process.
        const lErrors = lNode.validate(new Set<string>(['X']));

        // Evaluation.
        expect(lErrors.length).toBe(0);

        // Cleanup.
        (TestProject as any).mNodeDefinitions.delete('RequiresXOnly');
    });

    await pContext.step('Region required and absent', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lDefinition = PotatnoStaticNodeDefinition.newStaticNode({
            id: 'RequiresMissing', label: 'RequiresMissing', category: 'operator',
            regions: { requires: ['X'] },
            ports: { inputs: [], outputs: [] },
            generators: { code: (): string => '' }
        });
        TestProject.addNodeDefinition(lDefinition);
        const lNode = lFunction.addNodeByDefinition(lDefinition, { x: 0, y: 0, width: 4, height: 2 });

        // Process.
        const lErrors = lNode.validate(new Set<string>());

        // Evaluation.
        expect(lErrors.some((pError) => pError.message === `Node "${lNode.label}" requires region "X" but it is not active.`)).toBe(true);

        // Cleanup.
        (TestProject as any).mNodeDefinitions.delete('RequiresMissing');
    });

    await pContext.step('Region allowed pass-through', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lDefinition = PotatnoStaticNodeDefinition.newStaticNode({
            id: 'AllowsXOnly', label: 'AllowsXOnly', category: 'operator',
            regions: { allows: ['X'] },
            ports: { inputs: [], outputs: [] },
            generators: { code: (): string => '' }
        });
        TestProject.addNodeDefinition(lDefinition);
        const lNode = lFunction.addNodeByDefinition(lDefinition, { x: 0, y: 0, width: 4, height: 2 });

        // Process.
        const lErrors = lNode.validate(new Set<string>(['X']));

        // Evaluation.
        expect(lErrors.length).toBe(0);

        // Cleanup.
        (TestProject as any).mNodeDefinitions.delete('AllowsXOnly');
    });

    await pContext.step('Region forbidden', () => {
        // Setup. Definition allows X only, but incoming set contains Y.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lDefinition = PotatnoStaticNodeDefinition.newStaticNode({
            id: 'ForbidsY', label: 'ForbidsY', category: 'operator',
            regions: { allows: ['X'] },
            ports: { inputs: [], outputs: [] },
            generators: { code: (): string => '' }
        });
        TestProject.addNodeDefinition(lDefinition);
        const lNode = lFunction.addNodeByDefinition(lDefinition, { x: 0, y: 0, width: 4, height: 2 });

        // Process.
        const lErrors = lNode.validate(new Set<string>(['Y']));

        // Evaluation.
        expect(lErrors.some((pError) => pError.message === `Node "${lNode.label}" does not allow region "Y".`)).toBe(true);

        // Cleanup.
        (TestProject as any).mNodeDefinitions.delete('ForbidsY');
    });

    await pContext.step('Resync delegates to ports', () => {
        // Setup. Default exit has an unconnected flow input; that port-level error must surface from node.validate().
        const { defaultExit } = PotatnoHelper.setupCalculatorDocument();

        // Process.
        const lErrors = defaultExit.validate(new Set<string>());

        // Evaluation.
        expect(lErrors.some((pError) => /Flow input port/.test(pError.message))).toBe(true);
    });
});
