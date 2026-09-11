/**
 * Every token type the benchmark language lexer can produce.
 *
 * The benchmark language ("Bdl") is an artificial language that only exists to put
 * a representative load on {@link Lexer} and {@link CodeParser}. It is intentionally
 * unrelated to any real language of this repository.
 */
export const BenchmarkToken = {
    // Trivia.
    Comment: 'Comment',

    // Declaration keywords.
    KeywordModule: 'KeywordModule',
    KeywordImport: 'KeywordImport',
    KeywordAs: 'KeywordAs',
    KeywordAlias: 'KeywordAlias',
    KeywordRecord: 'KeywordRecord',
    KeywordEnum: 'KeywordEnum',
    KeywordFunction: 'KeywordFunction',
    KeywordConst: 'KeywordConst',

    // Statement keywords.
    KeywordLet: 'KeywordLet',
    KeywordIf: 'KeywordIf',
    KeywordElse: 'KeywordElse',
    KeywordWhile: 'KeywordWhile',
    KeywordFor: 'KeywordFor',
    KeywordReturn: 'KeywordReturn',
    KeywordBreak: 'KeywordBreak',
    KeywordContinue: 'KeywordContinue',

    // Expression keywords.
    KeywordNew: 'KeywordNew',
    KeywordNull: 'KeywordNull',

    // Keywords that are only reserved for later language versions.
    ReservedKeyword: 'ReservedKeyword',

    // Nesting token.
    GenericStart: 'GenericStart',
    GenericEnd: 'GenericEnd',
    BlockStart: 'BlockStart',
    BlockEnd: 'BlockEnd',
    ParenthesesStart: 'ParenthesesStart',
    ParenthesesEnd: 'ParenthesesEnd',
    ListStart: 'ListStart',
    ListEnd: 'ListEnd',

    // Assignments.
    Assignment: 'Assignment',
    AssignmentPlus: 'AssignmentPlus',
    AssignmentMinus: 'AssignmentMinus',
    AssignmentMultiply: 'AssignmentMultiply',
    AssignmentDivide: 'AssignmentDivide',
    AssignmentModulo: 'AssignmentModulo',

    // Increment and decrement.
    OperatorIncrement: 'OperatorIncrement',
    OperatorDecrement: 'OperatorDecrement',

    // Comparisons.
    OperatorEqual: 'OperatorEqual',
    OperatorNotEqual: 'OperatorNotEqual',
    OperatorGreaterThanEqual: 'OperatorGreaterThanEqual',
    OperatorLowerThanEqual: 'OperatorLowerThanEqual',
    OperatorGreaterThan: 'OperatorGreaterThan',
    OperatorLowerThan: 'OperatorLowerThan',

    // Logical.
    OperatorAnd: 'OperatorAnd',
    OperatorOr: 'OperatorOr',
    OperatorNot: 'OperatorNot',

    // Arithmetic.
    OperatorPlus: 'OperatorPlus',
    OperatorMinus: 'OperatorMinus',
    OperatorMultiply: 'OperatorMultiply',
    OperatorDivide: 'OperatorDivide',
    OperatorModulo: 'OperatorModulo',

    // Structuring token.
    Comma: 'Comma',
    MemberDelimiter: 'MemberDelimiter',
    Colon: 'Colon',
    Semicolon: 'Semicolon',
    QuestionMark: 'QuestionMark',
    AttributeMarker: 'AttributeMarker',

    // Literals.
    LiteralFloat: 'LiteralFloat',
    LiteralInteger: 'LiteralInteger',
    LiteralString: 'LiteralString',
    LiteralBoolean: 'LiteralBoolean',

    // Anything else.
    Identifier: 'Identifier'
} as const;

export type BenchmarkToken = typeof BenchmarkToken[keyof typeof BenchmarkToken];
