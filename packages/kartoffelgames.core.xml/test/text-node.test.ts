import { expect } from '@kartoffelgames/core-test';
import { TextNode } from '../source/node/text-node.ts';

Deno.test('TextNode.defaultNamespace', async (pContext) => {
    await pContext.step('Property: defaultNamespace', () => {
        // Setup.
        const lTextNode: TextNode = new TextNode();

        // Process.
        const lDefaultNamespace: string | null = lTextNode.defaultNamespace;

        // Evaluation.
        expect(lDefaultNamespace).toBeNull();
    });
});

Deno.test('TextNode.text', async (pContext) => {
    await pContext.step('Get text', () => {
        // Setup.
        const lTextNode: TextNode = new TextNode();
        const lText: string = 'Sample text';
        lTextNode.text = lText;

        // Process.
        const lTextResult: string = lTextNode.text;

        // Evaluation.
        expect(lTextResult).toBe(lText);
    });

    await pContext.step('Set text', () => {
        // Setup.
        const lTextNode: TextNode = new TextNode();
        const lText: string = 'Sample text';

        // Process.
        lTextNode.text = lText;

        // Evaluation.
        expect(lTextNode.text).toBe(lText);
    });
});

Deno.test('TextNode.clone()', async (pContext) => {
    await pContext.step('Clone text node', () => {
        // Setup.
        const lTextNode: TextNode = new TextNode();
        lTextNode.text = 'Sample text';

        // Process.
        const lClonedTextNode: TextNode = lTextNode.clone();

        // Evaluation.
        expect(lClonedTextNode).not.toBe(lTextNode);
        expect(lClonedTextNode.text).toBe(lTextNode.text);
    });
});

Deno.test('TextNode.equals()', async (pContext) => {
    await pContext.step('Equals same text', () => {
        // Setup.
        const lTextNode1: TextNode = new TextNode();
        lTextNode1.text = 'Sample text';

        const lTextNode2: TextNode = new TextNode();
        lTextNode2.text = 'Sample text';

        // Process.
        const lIsEqual: boolean = lTextNode1.equals(lTextNode2);

        // Evaluation.
        expect(lIsEqual).toBeTruthy();
    });

    await pContext.step('Not equals different text', () => {
        // Setup.
        const lTextNode1: TextNode = new TextNode();
        lTextNode1.text = 'Sample text';

        const lTextNode2: TextNode = new TextNode();
        lTextNode2.text = 'Different text';

        // Process.
        const lIsEqual: boolean = lTextNode1.equals(lTextNode2);

        // Evaluation.
        expect(lIsEqual).toBeFalsy();
    });

    await pContext.step('Not equals different node type', () => {
        // Setup.
        const lTextNode: TextNode = new TextNode();
        lTextNode.text = 'Sample text';

        const lDifferentNode: any = { text: 'Sample text' };

        // Process.
        const lIsEqual: boolean = lTextNode.equals(lDifferentNode);

        // Evaluation.
        expect(lIsEqual).toBeFalsy();
    });
});