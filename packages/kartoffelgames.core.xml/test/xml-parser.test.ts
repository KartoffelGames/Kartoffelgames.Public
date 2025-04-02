import { expect } from '@kartoffelgames/core-test';
import { CodeParserException } from '../../kartoffelgames.core.parser/source/index.ts';
import type { XmlAttribute } from '../source/attribute/xml-attribute.ts';
import type { XmlDocument } from '../source/document/xml-document.ts';
import type { CommentNode } from '../source/node/comment-node.ts';
import type { TextNode } from '../source/node/text-node.ts';
import type { XmlElement } from '../source/node/xml-element.ts';
import { XmlParser } from '../source/parser/xml-parser.ts';

Deno.test('XmlParser.removeComments', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lParser: XmlParser = new XmlParser();

        // Process.
        lParser.removeComments = true;

        // Evaluation.
        expect(lParser.removeComments).toBeTruthy();
    });
});

Deno.test('XmlParser.allowedAttributeCharacters', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lParser: XmlParser = new XmlParser();
        const lValue: string = 'de-.,.ß09';

        // Process.
        lParser.allowedAttributeCharacters = lValue;

        // Evaluation.
        expect(lParser.allowedAttributeCharacters).toBe([...new Set([...lValue.toLowerCase().split(''), ...lValue.toUpperCase().split('')])].join(''));
    });
});

Deno.test('XmlParser.allowedTagNameCharacters', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lParser: XmlParser = new XmlParser();
        const lValue: string = 'abcde.-;';

        // Process.
        lParser.allowedTagNameCharacters = lValue;

        // Evaluation.
        expect(lParser.allowedTagNameCharacters).toBe([...new Set([...lValue.toLowerCase().split(''), ...lValue.toUpperCase().split('')])].join(''));
    });
});

Deno.test('XmlParser.parse()', async (pContext) => {
    await pContext.step('Node parsing', async (pContext) => {
        await pContext.step('Single XmlElement', () => {
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

        await pContext.step('Void XmlElement', () => {
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

        await pContext.step('CommentNode', () => {
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

        await pContext.step('TextNode blank', () => {
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

        await pContext.step('TextNode quotation marks', () => {
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

    await pContext.step('Attribute', async (pContext) => {
        await pContext.step('Attribute without value', () => {
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

        await pContext.step('Attribute with value', () => {
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

    await pContext.step('Namespace Prefix', async (pContext) => {
        await pContext.step('Node Prefix', () => {
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

        await pContext.step('Attribute Prefix', () => {
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

    await pContext.step('Multiline values', async (pContext) => {
        await pContext.step('Normalize multiline attribute values', () => {
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

        await pContext.step('Multiline text node', () => {
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

    await pContext.step('Opening child with same tagname', () => {
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

    await pContext.step('Void child with same tagname', () => {
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

    await pContext.step('Mixed content', () => {
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

    await pContext.step('Adjust parser with new settings', () => {
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
        expect(lFailingFunction).toThrow(CodeParserException);
    });

    await pContext.step('Same content twice', () => {
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

    await pContext.step('Without any content', () => {
        // Setup. Specify values.
        const lParser: XmlParser = new XmlParser();
        const lXmlString: string = ``;

        // Process.
        const lDocument: XmlDocument = lParser.parse(lXmlString);

        // Evaluation.
        expect(lDocument.body).toHaveLength(0);
    });
});

Deno.test('XmlParser--Functionality: Parser error', async (pContext) => {
    await pContext.step('Fail attribute parsing', () => {
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

    await pContext.step('Unexpected closing tag', () => {
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

    await pContext.step('Different closing namespace', () => {
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

    await pContext.step(`Can't close tag`, () => {
        // Setup.
        const lClosingNode: string = 'nodename';
        const lXmlString: string = `<${lClosingNode}>`;
        const lParser: XmlParser = new XmlParser();

        // Process.
        const lFailingFunction = () => {
            lParser.parse(lXmlString);
        };

        // Evaluation.
        expect(lFailingFunction).toThrow(/Unexpected token ">"/);
    });
});

Deno.test('XmlParser--Functionality: Settings', async (pContext) => {
    await pContext.step('Remove comment in document', () => {
        // Setup.
        const lXmlString: string = `<!-- Comment -->`;
        const lParser: XmlParser = new XmlParser();
        lParser.removeComments = true;

        // Process.
        const lParsedDocument: XmlDocument = lParser.parse(lXmlString);

        // Evaluation.
        expect(lParsedDocument.body).toHaveLength(0);
    });

    await pContext.step('Remove comment in xml tag', () => {
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

    await pContext.step('Restrict attribute characters', () => {
        // Setup.
        const lNotAllowedCharacters: string = 'notAllowed';
        const lXmlString: string = `<node ${lNotAllowedCharacters}/>`;
        const lParser: XmlParser = new XmlParser();
        lParser.allowedAttributeCharacters = 'abc';

        // Process.
        const lFailingFunction = () => {
            lParser.parse(lXmlString);
        };

        // Evaluation.
        expect(lFailingFunction).toThrow(`Attribute contains illegal characters: "${lNotAllowedCharacters}"`);
    });

    await pContext.step('Restrict tagname characters', () => {
        // Setup.
        const lNotAllowedCharacters: string = 'notAllowed';
        const lXmlString: string = `<${lNotAllowedCharacters}/>`;
        const lParser: XmlParser = new XmlParser();
        lParser.allowedTagNameCharacters = 'abc';

        // Process.
        const lFailingFunction = () => {
            lParser.parse(lXmlString);
        };

        // Evaluation.
        expect(lFailingFunction).toThrow(`Tagname contains illegal characters: "${lNotAllowedCharacters}"`);
    });
});