export enum PgslToken {
    // Core
    Identifier = 'Identifier',
    Comment = 'Comment',
    Comma = 'Comma',
    MemberDelimiter = 'MemberDelimiter',
    Colon = 'colon',
    Semicolon = 'Semicolon',
    ReservedKeyword = 'ReservedKeyword',
    AttributeIndicator = 'AttributeIndicator',

    // Assignments
    Assignment = 'Assignment',
    AssignmentPlus = 'AssignmentPlus',
    AssignmentMinus = 'AssignmentMinus',
    AssignmentMultiply = 'AssignmentMultiply',
    AssignmentDivide = 'AssignmentDivide',
    AssignmentModulo = 'AssignmentModulo',
    AssignmentBinaryAnd = 'AssignmentBinaryAnd',
    AssignmentBinaryOr = 'AssignmentBinaryOr',
    AssignmentBinaryXor = 'AssignmentBinaryXor',
    AssignmentShiftRight = 'AssignmentShiftRight',
    AssignmentShiftLeft = 'AssignmentShiftLeft',

    // Operators
    OperatorPlus = 'OperatorPlus',
    OperatorMinus = 'OperatorMinus',
    OperatorMultiply = 'OperatorMultiply',
    OperatorDivide = 'OperatorDivide',
    OperatorModulo = 'OperatorModulo',
    OperatorNot = 'OperatorNot',
    OperatorShiftLeft = 'OperatorShiftLeft',
    OperatorShiftRight = 'OperatorShiftRight',
    OperatorGreaterThan = 'OperatorGreaterThan',
    OperatorLowerThan = 'OperatorLowerThan',
    OperatorGreaterThanEqual = 'OperatorGreaterThanEqual',
    OperatorLowerThanEqual = 'OperatorLowerThanEqual',
    OperatorEqual = 'OperatorEqual',
    OperatorBinaryAnd = 'OperatorBinaryAnd',
    OperatorBinaryOr = 'OperatorBinaryOr',
    OperatorBinaryXor = 'OperatorBinaryXor',
    OperatorBinaryNegate = 'OperatorBinaryNot',
    OperatorShortCircuitAnd = 'ShortCircuitAnd',
    OperatorShortCircuitOr = 'ShortCircuitOr',
    OperatorNotEqual = 'OperatorNotEqual',

    // Template lists
    TemplateListStart = 'TemplateListStart',
    TemplateListEnd = 'TemplateListEnd',

    // Block
    BlockStart = 'BlockStart',
    BlockEnd = 'BlockEnd',

    // Parentheses
    ParenthesesStart = 'ParenthesesStart',
    ParenthesesEnd = 'ParenthesesEnd',

    // Literals
    LiteralBoolean = 'LiteralBoolean',
    LiteralInteger = 'LiteralInteger',
    LiteralFloat = 'LiteralFloat',

    // Keywords
    KeywordAlias = 'KeywordAlias',
    KeywordBreak = 'KeywordBreak',
    KeywordCase = 'KeywordCase',
    KeywordConst = 'KeywordConst',
    KeywordConstAssert = 'KeywordConst_assert',
    KeywordContinue = 'KeywordContinue',
    KeywordContinuing = 'KeywordContinuing',
    KeywordDefault = 'KeywordDefault',
    KeywordDiagnostic = 'KeywordDiagnostic',
    KeywordDiscard = 'KeywordDiscard',
    KeywordElse = 'KeywordElse',
    KeywordEnable = 'KeywordEnable',
    KeywordFunction = 'KeywordFunction',
    KeywordFor = 'KeywordFor',
    KeywordIf = 'KeywordIf',
    KeywordLet = 'KeywordLet',
    KeywordLoop = 'KeywordLoop',
    KeywordOverride = 'KeywordOverride',
    KeywordRequires = 'KeywordRequires',
    KeywordReturn = 'KeywordReturn',
    KeywordStruct = 'KeywordStruct',
    KeywordSwitch = 'KeywordSwitch',
    KeywordVar = 'KeywordVar',
    KeywordWhile = 'KeywordWhile',
    KeywordInclude = 'KeywordInclude'
}