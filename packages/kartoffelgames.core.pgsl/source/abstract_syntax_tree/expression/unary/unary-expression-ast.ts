import { EnumUtil } from '@kartoffelgames/core';
import type { UnaryExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import type { BasePgslType } from '../../type/definition/base-pgsl-type.ts';
import { PgslBooleanType } from '../../type/definition/pgsl-boolean-type.ts';
import { PgslNumericType } from '../../type/definition/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../type/definition/pgsl-vector-type.ts';
import { ExpressionAstBuilder } from '../expression-ast-builder.ts';
import type { ExpressionAstData, IExpressionAst } from '../i-expression-ast.interface.ts';

/**
 * PGSL structure holding a expression with a single value and a single unary operation.
 */
export class UnaryExpressionAst extends AbstractSyntaxTree<UnaryExpressionCst, UnaryExpressionAstData> implements IExpressionAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     * @param pCst - Cst data.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext, pCst: UnaryExpressionCst): UnaryExpressionAstData {
        // Build expression.
        const lExpression: IExpressionAst = ExpressionAstBuilder.build(pCst.expression).process(pContext);

        // Try to convert operator.
        let lOperator: PgslOperator | undefined = EnumUtil.cast(PgslOperator, pCst.operator);
        if (!lOperator) {
            pContext.pushIncident(`Operator "${pCst.operator}" is not a valid operator.`, this);

            lOperator = PgslOperator.BinaryNegate;
        }

        // Type buffer for validating the processed types.
        let lValueType: BasePgslType;

        // Validate vectors differently.
        if (lExpression.data.resolveType instanceof PgslVectorType) {
            lValueType = lExpression.data.resolveType.innerType;
        } else {
            lValueType = lExpression.data.resolveType;
        }

        const lCastableIntoNumeric = (pType: BasePgslType, pIncludeUnsigned: boolean, pIncludeFloat: boolean): boolean => {
            const lFloar16Type = new PgslNumericType(PgslNumericType.typeName.float16);
            if (pIncludeFloat && pType.conversionRankTo(lFloar16Type) !== Number.POSITIVE_INFINITY) {
                return true;
            }

            const lFloat32Type = new PgslNumericType(PgslNumericType.typeName.float32);
            if (pIncludeFloat && pType.conversionRankTo(lFloat32Type) !== Number.POSITIVE_INFINITY) {
                return true;
            }

            const lUnsignedIntegerType = new PgslNumericType(PgslNumericType.typeName.unsignedInteger);
            if (pType.conversionRankTo(lUnsignedIntegerType) !== Number.POSITIVE_INFINITY) {
                return true;
            }

            const lSignedIntegerType = new PgslNumericType(PgslNumericType.typeName.signedInteger);
            if (pIncludeUnsigned && pType.conversionRankTo(lSignedIntegerType) !== Number.POSITIVE_INFINITY) {
                return true;
            }

            return false;
        };

        const lResolveType: BasePgslType = lExpression.data.resolveType;
        let lConstantValue: string | number | null = lExpression.data.constantValue;

        // Validate type for each.
        switch (lOperator) {
            case PgslOperator.BinaryNegate: {
                if (!lCastableIntoNumeric(lValueType, true, false)) {
                    pContext.pushIncident(`Binary negation only valid for numeric type.`, this);
                }

                // Binary negate constant value.
                if (typeof lConstantValue === 'number') {
                    lConstantValue = ~lConstantValue;
                }

                break;
            }
            case PgslOperator.Minus: {
                if (!lCastableIntoNumeric(lValueType, true, true)) {
                    pContext.pushIncident(`Negation only valid for numeric or vector type.`, this);
                    break;
                }

                // Negate constant value.
                if (typeof lConstantValue === 'number') {
                    lConstantValue = -lConstantValue;
                }

                break;
            }
            case PgslOperator.Not: {
                if (!(lValueType instanceof PgslBooleanType)) {
                    pContext.pushIncident(`Boolean negation only valid for boolean type.`, this);
                }

                // Negate constant value.
                if (typeof lConstantValue === 'number') {
                    lConstantValue = -lConstantValue;
                }

                break;
            }
            default: {
                pContext.pushIncident(`Unknown unary operator "${lOperator}".`, this);
            }
        }

        return {
            // Expression data.
            operator: lOperator,
            expression: lExpression,

            // Expression meta data.
            fixedState: PgslValueFixedState.Variable,
            isStorage: false,
            resolveType: lResolveType,
            constantValue: lConstantValue,
            storageAddressSpace: lExpression.data.storageAddressSpace
        };
    }
}

export type UnaryExpressionAstData = {
    operator: PgslOperator;
    expression: IExpressionAst;
} & ExpressionAstData;