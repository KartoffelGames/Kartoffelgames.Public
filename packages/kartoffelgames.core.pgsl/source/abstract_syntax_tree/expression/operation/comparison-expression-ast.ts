import { EnumUtil } from '@kartoffelgames/core';
import type { ComparisonExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { type BasePgslType, BasePgslTypeKind } from '../../type/definition/base-pgsl-type.ts';
import { PgslBooleanType } from '../../type/definition/pgsl-boolean-type.ts';
import { PgslVectorType } from '../../type/definition/pgsl-vector-type.ts';
import { ExpressionAstBuilder } from '../expression-ast-builder.ts';
import type { ExpressionAstData, IExpressionAst } from '../i-expression-ast.interface.ts';

/**
 * PGSL structure for a comparison expression between two values.
 */
export class ComparisonExpressionAst extends AbstractSyntaxTree<ComparisonExpressionCst, ComparisonExpressionAstData> implements IExpressionAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     * @param pCst - Cst data.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext, pCst: ComparisonExpressionCst): ComparisonExpressionAstData {
        // Try to convert operator.
        let lOperator: PgslOperator | undefined = EnumUtil.cast(PgslOperator, pCst.operator);
        if (!lOperator) {
            pContext.pushIncident(`Operator "${pCst.operator}" is not a valid operator.`, this);

            lOperator = PgslOperator.Equal;
        }

        // Create list of all comparison operations.
        const lComparisonList: Array<PgslOperator> = [
            PgslOperator.Equal,
            PgslOperator.NotEqual,
            PgslOperator.LowerThan,
            PgslOperator.LowerThanEqual,
            PgslOperator.GreaterThan,
            PgslOperator.GreaterThanEqual
        ];

        // Validate operator usable for comparisons.
        if (!lComparisonList.includes(lOperator as PgslOperator)) {
            pContext.pushIncident(`Operator "${pCst.operator}" can not used for comparisons.`, this);
        }

        // Read left and right expression attachments.
        const lLeftExpression: IExpressionAst = ExpressionAstBuilder.build(pCst.left).process(pContext);
        const lRightExpression: IExpressionAst = ExpressionAstBuilder.build(pCst.right).process(pContext);

        // Comparison needs to be the same type or implicitly castable.
        if (lRightExpression.data.resolveType.conversionRankTo(lLeftExpression.data.resolveType) === Number.POSITIVE_INFINITY) {
            pContext.pushIncident(`Comparison can only be between values of the same type.`, this);
        }

        // Type buffer for validating the processed types.
        let lValueType: BasePgslType;

        // Validate vectors differently.
        if (lLeftExpression.data.resolveType instanceof PgslVectorType) {
            lValueType = lLeftExpression.data.resolveType.innerType;
        } else {
            lValueType = lLeftExpression.data.resolveType;
        }

        // Both values need to be numeric or boolean.
        if (!lValueType.isKind(BasePgslTypeKind.Scalar)) {
            pContext.pushIncident(`Comparison can only be between scalar values.`, this);
        }

        // Validate boolean compare.
        if (![PgslOperator.Equal, PgslOperator.NotEqual].includes(lOperator as PgslOperator) && lValueType instanceof PgslBooleanType) {
            pContext.pushIncident(`Boolean can only be compares with "NotEqual" or "Equal"`, this);
        }

        // Any value is converted into a boolean type.
        const lResolveType: BasePgslType = (() => {
            const lBooleanDefinition: PgslBooleanType = new PgslBooleanType();

            // Wrap boolean into a vector when it is a vector expression.
            if (lLeftExpression.data.resolveType instanceof PgslVectorType) {
                return new PgslVectorType(lLeftExpression.data.resolveType.dimension, lBooleanDefinition);
            }

            return lBooleanDefinition;
        })();

        return {
            // Expression data.
            leftExpression: lLeftExpression,
            operatorName: lOperator,
            rightExpression: lRightExpression,

            // Expression meta data.
            fixedState: Math.min(lLeftExpression.data.fixedState, lRightExpression.data.fixedState),
            isStorage: false,
            resolveType: lResolveType,
            constantValue: null,
            storageAddressSpace: PgslValueAddressSpace.Inherit
        };
    }
}

export type ComparisonExpressionAstData = {
    leftExpression: IExpressionAst;
    operatorName: PgslOperator;
    rightExpression: IExpressionAst;
} & ExpressionAstData;