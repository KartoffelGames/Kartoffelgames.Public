import { TypeDeclarationAst } from '../../abstract_syntax_tree/general/type-declaration-ast.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../i-pgsl-transpiler-processor.interface.ts';

/**
 * Function type for transpiling PGSL types to WGSL.
 */
export class PgslTypeDeclarationTranspilerProcessor implements IPgslTranspilerProcessor<TypeDeclarationAst> {
    /**
     * Gets the target type that this processor handles.
     */
    public get target(): typeof TypeDeclarationAst {
        return TypeDeclarationAst;
    }

    /**
     * Processes a PGSL type definition and transpiles it to WGSL.
     * 
     * @param pInstance - The type definition instance to transpile.
     * @param pTrace - The trace context for error reporting.
     * @param pSendResult - Function to send the transpiled result.
     * @param pTranspile - Function to transpile child nodes.
     */
    public process(pInstance: TypeDeclarationAst, pTranspile: PgslTranspilerProcessorTranspile): string {
        return pTranspile(pInstance.data.type);
    }
}