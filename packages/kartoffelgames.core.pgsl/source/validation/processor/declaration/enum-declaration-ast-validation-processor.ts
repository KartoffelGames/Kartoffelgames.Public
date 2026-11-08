import { EnumDeclarationAst, type EnumDeclarationAstData } from '../../../abstract_syntax_tree/declaration/enum-declaration-ast.ts';
import { BasePgslTypeKind } from "../../../abstract_syntax_tree/type/definition/base-pgsl-type.ts";
import { PgslNumericType } from "../../../abstract_syntax_tree/type/definition/pgsl-numeric-type.ts";
import { PgslValidatorProcessor } from '../../pgsl-validator-processor.ts';

/**
 * Validation processor of EnumDeclarationAst.
 */
export class EnumDeclarationAstValidationProcessor extends PgslValidatorProcessor<EnumDeclarationAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof EnumDeclarationAst {
        return EnumDeclarationAst;
    }

    /**
     * Validates the PGSL enum declaration syntax tree.
     * 
     * @param pData - The syntax tree data to validate.
     */
    protected override onValidate(pData: EnumDeclarationAstData): void {
        // Validate the child attribute list.
        if (pData.attributes) {
            this.validateAst(pData.attributes);
        }

        const lUnsignedInteger: PgslNumericType = new PgslNumericType(PgslNumericType.typeName.unsignedInteger);
        const lPropertyNames: Set<string> = new Set<string>();

        // Validate each enum value.
        for (const [lEnumValueName, lEnumValueValue] of pData.propertyList) {
            // Validate the child value expression.
            this.validateAst(lEnumValueValue);

            // Validate that the enum value name does not contain the __GENERIC__.
            if (lEnumValueName.includes('__GENERIC__')) {
                this.pushIncident(`Enum value name must not contain reservec names "__GENERIC__"`);
            }

            // All values need to be string or integer.
            if (lEnumValueValue.data.resolveType.conversionRankTo(lUnsignedInteger) !== Number.POSITIVE_INFINITY && !lEnumValueValue.data.resolveType.isKind(BasePgslTypeKind.String)) {
                this.pushIncident(`Enum "${pData.name}" can only hold unsigned integer values.`, lEnumValueValue);
            }

            // Property is the same type as the others.
            if (!lEnumValueValue.data.resolveType.equals(pData.valuesType)) {
                this.pushIncident(`Enum "${pData.name}" has mixed value types. Expected all values to be of the same type.`, lEnumValueValue);
            }

            // Validate dublicates.
            if (lPropertyNames.has(lEnumValueName)) {
                this.pushIncident(`Value "${lEnumValueName}" was already added to enum "${pData.name}"`);
            }
        }

        // Validate that the enum name does not contain the reserved name part __GENERIC__.
        if (pData.name.includes('__GENERIC__')) {
            this.pushIncident(`Enum name must not contain reservec names "__GENERIC__"`);
        }

        // Validate that the enum has at least one value.
        if (pData.values.size === 0) {
            this.pushIncident(`Enum ${pData.name} has no values`);
        }
    }
}
