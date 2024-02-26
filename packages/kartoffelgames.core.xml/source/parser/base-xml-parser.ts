import { Exception, IVoidParameterConstructor } from '@kartoffelgames/core.data';
import { CodeParser, Lexer } from '@kartoffelgames/core.parser';
import { XmlDocument } from '../document/xml-document';
import { CommentNode } from '../node/comment-node';
import { TextNode } from '../node/text-node';
import { XmlElement } from '../node/xml-element';
import { XmlToken } from './xml-token.enum';
import { BaseGrammarNode } from '@kartoffelgames/core.parser/library/source/graph/node/base-grammar-node';

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

        this.allowedAttributeCharacters = lCharList.join('');
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

        this.allowedTagNameCharacters = lCharList.join('');
        this.mRebuildParser = true;
    }

    /**
     * Xml parts that counts as content.
     * Content parts are used for nesting.
     */
    public get contentParts(): Array<string> {
        return this.mConfig.contentParts;
    } set contentParts(pValue: Array<string>) {
        this.mConfig.contentParts = pValue;
    }

    /**
     * Remove comments from generated xml.
     */
    public get removeComments(): boolean {
        return this.mConfig.removeComments;
    } set removeComments(pValue: boolean) {
        this.removeComments = pValue;
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
            removeComments: false,
            xmlParts: new Map<string, XmlPart<object, any>>(),
            contentParts: []
        };
        this.allowedAttributeCharacters = 'abcdefghijklmnopqrstuvwxyz_-.1234567890';
        this.allowedTagNameCharacters = 'abcdefghijklmnopqrstuvwxyz_-.1234567890';

        // Set default content parts.
        this.contentParts.push('text', 'comment', 'tag');

        // Set defaul xmlparts.
        // Attribute graph.
        type AttributeParseData = {
            namespace?: { name: string; };
            name: string;
            value?: { value: string; };
        };
        this.setXmlPart<AttributeParseData, AttributeInformation>('attribute', (pXmlPart) => {
            // Set xml attribute grapth.
            pXmlPart.definition.grapth = (pGraph: BaseGrammarNode<XmlToken>, pParser: CodeParser<XmlToken, XmlDocument>): BaseGrammarNode<XmlToken> => {
                return pGraph
                    .optional('namespace',
                        pParser.graph().single('name', XmlToken.Identifier).single(XmlToken.NamespaceDelimiter)
                    )
                    .single('name', XmlToken.Identifier)
                    .optional('value',
                        pParser.graph().single(XmlToken.Assignment).single('value', XmlToken.Value)
                    );
            };

            // Set attribute data parser.
            pXmlPart.definition.data = (pData: AttributeParseData) => {
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
            pXmlPart.definition.grapth = (pGraph: BaseGrammarNode<XmlToken>): BaseGrammarNode<XmlToken> => {
                return pGraph.single('text', XmlToken.Value);
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
        this.setXmlPart<CommentParseData, CommentNode>('comment', (pXmlPart) => {
            // Set default comment node constructor.
            pXmlPart.partConstructor = CommentNode;

            // Set comment grapth.
            pXmlPart.definition.grapth = (pGraph: BaseGrammarNode<XmlToken>): BaseGrammarNode<XmlToken> => {
                return pGraph.single('comment', XmlToken.Comment);
            };

            // Set comment data parser.
            pXmlPart.definition.data = (pData: CommentParseData) => {
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
                values: Array<XmlElement | CommentNode | TextNode>;
                closingTageName: string;
                closingNamespace?: { name: string; };
            };
        };
        this.setXmlPart<TagParseData, XmlElement>('tag', (pXmlPart) => {
            // Set default comment node constructor.
            pXmlPart.partConstructor = XmlElement;

            // Set comment grapth.
            pXmlPart.definition.grapth = (pGraph: BaseGrammarNode<XmlToken>, pParser: CodeParser<XmlToken, XmlDocument>): BaseGrammarNode<XmlToken> => {
                return pGraph
                    .single(XmlToken.OpenBracket)
                    .optional('openingNamespace',
                        pParser.graph().single('name', XmlToken.Identifier).single(XmlToken.NamespaceDelimiter)
                    )
                    .single('openingTagName', XmlToken.Identifier)
                    .loop('attributes', pParser.partReference('attribute'))
                    .branch('ending', [
                        pParser.graph()
                            .single(XmlToken.CloseClosingBracket),
                        pParser.graph()
                            .single(XmlToken.CloseBracket)
                            .loop('values', pParser.partReference('tag__content'))
                            .single(XmlToken.OpenClosingBracket)
                            .optional('closingNamespace',
                                pParser.graph().single('name', XmlToken.Identifier).single(XmlToken.NamespaceDelimiter)
                            )
                            .single('closingTageName', XmlToken.Identifier).single(XmlToken.CloseBracket)
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
                const lRegexNameCheck: RegExp = new RegExp(`^[${this.escapeRegExp(this.mConfig.allowedTagNameCharacters)}]+$`);
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
                        // Optional comment node
                        if (this.mConfig.removeComments && lValue instanceof CommentNode) {
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


        // "Reset" parser
        this.mRebuildParser = true;
        this.mParser = null;
    }

    /**
     * Parse xml like string into a xml document.
     * 
     * @param pText - Xml based code compatible to this parser.
     * 
     * @returns a new XmlDocument 
     */
    public parse(pText: string): XmlDocument {
        if (!this.mParser || this.mRebuildParser) {
            const lLexer: Lexer<XmlToken> = this.createLexer();
            this.mParser = this.createParser(lLexer);
        }

        return this.mParser.parse(pText);
    }

    /**
     * Get or create a xml part.
     * {@link pChangeFunction} can configurates the requested part.
     * If the requested {@link XmlPart} does not exists, a new will be created that only holds default information, 
     * that would throw an error on parse.
     * 
     * Returning null in the change function will delete the part.
     * 
     * @param pName - Name of xml part.
     * @param pChangeFunction - Function that configurated the xml part.
     */
    public setXmlPart<TGrapthData extends object, TParseData>(pName: string, pChangeFunction: (pXmlPart: XmlPart<TGrapthData, TParseData>) => XmlPart<TGrapthData, TParseData> | null): void {
        // Try to use existing part.
        let lXmlPart: XmlPart<TGrapthData, TParseData> | undefined = this.mConfig.xmlParts.get(pName);

        // Create new xml part with default values with it does not exits.
        if (!lXmlPart) {
            lXmlPart = {
                name: pName,
                definition: {
                    grapth: (pGrapth: BaseGrammarNode<XmlToken>): BaseGrammarNode<XmlToken> => {
                        return pGrapth;
                    },
                    data: (pData: TGrapthData): TParseData => {
                        return <TParseData><any>pData;
                    }
                }
            };
        }

        // Call change function.
        const lChangedXmlPart: XmlPart<TGrapthData, TParseData> | null = pChangeFunction(lXmlPart);

        // Delete the part when the change function return null
        if (lChangedXmlPart === null) {
            this.mConfig.xmlParts.delete(pName);
        } else {
            // Save default xml part.
            this.mConfig.xmlParts.set(pName, <any>lChangedXmlPart);
        }
    }

    /**
     * Recreate lexer with applied config.
     */
    private createLexer(): Lexer<XmlToken> {
        // TODO: 
        const lLexer: Lexer<XmlToken> = new Lexer<XmlToken>();
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

        // TODO: Generate parts.



        // TODO: Autogenerate content graphs.






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


        // Document.
        type DocumentParseData = {
            content: Array<XmlElement | CommentNode | TextNode>;
        };
        lParser.defineGraphPart('document',
            lParser.graph().loop('content', lParser.partReference('content')),
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

        lParser.setRootGraphPart('document');

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
     * Get documents default namespace.
     */
    protected abstract getDefaultNamespace(): string;
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

    /**
     * Xml parts
     */
    xmlParts: Map<string, XmlPart<object, any>>;

    /**
     * Xml parts that counts as content.
     * Content parts are used for nesting.
     */
    contentParts: Array<string>;
};

/**
 * Information that can be get from attribute strings.
 */
type AttributeInformation = {
    name: string,
    namespacePrefix: string | null,
    value: string,
};

type XmlPart<TGraphData, TParseData> = {
    name: string;
    partConstructor?: IVoidParameterConstructor<object>;
    definition: {
        grapth: (pGrapth: BaseGrammarNode<XmlToken>, pParser: CodeParser<XmlToken, XmlDocument>) => BaseGrammarNode<XmlToken>;
        data: (pData: TGraphData) => TParseData;
    };
};