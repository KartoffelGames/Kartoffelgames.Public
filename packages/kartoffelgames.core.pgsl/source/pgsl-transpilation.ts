import { IAnyParameterConstructor } from "../../kartoffelgames.core/source/interface/i-constructor.ts";
import { BasePgslSyntaxTree } from "./syntax_tree/base-pgsl-syntax-tree.ts";
import { PgslDocument } from "./syntax_tree/pgsl-document.ts";
import { PgslTrace } from "./trace/pgsl-trace.ts";

/**
 * Transpiles PGSL syntax trees into target language code.
 * This class provides transpilation services for all PGSL syntax tree nodes,
 * converting them into the appropriate target language representation.
 */
export class PgslTranspilation {
    private readonly mTranspilationProcessors: Map<PgslSyntaxTreeConstructor, PgslTranspilationProcessor<BasePgslSyntaxTree>>;

    /**
     * Creates a new PGSL syntax tree transpiler.
     * Initializes all transpilation processors for different syntax tree node types.
     */
    public constructor() {
        this.mTranspilationProcessors = new Map<PgslSyntaxTreeConstructor, PgslTranspilationProcessor<BasePgslSyntaxTree>>();

        // Define transpilation processors for all node types.
        this.addProcessor(PgslDocument, this.transpilationPgslDocument);
    }

    /**
     * Transpiles a PGSL syntax tree instance into target language code.
     * Processes the given instance using the appropriate transpilation processor
     * and returns the generated code as a string.
     * 
     * @param pInstance - The PGSL syntax tree instance to transpile.
     * @param pTrace - The syntax tree trace for context.
     * 
     * @returns The transpiled code as a string.
     */
    public transpile(pInstance: BasePgslSyntaxTree, pTrace: PgslTrace): string {
        const lTranspilationResults: Array<string> = [];

        // Read processor for the instance.
        const lProcessor: PgslTranspilationProcessor<BasePgslSyntaxTree> | undefined = this.mTranspilationProcessors.get(pInstance.constructor as PgslSyntaxTreeConstructor);
        if (!lProcessor) {
            return '';
        }

        // Validate instance.
        lProcessor.apply(this, [pInstance, pTrace, (pResult: string) => {
            lTranspilationResults.push(pResult);
        }] satisfies [BasePgslSyntaxTree, PgslTrace, PgslTranspilationProcessorSendResult]);

        // Return the joined transpilation results.
        return lTranspilationResults.join('');
    }

    /**
     * Adds a transpilation processor for a specific syntax tree constructor.
     * This method handles type casting to suppress TypeScript warnings while
     * maintaining type safety at runtime.
     * 
     * @param pConstructor - The constructor of the syntax tree type.
     * @param pProcessor - The transpilation processor function for the syntax tree type.
     *
     * @template T - The specific syntax tree type that extends BasePgslSyntaxTree.
     */
    private addProcessor<T extends BasePgslSyntaxTree>(pConstructor: IAnyParameterConstructor<T>, pProcessor: PgslTranspilationProcessor<T>): void {
        this.mTranspilationProcessors.set(pConstructor, pProcessor as PgslTranspilationProcessor<BasePgslSyntaxTree>);
    }

    /**
     * Transpiles a PgslDocument instance.
     * Processes all child declarations and combines them into a complete document.
     * 
     * @param pInstance - The PgslDocument instance to transpile.
     * @param pTrace - The syntax tree trace for context.
     * @param pSendResult - The function to call with transpilation results.
     */
    private transpilationPgslDocument(pInstance: PgslDocument, pTrace: PgslTrace, pSendResult: PgslTranspilationProcessorSendResult): void {
        // Transpile all child declarations.
        for (const lChild of pInstance.childNodes) {
            pSendResult(this.transpile(lChild, pTrace));
        }
    }
}

/**
 * Type representing a constructor function for PGSL syntax tree nodes.
 * Used as a key in the transpilation processor map to associate constructors
 * with their corresponding transpilation logic.
 */
type PgslSyntaxTreeConstructor = IAnyParameterConstructor<BasePgslSyntaxTree>;

/**
 * Function type for sending transpilation results during the transpilation process.
 * Called by transpilation processors to emit generated code segments.
 * 
 * @param pResult - The generated code segment as a string.
 */
type PgslTranspilationProcessorSendResult = (pResult: string) => void;

/**
 * Function type for transpilation processors that convert specific syntax tree node types
 * into target language code. Each processor is responsible for transpiling one type
 * of syntax tree node.
 * 
 * @param pInstance - The syntax tree instance to transpile.
 * @param pTrace - The syntax tree trace for context and error reporting.
 * @param pSendResult - Function to call with generated code segments.
 * 
 * @template T - The specific syntax tree node type being transpiled.
 */
type PgslTranspilationProcessor<T extends BasePgslSyntaxTree> = (pInstance: T, pTrace: PgslTrace, pSendResult: PgslTranspilationProcessorSendResult) => void;