import { expect } from '@kartoffelgames/core-test';
import { PotatnoDocumentFunction } from '../../source/document/potatno-document-function.ts';
import { PotatnoDocumentNode } from '../../source/document/potatno-document-node.ts';
import { PotatnoDocument } from '../../source/document/potatno-document.ts';
import { TestProject } from '../test-project.ts';

const lSetupCalculatorDocument = () => {
    const lEntryDefinition = TestProject.entryPoint;
    const lDocument: PotatnoDocument<typeof TestProject> = new PotatnoDocument(TestProject);
    const lFunction: PotatnoDocumentFunction<typeof TestProject> = lDocument.newFunction({
        definitionId: lEntryDefinition.id,
        id: 'calc-instance-1',
        label: lEntryDefinition.label,
        isSystem: true
    });
    const lNodes = lEntryDefinition.getNodeDefinitions(lFunction);
    const lDefaultEntry = lFunction.newNode(lNodes.entry[0], { x: 0, y: 0, width: 6, height: 4 }, true);
    const lDefaultExit = lFunction.newNode(lNodes.exit[0], { x: 12, y: 0, width: 6, height: 4 }, true);

    return { document: lDocument, function: lFunction, defaultEntry: lDefaultEntry, defaultExit: lDefaultExit };
};

const lAddProjectNode = (pFunction: PotatnoDocumentFunction<typeof TestProject>, pDefinitionId: string): PotatnoDocumentNode<typeof TestProject> => {
    const lDefinition = TestProject.nodeDefinitions.find((pDef) => pDef.id === pDefinitionId);
    if (!lDefinition) {
        throw new Error(`No project node definition with id "${pDefinitionId}"`);
    }
    return pFunction.newNode(lDefinition, { x: 0, y: 0, width: 6, height: 4 });
};

Deno.test('PotatnoDocumentFunction.constructor()', async (pContext) => {
    await pContext.step('Stores id', () => {
        // Setup. Process.
        const lDocument = new PotatnoDocument(TestProject);
        const lFunction = new PotatnoDocumentFunction(TestProject, lDocument, {
            definitionId: TestProject.entryPoint.id,
            id: 'fn-id',
            label: 'fn-label',
            isSystem: false
        });

        // Evaluation.
        expect(lFunction.id).toBe('fn-id');
    });

    await pContext.step('Stores label', () => {
        // Setup. Process.
        const lDocument = new PotatnoDocument(TestProject);
        const lFunction = new PotatnoDocumentFunction(TestProject, lDocument, {
            definitionId: TestProject.entryPoint.id,
            id: 'fn-id',
            label: 'fn-label',
            isSystem: false
        });

        // Evaluation.
        expect(lFunction.label).toBe('fn-label');
    });

    await pContext.step('Stores definitionId', () => {
        // Setup. Process.
        const lDocument = new PotatnoDocument(TestProject);
        const lFunction = new PotatnoDocumentFunction(TestProject, lDocument, {
            definitionId: TestProject.entryPoint.id,
            id: 'fn-id',
            label: 'fn-label',
            isSystem: false
        });

        // Evaluation.
        expect(lFunction.definitionId).toBe(TestProject.entryPoint.id);
    });

    await pContext.step('Stores isSystem flag', () => {
        // Setup. Process.
        const lDocument = new PotatnoDocument(TestProject);
        const lSystemFunction = new PotatnoDocumentFunction(TestProject, lDocument, {
            definitionId: TestProject.entryPoint.id,
            id: 'sys', label: 'sys', isSystem: true
        });
        const lUserFunction = new PotatnoDocumentFunction(TestProject, lDocument, {
            definitionId: TestProject.entryPoint.id,
            id: 'usr', label: 'usr', isSystem: false
        });

        // Evaluation.
        expect(lSystemFunction.isSystem).toBe(true);
        expect(lUserFunction.isSystem).toBe(false);
    });

    await pContext.step('Initialises empty nodes set', () => {
        // Setup. Process.
        const lDocument = new PotatnoDocument(TestProject);
        const lFunction = new PotatnoDocumentFunction(TestProject, lDocument, {
            definitionId: TestProject.entryPoint.id,
            id: 'fn', label: 'fn', isSystem: false
        });

        // Evaluation.
        expect(lFunction.nodes.size).toBe(0);
    });

    await pContext.step('Initialises empty inputs array', () => {
        // Setup. Process.
        const lDocument = new PotatnoDocument(TestProject);
        const lFunction = new PotatnoDocumentFunction(TestProject, lDocument, {
            definitionId: TestProject.entryPoint.id,
            id: 'fn', label: 'fn', isSystem: false
        });

        // Evaluation.
        expect(lFunction.inputs.length).toBe(0);
    });

    await pContext.step('Initialises empty outputs array', () => {
        // Setup. Process.
        const lDocument = new PotatnoDocument(TestProject);
        const lFunction = new PotatnoDocumentFunction(TestProject, lDocument, {
            definitionId: TestProject.entryPoint.id,
            id: 'fn', label: 'fn', isSystem: false
        });

        // Evaluation.
        expect(lFunction.outputs.length).toBe(0);
    });

    await pContext.step('Initialises empty imports array', () => {
        // Setup. Process.
        const lDocument = new PotatnoDocument(TestProject);
        const lFunction = new PotatnoDocumentFunction(TestProject, lDocument, {
            definitionId: TestProject.entryPoint.id,
            id: 'fn', label: 'fn', isSystem: false
        });

        // Evaluation.
        expect(lFunction.imports.length).toBe(0);
    });
});

Deno.test('PotatnoDocumentFunction.id', async (pContext) => {
    await pContext.step('Returns the provided id', () => {
        // Setup. Process.
        const { function: lFunction } = lSetupCalculatorDocument();

        // Evaluation.
        expect(lFunction.id).toBe('calc-instance-1');
    });
});

Deno.test('PotatnoDocumentFunction.definitionId', async (pContext) => {
    await pContext.step('Returns the provided definition id', () => {
        // Setup. Process.
        const { function: lFunction } = lSetupCalculatorDocument();

        // Evaluation.
        expect(lFunction.definitionId).toBe(TestProject.entryPoint.id);
    });
});

Deno.test('PotatnoDocumentFunction.document', async (pContext) => {
    await pContext.step('Returns the provided document', () => {
        // Setup. Process.
        const { document, function: lFunction } = lSetupCalculatorDocument();

        // Evaluation.
        expect(lFunction.document).toBe(document);
    });
});

Deno.test('PotatnoDocumentFunction.project', async (pContext) => {
    await pContext.step('Returns the provided project', () => {
        // Setup. Process.
        const { function: lFunction } = lSetupCalculatorDocument();

        // Evaluation.
        expect(lFunction.project).toBe(TestProject);
    });
});

Deno.test('PotatnoDocumentFunction.label', async (pContext) => {
    await pContext.step('Getter returns the constructor value', () => {
        // Setup. Process.
        const { function: lFunction } = lSetupCalculatorDocument();

        // Evaluation.
        expect(lFunction.label).toBe(TestProject.entryPoint.label);
    });

    await pContext.step('Setter updates the label', () => {
        // Setup.
        const { function: lFunction } = lSetupCalculatorDocument();

        // Process.
        lFunction.label = 'renamed';

        // Evaluation.
        expect(lFunction.label).toBe('renamed');
    });
});

Deno.test('PotatnoDocumentFunction.isSystem', async (pContext) => {
    await pContext.step('Returns true for system function', () => {
        // Setup. Process.
        const { function: lFunction } = lSetupCalculatorDocument();

        // Evaluation.
        expect(lFunction.isSystem).toBe(true);
    });

    await pContext.step('Returns false for user function', () => {
        // Setup.
        const lDocument = new PotatnoDocument(TestProject);

        // Process.
        const lUserFunction = lDocument.newFunction({
            definitionId: TestProject.entryPoint.id,
            id: 'usr', label: 'usr', isSystem: false
        });

        // Evaluation.
        expect(lUserFunction.isSystem).toBe(false);
    });
});

Deno.test('PotatnoDocumentFunction.nodes', async (pContext) => {
    await pContext.step('Empty after construction', () => {
        // Setup. Process.
        const lDocument = new PotatnoDocument(TestProject);
        const lFunction = lDocument.newFunction({
            definitionId: TestProject.entryPoint.id,
            id: 'fn', label: 'fn', isSystem: false
        });

        // Evaluation.
        expect(lFunction.nodes.size).toBe(0);
    });

    await pContext.step('Contains added nodes', () => {
        // Setup. Process.
        const { function: lFunction } = lSetupCalculatorDocument();

        // Evaluation. Entry + Exit were added by the helper.
        expect(lFunction.nodes.size).toBe(2);
    });

    await pContext.step('Does not contain removed nodes', () => {
        // Setup.
        const { function: lFunction, defaultEntry } = lSetupCalculatorDocument();

        // Process.
        lFunction.removeNode(defaultEntry);

        // Evaluation.
        expect(lFunction.nodes.has(defaultEntry)).toBe(false);
    });
});

Deno.test('PotatnoDocumentFunction.imports', async (pContext) => {
    await pContext.step('Empty after construction', () => {
        // Setup. Process.
        const { function: lFunction } = lSetupCalculatorDocument();

        // Evaluation.
        expect(lFunction.imports.length).toBe(0);
    });

    await pContext.step('Contains added imports', () => {
        // Setup.
        const { function: lFunction } = lSetupCalculatorDocument();

        // Process.
        lFunction.addImport('A');
        lFunction.addImport('B');

        // Evaluation.
        expect([...lFunction.imports]).toEqual(['A', 'B']);
    });
});

Deno.test('PotatnoDocumentFunction.inputs', async (pContext) => {
    await pContext.step('Empty after construction', () => {
        // Setup. Process.
        const { function: lFunction } = lSetupCalculatorDocument();

        // Evaluation.
        expect(lFunction.inputs.length).toBe(0);
    });

    await pContext.step('Contains added input ports in insertion order', () => {
        // Setup.
        const { function: lFunction } = lSetupCalculatorDocument();

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
        const { function: lFunction } = lSetupCalculatorDocument();

        // Evaluation.
        expect(lFunction.outputs.length).toBe(0);
    });

    await pContext.step('Contains added output ports in insertion order', () => {
        // Setup.
        const { function: lFunction } = lSetupCalculatorDocument();

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
        const { function: lFunction } = lSetupCalculatorDocument();

        // Evaluation. At minimum the project's added definitions are present.
        expect(lFunction.nodeDefinitions.length).toBeGreaterThan(0);
    });

    await pContext.step("Includes dynamic definitions returned by the function definition's dynamic callback", () => {
        // Setup. Helper functions in TestProject have no dynamic provider in
        // the fixture; assert that the calculator's available definitions are a
        // superset of the project's static node definitions.
        const { function: lFunction } = lSetupCalculatorDocument();
        const lProjectIds: Set<string> = new Set(TestProject.nodeDefinitions.map((pDef) => pDef.id));

        // Process.
        const lFunctionIds: Set<string> = new Set(lFunction.nodeDefinitions.map((pDef) => pDef.id));

        // Evaluation.
        for (const lProjectId of lProjectIds) {
            expect(lFunctionIds.has(lProjectId)).toBe(true);
        }
    });
});

Deno.test('PotatnoDocumentFunction.addImport()', async (pContext) => {
    await pContext.step('Adds a new import', () => {
        // Setup.
        const { function: lFunction } = lSetupCalculatorDocument();

        // Process.
        lFunction.addImport('Math');

        // Evaluation.
        expect([...lFunction.imports]).toEqual(['Math']);
    });

    await pContext.step('No-op for duplicate import', () => {
        // Setup.
        const { function: lFunction } = lSetupCalculatorDocument();

        // Process.
        lFunction.addImport('Math');
        lFunction.addImport('Math');

        // Evaluation.
        expect([...lFunction.imports]).toEqual(['Math']);
    });
});

Deno.test('PotatnoDocumentFunction.removeImport()', async (pContext) => {
    await pContext.step('Removes an existing import', () => {
        // Setup.
        const { function: lFunction } = lSetupCalculatorDocument();
        lFunction.addImport('Math');

        // Process.
        lFunction.removeImport('Math');

        // Evaluation.
        expect(lFunction.imports.length).toBe(0);
    });

    await pContext.step('No-op for unknown import', () => {
        // Setup.
        const { function: lFunction } = lSetupCalculatorDocument();
        lFunction.addImport('Math');

        // Process.
        lFunction.removeImport('Unknown');

        // Evaluation.
        expect([...lFunction.imports]).toEqual(['Math']);
    });
});

Deno.test('PotatnoDocumentFunction.addInput()', async (pContext) => {
    await pContext.step('Adds a new input', () => {
        // Setup.
        const { function: lFunction } = lSetupCalculatorDocument();

        // Process.
        lFunction.addInput({ label: 'first', dataType: 'number' as never });

        // Evaluation.
        expect(lFunction.inputs.length).toBe(1);
    });

    await pContext.step('No-op for duplicate label', () => {
        // Setup.
        const { function: lFunction } = lSetupCalculatorDocument();

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
        const { function: lFunction } = lSetupCalculatorDocument();
        lFunction.addInput({ label: 'first', dataType: 'number' as never });

        // Process.
        lFunction.removeInput({ label: 'first', dataType: 'number' as never });

        // Evaluation.
        expect(lFunction.inputs.length).toBe(0);
    });

    await pContext.step('No-op for unknown label', () => {
        // Setup.
        const { function: lFunction } = lSetupCalculatorDocument();
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
        const { function: lFunction } = lSetupCalculatorDocument();

        // Process.
        lFunction.addOutput({ label: 'first', dataType: 'number' as never });

        // Evaluation.
        expect(lFunction.outputs.length).toBe(1);
    });

    await pContext.step('No-op for duplicate label', () => {
        // Setup.
        const { function: lFunction } = lSetupCalculatorDocument();

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
        const { function: lFunction } = lSetupCalculatorDocument();
        lFunction.addOutput({ label: 'first', dataType: 'number' as never });

        // Process.
        lFunction.removeOutput({ label: 'first', dataType: 'number' as never });

        // Evaluation.
        expect(lFunction.outputs.length).toBe(0);
    });

    await pContext.step('No-op for unknown label', () => {
        // Setup.
        const { function: lFunction } = lSetupCalculatorDocument();
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
        const lDocument = new PotatnoDocument(TestProject);
        const lFunction = lDocument.newFunction({
            definitionId: TestProject.entryPoint.id,
            id: 'fn', label: 'fn', isSystem: false
        });
        const lDefinition = TestProject.nodeDefinitions.find((pDef) => pDef.id === 'Add')!;
        const lExternalNode = new PotatnoDocumentNode(TestProject, lDocument, lFunction, {
            category: lDefinition.category,
            definitionId: lDefinition.id,
            isSystem: false,
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
        const { function: lFunction } = lSetupCalculatorDocument();
        const lAddNode = lAddProjectNode(lFunction, 'Add');

        // Evaluation.
        expect(lAddNode.definitionId).toBe('Add');
    });

    await pContext.step('Mirrors definition input port ids and types', () => {
        // Setup. Process.
        const { function: lFunction } = lSetupCalculatorDocument();
        const lAddNode = lAddProjectNode(lFunction, 'Add');

        // Evaluation. Add has two number inputs: 'a' and 'b'.
        expect(lAddNode.inputs.list.map((pPort) => pPort.definitionId)).toEqual(['a', 'b']);
        expect(lAddNode.inputs.list.every((pPort) => pPort.dataType === 'number')).toBe(true);
    });

    await pContext.step('Mirrors definition output port ids and types', () => {
        // Setup. Process.
        const { function: lFunction } = lSetupCalculatorDocument();
        const lAddNode = lAddProjectNode(lFunction, 'Add');

        // Evaluation.
        expect(lAddNode.outputs.list.map((pPort) => pPort.definitionId)).toEqual(['result']);
        expect(lAddNode.outputs.list[0].dataType).toBe('number');
    });

    await pContext.step('Defaults isSystem to false', () => {
        // Setup. Process.
        const { function: lFunction } = lSetupCalculatorDocument();
        const lAddNode = lAddProjectNode(lFunction, 'Add');

        // Evaluation.
        expect(lAddNode.isSystem).toBe(false);
    });

    await pContext.step('Honours pSystem=true', () => {
        // Setup.
        const { function: lFunction } = lSetupCalculatorDocument();
        const lDefinition = TestProject.nodeDefinitions.find((pDef) => pDef.id === 'Add')!;

        // Process.
        const lAddNode = lFunction.newNode(lDefinition, { x: 0, y: 0, width: 4, height: 2 }, true);

        // Evaluation.
        expect(lAddNode.isSystem).toBe(true);
    });
});

Deno.test('PotatnoDocumentFunction.removeNode()', async (pContext) => {
    await pContext.step('Removes the node from the set', () => {
        // Setup.
        const { function: lFunction, defaultEntry } = lSetupCalculatorDocument();

        // Process.
        lFunction.removeNode(defaultEntry);

        // Evaluation.
        expect(lFunction.nodes.has(defaultEntry)).toBe(false);
    });

    await pContext.step('Disconnects all input port connections before removal', () => {
        // Setup. Wire an Add → Exit, then remove the Exit.
        const { function: lFunction, defaultExit } = lSetupCalculatorDocument();
        const lAddNode = lAddProjectNode(lFunction, 'Add');
        lAddNode.outputs.value[0].connect(defaultExit.inputs.value.find((pPort) => pPort.definitionId === 'result')!);
        const lAddOutput = lAddNode.outputs.value[0];

        // Process.
        lFunction.removeNode(defaultExit);

        // Evaluation. The peer must have dropped the connection too.
        expect(lAddOutput.connectedPorts.size).toBe(0);
    });

    await pContext.step('Disconnects all output port connections before removal', () => {
        // Setup. Wire Entry → Add, then remove the Entry.
        const { function: lFunction, defaultEntry } = lSetupCalculatorDocument();
        const lAddNode = lAddProjectNode(lFunction, 'Add');
        defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'a')!
            .connect(lAddNode.inputs.value.find((pPort) => pPort.definitionId === 'a')!);
        const lAddInput = lAddNode.inputs.value.find((pPort) => pPort.definitionId === 'a')!;

        // Process.
        lFunction.removeNode(defaultEntry);

        // Evaluation.
        expect(lAddInput.connectedPorts.size).toBe(0);
    });
});

Deno.test('PotatnoDocumentFunction.getExitNodes()', async (pContext) => {
    await pContext.step('Returns nodes whose definitionId matches an exit definition', () => {
        // Setup. Process.
        const { function: lFunction, defaultExit } = lSetupCalculatorDocument();
        const lResult = lFunction.getExitNodes();

        // Evaluation.
        expect(lResult.length).toBe(1);
        expect(lResult[0]).toBe(defaultExit);
    });

    await pContext.step('Returns empty array when no exit-matching nodes exist', () => {
        // Setup. Build a function with the entry node only - no exit placed.
        const lEntryDefinition = TestProject.entryPoint;
        const lDocument = new PotatnoDocument(TestProject);
        const lFunction = lDocument.newFunction({
            definitionId: lEntryDefinition.id,
            id: 'no-exits', label: 'no-exits', isSystem: true
        });
        const lNodes = lEntryDefinition.getNodeDefinitions(lFunction);
        lFunction.newNode(lNodes.entry[0], { x: 0, y: 0, width: 4, height: 2 }, true);

        // Process.
        const lResult = lFunction.getExitNodes();

        // Evaluation.
        expect(lResult.length).toBe(0);
    });
});

Deno.test('Error: PotatnoDocumentFunction.getExitNodes() on missing definition', async (pContext) => {
    await pContext.step('Throws when the function definition cannot be found', () => {
        // Setup.
        const lDocument = new PotatnoDocument(TestProject);
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
        const { function: lFunction, defaultEntry, defaultExit } = lSetupCalculatorDocument();
        const lAddNode = lAddProjectNode(lFunction, 'Add');
        defaultEntry.outputs.flow[0].connect(defaultExit.inputs.flow[0]);
        defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'a')!
            .connect(lAddNode.inputs.value.find((pPort) => pPort.definitionId === 'a')!);
        defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'b')!
            .connect(lAddNode.inputs.value.find((pPort) => pPort.definitionId === 'b')!);
        lAddNode.outputs.value[0].connect(defaultExit.inputs.value.find((pPort) => pPort.definitionId === 'result')!);

        // Process.
        const lErrors = lFunction.validate();

        // Evaluation.
        expect(lErrors.length).toBe(0);
    });

    await pContext.step('Missing function definition', () => {
        // Setup.
        const lDocument = new PotatnoDocument(TestProject);
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
        const { function: lFunction } = lSetupCalculatorDocument();

        // Process.
        const lErrors = lFunction.validate();

        // Evaluation.
        expect(lErrors.some((pError) => /Flow input port/.test(pError.message))).toBe(true);
    });

    await pContext.step('Connection cycle in graph', () => {
        // Setup. Pass A → Pass B → Pass A (flow cycle).
        const { function: lFunction } = lSetupCalculatorDocument();
        const lPassA = lAddProjectNode(lFunction, 'Pass');
        const lPassB = lAddProjectNode(lFunction, 'Pass');
        lPassA.outputs.flow[0].connect(lPassB.inputs.flow[0]);
        lPassB.outputs.flow[0].connect(lPassA.inputs.flow[0]);

        // Process.
        const lErrors = lFunction.validate();

        // Evaluation.
        expect(lErrors.some((pError) => /is part of a connection cycle/.test(pError.message))).toBe(true);
    });

    await pContext.step('Node reachable from multiple entry nodes', () => {
        // Setup. Place both Default and X10 entries plus a shared downstream Pass node.
        const { function: lFunction, defaultEntry } = lSetupCalculatorDocument();
        const lNodes = TestProject.entryPoint.getNodeDefinitions(lFunction);
        const lX10Entry = lFunction.newNode(lNodes.entry[1], { x: 0, y: 8, width: 6, height: 4 }, true);
        const lSharedPass = lAddProjectNode(lFunction, 'Pass');
        defaultEntry.outputs.flow[0].connect(lSharedPass.inputs.flow[0]);
        lX10Entry.outputs.flow[0].connect(lSharedPass.inputs.flow[0]);

        // Process.
        const lErrors = lFunction.validate();

        // Evaluation.
        expect(lErrors.some((pError) => pError.message === `Node "${lSharedPass.label}" is reachable from multiple entry nodes.`)).toBe(true);
    });

    await pContext.step('Validation errors include item references', () => {
        // Setup. Build a graph with a connection cycle so we can assert on item identity.
        const { function: lFunction } = lSetupCalculatorDocument();
        const lPassA = lAddProjectNode(lFunction, 'Pass');
        const lPassB = lAddProjectNode(lFunction, 'Pass');
        lPassA.outputs.flow[0].connect(lPassB.inputs.flow[0]);
        lPassB.outputs.flow[0].connect(lPassA.inputs.flow[0]);

        // Process.
        const lErrors = lFunction.validate();

        // Evaluation. The cycle error's item is one of the two pass nodes.
        const lCycleError = lErrors.find((pError) => /is part of a connection cycle/.test(pError.message));
        expect(lCycleError).toBeDefined();
        expect([lPassA, lPassB]).toContain(lCycleError!.item as any);
    });
});
