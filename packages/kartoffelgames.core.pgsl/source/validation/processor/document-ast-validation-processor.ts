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

        // TODO: Validate that no two alias declarations share a name.
        // TODO: Validate that no two enum declarations share a name, including the enums of the feature sets.
        // TODO: Validate that no two function declarations share a name, including the built-in functions of the feature sets.
        // TODO: Validate that no two struct declarations share a name, including the structs of the feature sets.
        // TODO: Validate that no two module scope variable declarations share a name.
        // TODO: Validate that no function, struct and module scope variable declarations of different kinds share a name, because all three are emitted into the one WGSL module scope (new).
        // TODO: Validate that no two variable declarations with a GroupBinding attribute use the same binding name in the same group name.
        // TODO: Validate that no function called directly or through other functions from a Vertex or Compute entry point contains a discard statement, as a discard written in the entry point itself is reported by the DiscardStatementAst processor (new).
        // TODO: Validate that no function reachable from a Vertex or Fragment entry point uses a workgroup variable (new).
        // TODO: Validate that no function reachable from a Vertex or Compute entry point calls a fragment-only built-in function (dpdx, dpdy and fwidth with their Coarse and Fine variants, textureSample, textureSampleBias, textureSampleCompare) (new).
        // TODO: Validate that no function reachable from a Vertex or Fragment entry point calls a compute-only built-in function (workgroupBarrier, storageBarrier, textureBarrier, workgroupUniformLoad) (new).
        // TODO: Validate that no function reachable from a Vertex entry point uses a storage variable with AccessMode read_write or a storage texture with write or read_write access (new).
        // TODO: Validate that every call of a built-in function that requires uniform control flow (the synchronisation functions, the derivatives, textureSample, textureSampleBias, textureSampleCompare) happens in uniform control flow, following calls through user functions (new).
        // TODO: Validate that the pointer argument of every workgroupUniformLoad call is a uniform value, so its address does not depend on a non-uniform value like a non-uniform index, following pointers passed through user function parameters (new).
        // TODO: Validate that no call of a user function passes two pointer arguments with the same root variable, or a pointer argument whose root variable is a module scope variable the called function also uses, when the called function or a function it calls writes through either of them (new).
    }
}