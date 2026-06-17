import { expect } from '@kartoffelgames/core-test';
import { PotatnoDocumentFunction } from '../../source/document/potatno-document-function.ts';
import { PotatnoDocumentNode } from '../../source/document/potatno-document-node.ts';
import { PotatnoDocument } from '../../source/document/potatno-document.ts';
import { PotatnoHelper } from '../helper/potatno-helper.ts';

Deno.test('PotatnoDocumentFunction.constructor()', async (pContext) => {
    await pContext.step('Stores id', () => {
        // Setup. Process.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);
        const lFunction = new PotatnoDocumentFunction(PotatnoHelper.TEST_PROJECT, lDocument, {
            definitionId: PotatnoHelper.TEST_PROJECT.entryPoint.id,
            id: 'fn-id',
            label: 'fn-label',
            isSystem: false
        });

        // Evaluation.
        expect(lFunction.id).toBe('fn-id');
    });

    await pContext.step('Stores label', () => {
        // Setup. Process.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);
        const lFunction = new PotatnoDocumentFunction(PotatnoHelper.TEST_PROJECT, lDocument, {
            definitionId: PotatnoHelper.TEST_PROJECT.entryPoint.id,
            id: 'fn-id',
            label: 'fn-label',
            isSystem: false
        });

        // Evaluation.
        expect(lFunction.label).toBe('fn-label');
    });

    await pContext.step('Stores definitionId', () => {
        // Setup. Process.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);
        const lFunction = new PotatnoDocumentFunction(PotatnoHelper.TEST_PROJECT, lDocument, {
            definitionId: PotatnoHelper.TEST_PROJECT.entryPoint.id,
            id: 'fn-id',
            label: 'fn-label',
            isSystem: false
        });

        // Evaluation.
        expect(lFunction.definitionId).toBe(PotatnoHelper.TEST_PROJECT.entryPoint.id);
    });

    await pContext.step('Stores isSystem flag', () => {
        // Setup. Process.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);
        const lSystemFunction = new PotatnoDocumentFunction(PotatnoHelper.TEST_PROJECT, lDocument, {
            definitionId: PotatnoHelper.TEST_PROJECT.entryPoint.id,
            id: 'sys', label: 'sys', isSystem: true
        });
        const lUserFunction = new PotatnoDocumentFunction(PotatnoHelper.TEST_PROJECT, lDocument, {
            definitionId: PotatnoHelper.TEST_PROJECT.entryPoint.id,
            id: 'usr', label: 'usr', isSystem: false
        });

        // Evaluation.
        expect(lSystemFunction.isSystem).toBe(true);
        expect(lUserFunction.isSystem).toBe(false);
    });

    await pContext.step('Initialises empty nodes set', () => {
        // Setup. Process.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);
        const lFunction = new PotatnoDocumentFunction(PotatnoHelper.TEST_PROJECT, lDocument, {
            definitionId: PotatnoHelper.TEST_PROJECT.entryPoint.id,
            id: 'fn', label: 'fn', isSystem: false
        });

        // Evaluation.
        expect(lFunction.nodes.size).toBe(0);
    });

    await pContext.step('Initialises empty inputs array', () => {
        // Setup. Process.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);
        const lFunction = new PotatnoDocumentFunction(PotatnoHelper.TEST_PROJECT, lDocument, {
            definitionId: PotatnoHelper.TEST_PROJECT.entryPoint.id,
            id: 'fn', label: 'fn', isSystem: false
        });

        // Evaluation.
        expect(lFunction.inputs.length).toBe(0);
    });

    await pContext.step('Initialises empty outputs array', () => {
        // Setup. Process.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);
        const lFunction = new PotatnoDocumentFunction(PotatnoHelper.TEST_PROJECT, lDocument, {
            definitionId: PotatnoHelper.TEST_PROJECT.entryPoint.id,
            id: 'fn', label: 'fn', isSystem: false
        });

        // Evaluation.
        expect(lFunction.outputs.length).toBe(0);
    });

    await pContext.step('Initialises empty imports array', () => {
        // Setup. Process.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);
        const lFunction = new PotatnoDocumentFunction(PotatnoHelper.TEST_PROJECT, lDocument, {
            definitionId: PotatnoHelper.TEST_PROJECT.entryPoint.id,
            id: 'fn', label: 'fn', isSystem: false
        });

        // Evaluation.
        expect(lFunction.imports.size).toBe(0);
    });
});

Deno.test('PotatnoDocumentFunction.id', async (pContext) => {
    await pContext.step('Returns a id', () => {
        // Setup. Process.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(typeof lFunction.id).toBe('string');
    });
});

Deno.test('PotatnoDocumentFunction.definitionId', async (pContext) => {
    await pContext.step('Returns the provided definition id', () => {
        // Setup. Process.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(lFunction.definitionId).toBe(PotatnoHelper.TEST_PROJECT.entryPoint.id);
    });
});

Deno.test('PotatnoDocumentFunction.document', async (pContext) => {
    await pContext.step('Returns the provided lDocument', () => {
        // Setup. Process.
        const { document: lDocument, function: lFunction } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(lFunction.document).toBe(lDocument);
    });
});

Deno.test('PotatnoDocumentFunction.project', async (pContext) => {
    await pContext.step('Returns the provided project', () => {
        // Setup. Process.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(lFunction.project).toBe(PotatnoHelper.TEST_PROJECT);
    });
});

Deno.test('PotatnoDocumentFunction.label', async (pContext) => {
    await pContext.step('Getter returns the constructor value', () => {
        // Setup. Process.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(lFunction.label).toBe(PotatnoHelper.TEST_PROJECT.entryPoint.label);
    });

    await pContext.step('Setter updates the label', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();

        // Process.
        lFunction.label = 'renamed';

        // Evaluation.
        expect(lFunction.label).toBe('renamed');
    });
});

Deno.test('PotatnoDocumentFunction.isSystem', async (pContext) => {
    await pContext.step('Returns true for system function', () => {
        // Setup. Process.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(lFunction.isSystem).toBe(true);
    });

    await pContext.step('Returns false for user function', () => {
        // Setup.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);

        // Process.
        const lUserFunction = lDocument.newFunction({
            definitionId: PotatnoHelper.TEST_PROJECT.entryPoint.id,
            id: 'usr', label: 'usr', isSystem: false
        });

        // Evaluation.
        expect(lUserFunction.isSystem).toBe(false);
    });
});

Deno.test('PotatnoDocumentFunction.nodes', async (pContext) => {
    await pContext.step('Empty after construction', () => {
        // Setup. Process.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);
        const lFunction = lDocument.newFunction({
            definitionId: PotatnoHelper.TEST_PROJECT.entryPoint.id,
            id: 'fn', label: 'fn', isSystem: false
        });

        // Evaluation.
        expect(lFunction.nodes.size).toBe(0);
    });

    await pContext.step('Contains added nodes', () => {
        // Setup. Process.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation. The helper syncs the Default + X10 entry and exit nodes.
        expect(lFunction.nodes.size).toBe(4);
    });

    await pContext.step('Does not contain removed nodes', () => {
        // Setup.
        const { function: lFunction, defaultEntry: lDefaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Process.
        lFunction.removeNode(lDefaultEntry);

        // Evaluation.
        expect(lFunction.nodes.has(lDefaultEntry)).toBe(false);
    });
});

Deno.test('PotatnoDocumentFunction.imports', async (pContext) => {
    await pContext.step('Empty after construction', () => {
        // Setup. Process.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(lFunction.imports.size).toBe(0);
    });

    await pContext.step('Contains added imports', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();

        // Process.
        lFunction.addImport('ExtraComparison');

        // Evaluation.
        expect([...lFunction.imports]).toEqual(['ExtraComparison']);
    });
});

Deno.test('PotatnoDocumentFunction.inputs', async (pContext) => {
    await pContext.step('Empty after construction', () => {
        // Setup. Process.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(lFunction.inputs.length).toBe(0);
    });

    await pContext.step('Contains added input ports in insertion order', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();

        // Process.
        lFunction.addInput({ label: 'first', dataType: 'number' as never });
        lFunction.addInput({ label: 'second', dataType: 'string' as never });

        // Evaluation.
        expect(lFunction.inputs.map((pPort) => pPort.label)).toEqual(['first', 'second']);
    });
});

Deno.test('PotatnoDocumentFunction.outputs', async (pContext) => {
    await pContext.step('Empty after construction', () => {
        // Setup. Process.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(lFunction.outputs.length).toBe(0);
    });

    await pContext.step('Contains added output ports in insertion order', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();

        // Process.
        lFunction.addOutput({ label: 'first', dataType: 'number' as never });
        lFunction.addOutput({ label: 'second', dataType: 'string' as never });

        // Evaluation.
        expect(lFunction.outputs.map((pPort) => pPort.label)).toEqual(['first', 'second']);
    });
});

Deno.test('PotatnoDocumentFunction.nodeDefinitions', async (pContext) => {
    await pContext.step('Returns document definitions when the function definition has no dynamic provider', () => {
        // Setup. Process.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation. At minimum the project's added definitions are present.
        expect(lFunction.nodeDefinitions.length).toBeGreaterThan(0);
    });

    await pContext.step("Includes dynamic definitions returned by the function definition's dynamic callback", () => {
        // Setup. Helper functions in PotatnoHelper.TEST_PROJECT have no dynamic provider in
        // the fixture; assert that the calculator's available definitions are a
        // superset of the project's static node definitions.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lProjectIds: Set<string> = new Set(PotatnoHelper.TEST_PROJECT.nodeDefinitions.map((pDef) => pDef.id));

        // Process.
        const lFunctionIds: Set<string> = new Set(lFunction.nodeDefinitions.map((pDef) => pDef.id));

        // Evaluation.
        for (const lProjectId of lProjectIds) {
            expect(lFunctionIds.has(lProjectId)).toBe(true);
        }
    });

    await pContext.step('Includes node definitions from enabled import ids', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        lFunction.addImport('ExtraComparison');

        // Process.
        const lFunctionIds: Set<string> = new Set(lFunction.nodeDefinitions.map((pDef) => pDef.id));

        // Evaluation.
        expect(lFunctionIds.has('GreaterOrEqual')).toBe(true);
        expect(lFunctionIds.has('SmallerOrEqual')).toBe(true);
    });

    await pContext.step('Rejects imported node definitions by import label', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();

        // Process.
        const lAction = (): void => {
            lFunction.addImport('Extra Comparison');
        };

        // Evaluation.
        expect(lAction).toThrow('Project does not contain import Extra Comparison');
        const lFunctionIds: Set<string> = new Set(lFunction.nodeDefinitions.map((pDef) => pDef.id));
        expect(lFunctionIds.has('GreaterOrEqual')).toBe(false);
    });
});

Deno.test('PotatnoDocumentFunction.addImport()', async (pContext) => {
    await pContext.step('Adds a new import', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();

        // Process.
        lFunction.addImport('ExtraComparison');

        // Evaluation.
        expect([...lFunction.imports]).toEqual(['ExtraComparison']);
    });

    await pContext.step('No-op for duplicate import', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();

        // Process.
        lFunction.addImport('ExtraComparison');
        lFunction.addImport('ExtraComparison');

        // Evaluation.
        expect([...lFunction.imports]).toEqual(['ExtraComparison']);
    });
});

Deno.test('PotatnoDocumentFunction.removeImport()', async (pContext) => {
    await pContext.step('Removes an existing import', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        lFunction.addImport('ExtraComparison');

        // Process.
        lFunction.removeImport('ExtraComparison');

        // Evaluation.
        expect(lFunction.imports.size).toBe(0);
    });

    await pContext.step('No-op for unknown import', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        lFunction.addImport('ExtraComparison');

        // Process.
        lFunction.removeImport('Unknown');

        // Evaluation.
        expect([...lFunction.imports]).toEqual(['ExtraComparison']);
    });
});

Deno.test('PotatnoDocumentFunction.addInput()', async (pContext) => {
    await pContext.step('Adds a new input', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();

        // Process.
        lFunction.addInput({ label: 'first', dataType: 'number' as never });

        // Evaluation.
        expect(lFunction.inputs.length).toBe(1);
    });

    await pContext.step('No-op for duplicate label', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();

        // Process.
        lFunction.addInput({ label: 'first', dataType: 'number' as never });
        lFunction.addInput({ label: 'first', dataType: 'number' as never });

        // Evaluation.
        expect(lFunction.inputs.length).toBe(1);
    });
});

Deno.test('PotatnoDocumentFunction.removeInput()', async (pContext) => {
    await pContext.step('Removes an existing input by label', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        lFunction.addInput({ label: 'first', dataType: 'number' as never });

        // Process.
        lFunction.removeInput({ label: 'first', dataType: 'number' as never });

        // Evaluation.
        expect(lFunction.inputs.length).toBe(0);
    });

    await pContext.step('No-op for unknown label', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        lFunction.addInput({ label: 'first', dataType: 'number' as never });

        // Process.
        lFunction.removeInput({ label: 'unknown', dataType: 'number' as never });

        // Evaluation.
        expect(lFunction.inputs.length).toBe(1);
    });
});

Deno.test('PotatnoDocumentFunction.addOutput()', async (pContext) => {
    await pContext.step('Adds a new output', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();

        // Process.
        lFunction.addOutput({ label: 'first', dataType: 'number' as never });

        // Evaluation.
        expect(lFunction.outputs.length).toBe(1);
    });

    await pContext.step('No-op for duplicate label', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();

        // Process.
        lFunction.addOutput({ label: 'first', dataType: 'number' as never });
        lFunction.addOutput({ label: 'first', dataType: 'number' as never });

        // Evaluation.
        expect(lFunction.outputs.length).toBe(1);
    });
});

Deno.test('PotatnoDocumentFunction.removeOutput()', async (pContext) => {
    await pContext.step('Removes an existing output by label', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        lFunction.addOutput({ label: 'first', dataType: 'number' as never });

        // Process.
        lFunction.removeOutput({ label: 'first', dataType: 'number' as never });

        // Evaluation.
        expect(lFunction.outputs.length).toBe(0);
    });

    await pContext.step('No-op for unknown label', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        lFunction.addOutput({ label: 'first', dataType: 'number' as never });

        // Process.
        lFunction.removeOutput({ label: 'unknown', dataType: 'number' as never });

        // Evaluation.
        expect(lFunction.outputs.length).toBe(1);
    });
});

Deno.test('PotatnoDocumentFunction.addNode()', async (pContext) => {
    await pContext.step('Adds a pre-built node to the nodes set', () => {
        // Setup.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);
        const lFunction = lDocument.newFunction({
            definitionId: PotatnoHelper.TEST_PROJECT.entryPoint.id,
            id: 'fn', label: 'fn', isSystem: false
        });
        const lDefinition = PotatnoHelper.TEST_PROJECT.nodeDefinitions.find((pDef) => pDef.id === 'Add')!;
        const lExternalNode = new PotatnoDocumentNode(PotatnoHelper.TEST_PROJECT, lDocument, lFunction, {
            category: lDefinition.category,
            definitionId: lDefinition.id,
            label: lDefinition.label,
            transformation: { x: 0, y: 0, width: 4, height: 2 },
            ports: { input: [], output: [] }
        });

        // Process.
        lFunction.addNode(lExternalNode);

        // Evaluation.
        expect(lFunction.nodes.has(lExternalNode)).toBe(true);
    });
});

Deno.test('PotatnoDocumentFunction.newNode()', async (pContext) => {
    await pContext.step('Creates a node from the definition', () => {
        // Setup. Process.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lAddNode = PotatnoHelper.addProjectNode(lFunction, 'Add');

        // Evaluation.
        expect(lAddNode.definitionId).toBe('Add');
    });

    await pContext.step('Mirrors definition input port ids and types', () => {
        // Setup. Process.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lAddNode = PotatnoHelper.addProjectNode(lFunction, 'Add');

        // Evaluation. Add has two number inputs: 'a' and 'b'.
        expect(lAddNode.inputs.list.map((pPort) => pPort.definitionId)).toEqual(['a', 'b']);
        expect(lAddNode.inputs.list.every((pPort) => pPort.dataType === 'number')).toBe(true);
    });

    await pContext.step('Mirrors definition output port ids and types', () => {
        // Setup. Process.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lAddNode = PotatnoHelper.addProjectNode(lFunction, 'Add');

        // Evaluation.
        expect(lAddNode.outputs.list.map((pPort) => pPort.definitionId)).toEqual(['result']);
        expect(lAddNode.outputs.list[0].dataType).toBe('number');
    });

});

Deno.test('PotatnoDocumentFunction.removeNode()', async (pContext) => {
    await pContext.step('Removes the node from the set', () => {
        // Setup.
        const { function: lFunction, defaultEntry: lDefaultEntry } = PotatnoHelper.setupCalculatorDocument();

        // Process.
        lFunction.removeNode(lDefaultEntry);

        // Evaluation.
        expect(lFunction.nodes.has(lDefaultEntry)).toBe(false);
    });

    await pContext.step('Disconnects all input port connections before removal', () => {
        // Setup. Wire an Add → Exit, then remove the Exit.
        const { function: lFunction, defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();
        const lAddNode = PotatnoHelper.addProjectNode(lFunction, 'Add');
        lAddNode.outputs.value[0].connect(lDefaultExit.inputs.value.find((pPort) => pPort.definitionId === 'result')!);
        const lAddOutput = lAddNode.outputs.value[0];

        // Process.
        lFunction.removeNode(lDefaultExit);

        // Evaluation. The peer must have dropped the connection too.
        expect(lAddOutput.connectedPorts.size).toBe(0);
    });

    await pContext.step('Disconnects all output port connections before removal', () => {
        // Setup. Wire Entry → Add, then remove the Entry.
        const { function: lFunction, defaultEntry: lDefaultEntry } = PotatnoHelper.setupCalculatorDocument();
        const lAddNode = PotatnoHelper.addProjectNode(lFunction, 'Add');
        lDefaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'a')!
            .connect(lAddNode.inputs.value.find((pPort) => pPort.definitionId === 'a')!);
        const lAddInput = lAddNode.inputs.value.find((pPort) => pPort.definitionId === 'a')!;

        // Process.
        lFunction.removeNode(lDefaultEntry);

        // Evaluation.
        expect(lAddInput.connectedPorts.size).toBe(0);
    });
});

Deno.test('PotatnoDocumentFunction.getExitNodes()', async (pContext) => {
    await pContext.step('Returns nodes whose definitionId matches an exit definition', () => {
        // Setup. Process.
        const { function: lFunction, defaultExit: lDefaultExit, x10Exit: lX10Exit } = PotatnoHelper.setupCalculatorDocument();
        const lResultDefinitionIds = lFunction.getExitNodes().map((pDefinition) => {
            return pDefinition.definitionId;
        });

        // Evaluation. Both the Default and X10 exit nodes are synced by the helper.
        expect(lResultDefinitionIds.length).toBe(2);
        expect(lResultDefinitionIds).toContain(lDefaultExit.definitionId);
        expect(lResultDefinitionIds).toContain(lX10Exit.definitionId);
    });

    await pContext.step('Returns empty array when no exit-matching nodes exist', () => {
        // Setup. Build a function with the entry node only - no exit placed.
        const lEntryDefinition = PotatnoHelper.TEST_PROJECT.entryPoint;
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);
        const lFunction = lDocument.newFunction({
            definitionId: lEntryDefinition.id,
            id: 'no-exits', label: 'no-exits', isSystem: true
        });
        const lNodes = lEntryDefinition.getNodeDefinitions(lFunction);
        lFunction.addNodeByDefinition(lNodes.entry[0], { x: 0, y: 0, width: 4, height: 2 });

        // Process.
        const lResult = lFunction.getExitNodes();

        // Evaluation.
        expect(lResult.length).toBe(0);
    });
});

Deno.test('Error: PotatnoDocumentFunction.getExitNodes() on missing definition', async (pContext) => {
    await pContext.step('Throws when the function definition cannot be found', () => {
        // Setup.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);
        const lFunction = lDocument.newFunction({
            definitionId: 'no-such-definition',
            id: 'orphan', label: 'orphan', isSystem: true
        });

        // Process.
        const lAction = (): void => { lFunction.getExitNodes(); };

        // Evaluation.
        expect(lAction).toThrow('Function definition not found for function "orphan".');
    });
});

Deno.test('PotatnoDocumentFunction - Validation', async (pContext) => {
    await pContext.step('Valid graph', () => {
        // Setup. Entry → Add → Exit, fully wired and value-supplied.
        const { function: lFunction, defaultEntry: lDefaultEntry, defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();
        const lAddNode = PotatnoHelper.addProjectNode(lFunction, 'Add');
        lDefaultEntry.outputs.flow[0].connect(lDefaultExit.inputs.flow[0]);
        lDefaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'a')!
            .connect(lAddNode.inputs.value.find((pPort) => pPort.definitionId === 'a')!);
        lDefaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'b')!
            .connect(lAddNode.inputs.value.find((pPort) => pPort.definitionId === 'b')!);
        lAddNode.outputs.value[0].connect(lDefaultExit.inputs.value.find((pPort) => pPort.definitionId === 'result')!);

        // Process.
        const lErrors = lFunction.validate();

        // Evaluation.
        expect(lErrors.length).toBe(0);
    });

    await pContext.step('Missing function definition', () => {
        // Setup.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);
        const lFunction = lDocument.newFunction({
            definitionId: 'no-such-definition',
            id: 'orphan', label: 'orphan', isSystem: true
        });

        // Process.
        const lErrors = lFunction.validate();

        // Evaluation.
        expect(lErrors.some((pError) => pError.message === 'Function "orphan" definition "no-such-definition" could not be found.')).toBe(true);
    });

    await pContext.step('Flow input not connected', () => {
        // Setup. Default exit's flow input is unconnected.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();

        // Process.
        const lErrors = lFunction.validate();

        // Evaluation.
        expect(lErrors.some((pError) => /Flow input port/.test(pError.message))).toBe(true);
    });

    await pContext.step('Connection cycle in graph', () => {
        // Setup. Pass A → Pass B → Pass A (flow cycle).
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lPassA = PotatnoHelper.addProjectNode(lFunction, 'Pass');
        const lPassB = PotatnoHelper.addProjectNode(lFunction, 'Pass');
        lPassA.outputs.flow[0].connect(lPassB.inputs.flow[0]);
        lPassB.outputs.flow[0].connect(lPassA.inputs.flow[0]);

        // Process.
        const lErrors = lFunction.validate();

        // Evaluation.
        expect(lErrors.some((pError) => /is part of a connection cycle/.test(pError.message))).toBe(true);
    });

    await pContext.step('Node reachable from multiple entry nodes', () => {
        // Setup. Route both the Default and X10 entries (synced by the helper) into a shared downstream Pass node.
        const { function: lFunction, defaultEntry: lDefaultEntry, x10Entry: lX10Entry } = PotatnoHelper.setupCalculatorDocument();
        const lSharedPass = PotatnoHelper.addProjectNode(lFunction, 'Pass');
        lDefaultEntry.outputs.flow[0].connect(lSharedPass.inputs.flow[0]);
        lX10Entry.outputs.flow[0].connect(lSharedPass.inputs.flow[0]);

        // Process.
        const lErrors = lFunction.validate();

        // Evaluation.
        expect(lErrors.some((pError) => pError.message === `Node "${lSharedPass.label}" is reachable from multiple entry nodes.`)).toBe(true);
    });

    await pContext.step('Validation errors include item references', () => {
        // Setup. Build a graph with a connection cycle so we can assert on item identity.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lPassA = PotatnoHelper.addProjectNode(lFunction, 'Pass');
        const lPassB = PotatnoHelper.addProjectNode(lFunction, 'Pass');
        lPassA.outputs.flow[0].connect(lPassB.inputs.flow[0]);
        lPassB.outputs.flow[0].connect(lPassA.inputs.flow[0]);

        // Process.
        const lErrors = lFunction.validate();

        // Evaluation. The cycle error's item is one of the two pass nodes.
        const lCycleError = lErrors.find((pError) => /is part of a connection cycle/.test(pError.message));
        expect(lCycleError).toBeDefined();
        expect([lPassA.definitionId, lPassB.definitionId]).toContain(lCycleError!.item.definitionId);
    });
});
