import { Exception } from '@kartoffelgames/core';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import { PgslArrayType } from '../../../type/pgsl-array-type.ts';
import { PgslMatrixType } from '../../../type/pgsl-matrix-type.ts';
import { PgslNumericType } from '../../../type/pgsl-numeric-type.ts';
import type { PgslType } from '../../../type/pgsl-type.ts';
import { PgslVectorType } from '../../../type/pgsl-vector-type.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { ExpressionAstData, IExpressionAst } from '../i-expression-ast.interface.ts';
import type { IndexedValueExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { ExpressionAstBuilder } from '../expression-ast-builder.ts';

/**
 * PGSL structure holding a variable with index expression.
 */
export class IndexedValueExpressionAst extends AbstractSyntaxTree<IndexedValueExpressionCst, IndexedValueExpressionAstData> implements IExpressionAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     */
    protected override process(pContext: AbstractSyntaxTreeContext): IndexedValueExpressionAstData {
        // Build value and index expressions.
        const lValue: IExpressionAst = ExpressionAstBuilder.build(this.cst.value, pContext);
        const lIndex: IExpressionAst = ExpressionAstBuilder.build(this.cst.index, pContext);

        // Value needs to be indexable.
        if (!lValue.data.returnType.indexable) {
            pContext.pushIncident('Value of index expression needs to be a indexable composite value.', this);
        }

        // Value needs to be a unsigned numeric value.
        if (!lIndex.data.returnType.isImplicitCastableInto(new PgslNumericType(pContext, PgslNumericType.typeName.unsignedInteger))) {
            pContext.pushIncident('Index needs to be a unsigned numeric value.', this);
        }

        const lResolveType: PgslType = (() => {
            switch (true) {
                case lValue.data.returnType instanceof PgslArrayType: {
                    return lValue.data.returnType.innerType;
                }

                case lValue.data.returnType instanceof PgslVectorType: {
                    return lValue.data.returnType.innerType;
                }

                case lValue.data.returnType instanceof PgslMatrixType: {
                    return lValue.data.returnType.vectorType;
                }

                default: {
                    pContext.pushIncident('Type does not support a index signature', this);

                    // Somehow could have the same type.
                    return lValue.data.returnType;
                }
            }
        })();

        return {
            // Expression data.
            value: lValue,
            index: lIndex,

            // Expression meta data.
            fixedState: PgslValueFixedState.Variable,
            isStorage: true,
            returnType: lResolveType,
            constantValue: null,
            storageAddressSpace: lValue.data.storageAddressSpace
        };
    }
}

export type IndexedValueExpressionAstData = {
    value: IExpressionAst;
    index: IExpressionAst;
} & ExpressionAstData;
