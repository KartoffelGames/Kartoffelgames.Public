import { Exception } from '@kartoffelgames/core';
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import { PgslPointerType } from '../../../type/pgsl-pointer-type.ts';
import type { PgslType } from '../../../type/pgsl-type.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { ExpressionAstData, IExpressionAst } from '../i-expression-ast.interface.ts';
import type { AddressOfExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { ExpressionAstBuilder } from '../expression-ast-builder.ts';

/**
 * PGSL structure holding a variable name used to get the address.
 */
export class AddressOfExpressionAst extends AbstractSyntaxTree<AddressOfExpressionCst, AddressOfExpressionAstData> implements IExpressionAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext): AddressOfExpressionAstData {
        // Read attachment of inner expression.
        const lVariable: IExpressionAst = ExpressionAstBuilder.build(this.cst.expression, pContext);

        // Type of expression needs to be storable.
        if (!lVariable.data.isStorage) {
            pContext.pushIncident(`Target of address needs to a stored value`, this);
        }

        // Read type attachment of variable.
        const lVariableResolveType: PgslType = lVariable.data.resolveType;

        // Type of expression needs to be storable.
        if (!lVariableResolveType.data.storable) {
            pContext.pushIncident(`Target of address needs to storable`, this);
        }

        // TODO: No vector item.

        return {
            // Expression data.
            variable: lVariable,

            // Expression meta data.
            fixedState: lVariable.data.fixedState,
            isStorage: false,
            resolveType: new PgslPointerType(lVariableResolveType).process(pContext),
            constantValue: null,
            storageAddressSpace: lVariable.data.storageAddressSpace
        };
    }
}

export type AddressOfExpressionAstData = {
    variable: IExpressionAst;
} & ExpressionAstData;