import { Exception } from '@kartoffelgames/core';
import { expect } from '@kartoffelgames/core-test';
import { ParserException } from '@kartoffelgames/core-parser';
import { describe, it } from '@std/testing/bdd';
import { XmlAttribute } from '../source/attribute/xml-attribute.ts';
import { XmlDocument } from '../source/document/xml-document.ts';
import { CommentNode } from '../source/node/comment-node.ts';
import { TextNode } from '../source/node/text-node.ts';
import { XmlElement } from '../source/node/xml-element.ts';
import { XmlParser } from '../source/parser/xml-parser.ts';

describe('XmlParser', () => {
    it('Property: removeComments', () => {
        // Setup.
        const lParser: XmlParser = new XmlParser();

        // Process.
        lParser.removeComments = true;

        // Evaluation.
        expect(lParser.removeComments).toBeTruthy();
    });

    it('Property: allowedAttributeCharacters', () => {
        // Setup.
        const lParser: XmlParser = new XmlParser();
        const lValue: string = 'de-.,.ß09';

        // Process.
        lParser.allowedAttributeCharacters = lValue;

        // Evaluation.
        expect(lParser.allowedAttributeCharacters).toBe([...new Set([...lValue.toLowerCase().split(''), ...lValue.toUpperCase().split('')])].join(''));
    });

    it('Property: allowedTagNameCharacters', () => {
        // Setup.
        const lParser: XmlParser = new XmlParser();
        const lValue: string = 'abcde.-;';

        // Process.
        lParser.allowedTagNameCharacters = lValue;

        // Evaluation.
        expect(lParser.allowedTagNameCharacters).toBe([...new Set([...lValue.toLowerCase().split(''), ...lValue.toUpperCase().split('')])].join(''));
    });

    describe('Method: parse', () => {
        describe('-- Node parsing', () => {
            it('-- Single XmlElement', () => {
                // Setup. Specify values.
                const lTagName: string = 'SingleNode';

                // Setup. Parse XML String.
                const lXmlString: string = `<${lTagName}></${lTagName}>`;
                const lParser: XmlParser = new XmlParser();

                // Process.
                const lXmlResult: XmlDocument = lParser.parse(lXmlString);
                const lXmlRoot: XmlElement = <XmlElement>lXmlResult.body[0];

                // Evaluation.
                expect(lXmlResult.body).toHaveLength(1);
                expect(lXmlRoot.tagName).toBe(lTagName);
                expect(lXmlRoot.childList).toHaveLength(0);
            });

            it('-- Void XmlElement', () => {
                // Setup. Specify values.
                const lTagName: string = 'voidnode';

                // Setup. Parse XML String.
                const lXmlString: string = `<${lTagName} />`;
                const lParser: XmlParser = new XmlParser();

                // Process.
                const lXmlResult: XmlDocument = lParser.parse(lXmlString);
                const lXmlRoot: XmlElement = <XmlElement>lXmlResult.body[0];

                // Evaluation.
                expect(lXmlResult.body).toHaveLength(1);
                expect(lXmlRoot.tagName).toBe(lTagName);
                expect(lXmlRoot.childList).toHaveLength(0);
            });

            it('-- CommentNode', () => {
                // Setup. Specify values.
                const lCommentText: string = 'CommentText';

                // Setup. Parse XML String.
                const lXmlString: string = `<!--${lCommentText}-->`;
                const lParser: XmlParser = new XmlParser();

                // Process.
                const lXmlResult: XmlDocument = lParser.parse(lXmlString);
                const lXmlRoot: CommentNode = <CommentNode>lXmlResult.body[0];

                // Evaluation.
                expect(lXmlResult.body).toHaveLength(1);
                expect(lXmlRoot.text).toBe(lCommentText);
            });

            it('-- TextNode blank', () => {
                // Setup. Specify values.
                const lText: string = 'TextNodeText';

                // Setup. Parse XML String.
                const lXmlString: string = lText;
                const lParser: XmlParser = new XmlParser();

                // Process.
                const lXmlResult: XmlDocument = lParser.parse(lXmlString);
                const lXmlRoot: TextNode = <TextNode>lXmlResult.body[0];

                // Evaluation.
                expect(lXmlResult.body).toHaveLength(1);
                expect(lXmlRoot.text).toBe(lText);
            });

            it('-- TextNode quotation marks', () => {
                // Setup. Specify values.
                const lText: string = 'TextNodeText';
                const lTextWithHyphen: string = `"${lText}"`;

                // Setup. Parse XML String.
                const lXmlString: string = lTextWithHyphen;
                const lParser: XmlParser = new XmlParser();

                // Process.
                const lXmlResult: XmlDocument = lParser.parse(lXmlString);
                const lXmlRoot: TextNode = <TextNode>lXmlResult.body[0];

                // Evaluation.
                expect(lXmlResult.body).toHaveLength(1);
                expect(lXmlRoot.text).toBe(lText);
            });
        });

        describe('-- Attribute', () => {
            it('-- Attribute without value', () => {
                // Setup. Specify values.
                const lAttributeName: string = 'attrname';

                // Setup. Parse XML String.
                const lXmlString: string = `<singlenode ${lAttributeName} />`;
                const lParser: XmlParser = new XmlParser();
                const lXmlRoot: XmlElement = <XmlElement>lParser.parse(lXmlString).body[0];

                // Process.        
                const lAttributeList: Array<XmlAttribute> = lXmlRoot.attributeList;
                const lAttribute: XmlAttribute = lAttributeList[0];

                // Evaluation.
                expect(lAttributeList).toHaveLength(1);
                expect(lAttribute.name).toBe(lAttributeName);
                expect(lAttribute.value).toBe('');
            });

            it('-- Attribute with value', () => {
                // Setup. Specify values.
                const lAttributeName: string = 'attrname';
                const lAttributeValue: string = 'attrvalue';

                // Setup. Parse XML String.
                const lXmlString: string = `<singlenode ${lAttributeName}="${lAttributeValue}" />`;
                const lParser: XmlParser = new XmlParser();
                const lXmlRoot: XmlElement = <XmlElement>lParser.parse(lXmlString).body[0];

                // Process.            
                const lAttributeList: Array<XmlAttribute> = lXmlRoot.attributeList;
                const lAttribute: XmlAttribute = lAttributeList[0];

                // Evaluation.
                expect(lAttributeList).toHaveLength(1);
                expect(lAttribute.name).toBe(lAttributeName);
                expect(lAttribute.value).toBe(lAttributeValue);
            });
        });

        describe('-- Namespace Prefix', () => {
            it('-- Node Preifx', () => {
                // Setup. Specify values.
                const lNamespacePrefix: string = 't';

                // Setup. Parse XML String.
                const lXmlString: string = `<${lNamespacePrefix}:node />`;
                const lParser: XmlParser = new XmlParser();
                const lXmlResult: XmlDocument = lParser.parse(lXmlString);

                // Process.            
                const lXmlRoot: XmlElement = <XmlElement>lXmlResult.body[0];

                // Evaluation.
                expect(lXmlRoot.namespacePrefix).toBe(lNamespacePrefix);
            });

            it('-- Attribute Prefix', () => {
                // Setup. Specify values.
                const lNamespacePrefix: string = 't';
                const lNamespacedAttributeName: string = 'namespacedattr';

                // Setup. Parse XML String.
                const lXmlString: string = `<node ${lNamespacePrefix}:${lNamespacedAttributeName} />`;
                const lParser: XmlParser = new XmlParser();
                const lXmlElement: XmlElement = <XmlElement>lParser.parse(lXmlString).body[0];

                // Process.
                const lNamespacedAttribute: XmlAttribute | undefined = lXmlElement.getAttribute(`${lNamespacePrefix}:${lNamespacedAttributeName}`);

                // Evaluation.
                expect(lNamespacedAttribute?.namespacePrefix).toBe(lNamespacePrefix);
            });
        });

        describe('-- Multiline values', () => {
            it('-- Normalize multiline attribute values', () => {
                // Setup. Specify values.
                const lNamespacedAttributeName: string = 'namespacedattr';
                const lAttributeValue: string = `Multi
                                             Line`;

                // Setup. Parse XML String.
                const lXmlString: string = `<node ${lNamespacedAttributeName}="${lAttributeValue}" />`;
                const lParser: XmlParser = new XmlParser();
                const lXmlElement: XmlElement = <XmlElement>lParser.parse(lXmlString).body[0];

                // Process.
                const lNamespacedAttribute: XmlAttribute | undefined = lXmlElement.getAttribute(lNamespacedAttributeName);

                // Evaluation.
                expect(lNamespacedAttribute?.value).toBe(lAttributeValue);
            });

            it('-- Multiline text node', () => {
                // Setup. Specify values.
                const lText: string = `Multi
                                   Line`;

                // Setup. Parse XML String.
                const lXmlString: string = `<node>${lText}</node>`;
                const lParser: XmlParser = new XmlParser();
                const lXmlElement: XmlElement = <XmlElement>lParser.parse(lXmlString).body[0];

                // Process.
                const lTextNode: TextNode = <TextNode>lXmlElement.childList[0];

                // Evaluation.
                expect(lTextNode.text).toBe(lText);
            });
        });

        it('-- Opening child with same tagname', () => {
            // Setup. Specify values.
            const lTagName: string = 'Tagname';

            // Setup. Parse XML String.
            const lXmlString: string = `<${lTagName}><${lTagName}></${lTagName}></${lTagName}>`;
            const lParser: XmlParser = new XmlParser();

            // Process.
            const lXmlResult: XmlDocument = lParser.parse(lXmlString);
            const lParent: XmlElement = <XmlElement>lXmlResult.body[0];
            const lChild: XmlElement = <XmlElement>lParent.childList[0];

            // Evaluation. Check parent.
            expect(lParent.tagName).toBe(lTagName);
            expect(lParent.childList).toHaveLength(1);

            // Evaluation. Check child.
            expect(lChild.tagName).toBe(lTagName);
            expect(lChild.childList).toHaveLength(0);
        });

        it('-- Void child with same tagname', () => {
            // Setup. Specify values.
            const lTagName: string = 'Tagname';

            // Setup. Parse XML String.
            const lXmlString: string = `<${lTagName}><${lTagName} /></${lTagName}>`;
            const lParser: XmlParser = new XmlParser();

            // Process.
            const lXmlResult: XmlDocument = lParser.parse(lXmlString);
            const lParent: XmlElement = <XmlElement>lXmlResult.body[0];
            const lChild: XmlElement = <XmlElement>lParent.childList[0];

            // Evaluation. Check parent.
            expect(lParent.tagName).toBe(lTagName);
            expect(lParent.childList).toHaveLength(1);

            // Evaluation. Check child.
            expect(lChild.tagName).toBe(lTagName);
            expect(lChild.childList).toHaveLength(0);
        });

        it('-- Mixed content', () => {
            // Setup. Specify values.
            const lBlankText: string = 'TextNodeText';
            const lQuotationText: string = '"with <and stuff> quotation"';
            const lQuotationNodeText: string = '"My Content"';
            const lBlankNodeText: string = 'My blank content';
            const lText: string = `${lBlankText}${lQuotationText}<quotation>${lQuotationNodeText}</quotation><blank>${lBlankNodeText}</blank>`;

            // Setup. Parse XML String.
            const lXmlString: string = lText;
            const lParser: XmlParser = new XmlParser();

            // Process.
            const lXmlResult: XmlDocument = lParser.parse(lXmlString);

            // Process read contents.
            const lBlankTextNode: TextNode = <TextNode>lXmlResult.body[0];
            const lQuotationTextNode: TextNode = <TextNode>lXmlResult.body[1];
            const lQuotationXmlNode: XmlElement = <XmlElement>lXmlResult.body[2];
            const lQuotationXmlNodeTextNode: TextNode = <TextNode>lQuotationXmlNode.childList[0];
            const lBlankXmlNode: XmlElement = <XmlElement>lXmlResult.body[3];
            const lBlankXmlNodeTextNode: TextNode = <TextNode>lBlankXmlNode.childList[0];

            // Evaluation.
            expect(lXmlResult.body).toHaveLength(4);
            expect(lBlankTextNode.text).toBe(lBlankText);
            expect(lQuotationTextNode.text).toBe(lQuotationText.replaceAll('"', ''));
            expect(lQuotationXmlNodeTextNode.text).toBe(lQuotationNodeText.replaceAll('"', ''));
            expect(lBlankXmlNodeTextNode.text).toBe(lBlankNodeText);
        });

        it('Adjust parser with new settings', () => {
            // Setup.
            const lXmlString: string = `<node allowed />`;
            const lParser: XmlParser = new XmlParser();

            // Process.
            const lRightFunction = () => {
                lParser.allowedAttributeCharacters = 'alowed';
                lParser.parse(lXmlString);
            };
            const lFailingFunction = () => {
                lParser.allowedAttributeCharacters = 'aloed';
                lParser.parse(lXmlString);
            };

            // Evaluation.
            expect(lRightFunction).not.toThrow();
            expect(lFailingFunction).toThrow(Exception);
        });

        it('Same content twice', () => {
            // Setup. Specify values.
            const lParser: XmlParser = new XmlParser();
            const lXmlString: string = `<node>My text</node>My text`;

            // Process.
            const lDocumentFirstRun: XmlDocument = lParser.parse(lXmlString);
            const lDocumentSecondRun: XmlDocument = lParser.parse(lXmlString);

            // Evaluation.
            expect(lDocumentFirstRun.body).toHaveLength(2);
            expect(lDocumentSecondRun.body).toHaveLength(2);
        });

        it('-- Without any content', () => {
            // Setup. Specify values.
            const lParser: XmlParser = new XmlParser();
            const lXmlString: string = ``;

            // Process.
            const lDocument: XmlDocument = lParser.parse(lXmlString);

            // Evaluation.
            expect(lDocument.body).toHaveLength(0);
        });
    });

    describe('Functionality: Parser error', () => {
        it('-- Fail attribute parsing', () => {
            // Setup.
            const lWrongAttribute: string = '="noneclosing';
            const lXmlString: string = `<node attr${lWrongAttribute} />`;
            const lParser: XmlParser = new XmlParser();

            // Process.
            const lFailingFunction = () => {
                lParser.parse(lXmlString);
            };

            // Evaluation.
            expect(lFailingFunction).toThrow(/noneclosing/);
        });

        it('-- Unexpected closing tag', () => {
            // Setup.
            const lClosingNode: string = 'unexpectedclosing';
            const lXmlString: string = `<node></${lClosingNode}></node>`;
            const lParser: XmlParser = new XmlParser();

            // Process.
            const lFailingFunction = () => {
                lParser.parse(lXmlString);
            };

            // Evaluation.
            expect(lFailingFunction).toThrow(/unexpectedclosing/);
        });

        it('-- Different closing namespace', () => {
            // Setup.
            const lXmlString: string = `<t:node></d:node>`;
            const lParser: XmlParser = new XmlParser();

            // Process.
            const lFailingFunction = () => {
                lParser.parse(lXmlString);
            };

            // Evaluation.
            expect(lFailingFunction).toThrow(/namespace/);
        });

        it(`-- Can't close tag`, () => {
            // Setup.
            const lClosingNode: string = 'nodename';
            const lXmlString: string = `<${lClosingNode}>`;
            const lParser: XmlParser = new XmlParser();

            // Process.
            const lFailingFunction = () => {
                lParser.parse(lXmlString);
            };

            // Evaluation.
            expect(lFailingFunction).toThrow(/Tokens could not be parsed./);
        });
    });

    describe('Functionality: Settings', () => {
        it('-- Remove comment in document', () => {
            // Setup.
            const lXmlString: string = `<!-- Comment -->`;
            const lParser: XmlParser = new XmlParser();
            lParser.removeComments = true;

            // Process.
            const lParsedDocument: XmlDocument = lParser.parse(lXmlString);

            // Evaluation.
            expect(lParsedDocument.body).toHaveLength(0);
        });

        it('-- Remove comment in xml tag', () => {
            // Setup.
            const lXmlString: string = `<node><!-- Comment --></node>`;
            const lParser: XmlParser = new XmlParser();
            lParser.removeComments = true;

            // Process.
            const lParsedDocument: XmlDocument = lParser.parse(lXmlString);
            const lParsedXmlNode: XmlElement = <XmlElement>lParsedDocument.body[0];

            // Evaluation.
            expect(lParsedXmlNode.childList).toHaveLength(0);
        });

        it('-- Restrict attribute characters', () => {
            // Setup.
            const lXmlString: string = `<node notAllowed />`;
            const lParser: XmlParser = new XmlParser();
            lParser.allowedAttributeCharacters = 'abc';

            // Process.
            const lFailingFunction = () => {
                lParser.parse(lXmlString);
            };

            // Evaluation.
            expect(lFailingFunction).toThrow(Exception);
        });

        it('-- Restrict tagname characters', () => {
            // Setup.
            const lXmlString: string = `<notallowed/>`;
            const lParser: XmlParser = new XmlParser();
            lParser.allowedTagNameCharacters = 'abc';

            // Process.
            const lFailingFunction = () => {
                lParser.parse(lXmlString);
            };

            // Evaluation.
            expect(lFailingFunction).toThrow(Exception);
        });
    });
});