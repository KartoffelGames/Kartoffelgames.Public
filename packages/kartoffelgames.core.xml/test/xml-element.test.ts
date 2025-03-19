import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { XmlAttribute } from '../source/attribute/xml-attribute.ts';
import { TextNode } from '../source/node/text-node.ts';
import { XmlElement } from '../source/node/xml-element.ts';
import { BaseXmlNode } from "../source/index.ts";

describe('XmlElement', () => {
    it('Property: attributeList', () => {
        // Setup.
        const lXmlElement: XmlElement = new XmlElement();
        const lAttribute: XmlAttribute = lXmlElement.setAttribute('name', 'value');

        // Process.
        const lAttributeList: Array<XmlAttribute> = lXmlElement.attributeList;

        // Evaluation.
        expect(lAttributeList).toHaveLength(1);
        expect(lAttributeList[0]).toBe(lAttribute);
    });

    it('Property: childList', () => {
        // Setup.
        const lXmlElement: XmlElement = new XmlElement();
        const lChildNode: TextNode = new TextNode();
        lXmlElement.appendChild(lChildNode);

        // Process.
        const lChildList: Array<BaseXmlNode> = lXmlElement.childList;

        // Evaluation.
        expect(lChildList).toHaveLength(1);
        expect(lChildList[0]).toBe(lChildNode);
    });

    it('Property: defaultNamespace', () => {
        // Setup.
        const lXmlElement: XmlElement = new XmlElement();
        lXmlElement.setAttribute('xmlns', 'http://example.com');

        // Process.
        const lDefaultNamespace: string | null = lXmlElement.defaultNamespace;

        // Evaluation.
        expect(lDefaultNamespace).toBe('http://example.com');
    });

    it('Property: namespace', () => {
        // Setup.
        const lXmlElement: XmlElement = new XmlElement();
        lXmlElement.setAttribute('xmlns', 'http://example.com');

        // Process.
        const lNamespace: string | null = lXmlElement.namespace;

        // Evaluation.
        expect(lNamespace).toBe('http://example.com');
    });

    it('Property: namespacePrefix', () => {
        // Setup.
        const lXmlElement: XmlElement = new XmlElement();
        lXmlElement.namespacePrefix = 'prefix';

        // Process.
        const lNamespacePrefix: string | null = lXmlElement.namespacePrefix;

        // Evaluation.
        expect(lNamespacePrefix).toBe('prefix');
    });

    it('Property: qualifiedTagName', () => {
        // Setup.
        const lXmlElement: XmlElement = new XmlElement();
        lXmlElement.namespacePrefix = 'prefix';
        lXmlElement.tagName = 'tag';

        // Process.
        const lQualifiedTagName: string = lXmlElement.qualifiedTagName;

        // Evaluation.
        expect(lQualifiedTagName).toBe('prefix:tag');
    });

    it('Property: tagName', () => {
        // Setup.
        const lXmlElement: XmlElement = new XmlElement();
        lXmlElement.tagName = 'tag';

        // Process.
        const lTagName: string = lXmlElement.tagName;

        // Evaluation.
        expect(lTagName).toBe('tag');
    });

    it('Method: appendChild', () => {
        // Setup.
        const lXmlElement: XmlElement = new XmlElement();
        const lChildNode: TextNode = new TextNode();

        // Process.
        lXmlElement.appendChild(lChildNode);

        // Evaluation.
        expect(lXmlElement.childList).toHaveLength(1);
        expect(lXmlElement.childList[0]).toBe(lChildNode);
    });

    it('Method: clone', () => {
        // Setup.
        const lXmlElement: XmlElement = new XmlElement();
        lXmlElement.tagName = 'tag';
        lXmlElement.namespacePrefix = 'prefix';
        lXmlElement.setAttribute('name', 'value');
        lXmlElement.appendChild(new TextNode());

        // Process.
        const lClonedElement: XmlElement = lXmlElement.clone();

        // Evaluation.
        expect(lClonedElement).not.toBe(lXmlElement);
        expect(lClonedElement.tagName).toBe(lXmlElement.tagName);
        expect(lClonedElement.namespacePrefix).toBe(lXmlElement.namespacePrefix);
        expect(lClonedElement.attributeList).toHaveLength(1);
        expect(lClonedElement.childList).toHaveLength(1);
    });

    describe('Method: equals', ()=>{
        it('-- Default', () => {
            // Setup.
            const lXmlElement1: XmlElement = new XmlElement();
            lXmlElement1.tagName = 'tag';
            lXmlElement1.namespacePrefix = 'prefix';
            lXmlElement1.setAttribute('name', 'value');
            lXmlElement1.appendChild(new TextNode());
    
            const lXmlElement2: XmlElement = lXmlElement1.clone();
    
            // Process.
            const lIsEqual: boolean = lXmlElement1.equals(lXmlElement2);
    
            // Evaluation.
            expect(lIsEqual).toBeTruthy();
        });


        it('-- Equals with different tag name', () => {
            // Setup.
            const lXmlElement1: XmlElement = new XmlElement();
            lXmlElement1.tagName = 'tag1';
    
            const lXmlElement2: XmlElement = new XmlElement();
            lXmlElement2.tagName = 'tag2';
    
            // Process.
            const lIsEqual: boolean = lXmlElement1.equals(lXmlElement2);
    
            // Evaluation.
            expect(lIsEqual).toBeFalsy();
        });
    
        it('-- Equals with different attribute length', () => {
            // Setup.
            const lXmlElement1: XmlElement = new XmlElement();
            lXmlElement1.setAttribute('name', 'value');
    
            const lXmlElement2: XmlElement = new XmlElement();
    
            // Process.
            const lIsEqual: boolean = lXmlElement1.equals(lXmlElement2);
    
            // Evaluation.
            expect(lIsEqual).toBeFalsy();
        });
    
        it('-- Equals with different attribute value', () => {
            // Setup.
            const lXmlElement1: XmlElement = new XmlElement();
            lXmlElement1.setAttribute('name', 'value1');
    
            const lXmlElement2: XmlElement = new XmlElement();
            lXmlElement2.setAttribute('name', 'value2');
    
            // Process.
            const lIsEqual: boolean = lXmlElement1.equals(lXmlElement2);
    
            // Evaluation.
            expect(lIsEqual).toBeFalsy();
        });
    
        it('-- Equals with different child length', () => {
            // Setup.
            const lXmlElement1: XmlElement = new XmlElement();
            lXmlElement1.appendChild(new TextNode());
    
            const lXmlElement2: XmlElement = new XmlElement();
    
            // Process.
            const lIsEqual: boolean = lXmlElement1.equals(lXmlElement2);
    
            // Evaluation.
            expect(lIsEqual).toBeFalsy();
        });
    
        it('-- Equals with different child nodes', () => {
            // Setup.
            const lXmlElement1: XmlElement = new XmlElement();
            lXmlElement1.appendChild(new TextNode());
    
            const lXmlElement2: XmlElement = new XmlElement();
            lXmlElement2.appendChild(new XmlElement());
    
            // Process.
            const lIsEqual: boolean = lXmlElement1.equals(lXmlElement2);
    
            // Evaluation.
            expect(lIsEqual).toBeFalsy();
        });
    })
    
    it('Method: getAttribute', () => {
        // Setup.
        const lXmlElement: XmlElement = new XmlElement();
        lXmlElement.setAttribute('name', 'value');

        // Process.
        const lAttribute: XmlAttribute | undefined = lXmlElement.getAttribute('name');

        // Evaluation.
        expect(lAttribute).not.toBeUndefined();
        expect(lAttribute!.value).toBe('value');
    });

    describe('Method: getNamespace', () => {
        it('-- Default', () => {
            // Setup.
            const lXmlElement: XmlElement = new XmlElement();
            lXmlElement.setAttribute('xmlns', 'http://example.com');

            // Process.
            const lNamespace: string | null = lXmlElement.getNamespace();

            // Evaluation.
            expect(lNamespace).toBe('http://example.com');
        });

        it('-- GetNamespace with prefix', () => {
            // Setup.
            const lXmlElement: XmlElement = new XmlElement();
            lXmlElement.namespacePrefix = 'prefix';
            lXmlElement.setAttribute('prefix', 'http://example.com', 'xmlns');

            // Process.
            const lNamespace: string | null = lXmlElement.getNamespace('prefix');

            // Evaluation.
            expect(lNamespace).toBe('http://example.com');
        });

        it('-- GetNamespace from parent', () => {
            // Setup.
            const lParentElement: XmlElement = new XmlElement();
            lParentElement.setAttribute('prefix', 'http://example.com', 'xmlns');

            const lChildElement: XmlElement = new XmlElement();
            lParentElement.appendChild(lChildElement);

            // Process.
            const lNamespace: string | null = lChildElement.getNamespace('prefix');

            // Evaluation.
            expect(lNamespace).toBe('http://example.com');
        });
    });

    it('Method: removeAttribute', () => {
        // Setup.
        const lXmlElement: XmlElement = new XmlElement();
        lXmlElement.setAttribute('name', 'value');

        // Process.
        const lRemoved: boolean = lXmlElement.removeAttribute('name');

        // Evaluation.
        expect(lRemoved).toBeTruthy();
        expect(lXmlElement.attributeList).toHaveLength(0);
    });

    describe('Method: removeChild', () => {
        it('-- Default', () => {
            // Setup.
            const lXmlElement: XmlElement = new XmlElement();
            const lChildNode: TextNode = new TextNode();
            lXmlElement.appendChild(lChildNode);

            // Process.
            const lRemovedChild: BaseXmlNode | undefined = lXmlElement.removeChild(lChildNode);

            // Evaluation.
            expect(lRemovedChild).toBe(lChildNode);
            expect(lXmlElement.childList).toHaveLength(0);
        });

        it('Method: removeChild from parent', () => {
            // Setup.
            const lParentElement: XmlElement = new XmlElement();
            const lChildElement: XmlElement = new XmlElement();
            lParentElement.appendChild(lChildElement);

            // Process.
            const lRemovedChild: BaseXmlNode | undefined = lParentElement.removeChild(lChildElement);

            // Evaluation.
            expect(lRemovedChild).toBe(lChildElement);
            expect(lParentElement.childList).toHaveLength(0);
        });
    });

    describe('Method: setAttribute', () => {
        it('-- Set attribute', () => {
            // Setup.
            const lXmlElement: XmlElement = new XmlElement();

            // Process.
            const lAttribute: XmlAttribute = lXmlElement.setAttribute('name', 'value');

            // Evaluation.
            expect(lXmlElement.attributeList).toHaveLength(1);
            expect(lAttribute.value).toBe('value');
        });

        it('-- Set attribute with namespace prefix', () => {
            // Setup.
            const lXmlElement: XmlElement = new XmlElement();

            // Process.
            const lAttribute: XmlAttribute = lXmlElement.setAttribute('name', 'value', 'prefix');

            // Evaluation.
            expect(lXmlElement.attributeList).toHaveLength(1);
            expect(lAttribute.value).toBe('value');
            expect(lAttribute.namespacePrefix).toBe('prefix');
        });

        it('-- SetAttribute with existing attribute', () => {
            // Setup.
            const lXmlElement: XmlElement = new XmlElement();
            lXmlElement.setAttribute('name', 'value1');
    
            // Process.
            const lAttribute: XmlAttribute = lXmlElement.setAttribute('name', 'value2');
    
            // Evaluation.
            expect(lXmlElement.attributeList).toHaveLength(1);
            expect(lAttribute.value).toBe('value2');
        });
    });
});