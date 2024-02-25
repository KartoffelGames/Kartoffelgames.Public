import { Exception, IVoidParameterConstructor } from '@kartoffelgames/core.data';
import { AnonymousGrammarNode, BaseGrammarNode, CodeParser, GraphPartReference, Lexer, LexerPattern } from '@kartoffelgames/core.parser';
import { XmlDocument } from '../document/xml-document';
import { BaseXmlNode } from '../node/base-xml-node';

/**
 * XML parser. Can handle none XML conform styles with different parser modes.
 */
export abstract class BaseXmlParser<TTokenType extends string> {
    private readonly mContentParts: Set<string>;
    private mParser: CodeParser<TTokenType, XmlDocument> | null;
    private mRebuildParser: boolean;
    private readonly mRootToken: Set<string>;
    private readonly mToken: Map<string, XmlToken<TTokenType>>;
    private readonly mXmlParts: Map<string, XmlPart<TTokenType, object, any>>;

    /**
     * Xml parts that counts as content.
     * Content parts are used for nesting.
     */
    public get contentParts(): Set<string> {
        return this.mContentParts;
    }

    /**
     * Xml tokens that can be used to start a document.
     * Any other specified tokens are only used by nesting into root tokenes.
     */
    public get rootTokens(): Set<string> {
        return this.mRootToken;
    }

    /**
     * Constructor.
     */
    public constructor() {
        // Set default configs.
        this.mXmlParts = new Map<string, XmlPart<TTokenType, object, any>>();
        this.mContentParts = new Set<string>();
        this.mRootToken = new Set<string>();
        this.mToken = new Map<string, XmlToken<TTokenType>>();

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
            const lLexer: Lexer<TTokenType> = this.createLexer();
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
    public setXmlPart<TGrapthData extends object, TParseData>(pName: string, pChangeFunction: (pXmlPart: XmlPart<TTokenType, TGrapthData, TParseData>) => XmlPart<TTokenType, TGrapthData, TParseData> | null): void {
        // Try to use existing part.
        let lXmlPart: XmlPart<TTokenType, TGrapthData, TParseData> | undefined = this.mXmlParts.get(pName);

        // Create new xml part with default values when it does not exits.
        if (!lXmlPart) {
            lXmlPart = {
                name: pName,
                definition: {
                    grapth: (pGrapth: AnonymousGrammarNode<TTokenType>): BaseGrammarNode<TTokenType> => {
                        return pGrapth;
                    },
                    data: (pData: TGrapthData): TParseData => {
                        return <TParseData><any>pData;
                    }
                }
            };
        }

        // Call change function.
        const lChangedXmlPart: XmlPart<TTokenType, TGrapthData, TParseData> | null = pChangeFunction(lXmlPart);

        // Delete the part when the change function return null
        if (lChangedXmlPart === null) {
            this.mXmlParts.delete(pName);
        } else {
            // Save xml part.
            this.mXmlParts.set(pName, <any>lChangedXmlPart);
        }

        // Rebuild parser.
        this.mRebuildParser = true;
    }

    /**
     * Get or create a xml token.
     * {@link pChangeFunction} can configurates the requested token.
     * If the requested {@link XmlToken} does not exists, a new will be created that only holds default information, 
     * that would throw an error on parse.
     * 
     * Returning null in the change function will delete the token.
     * 
     * @param pName - Name of xml token.
     * @param pChangeFunction - Function that configurated the xml token.
     */
    public setXmlToken(pName: string, pChangeFunction: (pToken: XmlToken<TTokenType>) => XmlToken<TTokenType>): void {
        // Try to get existing token.
        let lXmlToken: XmlToken<TTokenType> | undefined = this.mToken.get(pName);

        // Create new token with default values when it does not exists.
        if (!lXmlToken) {
            lXmlToken = {
                name: pName,
                pattern: { pattern: { regex: /^$/, type: <TTokenType>'' }, specificity: 99 }
            };
        }

        const lChangedXmlToken: XmlToken<TTokenType> | null = pChangeFunction(lXmlToken);

        // Delete the token when the change function return null
        if (lChangedXmlToken === null) {
            this.mToken.delete(pName);
        } else {
            // Save xml token.
            this.mToken.set(pName, <any>lChangedXmlToken);
        }

        // Rebuild parser.
        this.mRebuildParser = true;
    }

    /**
     * Recreate lexer with applied config.
     */
    private createLexer(): Lexer<TTokenType> {
        if (this.mToken.size === 0) {
            throw new Exception('No xml token are specified', this);
        }

        const lLexer: Lexer<TTokenType> = new Lexer<TTokenType>();
        lLexer.validWhitespaces = ' \n';
        lLexer.trimWhitespace = true;

        // Create token order structure.
        type TokenInstance = {
            name: string;
            token: XmlToken<TTokenType>;
            usagedBy: Set<string>;
        };
        const lTokenOrder: Array<TokenInstance> = new Array<TokenInstance>();

        // Add each token.
        for (const lTargetToken of this.mToken.values()) {
            const lTokenInstance: TokenInstance = {
                name: lTargetToken.name,
                token: lTargetToken,
                usagedBy: new Set()
            };

            // Fill out usagedBy.
            for (const lSourceToken of this.mToken.values()) {
                if (lSourceToken.validInner && lSourceToken.validInner.includes(lTargetToken.name)) {
                    lTokenInstance.usagedBy.add(lSourceToken.name);
                }
            }

            lTokenOrder.push(lTokenInstance);
        }

        // Sort token by usage.
        lTokenOrder.sort((pA: TokenInstance, pB: TokenInstance) => {
            if (pA.usagedBy.has(pB.name)) {
                // Move depedency up when a is used by b.
                return -1;
            } else if (pB.usagedBy.has(pA.name)) {
                // Move depedency down when b is used by a.
                return 1;
            }

            return 0;
        });

        // Create lexer token.
        for (const lToken of lTokenOrder) {
            if (lToken.token.validInner) {
                // Add token with inner token.
                lLexer.addTokenTemplate(lToken.name, lToken.token.pattern, (pLexer: Lexer<TTokenType>) => {
                    for (const lInnerTokenName of lToken.token.validInner!) {
                        pLexer.useTokenTemplate(lInnerTokenName);
                    }
                });
            } else {
                // Add token without inner token.
                lLexer.addTokenTemplate(lToken.name, lToken.token.pattern);
            }
        }

        // Add root token
        for (const lRootToken of this.mRootToken) {
            lLexer.useTokenTemplate(lRootToken);
        }

        return lLexer;
    }

    /**
     * Create new code parser.
     * Apply new set config.
     * 
     * @param pLexer - Lexer with applied config.
     */
    private createParser(pLexer: Lexer<TTokenType>): CodeParser<TTokenType, XmlDocument> {
        const lParser: CodeParser<TTokenType, XmlDocument> = new CodeParser<TTokenType, XmlDocument>(pLexer);

        // Generate parts.
        for (const lPart of this.mXmlParts.values()) {
            lParser.defineGraphPart(lPart.name, lPart.definition.grapth(lParser.graph(), lParser), lPart.definition.data);
        }

        // Autogenerate content graphs.
        const lContentElementGrapths: Array<GraphPartReference<TTokenType>> = new Array<GraphPartReference<TTokenType>>();
        for (const lPartName of this.mContentParts) {
            lContentElementGrapths.push(lParser.partReference(lPartName));
        }

        // Content data.
        type ContentData = {
            value: object;
        };
        lParser.defineGraphPart('content',
            lParser.graph().branch('value', lContentElementGrapths),
            (pData: ContentData): any => {
                return pData.value;
            }
        );

        // Document.
        type DocumentParseData = {
            content: Array<BaseXmlNode>;
        };
        lParser.defineGraphPart('document',
            lParser.graph().loop('content', lParser.partReference('content')),
            (pData: DocumentParseData): XmlDocument => {
                const lDocument: XmlDocument = new XmlDocument(this.getDefaultNamespace());

                for (const lValue of pData.content) {
                    // Skip null objects.
                    if (!lValue) {
                        continue;
                    }

                    // XML Element or Text node.
                    lDocument.appendChild(lValue);
                }

                return lDocument;
            }
        );

        lParser.setRootGraphPart('document');

        // Parser was rebuild.
        this.mRebuildParser = false;

        return lParser;
    }

    /**
     * Get documents default namespace.
     */
    protected abstract getDefaultNamespace(): string;
}


type XmlPart<TTokenType extends string, TGraphData, TParseData> = {
    name: string;
    partConstructor?: IVoidParameterConstructor<object>;
    definition: {
        grapth: (pGrapth: AnonymousGrammarNode<TTokenType>, pParser: CodeParser<TTokenType, XmlDocument>) => BaseGrammarNode<TTokenType>;
        data: (pData: TGraphData) => TParseData;
    };
};

type XmlToken<TTokenType extends string> = {
    name: string,
    pattern: LexerPattern<TTokenType>,
    validInner?: Array<string>;
};