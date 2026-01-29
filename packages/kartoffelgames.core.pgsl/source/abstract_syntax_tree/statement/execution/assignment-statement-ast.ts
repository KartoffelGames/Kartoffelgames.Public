import { EnumUtil } from '@kartoffelgames/core';
import { PgslAssignment } from '../../../enum/pgsl-assignment.enum.ts';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import type { AssignmentStatementCst } from '../../../concrete_syntax_tree/statement.type.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { ExpressionAstBuilder } from '../../expression/expression-ast-builder.ts';
import type { IExpressionAst } from '../../expression/i-expression-ast.interface.ts';
import type { IStatementAst, StatementAstData } from '../i-statement-ast.interface.ts';
import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import type { ExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';

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
        const lVariable: IExpressionAst = ExpressionAstBuilder.build(this.cst.variable).process(pContext);

        // Must be a storage.
        if (!lVariable.data.isStorage) {
            pContext.pushIncident('Assignment statement must be applied to a storage expression.', lVariable);
        }

        // Validate that it is not a constant.
        if (lVariable.data.fixedState !== PgslValueFixedState.Variable) {
            pContext.pushIncident('Assignment statement must be applied to a variable.', lVariable);
        }

        // Special assignments must validate that the variable type supports the operation.
        const [lCoreOperator, lOperatorType] = this.coreOperatorOfAssignment(lAssignment as PgslAssignment);
        let lExpressionCst: ExpressionCst;
        if (lOperatorType === 'arithmetic') {
            lExpressionCst = {
                type: 'ArithmeticExpression',
                range: this.cst.range,
                left: lVariable.cst,
                operator: lCoreOperator,
                right: this.cst.expression
            } as ExpressionCst<'ArithmeticExpression'>;
        } else if (lOperatorType === 'bitwise') {
            lExpressionCst = {
                type: 'BinaryExpression',
                range: this.cst.range,
                left: lVariable.cst,
                operator: lCoreOperator,
                right: this.cst.expression
            } as ExpressionCst<'BinaryExpression'>;
        } else {
            lExpressionCst = this.cst.expression;
        }

        // Build expression expression.
        const lExpression: IExpressionAst = ExpressionAstBuilder.build(lExpressionCst).process(pContext);

        // Validate that it has the same value.
        if (!lExpression.data.resolveType.isImplicitCastableInto(lVariable.data.resolveType)) {
            pContext.pushIncident(`Can't assign a different type to a variable.`, lExpression);
        }

        return {
            // Statement data.
            assignment: lAssignment ?? PgslAssignment.Assignment,
            variable: lVariable,

            // Build the real expression that should be assigned.
            expression: ExpressionAstBuilder.build(this.cst.expression).process(pContext)
        };
    }

    private coreOperatorOfAssignment(pAssignment: PgslAssignment): [PgslOperator | null, AssignmentStatementAstDataOperatorType] {
        switch (pAssignment) {
            case PgslAssignment.Assignment:
                return [null, 'none'];
            case PgslAssignment.AssignmentPlus:
                return [PgslOperator.Plus, 'arithmetic'];
            case PgslAssignment.AssignmentMinus:
                return [PgslOperator.Minus, 'arithmetic'];
            case PgslAssignment.AssignmentMultiply:
                return [PgslOperator.Multiply, 'arithmetic'];
            case PgslAssignment.AssignmentDivide:
                return [PgslOperator.Divide, 'arithmetic'];
            case PgslAssignment.AssignmentModulo:
                return [PgslOperator.Modulo, 'arithmetic'];
            case PgslAssignment.AssignmentBinaryAnd:
                return [PgslOperator.BinaryAnd, 'bitwise'];
            case PgslAssignment.AssignmentBinaryOr:
                return [PgslOperator.BinaryOr, 'bitwise'];
            case PgslAssignment.AssignmentBinaryXor:
                return [PgslOperator.BinaryXor, 'bitwise'];
            case PgslAssignment.AssignmentShiftRight:
                return [PgslOperator.ShiftRight, 'bitwise'];
            case PgslAssignment.AssignmentShiftLeft:
                return [PgslOperator.ShiftLeft, 'bitwise'];
        }
    }
}

type AssignmentStatementAstDataOperatorType = 'bitwise' | 'arithmetic' | 'none';

export type AssignmentStatementAstData = {
    assignment: PgslAssignment;
    variable: IExpressionAst;
    expression: IExpressionAst;
} & StatementAstData;