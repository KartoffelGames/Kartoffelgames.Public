import { expect } from '@kartoffelgames/core-test';
import { PotatnoDocumentFunction } from '../../source/document/potatno-document-function.ts';
import { PotatnoDocumentNode } from '../../source/document/potatno-document-node.ts';
import { PotatnoDocument } from '../../source/document/potatno-document.ts';
import { PotatnoCodeGenerator } from '../../source/parser/potatno-code-generator.ts';
import { PotatnoStaticNodeDefinition } from '../../source/project/node_definition/potatno-static-node-definition.ts';
import { PotatnoFunctionDefinition } from '../../source/project/potatno-function-definition.ts';
import { PotatnoProjectTypesDefinition } from '../../source/project/potatno-project-types-definition.ts';
import { PotatnoProject } from '../../source/project/potatno-project.ts';
import { TestProject } from '../test-project.ts';

const gSetupCalculatorDocument = () => {
    const lEntryDefinition = TestProject.entryPoint;
    const lDocument: PotatnoDocument<typeof TestProject> = new PotatnoDocument(TestProject);
    const lFunction: PotatnoDocumentFunction<typeof TestProject> = lDocument.newFunction({
        definitionId: lEntryDefinition.id,
        id: 'calc-instance-1',
        label: 'calculator',
        isSystem: true
    });
    const lNodes = lEntryDefinition.getNodeDefinitions(lFunction);
    const lDefaultEntry = lFunction.newNode(lNodes.entry[0], { x: 0, y: 0, width: 6, height: 4 }, true);
    const lDefaultExit = lFunction.newNode(lNodes.exit[0], { x: 12, y: 0, width: 6, height: 4 }, true);

    return { document: lDocument, function: lFunction, defaultEntry: lDefaultEntry, defaultExit: lDefaultExit };
};

const gAddProjectNode = (pFunction: PotatnoDocumentFunction<typeof TestProject>, pDefinitionId: string): PotatnoDocumentNode<typeof TestProject> => {
    const lDefinition = TestProject.nodeDefinitions.find((pDef) => pDef.id === pDefinitionId);
    if (!lDefinition) {
        throw new Error(`No project node definition with id "${pDefinitionId}"`);
    }
    return pFunction.newNode(lDefinition, { x: 0, y: 0, width: 6, height: 4 });
};

Deno.test('PotatnoCodeGenerator.generateDocument()', async (pContext) => {
    await pContext.step('Document', async (pContext) => {
        await pContext.step('Linear flow only', () => {
            // Setup. Entry -> Exit, flow-only.
            const { document, defaultEntry, defaultExit } = gSetupCalculatorDocument();
            defaultEntry.outputs.flow[0].connect(defaultExit.inputs.flow[0]);

            // Process.
            const lResult = new PotatnoCodeGenerator(TestProject).generateDocument(document);

            // Evaluation. The document body wraps the entry's arrow function and
            // the calculator label-prefixed const.
            expect(lResult.code).toBe(
                'const calculatorDefault = (v_1, v_2) => { '
                + 'let __globalMultiplier = 1; '
                + 'return (0) * __globalMultiplier; '
                + '};'
            );
        });

        await pContext.step('Chained arithmetic', () => {
            // Setup. Entry(a,b) -> Add -> Exit(result), flow Entry -> Exit.
            const { document, function: lFunction, defaultEntry, defaultExit } = gSetupCalculatorDocument();
            const lAddNode = gAddProjectNode(lFunction, 'Add');
            defaultEntry.outputs.flow[0].connect(defaultExit.inputs.flow[0]);
            defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'a')!
                .connect(lAddNode.inputs.value.find((pPort) => pPort.definitionId === 'a')!);
            defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'b')!
                .connect(lAddNode.inputs.value.find((pPort) => pPort.definitionId === 'b')!);
            lAddNode.outputs.value[0].connect(defaultExit.inputs.value.find((pPort) => pPort.definitionId === 'result')!);

            // Process.
            const lResult = new PotatnoCodeGenerator(TestProject).generateDocument(document);

            // Evaluation. Add's const sits between the multiplier init and the exit return.
            expect(lResult.code).toBe(
                'const calculatorDefault = (v_1, v_2) => { '
                + 'let __globalMultiplier = 1; '
                + 'const v_3 = v_1 + v_2; '
                + 'return (v_3) * __globalMultiplier; '
                + '};'
            );
        });

        await pContext.step('Multiple entries', () => {
            // Setup. Wire both Default and X10 pairs.
            const lEntryDefinition = TestProject.entryPoint;
            const { document, function: lFunction, defaultEntry, defaultExit } = gSetupCalculatorDocument();
            const lNodes = lEntryDefinition.getNodeDefinitions(lFunction);
            const lX10Entry = lFunction.newNode(lNodes.entry[1], { x: 0, y: 8, width: 6, height: 4 }, true);
            const lX10Exit = lFunction.newNode(lNodes.exit[1], { x: 12, y: 8, width: 6, height: 4 }, true);
            defaultEntry.outputs.flow[0].connect(defaultExit.inputs.flow[0]);
            lX10Entry.outputs.flow[0].connect(lX10Exit.inputs.flow[0]);

            // Process.
            const lResult = new PotatnoCodeGenerator(TestProject).generateDocument(document);

            // Evaluation. Both graphs emitted as named consts, X10 keeps its (result) * 10 wrapper.
            expect(lResult.code).toBe(
                'const calculatorDefault = (v_1, v_2) => { '
                + 'let __globalMultiplier = 1; '
                + 'return (0) * __globalMultiplier; '
                + '}; '
                + 'const calculatorX10 = (v_3, v_4) => { '
                + 'let __globalMultiplier = 1; '
                + 'return ((0) * 10) * __globalMultiplier; '
                + '};'
            );
        });

        await pContext.step('GlobalMultiplier in flow', () => {
            // Setup. Entry -> GlobalMultiplier(5) -> Exit.
            const { document, function: lFunction, defaultEntry, defaultExit } = gSetupCalculatorDocument();
            const lGlobalMult = gAddProjectNode(lFunction, 'GlobalMultiplier');
            lGlobalMult.inputs.value.find((pPort) => pPort.definitionId === 'value')!.setDirectValue(['5']);
            defaultEntry.outputs.flow[0].connect(lGlobalMult.inputs.flow[0]);
            lGlobalMult.outputs.flow[0].connect(defaultExit.inputs.flow[0]);

            // Process.
            const lResult = new PotatnoCodeGenerator(TestProject).generateDocument(document);

            // Evaluation. The multiplier write sits between the init and the exit return.
            expect(lResult.code).toBe(
                'const calculatorDefault = (v_1, v_2) => { '
                + 'let __globalMultiplier = 1; '
                + '__globalMultiplier = 5; '
                + 'return (0) * __globalMultiplier; '
                + '};'
            );
        });

        await pContext.step('X10 exit composed with GlobalMultiplier', () => {
            // Setup. X10 Entry -> GlobalMultiplier(5) -> X10 Exit. The helper-placed
            // default pair stays in the function but is left unwired, so it should
            // not contribute a graph.
            const lEntryDefinition = TestProject.entryPoint;
            const { document, function: lFunction } = gSetupCalculatorDocument();
            const lNodes = lEntryDefinition.getNodeDefinitions(lFunction);
            const lX10Entry = lFunction.newNode(lNodes.entry[1], { x: 0, y: 8, width: 6, height: 4 }, true);
            const lX10Exit = lFunction.newNode(lNodes.exit[1], { x: 12, y: 8, width: 6, height: 4 }, true);
            const lGlobalMult = gAddProjectNode(lFunction, 'GlobalMultiplier');
            lGlobalMult.inputs.value.find((pPort) => pPort.definitionId === 'value')!.setDirectValue(['5']);
            lX10Entry.outputs.flow[0].connect(lGlobalMult.inputs.flow[0]);
            lGlobalMult.outputs.flow[0].connect(lX10Exit.inputs.flow[0]);

            // Process.
            const lResult = new PotatnoCodeGenerator(TestProject).generateDocument(document);

            // Evaluation. Only the X10 graph is emitted; the multiplier write composes
            // multiplicatively with the X10 exit's (result) * 10 wrapper.
            expect(lResult.code).toBe(
                'const calculatorX10 = (v_1, v_2) => { '
                + 'let __globalMultiplier = 1; '
                + '__globalMultiplier = 5; '
                + 'return ((0) * 10) * __globalMultiplier; '
                + '};'
            );
        });
    });

    await pContext.step('Error', async (pContext) => {
        await pContext.step('generateDocument without system function', () => {
            // Setup. Document with only a non-system function.
            const lDocument = new PotatnoDocument(TestProject);
            lDocument.newFunction({
                definitionId: TestProject.entryPoint.id,
                id: 'usr', label: 'usr', isSystem: false
            });

            // Process.
            const lAction = (): void => {
                new PotatnoCodeGenerator(TestProject).generateDocument(lDocument);
            };

            // Evaluation.
            expect(lAction).toThrow('No entry point function found for code generation.');
        });
    });
});

Deno.test('PotatnoCodeGenerator.generateFunction()', async (pContext) => {
    await pContext.step('Function', async (pContext) => {
        await pContext.step('Single exit', () => {
            // Setup.
            const { function: lFunction, defaultEntry, defaultExit } = gSetupCalculatorDocument();
            defaultEntry.outputs.flow[0].connect(defaultExit.inputs.flow[0]);

            // Process.
            const lResult = new PotatnoCodeGenerator(TestProject).generateFunction(lFunction);

            // Evaluation. Exactly one graph for the wired exit, body code is the
            // single named const emitted by the function definition's body callback.
            expect(lResult.entryPoint.graphs.length).toBe(1);
            expect(lResult.entryPoint.code).toBe(
                'const calculatorDefault = (v_1, v_2) => { '
                + 'let __globalMultiplier = 1; '
                + 'return (0) * __globalMultiplier; '
                + '};'
            );
        });

        await pContext.step('Two exits', () => {
            // Setup.
            const lEntryDefinition = TestProject.entryPoint;
            const { function: lFunction, defaultEntry, defaultExit } = gSetupCalculatorDocument();
            const lNodes = lEntryDefinition.getNodeDefinitions(lFunction);
            const lX10Entry = lFunction.newNode(lNodes.entry[1], { x: 0, y: 8, width: 6, height: 4 }, true);
            const lX10Exit = lFunction.newNode(lNodes.exit[1], { x: 12, y: 8, width: 6, height: 4 }, true);
            defaultEntry.outputs.flow[0].connect(defaultExit.inputs.flow[0]);
            lX10Entry.outputs.flow[0].connect(lX10Exit.inputs.flow[0]);

            // Process.
            const lResult = new PotatnoCodeGenerator(TestProject).generateFunction(lFunction);

            // Evaluation. Two graphs (one per exit) plus two named consts.
            expect(lResult.entryPoint.graphs.length).toBe(2);
            expect(lResult.entryPoint.code).toBe(
                'const calculatorDefault = (v_1, v_2) => { '
                + 'let __globalMultiplier = 1; '
                + 'return (0) * __globalMultiplier; '
                + '}; '
                + 'const calculatorX10 = (v_3, v_4) => { '
                + 'let __globalMultiplier = 1; '
                + 'return ((0) * 10) * __globalMultiplier; '
                + '};'
            );
        });

        await pContext.step('Unwired exit produces no graph for that exit', () => {
            // Setup. Only the default-pair flow is wired.
            const lEntryDefinition = TestProject.entryPoint;
            const { function: lFunction, defaultEntry, defaultExit } = gSetupCalculatorDocument();
            const lNodes = lEntryDefinition.getNodeDefinitions(lFunction);
            lFunction.newNode(lNodes.entry[1], { x: 0, y: 8, width: 6, height: 4 }, true);
            lFunction.newNode(lNodes.exit[1], { x: 12, y: 8, width: 6, height: 4 }, true);
            defaultEntry.outputs.flow[0].connect(defaultExit.inputs.flow[0]);

            // Process.
            const lResult = new PotatnoCodeGenerator(TestProject).generateFunction(lFunction);

            // Evaluation. X10 exit has no flow input, so it contributes no graph;
            // only the default graph appears and the body code lacks calculatorX10.
            expect(lResult.entryPoint.graphs.length).toBe(1);
            expect(lResult.entryPoint.code).toBe(
                'const calculatorDefault = (v_1, v_2) => { '
                + 'let __globalMultiplier = 1; '
                + 'return (0) * __globalMultiplier; '
                + '};'
            );
        });
    });
});

Deno.test('PotatnoCodeGenerator.generateNode()', async (pContext) => {
    await pContext.step('Linear', async (pContext) => {
        await pContext.step('Single entry to exit', () => {
            // Setup.
            const { defaultEntry, defaultExit } = gSetupCalculatorDocument();
            defaultEntry.outputs.flow[0].connect(defaultExit.inputs.flow[0]);

            // Process.
            const lResult = new PotatnoCodeGenerator(TestProject).generateNode(defaultExit);

            // Evaluation. Graph body matches the entry's arrow function wrapping the exit's return.
            expect(lResult.entryPoint.graphs[0].code).toBe(
                '(v_1, v_2) => { '
                + 'let __globalMultiplier = 1; '
                + 'return (0) * __globalMultiplier; '
                + '}'
            );
        });

        await pContext.step('Single value-producer feeds exit', () => {
            // Setup. Const(42) -> Exit.result.
            const { function: lFunction, defaultEntry, defaultExit } = gSetupCalculatorDocument();
            const lConstNode = gAddProjectNode(lFunction, 'Const');
            lConstNode.inputs.value.find((pPort) => pPort.definitionId === 'value')!.setDirectValue(['42']);
            lConstNode.outputs.value[0].connect(defaultExit.inputs.value.find((pPort) => pPort.definitionId === 'result')!);
            defaultEntry.outputs.flow[0].connect(defaultExit.inputs.flow[0]);

            // Process.
            const lResult = new PotatnoCodeGenerator(TestProject).generateNode(defaultExit);

            // Evaluation. The Const allocates first (v_1) during the exit's value
            // resolution; the entry's a/b allocate afterwards (v_2, v_3).
            expect(lResult.entryPoint.graphs[0].code).toBe(
                '(v_2, v_3) => { '
                + 'let __globalMultiplier = 1; '
                + 'const v_1 = 42; '
                + 'return (v_1) * __globalMultiplier; '
                + '}'
            );
        });

        await pContext.step('Two-node arithmetic chain', () => {
            // Setup. Entry.a/b -> Add -> Multiply(other Entry.b) -> Exit.
            const { function: lFunction, defaultEntry, defaultExit } = gSetupCalculatorDocument();
            const lAddNode = gAddProjectNode(lFunction, 'Add');
            const lMulNode = gAddProjectNode(lFunction, 'Multiply');
            defaultEntry.outputs.flow[0].connect(defaultExit.inputs.flow[0]);
            defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'a')!
                .connect(lAddNode.inputs.value.find((pPort) => pPort.definitionId === 'a')!);
            defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'b')!
                .connect(lAddNode.inputs.value.find((pPort) => pPort.definitionId === 'b')!);
            lAddNode.outputs.value[0]
                .connect(lMulNode.inputs.value.find((pPort) => pPort.definitionId === 'a')!);
            defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'b')!
                .connect(lMulNode.inputs.value.find((pPort) => pPort.definitionId === 'b')!);
            lMulNode.outputs.value[0].connect(defaultExit.inputs.value.find((pPort) => pPort.definitionId === 'result')!);

            // Process.
            const lResult = new PotatnoCodeGenerator(TestProject).generateNode(defaultExit);

            // Evaluation. Add emits before Multiply; both before the exit return.
            // Allocation order on the deepest-first descent: entry.a (v_1), entry.b
            // (v_2), Add.result (v_3), Multiply.result (v_4).
            expect(lResult.entryPoint.graphs[0].code).toBe(
                '(v_1, v_2) => { '
                + 'let __globalMultiplier = 1; '
                + 'const v_3 = v_1 + v_2; '
                + 'const v_4 = v_3 * v_2; '
                + 'return (v_4) * __globalMultiplier; '
                + '}'
            );
        });

        await pContext.step('Pick selects between two value inputs', () => {
            // Setup. Pick(Const(1), Const(2), Greater(a, b)) -> Exit.result.
            const { function: lFunction, defaultEntry, defaultExit } = gSetupCalculatorDocument();
            const lConstA = gAddProjectNode(lFunction, 'Const');
            const lConstB = gAddProjectNode(lFunction, 'Const');
            const lGreater = gAddProjectNode(lFunction, 'Greater');
            const lPick = gAddProjectNode(lFunction, 'Pick');
            lConstA.inputs.value.find((pPort) => pPort.definitionId === 'value')!.setDirectValue(['1']);
            lConstB.inputs.value.find((pPort) => pPort.definitionId === 'value')!.setDirectValue(['2']);
            defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'a')!
                .connect(lGreater.inputs.value.find((pPort) => pPort.definitionId === 'a')!);
            defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'b')!
                .connect(lGreater.inputs.value.find((pPort) => pPort.definitionId === 'b')!);
            lConstA.outputs.value[0].connect(lPick.inputs.value.find((pPort) => pPort.definitionId === 'a')!);
            lConstB.outputs.value[0].connect(lPick.inputs.value.find((pPort) => pPort.definitionId === 'b')!);
            lGreater.outputs.value[0].connect(lPick.inputs.value.find((pPort) => pPort.definitionId === 'condition')!);
            lPick.outputs.value[0].connect(defaultExit.inputs.value.find((pPort) => pPort.definitionId === 'result')!);
            defaultEntry.outputs.flow[0].connect(defaultExit.inputs.flow[0]);

            // Process.
            const lResult = new PotatnoCodeGenerator(TestProject).generateNode(defaultExit);

            // Evaluation. Pick's value inputs are resolved a -> b -> condition, so
            // ConstA allocates first (v_1), then ConstB (v_2), then Greater (which
            // allocates entry.a/b as v_3/v_4 and its own result as v_5), then Pick
            // (v_6). Entry emits last using the already-allocated v_3/v_4.
            expect(lResult.entryPoint.graphs[0].code).toBe(
                '(v_3, v_4) => { '
                + 'let __globalMultiplier = 1; '
                + 'const v_1 = 1; '
                + 'const v_2 = 2; '
                + 'const v_5 = v_3 > v_4; '
                + 'const v_6 = ((a, b, cond) => { if (cond) { return a; } return b; })(v_1, v_2, v_5); '
                + 'return (v_6) * __globalMultiplier; '
                + '}'
            );
        });

        await pContext.step('Multiple flow nodes in sequence', () => {
            // Setup. Entry -> Pass -> Pass -> Exit.
            const { function: lFunction, defaultEntry, defaultExit } = gSetupCalculatorDocument();
            const lPassOne = gAddProjectNode(lFunction, 'Pass');
            const lPassTwo = gAddProjectNode(lFunction, 'Pass');
            defaultEntry.outputs.flow[0].connect(lPassOne.inputs.flow[0]);
            lPassOne.outputs.flow[0].connect(lPassTwo.inputs.flow[0]);
            lPassTwo.outputs.flow[0].connect(defaultExit.inputs.flow[0]);

            // Process.
            const lResult = new PotatnoCodeGenerator(TestProject).generateNode(defaultExit);

            // Evaluation. Two `/* pass */;` markers, one per Pass, in flow order.
            expect(lResult.entryPoint.graphs[0].code).toBe(
                '(v_1, v_2) => { '
                + 'let __globalMultiplier = 1; '
                + '/* pass */; '
                + '/* pass */; '
                + 'return (0) * __globalMultiplier; '
                + '}'
            );
        });
    });

    await pContext.step('Branching', async (pContext) => {
        await pContext.step('If with both branches terminating at exit', () => {
            // Setup. Entry -> If, then: Pass -> Exit, else: Pass -> Exit. Condition is a Greater node.
            const { function: lFunction, defaultEntry, defaultExit } = gSetupCalculatorDocument();
            const lIf = gAddProjectNode(lFunction, 'If');
            const lGreater = gAddProjectNode(lFunction, 'Greater');
            const lPassThen = gAddProjectNode(lFunction, 'Pass');
            const lPassElse = gAddProjectNode(lFunction, 'Pass');
            defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'a')!
                .connect(lGreater.inputs.value.find((pPort) => pPort.definitionId === 'a')!);
            defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'b')!
                .connect(lGreater.inputs.value.find((pPort) => pPort.definitionId === 'b')!);
            lGreater.outputs.value[0].connect(lIf.inputs.value.find((pPort) => pPort.definitionId === 'condition')!);
            defaultEntry.outputs.flow[0].connect(lIf.inputs.flow[0]);
            lIf.outputs.flow.find((pPort) => pPort.definitionId === 'then')!.connect(lPassThen.inputs.flow[0]);
            lIf.outputs.flow.find((pPort) => pPort.definitionId === 'else')!.connect(lPassElse.inputs.flow[0]);
            lPassThen.outputs.flow[0].connect(defaultExit.inputs.flow[0]);
            lPassElse.outputs.flow[0].connect(defaultExit.inputs.flow[0]);

            // Process.
            const lResult = new PotatnoCodeGenerator(TestProject).generateNode(defaultExit);

            // Evaluation. Exit is the merge node, If is the branch point; both
            // branch sub-walks emit a Pass with empty exec.inner. The merged tail
            // (the exit's return) lives on If's `code.next`. Greater (the
            // condition's value producer) emits before If on the parent scope.
            expect(lResult.entryPoint.graphs[0].code).toBe(
                '(v_1, v_2) => { '
                + 'let __globalMultiplier = 1; '
                + 'const v_3 = v_1 > v_2; '
                + 'if (v_3) { '
                + '/* pass */; '
                + ' '
                + '} else { '
                + '/* pass */; '
                + ' '
                + '} '
                + 'return (0) * __globalMultiplier; '
                + '}'
            );
        });
    });

    await pContext.step('Conjunction', async (pContext) => {
        await pContext.step('Flow passthrough', () => {
            // Setup. Entry -> FlowConjunction -> Pass -> Exit. The conjunction must
            // be invisible in the output - it produces the same code as a direct
            // Entry -> Pass -> Exit chain would.
            const { function: lFunction, defaultEntry, defaultExit } = gSetupCalculatorDocument();
            const lConjDef = TestProject.nodeDefinitions.find((pDef) => pDef.category === 'Conjunction' && pDef.inputs.some((p) => p.portType === 'flow'))!;
            const lConjunction = lFunction.newNode(lConjDef, { x: 0, y: 0, width: 4, height: 2 });
            const lPass = gAddProjectNode(lFunction, 'Pass');
            defaultEntry.outputs.flow[0].connect(lConjunction.inputs.flow[0]);
            lConjunction.outputs.flow[0].connect(lPass.inputs.flow[0]);
            lPass.outputs.flow[0].connect(defaultExit.inputs.flow[0]);

            // Process.
            const lResult = new PotatnoCodeGenerator(TestProject).generateNode(defaultExit);

            // Evaluation. The conjunction does not contribute a node to the buffer;
            // output is exactly Entry -> Pass -> Exit.
            expect(lResult.entryPoint.graphs[0].code).toBe(
                '(v_1, v_2) => { '
                + 'let __globalMultiplier = 1; '
                + '/* pass */; '
                + 'return (0) * __globalMultiplier; '
                + '}'
            );
        });
    });

    await pContext.step('Refcount', async (pContext) => {
        await pContext.step('Pure-value producer used twice in the same flow node', () => {
            // Setup. SharedConst feeds both Add inputs; Add -> Exit.result.
            const { function: lFunction, defaultEntry, defaultExit } = gSetupCalculatorDocument();
            const lSharedConst = gAddProjectNode(lFunction, 'Const');
            lSharedConst.inputs.value.find((pPort) => pPort.definitionId === 'value')!.setDirectValue(['7']);
            const lAddNode = gAddProjectNode(lFunction, 'Add');
            lSharedConst.outputs.value[0].connect(lAddNode.inputs.value.find((pPort) => pPort.definitionId === 'a')!);
            lSharedConst.outputs.value[0].connect(lAddNode.inputs.value.find((pPort) => pPort.definitionId === 'b')!);
            lAddNode.outputs.value[0].connect(defaultExit.inputs.value.find((pPort) => pPort.definitionId === 'result')!);
            defaultEntry.outputs.flow[0].connect(defaultExit.inputs.flow[0]);

            // Process.
            const lResult = new PotatnoCodeGenerator(TestProject).generateNode(defaultExit);

            // Evaluation. SharedConst's refcount is 2 (one per Add input); it emits
            // only when the second consumer drains it. v_1 names SharedConst.result
            // since it is the first port touched during the descent. Entry.a/b
            // allocate later as v_3/v_4.
            expect(lResult.entryPoint.graphs[0].code).toBe(
                '(v_3, v_4) => { '
                + 'let __globalMultiplier = 1; '
                + 'const v_1 = 7; '
                + 'const v_2 = v_1 + v_1; '
                + 'return (v_2) * __globalMultiplier; '
                + '}'
            );
        });
    });

    await pContext.step('Hooks', async (pContext) => {
        await pContext.step('Appended for every input and output valueId', () => {
            // Setup. A single Add fed by entry.a/b with all-default-value inputs.
            const { function: lFunction, defaultEntry, defaultExit } = gSetupCalculatorDocument();
            const lAddNode = gAddProjectNode(lFunction, 'Add');
            defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'a')!
                .connect(lAddNode.inputs.value.find((pPort) => pPort.definitionId === 'a')!);
            defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'b')!
                .connect(lAddNode.inputs.value.find((pPort) => pPort.definitionId === 'b')!);
            lAddNode.outputs.value[0].connect(defaultExit.inputs.value.find((pPort) => pPort.definitionId === 'result')!);
            defaultEntry.outputs.flow[0].connect(defaultExit.inputs.flow[0]);

            // Process. pDebug=true enables the per-node hook auto-append.
            const lResult = new PotatnoCodeGenerator(TestProject).generateNode(defaultExit, true);

            // Evaluation. Hooks append after each node's emitted code: Add gets
            // /*[v_1]*//*[v_2]*//*[v_3]*/, the exit gets /*[v_3]*/, the entry gets
            // /*[v_1]*//*[v_2]*/ (flow ports have empty valueIds and are skipped).
            expect(lResult.entryPoint.graphs[0].code).toBe(
                '(v_1, v_2) => { '
                + 'let __globalMultiplier = 1; '
                + 'const v_3 = v_1 + v_2;/*[v_1]*//*[v_2]*//*[v_3]*/ '
                + 'return (v_3) * __globalMultiplier;/*[v_3]*/ '
                + '}/*[v_1]*//*[v_2]*/'
            );
        });

        await pContext.step('Custom hook generator is honoured', () => {
            // Setup. One-off project whose hook returns `<<id>>`. The exit's value
            // input forces a hook emission (flow-only nodes would not allocate any
            // valueId so the custom hook would never run).
            const lLocalTypes = PotatnoProjectTypesDefinition.new({
                number: {
                    default: { string: ['0'], value: 0 },
                    convert: (pValues: Array<string>): string => pValues[0],
                    inputs: [{ name: 'value', type: 'number' as const }]
                }
            });

            const lSimpleEntry = PotatnoStaticNodeDefinition.newStaticNode({
                id: 'Start', label: 'Start', category: 'event',
                ports: {
                    inputs: [],
                    outputs: [{ label: 'exec', id: 'exec', portType: 'flow' }]
                },
                generators: { code: (pContext): string => `START(); ${pContext.outputs['exec'].code.inner}` }
            });

            const lSimpleExit = PotatnoStaticNodeDefinition.newStaticNode({
                id: 'End', label: 'End', category: 'output',
                ports: {
                    inputs: [
                        { label: 'exec', id: 'exec', portType: 'flow' },
                        { label: 'val', id: 'val', portType: 'value', dataType: 'number' }
                    ],
                    outputs: []
                },
                generators: { code: (pContext): string => `END(${pContext.inputs['val'].value});` }
            });

            const lLocalEntryFn = PotatnoFunctionDefinition.new(lLocalTypes, {
                id: 'main', label: 'main',
                statics: 7, nodes: {
                    entry: (pAddNode): void => { pAddNode(lSimpleEntry); },
                    exit: (pAddNode): void => { pAddNode(lSimpleExit); }
                },
                generator: {
                    code: {
                        body: (pResult): string => pResult.graphResultOf('Start')?.code ?? '',
                        value: (): string => ''
                    }
                }
            });

            const lLocalProject = PotatnoProject.new({
                types: lLocalTypes,
                functions: { entry: lLocalEntryFn },
                generator: {
                    code: (pContext): string => pContext.entryPoint.code,
                    values: {
                        valueId: (pValueIndex: number): string => {
                            return `v_${pValueIndex}`;
                        },
                        hook: (pValueId: string): string => {
                            return `<<${pValueId}>>`;
                        }
                    }
                }
            });

            const lLocalDocument = new PotatnoDocument(lLocalProject);
            const lLocalFunction = lLocalDocument.newFunction({
                definitionId: lLocalEntryFn.id, id: 'main-instance', label: 'main', isSystem: true
            });
            const lLocalNodes = lLocalEntryFn.getNodeDefinitions(lLocalFunction);
            const lLocalEntry = lLocalFunction.newNode(lLocalNodes.entry[0], { x: 0, y: 0, width: 4, height: 2 }, true);
            const lLocalExit = lLocalFunction.newNode(lLocalNodes.exit[0], { x: 4, y: 0, width: 4, height: 2 }, true);
            lLocalEntry.outputs.flow[0].connect(lLocalExit.inputs.flow[0]);

            // Process. pDebug=true enables the per-node hook auto-append.
            const lResult = new PotatnoCodeGenerator(lLocalProject).generateNode(lLocalExit, true);

            // Evaluation. End's `val` input is unconnected, so its resolved value
            // is the literal `0` (the type's convert(['0']) output). The custom
            // hook is called with that literal and emits `<<0>>` after End's code.
            expect(lResult.entryPoint.graphs[0].code).toBe(
                'START(); END(0);<<v_0>>'
            );
        });
    });

    await pContext.step('Error', async (pContext) => {
        await pContext.step('Missing node definition for a node in the graph', () => {
            // Setup. Construct a node whose definitionId is not in the function's lookup.
            const { function: lFunction } = gSetupCalculatorDocument();
            const lGhostDef = PotatnoStaticNodeDefinition.newStaticNode({
                id: 'GhostNode', label: 'GhostNode', category: 'event',
                ports: {
                    inputs: [{ label: 'exec', id: 'exec', portType: 'flow' }],
                    outputs: []
                },
                generators: { code: (): string => '' }
            });
            TestProject.addNodeDefinition(lGhostDef);
            const lGhostNode = lFunction.newNode(lGhostDef, { x: 0, y: 0, width: 4, height: 2 });
            // Remove the definition from the project's lookup so the generator can't find it.
            (TestProject as any).mNodeDefinitions.delete('GhostNode');

            // Process.
            const lAction = (): void => {
                new PotatnoCodeGenerator(TestProject).generateNode(lGhostNode);
            };

            // Evaluation.
            expect(lAction).toThrow(`Node definition "GhostNode" not found for node "${lGhostNode.label}".`);
        });

        await pContext.step('Walk emits zero nodes', () => {
            // Setup. Exit with unconnected flow input.
            const { defaultExit } = gSetupCalculatorDocument();

            // Process.
            const lAction = (): void => {
                new PotatnoCodeGenerator(TestProject).generateNode(defaultExit);
            };

            // Evaluation. The contract is the exact message below.
            expect(lAction).toThrow('Walk did not reach an entry node from exit "Default".');
        });
    });
});
