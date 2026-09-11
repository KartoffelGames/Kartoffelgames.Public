/**
 * Syntax tree shape produced by {@link BenchmarkParser}.
 *
 * The tree is an external contract between the parser and everything reading its result,
 * so it lives in its own file instead of being attached to one of both sides.
 *
 * Every node extends a common base node whose type field carries the node name. Node groups
 * are expressed as a base node with a union of names and never as a union of node types,
 * because the graph builder can not infer through a union of object types.
 */

/**
 * Source range of a node. Line start, column start, line end, column end.
 */
export type BenchmarkRange = [lineStart: number, columnStart: number, lineEnd: number, columnEnd: number];

/**
 * Base of every node.
 */
export type BenchmarkNode<TType extends string> = {
    type: TType;
    range: BenchmarkRange;
};

/*
 * General.
 */

export type BenchmarkTypeNode = {
    name: string;
    generics: Array<BenchmarkTypeNode>;
} & BenchmarkNode<'Type'>;

export type BenchmarkAttributeNode = {
    name: string;
    parameters: Array<BenchmarkExpressionNode>;
} & BenchmarkNode<'Attribute'>;

export type BenchmarkCommentNode = {
    text: string;
} & BenchmarkNode<'Comment'>;

/*
 * Expressions.
 */

export type BenchmarkExpressionNodeType = 'LiteralExpression' | 'VariableExpression' | 'ParenthesizedExpression'
    | 'UnaryExpression' | 'BinaryExpression' | 'TernaryExpression' | 'CallExpression' | 'NewExpression'
    | 'MemberExpression' | 'IndexExpression';

export type BenchmarkExpressionNode<TType extends BenchmarkExpressionNodeType = BenchmarkExpressionNodeType> = BenchmarkNode<TType>;

export type BenchmarkLiteralExpressionNode = {
    value: string;
} & BenchmarkExpressionNode<'LiteralExpression'>;

export type BenchmarkVariableExpressionNode = {
    name: string;
} & BenchmarkExpressionNode<'VariableExpression'>;

export type BenchmarkParenthesizedExpressionNode = {
    expression: BenchmarkExpressionNode;
} & BenchmarkExpressionNode<'ParenthesizedExpression'>;

export type BenchmarkUnaryExpressionNode = {
    operator: string;
    expression: BenchmarkExpressionNode;
} & BenchmarkExpressionNode<'UnaryExpression'>;

export type BenchmarkBinaryExpressionNode = {
    operator: string;
    leftExpression: BenchmarkExpressionNode;
    rightExpression: BenchmarkExpressionNode;
} & BenchmarkExpressionNode<'BinaryExpression'>;

export type BenchmarkTernaryExpressionNode = {
    condition: BenchmarkExpressionNode;
    trueExpression: BenchmarkExpressionNode;
    falseExpression: BenchmarkExpressionNode;
} & BenchmarkExpressionNode<'TernaryExpression'>;

export type BenchmarkCallExpressionNode = {
    name: string;
    generics: Array<BenchmarkTypeNode>;
    parameters: Array<BenchmarkExpressionNode>;
} & BenchmarkExpressionNode<'CallExpression'>;

export type BenchmarkNewExpressionNode = {
    typeName: string;
    generics: Array<BenchmarkTypeNode>;
    parameters: Array<BenchmarkExpressionNode>;
} & BenchmarkExpressionNode<'NewExpression'>;

export type BenchmarkMemberExpressionNode = {
    value: BenchmarkExpressionNode;
    property: string;
} & BenchmarkExpressionNode<'MemberExpression'>;

export type BenchmarkIndexExpressionNode = {
    value: BenchmarkExpressionNode;
    index: BenchmarkExpressionNode;
} & BenchmarkExpressionNode<'IndexExpression'>;

/*
 * Statements.
 */

export type BenchmarkStatementNodeType = 'Comment' | 'VariableStatement' | 'AssignmentStatement' | 'IncrementStatement'
    | 'CallStatement' | 'BlockStatement' | 'IfStatement' | 'WhileStatement' | 'ForStatement' | 'ReturnStatement'
    | 'BreakStatement' | 'ContinueStatement';

export type BenchmarkStatementNode<TType extends BenchmarkStatementNodeType = BenchmarkStatementNodeType> = BenchmarkNode<TType>;

export type BenchmarkVariableStatementNode = {
    declarationType: string;
    name: string;
    valueType: BenchmarkTypeNode;
    expression: BenchmarkExpressionNode | null;
} & BenchmarkStatementNode<'VariableStatement'>;

export type BenchmarkAssignmentStatementNode = {
    target: BenchmarkExpressionNode;
    operator: string;
    expression: BenchmarkExpressionNode;
} & BenchmarkStatementNode<'AssignmentStatement'>;

export type BenchmarkIncrementStatementNode = {
    target: BenchmarkExpressionNode;
    operator: string;
} & BenchmarkStatementNode<'IncrementStatement'>;

export type BenchmarkCallStatementNode = {
    expression: BenchmarkExpressionNode;
} & BenchmarkStatementNode<'CallStatement'>;

export type BenchmarkBlockStatementNode = {
    statements: Array<BenchmarkStatementNode>;
} & BenchmarkStatementNode<'BlockStatement'>;

export type BenchmarkIfStatementNode = {
    condition: BenchmarkExpressionNode;
    block: BenchmarkBlockStatementNode;
    elseStatement: BenchmarkStatementNode | null;
} & BenchmarkStatementNode<'IfStatement'>;

export type BenchmarkWhileStatementNode = {
    condition: BenchmarkExpressionNode;
    block: BenchmarkBlockStatementNode;
} & BenchmarkStatementNode<'WhileStatement'>;

export type BenchmarkForStatementNode = {
    init: BenchmarkVariableStatementNode;
    condition: BenchmarkExpressionNode;
    update: BenchmarkStatementNode;
    block: BenchmarkBlockStatementNode;
} & BenchmarkStatementNode<'ForStatement'>;

export type BenchmarkReturnStatementNode = {
    expression: BenchmarkExpressionNode | null;
} & BenchmarkStatementNode<'ReturnStatement'>;

export type BenchmarkBreakStatementNode = BenchmarkStatementNode<'BreakStatement'>;

export type BenchmarkContinueStatementNode = BenchmarkStatementNode<'ContinueStatement'>;

/*
 * Declarations.
 */

export type BenchmarkDeclarationNodeType = 'Comment' | 'ModuleDeclaration' | 'ImportDeclaration' | 'AliasDeclaration'
    | 'EnumDeclaration' | 'RecordDeclaration' | 'ConstantDeclaration' | 'FunctionDeclaration';

export type BenchmarkDeclarationNode<TType extends BenchmarkDeclarationNodeType = BenchmarkDeclarationNodeType> = BenchmarkNode<TType>;

export type BenchmarkModuleDeclarationNode = {
    name: string;
} & BenchmarkDeclarationNode<'ModuleDeclaration'>;

export type BenchmarkImportDeclarationNode = {
    path: string;
    alias: string;
} & BenchmarkDeclarationNode<'ImportDeclaration'>;

export type BenchmarkAliasDeclarationNode = {
    name: string;
    aliasType: BenchmarkTypeNode;
} & BenchmarkDeclarationNode<'AliasDeclaration'>;

export type BenchmarkEnumValueNode = {
    name: string;
    value: BenchmarkExpressionNode;
} & BenchmarkNode<'EnumValue'>;

export type BenchmarkEnumDeclarationNode = {
    name: string;
    values: Array<BenchmarkEnumValueNode>;
} & BenchmarkDeclarationNode<'EnumDeclaration'>;

export type BenchmarkRecordPropertyNode = {
    attributes: Array<BenchmarkAttributeNode>;
    name: string;
    propertyType: BenchmarkTypeNode;
} & BenchmarkNode<'RecordProperty'>;

export type BenchmarkRecordDeclarationNode = {
    attributes: Array<BenchmarkAttributeNode>;
    name: string;
    properties: Array<BenchmarkRecordPropertyNode>;
} & BenchmarkDeclarationNode<'RecordDeclaration'>;

export type BenchmarkConstantDeclarationNode = {
    attributes: Array<BenchmarkAttributeNode>;
    name: string;
    constantType: BenchmarkTypeNode;
    expression: BenchmarkExpressionNode;
} & BenchmarkDeclarationNode<'ConstantDeclaration'>;

export type BenchmarkFunctionParameterNode = {
    name: string;
    parameterType: BenchmarkTypeNode;
} & BenchmarkNode<'FunctionParameter'>;

export type BenchmarkFunctionDeclarationNode = {
    attributes: Array<BenchmarkAttributeNode>;
    name: string;
    parameters: Array<BenchmarkFunctionParameterNode>;
    returnType: BenchmarkTypeNode;
    block: BenchmarkBlockStatementNode;
} & BenchmarkDeclarationNode<'FunctionDeclaration'>;

/*
 * Document.
 */

export type BenchmarkDocumentNode = {
    declarations: Array<BenchmarkDeclarationNode>;
} & BenchmarkNode<'Document'>;
