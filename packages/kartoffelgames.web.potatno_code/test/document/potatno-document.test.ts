import { expect } from '@kartoffelgames/core-test';
import { PotatnoDocumentFunction } from '../../source/document/potatno-document-function.ts';
import { PotatnoDocument } from '../../source/document/potatno-document.ts';
import { PotatnoFunctionNodeDefinition } from '../../source/project/node_definition/potatno-function-node-definition.ts';
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

// Create a user function instance from the first user function definition in
// the project (the helper).
const lNewHelperFunction = (pDocument: PotatnoDocument<typeof TestProject>, pId: string, pLabel: string): PotatnoDocumentFunction<typeof TestProject> => {
    const lHelperDefinition = [...TestProject.userFunctions.values()][0];
    return pDocument.newFunction({
        definitionId: lHelperDefinition.id,
        id: pId,
        label: pLabel,
        isSystem: false
    });
};

Deno.test('PotatnoDocument.constructor()', async (pContext) => {
    await pContext.step('Creates document with empty functions set', () => {
        // Setup. Process.
        const lDocument = new PotatnoDocument(TestProject);

        // Evaluation.
        expect(lDocument.functions.size).toBe(0);
    });

    await pContext.step('Creates document referencing the provided project', () => {
        // Setup. Process.
        const lDocument = new PotatnoDocument(TestProject);

        // Evaluation.
        expect(lDocument.project).toBe(TestProject);
    });
});

Deno.test('PotatnoDocument.project', async (pContext) => {
    await pContext.step('Returns the project passed in', () => {
        // Setup.
        const lDocument = new PotatnoDocument(TestProject);

        // Process.
        const lResult = lDocument.project;

        // Evaluation.
        expect(lResult).toBe(TestProject);
    });
});

Deno.test('PotatnoDocument.functions', async (pContext) => {
    await pContext.step('Empty when no functions added', () => {
        // Setup. Process.
        const lDocument = new PotatnoDocument(TestProject);

        // Evaluation.
        expect(lDocument.functions.size).toBe(0);
    });

    await pContext.step('Contains added function instances', () => {
        // Setup. Process.
        const { document, function: lFunction } = lSetupCalculatorDocument();

        // Evaluation.
        expect(document.functions.has(lFunction)).toBe(true);
    });

    await pContext.step('Does not include removed functions', () => {
        // Setup.
        const lDocument = new PotatnoDocument(TestProject);
        const lHelper = lNewHelperFunction(lDocument, 'h1', 'helperOne');

        // Process.
        lDocument.removeFunction(lHelper);

        // Evaluation.
        expect(lDocument.functions.has(lHelper)).toBe(false);
    });
});

Deno.test('PotatnoDocument.nodeDefinitions', async (pContext) => {
    await pContext.step('Returns project definitions when no functions are present', () => {
        // Setup.
        const lDocument = new PotatnoDocument(TestProject);

        // Process.
        const lDefinitions = lDocument.nodeDefinitions;

        // Evaluation. With no functions present, only the project's definitions are returned.
        const lProjectIds: Set<string> = new Set(TestProject.nodeDefinitions.map((pDef) => pDef.id));
        const lDocumentIds: Set<string> = new Set(lDefinitions.map((pDef) => pDef.id));
        for (const lId of lProjectIds) {
            expect(lDocumentIds.has(lId)).toBe(true);
        }
    });

    await pContext.step('Returns project plus function-node definitions when functions exist', () => {
        // Setup.
        const lDocument = new PotatnoDocument(TestProject);
        lNewHelperFunction(lDocument, 'h1', 'helperOne');

        // Process.
        const lDefinitions = lDocument.nodeDefinitions;

        // Evaluation. A USERFUNCTION_<id> definition appears among the document's definitions.
        const lHasFunctionNode: boolean = lDefinitions.some((pDef) => pDef instanceof PotatnoFunctionNodeDefinition);
        expect(lHasFunctionNode).toBe(true);
    });
});

Deno.test('PotatnoDocument.newFunction()', async (pContext) => {
    await pContext.step('Creates and returns a function', () => {
        // Setup.
        const lDocument = new PotatnoDocument(TestProject);

        // Process.
        const lFunction = lDocument.newFunction({
            definitionId: TestProject.entryPoint.id,
            id: 'fn', label: 'fn', isSystem: false
        });

        // Evaluation.
        expect(lFunction).toBeDefined();
        expect(lFunction.id).toBe('fn');
    });

    await pContext.step('Adds the function to the functions set', () => {
        // Setup.
        const lDocument = new PotatnoDocument(TestProject);

        // Process.
        const lFunction = lDocument.newFunction({
            definitionId: TestProject.entryPoint.id,
            id: 'fn', label: 'fn', isSystem: false
        });

        // Evaluation.
        expect(lDocument.functions.has(lFunction)).toBe(true);
    });

    await pContext.step('Registers a corresponding PotatnoFunctionNodeDefinition', () => {
        // Setup.
        const lDocument = new PotatnoDocument(TestProject);

        // Process.
        const lFunction = lDocument.newFunction({
            definitionId: TestProject.entryPoint.id,
            id: 'fn', label: 'fn', isSystem: false
        });

        // Evaluation. A function-node definition mirroring the new function is registered.
        const lMatching = lDocument.nodeDefinitions.find((pDef) =>
            pDef instanceof PotatnoFunctionNodeDefinition && pDef.function === lFunction);
        expect(lMatching).toBeDefined();
    });
});

Deno.test('PotatnoDocument.addFunction()', async (pContext) => {
    await pContext.step('Adds an externally constructed function', () => {
        // Setup.
        const lDocument = new PotatnoDocument(TestProject);
        const lFunction = new PotatnoDocumentFunction(TestProject, lDocument, {
            definitionId: TestProject.entryPoint.id,
            id: 'fn', label: 'fn', isSystem: false
        });

        // Process.
        lDocument.addFunction(lFunction);

        // Evaluation.
        expect(lDocument.functions.has(lFunction)).toBe(true);
    });

    await pContext.step('Registers a corresponding PotatnoFunctionNodeDefinition', () => {
        // Setup.
        const lDocument = new PotatnoDocument(TestProject);
        const lFunction = new PotatnoDocumentFunction(TestProject, lDocument, {
            definitionId: TestProject.entryPoint.id,
            id: 'fn', label: 'fn', isSystem: false
        });

        // Process.
        lDocument.addFunction(lFunction);

        // Evaluation.
        const lMatching = lDocument.nodeDefinitions.find((pDef) =>
            pDef instanceof PotatnoFunctionNodeDefinition && pDef.function === lFunction);
        expect(lMatching).toBeDefined();
    });
});

Deno.test('PotatnoDocument.removeFunction()', async (pContext) => {
    await pContext.step('Returns true when the function existed', () => {
        // Setup.
        const lDocument = new PotatnoDocument(TestProject);
        const lHelper = lNewHelperFunction(lDocument, 'h1', 'helperOne');

        // Process.
        const lResult: boolean = lDocument.removeFunction(lHelper);

        // Evaluation.
        expect(lResult).toBe(true);
    });

    await pContext.step('Returns false for a function that was never added', () => {
        // Setup.
        const lDocument = new PotatnoDocument(TestProject);
        const lDisconnected = new PotatnoDocumentFunction(TestProject, lDocument, {
            definitionId: TestProject.entryPoint.id,
            id: 'disconnected', label: 'disconnected', isSystem: false
        });

        // Process.
        const lResult: boolean = lDocument.removeFunction(lDisconnected);

        // Evaluation.
        expect(lResult).toBe(false);
    });

    await pContext.step('Removes the function from the set', () => {
        // Setup.
        const lDocument = new PotatnoDocument(TestProject);
        const lHelper = lNewHelperFunction(lDocument, 'h1', 'helperOne');

        // Process.
        lDocument.removeFunction(lHelper);

        // Evaluation.
        expect(lDocument.functions.has(lHelper)).toBe(false);
    });

    await pContext.step('Removes the corresponding function-node definition', () => {
        // Setup.
        const lDocument = new PotatnoDocument(TestProject);
        const lHelper = lNewHelperFunction(lDocument, 'h1', 'helperOne');

        // Process.
        lDocument.removeFunction(lHelper);

        // Evaluation.
        const lMatching = lDocument.nodeDefinitions.find((pDef) =>
            pDef instanceof PotatnoFunctionNodeDefinition && pDef.function === lHelper);
        expect(lMatching).toBeUndefined();
    });
});

Deno.test('Error: PotatnoDocument.removeFunction() on system function', async (pContext) => {
    await pContext.step('Throws when attempting to remove a system function', () => {
        // Setup.
        const { document, function: lFunction } = lSetupCalculatorDocument();

        // Process.
        const lAction = (): void => { document.removeFunction(lFunction); };

        // Evaluation.
        expect(lAction).toThrow('Cannot remove a system function.');
    });
});

Deno.test('PotatnoDocument - Validation', async (pContext) => {
    await pContext.step('Empty document', () => {
        // Setup.
        const lDocument = new PotatnoDocument(TestProject);

        // Process.
        const lErrors = lDocument.validate();

        // Evaluation.
        expect(lErrors.length).toBe(0);
    });

    await pContext.step('Cross-function recursion: A -> A', () => {
        // Setup. Helper function whose graph contains a function-call to itself.
        const lDocument = new PotatnoDocument(TestProject);
        const lHelper = lNewHelperFunction(lDocument, 'h-self', 'helperSelf');
        const lSelfNodeDef = lDocument.nodeDefinitions.find((pDef) =>
            pDef instanceof PotatnoFunctionNodeDefinition && pDef.function === lHelper)!;
        lHelper.newNode(lSelfNodeDef, { x: 0, y: 0, width: 4, height: 2 });

        // Process.
        const lErrors = lDocument.validate();

        // Evaluation.
        expect(lErrors.some((pError) => /cross-function recursion/.test(pError.message))).toBe(true);
    });

    await pContext.step('Cross-function recursion: A -> B -> A', () => {
        // Setup. Two helper instances that call each other.
        const lDocument = new PotatnoDocument(TestProject);
        const lHelperA = lNewHelperFunction(lDocument, 'a', 'helperA');
        const lHelperB = lNewHelperFunction(lDocument, 'b', 'helperB');
        const lDefA = lDocument.nodeDefinitions.find((pDef) =>
            pDef instanceof PotatnoFunctionNodeDefinition && pDef.function === lHelperA)!;
        const lDefB = lDocument.nodeDefinitions.find((pDef) =>
            pDef instanceof PotatnoFunctionNodeDefinition && pDef.function === lHelperB)!;
        lHelperA.newNode(lDefB, { x: 0, y: 0, width: 4, height: 2 });
        lHelperB.newNode(lDefA, { x: 0, y: 0, width: 4, height: 2 });

        // Process.
        const lErrors = lDocument.validate();

        // Evaluation. At least one cycle error - both participants typically flagged.
        const lCycleErrors = lErrors.filter((pError) => /cross-function recursion/.test(pError.message));
        expect(lCycleErrors.length).toBeGreaterThan(0);
    });

    await pContext.step('Acyclic A -> B -> C', () => {
        // Setup. Three helpers: A calls B, B calls C. No cycle.
        const lDocument = new PotatnoDocument(TestProject);
        const lA = lNewHelperFunction(lDocument, 'a', 'helperA');
        const lB = lNewHelperFunction(lDocument, 'b', 'helperB');
        const lC = lNewHelperFunction(lDocument, 'c', 'helperC');
        const lDefB = lDocument.nodeDefinitions.find((pDef) =>
            pDef instanceof PotatnoFunctionNodeDefinition && pDef.function === lB)!;
        const lDefC = lDocument.nodeDefinitions.find((pDef) =>
            pDef instanceof PotatnoFunctionNodeDefinition && pDef.function === lC)!;
        lA.newNode(lDefB, { x: 0, y: 0, width: 4, height: 2 });
        lB.newNode(lDefC, { x: 0, y: 0, width: 4, height: 2 });

        // Process.
        const lErrors = lDocument.validate();

        // Evaluation.
        const lCycleErrors = lErrors.filter((pError) => /cross-function recursion/.test(pError.message));
        expect(lCycleErrors.length).toBe(0);
    });

    await pContext.step('Recursion error item points at the offending function', () => {
        // Setup. Self-recursive helper.
        const lDocument = new PotatnoDocument(TestProject);
        const lHelper = lNewHelperFunction(lDocument, 'h-self', 'helperSelf');
        const lSelfNodeDef = lDocument.nodeDefinitions.find((pDef) =>
            pDef instanceof PotatnoFunctionNodeDefinition && pDef.function === lHelper)!;
        lHelper.newNode(lSelfNodeDef, { x: 0, y: 0, width: 4, height: 2 });

        // Process.
        const lErrors = lDocument.validate();

        // Evaluation.
        const lCycleError = lErrors.find((pError) => /cross-function recursion/.test(pError.message));
        expect(lCycleError).toBeDefined();
        expect(lCycleError!.item).toBe(lHelper);
    });
});
