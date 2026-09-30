import type { AddressOfExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { BasePgslTypeKind, type BasePgslType } from '../../type/definition/base-pgsl-type.ts';
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

        // Type of expression needs to be storable.
        if (!lVariable.data.isStorage) {
            pContext.pushIncident(`Target of address needs to a stored value`, this);
        }

        // Read type attachment of variable.
        const lVariableResolveType: BasePgslType = lVariable.data.resolveType;

        // Type of expression needs to be storable.
        if (!lVariableResolveType.isKind(BasePgslTypeKind.Storable)) {
            pContext.pushIncident(`Target of address needs to storable`, this);
        }

        // Textures and samplers are stored in the handle address space, which can not be addressed.
        if (lVariable.data.storageAddressSpace === PgslValueAddressSpace.Texture) {
            pContext.pushIncident(`Target of address can not be a texture or sampler value`, this);
        }

        return {
            // Expression data.
            variable: lVariable,

            // Expression meta data.
            fixedState: lVariable.data.fixedState,
            isStorage: false,
            resolveType: new PgslPointerType(lVariableResolveType),
            constantValue: null,
            storageAddressSpace: lVariable.data.storageAddressSpace
        };
    }
}

export type AddressOfExpressionAstData = {
    variable: IExpressionAst;
} & ExpressionAstData;