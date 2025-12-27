import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import { PgslEnumType } from '../../type/pgsl-enum-type.ts';
import { PgslInvalidType } from '../../type/pgsl-invalid-type.ts';
import type { PgslType } from '../../type/pgsl-type.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { ExpressionAstData, IExpressionAst } from '../i-expression-ast.interface.ts';
import type { VariableNameExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { IValueStoreAst } from "../../i-value-store-ast.interface.ts";

/**
 * PGSL structure holding single variable name.
 */
export class VariableNameExpressionAst extends AbstractSyntaxTree<VariableNameExpressionCst, VariableNameExpressionAstData> implements IExpressionAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext): VariableNameExpressionAstData {
        const lVariableName: string = this.cst.variableName;

        // Check if variable is defined.
        const lVariableDefinition: IValueStoreAst | null = pContext.getValue(lVariableName);
        if (lVariableDefinition) {
            return {
                // Expression data.
                variableName: lVariableName,

                // Expression meta data.
                fixedState: lVariableDefinition.data.fixedState,
                isStorage: true,
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

                // Expression meta data.
                fixedState: PgslValueFixedState.Variable,
                isStorage: false,
                resolveType: new PgslEnumType(lEnumDefinition.data.name).process(pContext),
                constantValue: null,
                storageAddressSpace: PgslValueAddressSpace.Module
            };
        }

        pContext.pushIncident(`Variable "${lVariableName}" not defined.`, this);

        return {
            // Expression data.
            variableName: lVariableName,

            // Expression meta data.
            fixedState: PgslValueFixedState.Variable,
            isStorage: false,
            resolveType: new PgslInvalidType().process(pContext),
            constantValue: null,
            storageAddressSpace: PgslValueAddressSpace.Function
        };
    }
}

export type VariableNameExpressionAstData = {
    variableName: string;
} & ExpressionAstData;