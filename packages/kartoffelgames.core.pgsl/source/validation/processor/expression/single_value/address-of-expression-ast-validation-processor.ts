import type { ExpressionAstData, IExpressionAst } from "../../../../abstract_syntax_tree/expression/i-expression-ast.interface.ts";
import { AddressOfExpressionAst, type AddressOfExpressionAstData } from '../../../../abstract_syntax_tree/expression/single_value/address-of-expression-ast.ts';
import { ParenthesizedExpressionAst } from '../../../../abstract_syntax_tree/expression/single_value/parenthesized-expression-ast.ts';
import { IndexedValueExpressionAst } from '../../../../abstract_syntax_tree/expression/storage/indexed-value-expression-ast.ts';
import { ValueDecompositionExpressionAst } from '../../../../abstract_syntax_tree/expression/storage/value-decomposition-expression-ast.ts';
import { BasePgslTypeKind } from '../../../../abstract_syntax_tree/type/definition/base-pgsl-type.ts';
import { PgslVectorType } from '../../../../abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslValueAddressSpace } from '../../../../enum/pgsl-value-address-space.enum.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of AddressOfExpressionAst.
 */
export class AddressOfExpressionAstValidationProcessor extends PgslValidatorProcessor<AddressOfExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof AddressOfExpressionAst {
        return AddressOfExpressionAst;
    }

    /**
     * Validates the PGSL address of expression syntax tree.
     * 
     * @param pData - The syntax tree data to validate.
     */
    protected override onValidate(pData: AddressOfExpressionAstData): void {
        // Validate the child target expression.
        this.validateAst(pData.variable);

        // Look at the referenced variable.
        const lVariableData: ExpressionAstData = pData.variable.data;

        // Validate that the target of the address is a stored value.
        if (!lVariableData.isStorage) {
            this.pushIncident(`Target of address needs to a stored value`);
        }

        // Validate that the type of the target is storable.
        if (!lVariableData.resolveType.isKind(BasePgslTypeKind.Storable)) {
            this.pushIncident(`Target of address needs to storable`);
        }

        // Validate that the target is not a texture or sampler value, because their handle address space can not be addressed.
        if (lVariableData.storageAddressSpace === PgslValueAddressSpace.Texture) {
            this.pushIncident(`Target of address can not be a texture or sampler value`);
        }

        // Validate that the target is not a single vector component, neither by index nor by swizzle, because WGSL can not take the address of a vector component.
        const lIsVectorComponent: boolean = (() => {
            // Unwrapp parenthesized expressions.
            let lTarget: IExpressionAst = pData.variable;
            while (lTarget instanceof ParenthesizedExpressionAst) {
                lTarget = lTarget.data.expression;
            }

            // A component is an index or a swizzle of a vector.
            if (lTarget instanceof IndexedValueExpressionAst) {
                return lTarget.data.value.data.resolveType instanceof PgslVectorType;
            }
            if (lTarget instanceof ValueDecompositionExpressionAst) {
                return lTarget.data.expressionValue.data.resolveType instanceof PgslVectorType;
            }

            return false;
        })();

        if (lIsVectorComponent) {
            this.pushIncident(`Target of address can not be a vector component.`);
        }
    }
}
