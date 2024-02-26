import { Exception } from '@kartoffelgames/core.data';
import { AnonymousGrammarNode, BaseGrammarNode, CodeParser } from '@kartoffelgames/core.parser';
import { XmlDocument } from '../document/xml-document';
import { CommentNode } from '../node/comment-node';
import { TextNode } from '../node/text-node';
import { XmlElement } from '../node/xml-element';
import { BaseXmlParser } from './base-xml-parser';
import { XmlTokenType } from './xml-token-type.enum';

export class XmlParser<TExtendTokenType extends string = XmlTokenType> extends BaseXmlParser<XmlTokenType | TExtendTokenType> {
    private mAllowedAttributeCharacters: string;
    private mAllowedTagNameCharacters: string;
    private mRemoveComments: boolean;


    /**
     * Characters that are allowed for attribute names. Case insensitiv.
     */
    public get allowedAttributeCharacters(): string {
        return this.mAllowedAttributeCharacters;
    } set allowedAttributeCharacters(pValue: string) {
        // Add lower- and uppercase characters. Split this string into single chars and create a distinct list with a Set & Spread-Array.
        const lCharList: Array<string> = [...new Set((pValue.toLowerCase() + pValue.toUpperCase()).split(''))];

        this.mAllowedAttributeCharacters = lCharList.join('');
    }

    /**
     * Characters that are allowed for tag names. Case insensitiv.
     */
    public get allowedTagNameCharacters(): string {
        return this.mAllowedTagNameCharacters;
    } set allowedTagNameCharacters(pValue: string) {
        // Add lower- and uppercase characters. Split this string into single chars and create a distinct list with a Set & Spread-Array.
        const lCharList: Array<string> = [...new Set((pValue.toLowerCase() + pValue.toUpperCase()).split(''))];

        this.mAllowedTagNameCharacters = lCharList.join('');
    }


    /**
     * Remove comments from generated xml.
     */
    public get removeComments(): boolean {
        return this.mRemoveComments;
    } set removeComments(pValue: boolean) {
        this.mRemoveComments = pValue;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super();

        this.mAllowedAttributeCharacters = '';
        this.mAllowedTagNameCharacters = '';
        this.mRemoveComments = false;

        // Apply defaults.
        this.allowedAttributeCharacters = 'abcdefghijklmnopqrstuvwxyz_-.1234567890';
        this.allowedTagNameCharacters = 'abcdefghijklmnopqrstuvwxyz_-.1234567890';

        // Set token and parser parts.
        this.setDefaultToken();
        this.setDefaultParts();

        // Set default root token
        this.rootTokens.add('Comment');
        this.rootTokens.add('OpeningTag');
        this.rootTokens.add('ClosingTag');
        this.rootTokens.add('ExplicitValue');
        this.rootTokens.add('Value');

        // Set default content parts.
        this.contentParts.add('text');
        this.contentParts.add('comment');
        this.contentParts.add('tag');
    }

    /**
     * Escape text to be inserted into an regex.
     * @param pText - String.
     */
    protected escapeRegExp(pText: string): string {
        return pText.replace(/[.*+?^${}()\-|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    /**
     * Get documents default namespace.
     */
    protected getDefaultNamespace(): string {
        return 'http://www.w3.org/1999/xhtml';
    }

    /**
     * Set xml parts.
     */
    private setDefaultParts(): void {
        // Attribute graph.
        type AttributeParseData = {
            namespace?: { name: string; };
            name: string;
            value?: { value: string; };
        };
        this.setXmlPart<AttributeParseData, AttributeInformation>('attribute', (pXmlPart) => {
            // Set xml attribute grapth.
            pXmlPart.definition.grapth = (pGraph: AnonymousGrammarNode<XmlTokenType | TExtendTokenType>, pParser: CodeParser<XmlTokenType | TExtendTokenType, XmlDocument>): BaseGrammarNode<XmlTokenType | TExtendTokenType> => {
                return pGraph
                    .optional('namespace',
                        pParser.graph().single('name', XmlTokenType.Identifier).single(XmlTokenType.NamespaceDelimiter)
                    )
                    .single('name', XmlTokenType.Identifier)
                    .optional('value',
                        pParser.graph().single(XmlTokenType.Assignment).single('value', XmlTokenType.Value)
                    );
            };

            // Set attribute data parser.
            pXmlPart.definition.data = (pData: AttributeParseData) => {
                // Validate tag name.
                const lRegexNameCheck: RegExp = new RegExp(`^[${this.escapeRegExp(this.allowedAttributeCharacters)}]+$`);
                if (!lRegexNameCheck.test(pData.name)) {
                    throw new Exception(`Attribute contains illegal characters: "${pData.name}"`, this);
                }

                return {
                    namespacePrefix: pData.namespace?.name ?? null,
                    name: pData.name,
                    value: pData.value?.value.substring(1, pData.value.value.length - 1) ?? ''
                };
            };

            return pXmlPart;
        });

        // Xml Text
        type TextParseData = {
            text: string;
        };
        this.setXmlPart<TextParseData, TextNode>('text', (pXmlPart) => {
            // Set default text node constructor.
            pXmlPart.partConstructor = TextNode;

            // Set text grapth.
            pXmlPart.definition.grapth = (pGraph: AnonymousGrammarNode<XmlTokenType | TExtendTokenType>): BaseGrammarNode<XmlTokenType | TExtendTokenType> => {
                return pGraph.single('text', XmlTokenType.Value);
            };

            // Set text data parser.
            pXmlPart.definition.data = (pData: TextParseData) => {
                if (!pXmlPart.partConstructor) {
                    throw new Exception('Text node constructor needs to be set.', this);
                }

                // Clear hyphen from text content.
                let lClearedTextContent: string;
                if (pData.text.startsWith('"') && pData.text.endsWith('"')) {
                    lClearedTextContent = pData.text.substring(1, pData.text.length - 1);
                } else {
                    lClearedTextContent = pData.text;
                }

                // Create text element.
                const lTextContent: TextNode = new (<typeof TextNode>pXmlPart.partConstructor)();
                lTextContent.text = lClearedTextContent;

                return lTextContent;
            };

            return pXmlPart;
        });

        // Xml Comment
        type CommentParseData = {
            comment: string;
        };
        this.setXmlPart<CommentParseData, CommentNode | null>('comment', (pXmlPart) => {
            // Set default comment node constructor.
            pXmlPart.partConstructor = CommentNode;

            // Set comment grapth.
            pXmlPart.definition.grapth = (pGraph: AnonymousGrammarNode<XmlTokenType | TExtendTokenType>): BaseGrammarNode<XmlTokenType | TExtendTokenType> => {
                return pGraph.single('comment', XmlTokenType.Comment);
            };

            // Set comment data parser.
            pXmlPart.definition.data = (pData: CommentParseData) => {
                // Skip comments when they should be omited.
                if (this.removeComments) {
                    return null;
                }

                if (!pXmlPart.partConstructor) {
                    throw new Exception('Comment node constructor needs to be set.', this);
                }

                // Create comment element. Extract raw text content.
                const lComment: CommentNode = new (<typeof CommentNode>pXmlPart.partConstructor)();
                lComment.text = pData.comment.substring(4, pData.comment.length - 3).trim();

                return <CommentNode>lComment;
            };

            return pXmlPart;
        });

        // Xml tag
        type TagParseData = {
            openingTagName: string;
            openingNamespace?: { name: string; };
            attributes: Array<AttributeInformation>,
            ending: {} | {
                values: Array<XmlElement | CommentNode | TextNode | null>;
                closingTageName: string;
                closingNamespace?: { name: string; };
            };
        };
        this.setXmlPart<TagParseData, XmlElement>('tag', (pXmlPart) => {
            // Set default comment node constructor.
            pXmlPart.partConstructor = XmlElement;

            // Set comment grapth.
            pXmlPart.definition.grapth = (pGraph: AnonymousGrammarNode<XmlTokenType | TExtendTokenType>, pParser: CodeParser<XmlTokenType | TExtendTokenType, XmlDocument>): BaseGrammarNode<XmlTokenType | TExtendTokenType> => {
                return pGraph
                    .single(XmlTokenType.OpenBracket)
                    .optional('openingNamespace',
                        pParser.graph().single('name', XmlTokenType.Identifier).single(XmlTokenType.NamespaceDelimiter)
                    )
                    .single('openingTagName', XmlTokenType.Identifier)
                    .loop('attributes', pParser.partReference('attribute'))
                    .branch('ending', [
                        pParser.graph()
                            .single(XmlTokenType.CloseClosingBracket),
                        pParser.graph()
                            .single(XmlTokenType.CloseBracket)
                            .loop('values', pParser.partReference('content'))
                            .single(XmlTokenType.OpenClosingBracket)
                            .optional('closingNamespace',
                                pParser.graph().single('name', XmlTokenType.Identifier).single(XmlTokenType.NamespaceDelimiter)
                            )
                            .single('closingTageName', XmlTokenType.Identifier).single(XmlTokenType.CloseBracket)
                    ]);
            };

            // Set comment data parser.
            pXmlPart.definition.data = (pData: TagParseData) => {
                if (!pXmlPart.partConstructor) {
                    throw new Exception('Xml node constructor needs to be set.', this);
                }

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
                const lRegexNameCheck: RegExp = new RegExp(`^[${this.escapeRegExp(this.allowedTagNameCharacters)}]+$`);
                if (!lRegexNameCheck.test(pData.openingTagName)) {
                    throw new Exception(`Tagname contains illegal characters: "${pData.openingTagName}"`, this);
                }

                // Create xml element.
                const lElement: XmlElement = new (<typeof XmlElement>pXmlPart.partConstructor)();
                lElement.tagName = pData.openingTagName;
                lElement.namespacePrefix = pData.openingNamespace?.name ?? null;

                // Add attributes.
                for (const lAttribute of pData.attributes) {
                    lElement.setAttribute(lAttribute.name, lAttribute.value, lAttribute.namespacePrefix);
                }

                // Add values.
                if ('values' in pData.ending) {
                    for (const lValue of pData.ending.values) {
                        // Optional comment node. Comment nodes are null when omitted.
                        if (lValue === null) {
                            continue;
                        }

                        // XML Element or Text node.
                        lElement.appendChild(lValue);
                    }
                }

                return lElement;
            };

            return pXmlPart;
        });
    }

    /**
     * Set xml lexer token. 
     */
    private setDefaultToken(): void {
        // Identifier.
        this.setXmlToken('NamespaceDelimiter', (pToken) => {
            pToken.pattern = { pattern: { regex: /:/, type: XmlTokenType.NamespaceDelimiter }, specificity: 1 };
            return pToken;
        });
        this.setXmlToken('Identifier', (pToken) => {
            pToken.pattern = { pattern: { regex: /[^<>\s\n/:="]+/, type: XmlTokenType.Identifier }, specificity: 1 };
            return pToken;
        });
        this.setXmlToken('ExplicitValue', (pToken) => {
            pToken.pattern = { pattern: { regex: /"[^"]*"/, type: XmlTokenType.Value }, specificity: 1 };
            return pToken;
        });
        this.setXmlToken('Assignment', (pToken) => {
            pToken.pattern = { pattern: { regex: /=/, type: XmlTokenType.Assignment }, specificity: 1 };
            return pToken;
        });

        // Value
        this.setXmlToken('Value', (pToken) => {
            pToken.pattern = { pattern: { regex: /[^<>"]+/, type: XmlTokenType.Value }, specificity: 4 };
            return pToken;
        });

        // Brackets.
        this.setXmlToken('Comment', (pToken) => {
            pToken.pattern = { pattern: { regex: /<!--.*?-->/, type: XmlTokenType.Comment }, specificity: 0 };
            return pToken;
        });
        this.setXmlToken('ClosingTag', (pToken) => {
            pToken.validInner = ['NamespaceDelimiter', 'Identifier'];
            pToken.pattern = {
                pattern: {
                    start: {
                        regex: /<\//,
                        type: XmlTokenType.OpenClosingBracket
                    },
                    end: {
                        regex: />/,
                        type: XmlTokenType.CloseBracket
                    }
                }, specificity: 1
            };
            return pToken;
        });
        this.setXmlToken('OpeningTag', (pToken) => {
            pToken.validInner = ['NamespaceDelimiter', 'Identifier', 'ExplicitValue', 'Assignment'];
            pToken.pattern = {
                pattern: {
                    start: {
                        regex: /</,
                        type: XmlTokenType.OpenBracket
                    },
                    end: {
                        regex: /(?<closeClosingBracket>\/>)|(?<closeBracket>>)/,
                        type: {
                            closeClosingBracket: XmlTokenType.CloseClosingBracket,
                            closeBracket: XmlTokenType.CloseBracket
                        }
                    }
                }, specificity: 2
            };
            return pToken;
        });
    }
}

/**
 * Information that can be get from attribute strings.
 */
export type AttributeInformation = {
    name: string,
    namespacePrefix: string | null,
    value: string,
};