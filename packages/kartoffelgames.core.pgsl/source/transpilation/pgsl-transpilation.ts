import type { IAnyParameterConstructor } from '../../../kartoffelgames.core/source/interface/i-constructor.ts';
import type { BasePgslSyntaxTree } from '../syntax_tree/base-pgsl-syntax-tree.ts';
import type { PgslTrace } from '../trace/pgsl-trace.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from './i-pgsl-transpiler-processor.interface.ts';

// TODO: How to generate a sourcemap. https://sourcemaps.info/spec.html

/**
 * Transpiles PGSL syntax trees into target language code.
 * This class provides transpilation services for all PGSL syntax tree nodes,
 * converting them into the appropriate target language representation.
 */
export class PgslTranspilation {
    private readonly mTranspilationProcessors: Map<PgslSyntaxTreeConstructor, IPgslTranspilerProcessor<BasePgslSyntaxTree>>;

    /**
     * Creates a new PGSL syntax tree transpiler.
     * Initializes all transpilation processors for different syntax tree node types.
     */
    public constructor() {
        this.mTranspilationProcessors = new Map<PgslSyntaxTreeConstructor, IPgslTranspilerProcessor<BasePgslSyntaxTree>>();
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
    public transpile(pInstance: BasePgslSyntaxTree, pTrace: PgslTrace): PgslTranspilationResult {
        // Read processor for the instance.
        const lProcessor: IPgslTranspilerProcessor<BasePgslSyntaxTree> | undefined = this.mTranspilationProcessors.get(pInstance.constructor as PgslSyntaxTreeConstructor);
        if (!lProcessor) {
            throw new Error(`No transpilation processor found for syntax tree of type '${pInstance.constructor.name}'.`);
        }

        // Create callbacks.
        const lTranspile: PgslTranspilerProcessorTranspile = (pInstance: BasePgslSyntaxTree): string => {
            return this.transpile(pInstance, pTrace).code;
        };

        // Create result.
        return {
            code: lProcessor.process(pInstance, pTrace, lTranspile),
            sourceMap: null
        };
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
    public addProcessor<T extends BasePgslSyntaxTree>(pProcessor: IPgslTranspilerProcessor<T>): void {
        this.mTranspilationProcessors.set(pProcessor.target, pProcessor);
    }
}

/**
 * Type representing a constructor function for PGSL syntax tree nodes.
 * Used as a key in the transpilation processor map to associate constructors
 * with their corresponding transpilation logic.
 */
type PgslSyntaxTreeConstructor = IAnyParameterConstructor<BasePgslSyntaxTree>;


export type PgslTranspilationResult = {
    code: string;
    sourceMap: null;
};