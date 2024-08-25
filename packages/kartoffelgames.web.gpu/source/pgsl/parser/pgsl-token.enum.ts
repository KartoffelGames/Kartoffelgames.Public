export enum PgslToken {
    // Core
    Identifier = 'Identifier',
    Comment = 'Comment',
    Comma = 'Comma',
    MemberDelimiter = 'MemberDelimiter',
    Colon = 'colon',
    Semicolon = 'Semicolon',
    ReservedKeyword = 'ReservedKeyword',

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
    OperatorIncrement = 'OperatorIncrement',
    OperatorDecrement = 'OperatorDecrement',

    // Template lists
    TemplateListStart = 'TemplateListStart',
    TemplateListEnd = 'TemplateListEnd',

    // Block
    BlockStart = 'BlockStart',
    BlockEnd = 'BlockEnd',

    // List
    ListStart = 'ListStart',
    ListEnd = 'ListEnd',

    // Parentheses
    ParenthesesStart = 'ParenthesesStart',
    ParenthesesEnd = 'ParenthesesEnd',

    // Literals
    LiteralBoolean = 'LiteralBoolean',
    LiteralInteger = 'LiteralInteger',
    LiteralFloat = 'LiteralFloat',
    LiteralString = 'LiteralString',

    // Declaration keywords
    KeywordDeclarationLet = 'KeywordDeclarationLet',
    KeywordDeclarationVar = 'KeywordDeclarationVar',
    KeywordDeclarationStorage = 'KeywordDeclarationStorage',
    KeywordDeclarationUniform = 'KeywordDeclarationUniform',
    KeywordDeclarationWorkgroup = 'KeywordDeclarationWorkgroup',
    KeywordDeclarationPrivate = 'KeywordDeclarationPrivate',
    KeywordDeclarationParam = 'KeywordDeclarationParam',

    // Keywords
    KeywordAlias = 'KeywordAlias',
    KeywordBreak = 'KeywordBreak',
    KeywordCase = 'KeywordCase',
    KeywordDeclarationConst = 'KeywordConst',
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
    KeywordLoop = 'KeywordLoop',
    KeywordRequires = 'KeywordRequires',
    KeywordReturn = 'KeywordReturn',
    KeywordStruct = 'KeywordStruct',
    KeywordSwitch = 'KeywordSwitch',
    KeywordWhile = 'KeywordWhile',
    KeywordEnum = 'KeywordEnum',
    KeywordDo = 'KeywordDo',
    KeywordNew = 'KeywordNew'
}