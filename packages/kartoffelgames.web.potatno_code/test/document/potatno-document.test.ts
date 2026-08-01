import { expect } from '@kartoffelgames/core-test';
import { PotatnoDocumentFunction } from '../../source/document/potatno-document-function.ts';
import { PotatnoDocument } from '../../source/document/potatno-document.ts';
import { PotatnoFunctionNodeDefinition } from '../../source/project/node_definition/potatno-function-node-definition.ts';
import { PotatnoHelper } from '../helper/potatno-helper.ts';

Deno.test('PotatnoDocument.constructor()', async (pContext) => {
    await pContext.step('Creates document with empty functions set', () => {
        // Setup. Process.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);

        // Evaluation.
        expect(lDocument.functions).toHaveLength(0);
    });

    await pContext.step('Creates document referencing the provided project', () => {
        // Setup. Process.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);

        // Evaluation.
        expect(lDocument.project).toBe(PotatnoHelper.TEST_PROJECT);
    });
});

Deno.test('PotatnoDocument.project', async (pContext) => {
    await pContext.step('Returns the project passed in', () => {
        // Setup.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);

        // Process.
        const lResult = lDocument.project;

        // Evaluation.
        expect(lResult).toBe(PotatnoHelper.TEST_PROJECT);
    });
});

Deno.test('PotatnoDocument.functions', async (pContext) => {
    await pContext.step('Empty when no functions added', () => {
        // Setup. Process.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);

        // Evaluation.
        expect(lDocument.functions).toHaveLength(0);
    });

    await pContext.step('Contains added function instances', () => {
        // Setup. Process.
        const { document: lDocument, function: lFunction } = PotatnoHelper.setupCalculatorDocument();

        // Evaluation.
        expect(lDocument.functions).toContain(lFunction);
    });

    await pContext.step('Does not include removed functions', () => {
        // Setup.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);
        const lHelper = PotatnoHelper.newHelperFunction(lDocument, 'h1', 'helperOne');

        // Process.
        lDocument.removeFunction(lHelper);

        // Evaluation.
        expect(lDocument.functions).not.toContain(lHelper);
    });
});

Deno.test('PotatnoDocument.nodeDefinitions', async (pContext) => {
    await pContext.step('Returns project definitions when no functions are present', () => {
        // Setup.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);

        // Process.
        const lDefinitions = lDocument.nodeDefinitions;

        // Evaluation. With no functions present, only the project's definitions are returned.
        const lProjectIds: Set<string> = new Set(PotatnoHelper.TEST_PROJECT.nodeDefinitions.keys());
        const lDocumentIds: Set<string> = new Set(lDefinitions.map((pDefinition) => pDefinition.id));
        expect(lProjectIds.difference(lDocumentIds).size).toBe(0);
    });

    await pContext.step('Returns project plus function-node definitions when functions exist', () => {
        // Setup.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);
        PotatnoHelper.newHelperFunction(lDocument, 'h1', 'helperOne');

        // Process.
        const lDefinitions = lDocument.nodeDefinitions;

        // Evaluation. A USERFUNCTION_<id> definition appears among the document's definitions.
        const lHasFunctionNode: boolean = lDefinitions.some((pDefinition) => pDefinition instanceof PotatnoFunctionNodeDefinition);
        expect(lHasFunctionNode).toBe(true);
    });
});

Deno.test('PotatnoDocument.newFunction()', async (pContext) => {
    await pContext.step('Creates and returns a function', () => {
        // Setup.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);

        // Process.
        const lFunction = lDocument.newFunction({
            definitionId: PotatnoHelper.TEST_PROJECT.entryPoint.id,
            id: 'fn', label: 'fn', isSystem: false
        });

        // Evaluation.
        expect(lFunction).toBeDefined();
        expect(lFunction.id).toBe('fn');
    });

    await pContext.step('Adds the function to the functions set', () => {
        // Setup.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);

        // Process.
        const lFunction = lDocument.newFunction({
            definitionId: PotatnoHelper.TEST_PROJECT.entryPoint.id,
            id: 'fn', label: 'fn', isSystem: false
        });

        // Evaluation.
        expect(lDocument.functions).toContain(lFunction);
    });

    await pContext.step('Registers a corresponding PotatnoFunctionNodeDefinition', () => {
        // Setup.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);

        // Process.
        const lFunction = lDocument.newFunction({
            definitionId: PotatnoHelper.TEST_PROJECT.entryPoint.id,
            id: 'fn', label: 'fn', isSystem: false
        });

        // Evaluation. A function-node definition mirroring the new function is registered.
        const lMatching = lDocument.nodeDefinitions.find((pDefinition) =>
            pDefinition instanceof PotatnoFunctionNodeDefinition && pDefinition.function === lFunction);
        expect(lMatching).toBeDefined();
    });
});

Deno.test('PotatnoDocument.addFunction()', async (pContext) => {
    await pContext.step('Adds an externally constructed function', () => {
        // Setup.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);
        const lFunction = new PotatnoDocumentFunction(PotatnoHelper.TEST_PROJECT, lDocument, {
            definitionId: PotatnoHelper.TEST_PROJECT.entryPoint.id,
            id: 'fn', label: 'fn', isSystem: false
        });

        // Process.
        lDocument.addFunction(lFunction);

        // Evaluation.
        expect(lDocument.functions).toContain(lFunction);
    });

    await pContext.step('Registers a corresponding PotatnoFunctionNodeDefinition', () => {
        // Setup.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);
        const lFunction = new PotatnoDocumentFunction(PotatnoHelper.TEST_PROJECT, lDocument, {
            definitionId: PotatnoHelper.TEST_PROJECT.entryPoint.id,
            id: 'fn', label: 'fn', isSystem: false
        });

        // Process.
        lDocument.addFunction(lFunction);

        // Evaluation.
        const lMatching = lDocument.nodeDefinitions.find((pDefinition) =>
            pDefinition instanceof PotatnoFunctionNodeDefinition && pDefinition.function === lFunction);
        expect(lMatching).toBeDefined();
    });
});

Deno.test('PotatnoDocument.removeFunction()', async (pContext) => {
    await pContext.step('Returns true when the function existed', () => {
        // Setup.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);
        const lHelper = PotatnoHelper.newHelperFunction(lDocument, 'h1', 'helperOne');

        // Process.
        const lResult: boolean = lDocument.removeFunction(lHelper);

        // Evaluation.
        expect(lResult).toBe(true);
    });

    await pContext.step('Returns false for a function that was never added', () => {
        // Setup.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);
        const lDisconnected = new PotatnoDocumentFunction(PotatnoHelper.TEST_PROJECT, lDocument, {
            definitionId: PotatnoHelper.TEST_PROJECT.entryPoint.id,
            id: 'disconnected', label: 'disconnected', isSystem: false
        });

        // Process.
        const lResult: boolean = lDocument.removeFunction(lDisconnected);

        // Evaluation.
        expect(lResult).toBe(false);
    });

    await pContext.step('Removes the function from the set', () => {
        // Setup.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);
        const lHelper = PotatnoHelper.newHelperFunction(lDocument, 'h1', 'helperOne');

        // Process.
        lDocument.removeFunction(lHelper);

        // Evaluation.
        expect(lDocument.functions).not.toContain(lHelper);
    });

    await pContext.step('Removes the corresponding function-node definition', () => {
        // Setup.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);
        const lHelper = PotatnoHelper.newHelperFunction(lDocument, 'h1', 'helperOne');

        // Process.
        lDocument.removeFunction(lHelper);

        // Evaluation.
        const lMatching = lDocument.nodeDefinitions.find((pDefinition) =>
            pDefinition instanceof PotatnoFunctionNodeDefinition && pDefinition.function === lHelper);
        expect(lMatching).toBeUndefined();
    });
});

Deno.test('Error: PotatnoDocument.removeFunction() on system function', async (pContext) => {
    await pContext.step('Throws when attempting to remove a system function', () => {
        // Setup.
        const { document: lDocument, function: lFunction } = PotatnoHelper.setupCalculatorDocument();

        // Process.
        const lAction = (): void => { lDocument.removeFunction(lFunction); };

        // Evaluation.
        expect(lAction).toThrow('Cannot remove a system function.');
    });
});

Deno.test('PotatnoDocument - Validation', async (pContext) => {
    await pContext.step('Empty document initialize with entry points', () => {
        // Setup.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);

        // Process.
        const lValidationResult = lDocument.validate();

        // Evaluation.
        expect(lValidationResult.errors).toHaveLength(2); // Two not connected flow ports of the entry point.
        expect(lDocument.functions).toHaveLength(1);
    });

    await pContext.step('Cross-function recursion: A -> A', () => {
        // Setup. Helper function whose graph contains a function-call to itself.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);
        const lHelper = PotatnoHelper.newHelperFunction(lDocument, 'h-self', 'helperSelf');
        const lSelfNodeDef = lDocument.nodeDefinitions.find((pDefinition) =>
            pDefinition instanceof PotatnoFunctionNodeDefinition && pDefinition.function === lHelper)!;
        lHelper.addNodeByDefinition(lSelfNodeDef, { x: 0, y: 0, width: 4, height: 2 });

        // Process.
        const lValidationResult = lDocument.validate();

        // Evaluation.
        expect(lValidationResult.errors.some((pError) => /cross-function recursion/.test(pError.message))).toBe(true);
    });

    await pContext.step('Cross-function recursion: A -> B -> A', () => {
        // Setup. Two helper instances that call each other.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);
        const lHelperA = PotatnoHelper.newHelperFunction(lDocument, 'a', 'helperA');
        const lHelperB = PotatnoHelper.newHelperFunction(lDocument, 'b', 'helperB');
        const lDefA = lDocument.nodeDefinitions.find((pDefinition) =>
            pDefinition instanceof PotatnoFunctionNodeDefinition && pDefinition.function === lHelperA)!;
        const lDefB = lDocument.nodeDefinitions.find((pDefinition) =>
            pDefinition instanceof PotatnoFunctionNodeDefinition && pDefinition.function === lHelperB)!;
        lHelperA.addNodeByDefinition(lDefB, { x: 0, y: 0, width: 4, height: 2 });
        lHelperB.addNodeByDefinition(lDefA, { x: 0, y: 0, width: 4, height: 2 });

        // Process.
        const lValidationResult = lDocument.validate();

        // Evaluation. At least one cycle error - both participants typically flagged.
        const lCycleErrors = lValidationResult.errors.filter((pError) => /cross-function recursion/.test(pError.message));
        expect(lCycleErrors.length).toBeGreaterThan(0);
    });

    await pContext.step('Acyclic A -> B -> C', () => {
        // Setup. Three helpers: A calls B, B calls C. No cycle.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);
        const lA = PotatnoHelper.newHelperFunction(lDocument, 'a', 'helperA');
        const lB = PotatnoHelper.newHelperFunction(lDocument, 'b', 'helperB');
        const lC = PotatnoHelper.newHelperFunction(lDocument, 'c', 'helperC');
        const lDefB = lDocument.nodeDefinitions.find((pDefinition) =>
            pDefinition instanceof PotatnoFunctionNodeDefinition && pDefinition.function === lB)!;
        const lDefC = lDocument.nodeDefinitions.find((pDefinition) =>
            pDefinition instanceof PotatnoFunctionNodeDefinition && pDefinition.function === lC)!;
        lA.addNodeByDefinition(lDefB, { x: 0, y: 0, width: 4, height: 2 });
        lB.addNodeByDefinition(lDefC, { x: 0, y: 0, width: 4, height: 2 });

        // Process.
        const lValidationResult = lDocument.validate();

        // Evaluation.
        const lCycleErrors = lValidationResult.errors.filter((pError) => /cross-function recursion/.test(pError.message));
        expect(lCycleErrors.length).toBe(0);
    });

    await pContext.step('Recursion error item points at the offending function', () => {
        // Setup. Self-recursive helper.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);
        const lHelper = PotatnoHelper.newHelperFunction(lDocument, 'h-self', 'helperSelf');
        const lSelfNodeDef = lDocument.nodeDefinitions.find((pDefinition) =>
            pDefinition instanceof PotatnoFunctionNodeDefinition && pDefinition.function === lHelper)!;
        lHelper.addNodeByDefinition(lSelfNodeDef, { x: 0, y: 0, width: 4, height: 2 });

        // Process.
        const lValidationResult = lDocument.validate();

        // Evaluation.
        const lCycleError = lValidationResult.errors.find((pError) => /cross-function recursion/.test(pError.message));
        expect(lCycleError).toBeDefined();
        expect(lCycleError!.item).toBe(lHelper);
    });

    await pContext.step('Affected items include synced entry function and system nodes', () => {
        // Setup.
        const lDocument = new PotatnoDocument(PotatnoHelper.TEST_PROJECT);

        // Process.
        const lValidationResult = lDocument.validate();

        // Evaluation.
        const lFunction = [...lDocument.functions][0];
        expect(lValidationResult.affectedItems.has(lFunction)).toBe(true);
        expect([...lFunction.nodes].every((pNode) => lValidationResult.affectedItems.has(pNode))).toBe(true);
    });
});
