import type { AddressOfExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { PgslPointerType } from '../../type/definition/pgsl-pointer-type.ts';
import { ExpressionAstBuilder } from '../expression-ast-builder.ts';
import type { ExpressionAstData, IExpressionAst } from '../i-expression-ast.interface.ts';

/**
 * PGSL structure holding a variable name used to get the address.
 */
export class AddressOfExpressionAst extends AbstractSyntaxTree<AddressOfExpressionCst, AddressOfExpressionAstData> implements IExpressionAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     * @param pCst - Cst data.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext, pCst: AddressOfExpressionCst): AddressOfExpressionAstData {
        // Read attachment of inner expression.
        const lVariable: IExpressionAst = ExpressionAstBuilder.build(pCst.expression).process(pContext);

        return {
            // Expression data.
            variable: lVariable,

            // Expression meta data.
            fixedState: lVariable.data.fixedState,
            isStorage: false,
            resolveType: new PgslPointerType(lVariable.data.resolveType),
            constantValue: null,
            storageAddressSpace: lVariable.data.storageAddressSpace
        };
    }
}

export type AddressOfExpressionAstData = {
    variable: IExpressionAst;
} & ExpressionAstData;