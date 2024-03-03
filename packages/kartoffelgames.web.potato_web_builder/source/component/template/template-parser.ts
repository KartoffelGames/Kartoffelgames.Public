import { Exception } from '@kartoffelgames/core.data';
import { CodeParser, Lexer } from '@kartoffelgames/core.parser';
import { PwbTemplate } from './nodes/pwb-template';
import { BasePwbTemplateNode } from './nodes/base-pwb-template-node';
import { PwbTemplateTextNode } from './nodes/pwb-template-text-node';
import { PwbTemplateXmlNode } from './nodes/pwb-template-xml-node';

/**
 * Parser for parsing pwb xml template strings.
 */
export class TemplateParser {
    private mParser: CodeParser<PwbTemplateToken, PwbTemplate> | null;

    /**
     * Constructor.
     */
    public constructor() {
        this.mParser = null;
    }

    /**
     * Parse a pwb xml template string into an pwb template.
     * 
     * @param pText - Xml based code compatible to this parser.
     * 
     * @returns a new XmlDocument 
     */
    public parse(pText: string): PwbTemplate {
        // Create new parser when no one is initialized.
        if (!this.mParser) {
            const lLexer: Lexer<PwbTemplateToken> = this.createLexer();
            this.mParser = this.createParser(lLexer);
        }

        return this.mParser.parse(pText);
    }

    /**
     * Create a new lexer instance.
     */
    private createLexer(): Lexer<PwbTemplateToken> {
        const lLexer: Lexer<PwbTemplateToken> = new Lexer<PwbTemplateToken>();
        lLexer.validWhitespaces = ' \n';
        lLexer.trimWhitespace = true;

        // Identifier
        lLexer.addTokenTemplate('Identifier', { pattern: { regex: /[^<>\s\n/:="]+/, type: PwbTemplateToken.Identifier } });
        lLexer.addTokenTemplate('ExplicitValue', { pattern: { regex: /"[^"]*"/, type: PwbTemplateToken.XmlValue } });
        lLexer.addTokenTemplate('Value', { pattern: { regex: /[^<>"]+/, type: PwbTemplateToken.XmlValue } });
        lLexer.addTokenTemplate('Comment', { pattern: { regex: /<!--.*?-->/, type: PwbTemplateToken.XmlComment } });
        lLexer.addTokenTemplate('Assignment', { pattern: { regex: /=/, type: PwbTemplateToken.Assignment } });

        // Xml element Brackets.
        lLexer.addTokenTemplate('OpeningBracket', {
            pattern: {
                start: {
                    regex: /<\//,
                    type: PwbTemplateToken.XmlOpenClosingBracket
                },
                end: {
                    regex: />/,
                    type: PwbTemplateToken.XmlCloseBracket
                }
            }
        }, () => {
            lLexer.useTokenTemplate('Identifier', 1);
        });
        lLexer.addTokenTemplate('ClosingBracket', {
            pattern: {
                start: {
                    regex: /</,
                    type: PwbTemplateToken.XmlOpenBracket
                },
                end: {
                    regex: /(?<closeClosingBracket>\/>)|(?<closeBracket>>)/,
                    type: {
                        closeClosingBracket: PwbTemplateToken.XmlCloseClosingBracket,
                        closeBracket: PwbTemplateToken.XmlCloseBracket
                    }
                }
            }
        }, () => {
            lLexer.useTokenTemplate('Assignment', 1);
            lLexer.useTokenTemplate('Identifier', 1);
            lLexer.useTokenTemplate('ExplicitValue', 1);
        });

        // Stack templates.
        lLexer.useTokenTemplate('Comment', 0);
        lLexer.useTokenTemplate('OpeningBracket', 1);
        lLexer.useTokenTemplate('ClosingBracket', 2);
        lLexer.useTokenTemplate('ExplicitValue', 3);
        lLexer.useTokenTemplate('Value', 4);

        return lLexer;
    }

    /**
     * Create new code parser instance.
     * 
     * @param pLexer - Lexer instance.
     */
    private createParser(pLexer: Lexer<PwbTemplateToken>): CodeParser<PwbTemplateToken, PwbTemplate> {
        const lParser: CodeParser<PwbTemplateToken, PwbTemplate> = new CodeParser<PwbTemplateToken, PwbTemplate>(pLexer);

        // Attribute graph.
        type XmlAttributeParseData = {
            name: string,
            value?: { value: string; };
        };
        lParser.defineGraphPart('XmlAttribute',
            lParser.graph()
                .single('name', PwbTemplateToken.Identifier)
                .optional('value',
                    lParser.graph().single(PwbTemplateToken.Assignment).single('value', PwbTemplateToken.XmlValue)
                ),
            (pData: XmlAttributeParseData): AttributeInformation => {
                return {
                    name: pData.name,
                    value: pData.value?.value.substring(1, pData.value.value.length - 1) ?? ''
                };
            }
        );

        // Content data.
        type XmlTextNodeParseData = {
            text: string;
        };
        lParser.defineGraphPart('XmlTextNode',
            lParser.graph()
                .single('text', PwbTemplateToken.XmlValue),
            (pData: XmlTextNodeParseData): PwbTemplateTextNode => {
                // Clear hyphen from text content.
                let lClearedTextContent: string;
                if (pData.text.startsWith('"') && pData.text.endsWith('"')) {
                    lClearedTextContent = pData.text.substring(1, pData.text.length - 1);
                } else {
                    lClearedTextContent = pData.text;
                }

                // Create text node.
                const lTextContent = new PwbTemplateTextNode();
                lTextContent.text = lClearedTextContent;

                return lTextContent;
            }
        );

        // Ignore comment nodes..
        lParser.defineGraphPart('XmlCommentNode',
            lParser.graph().single(PwbTemplateToken.XmlComment),
            (): null => {
                return null;
            }
        );

        // Tags
        type XmlElementParseData = {
            openingTagName: string;
            attributes: Array<AttributeInformation>,
            closing: {} | {
                values: Array<BasePwbTemplateNode>;
                closingTageName: string;
            };
        };
        lParser.defineGraphPart('XmlElement',
            lParser.graph()
                .single(PwbTemplateToken.XmlOpenBracket)
                .single('openingTagName', PwbTemplateToken.Identifier)
                .loop('attributes', lParser.partReference('XmlAttribute'))
                .branch('closing', [
                    lParser.graph()
                        .single(PwbTemplateToken.XmlCloseClosingBracket),
                    lParser.graph()
                        .single(PwbTemplateToken.XmlCloseBracket)
                        .single('values', lParser.partReference('ContentList'))
                        .single(PwbTemplateToken.XmlOpenClosingBracket)
                        .single('closingTageName', PwbTemplateToken.Identifier).single(PwbTemplateToken.XmlCloseBracket)
                ]),
            (pData: XmlElementParseData): PwbTemplateXmlNode => {
                // Validate data consistency.
                if ('closingTageName' in pData.closing) {
                    if (pData.openingTagName !== pData.closing.closingTageName) {
                        throw new Exception(`Opening (${pData.openingTagName}) and closing tagname (${pData.closing.closingTageName}) does not match`, this);
                    }
                }

                // Create xml element.
                const lElement: PwbTemplateXmlNode = new PwbTemplateXmlNode();
                lElement.tagName = pData.openingTagName;

                // Add attributes.
                for (const lAttribute of pData.attributes) {
                    lElement.setAttribute(lAttribute.name, lAttribute.value);
                }

                // Add content values.
                if ('values' in pData.closing) {
                    lElement.appendChild(...pData.closing.values);
                }

                return lElement;
            }
        );

        // Child content data.
        type ContentParseData = {
            list: Array<{ node: PwbTemplateTextNode | null; }>;
        };
        lParser.defineGraphPart('ContentList',
            lParser.graph().loop('list', lParser.graph().branch('node', [
                lParser.partReference('XmlCommentNode'),
                lParser.partReference('XmlElement'),
                lParser.partReference('XmlTextNode')
            ])),
            (pData: ContentParseData): Array<BasePwbTemplateNode> => {
                const lContentList: Array<BasePwbTemplateNode> = new Array<BasePwbTemplateNode>();

                for (const lItem of pData.list) {
                    // Skip omitted nodes.
                    if (lItem.node === null) {
                        continue;
                    }

                    lContentList.push(lItem.node);
                }

                return lContentList;
            }
        );

        // Document.
        type TemplateParseData = {
            content: Array<BasePwbTemplateNode>;
        };
        lParser.defineGraphPart('TemplateRoot',
            lParser.graph().single('content', lParser.partReference('ContentList')),
            (pData: TemplateParseData): PwbTemplate => {
                const lTemplate: PwbTemplate = new PwbTemplate();

                // Add each content to template.
                lTemplate.appendChild(...pData.content);

                return lTemplate;
            }
        );

        // Set root part.
        lParser.setRootGraphPart('TemplateRoot');

        return lParser;
    }
}

enum PwbTemplateToken {
    Identifier = 'Identifier',
    Assignment = 'XmlAssignment',
    XmlValue = 'XmlValue',
    XmlComment = 'XmlComment',
    XmlOpenClosingBracket = 'XmlOpenClosingBracket',
    XmlCloseBracket = 'XmlCloseBracket',
    XmlOpenBracket = 'XmlOpenBracket',
    XmlCloseClosingBracket = 'XmlCloseClosingBracket'
}

type AttributeInformation = { name: string, value: string; };