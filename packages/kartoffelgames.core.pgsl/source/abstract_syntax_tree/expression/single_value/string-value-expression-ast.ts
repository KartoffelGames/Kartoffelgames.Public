import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import { PgslStringType } from '../../type/pgsl-string-type.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import type { ExpressionAstData, IExpressionAst } from '../i-expression-ast.interface.ts';
import type { StringValueExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';

/**
 * PGSL syntax tree for a single string value of boolean, float, integer or uinteger.
 */
export class StringValueExpressionAst extends AbstractSyntaxTree<StringValueExpressionCst, StringValueExpressionAstData> implements IExpressionAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext): StringValueExpressionAstData {
        return {
            // Expression data.
            value: this.cst.textValue,

            // Expression meta data.
            fixedState: PgslValueFixedState.Constant,
            isStorage: false,
            resolveType: new PgslStringType().process(pContext),
            constantValue: this.cst.textValue,
            storageAddressSpace: PgslValueAddressSpace.Inherit
        };
    }
}

export type StringValueExpressionAstData = {
    value: string;
} & ExpressionAstData;