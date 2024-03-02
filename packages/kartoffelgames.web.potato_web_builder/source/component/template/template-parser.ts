import { Exception } from '@kartoffelgames/core.data';
import { CodeParser, Lexer } from '@kartoffelgames/core.parser';
import { CommentNode, TextNode, XmlDocument, XmlElement } from '@kartoffelgames/core.xml';

// TODO: Build new parser from scratch. 

/**
 * XML parser for parsing template strings.
 */
export class TemplateParser {
    private mParser: CodeParser<PwbTemplateToken, XmlDocument> | null;

    /**
     * Constructor.
     * Set new setting for parsing attributes with special characters and remove comments.
     */
    public constructor() {
        this.mParser = null;
    }

    /**
     * 
     * @param pText - Xml based code compatible to this parser.
     * 
     * @returns a new XmlDocument 
     */
    public parse(pText: string): XmlDocument {
        if (!this.mParser) {
            const lLexer: Lexer<PwbTemplateToken> = this.createLexer();
            this.mParser = this.createParser(lLexer);
        }

        return this.mParser.parse(pText);
    }

    /**
     * Recreate lexer with applied config.
     */
    private createLexer(): Lexer<PwbTemplateToken> {
        const lLexer: Lexer<PwbTemplateToken> = new Lexer<PwbTemplateToken>();
        lLexer.validWhitespaces = ' \n';
        lLexer.trimWhitespace = true;

        // Identifier
        lLexer.addTokenTemplate('NamespaceDelimiter', { pattern: { regex: /:/, type: XmlToken.NamespaceDelimiter }, specificity: 1 });
        lLexer.addTokenTemplate('Identifier', { pattern: { regex: /[^<>\s\n/:="]+/, type: XmlToken.Identifier }, specificity: 1 });
        lLexer.addTokenTemplate('ExplicitValue', { pattern: { regex: /"[^"]*"/, type: XmlToken.Value }, specificity: 1 });

        // Brackets.
        lLexer.addTokenPattern({ pattern: { regex: /<!--.*?-->/, type: XmlToken.Comment }, specificity: 0 });
        lLexer.addTokenPattern({
            pattern: {
                start: {
                    regex: /<\//,
                    type: XmlToken.OpenClosingBracket
                },
                end: {
                    regex: />/,
                    type: XmlToken.CloseBracket
                }
            }, specificity: 1
        }, () => {
            lLexer.useTokenTemplate('NamespaceDelimiter');
            lLexer.useTokenTemplate('Identifier');
        });
        lLexer.addTokenPattern({
            pattern: {
                start: {
                    regex: /</,
                    type: XmlToken.OpenBracket
                },
                end: {
                    regex: /(?<closeClosingBracket>\/>)|(?<closeBracket>>)/,
                    type: {
                        closeClosingBracket: XmlToken.CloseClosingBracket,
                        closeBracket: XmlToken.CloseBracket
                    }
                }
            }, specificity: 2
        }, () => {
            lLexer.addTokenPattern({ pattern: { regex: /=/, type: XmlToken.Assignment }, specificity: 1 });
            lLexer.useTokenTemplate('NamespaceDelimiter');
            lLexer.useTokenTemplate('Identifier');
            lLexer.useTokenTemplate('ExplicitValue');
        });

        // Value
        lLexer.useTokenTemplate('ExplicitValue', 3);
        lLexer.addTokenPattern({ pattern: { regex: /[^<>"]+/, type: XmlToken.Value }, specificity: 4 });

        return lLexer;
    }

    /**
     * Create new code parser.
     * Apply new set config.
     * 
     * @param pLexer - Lexer with applied config.
     */
    private createParser(pLexer: Lexer<XmlToken>): CodeParser<XmlToken, XmlDocument> {
        const lParser: CodeParser<XmlToken, XmlDocument> = new CodeParser<XmlToken, XmlDocument>(pLexer);

        // Attribute graph.
        type AttributeParseData = {
            namespace?: { name: string; };
            name: string,
            value?: { value: string; };
        };
        lParser.defineGraphPart('attribute',
            lParser.graph()
                .optional('namespace',
                    lParser.graph().single('name', XmlToken.Identifier).single(XmlToken.NamespaceDelimiter)
                )
                .single('name', XmlToken.Identifier)
                .optional('value',
                    lParser.graph().single(XmlToken.Assignment).single('value', XmlToken.Value)
                ),
            (pData: AttributeParseData): AttributeInformation => {
                // Validate tag name.
                const lRegexNameCheck: RegExp = new RegExp(`^[${this.escapeRegExp(this.mConfig.allowedAttributeCharacters)}]+$`);
                if (!lRegexNameCheck.test(pData.name)) {
                    throw new Exception(`Attribute contains illegal characters: "${pData.name}"`, this);
                }

                return {
                    namespacePrefix: pData.namespace?.name ?? null,
                    name: pData.name,
                    value: pData.value?.value.substring(1, pData.value.value.length - 1) ?? ''
                };
            }
        );

        // Content data.
        type ContentData = {
            value: { text: string; } | XmlElement | { comment: string; };
        };
        lParser.defineGraphPart('content',
            lParser.graph().branch('value', [
                lParser.graph().single('comment', XmlToken.Comment),
                lParser.graph().single('text', XmlToken.Value),
                lParser.partReference('tag')
            ]),
            (pData: ContentData): XmlElement | CommentNode | TextNode => {
                // XML Element
                if (pData.value instanceof XmlElement) {
                    return pData.value;
                }

                // Text content.
                if ('text' in pData.value) {
                    // Clear hyphen from text content.
                    let lClearedTextContent: string;
                    if (pData.value.text.startsWith('"') && pData.value.text.endsWith('"')) {
                        lClearedTextContent = pData.value.text.substring(1, pData.value.text.length - 1);
                    } else {
                        lClearedTextContent = pData.value.text;
                    }

                    // Create text element.
                    const lTextContent = new (this.getTextNodeConstructor())();
                    lTextContent.text = lClearedTextContent;

                    return lTextContent;
                }

                // Create comment element. Extract raw text content.
                const lComment = new (this.getCommentNodeConstructor())();
                lComment.text = pData.value.comment.substring(4, pData.value.comment.length - 3).trim();

                return lComment;
            }
        );

        // Tags
        type TagParseData = {
            openingTagName: string;
            openingNamespace?: { name: string; };
            attributes: Array<AttributeInformation>,
            ending: {} | {
                values: Array<XmlElement | CommentNode | TextNode>;
                closingTageName: string;
                closingNamespace?: { name: string; };
            };
        };
        lParser.defineGraphPart('tag',
            lParser.graph()
                .single(XmlToken.OpenBracket)
                .optional('openingNamespace',
                    lParser.graph().single('name', XmlToken.Identifier).single(XmlToken.NamespaceDelimiter)
                )
                .single('openingTagName', XmlToken.Identifier)
                .loop('attributes', lParser.partReference('attribute'))
                .branch('ending', [
                    lParser.graph()
                        .single(XmlToken.CloseClosingBracket),
                    lParser.graph()
                        .single(XmlToken.CloseBracket)
                        .loop('values', lParser.partReference('content'))
                        .single(XmlToken.OpenClosingBracket)
                        .optional('closingNamespace',
                            lParser.graph().single('name', XmlToken.Identifier).single(XmlToken.NamespaceDelimiter)
                        )
                        .single('closingTageName', XmlToken.Identifier).single(XmlToken.CloseBracket)
                ]),
            (pData: TagParseData): XmlElement => {
                // Validate data consistency.
                if ('closingTageName' in pData.ending) {
                    if (pData.openingTagName !== pData.ending.closingTageName) {
                        throw new Exception(`Opening (${pData.openingTagName}) and closing tagname (${pData.ending.closingTageName}) does not match`, this);
                    }

                    // Validate namespace prefix.
                    if (pData.ending.closingNamespace !== pData.openingNamespace) {
                        throw new Exception(`Opening (${pData.openingNamespace}) and closing namespace prefix (${pData.ending.closingNamespace}) does not match`, this);
                    }
                }

                // Validate tag name.
                const lRegexNameCheck: RegExp = new RegExp(`^[${this.escapeRegExp(this.mConfig.allowedTagNameCharacters)}]+$`);
                if (!lRegexNameCheck.test(pData.openingTagName)) {
                    throw new Exception(`Tagname contains illegal characters: "${pData.openingTagName}"`, this);
                }

                // Create xml element.
                const lElement: XmlElement = new (this.getXmlElementConstructor())();
                lElement.tagName = pData.openingTagName;
                lElement.namespacePrefix = pData.openingNamespace?.name ?? null;

                // Add attributes.
                for (const lAttribute of pData.attributes) {
                    lElement.setAttribute(lAttribute.name, lAttribute.value, lAttribute.namespacePrefix);
                }

                // Add values.
                if ('values' in pData.ending) {
                    for (const lValue of pData.ending.values) {
                        // Optional comment node
                        if (this.mConfig.removeComments && lValue instanceof CommentNode) {
                            continue;
                        }

                        // XML Element or Text node.
                        lElement.appendChild(lValue);
                    }
                }

                return lElement;
            }
        );

        // Document.
        type DocumentParseData = {
            content: Array<XmlElement | CommentNode | TextNode>;
        };
        lParser.defineGraphPart('document',
            lParser.graph().loop('content', lParser.partReference('content')),
            (pData: DocumentParseData): XmlDocument => {
                const lDocument: XmlDocument = new XmlDocument('http://www.w3.org/1999/xhtml');

                for (const lValue of pData.content) {
                    // Optional comment node
                    if (!lValue === null) {
                        continue;
                    }

                    // XML Element or Text node.
                    lDocument.appendChild(lValue);
                }

                return lDocument;
            }
        );

        lParser.setRootGraphPart('document');

        return lParser;
    }
}

enum PwbTemplateToken {
    a = '',
}