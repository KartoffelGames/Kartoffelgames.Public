import type { IndexedValueExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import type { BasePgslType } from '../../type/definition/base-pgsl-type.ts';
import { PgslArrayType } from '../../type/definition/pgsl-array-type.ts';
import { PgslMatrixType } from '../../type/definition/pgsl-matrix-type.ts';
import { PgslVectorType } from '../../type/definition/pgsl-vector-type.ts';
import { ExpressionAstBuilder } from '../expression-ast-builder.ts';
import type { ExpressionAstData, IExpressionAst } from '../i-expression-ast.interface.ts';

/**
 * PGSL structure holding a variable with index expression.
 */
export class IndexedValueExpressionAst extends AbstractSyntaxTree<IndexedValueExpressionCst, IndexedValueExpressionAstData> implements IExpressionAst {
    /**
     * Build data of current structure.
     * 
     * @param pContext - Process context.
     * @param pCst - Cst data.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext, pCst: IndexedValueExpressionCst): IndexedValueExpressionAstData {
        // Build value and index expressions.
        const lValue: IExpressionAst = ExpressionAstBuilder.build(pCst.value).process(pContext);
        const lIndex: IExpressionAst = ExpressionAstBuilder.build(pCst.index).process(pContext);

        // Get resolve type of index expression and the values max length if its fixed.
        const [lResolveType, lFixedLength] = ((): [BasePgslType, number] => {
            switch (true) {
                case lValue.data.resolveType instanceof PgslArrayType: {
                    return [lValue.data.resolveType.innerType, lValue.data.resolveType.length ?? -1];
                }

                case lValue.data.resolveType instanceof PgslVectorType: {
                    return [lValue.data.resolveType.innerType, lValue.data.resolveType.dimension];
                }

                case lValue.data.resolveType instanceof PgslMatrixType: {
                    return [lValue.data.resolveType.vectorType, lValue.data.resolveType.columnCount];
                }

                default: {
                    // Somehow could have the same type.
                    return [lValue.data.resolveType, -1];
                }
            }
        })();

        return {
            // Expression data.
            value: lValue,
            index: lIndex,
            fixedLength: lFixedLength,

            // Expression meta data.
            fixedState: Math.min(lValue.data.fixedState, lIndex.data.fixedState),
            isStorage: lValue.data.isStorage,
            resolveType: lResolveType,
            constantValue: null,
            storageAddressSpace: lValue.data.storageAddressSpace
        };
    }
}

export type IndexedValueExpressionAstData = {
    value: IExpressionAst;
    index: IExpressionAst;
    fixedLength: number;
} & ExpressionAstData;
