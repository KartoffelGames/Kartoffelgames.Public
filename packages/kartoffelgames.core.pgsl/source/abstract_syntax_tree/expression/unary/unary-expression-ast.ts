import { EnumUtil } from '@kartoffelgames/core';
import type { UnaryExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { BasePgslTypeKind, type BasePgslType } from '../../type/definition/base-pgsl-type.ts';
import { PgslVectorType } from '../../type/definition/pgsl-vector-type.ts';
import { ExpressionAstBuilder } from '../expression-ast-builder.ts';
import type { ExpressionAstData, IExpressionAst } from '../i-expression-ast.interface.ts';

/**
 * PGSL structure holding a expression with a single value and a single unary operation.
 */
export class UnaryExpressionAst extends AbstractSyntaxTree<UnaryExpressionCst, UnaryExpressionAstData> implements IExpressionAst {
    /**
     * Build data of current structure.
     * 
     * @param pContext - Process context.
     * @param pCst - Cst data.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext, pCst: UnaryExpressionCst): UnaryExpressionAstData {
        // Build expression.
        const lExpression: IExpressionAst = ExpressionAstBuilder.build(pCst.expression).process(pContext);

        // Convert operator.
        const lOperator: PgslOperator = EnumUtil.cast<PgslOperator>(PgslOperator, pCst.operator, PgslOperator.None);

        // Get item type of the expression type.
        const lItemType: BasePgslType = (() => {
            // Get inner items of vectors.
            if (lExpression.data.resolveType instanceof PgslVectorType) {
                return lExpression.data.resolveType.innerType;
            }

            return lExpression.data.resolveType;
        })();

        let lConstantValue: string | number | null = lExpression.data.constantValue;

        // Process constant value based on operators.
        switch (lOperator) {
            case PgslOperator.BinaryNegate: {
                // Binary negate constant value.
                if (typeof lConstantValue === 'number') {
                    lConstantValue = ~lConstantValue;

                    // Convert calculated constant value to an unsigned integer.
                    if (lItemType.isKind(BasePgslTypeKind.UnsignedInteger)) {
                        lConstantValue = lConstantValue >>> 0;
                    }
                }

                break;
            }
            case PgslOperator.Minus: {
                // Negate constant value.
                if (typeof lConstantValue === 'number') {
                    lConstantValue = -lConstantValue;
                }

                break;
            }
            case PgslOperator.Not: {
                // Negate constant boolean value expressed as number.
                if (typeof lConstantValue === 'number') {
                    lConstantValue = lConstantValue === 0 ? 1 : 0;
                }

                break;
            }
        }

        return {
            // Expression data.
            operator: lOperator,
            expression: lExpression,
            itemType: lItemType,

            // Expression meta data.
            fixedState: lExpression.data.fixedState,
            isStorage: false,
            resolveType: lExpression.data.resolveType,
            constantValue: lConstantValue,
            storageAddressSpace: lExpression.data.storageAddressSpace
        };
    }
}

export type UnaryExpressionAstData = {
    operator: PgslOperator;
    expression: IExpressionAst;
    itemType: BasePgslType;
} & ExpressionAstData;