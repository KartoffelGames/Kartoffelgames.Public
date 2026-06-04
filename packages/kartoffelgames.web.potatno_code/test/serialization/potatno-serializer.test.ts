import { expect } from '@kartoffelgames/core-test';
import { PotatnoDocumentFunction } from '../../source/document/potatno-document-function.ts';
import { PotatnoDocumentNode } from '../../source/document/potatno-document-node.ts';
import { PotatnoDocument } from '../../source/document/potatno-document.ts';
import { PotatnoSerializer } from '../../source/serialization/potatno-serializer.ts';
import { PotatnoHelper } from '../helper/potatno-helper.ts';
import { TestProject } from '../helper/test-project.ts';

// Structural equivalence helper. Compares functions, nodes, ports, and the
// connection multiset without depending on node-identity equality (the
// deserializer creates fresh instances).
const lExpectDocumentsEquivalent = (pActual: PotatnoDocument<typeof TestProject>, pExpected: PotatnoDocument<typeof TestProject>): void => {
    expect(pActual.functions.size).toBe(pExpected.functions.size);

    const lExpectedFunctions: Array<PotatnoDocumentFunction<typeof TestProject>> = [...pExpected.functions];
    const lActualFunctions: Array<PotatnoDocumentFunction<typeof TestProject>> = [...pActual.functions];

    for (let lIndex: number = 0; lIndex < lExpectedFunctions.length; lIndex++) {
        const lExpectedFunction = lExpectedFunctions[lIndex];
        const lActualFunction = lActualFunctions[lIndex];

        // Function metadata.
        expect(lActualFunction.id).toBe(lExpectedFunction.id);
        expect(lActualFunction.label).toBe(lExpectedFunction.label);
        expect(lActualFunction.isSystem).toBe(lExpectedFunction.isSystem);
        expect(lActualFunction.definitionId).toBe(lExpectedFunction.definitionId);
        expect([...lActualFunction.imports]).toEqual([...lExpectedFunction.imports]);
        expect(lActualFunction.inputs.length).toBe(lExpectedFunction.inputs.length);
        expect(lActualFunction.outputs.length).toBe(lExpectedFunction.outputs.length);

        // Compare nodes by definitionId in order. Node id is regenerated each
        // serialize pass so identity comparisons are unreliable.
        const lExpectedNodes: Array<PotatnoDocumentNode<typeof TestProject>> = [...lExpectedFunction.nodes];
        const lActualNodes: Array<PotatnoDocumentNode<typeof TestProject>> = [...lActualFunction.nodes];
        expect(lActualNodes.length).toBe(lExpectedNodes.length);

        for (let lNodeIndex: number = 0; lNodeIndex < lExpectedNodes.length; lNodeIndex++) {
            const lExpectedNode = lExpectedNodes[lNodeIndex];
            const lActualNode = lActualNodes[lNodeIndex];

            expect(lActualNode.definitionId).toBe(lExpectedNode.definitionId);
            expect(lActualNode.label).toBe(lExpectedNode.label);
            expect(lActualNode.category).toBe(lExpectedNode.category);
            expect(lActualNode.isSystem).toBe(lExpectedNode.isSystem);
            expect(lActualNode.transformation).toEqual(lExpectedNode.transformation);

            // Compare ports by definitionId.
            expect(lActualNode.inputs.list.length).toBe(lExpectedNode.inputs.list.length);
            expect(lActualNode.outputs.list.length).toBe(lExpectedNode.outputs.list.length);
            for (const lExpectedPort of [...lExpectedNode.inputs.list, ...lExpectedNode.outputs.list]) {
                const lActualPort = lActualNode.inputs.map.get(lExpectedPort.definitionId)
                    ?? lActualNode.outputs.map.get(lExpectedPort.definitionId);
                expect(lActualPort).toBeDefined();
                expect(lActualPort!.label).toBe(lExpectedPort.label);
                expect(lActualPort!.portType).toBe(lExpectedPort.portType);
                expect(lActualPort!.dataType).toBe(lExpectedPort.dataType);
                expect([...lActualPort!.directValue]).toEqual([...lExpectedPort.directValue]);
            }
        }

        // Compare connection multisets keyed by source/target definitionId
        // pairs. Connection ordering is not guaranteed.
        const lConnectionKey = (pSourceNodeDef: string, pSourcePortId: string, pTargetNodeDef: string, pTargetPortId: string): string =>
            `${pSourceNodeDef}.${pSourcePortId} -> ${pTargetNodeDef}.${pTargetPortId}`;

        const lCollectConnections = (pFunc: PotatnoDocumentFunction<typeof TestProject>): Array<string> => {
            const lEntries: Array<string> = [];
            for (const lNode of pFunc.nodes) {
                for (const lOutputPort of lNode.outputs.list) {
                    for (const lConnected of lOutputPort.connectedPorts) {
                        lEntries.push(lConnectionKey(lNode.definitionId, lOutputPort.definitionId, lConnected.node.definitionId, lConnected.definitionId));
                    }
                }
            }
            lEntries.sort();
            return lEntries;
        };

        expect(lCollectConnections(lActualFunction)).toEqual(lCollectConnections(lExpectedFunction));
    }
};

Deno.test('PotatnoSerializer.constructor()', async (pContext) => {
    await pContext.step('Construct without arguments', () => {
        // Setup. Process.
        const lSerializer = new PotatnoSerializer<typeof TestProject>();

        // Evaluation.
        expect(lSerializer).toBeDefined();
    });
});

Deno.test('PotatnoSerializer.serialize()', async (pContext) => {
    await pContext.step('Document Shape', async (pContext) => {
        await pContext.step('Empty document', () => {
            // Setup.
            const lDocument = new PotatnoDocument(TestProject);

            // Process.
            const lRoundTripped = PotatnoHelper.roundTrip(lDocument);

            // Evaluation.
            lExpectDocumentsEquivalent(lRoundTripped, lDocument);
        });

        await pContext.step('Document with a single empty function', () => {
            // Setup.
            const lDocument = new PotatnoDocument(TestProject);
            lDocument.newFunction({
                definitionId: TestProject.entryPoint.id,
                id: 'one', label: 'one', isSystem: false
            });

            // Process.
            const lRoundTripped = PotatnoHelper.roundTrip(lDocument);

            // Evaluation.
            lExpectDocumentsEquivalent(lRoundTripped, lDocument);
        });

        await pContext.step('Document with multiple functions', () => {
            // Setup.
            const lDocument = new PotatnoDocument(TestProject);
            lDocument.newFunction({ definitionId: TestProject.entryPoint.id, id: 'a', label: 'a', isSystem: false });
            lDocument.newFunction({ definitionId: TestProject.entryPoint.id, id: 'b', label: 'b', isSystem: false });

            // Process.
            const lRoundTripped = PotatnoHelper.roundTrip(lDocument);

            // Evaluation.
            lExpectDocumentsEquivalent(lRoundTripped, lDocument);
        });
    });

    await pContext.step('Function Shape', async (pContext) => {
        await pContext.step('Function id and label preserved', () => {
            // Setup.
            const { document } = PotatnoHelper.setupCalculatorDocument();

            // Process.
            const lRoundTripped = PotatnoHelper.roundTrip(document);

            // Evaluation.
            lExpectDocumentsEquivalent(lRoundTripped, document);
        });

        await pContext.step('Function isSystem flag preserved', () => {
            // Setup. Two functions, one system, one not.
            const lDocument = new PotatnoDocument(TestProject);
            lDocument.newFunction({ definitionId: TestProject.entryPoint.id, id: 'sys', label: 'sys', isSystem: true });
            lDocument.newFunction({ definitionId: TestProject.entryPoint.id, id: 'usr', label: 'usr', isSystem: false });

            // Process.
            const lRoundTripped = PotatnoHelper.roundTrip(lDocument);

            // Evaluation.
            lExpectDocumentsEquivalent(lRoundTripped, lDocument);
        });

        await pContext.step('Function definitionId preserved', () => {
            // Setup.
            const lDocument = new PotatnoDocument(TestProject);
            lDocument.newFunction({ definitionId: TestProject.entryPoint.id, id: 'a', label: 'a', isSystem: true });
            lDocument.newFunction({
                definitionId: [...TestProject.userFunctions.values()][0].id,
                id: 'b', label: 'helperOne', isSystem: false
            });

            // Process.
            const lRoundTripped = PotatnoHelper.roundTrip(lDocument);

            // Evaluation.
            lExpectDocumentsEquivalent(lRoundTripped, lDocument);
        });

        await pContext.step('Function inputs in insertion order', () => {
            // Setup.
            const lDocument = new PotatnoDocument(TestProject);
            const lFunction = lDocument.newFunction({
                definitionId: TestProject.entryPoint.id, id: 'a', label: 'a', isSystem: false
            });
            lFunction.addInput({ label: 'first', dataType: 'number' as never });
            lFunction.addInput({ label: 'second', dataType: 'string' as never });

            // Process.
            const lRoundTripped = PotatnoHelper.roundTrip(lDocument);

            // Evaluation.
            lExpectDocumentsEquivalent(lRoundTripped, lDocument);
            const lRtFunction = [...lRoundTripped.functions][0];
            expect(lRtFunction.inputs.map((pPort) => pPort.label)).toEqual(['first', 'second']);
        });

        await pContext.step('Function outputs in insertion order', () => {
            // Setup.
            const lDocument = new PotatnoDocument(TestProject);
            const lFunction = lDocument.newFunction({
                definitionId: TestProject.entryPoint.id, id: 'a', label: 'a', isSystem: false
            });
            lFunction.addOutput({ label: 'first', dataType: 'number' as never });
            lFunction.addOutput({ label: 'second', dataType: 'string' as never });

            // Process.
            const lRoundTripped = PotatnoHelper.roundTrip(lDocument);

            // Evaluation.
            const lRtFunction = [...lRoundTripped.functions][0];
            expect(lRtFunction.outputs.map((pPort) => pPort.label)).toEqual(['first', 'second']);
        });

        await pContext.step('Function imports in insertion order', () => {
            // Setup.
            const lDocument = new PotatnoDocument(TestProject);
            const lFunction = lDocument.newFunction({
                definitionId: TestProject.entryPoint.id, id: 'a', label: 'a', isSystem: false
            });
            lFunction.addImport('First');
            lFunction.addImport('Second');

            // Process.
            const lRoundTripped = PotatnoHelper.roundTrip(lDocument);

            // Evaluation.
            const lRtFunction = [...lRoundTripped.functions][0];
            expect([...lRtFunction.imports]).toEqual(['First', 'Second']);
        });
    });

    await pContext.step('Nodes', async (pContext) => {
        await pContext.step('Node category preserved', () => {
            // Setup. Add a Pass node (category 'flow').
            const { document, function: lFunction } = PotatnoHelper.setupCalculatorDocument();
            PotatnoHelper.addProjectNode(lFunction, 'Pass');

            // Process.
            const lRoundTripped = PotatnoHelper.roundTrip(document);

            // Evaluation.
            lExpectDocumentsEquivalent(lRoundTripped, document);
        });

        await pContext.step('Node label preserved', () => {
            // Setup. Rename a node.
            const { document, function: lFunction } = PotatnoHelper.setupCalculatorDocument();
            const lAddNode = PotatnoHelper.addProjectNode(lFunction, 'Add');
            lAddNode.label = 'CustomLabel';

            // Process.
            const lRoundTripped = PotatnoHelper.roundTrip(document);

            // Evaluation.
            lExpectDocumentsEquivalent(lRoundTripped, document);
        });

        await pContext.step('Node isSystem preserved', () => {
            // Setup. defaultEntry / defaultExit are system; lAdd is not.
            const { document, function: lFunction } = PotatnoHelper.setupCalculatorDocument();
            PotatnoHelper.addProjectNode(lFunction, 'Add');

            // Process.
            const lRoundTripped = PotatnoHelper.roundTrip(document);

            // Evaluation.
            lExpectDocumentsEquivalent(lRoundTripped, document);
        });

        await pContext.step('Node transformation preserved', () => {
            // Setup.
            const { document, function: lFunction } = PotatnoHelper.setupCalculatorDocument();
            const lDefinition = TestProject.nodeDefinitions.find((pDef) => pDef.id === 'Add')!;
            lFunction.addNodeByDefinition(lDefinition, { x: 99, y: 88, width: 77, height: 66 });

            // Process.
            const lRoundTripped = PotatnoHelper.roundTrip(document);

            // Evaluation.
            lExpectDocumentsEquivalent(lRoundTripped, document);
        });
    });

    await pContext.step('Ports', async (pContext) => {
        await pContext.step('Port directValue preserved when overridden via setDirectValue', () => {
            // Setup.
            const { document, defaultExit } = PotatnoHelper.setupCalculatorDocument();
            defaultExit.inputs.value.find((pPort) => pPort.definitionId === 'result')!.setDirectValue(['7']);

            // Process.
            const lRoundTripped = PotatnoHelper.roundTrip(document);

            // Evaluation.
            lExpectDocumentsEquivalent(lRoundTripped, document);
            const lRtFunction = [...lRoundTripped.functions][0];
            const lRtExit = [...lRtFunction.nodes].find((pNode) => pNode.definitionId === defaultExit.definitionId)!;
            expect([...lRtExit.inputs.value.find((pPort) => pPort.definitionId === 'result')!.directValue]).toEqual(['7']);
        });
    });

    await pContext.step('Connections', async (pContext) => {
        await pContext.step('Single value connection between two nodes', () => {
            // Setup.
            const { document, defaultEntry, defaultExit } = PotatnoHelper.setupCalculatorDocument();
            defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'a')!
                .connect(defaultExit.inputs.value.find((pPort) => pPort.definitionId === 'result')!);

            // Process.
            const lRoundTripped = PotatnoHelper.roundTrip(document);

            // Evaluation.
            lExpectDocumentsEquivalent(lRoundTripped, document);
        });

        await pContext.step('Single flow connection between two nodes', () => {
            // Setup.
            const { document, defaultEntry, defaultExit } = PotatnoHelper.setupCalculatorDocument();
            defaultEntry.outputs.flow[0].connect(defaultExit.inputs.flow[0]);

            // Process.
            const lRoundTripped = PotatnoHelper.roundTrip(document);

            // Evaluation.
            lExpectDocumentsEquivalent(lRoundTripped, document);
        });

        await pContext.step('Value output fan-out', () => {
            // Setup. Entry.a → Add1.a + Add2.a.
            const { document, function: lFunction, defaultEntry } = PotatnoHelper.setupCalculatorDocument();
            const lAddOne = PotatnoHelper.addProjectNode(lFunction, 'Add');
            const lAddTwo = PotatnoHelper.addProjectNode(lFunction, 'Add');
            const lSource = defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'a')!;
            lSource.connect(lAddOne.inputs.value.find((pPort) => pPort.definitionId === 'a')!);
            lSource.connect(lAddTwo.inputs.value.find((pPort) => pPort.definitionId === 'a')!);

            // Process.
            const lRoundTripped = PotatnoHelper.roundTrip(document);

            // Evaluation.
            lExpectDocumentsEquivalent(lRoundTripped, document);
        });

        await pContext.step('Flow input fan-in', () => {
            // Setup. Two Pass nodes both terminating at the exit's flow input.
            const { document, function: lFunction, defaultExit } = PotatnoHelper.setupCalculatorDocument();
            const lPassOne = PotatnoHelper.addProjectNode(lFunction, 'Pass');
            const lPassTwo = PotatnoHelper.addProjectNode(lFunction, 'Pass');
            lPassOne.outputs.flow[0].connect(defaultExit.inputs.flow[0]);
            lPassTwo.outputs.flow[0].connect(defaultExit.inputs.flow[0]);

            // Process.
            const lRoundTripped = PotatnoHelper.roundTrip(document);

            // Evaluation.
            lExpectDocumentsEquivalent(lRoundTripped, document);
        });

        await pContext.step('Multiple parallel connections between the same pair', () => {
            // Setup. Entry.a → Exit.result and Entry.b → Add.b (two distinct pairs).
            const { document, function: lFunction, defaultEntry, defaultExit } = PotatnoHelper.setupCalculatorDocument();
            const lAddNode = PotatnoHelper.addProjectNode(lFunction, 'Add');
            defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'a')!
                .connect(defaultExit.inputs.value.find((pPort) => pPort.definitionId === 'result')!);
            defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'b')!
                .connect(lAddNode.inputs.value.find((pPort) => pPort.definitionId === 'b')!);

            // Process.
            const lRoundTripped = PotatnoHelper.roundTrip(document);

            // Evaluation.
            lExpectDocumentsEquivalent(lRoundTripped, document);
        });
    });

    await pContext.step('Full TestProject', async (pContext) => {
        await pContext.step('Full TestProject calculator scenario', () => {
            // Setup. Realistic graph with helper call, GlobalMultiplier, and If/else.
            const { document, function: lFunction, defaultEntry, defaultExit } = PotatnoHelper.setupCalculatorDocument();

            // Add value pipeline: Add(a,b) -> Exit.result.
            const lAddNode = PotatnoHelper.addProjectNode(lFunction, 'Add');
            defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'a')!
                .connect(lAddNode.inputs.value.find((pPort) => pPort.definitionId === 'a')!);
            defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'b')!
                .connect(lAddNode.inputs.value.find((pPort) => pPort.definitionId === 'b')!);
            lAddNode.outputs.value[0].connect(defaultExit.inputs.value.find((pPort) => pPort.definitionId === 'result')!);

            // Add GlobalMultiplier in the flow.
            const lGlobalMult = PotatnoHelper.addProjectNode(lFunction, 'GlobalMultiplier');
            defaultEntry.outputs.flow[0].connect(lGlobalMult.inputs.flow[0]);
            lGlobalMult.outputs.flow[0].connect(defaultExit.inputs.flow[0]);

            // Add helper function instance and a call site in the main graph.
            const lHelper = document.newFunction({
                definitionId: [...TestProject.userFunctions.values()][0].id,
                id: 'helperOne', label: 'helperOne', isSystem: false
            });
            const lHelperNodeDef = document.nodeDefinitions.find((pDef) => /^USERFUNCTION_helperOne$/.test(pDef.id));
            if (lHelperNodeDef) {
                lFunction.addNodeByDefinition(lHelperNodeDef, { x: 6, y: 12, width: 6, height: 4 });
            }
            // Use the helper function so the suite includes it.
            expect(lHelper.label).toBe('helperOne');

            // Process.
            const lRoundTripped = PotatnoHelper.roundTrip(document);

            // Evaluation.
            lExpectDocumentsEquivalent(lRoundTripped, document);
        });
    });
});
