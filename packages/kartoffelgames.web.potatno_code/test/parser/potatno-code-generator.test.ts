import { expect } from '@kartoffelgames/core-test';
import { PotatnoDocument } from '../../source/document/potatno-document.ts';
import { PotatnoCodeGenerator } from '../../source/parser/potatno-code-generator.ts';
import { PotatnoStaticNodeDefinition } from '../../source/project/node_definition/potatno-static-node-definition.ts';
import { PotatnoFunctionDefinition } from '../../source/project/potatno-function-definition.ts';
import { PotatnoProjectTypesDefinition } from '../../source/project/potatno-project-types-definition.ts';
import { PotatnoProject } from '../../source/project/potatno-project.ts';
import { PotatnoHelper } from '../helper/potatno-helper.ts';
import type { PotatnoTestProjectTypesDefinition } from '../helper/potatno_test_project/potatno-test-project-types-definition.ts';

Deno.test('PotatnoCodeGenerator.generateDocument()', async (pContext) => {
    await pContext.step('Document', async (pContext) => {
        await pContext.step('Linear flow only', () => {
            // Setup. Entry -> Exit, flow-only.
            const { document: lDocument, defaultEntry: lDefaultEntry, defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();
            PotatnoHelper.connectFlow(lDefaultEntry, lDefaultExit);

            // Process.
            const lResult = new PotatnoCodeGenerator(PotatnoHelper.TEST_PROJECT).generateDocument(lDocument);

            // Evaluation. The document body wraps the entry's arrow function and the calculator
            // label-prefixed const. The helper-wired X10 exit contributes a second const.
            expect(lResult.code).toBe(
                'const calculatorDefault = (v_1, v_2) => { '
                + 'let __globalMultiplier = 1; '
                + 'return (0) * __globalMultiplier; '
                + '};'
                + 'const calculatorX10 = (v_4, v_5) => { '
                + 'let __globalMultiplier = 1; '
                + 'return ((0) * 10) * __globalMultiplier; '
                + '};'
            );
        });

        await pContext.step('Chained arithmetic', () => {
            // Setup. Entry(a,b) -> Add -> Exit(result), flow Entry -> Exit.
            const { document: lDocument, function: lFunction, defaultEntry: lDefaultEntry, defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();
            const lAddNode = PotatnoHelper.addProjectNode(lFunction, 'Add');
            PotatnoHelper.connectFlow(lDefaultEntry, lDefaultExit);
            PotatnoHelper.connectValue(lDefaultEntry, 'a', lAddNode, 'a');
            PotatnoHelper.connectValue(lDefaultEntry, 'b', lAddNode, 'b');
            PotatnoHelper.connectValue(lAddNode, 'result', lDefaultExit, 'result');

            // Process.
            const lResult = new PotatnoCodeGenerator(PotatnoHelper.TEST_PROJECT).generateDocument(lDocument);

            // Evaluation. Add's const sits between the multiplier init and the exit return.
            // The helper-wired X10 exit contributes a second const.
            expect(lResult.code).toBe(
                'const calculatorDefault = (v_0, v_1) => { '
                + 'let __globalMultiplier = 1; '
                + 'const v_2 = v_0 + v_1; '
                + 'return (v_2) * __globalMultiplier; '
                + '};'
                + 'const calculatorX10 = (v_5, v_6) => { '
                + 'let __globalMultiplier = 1; '
                + 'return ((0) * 10) * __globalMultiplier; '
                + '};'
            );
        });

        await pContext.step('Multiple entries', () => {
            // Setup. The X10 pair is wired flow-only by the helper; wire the Default pair here.
            const { document: lDocument, defaultEntry: lDefaultEntry, defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();
            PotatnoHelper.connectFlow(lDefaultEntry, lDefaultExit);

            // Process.
            const lResult = new PotatnoCodeGenerator(PotatnoHelper.TEST_PROJECT).generateDocument(lDocument);

            // Evaluation. Both graphs emitted as named consts, X10 keeps its (result) * 10 wrapper.
            expect(lResult.code).toBe(
                'const calculatorDefault = (v_1, v_2) => { '
                + 'let __globalMultiplier = 1; '
                + 'return (0) * __globalMultiplier; '
                + '};'
                + 'const calculatorX10 = (v_4, v_5) => { '
                + 'let __globalMultiplier = 1; '
                + 'return ((0) * 10) * __globalMultiplier; '
                + '};'
            );
        });

        await pContext.step('GlobalMultiplier in flow', () => {
            // Setup. Entry -> GlobalMultiplier(5) -> Exit.
            const { document: lDocument, function: lFunction, defaultEntry: lDefaultEntry, defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();
            const lGlobalMultiplier = PotatnoHelper.addProjectNode(lFunction, 'GlobalMultiplier');
            PotatnoHelper.setInputValue(lGlobalMultiplier, 'value', ['5']);
            PotatnoHelper.connectFlow(lDefaultEntry, lGlobalMultiplier);
            PotatnoHelper.connectFlow(lGlobalMultiplier, lDefaultExit);

            // Process.
            const lResult = new PotatnoCodeGenerator(PotatnoHelper.TEST_PROJECT).generateDocument(lDocument);

            // Evaluation. The multiplier write sits between the init and the exit return.
            // The helper-wired X10 exit contributes a second const.
            expect(lResult.code).toBe(
                'const calculatorDefault = (v_2, v_3) => { '
                + 'let __globalMultiplier = 1; '
                + '__globalMultiplier = 5; '
                + 'return (0) * __globalMultiplier; '
                + '};'
                + 'const calculatorX10 = (v_5, v_6) => { '
                + 'let __globalMultiplier = 1; '
                + 'return ((0) * 10) * __globalMultiplier; '
                + '};'
            );
        });

        await pContext.step('X10 exit composed with GlobalMultiplier', () => {
            // Setup. Default Entry -> Default Exit, plus X10 Entry -> GlobalMultiplier(5) -> X10 Exit.
            // The helper pre-wires X10 Entry -> X10 Exit; re-routing the X10 entry flow replaces that link.
            const { document: lDocument, function: lFunction, defaultEntry: lDefaultEntry, defaultExit: lDefaultExit, x10Entry: lX10Entry, x10Exit: lX10Exit } = PotatnoHelper.setupCalculatorDocument();
            const lGlobalMultiplier = PotatnoHelper.addProjectNode(lFunction, 'GlobalMultiplier');
            PotatnoHelper.setInputValue(lGlobalMultiplier, 'value', ['5']);
            PotatnoHelper.connectFlow(lDefaultEntry, lDefaultExit);
            PotatnoHelper.connectFlow(lX10Entry, lGlobalMultiplier);
            PotatnoHelper.connectFlow(lGlobalMultiplier, lX10Exit);

            // Process.
            const lResult = new PotatnoCodeGenerator(PotatnoHelper.TEST_PROJECT).generateDocument(lDocument);

            // Evaluation. Both graphs are emitted; the X10 multiplier write composes
            // multiplicatively with the X10 exit's (result) * 10 wrapper.
            expect(lResult.code).toBe(
                'const calculatorDefault = (v_1, v_2) => { '
                + 'let __globalMultiplier = 1; '
                + 'return (0) * __globalMultiplier; '
                + '};'
                + 'const calculatorX10 = (v_5, v_6) => { '
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
            const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);
            lDocument.newFunction({
                definitionId: PotatnoHelper.TEST_PROJECT.entryPoint.id,
                id: 'usr', label: 'usr', isSystem: false
            });

            // Process.
            const lAction = (): void => {
                new PotatnoCodeGenerator(PotatnoHelper.TEST_PROJECT).generateDocument(lDocument);
            };

            // Evaluation.
            expect(lAction).toThrow('No entry point function found for code generation.');
        });
    });
});

Deno.test('PotatnoCodeGenerator.generateFunction()', async (pContext) => {
    await pContext.step('Function', async (pContext) => {
        await pContext.step('Two exits', () => {
            // Setup. The calculator always has both the Default and X10 exits; the X10 pair is
            // wired flow-only by the helper, so wiring the Default pair gives a graph per exit.
            const { function: lFunction, defaultEntry: lDefaultEntry, defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();
            PotatnoHelper.connectFlow(lDefaultEntry, lDefaultExit);

            // Process.
            const lResult = new PotatnoCodeGenerator(PotatnoHelper.TEST_PROJECT).generateFunction(lFunction);

            // Evaluation. Two graphs (one per exit) plus two named consts.
            expect(lResult.entryPoint.graphs.length).toBe(2);
            expect(lResult.entryPoint.code).toBe(
                'const calculatorDefault = (v_1, v_2) => { '
                + 'let __globalMultiplier = 1; '
                + 'return (0) * __globalMultiplier; '
                + '};'
                + 'const calculatorX10 = (v_4, v_5) => { '
                + 'let __globalMultiplier = 1; '
                + 'return ((0) * 10) * __globalMultiplier; '
                + '};'
            );
        });

    });
});

Deno.test('PotatnoCodeGenerator.generateNode()', async (pContext) => {
    await pContext.step('Linear', async (pContext) => {
        await pContext.step('Single entry to exit', () => {
            // Setup.
            const { defaultEntry: lDefaultEntry, defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();
            PotatnoHelper.connectFlow(lDefaultEntry, lDefaultExit);

            // Process.
            const lResult = new PotatnoCodeGenerator(PotatnoHelper.TEST_PROJECT).generateNode(lDefaultExit);

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
            const { function: lFunction, defaultEntry: lDefaultEntry, defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();
            const lConstNode = PotatnoHelper.addProjectNode(lFunction, 'Const');
            PotatnoHelper.setInputValue(lConstNode, 'value', ['42']);
            PotatnoHelper.connectValue(lConstNode, 'result', lDefaultExit, 'result');
            PotatnoHelper.connectFlow(lDefaultEntry, lDefaultExit);

            // Process.
            const lResult = new PotatnoCodeGenerator(PotatnoHelper.TEST_PROJECT).generateNode(lDefaultExit);

            // Evaluation. The Const allocates first (v_1) during the exit's value
            // resolution; the entry's a/b allocate afterwards (v_2, v_3).
            expect(lResult.entryPoint.graphs[0].code).toBe(
                '(v_2, v_3) => { '
                + 'let __globalMultiplier = 1; '
                + 'const v_0 = 42; '
                + 'return (v_0) * __globalMultiplier; '
                + '}'
            );
        });

        await pContext.step('Imported value-producer is resolved by code generation', () => {
            // Setup. Place a node from an enabled import. The node is intentionally read from
            // project.imports, matching how the UI can place imported nodes.
            const { function: lFunction, defaultEntry: lDefaultEntry, defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();
            lFunction.addImport('ExtraComparison');
            const lImportDefinition = PotatnoHelper.TEST_PROJECT.imports.find((pImportDefinition) => pImportDefinition.id === 'ExtraComparison')!;
            const lGreaterOrEqualDefinition = lImportDefinition.nodes.find((pDefinition) => pDefinition.id === 'GreaterOrEqual')!;
            const lGreaterOrEqualNode = lFunction.addNodeByDefinition(lGreaterOrEqualDefinition, { x: 0, y: 0, width: 6, height: 4 });
            PotatnoHelper.connectFlow(lDefaultEntry, lDefaultExit);

            // Process.
            const lResult = new PotatnoCodeGenerator(PotatnoHelper.TEST_PROJECT).generateNode(lGreaterOrEqualNode);

            // Evaluation.
            expect(lResult.entryPoint.graphs[0].code).toBe('const v_0 = 0 >= 0;');
        });

        await pContext.step('Two-node arithmetic chain', () => {
            // Setup. Entry.a/b -> Add -> Multiply(other Entry.b) -> Exit.
            const { function: lFunction, defaultEntry: lDefaultEntry, defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();
            const lAddNode = PotatnoHelper.addProjectNode(lFunction, 'Add');
            const lMultiplyNode = PotatnoHelper.addProjectNode(lFunction, 'Multiply');
            PotatnoHelper.connectFlow(lDefaultEntry, lDefaultExit);
            PotatnoHelper.connectValue(lDefaultEntry, 'a', lAddNode, 'a');
            PotatnoHelper.connectValue(lDefaultEntry, 'b', lAddNode, 'b');
            PotatnoHelper.connectValue(lAddNode, 'result', lMultiplyNode, 'a');
            PotatnoHelper.connectValue(lDefaultEntry, 'b', lMultiplyNode, 'b');
            PotatnoHelper.connectValue(lMultiplyNode, 'result', lDefaultExit, 'result');

            // Process.
            const lResult = new PotatnoCodeGenerator(PotatnoHelper.TEST_PROJECT).generateNode(lDefaultExit);

            // Evaluation. Add emits before Multiply; both before the exit return.
            // Allocation order on the deepest-first descent: entry.a (v_1), entry.b
            // (v_2), Add.result (v_3), Multiply.result (v_4).
            expect(lResult.entryPoint.graphs[0].code).toBe(
                '(v_0, v_1) => { '
                + 'let __globalMultiplier = 1; '
                + 'const v_2 = v_0 + v_1; '
                + 'const v_3 = v_2 * v_1; '
                + 'return (v_3) * __globalMultiplier; '
                + '}'
            );
        });

        await pContext.step('Pick selects between two value inputs', () => {
            // Setup. Pick(Const(1), Const(2), Greater(a, b)) -> Exit.result.
            const { function: lFunction, defaultEntry: lDefaultEntry, defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();
            const lConstA = PotatnoHelper.addProjectNode(lFunction, 'Const');
            const lConstB = PotatnoHelper.addProjectNode(lFunction, 'Const');
            const lGreater = PotatnoHelper.addProjectNode(lFunction, 'Greater');
            const lPick = PotatnoHelper.addProjectNode(lFunction, 'Pick');
            PotatnoHelper.setInputValue(lConstA, 'value', ['1']);
            PotatnoHelper.setInputValue(lConstB, 'value', ['2']);
            PotatnoHelper.connectValue(lDefaultEntry, 'a', lGreater, 'a');
            PotatnoHelper.connectValue(lDefaultEntry, 'b', lGreater, 'b');
            PotatnoHelper.connectValue(lConstA, 'result', lPick, 'a');
            PotatnoHelper.connectValue(lConstB, 'result', lPick, 'b');
            PotatnoHelper.connectValue(lGreater, 'result', lPick, 'condition');
            PotatnoHelper.connectValue(lPick, 'result', lDefaultExit, 'result');
            PotatnoHelper.connectFlow(lDefaultEntry, lDefaultExit);

            // Process.
            const lResult = new PotatnoCodeGenerator(PotatnoHelper.TEST_PROJECT).generateNode(lDefaultExit);

            // Evaluation. Pick's value inputs are resolved a -> b -> condition, so
            // ConstA allocates first (v_1), then ConstB (v_2), then Greater (which
            // allocates entry.a/b as v_3/v_4 and its own result as v_5), then Pick
            // (v_6). Entry emits last using the already-allocated v_3/v_4.
            expect(lResult.entryPoint.graphs[0].code).toBe(
                '(v_2, v_3) => { '
                + 'let __globalMultiplier = 1; '
                + 'const v_0 = 1; '
                + 'const v_1 = 2; '
                + 'const v_4 = v_2 > v_3; '
                + 'const v_5 = ((a, b, cond) => { if (cond) { return a; } return b; })(v_0, v_1, v_4); '
                + 'return (v_5) * __globalMultiplier; '
                + '}'
            );
        });

        await pContext.step('Multiple flow nodes in sequence', () => {
            // Setup. Entry -> Pass -> Pass -> Exit.
            const { function: lFunction, defaultEntry: lDefaultEntry, defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();
            const lPassOne = PotatnoHelper.addProjectNode(lFunction, 'Pass');
            const lPassTwo = PotatnoHelper.addProjectNode(lFunction, 'Pass');
            PotatnoHelper.connectFlow(lDefaultEntry, lPassOne);
            PotatnoHelper.connectFlow(lPassOne, lPassTwo);
            PotatnoHelper.connectFlow(lPassTwo, lDefaultExit);

            // Process.
            const lResult = new PotatnoCodeGenerator(PotatnoHelper.TEST_PROJECT).generateNode(lDefaultExit);

            // Evaluation. Two `/* pass */;` markers, one per Pass, in flow order.
            expect(lResult.entryPoint.graphs[0].code).toBe(
                '(v_3, v_4) => { '
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
            const { function: lFunction, defaultEntry: lDefaultEntry, defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();
            const lIf = PotatnoHelper.addProjectNode(lFunction, 'If');
            const lGreater = PotatnoHelper.addProjectNode(lFunction, 'Greater');
            const lPassThen = PotatnoHelper.addProjectNode(lFunction, 'Pass');
            const lPassElse = PotatnoHelper.addProjectNode(lFunction, 'Pass');
            PotatnoHelper.connectValue(lDefaultEntry, 'a', lGreater, 'a');
            PotatnoHelper.connectValue(lDefaultEntry, 'b', lGreater, 'b');
            PotatnoHelper.connectValue(lGreater, 'result', lIf, 'condition');
            PotatnoHelper.connectFlow(lDefaultEntry, lIf);
            PotatnoHelper.connectFlow(lIf, lPassThen, 'then');
            PotatnoHelper.connectFlow(lIf, lPassElse, 'else');
            PotatnoHelper.connectFlow(lPassThen, lDefaultExit);
            PotatnoHelper.connectFlow(lPassElse, lDefaultExit);

            // Process.
            const lResult = new PotatnoCodeGenerator(PotatnoHelper.TEST_PROJECT).generateNode(lDefaultExit);

            // Evaluation. Exit is the merge node, If is the branch point; both
            // branch sub-walks emit a Pass with empty exec.inner. The merged tail
            // (the exit's return) lives on If's `code.next`. Greater (the
            // condition's value producer) emits before If on the parent scope.
            expect(lResult.entryPoint.graphs[0].code).toBe(
                '(v_2, v_3) => { '
                + 'let __globalMultiplier = 1; '
                + 'const v_4 = v_2 > v_3; '
                + 'if (v_4) { '
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
            const { function: lFunction, defaultEntry: lDefaultEntry, defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();
            const lConjunctionDefinition = PotatnoHelper.TEST_PROJECT.nodeDefinitions.find((pDefinition) => pDefinition.category === 'Conjunction' && pDefinition.inputs.some((pPort) => pPort.portType === 'flow'))!;
            const lConjunction = lFunction.addNodeByDefinition(lConjunctionDefinition, { x: 0, y: 0, width: 4, height: 2 });
            const lPass = PotatnoHelper.addProjectNode(lFunction, 'Pass');
            PotatnoHelper.connectFlow(lDefaultEntry, lConjunction);
            PotatnoHelper.connectFlow(lConjunction, lPass);
            PotatnoHelper.connectFlow(lPass, lDefaultExit);

            // Process.
            const lResult = new PotatnoCodeGenerator(PotatnoHelper.TEST_PROJECT).generateNode(lDefaultExit);

            // Evaluation. The conjunction does not contribute a node to the buffer;
            // output is exactly Entry -> Pass -> Exit.
            expect(lResult.entryPoint.graphs[0].code).toBe(
                '(v_2, v_3) => { '
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
            const { function: lFunction, defaultEntry: lDefaultEntry, defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();
            const lSharedConst = PotatnoHelper.addProjectNode(lFunction, 'Const');
            PotatnoHelper.setInputValue(lSharedConst, 'value', ['7']);
            const lAddNode = PotatnoHelper.addProjectNode(lFunction, 'Add');
            PotatnoHelper.connectValue(lSharedConst, 'result', lAddNode, 'a');
            PotatnoHelper.connectValue(lSharedConst, 'result', lAddNode, 'b');
            PotatnoHelper.connectValue(lAddNode, 'result', lDefaultExit, 'result');
            PotatnoHelper.connectFlow(lDefaultEntry, lDefaultExit);

            // Process.
            const lResult = new PotatnoCodeGenerator(PotatnoHelper.TEST_PROJECT).generateNode(lDefaultExit);

            // Evaluation. SharedConst's refcount is 2 (one per Add input); it emits
            // only when the second consumer drains it. v_1 names SharedConst.result
            // since it is the first port touched during the descent. Entry.a/b
            // allocate later as v_3/v_4.
            expect(lResult.entryPoint.graphs[0].code).toBe(
                '(v_3, v_4) => { '
                + 'let __globalMultiplier = 1; '
                + 'const v_0 = 7; '
                + 'const v_1 = v_0 + v_0; '
                + 'return (v_1) * __globalMultiplier; '
                + '}'
            );
        });

        await pContext.step('Pure-value producer shared by parent and child value nodes', () => {
            // Setup. SharedConst feeds Add.a and Multiply.b; Add.result feeds Multiply.a.
            const { function: lFunction, defaultEntry: lDefaultEntry, defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();
            const lSharedConst = PotatnoHelper.addProjectNode(lFunction, 'Const');
            const lAddNode = PotatnoHelper.addProjectNode(lFunction, 'Add');
            const lMultiplyNode = PotatnoHelper.addProjectNode(lFunction, 'Multiply');
            PotatnoHelper.setInputValue(lSharedConst, 'value', ['7']);
            PotatnoHelper.connectValue(lSharedConst, 'result', lAddNode, 'a');
            PotatnoHelper.connectValue(lDefaultEntry, 'a', lAddNode, 'b');
            PotatnoHelper.connectValue(lAddNode, 'result', lMultiplyNode, 'a');
            PotatnoHelper.connectValue(lSharedConst, 'result', lMultiplyNode, 'b');
            PotatnoHelper.connectValue(lMultiplyNode, 'result', lDefaultExit, 'result');
            PotatnoHelper.connectFlow(lDefaultEntry, lDefaultExit);

            // Process.
            const lResult = new PotatnoCodeGenerator(PotatnoHelper.TEST_PROJECT).generateNode(lDefaultExit);

            // Evaluation. SharedConst must emit before Add because Add already
            // references it, even though Multiply consumes SharedConst later.
            expect(lResult.entryPoint.graphs[0].code).toBe(
                '(v_1, v_5) => { '
                + 'let __globalMultiplier = 1; '
                + 'const v_0 = 7; '
                + 'const v_2 = v_0 + v_1; '
                + 'const v_3 = v_2 * v_0; '
                + 'return (v_3) * __globalMultiplier; '
                + '}'
            );
        });
    });

    await pContext.step('Hooks', async (pContext) => {
        await pContext.step('Wrapped around every generated node', () => {
            // Setup. A single Add fed by entry.a/b with all-default-value inputs.
            const { function: lFunction, defaultEntry: lDefaultEntry, defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();
            const lAddNode = PotatnoHelper.addProjectNode(lFunction, 'Add');
            PotatnoHelper.connectValue(lDefaultEntry, 'a', lAddNode, 'a');
            PotatnoHelper.connectValue(lDefaultEntry, 'b', lAddNode, 'b');
            PotatnoHelper.connectValue(lAddNode, 'result', lDefaultExit, 'result');
            PotatnoHelper.connectFlow(lDefaultEntry, lDefaultExit);

            // Process. pDebug=true enables the per-node hook wrapping.
            const lResult = new PotatnoCodeGenerator(PotatnoHelper.TEST_PROJECT).generateNode(lDefaultExit, true);
            const lGraph = lResult.entryPoint.graphs[0];

            // Evaluation.
            expect(lGraph.code).toBe(
                '/*[start-00000003]*/(v_0, v_1) => { '
                + 'let __globalMultiplier = 1; '
                + '/*[start-00000001]*/const v_2 = v_0 + v_1;/*[end-00000001]*/ '
                + '/*[start-00000002]*/return (v_2) * __globalMultiplier;/*[end-00000002]*/ '
                + '}/*[end-00000003]*/'
            );
            expect(lGraph.nodes.get(lAddNode)).toBe('00000001');
            expect(lGraph.nodes.get(lDefaultExit)).toBe('00000002');
            expect(lGraph.nodes.get(lDefaultEntry)).toBe('00000003');
            expect(lGraph.ports.get(lDefaultEntry.outputs.map.get('a')!)).toBe('v_0');
            expect(lGraph.ports.get(lDefaultEntry.outputs.map.get('b')!)).toBe('v_1');
            expect(lGraph.ports.get(lAddNode.outputs.map.get('result')!)).toBe('v_2');
            expect(lGraph.ports.get(lDefaultExit.inputs.map.get('result')!)).toBe('v_2');
        });

        await pContext.step('Custom hook generator is honoured', () => {
            // Setup. One-off project whose hook returns `<<id>>`. The exit's value
            // input forces a hook emission (flow-only nodes would not allocate any
            // valueId so the custom hook would never run).
            const lLocalTypes = new PotatnoProjectTypesDefinition({
                number: {
                    default: { string: ['0'], value: 0 },
                    convert: (pValues: Array<string>): string => pValues[0],
                    inputs: [{ name: 'value', type: 'number' as const }]
                }
            });

            const lSimpleEntry = new PotatnoStaticNodeDefinition({
                id: 'Start', label: 'Start', category: 'event',
                ports: {
                    inputs: [],
                    outputs: [{ label: 'exec', id: 'exec', portType: 'flow' }]
                },
                generators: { code: (pContext): string => `START(); ${pContext.outputs['exec'].code.inner}` }
            });

            const lSimpleExit = new PotatnoStaticNodeDefinition({
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

            const lLocalEntryFunction = new PotatnoFunctionDefinition({
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

            const lLocalProject = new PotatnoProject(lLocalTypes, lLocalEntryFunction, {
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
                definitionId: lLocalEntryFunction.id, id: 'main-instance', label: 'main', isSystem: true
            });
            const lLocalNodes = lLocalEntryFunction.getNodeDefinitions(lLocalFunction);
            const lLocalEntry = lLocalFunction.addNodeByDefinition(lLocalNodes.entry[0], { x: 0, y: 0, width: 4, height: 2 });
            const lLocalExit = lLocalFunction.addNodeByDefinition(lLocalNodes.exit[0], { x: 4, y: 0, width: 4, height: 2 });
            lLocalEntry.outputs.flow[0].connect(lLocalExit.inputs.flow[0]);

            // Process. pDebug=true enables the per-node hook wrapping.
            const lResult = new PotatnoCodeGenerator(lLocalProject).generateNode(lLocalExit, true);

            // Evaluation.
            expect(lResult.entryPoint.graphs[0].code).toBe(
                '<<start-00000002>>START(); <<start-00000001>>END(0);<<end-00000001>><<end-00000002>>'
            );
            expect(lResult.entryPoint.graphs[0].ports.get(lLocalExit.inputs.map.get('val')!)).toBe('0');
        });
    });

    await pContext.step('Error', async (pContext) => {
        await pContext.step('Missing node definition for a node in the graph', () => {
            // Setup. Construct a node whose definitionId is not in the function's lookup.
            const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
            const lGhostDefinition = new PotatnoStaticNodeDefinition<PotatnoTestProjectTypesDefinition>({
                id: 'GhostNode', label: 'GhostNode', category: 'event',
                ports: {
                    inputs: [{ label: 'exec', id: 'exec', portType: 'flow' }],
                    outputs: []
                },
                generators: { code: (): string => '' }
            });
            PotatnoHelper.TEST_PROJECT.addNodeDefinition(lGhostDefinition);
            const lGhostNode = lFunction.addNodeByDefinition(lGhostDefinition, { x: 0, y: 0, width: 4, height: 2 });
            // Remove the definition from the project's lookup so the generator can't find it.
            (PotatnoHelper.TEST_PROJECT as any).mNodeDefinitions.delete('GhostNode');

            // Process.
            const lAction = (): void => {
                new PotatnoCodeGenerator(PotatnoHelper.TEST_PROJECT).generateNode(lGhostNode);
            };

            // Evaluation. The missing definition is caught by document validation before generation runs.
            expect(lAction).toThrow('Code generation exited. Code graph validation failed.');
        });

        await pContext.step('Unconnected exit flow input fails validation', () => {
            // Setup. Exit with unconnected flow input.
            const { defaultExit: lDefaultExit } = PotatnoHelper.setupCalculatorDocument();

            // Process.
            const lAction = (): void => {
                new PotatnoCodeGenerator(PotatnoHelper.TEST_PROJECT).generateNode(lDefaultExit);
            };

            // Evaluation. The dangling flow input is rejected by document validation before the walk runs.
            expect(lAction).toThrow('Code generation exited. Code graph validation failed.');
        });
    });
});
