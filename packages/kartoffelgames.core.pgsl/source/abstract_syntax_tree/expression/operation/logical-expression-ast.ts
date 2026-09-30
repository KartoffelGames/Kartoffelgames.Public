import { EnumUtil } from '@kartoffelgames/core';
import type { LogicalExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { PgslBooleanType } from '../../type/definition/pgsl-boolean-type.ts';
import { ExpressionAstBuilder } from '../expression-ast-builder.ts';
import type { ExpressionAstData, IExpressionAst } from '../i-expression-ast.interface.ts';

/**
 * PGSL structure for a logical expression between two values.
 */
export class LogicalExpressionAst extends AbstractSyntaxTree<LogicalExpressionCst, LogicalExpressionAstData> implements IExpressionAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     * @param pCst - Cst data.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext, pCst: LogicalExpressionCst): LogicalExpressionAstData {
        // Try to convert operator.
        let lOperator: PgslOperator | undefined = EnumUtil.cast(PgslOperator, pCst.operator);
        if (!lOperator) {
            pContext.pushIncident(`Operator "${pCst.operator}" is not a valid operator.`, this);

            lOperator = PgslOperator.ShortCircuitOr;
        }

        // Create list of all short circuit operations.
        const lShortCircuitOperationList: Array<PgslOperator> = [
            PgslOperator.ShortCircuitOr,
            PgslOperator.ShortCircuitAnd
        ];

        // Validate operator usable for logical expressions.
        if (!lShortCircuitOperationList.includes(lOperator as PgslOperator)) {
            pContext.pushIncident(`Operator "${pCst.operator}" can not used for logical expressions.`, this);
        }

        // Read left and right expression attachments.
        const lLeftExpression: IExpressionAst = ExpressionAstBuilder.build(pCst.left).process(pContext);
        const lRightExpression: IExpressionAst = ExpressionAstBuilder.build(pCst.right).process(pContext);

        // Validate left side type.
        if (lLeftExpression.data.resolveType.conversionRankTo(new PgslBooleanType()) === Number.POSITIVE_INFINITY) {
            pContext.pushIncident('Left side of logical expression needs to be a boolean', this);
        }

        // Validate right side type.
        if (lRightExpression.data.resolveType.conversionRankTo(new PgslBooleanType()) === Number.POSITIVE_INFINITY) {
            pContext.pushIncident('Right side of logical expression needs to be a boolean', this);
        }

        return {
            // Expression data.
            leftExpression: lLeftExpression,
            operatorName: lOperator,
            rightExpression: lRightExpression,

            // Expression meta data.
            fixedState: Math.min(lLeftExpression.data.fixedState, lRightExpression.data.fixedState),
            isStorage: false,
            resolveType: new PgslBooleanType(),
            constantValue: null,
            storageAddressSpace: PgslValueAddressSpace.Inherit
        };
    }
}

export type LogicalExpressionAstData = {
    leftExpression: IExpressionAst;
    operatorName: PgslOperator;
    rightExpression: IExpressionAst;
} & ExpressionAstData;