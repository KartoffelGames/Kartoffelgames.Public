import type { VariableNameExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { PgslDeclarationType } from '../../../enum/pgsl-declaration-type.enum.ts';
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { EnumDeclarationAst } from "../../declaration/enum-declaration-ast.ts";
import type { IValueStoreAst } from '../../i-value-store-ast.interface.ts';
import { PgslEnumType } from '../../type/definition/pgsl-enum-type.ts';
import { PgslInvalidType } from '../../type/definition/pgsl-invalid-type.ts';
import type { ExpressionAstData, IExpressionAst } from '../i-expression-ast.interface.ts';

/**
 * PGSL structure holding single variable name.
 */
export class VariableNameExpressionAst extends AbstractSyntaxTree<VariableNameExpressionCst, VariableNameExpressionAstData> implements IExpressionAst {
    /**
     * Process data of current structure.
     * 
     * @param pContext - Build context.
     * @param pCst - Cst data.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext, pCst: VariableNameExpressionCst): VariableNameExpressionAstData {
        const lVariableName: string = pCst.variableName;

        // Check if variable is defined.
        const lVariableDefinition: IValueStoreAst | null = pContext.getValue(lVariableName);
        if (lVariableDefinition) {
            // Depending on the declaration type, alter the storage type.
            const lIsStorage: boolean = (() => {
                switch (lVariableDefinition.data.declarationType) {
                    // Const and param are a one time store but cant be used as a storage after.
                    case PgslDeclarationType.Const:
                    case PgslDeclarationType.Param: {
                        return false;
                    }

                    // Other type can be used to assign values.
                    case PgslDeclarationType.Storage:
                    case PgslDeclarationType.Uniform:
                    case PgslDeclarationType.Workgroup:
                    case PgslDeclarationType.Private:
                    case PgslDeclarationType.Let: {
                        return true;
                    }
                }
            })();

            return {
                // Expression data.
                variableName: lVariableName,
                valueDeclaration: lVariableDefinition,

                // Expression meta data.
                fixedState: lVariableDefinition.data.fixedState,
                isStorage: lIsStorage,
                resolveType: lVariableDefinition.data.type,
                constantValue: lVariableDefinition.data.constantValue,
                storageAddressSpace: lVariableDefinition.data.addressSpace
            };
        }

        // If it was not a variable, check if it is an enum.
        const lEnumDefinition = pContext.getEnum(lVariableName);
        if (lEnumDefinition) {
            return {
                // Expression data.
                variableName: lVariableName,
                valueDeclaration: lEnumDefinition,

                // Expression meta data.
                fixedState: PgslValueFixedState.Variable,
                isStorage: false,
                resolveType: pContext.types.create(PgslEnumType, lEnumDefinition),
                constantValue: null,
                storageAddressSpace: PgslValueAddressSpace.Module
            };
        }

        return {
            // Expression data.
            variableName: lVariableName,
            valueDeclaration: null,

            // Expression meta data.
            fixedState: PgslValueFixedState.Variable,
            isStorage: false,
            resolveType: pContext.types.create(PgslInvalidType),
            constantValue: null,
            storageAddressSpace: PgslValueAddressSpace.Function
        };
    }
}

export type VariableNameExpressionAstData = {
    variableName: string;
    valueDeclaration: EnumDeclarationAst | IValueStoreAst | null;
} & ExpressionAstData;