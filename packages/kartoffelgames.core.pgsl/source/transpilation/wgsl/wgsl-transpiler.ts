import { PgslTranspilation } from "../pgsl-transpilation.ts";
import { PgslEnumDeclarationTranspilerProcessor } from "./declaration/pgsl-enum-declaration-transpiler-processor.ts";
import { PgslFunctionDeclarationTranspilerProcessor } from "./declaration/pgsl-function-declaration-transpiler-processor.ts";
import { PgslStructDeclarationTranspilerProcessor } from "./declaration/pgsl-struct-declaration-transpiler-processor.ts";
import { PgslStructPropertyDeclarationTranspilerProcessor } from "./declaration/pgsl-struct-property-declaration-transpiler-processor.ts";
import { PgslVariableDeclarationTranspilerProcessor } from "./declaration/pgsl-variable-declaration-transpiler-processor.ts";
import { PgslDocumentTranspilerProcessor } from "./pgsl-document-transpiler-processor.ts";
import { PgslTypeDeclarationTranspilerProcessor } from "./pgsl-type-declaration-transpiler-processor.ts";

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

        // Declarations. Alias has no transpilation processor, it is only used during trace.
        this.addProcessor(new PgslVariableDeclarationTranspilerProcessor());
        this.addProcessor(new PgslEnumDeclarationTranspilerProcessor());
        this.addProcessor(new PgslFunctionDeclarationTranspilerProcessor());
        this.addProcessor(new PgslStructDeclarationTranspilerProcessor());
        this.addProcessor(new PgslStructPropertyDeclarationTranspilerProcessor());

        // General. Attributes have no transpilation processor, they are only used during trace.
        this.addProcessor(new PgslTypeDeclarationTranspilerProcessor());
    }
}