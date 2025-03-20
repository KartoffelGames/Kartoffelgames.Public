import { Exception, type IVoidParameterConstructor } from '@kartoffelgames/core';
import { CodeParser, Lexer } from '@kartoffelgames/core-parser';
import { GraphNode } from '../../../kartoffelgames.core.parser/source/graph/graph-node.ts';
import { Graph } from '../../../kartoffelgames.core.parser/source/graph/graph.ts';
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
        // Empty result when not content is set.
        if (pText.trim() === '') {
            return new XmlDocument(this.getDefaultNamespace());
        }

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
        const lNamespaceDelimiter = lLexer.createTokenPattern({ pattern: { regex: /:/, type: XmlToken.NamespaceDelimiter } });
        const lIdentifier = lLexer.createTokenPattern({ pattern: { regex: /[^<>\s\n/:="]+/, type: XmlToken.Identifier } });
        const lExplicitValue = lLexer.createTokenPattern({ pattern: { regex: /"[^"]*"/, type: XmlToken.Value } });
        const lValue = lLexer.createTokenPattern({ pattern: { regex: /[^<>"]+/, type: XmlToken.Value } });
        const lComment = lLexer.createTokenPattern({ pattern: { regex: /<!--.*?-->/, type: XmlToken.Comment } });
        const lAssignment = lLexer.createTokenPattern({ pattern: { regex: /=/, type: XmlToken.Assignment } });

        // Brackets.
        const lOpeningBracket = lLexer.createTokenPattern({
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
            lLexer.useTokenPattern(lNamespaceDelimiter);
            lLexer.useTokenPattern(lIdentifier);
        });
        const lClosingBracket = lLexer.createTokenPattern({
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
            lLexer.useTokenPattern(lAssignment);
            lLexer.useTokenPattern(lNamespaceDelimiter);
            lLexer.useTokenPattern(lIdentifier);
            lLexer.useTokenPattern(lExplicitValue);
        });

        // Stack templates.
        lLexer.useTokenPattern(lComment);
        lLexer.useTokenPattern(lOpeningBracket);
        lLexer.useTokenPattern(lClosingBracket);
        lLexer.useTokenPattern(lExplicitValue);
        lLexer.useTokenPattern(lValue);

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
        const lAttributeGraph = Graph.define(() => {
            return GraphNode.new<XmlToken>()
                .optional('namespace',
                    GraphNode.new<XmlToken>().required('name', XmlToken.Identifier).required(XmlToken.NamespaceDelimiter)
                )
                .required('name', XmlToken.Identifier)
                .optional('value',
                    GraphNode.new<XmlToken>().required(XmlToken.Assignment).required('value', XmlToken.Value)
                );
        }).converter((pData): AttributeData => {
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
        });

        // Attribute graph.
        const lAttributeListGraph = Graph.define(() => {
            const lSelfReference: Graph<XmlToken, any, { attributes: Array<AttributeData>; }> = lAttributeListGraph;
            return GraphNode.new<XmlToken>().required('attributes[]', lAttributeGraph).optional('attributes<-attributes', lSelfReference);
        });

        // Content data.
        const lTextNodeGraph = Graph.define(() => {
            return GraphNode.new<XmlToken>().required('text', XmlToken.Value);
        }).converter((pData): TextNode => {
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
        });

        // Content data.
        const lCommentNodeGraph = Graph.define(() => {
            return GraphNode.new<XmlToken>().required('comment', XmlToken.Comment);
        }).converter((pData): CommentNode => {
            // Create comment element. Extract raw text content.
            const lComment = new (this.getCommentNodeConstructor())();
            lComment.text = pData.comment.substring(4, pData.comment.length - 3).trim();

            return lComment;
        });

        // Tags
        const lXmlElementGraph = Graph.define(() => {
            const lLoopedContentGraph: Graph<XmlToken, any, Array<BaseXmlNode>> = lContentListGraph;

            return GraphNode.new<XmlToken>()
                .required(XmlToken.OpenBracket)
                .optional('openingNamespace',
                    GraphNode.new<XmlToken>().required('name', XmlToken.Identifier).required(XmlToken.NamespaceDelimiter)
                )
                .required('openingTagName', XmlToken.Identifier)
                .optional('attributes<-attributes', lAttributeListGraph)
                .required('ending', [
                    GraphNode.new<XmlToken>()
                        .required(XmlToken.CloseClosingBracket),
                    GraphNode.new<XmlToken>()
                        .required(XmlToken.CloseBracket)
                        .optional('values', lLoopedContentGraph)
                        .required(XmlToken.OpenClosingBracket)
                        .optional('closingNamespace',
                            GraphNode.new<XmlToken>().required('name', XmlToken.Identifier).required(XmlToken.NamespaceDelimiter)
                        )
                        .required('closingTageName', XmlToken.Identifier).required(XmlToken.CloseBracket)
                ]);
        }).converter((pData): XmlElement => {
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
        });

        // Content data.
        const lContentListGraph = Graph.define(() => {
            const lSelfReference: Graph<XmlToken, any, Array<BaseXmlNode>> = lContentListGraph;

            return GraphNode.new<XmlToken>().required('list[]', [
                lXmlElementGraph,
                lCommentNodeGraph,
                lTextNodeGraph,
            ]).optional('list[]', lSelfReference);
        }).converter((pData): Array<BaseXmlNode> => {
            const lContentList: Array<BaseXmlNode> = new Array<BaseXmlNode>();

            for (const lItem of pData.list) {
                // Skip omitted comments.
                if (this.mConfig.removeComments && lItem instanceof CommentNode) {
                    continue;
                }

                lContentList.push(lItem);
            }

            return lContentList;
        });

        // Document.
        const lXmlDocumentGraph = Graph.define(() => {
            return GraphNode.new<XmlToken>().required('content[]', lContentListGraph);
        }).converter((pData): XmlDocument => {
            const lDocument: XmlDocument = new XmlDocument(this.getDefaultNamespace());

            // Add content values.
            lDocument.appendChild(...pData.content);

            return lDocument;
        });

        lParser.setRootGraph(lXmlDocumentGraph);

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
