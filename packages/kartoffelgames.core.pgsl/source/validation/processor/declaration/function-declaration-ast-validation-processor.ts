import { FunctionDeclarationAst, type FunctionDeclarationAstData } from '../../../abstract_syntax_tree/declaration/function-declaration-ast.ts';
import { PgslValidatorProcessor } from '../../pgsl-validator-processor.ts';

/**
 * Validation processor of FunctionDeclarationAst.
 */
export class FunctionDeclarationAstValidationProcessor extends PgslValidatorProcessor<FunctionDeclarationAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof FunctionDeclarationAst {
        return FunctionDeclarationAst;
    }

    /**
     * Validates the PGSL function declaration syntax tree.
     * 
     * @param pData - The syntax tree data to validate.
     */
    protected override onValidate(pData: FunctionDeclarationAstData): void {
        // Validate the child overload declarations.
        for (const lOverload of pData.overloads) {
            this.validateAst(lOverload);

            // If it is a function with multiple headers no attributelist is allowed.
            if (pData.overloads.length > 1 && lOverload.data.attributes.data.attributes.size > 0) {
                this.pushIncident(`Functions with multiple headers cannot have generic parameters.`, lOverload);
            }
        }

        // Validate that the function name does not start with two underscores, as WGSL identifiers can not.
        if (pData.name.startsWith('__')) {
            this.pushIncident(`Name "${pData.name}" must not start with two underscores.`);
        }

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
