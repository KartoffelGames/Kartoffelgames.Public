import type { AbstractSyntaxTree, AbstractSyntaxTreeConstructor } from '../abstract_syntax_tree/abstract-syntax-tree.ts';
import type { ITranspilerProcessor, PgslTranspilerProcessorTranspile, TranspilerProcessorConstructor } from './i-transpiler-processor.interface.ts';
import { TranspilationMeta } from './transpilation-meta.ts';

/**
 * Transpiles PGSL syntax trees into target language code.
 */
export class Transpiler {
    private readonly mTranspilationProcessors: Map<AbstractSyntaxTreeConstructor, ITranspilerProcessor<AbstractSyntaxTree>>;

    /**
     * Creates a new PGSL syntax tree transpiler.
     */
    public constructor() {
        this.mTranspilationProcessors = new Map<AbstractSyntaxTreeConstructor, ITranspilerProcessor<AbstractSyntaxTree>>();
    }

    /**
     * Adds a transpilation processor for a list of syntax tree constructors.
     * 
     * @param pProcessorConstructor - The processor constructor of the syntax tree type.
     *
     * @template T - The specific syntax tree type that extends BasePgslSyntaxTree.
     */
    public addProcessor<T extends AbstractSyntaxTree>(pProcessorConstructor: TranspilerProcessorConstructor<T>): void {
        // Construct processor.
        const lProcessor: ITranspilerProcessor<T> = new pProcessorConstructor();

        // Register for processor target.
        this.mTranspilationProcessors.set(lProcessor.target, lProcessor as ITranspilerProcessor<AbstractSyntaxTree>);
    }

    /**
     * Transpiles a PGSL syntax tree instance into target language code.
     * 
     * @param pInstance - The PGSL syntax tree instance to transpile.
     * @param pTrace - The syntax tree trace for context.
     * 
     * @returns The transpiled code as a string.
     */
    public transpile(pInstance: AbstractSyntaxTree): PgslTranspilationResult {
        // Create transpilation meta object.
        const lTranspilationMeta: TranspilationMeta = new TranspilationMeta();

        // Create callbacks.
        const lTranspile: PgslTranspilerProcessorTranspile = (pInstance: AbstractSyntaxTree): string => {
            // Read processor for the instance.
            const lProcessor: ITranspilerProcessor<AbstractSyntaxTree> | undefined = this.mTranspilationProcessors.get(pInstance.constructor as AbstractSyntaxTreeConstructor);
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
}

export type PgslTranspilationResult = {
    code: string;
    sourceMap: null;
    meta: TranspilationMeta;
};