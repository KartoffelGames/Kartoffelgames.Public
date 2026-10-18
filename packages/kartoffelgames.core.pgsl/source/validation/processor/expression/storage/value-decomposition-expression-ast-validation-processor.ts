import { EnumDeclarationAst } from "../../../../abstract_syntax_tree/declaration/enum-declaration-ast.ts";
import { StructDeclarationAst } from "../../../../abstract_syntax_tree/declaration/struct-declaration-ast.ts";
import { StructPropertyDeclarationAst } from "../../../../abstract_syntax_tree/declaration/struct-property-declaration-ast.ts";
import { ValueDecompositionExpressionAst, type ValueDecompositionExpressionAstData } from '../../../../abstract_syntax_tree/expression/storage/value-decomposition-expression-ast.ts';
import { BasePgslType } from "../../../../abstract_syntax_tree/type/definition/base-pgsl-type.ts";
import { PgslEnumType } from "../../../../abstract_syntax_tree/type/definition/pgsl-enum-type.ts";
import { PgslStructType } from "../../../../abstract_syntax_tree/type/definition/pgsl-struct-type.ts";
import { PgslVectorType } from "../../../../abstract_syntax_tree/type/definition/pgsl-vector-type.ts";
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of ValueDecompositionExpressionAst.
 */
export class ValueDecompositionExpressionAstValidationProcessor extends PgslValidatorProcessor<ValueDecompositionExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof ValueDecompositionExpressionAst {
        return ValueDecompositionExpressionAst;
    }

    /**
     * Validates the PGSL value decomposition expression syntax tree.
     * 
     * @param pData - The syntax tree data to validate.
     */
    protected override onValidate(pData: ValueDecompositionExpressionAstData): void {
        // Validate the child value expression.
        this.validateAst(pData.expressionValue);

        const lValueType: BasePgslType = pData.expressionValue.data.resolveType;
        switch (true) {
            // Validate vectors.
            case lValueType instanceof PgslVectorType: {
                // Validate swizzle name.
                if (!/^([rgba]{1,4}|[xyzw]{1,4})$/.test(pData.property)) {
                    this.pushIncident(`Swizzle name "${pData.property}" can't be used to access a vector.`);
                }

                // Validate that a swizzle can only use certain names for certain vector dimensions.
                if (lValueType.dimension < 4 && /[aw]/.test(pData.property)) {
                    this.pushIncident(`Swizzle names with "a" or "w" can only be used for vectors of dimension 4 or higher.`);
                }
                if (lValueType.dimension < 3 && /[zb]/.test(pData.property)) {
                    this.pushIncident(`Swizzle names with "b" or "z" can only be used for vectors of dimension 3 or higher.`);
                }

                break;
            }

            // Validate structs.
            case lValueType instanceof PgslStructType: {
                // Check for the correct struct declaration.
                const lStructDeclaration: StructDeclarationAst | null = pData.expressionDeclaration as StructDeclarationAst | null;
                if (!lStructDeclaration) {
                    this.pushIncident(`Struct type for "${lValueType.structName}" not found.`);
                    break;
                }

                // Find property by name in its struct.
                const lProperty: StructPropertyDeclarationAst | undefined = lStructDeclaration.data.properties.find((pProperty) => {
                    return pProperty.data.name === pData.property;
                });

                // Validate that the struct contains the property.
                if (!lProperty) {
                    this.pushIncident(`Struct has no defined property "${pData.property}".`);
                    break;
                }

                break;
            }

            // Validate enums.
            case lValueType instanceof PgslEnumType: {
                // Check for the correct enum declaration.
                const lEnumDeclaration: EnumDeclarationAst | null = pData.expressionDeclaration as EnumDeclarationAst | null;
                if (!lEnumDeclaration) {
                    this.pushIncident(`Enum type for "${lValueType.enumName}" not found.`, pData.expressionValue);
                    return;
                }

                // Check for existing enum property.
                if (!lEnumDeclaration.data.values.has(pData.property)) {
                    this.pushIncident(`Enum "${lEnumDeclaration.data.name}" does not contain a value for property "${pData.property}".`);
                    return;
                }

                break;
            }

            default: {
                this.pushIncident(`Value of a decomposition must be a composite type.`, pData.expressionValue);
            }
        }
    }
}
