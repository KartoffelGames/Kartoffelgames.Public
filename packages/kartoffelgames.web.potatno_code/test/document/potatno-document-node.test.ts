import { expect } from '@kartoffelgames/core-test';
import { PotatnoCommentNodeDefinition } from '../../source/project/node_definition/potatno-comment-node-definition.ts';
import { PotatnoFlowConjunctionNodeDefinition } from '../../source/project/node_definition/potatno-flow-conjunction-node-definition.ts';
import { PotatnoStaticNodeDefinition } from '../../source/project/node_definition/potatno-static-node-definition.ts';
import { PotatnoFunctionNodeDefinition } from '../../source/project/node_definition/potatno-function-node-definition.ts';
import { PotatnoValueConjunctionNodeDefinition } from '../../source/project/node_definition/potatno-value-conjunction-node-definition.ts';
import type { PotatnoDocumentFunction } from '../../source/document/potatno-document-function.ts';
import type { PotatnoDocumentNode } from '../../source/document/potatno-document-node.ts';
import { PotatnoHelper } from '../helper/potatno-helper.ts';
import type { PotatnoTestProjectTypesDefinition } from '../helper/potatno_test_project/potatno-test-project-types-definition.ts';

function gSetupHelperFunctionCallNode(pParameter?: SetupHelperFunctionCallNodeParameter): SetupHelperFunctionCallNodeResult {
    // Create document with a caller function and a helper function.
    const { document: lDocument, function: lCallerFunction } = PotatnoHelper.setupCalculatorDocument();
    const lHelperFunction = PotatnoHelper.newHelperFunction(lDocument, crypto.randomUUID(), 'helperFunction');

    // Configure helper function signature.
    for (const lInput of pParameter?.inputs ?? new Array<SetupHelperFunctionCallNodePort>()) {
        lHelperFunction.addInput(lInput);
    }
    for (const lOutput of pParameter?.outputs ?? new Array<SetupHelperFunctionCallNodePort>()) {
        lHelperFunction.addOutput(lOutput);
    }

    // Add a function-call node from the live helper function node definition.
    const lHelperNodeDefinition = lDocument.nodeDefinitions.find((pDefinition) => {
        return pDefinition instanceof PotatnoFunctionNodeDefinition && pDefinition.function === lHelperFunction;
    })!;
    const lNode = lCallerFunction.addNodeByDefinition(lHelperNodeDefinition, { x: 0, y: 0, width: 4, height: 2 });

    return { helperFunction: lHelperFunction, node: lNode };
}

Deno.test('PotatnoDocumentNode.constructor()', async (pContext) => {
    await pContext.step('Sets definitionId', () => {
        // Setup.
        const lEntryDefinition = PotatnoHelper.TEST_PROJECT.entryPoint;
        const { defaultEntry: lDefaultEntry, function: lFunction } = PotatnoHelper.setupCalculatorDocument();

        // Process.
        const lExpectedId = lEntryDefinition.getNodeDefinitions(lFunction).entry[0].id;

        // Evaluation.
        expect(lDefaultEntry.definitionId).toBe(lExpectedId);
    });

    await pContext.step('Sets label', () => {
        // Setup. Process.
        const { defaultEntry: lDefaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation. Label is sourced from the entry node definition's label.
        expect(lDefaultEntry.label).toBeDefined();
    });

    await pContext.step('Stores transformation', () => {
        // Setup. A comment node is the only freely-sizable node, so it stores the given size verbatim.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lDefinition = PotatnoHelper.TEST_PROJECT.nodeDefinitions.get(PotatnoCommentNodeDefinition.DEFINITION_ID)!;

        // Process.
        const lNode = lFunction.addNodeByDefinition(lDefinition, { x: 5, y: 6, width: 7, height: 8 });

        // Evaluation.
        expect(lNode.transformation).toEqual({ x: 5, y: 6, width: 7, height: 8 });
    });

    await pContext.step('Builds input ports from configuration', () => {
        // Setup. Process. The Default Exit node has one flow input plus one value input.
        const { defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(lDefaultExit.inputs.list.length).toBe(2);
    });

    await pContext.step('Builds output ports from configuration', () => {
        // Setup. Process. The Default Entry node has one flow output plus two value outputs.
        const { defaultEntry: lDefaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(lDefaultEntry.outputs.list.length).toBe(3);
    });

    await pContext.step('Buckets flow ports into inputs.flow / outputs.flow', () => {
        // Setup. Process.
        const { defaultEntry: lDefaultEntry, defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(lDefaultEntry.outputs.flow.length).toBe(1);
        expect(lDefaultExit.inputs.flow.length).toBe(1);
    });

    await pContext.step('Buckets value ports into inputs.value / outputs.value', () => {
        // Setup. Process.
        const { defaultEntry: lDefaultEntry, defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(lDefaultEntry.outputs.value.length).toBe(2);
        expect(lDefaultExit.inputs.value.length).toBe(1);
    });

    await pContext.step('Builds the inputs.map / outputs.map keyed by definitionId', () => {
        // Setup. Process.
        const { defaultEntry: lDefaultEntry, defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(lDefaultEntry.outputs.map.has('a')).toBe(true);
        expect(lDefaultEntry.outputs.map.has('b')).toBe(true);
        expect(lDefaultExit.inputs.map.has('result')).toBe(true);
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
        const { document: lDocument, defaultEntry: lDefaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(lDefaultEntry.document).toBe(lDocument);
    });
});

Deno.test('PotatnoDocumentNode.function', async (pContext) => {
    await pContext.step('Returns the provided function', () => {
        // Setup. Process.
        const { function: lFunction, defaultEntry: lDefaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(lDefaultEntry.function).toBe(lFunction);
    });
});

Deno.test('PotatnoDocumentNode.project', async (pContext) => {
    await pContext.step('Returns the provided project', () => {
        // Setup. Process.
        const { defaultEntry: lDefaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(lDefaultEntry.project).toBe(PotatnoHelper.TEST_PROJECT);
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

Deno.test('PotatnoDocumentNode.transformation', async (pContext) => {
    await pContext.step('Returns the stored transformation', () => {
        // Setup. Process. A comment node stores its size verbatim, so the getter returns it unchanged.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lDefinition = PotatnoHelper.TEST_PROJECT.nodeDefinitions.get(PotatnoCommentNodeDefinition.DEFINITION_ID)!;
        const lCommentNode = lFunction.addNodeByDefinition(lDefinition, { x: 5, y: 6, width: 7, height: 8 });

        // Evaluation.
        expect(lCommentNode.transformation).toEqual({ x: 5, y: 6, width: 7, height: 8 });
    });
});

Deno.test('PotatnoDocumentNode.inputs', async (pContext) => {
    await pContext.step('Returns an ordered list', () => {
        // Setup. Process.
        const { defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation. Default exit has [exec (flow), result (value)] in that order.
        expect(lDefaultExit.inputs.list[0].definitionId).toBe('exec');
        expect(lDefaultExit.inputs.list[1].definitionId).toBe('result');
    });

    await pContext.step('Map lookup by definitionId returns the port', () => {
        // Setup. Process.
        const { defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(lDefaultExit.inputs.map.get('result')).toBe(lDefaultExit.inputs.list[1]);
    });

    await pContext.step('Flow array contains only flow ports', () => {
        // Setup. Process.
        const { defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(lDefaultExit.inputs.flow.every((pPort) => pPort.portType === 'flow')).toBe(true);
    });

    await pContext.step('Value array contains only value ports', () => {
        // Setup. Process.
        const { defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(lDefaultExit.inputs.value.every((pPort) => pPort.portType === 'value')).toBe(true);
    });
});

Deno.test('PotatnoDocumentNode.outputs', async (pContext) => {
    await pContext.step('Returns an ordered list', () => {
        // Setup. Process.
        const { defaultEntry: lDefaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation. Default entry outputs are [exec, a, b] in that order.
        expect(lDefaultEntry.outputs.list[0].definitionId).toBe('exec');
        expect(lDefaultEntry.outputs.list[1].definitionId).toBe('a');
        expect(lDefaultEntry.outputs.list[2].definitionId).toBe('b');
    });

    await pContext.step('Map lookup by definitionId returns the port', () => {
        // Setup. Process.
        const { defaultEntry: lDefaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(lDefaultEntry.outputs.map.get('a')).toBe(lDefaultEntry.outputs.list[1]);
    });

    await pContext.step('Flow array contains only flow ports', () => {
        // Setup. Process.
        const { defaultEntry: lDefaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(lDefaultEntry.outputs.flow.every((pPort) => pPort.portType === 'flow')).toBe(true);
    });

    await pContext.step('Value array contains only value ports', () => {
        // Setup. Process.
        const { defaultEntry: lDefaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(lDefaultEntry.outputs.value.every((pPort) => pPort.portType === 'value')).toBe(true);
    });
});

Deno.test('PotatnoDocumentNode.hasFlowPorts', async (pContext) => {
    await pContext.step('True when input flow port present', () => {
        // Setup. Process.
        const { defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(lDefaultExit.hasFlowPorts).toBe(true);
    });

    await pContext.step('True when output flow port present', () => {
        // Setup. Process.
        const { defaultEntry: lDefaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(lDefaultEntry.hasFlowPorts).toBe(true);
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
        const { defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(lDefaultExit.hasValuePorts).toBe(true);
    });

    await pContext.step('True when output value port present', () => {
        // Setup. Process.
        const { defaultEntry: lDefaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(lDefaultEntry.hasValuePorts).toBe(true);
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
        const { defaultEntry: lDefaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Process.
        lDefaultEntry.moveTo(50, 60);

        // Evaluation.
        expect(lDefaultEntry.transformation.x).toBe(50);
        expect(lDefaultEntry.transformation.y).toBe(60);
    });
});

Deno.test('PotatnoDocumentNode.resizeTo()', async (pContext) => {
    // A comment node is freely resizable, only bound by a 6x6 minimum.
    await pContext.step('Comment node - freely resizes to any size above the minimum', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lDefinition = PotatnoHelper.TEST_PROJECT.nodeDefinitions.get(PotatnoCommentNodeDefinition.DEFINITION_ID)!;
        const lCommentNode = lFunction.addNodeByDefinition(lDefinition, { x: 0, y: 0, width: 6, height: 6 });

        // Process.
        lCommentNode.resizeTo(20, 30);

        // Evaluation.
        expect(lCommentNode.transformation.width).toBe(20);
        expect(lCommentNode.transformation.height).toBe(30);
    });

    await pContext.step('Comment node - clamps width and height to a minimum of 6', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lDefinition = PotatnoHelper.TEST_PROJECT.nodeDefinitions.get(PotatnoCommentNodeDefinition.DEFINITION_ID)!;
        const lCommentNode = lFunction.addNodeByDefinition(lDefinition, { x: 0, y: 0, width: 6, height: 6 });

        // Process.
        lCommentNode.resizeTo(1, 2);

        // Evaluation.
        expect(lCommentNode.transformation.width).toBe(6);
        expect(lCommentNode.transformation.height).toBe(6);
    });

    // A normal node has a fixed width of 6 and a height derived from its port count; the
    // requested size is ignored entirely.
    await pContext.step('Normal node - width is fixed to 6 regardless of the requested width', () => {
        // Setup.
        const { defaultEntry: lDefaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Process.
        lDefaultEntry.resizeTo(20, 30);

        // Evaluation.
        expect(lDefaultEntry.transformation.width).toBe(6);
    });

    await pContext.step('Normal node - height is fixed to max input/output port count plus header', () => {
        // Setup.
        const { defaultEntry: lDefaultEntry } = PotatnoHelper.setupCalculatorDocument();
        const lPortHeight = Math.max(lDefaultEntry.inputs.list.length, lDefaultEntry.outputs.list.length) + 1;

        // Process. The requested height is ignored; the node always snaps to its port-derived height.
        lDefaultEntry.resizeTo(20, 30);

        // Evaluation.
        expect(lDefaultEntry.transformation.height).toBe(lPortHeight);
    });

    // A conjunction node is always a fixed 1x1, no matter what size is requested.
    await pContext.step('Value conjunction node - is always 1x1', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lDefinition = PotatnoHelper.TEST_PROJECT.nodeDefinitions.get(PotatnoValueConjunctionNodeDefinition.DEFINITION_ID)!;
        const lConjunctionNode = lFunction.addNodeByDefinition(lDefinition, { x: 0, y: 0, width: 1, height: 1 });

        // Process.
        lConjunctionNode.resizeTo(20, 30);

        // Evaluation.
        expect(lConjunctionNode.transformation.width).toBe(1);
        expect(lConjunctionNode.transformation.height).toBe(1);
    });

    await pContext.step('Flow conjunction node - is always 1x1', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lDefinition = PotatnoHelper.TEST_PROJECT.nodeDefinitions.get(PotatnoFlowConjunctionNodeDefinition.DEFINITION_ID)!;
        const lConjunctionNode = lFunction.addNodeByDefinition(lDefinition, { x: 0, y: 0, width: 1, height: 1 });

        // Process.
        lConjunctionNode.resizeTo(20, 30);

        // Evaluation.
        expect(lConjunctionNode.transformation.width).toBe(1);
        expect(lConjunctionNode.transformation.height).toBe(1);
    });
});

Deno.test('PotatnoDocumentNode - Validation', async (pContext) => {
    await pContext.step('Missing definition', () => {
        // Setup. Place an Add node, then re-register Add to remove it from the project lookup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lDefinition = new PotatnoStaticNodeDefinition<PotatnoTestProjectTypesDefinition>({
            id: 'TempMissing', label: 'TempMissing', category: { name: 'operator' },
            ports: { inputs: [], outputs: [] },
            generators: { code: (): string => '' }
        });
        PotatnoHelper.TEST_PROJECT.addNodeDefinition(lDefinition);
        const lNode = lFunction.addNodeByDefinition(lDefinition, { x: 0, y: 0, width: 4, height: 2 });
        // Make the project forget the definition by swapping it for a different id.
        (PotatnoHelper.TEST_PROJECT as any).mNodeDefinitions.delete('TempMissing');

        // Process.
        const lValidationResult = lNode.validate(new Set<string>());

        // Evaluation.
        expect(lValidationResult.errors.length).toBeGreaterThan(0);
        expect(lValidationResult.errors[0].message).toBe(`Node "${lNode.label}" definition "TempMissing" could not be found.`);
    });

    await pContext.step('Region required and present', () => {
        // Setup. Definition that requires region 'X'.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lDefinition = new PotatnoStaticNodeDefinition<PotatnoTestProjectTypesDefinition>({
            id: 'RequiresXOnly', label: 'RequiresXOnly', category: { name: 'operator' },
            regions: { requires: ['X'] },
            ports: { inputs: [], outputs: [] },
            generators: { code: (): string => '' }
        });
        PotatnoHelper.TEST_PROJECT.addNodeDefinition(lDefinition);
        const lNode = lFunction.addNodeByDefinition(lDefinition, { x: 0, y: 0, width: 4, height: 2 });

        // Process.
        const lValidationResult = lNode.validate(new Set<string>(['X']));

        // Evaluation.
        expect(lValidationResult.errors.length).toBe(0);

        // Cleanup.
        (PotatnoHelper.TEST_PROJECT as any).mNodeDefinitions.delete('RequiresXOnly');
    });

    await pContext.step('Region required and absent', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lDefinition = new PotatnoStaticNodeDefinition<PotatnoTestProjectTypesDefinition>({
            id: 'RequiresMissing', label: 'RequiresMissing', category: { name: 'operator' },
            regions: { requires: ['X'] },
            ports: { inputs: [], outputs: [] },
            generators: { code: (): string => '' }
        });
        PotatnoHelper.TEST_PROJECT.addNodeDefinition(lDefinition);
        const lNode = lFunction.addNodeByDefinition(lDefinition, { x: 0, y: 0, width: 4, height: 2 });

        // Process.
        const lValidationResult = lNode.validate(new Set<string>());

        // Evaluation.
        expect(lValidationResult.errors.some((pError) => pError.message === `Node "${lNode.label}" requires region "X" but it is not active.`)).toBe(true);

        // Cleanup.
        (PotatnoHelper.TEST_PROJECT as any).mNodeDefinitions.delete('RequiresMissing');
    });

    await pContext.step('Region allowed pass-through', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lDefinition = new PotatnoStaticNodeDefinition<PotatnoTestProjectTypesDefinition>({
            id: 'AllowsXOnly', label: 'AllowsXOnly', category: { name: 'operator' },
            regions: { allows: ['X'] },
            ports: { inputs: [], outputs: [] },
            generators: { code: (): string => '' }
        });
        PotatnoHelper.TEST_PROJECT.addNodeDefinition(lDefinition);
        const lNode = lFunction.addNodeByDefinition(lDefinition, { x: 0, y: 0, width: 4, height: 2 });

        // Process.
        const lValidationResult = lNode.validate(new Set<string>(['X']));

        // Evaluation.
        expect(lValidationResult.errors.length).toBe(0);

        // Cleanup.
        (PotatnoHelper.TEST_PROJECT as any).mNodeDefinitions.delete('AllowsXOnly');
    });

    await pContext.step('Region forbidden', () => {
        // Setup. Definition allows X only, but incoming set contains Y.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lDefinition = new PotatnoStaticNodeDefinition<PotatnoTestProjectTypesDefinition>({
            id: 'ForbidsY', label: 'ForbidsY', category: { name: 'operator' },
            regions: { allows: ['X'] },
            ports: { inputs: [], outputs: [] },
            generators: { code: (): string => '' }
        });
        PotatnoHelper.TEST_PROJECT.addNodeDefinition(lDefinition);
        const lNode = lFunction.addNodeByDefinition(lDefinition, { x: 0, y: 0, width: 4, height: 2 });

        // Process.
        const lValidationResult = lNode.validate(new Set<string>(['Y']));

        // Evaluation.
        expect(lValidationResult.errors.some((pError) => pError.message === `Node "${lNode.label}" does not allow region "Y".`)).toBe(true);

        // Cleanup.
        (PotatnoHelper.TEST_PROJECT as any).mNodeDefinitions.delete('ForbidsY');
    });

    await pContext.step('Resync delegates to ports', () => {
        // Setup. Default exit has an unconnected flow input; that port-level error must surface from node.validate().
        const { defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();

        // Process.
        const lValidationResult = lDefaultExit.validate(new Set<string>());

        // Evaluation.
        expect(lValidationResult.errors.some((pError) => /Flow input port/.test(pError.message))).toBe(true);
    });

    await pContext.step('Affected items include added ports', () => {
        // Setup.
        const { helperFunction: lHelperFunction, node: lNode } = gSetupHelperFunctionCallNode();
        lHelperFunction.addInput({ label: 'value', dataType: 'number' });

        // Process.
        const lValidationResult = lNode.validate(new Set<string>());

        // Evaluation.
        const lAddedPort = lNode.inputs.map.get('value');
        expect(lAddedPort).toBeDefined();
        expect(lValidationResult.affectedItems.has(lAddedPort!)).toBe(true);
    });

    await pContext.step('Affected items include removed ports', () => {
        // Setup.
        const { helperFunction: lHelperFunction, node: lNode } = gSetupHelperFunctionCallNode({
            outputs: [
                { label: 'result', dataType: 'number' }
            ]
        });
        const lRemovedPort = lNode.outputs.map.get('result')!;
        lHelperFunction.removeOutput({ label: 'result', dataType: 'number' });

        // Process.
        const lValidationResult = lNode.validate(new Set<string>());

        // Evaluation.
        expect(lNode.outputs.map.has('result')).toBe(false);
        expect(lValidationResult.affectedItems.has(lRemovedPort)).toBe(true);
    });

    await pContext.step('Affected items include replaced ports', () => {
        // Setup.
        const { helperFunction: lHelperFunction, node: lNode } = gSetupHelperFunctionCallNode({
            inputs: [
                { label: 'value', dataType: 'number' }
            ]
        });
        const lOldPort = lNode.inputs.map.get('value')!;
        lHelperFunction.removeInput({ label: 'value', dataType: 'number' });
        lHelperFunction.addInput({ label: 'value', dataType: 'string' });

        // Process.
        const lValidationResult = lNode.validate(new Set<string>());

        // Evaluation.
        const lNewPort = lNode.inputs.map.get('value')!;
        expect(lNewPort).not.toBe(lOldPort);
        expect(lValidationResult.affectedItems.has(lOldPort)).toBe(true);
        expect(lValidationResult.affectedItems.has(lNewPort)).toBe(true);
    });
});

type SetupHelperFunctionCallNodeParameter = {
    inputs?: Array<SetupHelperFunctionCallNodePort>;
    outputs?: Array<SetupHelperFunctionCallNodePort>;
};

type SetupHelperFunctionCallNodePort = {
    dataType: 'number' | 'string';
    label: string;
};

type SetupHelperFunctionCallNodeResult = {
    helperFunction: PotatnoDocumentFunction<PotatnoTestProjectTypesDefinition>;
    node: PotatnoDocumentNode<PotatnoTestProjectTypesDefinition>;
};
