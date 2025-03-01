import { Exception, type IVoidParameterConstructor } from '@kartoffelgames/core';
import { CodeParser, Lexer } from '@kartoffelgames/core-parser';
import { XmlDocument } from '../document/xml-document.ts';
import type { BaseXmlNode } from '../node/base-xml-node.ts';
import { CommentNode } from '../node/comment-node.ts';
import type { TextNode } from '../node/text-node.ts';
import type { XmlElement } from '../node/xml-element.ts';
import { XmlToken } from './xml-token.enum.ts';

/**
 * XML parser. Can handle none XML conform styles with different parser modes.
 */
export abstract class BaseXmlParser {
    private readonly mConfig: XmlParserConfig;
    private mParser: CodeParser<XmlToken, XmlDocument> | null;
    private mRebuildParser: boolean;

    /**
     * Characters that are allowed for attribute names. Case insensitiv.
     */
    public get allowedAttributeCharacters(): string {
        return this.mConfig.allowedAttributeCharacters;
    } set allowedAttributeCharacters(pValue: string) {
        // Add lower- and uppercase characters. Split this string into single chars and create a distinct list with a Set & Spread-Array.
        const lCharList: Array<string> = [...new Set((pValue.toLowerCase() + pValue.toUpperCase()).split(''))];

        this.mConfig.allowedAttributeCharacters = lCharList.join('');
        this.mRebuildParser = true;
    }

    /**
     * Characters that are allowed for tag names. Case insensitiv.
     */
    public get allowedTagNameCharacters(): string {
        return this.mConfig.allowedTagNameCharacters;
    } set allowedTagNameCharacters(pValue: string) {
        // Add lower- and uppercase characters. Split this string into single chars and create a distinct list with a Set & Spread-Array.
        const lCharList: Array<string> = [...new Set((pValue.toLowerCase() + pValue.toUpperCase()).split(''))];

        this.mConfig.allowedTagNameCharacters = lCharList.join('');
        this.mRebuildParser = true;
    }

    /**
     * Remove comments from generated xml.
     */
    public get removeComments(): boolean {
        return this.mConfig.removeComments;
    } set removeComments(pValue: boolean) {
        this.mConfig.removeComments = pValue;
        this.mRebuildParser = true;
    }

    /**
     * Constructor.
     */
    public constructor() {
        // Set default configs.
        this.mConfig = {
            allowedAttributeCharacters: '',
            allowedTagNameCharacters: '',
            removeComments: false
        };
        this.allowedAttributeCharacters = 'abcdefghijklmnopqrstuvwxyz_-.1234567890';
        this.allowedTagNameCharacters = 'abcdefghijklmnopqrstuvwxyz_-.1234567890';

        // "Reset" parser
        this.mRebuildParser = true;
        this.mParser = null;
    }

    /**
     * 
     * @param pText - Xml based code compatible to this parser.
     * 
     * @returns a new XmlDocument 
     */
    public parse(pText: string): XmlDocument {
        if (this.mRebuildParser || !this.mParser) {
            const lLexer: Lexer<XmlToken> = this.createLexer();
            this.mParser = this.createParser(lLexer);

            // Reset rebuild parser.
            this.mRebuildParser = false;
        }

        return this.mParser.parse(pText);
    }

    /**
     * Recreate lexer with applied config.
     */
    private createLexer(): Lexer<XmlToken> {
        const lLexer: Lexer<XmlToken> = new Lexer<XmlToken>();
        lLexer.validWhitespaces = ' \n';
        lLexer.trimWhitespace = true;

        // Identifier
        lLexer.addTokenTemplate('NamespaceDelimiter', { pattern: { regex: /:/, type: XmlToken.NamespaceDelimiter } });
        lLexer.addTokenTemplate('Identifier', { pattern: { regex: /[^<>\s\n/:="]+/, type: XmlToken.Identifier } });
        lLexer.addTokenTemplate('ExplicitValue', { pattern: { regex: /"[^"]*"/, type: XmlToken.Value } });
        lLexer.addTokenTemplate('Value', { pattern: { regex: /[^<>"]+/, type: XmlToken.Value } });
        lLexer.addTokenTemplate('Comment', { pattern: { regex: /<!--.*?-->/, type: XmlToken.Comment } });
        lLexer.addTokenTemplate('Assignment', { pattern: { regex: /=/, type: XmlToken.Assignment } });

        // Brackets.
        lLexer.addTokenTemplate('OpeningBracket', {
            pattern: {
                start: {
                    regex: /<\//,
                    type: XmlToken.OpenClosingBracket
                },
                end: {
                    regex: />/,
                    type: XmlToken.CloseBracket
                }
            }
        }, () => {
            lLexer.useTokenTemplate('NamespaceDelimiter', 1);
            lLexer.useTokenTemplate('Identifier', 1);
        });
        lLexer.addTokenTemplate('ClosingBracket', {
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
            }
        }, () => {
            lLexer.useTokenTemplate('Assignment', 1);
            lLexer.useTokenTemplate('NamespaceDelimiter', 1);
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
        lParser.defineGraphPart('Attribute',
            lParser.graph()
                .optional('namespace',
                    lParser.graph().single('name', XmlToken.Identifier).single(XmlToken.NamespaceDelimiter)
                )
                .single('name', XmlToken.Identifier)
                .optional('value',
                    lParser.graph().single(XmlToken.Assignment).single('value', XmlToken.Value)
                ),
            (pData: AttributeParseData): AttributeData => {
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
        type TextNodeParseData = {
            text: string;
        };
        lParser.defineGraphPart('TextNode',
            lParser.graph()
                .single('text', XmlToken.Value),
            (pData: TextNodeParseData): TextNode => {
                // Clear hyphen from text content.
                let lClearedTextContent: string;
                if (pData.text.startsWith('"') && pData.text.endsWith('"')) {
                    lClearedTextContent = pData.text.substring(1, pData.text.length - 1);
                } else {
                    lClearedTextContent = pData.text;
                }

                // Create text node.
                const lTextContent = new (this.getTextNodeConstructor())();
                lTextContent.text = lClearedTextContent;

                return lTextContent;
            }
        );

        // Content data.
        type CommentNodeParseData = {
            comment: string;
        };
        lParser.defineGraphPart('CommentNode',
            lParser.graph()
                .single('comment', XmlToken.Comment),
            (pData: CommentNodeParseData): CommentNode => {
                // Create comment element. Extract raw text content.
                const lComment = new (this.getCommentNodeConstructor())();
                lComment.text = pData.comment.substring(4, pData.comment.length - 3).trim();

                return lComment;
            }
        );

        // Tags
        type XmlElementParseData = {
            openingTagName: string;
            openingNamespace?: { name: string; };
            attributes: Array<AttributeData>,
            ending: object | {
                values: Array<BaseXmlNode>;
                closingTageName: string;
                closingNamespace?: { name: string; };
            };
        };
        lParser.defineGraphPart('XmlElement',
            lParser.graph()
                .single(XmlToken.OpenBracket)
                .optional('openingNamespace',
                    lParser.graph().single('name', XmlToken.Identifier).single(XmlToken.NamespaceDelimiter)
                )
                .single('openingTagName', XmlToken.Identifier)
                .loop('attributes', lParser.partReference('Attribute'))
                .branch('ending', [
                    lParser.graph()
                        .single(XmlToken.CloseClosingBracket),
                    lParser.graph()
                        .single(XmlToken.CloseBracket)
                        .single('values', lParser.partReference('Content'))
                        .single(XmlToken.OpenClosingBracket)
                        .optional('closingNamespace',
                            lParser.graph().single('name', XmlToken.Identifier).single(XmlToken.NamespaceDelimiter)
                        )
                        .single('closingTageName', XmlToken.Identifier).single(XmlToken.CloseBracket)
                ]),
            (pData: XmlElementParseData): XmlElement => {
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

                // Add content values.
                if ('values' in pData.ending) {
                    lElement.appendChild(...pData.ending.values);
                }

                return lElement;
            }
        );

        // Content data.
        type ContentParseData = {
            list: Array<{ node: BaseXmlNode; }>;
        };
        lParser.defineGraphPart('Content',
            lParser.graph().loop('list', lParser.graph().branch('node', [
                lParser.partReference('CommentNode'),
                lParser.partReference('TextNode'),
                lParser.partReference('XmlElement')
            ])),
            (pData: ContentParseData): Array<BaseXmlNode> => {
                const lContentList: Array<BaseXmlNode> = new Array<BaseXmlNode>();

                for (const lItem of pData.list) {
                    // Skip omitted comments.
                    if (this.mConfig.removeComments && lItem.node instanceof CommentNode) {
                        continue;
                    }

                    lContentList.push(lItem.node);
                }

                return lContentList;
            }
        );

        // Document.
        type XmlDocumentParseData = {
            content: Array<BaseXmlNode>;
        };
        lParser.defineGraphPart('XmlDocument',
            lParser.graph().single('content', lParser.partReference('Content')),
            (pData: XmlDocumentParseData): XmlDocument => {
                const lDocument: XmlDocument = new XmlDocument(this.getDefaultNamespace());

                // Add content values.
                lDocument.appendChild(...pData.content);

                return lDocument;
            }
        );

        lParser.setRootGraphPart('XmlDocument');

        return lParser;
    }

    /**
     * Escape text to be inserted into an regex.
     * @param pText - String.
     */
    private escapeRegExp(pText: string): string {
        return pText.replace(/[.*+?^${}()\-|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    /**
     * Get Comment node constructor.
     */
    protected abstract getCommentNodeConstructor(): IVoidParameterConstructor<CommentNode>;

    /**
     * Get documents default namespace.
     */
    protected abstract getDefaultNamespace(): string;

    /**
     * Get Text node constructor.
     */
    protected abstract getTextNodeConstructor(): IVoidParameterConstructor<TextNode>;

    /**
     * Get XML Element constructor.
     */
    protected abstract getXmlElementConstructor(): IVoidParameterConstructor<XmlElement>;
}

/**
 * Xml parser config for xml names.
 */
type XmlParserConfig = {
    /**
     * Characters that are allowed for attribute names. Case insensitiv.
     */
    allowedAttributeCharacters: string;

    /**
     * Characters that are allowed for tag names. Case insensitiv.
     */
    allowedTagNameCharacters: string;

    /**
     * Remove comments from generated xml.
     */
    removeComments: boolean;
};

/**
 * Information that can be get from attribute strings.
 */
type AttributeData = {
    name: string,
    namespacePrefix: string | null,
    value: string,
};
