import { PgslTranspilation } from "../pgsl-transpilation.ts";
import { PgslDocumentTranspilerProcessor } from "./pgsl-document-transpiler-processor.ts";

/**
 * WGSL (WebGPU Shading Language) transpiler for PGSL syntax trees.
 * Converts PGSL abstract syntax trees into WGSL shader code that can be
 * executed on WebGPU-compatible devices.
 */
export class WgslTranspiler extends PgslTranspilation {
    /**
     * Creates a new WGSL transpiler instance.
     * Initializes all transpilation processors specific to WGSL code generation.
     */
    public constructor() {
        super();

        // Define transpilation processors for all node types.
        this.addProcessor(new PgslDocumentTranspilerProcessor());
    }
}