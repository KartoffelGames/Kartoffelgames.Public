import { EnumDeclarationAst, type EnumDeclarationAstData } from '../../../abstract_syntax_tree/declaration/enum-declaration-ast.ts';
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
     * @param _pData - The syntax tree data to validate.
     */
    protected override onValidate(_pData: EnumDeclarationAstData): void {
        // TODO: Validate the child attribute list.
        // TODO: Validate the child value expression of every enum value.
        // TODO: Validate that the enum name does not contain the reserved name part __GENERIC__ (new).
        // TODO: Validate that no enum value name contains the reserved name part __GENERIC__ (new).
        // TODO: Validate that the enum has at least one value.
        // TODO: Validate that no two values of the enum share a name.
        // TODO: Validate that every enum value converts to uint or is a string.
        // TODO: Validate that all enum values have the same type as the first value.
    }
}
