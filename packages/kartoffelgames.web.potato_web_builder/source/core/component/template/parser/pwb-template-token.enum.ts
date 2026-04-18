/**
 * Pwb template token enum. Defines all tokens used for template parsing.
 */
export const PwbTemplateToken = {
    XmlIdentifier: 'Identifier',
    XmlAssignment: 'XmlAssignment',
    XmlValue: 'XmlValue',
    XmlComment: 'XmlComment',
    XmlOpenClosingBracket: 'XmlOpenClosingBracket',
    XmlCloseBracket: 'XmlCloseBracket',
    XmlOpenBracket: 'XmlOpenBracket',
    XmlCloseClosingBracket: 'XmlCloseClosingBracket',
    XmlExplicitValueIdentifier: 'XmlExplicitValueIdentifier',

    ExpressionStart: 'ExpressionStart',
    ExpressionEnd: 'ExpressionEnd',
    ExpressionValue: 'ExpressionValue',

    InstructionStart: 'InstructionStart',
    InstructionInstructionValue: 'InstructionInstructionValue',
    InstructionBodyStartBraket: 'InstructionBodyStartBraket',
    InstructionBodyCloseBraket: 'InstructionBodyCloseBraket',
    InstructionInstructionClosingBracket: 'InstructionInstructionClosingBracket',
    InstructionInstructionOpeningBracket: 'InstructionInstructionOpeningBracket'
} as const;

export type PwbTemplateToken = typeof PwbTemplateToken[keyof typeof PwbTemplateToken];