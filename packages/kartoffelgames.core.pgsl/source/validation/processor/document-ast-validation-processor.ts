import { DocumentAst } from "../../abstract_syntax_tree/document-ast.ts";
import { PgslValidatorProcessor } from "../pgsl-validator-processor.ts";

/**
 * Validation processor of DocumentAst.
 */
export class DocumentAstValidationProcessor extends PgslValidatorProcessor<DocumentAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof DocumentAst {
        return DocumentAst;
    }

    /**
     * Validates the PGSL document syntax tree.
     * 
     * @param pInstance - The syntax tree instance to transpile.
     */
    protected override onValidate(pInstance: DocumentAst): void {
        // Validate all child declarations.
        for (const lDeclarationAst of pInstance.data.content) {
            this.validateAst(lDeclarationAst);
        }
    }
}