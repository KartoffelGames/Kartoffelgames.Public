import type { Cst } from '../../concrete_syntax_tree/general.type.ts';
import { AbstractSyntaxTree } from '../abstract-syntax-tree.ts';

/**
 * PGSL base statement.
 */
export abstract class BaseStatementAst<TCst extends Cst<string> = Cst<string>, TData extends StatementAstData = StatementAstData> extends AbstractSyntaxTree<TCst, TData> { }

/**
 * Control flow of a statement.
 */
export const StatementAstControlFlow = {
    /**
     * Executes next statement.
     */
    Next: 'Next',

    /**
     * Exits function.
     */
    Return: 'Return',

    /**
     * Exits loop or switch.
     */
    Break: 'Break',

    /**
     * Continues loop.
     */
    Continue: 'Continue'
} as const;
export type StatementAstControlFlow = typeof StatementAstControlFlow[keyof typeof StatementAstControlFlow];

export type StatementAstData = {
    /**
     * Control flow behaviour.
     */
    controlFlow: ReadonlyArray<StatementAstControlFlow>;
};