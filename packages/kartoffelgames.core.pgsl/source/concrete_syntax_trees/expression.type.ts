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
} & Cst;

export type BinaryExpressionCst = {
    left: ExpressionCst;
    operator: string;
    right: ExpressionCst;
} & Cst;

export type ComparisonExpressionCst = {
    left: ExpressionCst;
    operator: string;
    right: ExpressionCst;
} & Cst;

export type LogicalExpressionCst = {
    left: ExpressionCst;
    operator: string;
    right: ExpressionCst;
} & Cst;

/*
 * Single value.
 */
export type AddressOfExpressionCst = {
    expression: ExpressionCst;
} & Cst;

export type FunctionCallExpressionCst = {
    functionName: string;
    arguments: Array<ExpressionCst>;
} & Cst;

export type LiteralExpressionCst = {
    textValue: string;
} & Cst;

export type ParenthesizedExpressionCst = {
    expression: ExpressionCst;
} & Cst;

export type StringValueExpressionCst = {
    textValue: string;
} & Cst;

/*
 * Storage.
 */
export type IndexedValueExpressionCst = {
    value: ExpressionCst;
    index: ExpressionCst;
} & Cst;

export type PointerExpressionCst = {
    expression: ExpressionCst;
} & Cst;

export type ValueDecompositionExpressionCst = {
    value: ExpressionCst;
    property: string;
} & Cst;

export type VariableNameExpressionCst = {
    variableName: string;
} & Cst;

/*
 * Unary.
 */
export type UnaryExpressionCst = {
    expression: ExpressionCst;
    operator: string;
} & Cst;