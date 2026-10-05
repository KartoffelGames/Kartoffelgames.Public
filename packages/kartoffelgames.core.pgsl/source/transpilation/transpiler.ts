import type { AbstractSyntaxTree, AbstractSyntaxTreeConstructor } from '../abstract_syntax_tree/abstract-syntax-tree.ts';
import { TranspilationMeta } from './transpilation-meta.ts';
import type { TranspilerProcessor, TranspilerProcessorConstructor, TranspilerProcessorTranspile } from './transpiler-processor.ts';

/**
 * Transpiles PGSL syntax trees into target language code.
 */
export class Transpiler {
    private readonly mTranspilationProcessors: Map<AbstractSyntaxTreeConstructor, TranspilerProcessor<AbstractSyntaxTree>>;

    /**
     * Creates a new PGSL syntax tree transpiler.
     */
    public constructor() {
        this.mTranspilationProcessors = new Map<AbstractSyntaxTreeConstructor, TranspilerProcessor<AbstractSyntaxTree>>();
    }

    /**
     * Adds a transpilation processor for its target syntax tree type.
     *
     * @param pProcessorConstructor - The processor constructor of the syntax tree type.
     *
     * @typeParam T - The syntax tree type the processor transpiles.
     */
    public addProcessor<T extends AbstractSyntaxTree>(pProcessorConstructor: TranspilerProcessorConstructor<T>): void {
        // Construct processor.
        const lProcessor: TranspilerProcessor<T> = new pProcessorConstructor();

        // Register for processor target.
        this.mTranspilationProcessors.set(lProcessor.target, lProcessor as TranspilerProcessor<AbstractSyntaxTree>);
    }

    /**
     * Transpiles a PGSL syntax tree instance into target language code.
     *
     * @param pInstance - The PGSL syntax tree instance to transpile.
     *
     * @returns The transpilation result.
     */
    public transpile(pInstance: AbstractSyntaxTree): PgslTranspilationResult {
        // Create transpilation meta object.
        const lTranspilationMeta: TranspilationMeta = new TranspilationMeta();

        // Create callbacks.
        const lTranspile: TranspilerProcessorTranspile = (pInstance: AbstractSyntaxTree): string => {
            // Read processor for the instance.
            const lProcessor: TranspilerProcessor<AbstractSyntaxTree> | undefined = this.mTranspilationProcessors.get(pInstance.constructor as AbstractSyntaxTreeConstructor);
            if (!lProcessor) {
                throw new Error(`No transpilation processor found for syntax tree of type '${pInstance.constructor.name}'.`);
            }

            // Then call process.
            return lProcessor.process({
                instance: pInstance,
                meta: lTranspilationMeta,
                transpilationCallback: lTranspile
            });
        };

        // Create result.
        return {
            code: lTranspile(pInstance),
            sourceMap: null,
            meta: lTranspilationMeta
        };
    }
}

export type PgslTranspilationResult = {
    code: string;
    sourceMap: null;
    meta: TranspilationMeta;
};