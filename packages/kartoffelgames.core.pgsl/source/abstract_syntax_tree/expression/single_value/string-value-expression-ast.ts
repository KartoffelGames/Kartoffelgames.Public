import type { StringValueExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { PgslStringType } from '../../type/definition/pgsl-string-type.ts';
import type { ExpressionAstData, IExpressionAst } from '../i-expression-ast.interface.ts';

/**
 * PGSL syntax tree for a single string value of boolean, float, integer or uinteger.
 */
export class StringValueExpressionAst extends AbstractSyntaxTree<StringValueExpressionCst, StringValueExpressionAstData> implements IExpressionAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     * @param pCst - Cst data.
     */
    protected override onProcess(_pContext: AbstractSyntaxTreeContext, pCst: StringValueExpressionCst): StringValueExpressionAstData {
        return {
            // Expression data.
            value: pCst.textValue,

            // Expression meta data.
            fixedState: PgslValueFixedState.Constant,
            isStorage: false,
            resolveType: new PgslStringType(),
            constantValue: pCst.textValue,
            storageAddressSpace: PgslValueAddressSpace.Inherit
        };
    }
}

export type StringValueExpressionAstData = {
    value: string;
} & ExpressionAstData;