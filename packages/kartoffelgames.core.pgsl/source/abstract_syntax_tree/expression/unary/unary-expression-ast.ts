import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import { PgslBooleanType } from '../../type/pgsl-boolean-type.ts';
import { PgslNumericType } from '../../type/pgsl-numeric-type.ts';
import type { PgslType } from '../../type/pgsl-type.ts';
import { PgslVectorType } from '../../type/pgsl-vector-type.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import type { ExpressionAstData, IExpressionAst } from '../i-expression-ast.interface.ts';
import type { UnaryExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { ExpressionAstBuilder } from '../expression-ast-builder.ts';

/**
 * PGSL structure holding a expression with a single value and a single unary operation.
 */
export class UnaryExpressionAst extends AbstractSyntaxTree<UnaryExpressionCst, UnaryExpressionAstData> implements IExpressionAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext): UnaryExpressionAstData {
        // Build expression.
        const lExpression: IExpressionAst = ExpressionAstBuilder.build(this.cst.expression, pContext);

        // Try to convert operator.
        let lOperator: PgslOperator | undefined = EnumUtil.cast(PgslOperator, this.cst.operator);
        if(!lOperator) {
            pContext.pushIncident(`Operator "${this.cst.operator}" is not a valid operator.`, this);

            lOperator = PgslOperator.BinaryNegate;
        }

        // Type buffer for validating the processed types.
        let lValueType: PgslType;

        // Validate vectors differently.
        if (lExpression.data.resolveType instanceof PgslVectorType) {
            lValueType = lExpression.data.resolveType.innerType;
        } else {
            lValueType = lExpression.data.resolveType;
        }

        const lCastableIntoNumeric = (pType: PgslType, pIncludeUnsigned: boolean, pIncludeFloat: boolean): boolean => {
            const lFloar16Type = new PgslNumericType(PgslNumericType.typeName.float16).process(pContext);
            if (pIncludeFloat && pType.isImplicitCastableInto(lFloar16Type)) {
                return true;
            }

            const lFloat32Type = new PgslNumericType(PgslNumericType.typeName.float32).process(pContext);
            if (pIncludeFloat && pType.isImplicitCastableInto(lFloat32Type)) {
                return true;
            }

            const lUnsignedIntegerType = new PgslNumericType(PgslNumericType.typeName.unsignedInteger).process(pContext);
            if (pType.isImplicitCastableInto(lUnsignedIntegerType)) {
                return true;
            }

            const lSignedIntegerType = new PgslNumericType(PgslNumericType.typeName.signedInteger).process(pContext);
            if (pIncludeUnsigned && pType.isImplicitCastableInto(lSignedIntegerType)) {
                return true;
            }

            return false;
        };

        const lResolveType: PgslType = lExpression.data.resolveType;
        let lConstantValue: string | number | null = lExpression.data.constantValue;

        // Validate type for each.
        switch (lOperator) {
            case PgslOperator.BinaryNegate: {
                if (!lCastableIntoNumeric(lValueType, true, false)) {
                    pContext.pushIncident(`Binary negation only valid for numeric type.`, this);
                }

                // Binary negate constant value.
                if(typeof lConstantValue === 'number') {
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
                if(typeof lConstantValue === 'number') {
                    lConstantValue = -lConstantValue;
                }

                break;
            }
            case PgslOperator.Not: {
                if (!(lValueType instanceof PgslBooleanType)) {
                    pContext.pushIncident(`Boolean negation only valid for boolean type.`, this);
                }

                // Negate constant value.
                if(typeof lConstantValue === 'number') {
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