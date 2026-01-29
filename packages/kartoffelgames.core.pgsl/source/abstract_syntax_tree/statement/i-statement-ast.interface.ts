import type { AbstractSyntaxTree } from '../abstract-syntax-tree.ts';

/**
 * Statement AST interface.
 */
export interface IStatementAst extends AbstractSyntaxTree {
    readonly data: StatementAstData;
}

/* Nothing really needed here */
export type StatementAstData = object; 