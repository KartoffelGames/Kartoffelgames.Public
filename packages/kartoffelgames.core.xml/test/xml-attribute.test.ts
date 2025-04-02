import { expect } from '@kartoffelgames/core-test';
import { XmlAttribute } from '../source/attribute/xml-attribute.ts';
import { XmlElement } from '../source/node/xml-element.ts';

Deno.test('XmlAttribute.name', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lAttributeName: string = 'AttributeName';
        const lAttribute: XmlAttribute = new XmlAttribute(lAttributeName);

        // Process.
        const lAttributeNameResult: string = lAttribute.name;

        // Evaluation.
        expect(lAttributeNameResult).toBe(lAttributeName);
    });
});

Deno.test('XmlAttribute.namespace', async (pContext) => {
    await pContext.step('Namespace from Prefix', () => {
        // Setup. Specify values.
        const lNamespacePrefix: string = 'prefix';
        const lNamespace: string = 'Namespace';

        // Setup. Set xml attribute namespace with xml element.
        const lXmlElement: XmlElement = new XmlElement();
        lXmlElement.setAttribute(lNamespacePrefix, lNamespace, 'xmlns');
        const lAttribute: XmlAttribute = lXmlElement.setAttribute('Name', 'Value', lNamespacePrefix);

        // Process.
        const lAttributeNamespaceResult: string | null = lAttribute.namespace;

        // Evaluation.
        expect(lAttributeNamespaceResult).toBe(lNamespace);
    });

    await pContext.step('No Namespace', () => {
        // Setup.
        const lXmlElement: XmlElement = new XmlElement();
        const lAttribute: XmlAttribute = lXmlElement.setAttribute('Name', 'Value');

        // Process.
        const lAttributeNamespaceResult: string | null = lAttribute.namespace;

        // Evaluation.
        expect(lAttributeNamespaceResult).toBeNull();
    });
});

Deno.test('XmlAttribute.namespacePrefix', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lAttributeNamespacePrefix: string = 'NamespacePrefix';
        const lAttribute: XmlAttribute = new XmlAttribute('AttributeName', lAttributeNamespacePrefix);

        // Process.
        const lAttributeNamespacePrefixResult: string | null = lAttribute.namespacePrefix;

        // Evaluation.
        expect(lAttributeNamespacePrefixResult).toBe(lAttributeNamespacePrefix);
    });
});

Deno.test('XmlAttribute.qualifiedName', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup. Specify values.
        const lAttributeName: string = 'AttributeName';
        const lAttributeNamespacePrefix: string = 'NamespacePrefix';

        // Setup. Create attribute.
        const lAttribute: XmlAttribute = new XmlAttribute(lAttributeName, lAttributeNamespacePrefix);

        // Process.
        const lQualifierName: string = lAttribute.qualifiedName;

        // Evaluation.
        expect(lQualifierName).toBe(`${lAttributeNamespacePrefix}:${lAttributeName}`);
    });
});

Deno.test('XmlAttribute.seperator', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lSeperator: string = '-';
        const lAttribute: XmlAttribute = new XmlAttribute('AttributeName', 'NamespacePrefix', lSeperator);

        // Process.
        const lSeperatorResult: string = lAttribute.seperator;

        // Evaluation.
        expect(lSeperatorResult).toBe(lSeperator);
    });
});

Deno.test('XmlAttribute.value', async (pContext) => {
    await pContext.step('With value', () => {
        // Setup.
        const lValue: string = 'New Value';
        const lAttribute: XmlAttribute = new XmlAttribute('AttributeName');

        // Process.
        lAttribute.value = lValue;
        const lValueResult: string = lAttribute.value;

        // Evaluation.
        expect(lValueResult).toBe(lValue);
    });

    await pContext.step('Without value', () => {
        // Setup.
        const lAttribute: XmlAttribute = new XmlAttribute('AttributeName');

        // Process.
        const lValueResult: string = lAttribute.value;

        // Evaluation.
        expect(lValueResult).toBe('');
    });
});

Deno.test('XmlAttribute.valueList', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup. Specify values.
        const lValue: string = 'Value1-Value2';
        const lSeperator: string = '-';

        // Setup. Create attribute.
        const lAttribute: XmlAttribute = new XmlAttribute('AttributeName', 'NamespacePrefix', lSeperator);
        lAttribute.value = lValue;

        // Process.
        const lValueList: Array<string> = lAttribute.valueList;

        // Evaluation.
        expect(lValueList).toBeDeepEqual(['Value1', 'Value2']);
    });
});