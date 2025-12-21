import type { IAnyParameterConstructor } from '../../../kartoffelgames.core/source/interface/i-constructor.ts';
import type { AbstractSyntaxTree } from '../abstract_syntax_tree/abstract-syntax-tree.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from './i-pgsl-transpiler-processor.interface.ts';
import { PgslTranspilationMeta } from "./pgsl-transpilation-meta.ts";

// TODO: How to generate a sourcemap. https://sourcemaps.info/spec.html

/**
 * Transpiles PGSL syntax trees into target language code.
 * This class provides transpilation services for all PGSL syntax tree nodes,
 * converting them into the appropriate target language representation.
 */
export class PgslTranspilation {
    private readonly mTranspilationProcessors: Map<PgslSyntaxTreeConstructor, IPgslTranspilerProcessor<AbstractSyntaxTree>>;

    /**
     * Creates a new PGSL syntax tree transpiler.
     * Initializes all transpilation processors for different syntax tree node types.
     */
    public constructor() {
        this.mTranspilationProcessors = new Map<PgslSyntaxTreeConstructor, IPgslTranspilerProcessor<AbstractSyntaxTree>>();
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
    public transpile(pInstance: AbstractSyntaxTree): PgslTranspilationResult {
        // Create transpilation meta object.
        const lTranspilationMeta: PgslTranspilationMeta = new PgslTranspilationMeta();

        // Create callbacks.
        const lTranspile: PgslTranspilerProcessorTranspile = (pInstance: AbstractSyntaxTree): string => {
            // Read processor for the instance.
            const lProcessor: IPgslTranspilerProcessor<AbstractSyntaxTree> | undefined = this.mTranspilationProcessors.get(pInstance.constructor as PgslSyntaxTreeConstructor);
            if (!lProcessor) {
                throw new Error(`No transpilation processor found for syntax tree of type '${pInstance.constructor.name}'.`);
            }

            return lProcessor.process(pInstance, lTranspile, lTranspilationMeta);
        };

        // Create result.
        return {
            code: lTranspile(pInstance),
            sourceMap: null,
            meta: lTranspilationMeta
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
    public addProcessor<T extends AbstractSyntaxTree>(pProcessor: IPgslTranspilerProcessor<T>): void {
        if (Array.isArray(pProcessor.target)) {
            for (const lTarget of pProcessor.target) {
                this.mTranspilationProcessors.set(lTarget, pProcessor as IPgslTranspilerProcessor<AbstractSyntaxTree>);
            }
        } else {
            this.mTranspilationProcessors.set(pProcessor.target, pProcessor);
        }
    }
}

/**
 * Type representing a constructor function for PGSL syntax tree nodes.
 * Used as a key in the transpilation processor map to associate constructors
 * with their corresponding transpilation logic.
 */
type PgslSyntaxTreeConstructor = IAnyParameterConstructor<AbstractSyntaxTree>;


export type PgslTranspilationResult = {
    code: string;
    sourceMap: null;
    meta: PgslTranspilationMeta;
};