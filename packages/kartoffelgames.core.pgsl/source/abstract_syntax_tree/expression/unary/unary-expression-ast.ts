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

        // Convert operator.
        const lOperator: PgslOperator = EnumUtil.cast<PgslOperator>(PgslOperator, pCst.operator, PgslOperator.None);

        // Type buffer for validating the processed types.
        let lValueType: BasePgslType = (() => {
            // Validate vectors differently.
            if (lExpression.data.resolveType instanceof PgslVectorType) {
                return lExpression.data.resolveType.innerType;
            }

            return lExpression.data.resolveType;
        })();

        let lConstantValue: string | number | null = lExpression.data.constantValue;

        // Validate type for each.
        switch (lOperator) {
            case PgslOperator.BinaryNegate: {
                // Binary negate constant value.
                if (typeof lConstantValue === 'number') {
                    lConstantValue = ~lConstantValue;
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
                // Negate constant value.
                if (typeof lConstantValue === 'number') {
                    lConstantValue = -lConstantValue;
                }

                break;
            }
        }

        return {
            // Expression data.
            operator: lOperator,
            expression: lExpression,
            itemValue: lValueType,

            // Expression meta data.
            fixedState: PgslValueFixedState.Variable,
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
    itemValue: BasePgslType;
} & ExpressionAstData;