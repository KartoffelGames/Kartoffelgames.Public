import { expect } from '@kartoffelgames/core-test';
import { XmlDocument } from '../source/document/xml-document.ts';
import type { BaseXmlNode } from '../source/node/base-xml-node.ts';
import { TextNode } from '../source/node/text-node.ts';
import { CommentNode } from '../source/node/comment-node.ts';

Deno.test('XmlDocument.defaultNamespace', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lNamespace: string = 'Namespace';
        const lXmlDocument: XmlDocument = new XmlDocument(lNamespace);

        // Process.
        const lNamespaceResult: string = lXmlDocument.defaultNamespace;

        // Evaluation.
        expect(lNamespaceResult).toBe(lNamespace);
    });
});

Deno.test('XmlDocument.body', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lXmlDocument: XmlDocument = new XmlDocument('');
        const lElement1: TextNode = new TextNode();
        const lElement2: TextNode = new TextNode();

        // Setup. Add Elements.
        lXmlDocument.appendChild(lElement1);
        lXmlDocument.appendChild(lElement2);

        // Process.
        const lBody: Array<BaseXmlNode> = lXmlDocument.body;

        // Evaluation.
        expect(lBody).toBeDeepEqual([lElement1, lElement2]);
    });
});

Deno.test('XmlDocument.document', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lXmlDocument: XmlDocument = new XmlDocument('');

        // Process.
        const lDocument: XmlDocument = lXmlDocument.document;

        // Evaluation.
        expect(lDocument).toBe(lXmlDocument);
    });
});

Deno.test('XmlDocument.clone()', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lXmlDocument: XmlDocument = new XmlDocument('');
        lXmlDocument.appendChild(new TextNode());

        // Process.
        const lClonedDocument: XmlDocument = lXmlDocument.clone();

        // Evaluation.
        expect(lClonedDocument).not.toBe(lXmlDocument);
        expect(lClonedDocument).toBeDeepEqual(lXmlDocument);
    });
});

Deno.test('XmlDocument.equals()', async (pContext) => {
    await pContext.step('Equals everything', () => {
        // Setup. Create body element.
        const lChildNode: TextNode = new TextNode();

        // Setup. Create document and add body element.
        const lXmlDocument: XmlDocument = new XmlDocument('');
        lXmlDocument.appendChild(lChildNode);

        // Setup. Clone parent element.
        const lClonedXmlDocument: XmlDocument = lXmlDocument.clone();

        // Process.
        const lIsEqual: boolean = lXmlDocument.equals(lClonedXmlDocument);

        // Evaluation.
        expect(lIsEqual).toBeTruthy();
    });

    await pContext.step('Different type', () => {
        // Setup. Text node.
        const lTextNode: TextNode = new TextNode();

        // Setup. Create document.
        const lXmlDocument: XmlDocument = new XmlDocument('');

        // Process.
        const lIsEqual: boolean = lXmlDocument.equals(lTextNode);

        // Evaluation.
        expect(lIsEqual).toBeFalsy();
    });

    await pContext.step('Different default namespace', () => {
        // Setup. Create document.
        const lXmlDocument: XmlDocument = new XmlDocument('Namespace');

        // Setup. Create document with different namespace.
        const lXmlDocument2: XmlDocument = new XmlDocument('WrongNamespace');

        // Process.
        const lIsEqual: boolean = lXmlDocument.equals(lXmlDocument2);

        // Evaluation.
        expect(lIsEqual).toBeFalsy();
    });

    await pContext.step('Different body element length', () => {
        // Setup. Create document.
        const lXmlDocument: XmlDocument = new XmlDocument('');
        lXmlDocument.appendChild(new CommentNode());

        // Setup. Create same document with different body count.
        const lXmlDocument2: XmlDocument = new XmlDocument('');
        lXmlDocument.appendChild(new CommentNode());
        lXmlDocument.appendChild(new CommentNode());

        // Process.
        const lIsEqual: boolean = lXmlDocument.equals(lXmlDocument2);

        // Evaluation.
        expect(lIsEqual).toBeFalsy();
    });

    await pContext.step('Different body element', () => {
        // Setup. Create document.
        const lXmlDocument: XmlDocument = new XmlDocument('');
        lXmlDocument.appendChild(new CommentNode());

        // Setup. Clone parent element.
        const lXmlDocument2: XmlDocument = new XmlDocument('');
        lXmlDocument2.appendChild(new TextNode());

        // Process.
        const lIsEqual: boolean = lXmlDocument.equals(lXmlDocument2);

        // Evaluation.
        expect(lIsEqual).toBeFalsy();
    });
});