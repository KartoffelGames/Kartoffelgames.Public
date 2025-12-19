import { EnumUtil } from '@kartoffelgames/core';
import { PgslAssignment } from '../../../enum/pgsl-assignment.enum.ts';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import type { AssignmentStatementCst } from '../../../concrete_syntax_tree/statement.type.ts';
import { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { ExpressionAstBuilder } from '../../expression/expression-ast-builder.ts';
import type { IExpressionAst } from '../../expression/i-expression-ast.interface.ts';
import { IStatementAst, StatementAstData } from '../i-statement-ast.interface.ts';

/**
 * PGSL structure holding a assignment statement.
 */
export class AssignmentStatementAst extends AbstractSyntaxTree<AssignmentStatementCst, AssignmentStatementAstData> implements IStatementAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     */
    protected onProcess(pContext: AbstractSyntaxTreeContext): AssignmentStatementAstData {
        // Try to parse assignment.
        const lAssignment: PgslAssignment | undefined = EnumUtil.cast(PgslAssignment, this.cst.assignment);
        if (!lAssignment) {
            pContext.pushIncident(`Operation "${this.cst.assignment}" can not used for assignment statements.`, this);
        }

        // Build variable expression.
        const lVariable: IExpressionAst = ExpressionAstBuilder.build(this.cst.variable, pContext);

        // Must be a storage.
        if (!lVariable.data.isStorage) {
            pContext.pushIncident('Assignment statement must be applied to a storage expression', lVariable);
        }

        // Validate that it is not a constant.
        if (lVariable.data.fixedState !== PgslValueFixedState.Variable) {
            pContext.pushIncident('Assignment statement must be applied to a variable', lVariable);
        }

        // Build expression expression.
        const lExpression: IExpressionAst = ExpressionAstBuilder.build(this.cst.expression, pContext);

        // Validate that it has the same value.
        if (!lExpression.data.resolveType.isImplicitCastableInto(lVariable.data.resolveType)) {
            pContext.pushIncident(`Can't assign a different type to a variable`, lExpression);
        }

        return {
            // Statement data.
            assignment: lAssignment ?? PgslAssignment.Assignment,
            variable: lVariable,
            expression: lExpression
        };
    }
}

export type AssignmentStatementAstData = {
    assignment: PgslAssignment;
    variable: IExpressionAst;
    expression: IExpressionAst;
} & StatementAstData;