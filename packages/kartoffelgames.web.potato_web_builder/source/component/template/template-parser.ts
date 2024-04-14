import { Exception } from '@kartoffelgames/core.data';
import { CodeParser, Lexer } from '@kartoffelgames/core.parser';
import { PwbTemplate } from './nodes/pwb-template';
import { BasePwbTemplateNode } from './nodes/base-pwb-template-node';
import { PwbTemplateTextNode } from './nodes/pwb-template-text-node';
import { PwbTemplateXmlNode } from './nodes/pwb-template-xml-node';
import { PwbTemplateInstructionNode } from './nodes/pwb-template-instruction-node';
import { PwbTemplateExpression } from './nodes/values/pwb-template-expression';

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

        const lTokenSpecificityOrder: Array<string> = new Array<string>();
        lTokenSpecificityOrder.push(
            // Stack xml templates.
            'XmlComment',
            'XmlClosingBracket',
            'XmlOpeningBracket',
            'XmlExplicitValue',

            // Stack expressions.
            'Expression',

            // Stack instruction.
            'InstructionStart',
            'InstructionInstruction',
            'InstructionBody',

            // Anything else is a xml value.
            'XmlValue'
        );

        // Apply token stack to current context.
        const lApplyTokenStack = () => {
            for (let lSpecificity: number = 0; lSpecificity < lTokenSpecificityOrder.length; lSpecificity++) {
                const lTokenTemplateName: string = lTokenSpecificityOrder[lSpecificity];
                lLexer.useTokenTemplate(lTokenTemplateName, lSpecificity);
            }
        };

        // Expressions
        lLexer.addTokenTemplate('ExpressionValue', { pattern: { regex: /(?:(?!}}).)*/, type: PwbTemplateToken.ExpressionValue } });
        lLexer.addTokenTemplate('Expression', {
            pattern: {
                start: {
                    regex: /{{/,
                    type: PwbTemplateToken.ExpressionStart
                },
                end: {
                    regex: /}}/,
                    type: PwbTemplateToken.ExpressionEnd
                }
            }
        }, () => {
            lLexer.useTokenTemplate('ExpressionValue', 1);
        });

        // Xml token
        lLexer.addTokenTemplate('XmlIdentifier', { pattern: { regex: /[^>\s\n="/]+/, type: PwbTemplateToken.XmlIdentifier } });
        lLexer.addTokenTemplate('XmlValue', { pattern: { regex: /(?:(?!{{|"|<).)*/, type: PwbTemplateToken.XmlValue } });
        lLexer.addTokenTemplate('XmlComment', { pattern: { regex: /<!--.*?-->/, type: PwbTemplateToken.XmlComment } });
        lLexer.addTokenTemplate('XmlAssignment', { pattern: { regex: /=/, type: PwbTemplateToken.XmlAssignment } });
        lLexer.addTokenTemplate('XmlExplicitValue', {
            pattern: {
                start: {
                    regex: /"/,
                    type: PwbTemplateToken.XmlExplicitValueIdentifier
                },
                end: {
                    regex: /"/,
                    type: PwbTemplateToken.XmlExplicitValueIdentifier
                }
            }
        }, () => {
            lLexer.useTokenTemplate('Expression', 1);
            lLexer.useTokenTemplate('XmlValue', 2);
        });
        lLexer.addTokenTemplate('XmlClosingBracket', {
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
            lLexer.useTokenTemplate('XmlIdentifier', 1);
        });
        lLexer.addTokenTemplate('XmlOpeningBracket', {
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
            lLexer.useTokenTemplate('XmlAssignment', 1);
            lLexer.useTokenTemplate('XmlIdentifier', 1);
            lLexer.useTokenTemplate('XmlExplicitValue', 1);
        });

        // Instruction token
        lLexer.addTokenTemplate('InstructionStart', { pattern: { regex: /\$[^(\s\n/{]+/, type: PwbTemplateToken.InstructionStart } });
        lLexer.addTokenTemplate('InstructionInstructionValue', { pattern: { regex: /[^)]+/, type: PwbTemplateToken.InstructionInstructionValue } });
        lLexer.addTokenTemplate('InstructionInstruction', {
            pattern: {
                start: {
                    regex: /\(/,
                    type: PwbTemplateToken.InstructionInstructionOpeningBracket
                },
                end: {
                    regex: /\)/,
                    type: PwbTemplateToken.InstructionInstructionClosingBracket
                }
            }
        }, () => {
            lLexer.useTokenTemplate('InstructionInstructionValue', 1);
        });
        lLexer.addTokenTemplate('InstructionBody', {
            pattern: {
                start: {
                    regex: /{/,
                    type: PwbTemplateToken.InstructionBodyStartBraket
                },
                end: {
                    regex: /}/,
                    type: PwbTemplateToken.InstructionBodyCloseBraket
                }
            }
        }, () => {
            lApplyTokenStack();
        });

        // Stack templates.
        lApplyTokenStack();

        return lLexer;
    }

    /**
     * Create new code parser instance.
     * 
     * @param pLexer - Lexer instance.
     */
    private createParser(pLexer: Lexer<PwbTemplateToken>): CodeParser<PwbTemplateToken, PwbTemplate> {
        const lParser: CodeParser<PwbTemplateToken, PwbTemplate> = new CodeParser<PwbTemplateToken, PwbTemplate>(pLexer);

        // Expression graph.
        type ExpressionParseData = {
            value?: string;
        };
        lParser.defineGraphPart('Expression',
            lParser.graph()
                .single(PwbTemplateToken.ExpressionStart).optional('value', PwbTemplateToken.ExpressionValue).single(PwbTemplateToken.ExpressionEnd),
            (pData: ExpressionParseData): PwbTemplateExpression => {
                const lExpression: PwbTemplateExpression = new PwbTemplateExpression();
                lExpression.value = pData.value ?? '';

                return lExpression;
            }
        );

        // Attribute graph.
        type XmlAttributeParseData = {
            name: string,
            attributeValue?: {
                list: Array<{
                    value: { text: string; } | PwbTemplateExpression;
                }>;
            };
        };
        lParser.defineGraphPart('XmlAttribute',
            lParser.graph()
                .single('name', PwbTemplateToken.XmlIdentifier)
                .optional('attributeValue',
                    lParser.graph().single(PwbTemplateToken.XmlAssignment).single(PwbTemplateToken.XmlExplicitValueIdentifier)
                        .loop('list',
                            lParser.graph().branch('value', [
                                lParser.partReference('Expression'),
                                lParser.graph().single('text', PwbTemplateToken.XmlValue),
                            ])
                        ).single(PwbTemplateToken.XmlExplicitValueIdentifier)
                ),
            (pData: XmlAttributeParseData): AttributeInformation => {
                const lValues: Array<string | PwbTemplateExpression> = new Array<string | PwbTemplateExpression>();

                // Add value to value list.
                if (pData.attributeValue) {
                    for (const lAttributeValue of pData.attributeValue.list) {
                        if (lAttributeValue.value instanceof PwbTemplateExpression) {
                            lValues.push(lAttributeValue.value);
                        } else {
                            lValues.push(lAttributeValue.value.text);
                        }
                    }
                }

                return {
                    name: pData.name,
                    values: lValues
                };
            }
        );

        // Content data.
        type XmlTextNodeParseData = {
            list: Array<{
                value: { text: string; } | PwbTemplateExpression;
            }>;
        };
        lParser.defineGraphPart('XmlTextNode',
            lParser.graph()
                .loop('list',
                    lParser.graph().branch('value', [
                        lParser.partReference('Expression'),
                        lParser.graph().single('text', PwbTemplateToken.XmlValue),
                        lParser.graph().single(PwbTemplateToken.XmlExplicitValueIdentifier).single('text', PwbTemplateToken.XmlValue).single(PwbTemplateToken.XmlExplicitValueIdentifier)
                    ])
                ),
            (pData: XmlTextNodeParseData): PwbTemplateTextNode => {
                // Create text node.
                const lTextContent = new PwbTemplateTextNode();

                // Add each textnode value to text node.
                for (const lTextNodeValue of pData.list) {
                    if (lTextNodeValue.value instanceof PwbTemplateExpression) {
                        lTextContent.addValue(lTextNodeValue.value);
                    } else {
                        lTextContent.addValue(lTextNodeValue.value.text);
                    }
                }

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
                .single('openingTagName', PwbTemplateToken.XmlIdentifier)
                .loop('attributes', lParser.partReference('XmlAttribute'))
                .branch('closing', [
                    lParser.graph()
                        .single(PwbTemplateToken.XmlCloseClosingBracket),
                    lParser.graph()
                        .single(PwbTemplateToken.XmlCloseBracket)
                        .single('values', lParser.partReference('ContentList'))
                        .single(PwbTemplateToken.XmlOpenClosingBracket)
                        .single('closingTageName', PwbTemplateToken.XmlIdentifier).single(PwbTemplateToken.XmlCloseBracket)
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
                    lElement.setAttribute(lAttribute.name).addValue(...lAttribute.values);
                }

                // Add content values.
                if ('values' in pData.closing) {
                    lElement.appendChild(...pData.closing.values);
                }

                return lElement;
            }
        );

        // Instruction.
        type InstructionParseData = {
            instructionName: string;
            instruction?: { value: string; };
            body?: { value: Array<BasePwbTemplateNode>; };
        };
        lParser.defineGraphPart('InstructionNode',
            lParser.graph()
                .single('instructionName', PwbTemplateToken.InstructionStart)
                .optional('instruction', lParser.graph().single(PwbTemplateToken.InstructionInstructionOpeningBracket).single('value', PwbTemplateToken.InstructionInstructionValue).single(PwbTemplateToken.InstructionInstructionClosingBracket))
                .optional('body', lParser.graph().single(PwbTemplateToken.InstructionBodyStartBraket).single('value', lParser.partReference('ContentList')).single(PwbTemplateToken.InstructionBodyCloseBraket)),
            (pData: InstructionParseData): PwbTemplateInstructionNode => {
                // Create instruction.
                const lInstruction: PwbTemplateInstructionNode = new PwbTemplateInstructionNode();
                lInstruction.instructionType = pData.instructionName.substring(1);

                // Add instruction.
                lInstruction.instruction = pData.instruction?.value ?? '';

                // Add each body content.
                if (pData.body) {
                    lInstruction.appendChild(...pData.body.value);
                }

                return lInstruction;
            }
        );


        // Child content data.
        type ContentParseData = {
            list: Array<{ node: BasePwbTemplateNode | null; }>;
        };
        lParser.defineGraphPart('ContentList',
            lParser.graph().loop('list', lParser.graph().branch('node', [
                lParser.partReference('XmlCommentNode'),
                lParser.partReference('XmlElement'),
                lParser.partReference('InstructionNode'),
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
    XmlIdentifier = 'Identifier',
    XmlAssignment = 'XmlAssignment',
    XmlValue = 'XmlValue',
    XmlComment = 'XmlComment',
    XmlOpenClosingBracket = 'XmlOpenClosingBracket',
    XmlCloseBracket = 'XmlCloseBracket',
    XmlOpenBracket = 'XmlOpenBracket',
    XmlCloseClosingBracket = 'XmlCloseClosingBracket',
    XmlExplicitValueIdentifier = 'XmlExplicitValueIdentifier',

    ExpressionStart = 'ExpressionStart',
    ExpressionEnd = 'ExpressionEnd',
    ExpressionValue = 'ExpressionValue',

    InstructionStart = 'InstructionStart',
    InstructionInstructionValue = 'InstructionInstructionValue',
    InstructionBodyStartBraket = 'InstructionBodyStartBraket',
    InstructionBodyCloseBraket = 'InstructionBodyCloseBraket',
    InstructionInstructionClosingBracket = 'InstructionInstructionClosingBracket',
    InstructionInstructionOpeningBracket = 'InstructionInstructionOpeningBracket'
}

type AttributeInformation = { name: string, values: Array<string | PwbTemplateExpression>; };