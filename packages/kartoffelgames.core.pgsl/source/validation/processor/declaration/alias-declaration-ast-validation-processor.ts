import { AliasDeclarationAst, type AliasDeclarationAstData } from '../../../abstract_syntax_tree/declaration/alias-declaration-ast.ts';
import { PgslValidatorProcessor } from '../../pgsl-validator-processor.ts';

/**
 * Validation processor of AliasDeclarationAst.
 */
export class AliasDeclarationAstValidationProcessor extends PgslValidatorProcessor<AliasDeclarationAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof AliasDeclarationAst {
        return AliasDeclarationAst;
    }

    /**
     * Validates the PGSL alias declaration syntax tree.
     * 
     * @param pData - The syntax tree data to validate.
     */
    protected override onValidate(pData: AliasDeclarationAstData): void {
        // Validate the child attribute list.
        if (pData.attributes) {
            this.validateAst(pData.attributes);
        }

        // Validate the child type declaration of the aliased type.
        this.validateAst(pData.typeDeclaration);

        // Validate that the name does not contain the reserved name part __GENERIC__.
        if(pData.name.includes('__GENERIC__')) {
            this.pushIncident(`Name "${pData.name}" must not contain the reserved name part "__GENERIC__".`);
        }

        // Validate that the name does not contain the reserved name part __CATCH__.
        if(pData.name.includes('__CATCH__')) {
            this.pushIncident(`Name "${pData.name}" must not contain the reserved name part "__CATCH__".`);
        }
    }
}
