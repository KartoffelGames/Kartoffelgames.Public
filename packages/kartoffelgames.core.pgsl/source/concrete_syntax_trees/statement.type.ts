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
} & Cst;

/*
 * Branch.
 */

export type IfStatementCst = {
    expression: ExpressionCst;
    block: BlockStatementCst;
    else: IfStatementCst | BlockStatementCst | null;
} & Cst;

export type WhileStatementCst = {
    expression: ExpressionCst;
    block: BlockStatementCst;
} & Cst;

export type DoWhileStatementCst = {
    expression: ExpressionCst;
    block: BlockStatementCst;
} & Cst;

export type ForStatementCst = {
    init: VariableDeclarationStatementCst | null;
    expression: ExpressionCst | null;
    update: StatementCst | null;
    block: BlockStatementCst;
} & Cst;

export type SwitchStatementCst = {
    expression: ExpressionCst;
    cases: Array<SwitchCaseCst>;
    default: BlockStatementCst;
} & Cst;

export type SwitchCaseCst = {
    expression: ExpressionCst;
    block: BlockStatementCst;
} & Cst;

/*
 * Execution.
 */

export type VariableDeclarationStatementCst = {
    name: string;
    declarationType: string;
    typeDeclaration: TypeDeclarationCst;
    expression: ExpressionCst | null;
} & Cst;

export type AssignmentStatementCst = {
    variable: ExpressionCst;
    assignment: string;
    expression: ExpressionCst;
} & Cst;

export type FunctionCallStatementCst = {
    functionName: string;
    arguments: Array<ExpressionCst>;
} & Cst;

export type IncrementDecrementStatementCst = {
    operatorName: string;
    expression: ExpressionCst;
} & Cst;

/*
 * Single.
 */

export type ReturnStatementCst = {
    expression: ExpressionCst | null;
} & Cst;

export type BreakStatementCst = {
} & Cst;

export type ContinueStatementCst = {
} & Cst;

export type DiscardStatementCst = {
} & Cst;
