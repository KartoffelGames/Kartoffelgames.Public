import type { AbstractSyntaxTree } from '../abstract-syntax-tree.ts';

/**
 * Statement AST interface.
 */
export interface IStatementAst extends AbstractSyntaxTree {
    readonly data: StatementAstData;
}

export type StatementAstData = {};