import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import { PgslNumericType } from '../../../type/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../../type/pgsl-vector-type.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { ExpressionAstData, IExpressionAst } from '../i-expression-ast.interface.ts';
import { ArithmeticExpressionCst } from "../../../concrete_syntax_tree/expression.type.ts";
import { AbstractSyntaxTreeContext } from "../../abstract-syntax-tree-context.ts";
import { ExpressionAstBuilder } from "../expression-ast-builder.ts";

export class ArithmeticExpressionAst extends AbstractSyntaxTree<ArithmeticExpressionCst, ArithmeticExpressionAstData> implements IExpressionAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation trace.
     */
    protected override process(pContext: AbstractSyntaxTreeContext): ArithmeticExpressionAstData {
        // Create list of all arithmetic operations.
        const lComparisonList: Array<PgslOperator> = [
            PgslOperator.Plus,
            PgslOperator.Minus,
            PgslOperator.Multiply,
            PgslOperator.Divide,
            PgslOperator.Modulo
        ];

        // Try to convert operator.
        let lOperator: PgslOperator | undefined = EnumUtil.cast(PgslOperator, this.cst.operator);
        if (!lComparisonList.includes(lOperator as PgslOperator)) {
            pContext.pushIncident(`Operator "${this.cst.operator}" can not used for arithmetic operations.`, this);

            lOperator = PgslOperator.Plus;
        }

        // Read left and right expression attachments.
        const lLeftExpression: IExpressionAst = ExpressionAstBuilder.build(this.cst.left, pContext);
        const lRightExpression: IExpressionAst = ExpressionAstBuilder.build(this.cst.right, pContext);

        // TODO: Also matrix calculations :(
        // TODO: And Mixed vector calculation...

        // Left and right need to be same type or implicitly castable.
        if (!lRightExpression.data.resolveType.isImplicitCastableInto(lLeftExpression.data.resolveType)) {
            pContext.pushIncident('Left and right side of arithmetic expression must be the same type.', this);
        }

        // Validate vector inner values. 
        if (lLeftExpression.data.resolveType instanceof PgslVectorType) {
            // Validate left side vector type. Right ist the same type.
            if (!(lLeftExpression.data.resolveType.innerType instanceof PgslNumericType)) {
                pContext.pushIncident('Left and right side of arithmetic expression must be a numeric vector value', this);
            }
        } else {
            // Validate left side type. Right ist the same type.
            if (!(lLeftExpression.data.resolveType instanceof PgslNumericType)) {
                pContext.pushIncident('Left and right side of arithmetic expression must be a numeric value', this);
            }
        }

        return {
            // Expression data.
            leftExpression: lLeftExpression,
            operator: lOperator!,
            rightExpression: lRightExpression,

            // Expression meta data.
            fixedState: Math.min(lLeftExpression.data.fixedState, lRightExpression.data.fixedState),
            isStorage: false,
            resolveType: lLeftExpression.data.resolveType,
            constantValue: null,
            storageAddressSpace: PgslValueAddressSpace.Inherit
        };
    }
}

export type ArithmeticExpressionAstData = {
    leftExpression: IExpressionAst;
    operator: PgslOperator;
    rightExpression: IExpressionAst;
} & ExpressionAstData;