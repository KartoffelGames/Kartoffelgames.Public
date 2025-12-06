import type { ExpressionCst, ExpressionCstType } from "./expression.type.ts";
import type { Cst, TypeDeclarationCst } from "./general.type.ts";

/*
 * Core.
 */
export type StatementCstType = 'BlockStatement' | 'IfStatement' | 'WhileStatement' | 'DoWhileStatement' | 'ForStatement' | 'SwitchStatement' | 'SwitchCase' | 'VariableDeclarationStatement' | 'AssignmentStatement' | 'FunctionCallStatement' | 'IncrementDecrementStatement' | 'ReturnStatement' | 'BreakStatement' | 'ContinueStatement' | 'DiscardStatement';
export type StatementCst<TStatementType extends StatementCstType> = Cst<TStatementType>;

/*
 * Block.
 */

export type BlockStatementCst = {
    statements: Array<StatementCst<StatementCstType>>;
} & StatementCst<'BlockStatement'>;

/*
 * Branch.
 */

export type IfStatementCst = {
    expression: ExpressionCst<ExpressionCstType>;
    block: BlockStatementCst;
    else: IfStatementCst | BlockStatementCst | null;
} & StatementCst<'IfStatement'>;

export type WhileStatementCst = {
    expression: ExpressionCst<ExpressionCstType>
    block: BlockStatementCst;
} & StatementCst<'WhileStatement'>;

export type DoWhileStatementCst = {
    expression: ExpressionCst<ExpressionCstType>
    block: BlockStatementCst;
} & StatementCst<'DoWhileStatement'>;

export type ForStatementCst = {
    init: VariableDeclarationStatementCst | null;
    expression: ExpressionCst<ExpressionCstType> | null;
    update: StatementCst<StatementCstType> | null;
    block: BlockStatementCst;
} & StatementCst<'ForStatement'>;

export type SwitchStatementCst = {
    expression: ExpressionCst<ExpressionCstType>
    cases: Array<SwitchCaseCst>;
    default: BlockStatementCst;
} & StatementCst<'SwitchStatement'>;

export type SwitchCaseCst = {
    expressions: Array<ExpressionCst<ExpressionCstType>>;
    block: BlockStatementCst;
} & StatementCst<'SwitchCase'>;

/*
 * Execution.
 */

export type VariableDeclarationStatementCst = {
    name: string;
    declarationType: string;
    typeDeclaration: TypeDeclarationCst;
    expression: ExpressionCst<ExpressionCstType> | null;
} & StatementCst<'VariableDeclarationStatement'>;

export type AssignmentStatementCst = {
    variable: ExpressionCst<ExpressionCstType>
    assignment: string;
    expression: ExpressionCst<ExpressionCstType>
} & StatementCst<'AssignmentStatement'>;

export type FunctionCallStatementCst = {
    functionName: string;
    arguments: Array<ExpressionCst<ExpressionCstType>>;
} & StatementCst<'FunctionCallStatement'>;

export type IncrementDecrementStatementCst = {
    operatorName: string;
    expression: ExpressionCst<ExpressionCstType>
} & StatementCst<'IncrementDecrementStatement'>;

/*
 * Single.
 */

export type ReturnStatementCst = {
    expression: ExpressionCst<ExpressionCstType> | null;
} & StatementCst<'ReturnStatement'>;

export type BreakStatementCst = {
} & StatementCst<'BreakStatement'>;

export type ContinueStatementCst = {
} & StatementCst<'ContinueStatement'>;

export type DiscardStatementCst = {
} & StatementCst<'DiscardStatement'>;
