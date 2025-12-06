import type { ExpressionCst } from "./expression.type.ts";
import type { Cst, TypeDeclarationCst } from "./general.type.ts";

/*
 * Core.
 */

export type StatementCst = BlockStatementCst | IfStatementCst | WhileStatementCst | DoWhileStatementCst | ForStatementCst | SwitchStatementCst | VariableDeclarationStatementCst | AssignmentStatementCst | FunctionCallStatementCst | IncrementDecrementStatementCst | ReturnStatementCst | BreakStatementCst | ContinueStatementCst | DiscardStatementCst;

/*
 * Block.
 */

export type BlockStatementCst = {
    statements: Array<StatementCst>;
} & Cst<'BlockStatement'>;

/*
 * Branch.
 */

export type IfStatementCst = {
    expression: ExpressionCst;
    block: BlockStatementCst;
    else: IfStatementCst | BlockStatementCst | null;
} & Cst<'IfStatement'>;

export type WhileStatementCst = {
    expression: ExpressionCst;
    block: BlockStatementCst;
} & Cst<'WhileStatement'>;

export type DoWhileStatementCst = {
    expression: ExpressionCst;
    block: BlockStatementCst;
} & Cst<'DoWhileStatement'>;

export type ForStatementCst = {
    init: VariableDeclarationStatementCst | null;
    expression: ExpressionCst | null;
    update: StatementCst | null;
    block: BlockStatementCst;
} & Cst<'ForStatement'>;

export type SwitchStatementCst = {
    expression: ExpressionCst;
    cases: Array<SwitchCaseCst>;
    default: BlockStatementCst;
} & Cst<'SwitchStatement'>;

export type SwitchCaseCst = {
    expression: ExpressionCst;
    block: BlockStatementCst;
} & Cst<'SwitchCase'>;

/*
 * Execution.
 */

export type VariableDeclarationStatementCst = {
    name: string;
    declarationType: string;
    typeDeclaration: TypeDeclarationCst;
    expression: ExpressionCst | null;
} & Cst<'VariableDeclarationStatement'>;

export type AssignmentStatementCst = {
    variable: ExpressionCst;
    assignment: string;
    expression: ExpressionCst;
} & Cst<'AssignmentStatement'>;

export type FunctionCallStatementCst = {
    functionName: string;
    arguments: Array<ExpressionCst>;
} & Cst<'FunctionCallStatement'>;

export type IncrementDecrementStatementCst = {
    operatorName: string;
    expression: ExpressionCst;
} & Cst<'IncrementDecrementStatement'>;

/*
 * Single.
 */

export type ReturnStatementCst = {
    expression: ExpressionCst | null;
} & Cst<'ReturnStatement'>;

export type BreakStatementCst = {
} & Cst<'BreakStatement'>;

export type ContinueStatementCst = {
} & Cst<'ContinueStatement'>;

export type DiscardStatementCst = {
} & Cst<'DiscardStatement'>;
