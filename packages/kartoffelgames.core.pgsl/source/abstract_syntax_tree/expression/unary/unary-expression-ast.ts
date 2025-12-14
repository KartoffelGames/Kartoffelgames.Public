import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import { PgslBooleanType } from '../../../type/pgsl-boolean-type.ts';
import { PgslNumericType } from '../../../type/pgsl-numeric-type.ts';
import type { PgslType } from '../../../type/pgsl-type.ts';
import { PgslVectorType } from '../../../type/pgsl-vector-type.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { ExpressionAstData, IExpressionAst } from '../i-expression-ast.interface.ts';
import type { UnaryExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
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
    protected override process(pContext: AbstractSyntaxTreeContext): UnaryExpressionAstData {
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
        if (lExpression.data.returnType instanceof PgslVectorType) {
            lValueType = lExpression.data.returnType.innerType;
        } else {
            lValueType = lExpression.data.returnType;
        }

        const lCastableIntoNumeric = (pType: PgslType, pIncludeUnsigned: boolean, pIncludeFloat: boolean): boolean => {
            if (pIncludeFloat && pType.isImplicitCastableInto(new PgslNumericType(pContext, PgslNumericType.typeName.float16))) {
                return true;
            }

            if (pIncludeFloat && pType.isImplicitCastableInto(new PgslNumericType(pContext, PgslNumericType.typeName.float32))) {
                return true;
            }

            if (pType.isImplicitCastableInto(new PgslNumericType(pContext, PgslNumericType.typeName.unsignedInteger))) {
                return true;
            }

            if (pIncludeUnsigned && pType.isImplicitCastableInto(new PgslNumericType(pContext, PgslNumericType.typeName.signedInteger))) {
                return true;
            }

            return false;
        };

        let lResolveType: PgslType = lExpression.data.returnType;

        // Validate type for each.
        switch (lOperator) {
            case PgslOperator.BinaryNegate: {
                if (!lCastableIntoNumeric(lValueType, true, false)) {
                    pContext.pushIncident(`Binary negation only valid for numeric type.`, this);
                }

                break;
            }
            case PgslOperator.Minus: {
                if (!lCastableIntoNumeric(lValueType, true, true)) {
                    pContext.pushIncident(`Negation only valid for numeric or vector type.`, this);
                    break;
                }

                // Convert an abstract integer into a signed integer.
                if (lResolveType instanceof PgslNumericType && lResolveType.numericTypeName === PgslNumericType.typeName.abstractInteger) {
                    lResolveType = new PgslNumericType(pContext, PgslNumericType.typeName.signedInteger);
                }

                break;
            }
            case PgslOperator.Not: {
                if (!(lValueType instanceof PgslBooleanType)) {
                    pContext.pushIncident(`Boolean negation only valid for boolean type.`, this);
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
            returnType: lResolveType,
            constantValue: lExpression.data.constantValue,
            storageAddressSpace: lExpression.data.storageAddressSpace
        };
    }
}

export type UnaryExpressionAstData = {
    operator: PgslOperator;
    expression: IExpressionAst;
} & ExpressionAstData;