import { EnumUtil } from '@kartoffelgames/core';
import type { BinaryExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import type { BasePgslType } from '../../type/definition/base-pgsl-type.ts';
import { ExpressionAstBuilder } from '../expression-ast-builder.ts';
import type { ExpressionAstData, IExpressionAst } from '../i-expression-ast.interface.ts';

export class BinaryExpressionAst extends AbstractSyntaxTree<BinaryExpressionCst, BinaryExpressionAstData> implements IExpressionAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     * @param pCst - Cst data.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext, pCst: BinaryExpressionCst): BinaryExpressionAstData {
        // Convert operator.
        const lOperator: PgslOperator = EnumUtil.cast<PgslOperator>(PgslOperator, pCst.operator, PgslOperator.None);

        // Read left and right expression attachments.
        const lLeftExpression: IExpressionAst = ExpressionAstBuilder.build(pCst.left).process(pContext);
        const lRightExpression: IExpressionAst = ExpressionAstBuilder.build(pCst.right).process(pContext);

        // Get result type of expression.
        const lResultType: BasePgslType = (() => {
            const lLeftType: BasePgslType = lLeftExpression.data.resolveType;
            const lRightType: BasePgslType = lRightExpression.data.resolveType;

            // A shift allways uses left sides type.
            if (lOperator === PgslOperator.ShiftLeft || lOperator === PgslOperator.ShiftRight) {
                return lLeftType;
            }

            // Rank the conversion in both directions.
            const lLeftToRightRank: number = lLeftType.conversionRankTo(lRightType);
            const lRightToLeftRank: number = lRightType.conversionRankTo(lLeftType);

            // Swap types when the rank to convert to right type is better.
            if (lLeftToRightRank < lRightToLeftRank) {
                return lRightType;
            }

            return lLeftType;
        })();

        return {
            // Expression data.
            leftExpression: lLeftExpression,
            operatorName: lOperator,
            rightExpression: lRightExpression,

            // Expression meta data.
            fixedState: Math.min(lLeftExpression.data.fixedState, lRightExpression.data.fixedState),
            isStorage: false,
            resolveType: lResultType,
            constantValue: null,
            storageAddressSpace: PgslValueAddressSpace.Inherit
        };
    }
}

export type BinaryExpressionAstData = {
    leftExpression: IExpressionAst;
    operatorName: PgslOperator;
    rightExpression: IExpressionAst;
} & ExpressionAstData;