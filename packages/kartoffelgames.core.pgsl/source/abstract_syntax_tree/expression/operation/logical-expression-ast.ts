import { EnumUtil } from '@kartoffelgames/core';
import type { LogicalExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { PgslBooleanType } from '../../type/pgsl-boolean-type.ts';
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
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext): LogicalExpressionAstData {
        // Try to convert operator.
        let lOperator: PgslOperator | undefined = EnumUtil.cast(PgslOperator, this.cst.operator);
        if(!lOperator) {
            pContext.pushIncident(`Operator "${this.cst.operator}" is not a valid operator.`, this);

            lOperator = PgslOperator.ShortCircuitOr;
        }

        // Create list of all short circuit operations.
        const lShortCircuitOperationList: Array<PgslOperator> = [
            PgslOperator.ShortCircuitOr,
            PgslOperator.ShortCircuitAnd
        ];

        // Validate operator usable for logical expressions.
        if (!lShortCircuitOperationList.includes(lOperator as PgslOperator)) {
            pContext.pushIncident(`Operator "${this.cst.operator}" can not used for logical expressions.`, this);
        }

        // Read left and right expression attachments.
        const lLeftExpression: IExpressionAst = ExpressionAstBuilder.build(this.cst.left, pContext);
        const lRightExpression: IExpressionAst = ExpressionAstBuilder.build(this.cst.right, pContext);

        // Validate left side type.
        if (!lLeftExpression.data.resolveType.isImplicitCastableInto(new PgslBooleanType().process(pContext))) {
            pContext.pushIncident('Left side of logical expression needs to be a boolean', this);
        }

        // Validate right side type.
        if (!lRightExpression.data.resolveType.isImplicitCastableInto(new PgslBooleanType().process(pContext))) {
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
            resolveType: new PgslBooleanType().process(pContext),
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