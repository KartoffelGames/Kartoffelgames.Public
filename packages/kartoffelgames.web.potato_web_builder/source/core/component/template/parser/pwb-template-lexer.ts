import { Lexer, LexerPattern, LexerPatternType } from "@kartoffelgames/core-parser";
import { PwbTemplateToken } from "./pwb-template-token.enum.ts";

/**
 * Pwb template lexer. Defines all token patterns for template parsing.
 * Used to tokenize template string for further processing by template parser.
 */
export class PwbTemplateLexer extends Lexer<PwbTemplateToken> {
    /**
     * Constructor.
     * Defines all token patterns and their hierarchy.
     */
    public constructor() {
        super();

        this.validWhitespaces = ' \n\r';
        this.trimWhitespace = true;

        // Expressions
        const lExpressionValue = this.createTokenPattern({ pattern: { regex: /(?:(?!}}).)*/, type: PwbTemplateToken.ExpressionValue } });
        const lExpression = this.createTokenPattern({
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
        const lXmlIdentifier = this.createTokenPattern({ pattern: { regex: /[^>\s\n="/]+/, type: PwbTemplateToken.XmlIdentifier } });
        const lXmlValue = this.createTokenPattern({ pattern: { regex: /(?:(?!{{|"|<).)+/, type: PwbTemplateToken.XmlValue } });
        const lXmlComment = this.createTokenPattern({ pattern: { regex: /<!--.*?-->/, type: PwbTemplateToken.XmlComment } });
        const lXmlAssignment = this.createTokenPattern({ pattern: { regex: /=/, type: PwbTemplateToken.XmlAssignment } });
        const lXmlExplicitValue = this.createTokenPattern({
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
        const lXmlClosingBracket = this.createTokenPattern({
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
        const lXmlOpeningBracket = this.createTokenPattern({
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
        const lInstructionInstructionRawValue = this.createTokenPattern({
            pattern: {
                regex: /[^()"'`/)]+/, type: PwbTemplateToken.InstructionInstructionValue
            }
        });
        const lInstructionInstructionRegexValue = this.createTokenPattern({
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
        const lInstructionInstructionBraketValue = this.createTokenPattern({
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
        const lInstructionInstructionDoubleQuotationValue = this.createTokenPattern({
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
        const lInstructionInstructionSingleQuotationValue = this.createTokenPattern({
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
        const lInstructionInstructionSpecialQuotationValue = this.createTokenPattern({
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
        const lInstructionStart = this.createTokenPattern({ pattern: { regex: /\$[^(\s\n/{]+/, type: PwbTemplateToken.InstructionStart } });
        const lInstructionInstruction = this.createTokenPattern({
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
        const lInstructionBody = this.createTokenPattern({
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
            this.useRootTokenPattern(lPattern);
        }
    }
}