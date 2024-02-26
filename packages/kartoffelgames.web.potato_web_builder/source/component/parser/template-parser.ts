import { BaseXmlNode, XmlDocument, XmlParser } from '@kartoffelgames/core.xml';
import { XmlTokenType } from '@kartoffelgames/core.xml/library/source/parser/xml-token-type.enum';
import { MultiplicatorNode } from './multiplicator-node';
import { Exception } from '@kartoffelgames/core.data';
import { AnonymousGrammarNode, BaseGrammarNode, CodeParser } from '@kartoffelgames/core.parser';
import { AttributeInformation } from '@kartoffelgames/core.xml/library/source/parser/xml-parser';

/**
 * XML parser for parsing template strings.
 */
export class TemplateParser extends XmlParser<MultiplicatorNodeTokenType> {
    /**
     * Constructor.
     * Set new setting for parsing attributes with special characters and remove comments.
     */
    public constructor() {
        super();

        // Attribute name with everything.
        this.allowedAttributeCharacters = 'abcdefghijklmnopqrstuvwxyz_:-.1234567890*[]()$§%&?#';

        // Remove user comments.
        this.removeComments = true;

        // Add new multiplicator node.
        this.addMultiplicatorNodeToken();
        this.addMultiplicatorNode();
    }

    /**
     * Add multiplicator node xml part.
     */
    private addMultiplicatorNode(): void {
        this.contentParts.add('multiplicatorTag');

        // Xml tag
        type MultiplicatorTagParseData = {
            openingTypeName: string;
            attributes: Array<AttributeInformation>,
            ending: {} | {
                values: Array<BaseXmlNode | null>;
                closingTypeName: string;
            };
        };
        this.setXmlPart<MultiplicatorTagParseData, MultiplicatorNode>('multiplicatorTag', (pXmlPart) => {
            // Set default comment node constructor.
            pXmlPart.partConstructor = MultiplicatorNode;

            // Set comment grapth.
            pXmlPart.definition.grapth = (pGraph: AnonymousGrammarNode<XmlTokenType | MultiplicatorNodeTokenType>, pParser: CodeParser<XmlTokenType | MultiplicatorNodeTokenType, XmlDocument>): BaseGrammarNode<XmlTokenType | MultiplicatorNodeTokenType> => {
                return pGraph
                    .single(MultiplicatorNodeTokenType.OpenBracket)
                    .single('openingTypeName', XmlTokenType.Identifier)
                    .loop('attributes', pParser.partReference('attribute'))
                    .branch('ending', [
                        pParser.graph()
                            .single(MultiplicatorNodeTokenType.CloseClosingBracket),
                        pParser.graph()
                            .single(MultiplicatorNodeTokenType.CloseBracket)
                            .loop('values', pParser.partReference('content'))
                            .single(MultiplicatorNodeTokenType.OpenClosingBracket)
                            .single('closingTypeName', XmlTokenType.Identifier).single(MultiplicatorNodeTokenType.CloseBracket)
                    ]);
            };

            // Set comment data parser.
            pXmlPart.definition.data = (pData: MultiplicatorTagParseData) => {
                if (!pXmlPart.partConstructor) {
                    throw new Exception('Xml node constructor needs to be set.', this);
                }

                // Validate data consistency.
                if ('closingTypeName' in pData.ending) {
                    if (pData.openingTypeName !== pData.ending.closingTypeName) {
                        throw new Exception(`Opening (${pData.openingTypeName}) and closing tagname (${pData.ending.closingTypeName}) does not match`, this);
                    }
                }

                // Validate tag name.
                const lRegexNameCheck: RegExp = new RegExp(`^[${this.escapeRegExp(this.allowedTagNameCharacters)}]+$`);
                if (!lRegexNameCheck.test(pData.openingTypeName)) {
                    throw new Exception(`TypeName contains illegal characters: "${pData.openingTypeName}"`, this);
                }

                // Create xml element.
                const lElement: MultiplicatorNode = new (<typeof MultiplicatorNode>pXmlPart.partConstructor)();
                lElement.tagName = pData.openingTypeName;

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
     * Add multiplicator node token.
     * Add them to the root.
     */
    private addMultiplicatorNodeToken(): void {
        // Set multiplicator token as root token.
        this.rootTokens.add('MultiplicatorOpeningTag');
        this.rootTokens.add('MultiplicatorClosingTag');

        // Specify multiplicator node token
        this.setXmlToken('MultiplicatorClosingTag', (pToken) => {
            pToken.validInner = ['Identifier'];
            pToken.pattern = {
                pattern: {
                    start: {
                        regex: /\[\//,
                        type: MultiplicatorNodeTokenType.OpenClosingBracket
                    },
                    end: {
                        regex: /\]/,
                        type: MultiplicatorNodeTokenType.CloseBracket
                    }
                }, specificity: 1
            };
            return pToken;
        });
        this.setXmlToken('MultiplicatorOpeningTag', (pToken) => {
            pToken.validInner = ['Identifier', 'ExplicitValue', 'Assignment'];
            pToken.pattern = {
                pattern: {
                    start: {
                        regex: /\[/,
                        type: MultiplicatorNodeTokenType.OpenBracket
                    },
                    end: {
                        regex: /(?<closeClosingBracket>\/\])|(?<closeBracket>\])/,
                        type: {
                            closeClosingBracket: MultiplicatorNodeTokenType.CloseClosingBracket,
                            closeBracket: MultiplicatorNodeTokenType.CloseBracket
                        }
                    }
                }, specificity: 2
            };
            return pToken;
        });
    }
}

enum MultiplicatorNodeTokenType {
    OpenBracket = 'MultiplicatorOpenBracket',
    OpenClosingBracket = 'MultiplicatorOpenClosingBracket',
    CloseBracket = 'MultiplicatorCloseBracket',
    CloseClosingBracket = 'MultiplicatorCloseClosingBracket'
}