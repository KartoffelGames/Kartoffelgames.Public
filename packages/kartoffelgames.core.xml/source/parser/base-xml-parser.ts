import { Exception, IVoidParameterConstructor } from '@kartoffelgames/core.data';
import { CodeParser, Lexer } from '@kartoffelgames/core.parser';
import { XmlDocument } from '../document/xml-document';
import { CommentNode } from '../node/comment-node';
import { TextNode } from '../node/text-node';
import { XmlElement } from '../node/xml-element';
import { XmlToken } from './xml-token.enum';

/**
 * XML parser. Can handle none XML conform styles with different parser modes.
 */
export abstract class BaseXmlParser<TXmlElement extends XmlElement, TText extends TextNode, TComment extends CommentNode> extends CodeParser<XmlToken, XmlDocument>{
    private static readonly ROOT_NODE_NAME: string = 'ROOT-NODE';
    private readonly mConfig: XmlParserConfig;

    /**
     * Constructor. Creates parser with specified mode.
     * @param pParserMode - Mode how parser handles different characters.
     */
    public constructor(pParserConfig: XmlParserConfig = {}) {
        const lLexer: Lexer<XmlToken> = new Lexer<XmlToken>();
        lLexer.validWhitespaces = ' \n';
        lLexer.trimWhitespace = true;

        // Brackets.
        lLexer.addTokenPattern(/<!--.*?-->/, XmlToken.Comment, 0);
        lLexer.addTokenPattern(/\/>/, XmlToken.CloseClosingBracket, 1);
        lLexer.addTokenPattern(/<\//, XmlToken.OpenClosingBracket, 1);
        lLexer.addTokenPattern(/>/, XmlToken.CloseBracket, 2);
        lLexer.addTokenPattern(/</, XmlToken.OpenBracket, 2);

        // Delimiter.
        lLexer.addTokenPattern(/=/, XmlToken.Assignment, 3);
        lLexer.addTokenPattern(/:/, XmlToken.NamespaceDelimiter, 3);

        // Names and values.
        lLexer.addTokenPattern(/^"[^"]*"|^(?<token>[^<>"]+)[^<>]*(<|$)/, XmlToken.Value, 4);
        lLexer.addTokenPattern(/[^<>\s\n/:="]+/, XmlToken.Identifier, 5);

        super(lLexer);

        this.mConfig = {};

        // Set default config.
        this.mConfig.allowedAttributeCharacters = pParserConfig.allowedAttributeCharacters ?? 'abcdefghijklmnopqrstuvwxyz_-.1234567890';
        this.mConfig.allowedTagNameCharacters = pParserConfig.allowedTagNameCharacters ?? 'abcdefghijklmnopqrstuvwxyz_-.1234567890';
        this.mConfig.removeComments = pParserConfig.removeComments ?? false;

        // Extend allowed character for case insensitivity and escape.
        this.mConfig.allowedAttributeCharacters = this.escapeRegExp(this.mConfig.allowedAttributeCharacters.toLowerCase() + this.mConfig.allowedAttributeCharacters.toUpperCase());
        this.mConfig.allowedTagNameCharacters = this.escapeRegExp(this.mConfig.allowedTagNameCharacters.toLowerCase() + this.mConfig.allowedTagNameCharacters.toUpperCase());

        // Init xml structure and root part.
        this.initGraphParts();
        this.setRootGraphPart('document');
    }

    /**
     * Escape text to be inserted into an regex.
     * @param pText - String.
     */
    private escapeRegExp(pText: string): string {
        return pText.replace(/[.*+?^${}()\-|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    /**
     * Init graph parts 
     */
    private initGraphParts(): void {
        // Attribute graph.
        type AttributeParseData = {
            namespace?: { name: string; };
            name: string,
            value?: { value: string; };
        };
        this.defineGraphPart('attribute',
            this.graph()
                .optional('namespace',
                    this.graph().single('name', XmlToken.Identifier).single(XmlToken.NamespaceDelimiter)
                )
                .single('name', XmlToken.Identifier)
                .optional('value',
                    this.graph().single(XmlToken.Assignment).single('value', XmlToken.Value)
                ),
            (pData: AttributeParseData): AttributeInformation => {
                // Validate tag name.
                const lRegexNameCheck: RegExp = new RegExp(`^[${this.mConfig.allowedAttributeCharacters}]+$`);
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
        this.defineGraphPart('content',
            this.graph().branch('value', [
                this.graph().single('comment', XmlToken.Comment),
                this.graph().single('text', XmlToken.Value),
                this.partReference('tag')
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
        this.defineGraphPart('tag',
            this.graph()
                .single(XmlToken.OpenBracket)
                .optional('openingNamespace',
                    this.graph().single('name', XmlToken.Identifier).single(XmlToken.NamespaceDelimiter)
                )
                .single('openingTagName', XmlToken.Identifier)
                .loop('attributes', this.partReference('attribute'))
                .branch('ending', [
                    this.graph()
                        .single(XmlToken.CloseClosingBracket),
                    this.graph()
                        .single(XmlToken.CloseBracket)
                        .loop('values', this.partReference('content'))
                        .single(XmlToken.OpenClosingBracket)
                        .optional('closingNamespace',
                            this.graph().single('name', XmlToken.Identifier).single(XmlToken.NamespaceDelimiter)
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
                const lRegexNameCheck: RegExp = new RegExp(`^[${this.mConfig.allowedTagNameCharacters}]+$`);
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
        this.defineGraphPart('document',
            this.graph().loop('content', this.partReference('content')),
            (pData: DocumentParseData): XmlDocument => {
                const lDocument: XmlDocument = new XmlDocument(this.getDefaultNamespace());

                for (const lValue of pData.content) {
                    // Optional comment node
                    if (this.mConfig.removeComments && lValue instanceof CommentNode) {
                        continue;
                    }

                    // XML Element or Text node.
                    lDocument.appendChild(lValue);
                }

                return lDocument;
            }
        );
    }

    /**
     * Get Comment node constructor.
     */
    protected abstract getCommentNodeConstructor(): IVoidParameterConstructor<TComment>;

    /**
     * Get documents default namespace.
     */
    protected abstract getDefaultNamespace(): string;

    /**
     * Get Text node constructor.
     */
    protected abstract getTextNodeConstructor(): IVoidParameterConstructor<TText>;

    /**
     * Get XML Element constructor.
     */
    protected abstract getXmlElementConstructor(): IVoidParameterConstructor<TXmlElement>;
}

/**
 * Xml parser config for xml names.
 */
type XmlParserConfig = {
    /**
     * Characters that are allowed for attribute names. Case insensitiv.
     */
    allowedAttributeCharacters?: string;

    /**
     * Characters that are allowed for tag names. Case insensitiv.
     */
    allowedTagNameCharacters?: string;

    /**
     * Remove comments from generated xml.
     */
    removeComments?: boolean;
};

/**
 * Information that can be get from attribute strings.
 */
type AttributeInformation = {
    name: string,
    namespacePrefix: string | null,
    value: string,
};