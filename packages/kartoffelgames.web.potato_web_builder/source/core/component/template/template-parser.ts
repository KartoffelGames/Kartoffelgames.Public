import { Exception } from '@kartoffelgames/core';
import { CodeParser, Graph, GraphNode, Lexer, LexerPattern, LexerPatternType } from '@kartoffelgames/core-parser';
import type { BasePwbTemplateNode } from './nodes/base-pwb-template-node.ts';
import { PwbTemplateInstructionNode } from './nodes/pwb-template-instruction-node.ts';
import { PwbTemplateTextNode } from './nodes/pwb-template-text-node.ts';
import { PwbTemplateXmlNode } from './nodes/pwb-template-xml-node.ts';
import { PwbTemplate } from './nodes/pwb-template.ts';
import { PwbTemplateExpression } from './nodes/values/pwb-template-expression.ts';

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
     * 
     * @returns new lexer instance with updated configuration.
     */
    private createLexer(): Lexer<PwbTemplateToken> {
        const lLexer: Lexer<PwbTemplateToken> = new Lexer<PwbTemplateToken>();
        lLexer.validWhitespaces = ' \n\r';
        lLexer.trimWhitespace = true;

        // Expressions
        const lExpressionValue = lLexer.createTokenPattern({ pattern: { regex: /(?:(?!}}).)*/, type: PwbTemplateToken.ExpressionValue } });
        const lExpression = lLexer.createTokenPattern({
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
        }, (pPattern) => {
            pPattern.useChildPattern(lExpressionValue);
        });

        // Xml token
        const lXmlIdentifier = lLexer.createTokenPattern({ pattern: { regex: /[^>\s\n="/]+/, type: PwbTemplateToken.XmlIdentifier } });
        const lXmlValue = lLexer.createTokenPattern({ pattern: { regex: /(?:(?!{{|"|<).)+/, type: PwbTemplateToken.XmlValue } });
        const lXmlComment = lLexer.createTokenPattern({ pattern: { regex: /<!--.*?-->/, type: PwbTemplateToken.XmlComment } });
        const lXmlAssignment = lLexer.createTokenPattern({ pattern: { regex: /=/, type: PwbTemplateToken.XmlAssignment } });
        const lXmlExplicitValue = lLexer.createTokenPattern({
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
        }, (pPattern) => {
            pPattern.useChildPattern(lExpression);
            pPattern.useChildPattern(lXmlValue);
        });
        const lXmlClosingBracket = lLexer.createTokenPattern({
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
        }, (pPattern) => {
            pPattern.useChildPattern(lXmlIdentifier);
        });
        const lXmlOpeningBracket = lLexer.createTokenPattern({
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
        }, (pPattern) => {
            pPattern.useChildPattern(lXmlAssignment);
            pPattern.useChildPattern(lXmlIdentifier);
            pPattern.useChildPattern(lXmlExplicitValue);
        });

        // InstructionValue must be self nested with checking opening and closing brackets. Otherwise $aaa(new Array()) will be parsed to "new Array(" and xml value ")"
        const lInstructionInstructionRawValue = lLexer.createTokenPattern({
            pattern: {
                regex: /[^()"'`/)]+/, type: PwbTemplateToken.InstructionInstructionValue
            }
        });
        const lInstructionInstructionRegexValue = lLexer.createTokenPattern({
            pattern: {
                innerType: PwbTemplateToken.InstructionInstructionValue,
                start: {
                    regex: /\//,
                    type: PwbTemplateToken.InstructionInstructionValue
                },
                end: {
                    regex: /\//,
                    type: PwbTemplateToken.InstructionInstructionValue
                }
            }
        }, (pPattern) => {
            pPattern.useChildPattern(lInstructionInstructionDoubleQuotationValue);
            pPattern.useChildPattern(lInstructionInstructionSingleQuotationValue);
            pPattern.useChildPattern(lInstructionInstructionSpecialQuotationValue);
            pPattern.useChildPattern(lInstructionInstructionBraketValue);
            pPattern.useChildPattern(lInstructionInstructionRawValue);
        });
        const lInstructionInstructionBraketValue = lLexer.createTokenPattern({
            pattern: {
                innerType: PwbTemplateToken.InstructionInstructionValue,
                start: {
                    regex: /\(/,
                    type: PwbTemplateToken.InstructionInstructionValue
                },
                end: {
                    regex: /\)/,
                    type: PwbTemplateToken.InstructionInstructionValue
                }
            }
        }, (pPattern) => {
            pPattern.useChildPattern(lInstructionInstructionRegexValue);
            pPattern.useChildPattern(lInstructionInstructionDoubleQuotationValue);
            pPattern.useChildPattern(lInstructionInstructionSingleQuotationValue);
            pPattern.useChildPattern(lInstructionInstructionSpecialQuotationValue);
            pPattern.useChildPattern(lInstructionInstructionRawValue);
        });
        const lInstructionInstructionDoubleQuotationValue = lLexer.createTokenPattern({
            pattern: {
                innerType: PwbTemplateToken.InstructionInstructionValue,
                start: {
                    regex: /"/,
                    type: PwbTemplateToken.InstructionInstructionValue
                },
                end: {
                    regex: /"/,
                    type: PwbTemplateToken.InstructionInstructionValue
                }
            }
        }, (pPattern) => {
            pPattern.useChildPattern(lInstructionInstructionRegexValue);
            pPattern.useChildPattern(lInstructionInstructionSingleQuotationValue);
            pPattern.useChildPattern(lInstructionInstructionSpecialQuotationValue);
            pPattern.useChildPattern(lInstructionInstructionBraketValue);
            pPattern.useChildPattern(lInstructionInstructionRawValue);
        });
        const lInstructionInstructionSingleQuotationValue = lLexer.createTokenPattern({
            pattern: {
                innerType: PwbTemplateToken.InstructionInstructionValue,
                start: {
                    regex: /'/,
                    type: PwbTemplateToken.InstructionInstructionValue
                },
                end: {
                    regex: /'/,
                    type: PwbTemplateToken.InstructionInstructionValue
                }
            }
        }, (pPattern) => {
            pPattern.useChildPattern(lInstructionInstructionRegexValue);
            pPattern.useChildPattern(lInstructionInstructionDoubleQuotationValue);
            pPattern.useChildPattern(lInstructionInstructionSpecialQuotationValue);
            pPattern.useChildPattern(lInstructionInstructionBraketValue);
            pPattern.useChildPattern(lInstructionInstructionRawValue);
        });
        const lInstructionInstructionSpecialQuotationValue = lLexer.createTokenPattern({
            pattern: {
                innerType: PwbTemplateToken.InstructionInstructionValue,
                start: {
                    regex: /`/,
                    type: PwbTemplateToken.InstructionInstructionValue
                },
                end: {
                    regex: /`/,
                    type: PwbTemplateToken.InstructionInstructionValue
                }
            }
        }, (pPattern) => {
            pPattern.useChildPattern(lInstructionInstructionRegexValue);
            pPattern.useChildPattern(lInstructionInstructionDoubleQuotationValue);
            pPattern.useChildPattern(lInstructionInstructionSingleQuotationValue);
            pPattern.useChildPattern(lInstructionInstructionBraketValue);
            pPattern.useChildPattern(lInstructionInstructionRawValue);
        });

        // Instruction token
        const lInstructionStart = lLexer.createTokenPattern({ pattern: { regex: /\$[^(\s\n/{]+/, type: PwbTemplateToken.InstructionStart } });
        const lInstructionInstruction = lLexer.createTokenPattern({
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
        }, (pPattern) => {
            pPattern.useChildPattern(lInstructionInstructionRegexValue);
            pPattern.useChildPattern(lInstructionInstructionDoubleQuotationValue);
            pPattern.useChildPattern(lInstructionInstructionSingleQuotationValue);
            pPattern.useChildPattern(lInstructionInstructionSpecialQuotationValue);
            pPattern.useChildPattern(lInstructionInstructionBraketValue);
            pPattern.useChildPattern(lInstructionInstructionRawValue);
        });
        const lInstructionBody = lLexer.createTokenPattern({
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
        }, (pPattern) => {
            for (const lPattern of lTokenSpecificityOrder) {
                pPattern.useChildPattern(lPattern);
            }
        });

        const lTokenSpecificityOrder: Array<LexerPattern<PwbTemplateToken, LexerPatternType>> = [
            // Stack xml templates.
            lXmlComment,
            lXmlClosingBracket,
            lXmlOpeningBracket,
            lXmlExplicitValue,

            // Stackexpressions.
            lExpression,

            // Stackinstruction.
            lInstructionStart,
            lInstructionInstruction,
            lInstructionBody,

            // Anything else is a xml value.
            lXmlValue
        ];

        // Stack templates.
        for (const lPattern of lTokenSpecificityOrder) {
            lLexer.useRootTokenPattern(lPattern);
        }

        return lLexer;
    }

    /**
     * Create new code parser instance.
     * 
     * @param pLexer - Lexer instance.
     * 
     * @returns a new code parser instance with set {@link pLexer}.
     */
    private createParser(pLexer: Lexer<PwbTemplateToken>): CodeParser<PwbTemplateToken, PwbTemplate> {
        const lParser: CodeParser<PwbTemplateToken, PwbTemplate> = new CodeParser<PwbTemplateToken, PwbTemplate>(pLexer);

        // Expression graph.
        const lExpression = Graph.define(() => {
            return GraphNode.new<PwbTemplateToken>().required(PwbTemplateToken.ExpressionStart).optional('value', PwbTemplateToken.ExpressionValue).required(PwbTemplateToken.ExpressionEnd);
        }).converter((pData): PwbTemplateExpression => {
            const lExpression: PwbTemplateExpression = new PwbTemplateExpression();
            lExpression.value = pData.value ?? '';

            return lExpression;
        });

        // Attribute graph.
        const lXmlAttributeValueList = Graph.define(() => {
            type Result = {
                data: Array<{
                    value: PwbTemplateExpression | {
                        text: string;
                    };
                }>;
            };
            const lSelfReference: Graph<PwbTemplateToken, any, Result> = lXmlAttributeValueList;

            return GraphNode.new<PwbTemplateToken>().required('data[]',
                GraphNode.new<PwbTemplateToken>().required('value', [
                    lExpression,
                    GraphNode.new<PwbTemplateToken>().required('text', PwbTemplateToken.XmlValue)
                ])
            ).optional('data<-data', lSelfReference);
        }); 
        const lXmlAttribute = Graph.define(() => {
            return GraphNode.new<PwbTemplateToken>().required('name', PwbTemplateToken.XmlIdentifier).optional('attributeValue',
                GraphNode.new<PwbTemplateToken>().required(PwbTemplateToken.XmlAssignment).required(PwbTemplateToken.XmlExplicitValueIdentifier).optional('list<-data', lXmlAttributeValueList).required(PwbTemplateToken.XmlExplicitValueIdentifier)
            );
        }).converter((pData): AttributeInformation => {
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
        });
        const lXmlAttributeList = Graph.define(() => {
            type Result = {
                data: Array<AttributeInformation>;
            };
            const lSelfReference: Graph<PwbTemplateToken, any, Result> = lXmlAttributeList;

            return GraphNode.new<PwbTemplateToken>().required('data[]', lXmlAttribute).optional('data<-data', lSelfReference);
        });

        // Content data.
        const lXmlTextNodeValueList = Graph.define(() => {
            type Result = {
                data: Array<{
                    value: PwbTemplateExpression | {
                        text: string;
                    };
                }>;
            };
            const lSelfReference: Graph<PwbTemplateToken, any, Result> = lXmlTextNodeValueList;

            return GraphNode.new<PwbTemplateToken>().required('data[]',
                GraphNode.new<PwbTemplateToken>().required('value', [
                    lExpression,
                    GraphNode.new<PwbTemplateToken>().required('text', PwbTemplateToken.XmlValue),
                    GraphNode.new<PwbTemplateToken>().required(PwbTemplateToken.XmlExplicitValueIdentifier).required('text', PwbTemplateToken.XmlValue).required(PwbTemplateToken.XmlExplicitValueIdentifier)
                ])
            ).optional('data<-data', lSelfReference);
        });
        const lXmlTextNode = Graph.define(() => {
            return GraphNode.new<PwbTemplateToken>().required('list<-data', lXmlTextNodeValueList);
        }).converter((pData): PwbTemplateTextNode => {
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
        });

        // Ignore comment nodes..
        const lXmlCommentNode = Graph.define(() => {
            return GraphNode.new<PwbTemplateToken>().required(PwbTemplateToken.XmlComment);
        }).converter((): null => {
            return null;
        });

        // Tags
        const lXmlElement = Graph.define(() => {
            return GraphNode.new<PwbTemplateToken>().required(PwbTemplateToken.XmlOpenBracket)
                .required('openingTagName', PwbTemplateToken.XmlIdentifier)
                .optional('attributes<-data', lXmlAttributeList)
                .required('closing', [
                    GraphNode.new<PwbTemplateToken>()
                        .required(PwbTemplateToken.XmlCloseClosingBracket),
                    GraphNode.new<PwbTemplateToken>()
                        .required(PwbTemplateToken.XmlCloseBracket)
                        .required('values', lContentList)
                        .required(PwbTemplateToken.XmlOpenClosingBracket)
                        .required('closingTageName', PwbTemplateToken.XmlIdentifier).required(PwbTemplateToken.XmlCloseBracket)
                ]);
        }).converter((pData): PwbTemplateXmlNode => {
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
        });

        // Instruction.
        const lInstructionNodeValueList = Graph.define(() => {
            const lSelfReference: Graph<PwbTemplateToken, any, { list: Array<string>; }> = lInstructionNodeValueList;
            return GraphNode.new<PwbTemplateToken>().required('list[]', PwbTemplateToken.InstructionInstructionValue).optional('list<-list', lSelfReference);
        });
        const lInstructionNode = Graph.define(() => {
            return GraphNode.new<PwbTemplateToken>()
                .required('instructionName', PwbTemplateToken.InstructionStart)
                .optional('instruction',
                    GraphNode.new<PwbTemplateToken>().required(PwbTemplateToken.InstructionInstructionOpeningBracket).required('value<-list', lInstructionNodeValueList).required(PwbTemplateToken.InstructionInstructionClosingBracket)
                ).optional('body',
                    GraphNode.new<PwbTemplateToken>().required(PwbTemplateToken.InstructionBodyStartBraket).required('value', lContentList).required(PwbTemplateToken.InstructionBodyCloseBraket)
                );
        }).converter((pData): PwbTemplateInstructionNode => {
            // Create instruction.
            const lInstruction: PwbTemplateInstructionNode = new PwbTemplateInstructionNode();
            lInstruction.instructionType = pData.instructionName.substring(1);

            // Add instruction.
            lInstruction.instruction = pData.instruction?.value.join('') ?? '';

            // Add each body content.
            if (pData.body) {
                lInstruction.appendChild(...pData.body.value);
            }

            return lInstruction;
        });

        // Child content data.
        const lContentValueList = Graph.define(() => {
            const lSelfReference: Graph<PwbTemplateToken, any, { list: Array<PwbTemplateTextNode | PwbTemplateXmlNode | PwbTemplateInstructionNode | null>; }> = lContentValueList;
            return GraphNode.new<PwbTemplateToken>().required('list[]', [
                lXmlCommentNode,
                lXmlElement,
                lInstructionNode,
                lXmlTextNode,
            ]).optional('list<-list', lSelfReference);
        });
        const lContentList = Graph.define(() => {
            const lContentReference: Graph<PwbTemplateToken, any, { list: Array<BasePwbTemplateNode | null>; }> = lContentValueList;

            return GraphNode.new<PwbTemplateToken>().optional('list<-list', lContentReference);
        }).converter((pData): Array<BasePwbTemplateNode> => {
            const lContentList: Array<BasePwbTemplateNode> = new Array<BasePwbTemplateNode>();

            for (const lItem of pData.list) {
                // Skip omitted nodes.
                if (lItem === null) {
                    continue;
                }

                lContentList.push(lItem);
            }

            return lContentList;
        });

        // Document.
        const lTemplateRoot = Graph.define(() => {
            return GraphNode.new<PwbTemplateToken>().required('content', lContentList);
        }).converter((pData): PwbTemplate => {
            const lTemplate: PwbTemplate = new PwbTemplate();

            // Add each content to template.
            lTemplate.appendChild(...pData.content);

            return lTemplate;
        });

        // Set root part.
        lParser.setRootGraph(lTemplateRoot);

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