import type { Cst } from "./general.type.ts";

/*
 * Core.
 */

export type ExpressionCst = ArithmeticExpressionCst | BinaryExpressionCst | ComparisonExpressionCst | LogicalExpressionCst | AddressOfExpressionCst | FunctionCallExpressionCst | LiteralExpressionCst | ParenthesizedExpressionCst | StringValueExpressionCst | IndexedValueExpressionCst | PointerExpressionCst | ValueDecompositionExpressionCst | VariableNameExpressionCst | UnaryExpressionCst;

/*
 * Operations.
 */
export type ArithmeticExpressionCst = {
    left: ExpressionCst;
    operator: string;
    right: ExpressionCst;
} & Cst<'ArithmeticExpression'>;

export type BinaryExpressionCst = {
    left: ExpressionCst;
    operator: string;
    right: ExpressionCst;
} & Cst<'BinaryExpression'>;

export type ComparisonExpressionCst = {
    left: ExpressionCst;
    operator: string;
    right: ExpressionCst;
} & Cst<'ComparisonExpression'>;

export type LogicalExpressionCst = {
    left: ExpressionCst;
    operator: string;
    right: ExpressionCst;
} & Cst<'LogicalExpression'>;

/*
 * Single value.
 */
export type AddressOfExpressionCst = {
    expression: ExpressionCst;
} & Cst<'AddressOfExpression'>;

export type FunctionCallExpressionCst = {
    functionName: string;
    arguments: Array<ExpressionCst>;
} & Cst<'FunctionCallExpression'>;

export type LiteralExpressionCst = {
    textValue: string;
} & Cst<'LiteralExpression'>;

export type ParenthesizedExpressionCst = {
    expression: ExpressionCst;
} & Cst<'ParenthesizedExpression'>;

export type StringValueExpressionCst = {
    textValue: string;
} & Cst<'StringValueExpression'>;

/*
 * Storage.
 */
export type IndexedValueExpressionCst = {
    value: ExpressionCst;
    index: ExpressionCst;
} & Cst<'IndexedValueExpression'>;

export type PointerExpressionCst = {
    expression: ExpressionCst;
} & Cst<'PointerExpression'>;

export type ValueDecompositionExpressionCst = {
    value: ExpressionCst;
    property: string;
} & Cst<'ValueDecompositionExpression'>;

export type VariableNameExpressionCst = {
    variableName: string;
} & Cst<'VariableNameExpression'>;

/*
 * Unary.
 */
export type UnaryExpressionCst = {
    expression: ExpressionCst;
    operator: string;
} & Cst<'UnaryExpression'>;