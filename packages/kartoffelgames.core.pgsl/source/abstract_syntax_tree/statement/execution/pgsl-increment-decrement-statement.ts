import { EnumUtil } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import type { IncrementDecrementStatementCst } from '../../../concrete_syntax_tree/statement.type.ts';
import { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { ExpressionAstBuilder } from '../../expression/expression-ast-builder.ts';
import type { IExpressionAst } from '../../expression/i-expression-ast.interface.ts';
import { IStatementAst, StatementAstData } from '../i-statement-ast.interface.ts';

/**
 * PGSL structure holding a increment or decrement statement.
 */
export class IncrementDecrementStatementAst extends AbstractSyntaxTree<IncrementDecrementStatementCst, IncrementDecrementStatementAstData> implements IStatementAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     */
    protected process(pContext: AbstractSyntaxTreeContext): IncrementDecrementStatementAstData {
        // Create list of all bit operations.
        const lIncrementDecrementOperatorList: Array<PgslOperator> = [
            PgslOperator.Increment,
            PgslOperator.Decrement
        ];

        // Try to parse operator and validate operator.
        const lOperator: PgslOperator | undefined = EnumUtil.cast(PgslOperator, this.cst.operator);
        if (!lIncrementDecrementOperatorList.includes(lOperator!)) {
            pContext.pushIncident(`Invalid increment or decrement operator "${this.cst.operator}".`, this);
        }

        // Build expression.
        const lExpression: IExpressionAst = ExpressionAstBuilder.build(this.cst.expression, pContext);

        // Must be a storage.
        if (!lExpression.data.isStorage) {
            pContext.pushIncident('Increment or decrement expression must be applied to a storage expression', this);
        }

        // Shouldnt be a const value.
        if (lExpression.data.fixedState !== PgslValueFixedState.Variable) {
            pContext.pushIncident(`Increment or decrement expression must be a variable`, this);
        }

        return {
            // Statement data.
            operator: lOperator ?? PgslOperator.Increment,
            expression: lExpression
        };
    }
}

export type IncrementDecrementStatementAstData = {
    operator: PgslOperator;
    expression: IExpressionAst;
} & StatementAstData;