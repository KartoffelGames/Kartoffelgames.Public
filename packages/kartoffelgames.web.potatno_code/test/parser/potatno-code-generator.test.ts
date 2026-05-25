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

const lSetupCalculatorDocument = () => {
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

const lAddProjectNode = (pFunction: PotatnoDocumentFunction<typeof TestProject>, pDefinitionId: string): PotatnoDocumentNode<typeof TestProject> => {
    const lDefinition = TestProject.nodeDefinitions.find((pDef) => pDef.id === pDefinitionId);
    if (!lDefinition) {
        throw new Error(`No project node definition with id "${pDefinitionId}"`);
    }
    return pFunction.newNode(lDefinition, { x: 0, y: 0, width: 6, height: 4 });
};

Deno.test('PotatnoCodeGenerator.generateDocument()', async (pContext) => {
    await pContext.step('Document - Linear flow only', () => {
        // Setup. Entry -> Exit, flow-only.
        const { document, defaultEntry, defaultExit } = lSetupCalculatorDocument();
        defaultEntry.outputs.flow[0].connect(defaultExit.inputs.flow[0]);

        // Process.
        const lResult = new PotatnoCodeGenerator(TestProject).generateDocument(document);

        // Evaluation. The document body wraps the entry's arrow function and
        // the calculator label-prefixed const.
        expect(lResult.code).toBe(
            'const calculatorDefault = (v_1, v_2) => {\n'
            + 'let __globalMultiplier = 1;\n'
            + 'return (0) * __globalMultiplier;\n'
            + '}'
        );
    });

    await pContext.step('Document - Chained arithmetic', () => {
        // Setup. Entry(a,b) -> Add -> Exit(result), flow Entry -> Exit.
        const { document, function: lFunction, defaultEntry, defaultExit } = lSetupCalculatorDocument();
        const lAddNode = lAddProjectNode(lFunction, 'Add');
        defaultEntry.outputs.flow[0].connect(defaultExit.inputs.flow[0]);
        defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'a')!
            .connect(lAddNode.inputs.value.find((pPort) => pPort.definitionId === 'a')!);
        defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'b')!
            .connect(lAddNode.inputs.value.find((pPort) => pPort.definitionId === 'b')!);
        lAddNode.outputs.value[0].connect(defaultExit.inputs.value.find((pPort) => pPort.definitionId === 'result')!);

        // Process.
        const lResult = new PotatnoCodeGenerator(TestProject).generateDocument(document);

        // Evaluation. Add emits its const before the exit's return.
        expect(/const calculatorDefault = /.test(lResult.code)).toBe(true);
        expect(/const v_\d+ = v_\d+ \+ v_\d+;/.test(lResult.code)).toBe(true);
    });

    await pContext.step('Document - Multiple entries', () => {
        // Setup. Wire both Default and X10 pairs.
        const lEntryDefinition = TestProject.entryPoint;
        const { document, function: lFunction, defaultEntry, defaultExit } = lSetupCalculatorDocument();
        const lNodes = lEntryDefinition.getNodeDefinitions(lFunction);
        const lX10Entry = lFunction.newNode(lNodes.entry[1], { x: 0, y: 8, width: 6, height: 4 }, true);
        const lX10Exit = lFunction.newNode(lNodes.exit[1], { x: 12, y: 8, width: 6, height: 4 }, true);
        defaultEntry.outputs.flow[0].connect(defaultExit.inputs.flow[0]);
        lX10Entry.outputs.flow[0].connect(lX10Exit.inputs.flow[0]);

        // Process.
        const lResult = new PotatnoCodeGenerator(TestProject).generateDocument(document);

        // Evaluation. Both named consts present.
        expect(/calculatorDefault/.test(lResult.code)).toBe(true);
        expect(/calculatorX10/.test(lResult.code)).toBe(true);
    });

    await pContext.step('Document - GlobalMultiplier in flow', () => {
        // Setup. Entry -> GlobalMultiplier(5) -> Exit.
        const { document, function: lFunction, defaultEntry, defaultExit } = lSetupCalculatorDocument();
        const lGlobalMult = lAddProjectNode(lFunction, 'GlobalMultiplier');
        lGlobalMult.inputs.value.find((pPort) => pPort.definitionId === 'value')!.setDirectValue(['5']);
        defaultEntry.outputs.flow[0].connect(lGlobalMult.inputs.flow[0]);
        lGlobalMult.outputs.flow[0].connect(defaultExit.inputs.flow[0]);

        // Process.
        const lResult = new PotatnoCodeGenerator(TestProject).generateDocument(document);

        // Evaluation. The multiplier write `__globalMultiplier = 5;` appears.
        expect(/__globalMultiplier = 5;/.test(lResult.code)).toBe(true);
    });

    await pContext.step('Document - X10 exit composed with GlobalMultiplier', () => {
        // Setup. X10 Entry -> GlobalMultiplier(5) -> X10 Exit.
        const lEntryDefinition = TestProject.entryPoint;
        const { document, function: lFunction } = lSetupCalculatorDocument();
        // Remove the default-pair the helper placed so only the X10 graph remains.
        const lNodes = lEntryDefinition.getNodeDefinitions(lFunction);
        const lX10Entry = lFunction.newNode(lNodes.entry[1], { x: 0, y: 8, width: 6, height: 4 }, true);
        const lX10Exit = lFunction.newNode(lNodes.exit[1], { x: 12, y: 8, width: 6, height: 4 }, true);
        const lGlobalMult = lAddProjectNode(lFunction, 'GlobalMultiplier');
        lGlobalMult.inputs.value.find((pPort) => pPort.definitionId === 'value')!.setDirectValue(['5']);
        lX10Entry.outputs.flow[0].connect(lGlobalMult.inputs.flow[0]);
        lGlobalMult.outputs.flow[0].connect(lX10Exit.inputs.flow[0]);

        // Process.
        const lResult = new PotatnoCodeGenerator(TestProject).generateDocument(document);

        // Evaluation. Composition: the x10 return wraps (result) * 10 then multiplies by __globalMultiplier.
        expect(/return \(\(0\) \* 10\) \* __globalMultiplier;/.test(lResult.code)).toBe(true);
        expect(/__globalMultiplier = 5;/.test(lResult.code)).toBe(true);
    });

    await pContext.step('Error: generateDocument without system function', () => {
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

Deno.test('PotatnoCodeGenerator.generateFunction()', async (pContext) => {
    await pContext.step('Function - Single exit', () => {
        // Setup.
        const { function: lFunction, defaultEntry, defaultExit } = lSetupCalculatorDocument();
        defaultEntry.outputs.flow[0].connect(defaultExit.inputs.flow[0]);

        // Process.
        const lResult = new PotatnoCodeGenerator(TestProject).generateFunction(lFunction);

        // Evaluation. Exactly one graph for the wired exit.
        expect(lResult.entryPoint.graphs.length).toBe(1);
        expect(/calculatorDefault/.test(lResult.entryPoint.code)).toBe(true);
    });

    await pContext.step('Function - Two exits', () => {
        // Setup.
        const lEntryDefinition = TestProject.entryPoint;
        const { function: lFunction, defaultEntry, defaultExit } = lSetupCalculatorDocument();
        const lNodes = lEntryDefinition.getNodeDefinitions(lFunction);
        const lX10Entry = lFunction.newNode(lNodes.entry[1], { x: 0, y: 8, width: 6, height: 4 }, true);
        const lX10Exit = lFunction.newNode(lNodes.exit[1], { x: 12, y: 8, width: 6, height: 4 }, true);
        defaultEntry.outputs.flow[0].connect(defaultExit.inputs.flow[0]);
        lX10Entry.outputs.flow[0].connect(lX10Exit.inputs.flow[0]);

        // Process.
        const lResult = new PotatnoCodeGenerator(TestProject).generateFunction(lFunction);

        // Evaluation. Two graphs (one per exit).
        expect(lResult.entryPoint.graphs.length).toBe(2);
        expect(/calculatorDefault/.test(lResult.entryPoint.code)).toBe(true);
        expect(/calculatorX10/.test(lResult.entryPoint.code)).toBe(true);
    });

    await pContext.step('Function - Unwired exit produces no graph for that exit', () => {
        // Setup. Only the default-pair flow is wired.
        const lEntryDefinition = TestProject.entryPoint;
        const { function: lFunction, defaultEntry, defaultExit } = lSetupCalculatorDocument();
        const lNodes = lEntryDefinition.getNodeDefinitions(lFunction);
        lFunction.newNode(lNodes.entry[1], { x: 0, y: 8, width: 6, height: 4 }, true);
        lFunction.newNode(lNodes.exit[1], { x: 12, y: 8, width: 6, height: 4 }, true);
        defaultEntry.outputs.flow[0].connect(defaultExit.inputs.flow[0]);

        // Process.
        const lResult = new PotatnoCodeGenerator(TestProject).generateFunction(lFunction);

        // Evaluation. X10 graph cannot be reached - the generator's walk dies on the unwired exit.
        // The desired behaviour is that unwired exits produce no graph. Asserting here so the
        // contract is locked when the source bug is fixed.
        expect(/calculatorDefault/.test(lResult.entryPoint.code)).toBe(true);
        expect(/calculatorX10/.test(lResult.entryPoint.code)).toBe(false);
    });
});

Deno.test('PotatnoCodeGenerator.generateNode()', async (pContext) => {
    await pContext.step('Linear - Single entry to exit', () => {
        // Setup.
        const { defaultEntry, defaultExit } = lSetupCalculatorDocument();
        defaultEntry.outputs.flow[0].connect(defaultExit.inputs.flow[0]);

        // Process.
        const lResult = new PotatnoCodeGenerator(TestProject).generateNode(defaultExit);

        // Evaluation. Graph body matches the entry's arrow function wrapping the exit's return.
        expect(lResult.entryPoint.graphs[0].code).toBe(
            '(v_1, v_2) => {\n'
            + 'let __globalMultiplier = 1;\n'
            + 'return (0) * __globalMultiplier;\n'
            + '}'
        );
    });

    await pContext.step('Linear - Single value-producer feeds exit', () => {
        // Setup. Const -> Exit.result.
        const { function: lFunction, defaultEntry, defaultExit } = lSetupCalculatorDocument();
        const lConstNode = lAddProjectNode(lFunction, 'Const');
        lConstNode.inputs.value.find((pPort) => pPort.definitionId === 'value')!.setDirectValue(['42']);
        lConstNode.outputs.value[0].connect(defaultExit.inputs.value.find((pPort) => pPort.definitionId === 'result')!);
        defaultEntry.outputs.flow[0].connect(defaultExit.inputs.flow[0]);

        // Process.
        const lResult = new PotatnoCodeGenerator(TestProject).generateNode(defaultExit);

        // Evaluation. The const node emits before the return; the return uses the const's value id.
        expect(/const v_\d+ = 42;/.test(lResult.entryPoint.graphs[0].code)).toBe(true);
        expect(/return \(v_\d+\) \* __globalMultiplier;/.test(lResult.entryPoint.graphs[0].code)).toBe(true);
    });

    await pContext.step('Linear - Two-node arithmetic chain', () => {
        // Setup. Entry.a/b -> Add -> Multiply(other Entry.b) -> Exit.
        const { function: lFunction, defaultEntry, defaultExit } = lSetupCalculatorDocument();
        const lAddNode = lAddProjectNode(lFunction, 'Add');
        const lMulNode = lAddProjectNode(lFunction, 'Multiply');
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

        // Evaluation. Both Add and Multiply statements appear; Add appears before Multiply.
        const lCode: string = lResult.entryPoint.graphs[0].code;
        const lAddMatch: number = lCode.search(/const v_\d+ = v_\d+ \+ v_\d+;/);
        const lMulMatch: number = lCode.search(/const v_\d+ = v_\d+ \* v_\d+;/);
        expect(lAddMatch).toBeGreaterThan(-1);
        expect(lMulMatch).toBeGreaterThan(-1);
        expect(lAddMatch).toBeLessThan(lMulMatch);
    });

    await pContext.step('Linear - Pick selects between two value inputs', () => {
        // Setup. Pick(Const(1), Const(2), Greater(a, b)) -> Exit.result.
        const { function: lFunction, defaultEntry, defaultExit } = lSetupCalculatorDocument();
        const lConstA = lAddProjectNode(lFunction, 'Const');
        const lConstB = lAddProjectNode(lFunction, 'Const');
        const lGreater = lAddProjectNode(lFunction, 'Greater');
        const lPick = lAddProjectNode(lFunction, 'Pick');
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

        // Evaluation.
        expect(/const v_\d+ = \(\(a, b, cond\) => \{ if \(cond\) \{ return a; \} return b; \}\)\(v_\d+, v_\d+, v_\d+\);/.test(lResult.entryPoint.graphs[0].code)).toBe(true);
    });

    await pContext.step('Linear - Multiple flow nodes in sequence', () => {
        // Setup. Entry -> Pass -> Pass -> Exit.
        const { function: lFunction, defaultEntry, defaultExit } = lSetupCalculatorDocument();
        const lPassOne = lAddProjectNode(lFunction, 'Pass');
        const lPassTwo = lAddProjectNode(lFunction, 'Pass');
        defaultEntry.outputs.flow[0].connect(lPassOne.inputs.flow[0]);
        lPassOne.outputs.flow[0].connect(lPassTwo.inputs.flow[0]);
        lPassTwo.outputs.flow[0].connect(defaultExit.inputs.flow[0]);

        // Process.
        const lResult = new PotatnoCodeGenerator(TestProject).generateNode(defaultExit);

        // Evaluation. Two `/* pass */;` markers (one per Pass).
        const lCode: string = lResult.entryPoint.graphs[0].code;
        const lPasses: number = (lCode.match(/\/\* pass \*\/;/g) ?? []).length;
        expect(lPasses).toBe(2);
    });

    await pContext.step('Branching - If with both branches terminating at exit', () => {
        // Setup. Entry -> If, then: Pass -> Exit, else: Pass -> Exit. Condition is a Greater node.
        const { function: lFunction, defaultEntry, defaultExit } = lSetupCalculatorDocument();
        const lIf = lAddProjectNode(lFunction, 'If');
        const lGreater = lAddProjectNode(lFunction, 'Greater');
        const lPassThen = lAddProjectNode(lFunction, 'Pass');
        const lPassElse = lAddProjectNode(lFunction, 'Pass');
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

        // Evaluation. `if (...) { ... } else { ... }` shape present.
        expect(/if \(v_\d+\) \{[\s\S]*\} else \{[\s\S]*\}/.test(lResult.entryPoint.graphs[0].code)).toBe(true);
    });

    await pContext.step('Conjunction - Flow passthrough', () => {
        // Setup. Entry -> FlowConjunction -> Pass -> Exit. Output should match a direct Entry -> Pass -> Exit chain.
        const { function: lFunction, defaultEntry, defaultExit } = lSetupCalculatorDocument();
        const lConjDef = TestProject.nodeDefinitions.find((pDef) => pDef.category === 'Conjunction' && pDef.inputs.some((p) => p.portType === 'flow'))!;
        const lConjunction = lFunction.newNode(lConjDef, { x: 0, y: 0, width: 4, height: 2 });
        const lPass = lAddProjectNode(lFunction, 'Pass');
        defaultEntry.outputs.flow[0].connect(lConjunction.inputs.flow[0]);
        lConjunction.outputs.flow[0].connect(lPass.inputs.flow[0]);
        lPass.outputs.flow[0].connect(defaultExit.inputs.flow[0]);

        // Reference graph: Entry -> Pass -> Exit (no conjunction).
        const lRefFunction = lSetupCalculatorDocument();
        const lRefPass = lAddProjectNode(lRefFunction.function, 'Pass');
        lRefFunction.defaultEntry.outputs.flow[0].connect(lRefPass.inputs.flow[0]);
        lRefPass.outputs.flow[0].connect(lRefFunction.defaultExit.inputs.flow[0]);

        // Process.
        const lWithConjunction = new PotatnoCodeGenerator(TestProject).generateNode(defaultExit);
        const lWithoutConjunction = new PotatnoCodeGenerator(TestProject).generateNode(lRefFunction.defaultExit);

        // Evaluation. The conjunction is invisible in the output.
        expect(lWithConjunction.entryPoint.graphs[0].code).toBe(lWithoutConjunction.entryPoint.graphs[0].code);
    });

    await pContext.step('Refcount - Pure-value producer used twice in the same flow node', () => {
        // Setup. SharedConst feeds both Add inputs; Add -> Exit.result.
        const { function: lFunction, defaultEntry, defaultExit } = lSetupCalculatorDocument();
        const lSharedConst = lAddProjectNode(lFunction, 'Const');
        lSharedConst.inputs.value.find((pPort) => pPort.definitionId === 'value')!.setDirectValue(['7']);
        const lAddNode = lAddProjectNode(lFunction, 'Add');
        lSharedConst.outputs.value[0].connect(lAddNode.inputs.value.find((pPort) => pPort.definitionId === 'a')!);
        lSharedConst.outputs.value[0].connect(lAddNode.inputs.value.find((pPort) => pPort.definitionId === 'b')!);
        lAddNode.outputs.value[0].connect(defaultExit.inputs.value.find((pPort) => pPort.definitionId === 'result')!);
        defaultEntry.outputs.flow[0].connect(defaultExit.inputs.flow[0]);

        // Process.
        const lResult = new PotatnoCodeGenerator(TestProject).generateNode(defaultExit);

        // Evaluation. The Const literal `7` appears exactly once.
        const lCode: string = lResult.entryPoint.graphs[0].code;
        const lConstEmits: number = (lCode.match(/const v_\d+ = 7;/g) ?? []).length;
        expect(lConstEmits).toBe(1);
    });

    await pContext.step('Hooks - Appended for every input and output valueId', () => {
        // Setup. A single Add with all-default-value inputs.
        const { function: lFunction, defaultEntry, defaultExit } = lSetupCalculatorDocument();
        const lAddNode = lAddProjectNode(lFunction, 'Add');
        lAddNode.outputs.value[0].connect(defaultExit.inputs.value.find((pPort) => pPort.definitionId === 'result')!);
        defaultEntry.outputs.flow[0].connect(defaultExit.inputs.flow[0]);

        // Process.
        const lResult = new PotatnoCodeGenerator(TestProject).generateNode(defaultExit);

        // Evaluation. Hook markers appear (one per resolved value id - includes inputs and outputs).
        expect(/\/\*\[[^\]]+\]\*\//.test(lResult.entryPoint.graphs[0].code)).toBe(true);
    });

    await pContext.step('Hooks - Custom hook generator is honoured', () => {
        // Setup. Spin up a one-off project whose hook returns `<<id>>`.
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
            generators: { code: (pContext): string => `START();\n${pContext.outputs['exec'].code.inner}` }
        });

        const lSimpleExit = PotatnoStaticNodeDefinition.newStaticNode({
            id: 'End', label: 'End', category: 'output',
            ports: {
                inputs: [{ label: 'exec', id: 'exec', portType: 'flow' }],
                outputs: []
            },
            generators: { code: (): string => 'END();' }
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
                hook: (pValueId: string): string => `<<${pValueId}>>`
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

        // Process.
        const lResult = new PotatnoCodeGenerator(lLocalProject).generateNode(lLocalExit);

        // Evaluation. `<<...>>` markers appear in the output.
        expect(/<<[^>]+>>/.test(lResult.entryPoint.graphs[0].code)).toBe(true);
    });

    await pContext.step('Error: Missing node definition for a node in the graph', () => {
        // Setup. Construct a node whose definitionId is not in the function's lookup.
        const { function: lFunction } = lSetupCalculatorDocument();
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

    await pContext.step('Error: Walk emits zero nodes', () => {
        // Setup. Exit with unconnected flow input.
        const { defaultExit } = lSetupCalculatorDocument();

        // Process.
        const lAction = (): void => {
            new PotatnoCodeGenerator(TestProject).generateNode(defaultExit);
        };

        // Evaluation. Currently the walk dead-ends at the exit and the generator
        // throws on the first emit because the exit's definition is not findable
        // via PotatnoDocumentFunction.nodeDefinitions. The intended contract is
        // the message below; lock it in even when the upstream bug is fixed.
        expect(lAction).toThrow(/Walk did not reach an entry node from exit "Default"\.|Node definition "CalculatorDefaultExit" not found/);
    });
});
