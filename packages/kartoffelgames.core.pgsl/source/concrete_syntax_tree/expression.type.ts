import type { Cst } from "./general.type.ts";

/*
 * Core.
 */
export type ExpressionCstType = 'ArithmeticExpression' | 'BinaryExpression' | 'ComparisonExpression' | 'LogicalExpression' | 'AddressOfExpression' | 'FunctionCallExpression' | 'NewExpression' | 'LiteralExpression' | 'ParenthesizedExpression' | 'StringValueExpression' | 'IndexedValueExpression' | 'PointerExpression' | 'ValueDecompositionExpression' | 'VariableNameExpression' | 'UnaryExpression';
export type ExpressionCst<TExpressionType extends ExpressionCstType = ExpressionCstType> = Cst<TExpressionType>;

/*
 * Operations.
 */
export type ArithmeticExpressionCst = {
    left: ExpressionCst<ExpressionCstType>;
    operator: string;
    right: ExpressionCst<ExpressionCstType>;
} & ExpressionCst<'ArithmeticExpression'>;

export type BinaryExpressionCst = {
    left: ExpressionCst<ExpressionCstType>;
    operator: string;
    right: ExpressionCst<ExpressionCstType>;
} & ExpressionCst<'BinaryExpression'>;

export type ComparisonExpressionCst = {
    left: ExpressionCst<ExpressionCstType>;
    operator: string;
    right: ExpressionCst<ExpressionCstType>;
} & ExpressionCst<'ComparisonExpression'>;

export type LogicalExpressionCst = {
    left: ExpressionCst<ExpressionCstType>;
    operator: string;
    right: ExpressionCst<ExpressionCstType>;
} & ExpressionCst<'LogicalExpression'>;

/*
 * Single value.
 */
export type AddressOfExpressionCst = {
    expression: ExpressionCst<ExpressionCstType>;
} & ExpressionCst<'AddressOfExpression'>;

export type FunctionCallExpressionCst = {
    functionName: string;
    arguments: Array<ExpressionCst<ExpressionCstType>>;
} & ExpressionCst<'FunctionCallExpression'>;

export type NewExpressionCst = {
    typeName: string;
    arguments: Array<ExpressionCst<ExpressionCstType>>;
} & ExpressionCst<'NewExpression'>;

export type LiteralExpressionCst = {
    textValue: string;
} & ExpressionCst<'LiteralExpression'>;

export type ParenthesizedExpressionCst = {
    expression: ExpressionCst<ExpressionCstType>;
} & ExpressionCst<'ParenthesizedExpression'>;

export type StringValueExpressionCst = {
    textValue: string;
} & ExpressionCst<'StringValueExpression'>;

/*
 * Storage.
 */
export type IndexedValueExpressionCst = {
    value: ExpressionCst<ExpressionCstType>;
    index: ExpressionCst<ExpressionCstType>;
} & ExpressionCst<'IndexedValueExpression'>;

export type PointerExpressionCst = {
    expression: ExpressionCst<ExpressionCstType>;
} & ExpressionCst<'PointerExpression'>;

export type ValueDecompositionExpressionCst = {
    value: ExpressionCst<ExpressionCstType>;
    property: string;
} & ExpressionCst<'ValueDecompositionExpression'>;

export type VariableNameExpressionCst = {
    variableName: string;
} & ExpressionCst<'VariableNameExpression'>;

/*
 * Unary.
 */
export type UnaryExpressionCst = {
    expression: ExpressionCst<ExpressionCstType>;
    operator: string;
} & ExpressionCst<'UnaryExpression'>;