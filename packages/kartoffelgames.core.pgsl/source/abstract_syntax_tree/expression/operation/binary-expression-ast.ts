import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import { PgslNumericType } from '../../../type/pgsl-numeric-type.ts';
import type { PgslType } from '../../../type/pgsl-type.ts';
import { PgslVectorType } from '../../../type/pgsl-vector-type.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { ExpressionAstData, IExpressionAst } from '../i-expression-ast.interface.ts';
import type { BinaryExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { ExpressionAstBuilder } from '../expression-ast-builder.ts';

export class BinaryExpressionAst extends AbstractSyntaxTree<BinaryExpressionCst, BinaryExpressionAstData> implements IExpressionAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     */
    protected override process(pContext: AbstractSyntaxTreeContext): BinaryExpressionAstData {
        // Try to convert operator.
        let lOperator: PgslOperator | undefined = EnumUtil.cast(PgslOperator, this.cst.operator);
        if(!lOperator) {
            pContext.pushIncident(`Operator "${this.cst.operator}" is not a valid operator.`, this);

            lOperator = PgslOperator.BinaryOr;
        }

        // Create list of all bit operations.
        const lComparisonList: Array<PgslOperator> = [
            PgslOperator.BinaryOr,
            PgslOperator.BinaryAnd,
            PgslOperator.BinaryXor,
            PgslOperator.ShiftLeft,
            PgslOperator.ShiftRight
        ];

        // Validate operator usable for bit operations.
        if (!lComparisonList.includes(lOperator as PgslOperator)) {
            pContext.pushIncident(`Operator "${this.cst.operator}" can not used for bit operations.`, this);
        }

        // Read left and right expression attachments.
        const lLeftExpression: IExpressionAst = ExpressionAstBuilder.build(this.cst.left, pContext);
        const lRightExpression: IExpressionAst = ExpressionAstBuilder.build(this.cst.right, pContext);

        // Type buffer for validating the processed types.
        let lLeftValueType: PgslType;
        let lRightValueType: PgslType;

        // Validate vectors differently.
        if (lLeftExpression.data.returnType instanceof PgslVectorType) {
            lLeftValueType = lLeftExpression.data.returnType.innerType;

            // Left and right must be a vector.
            if (lRightExpression.data.returnType instanceof PgslVectorType) {
                lRightValueType = lRightExpression.data.returnType.innerType;

                // Validate that both vectors are of same size.
                if (lLeftExpression.data.returnType.dimension !== lRightExpression.data.returnType.dimension) {
                    pContext.pushIncident('Left and right side of bit expression must be of the same vector size.', this);
                }
            } else {
                pContext.pushIncident('Left and right side of bit expression must be the a vector type.', this);
                lRightValueType = lRightExpression.data.returnType;
            }
        } else {
            // Expression types are the processed types.
            lLeftValueType = lLeftExpression.data.returnType;
            lRightValueType = lRightExpression.data.returnType;
        }

        const lUnsignedInteger: PgslNumericType = new PgslNumericType(pContext, PgslNumericType.typeName.unsignedInteger);
        const lSignedInteger: PgslNumericType = new PgslNumericType(pContext, PgslNumericType.typeName.signedInteger);

        // Left value need to be a integer numeric.
        if (!lLeftValueType.isImplicitCastableInto(lUnsignedInteger) && !lLeftValueType.isImplicitCastableInto(lSignedInteger)) {
            pContext.pushIncident(`Binary operations can only be applied to integer types.`, this);
        }
        if (!lRightValueType.isImplicitCastableInto(lUnsignedInteger) && !lRightValueType.isImplicitCastableInto(lSignedInteger)) {
            pContext.pushIncident(`Binary operations can only be applied to integer types.`, this);
        }

        // Validate that right expression of shift operator needs to be a signed integer.
        if (lOperator === PgslOperator.ShiftLeft || lOperator === PgslOperator.ShiftRight) {
            // Left must be variable.
            if (!lLeftExpression.data.isStorage) {
                pContext.pushIncident(`Left expression of a shift operation must be a variable that can store a value.`, this);
            }

            // Right must be assignable to unsigned integer.
            if (!lRightValueType.isImplicitCastableInto(lUnsignedInteger)) {
                pContext.pushIncident(`Right expression of a shift operation must be an unsigned integer type.`, this);
            }
        }

        return {
            // Expression data.
            leftExpression: lLeftExpression,
            operatorName: lOperator,
            rightExpression: lRightExpression,

            // Expression meta data.
            fixedState: Math.min(lLeftExpression.data.fixedState, lRightExpression.data.fixedState),
            isStorage: false,
            returnType: lLeftExpression.data.returnType,
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