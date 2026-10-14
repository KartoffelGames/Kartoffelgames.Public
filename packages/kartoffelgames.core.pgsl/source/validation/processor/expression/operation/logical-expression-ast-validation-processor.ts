import { BinaryExpressionAst } from '../../../../abstract_syntax_tree/expression/operation/binary-expression-ast.ts';
import { LogicalExpressionAst, type LogicalExpressionAstData } from '../../../../abstract_syntax_tree/expression/operation/logical-expression-ast.ts';
import { BasePgslTypeKind } from '../../../../abstract_syntax_tree/type/definition/base-pgsl-type.ts';
import { PgslOperator } from '../../../../enum/pgsl-operator.enum.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of LogicalExpressionAst.
 */
export class LogicalExpressionAstValidationProcessor extends PgslValidatorProcessor<LogicalExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof LogicalExpressionAst {
        return LogicalExpressionAst;
    }

    /**
     * Validates the PGSL logical expression syntax tree.
     *
     * @param pData - The syntax tree data to validate.
     */
    protected override onValidate(pData: LogicalExpressionAstData): void {
        // Validate left and right expression.
        this.validateAst(pData.leftExpression);
        this.validateAst(pData.rightExpression);

        // Validate that the operator is && or ||.
        const lShortCircuitOperationList: Array<PgslOperator> = [
            PgslOperator.ShortCircuitOr,
            PgslOperator.ShortCircuitAnd
        ];
        if (!lShortCircuitOperationList.includes(pData.operatorName)) {
            this.pushIncident(`Operator "${pData.operatorName}" can not used for logical expressions.`);
        }

        // Validate that none of the expressions is a logical expression itself, as chaining logical expression requires parentheses.
        const lAllowedChainedOperators: Array<PgslOperator> = [PgslOperator.ShiftLeft, PgslOperator.ShiftRight, pData.operatorName];
        for (const lExpression of [pData.leftExpression, pData.rightExpression]) {
            // Chaining restrictions only apply to logical and bit expressions.
            if (!(lExpression instanceof LogicalExpressionAst) && !(lExpression instanceof BinaryExpressionAst)) {
                continue;
            }

            if (!lAllowedChainedOperators.includes(lExpression.data.operatorName)) {
                this.pushIncident(`Mixing operator "${lExpression.data.operatorName}" with "${pData.operatorName}" requires parentheses.`);
            }
        }

        // Validate that the left expression is a bool.
        if (!pData.leftExpression.data.resolveType.isKind(BasePgslTypeKind.Boolean)) {
            this.pushIncident('Left side of logical expression needs to be a boolean', pData.leftExpression);
        }

        // Validate that the right expression is a bool.
        if (!pData.rightExpression.data.resolveType.isKind(BasePgslTypeKind.Boolean)) {
            this.pushIncident('Right side of logical expression needs to be a boolean', pData.rightExpression);
        }
    }
}
