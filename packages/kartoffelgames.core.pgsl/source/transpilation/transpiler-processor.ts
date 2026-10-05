import { Exception } from '@kartoffelgames/core';
import type { IAnyParameterConstructor } from '../../../kartoffelgames.core/source/interface/i-constructor.ts';
import type { AbstractSyntaxTree } from '../abstract_syntax_tree/abstract-syntax-tree.ts';
import type { TranspilationMeta } from './transpilation-meta.ts';

/**
 * Transpiles one syntax tree type into target language code.
 *
 * @typeParam TTarget - The syntax tree type the processor transpiles.
 */
export abstract class TranspilerProcessor<TTarget extends AbstractSyntaxTree> {
    private mTranspilationContext: TranspilerProcessorContext<TTarget> | null;

    /**
     * The target abstract syntax tree constructor that this processor handles.
     */
    public abstract readonly target: IAnyParameterConstructor<TTarget>;

    /**
     * Transpilation meta information of the running transpilation.
     */
    protected get meta(): TranspilationMeta {
        if (!this.mTranspilationContext) {
            throw new Exception('Invalid access of meta', this);
        }

        return this.mTranspilationContext.meta;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mTranspilationContext = null;
    }

    /**
     * Transpile the current instance.
     * Should only be called by the core transpiler.
     *
     * @param pTranspilationContext - The context of the running transpilation.
     *
     * @returns The transpiled code.
     */
    public process(pTranspilationContext: TranspilerProcessorContext<TTarget>): string {
        // Cache old values.
        const lParentTranspilationContext: TranspilerProcessorContext<TTarget> | null = this.mTranspilationContext;

        // Set references, valid for this call.
        this.mTranspilationContext = pTranspilationContext;

        try {
            // Then call process.
            return this.onProcess(this.mTranspilationContext.instance);
        } finally {
            // Reset process references to last state.
            this.mTranspilationContext = lParentTranspilationContext;
        }
    }

    /**
     * Transpile sub ast.
     *
     * @param pInstance - AST instance to transpile.
     *
     * @returns The transpiled code of the sub ast.
     */
    protected transpileAst(pInstance: AbstractSyntaxTree): string {
        if (!this.mTranspilationContext) {
            throw new Exception('Invalid call of transpileAst', this);
        }

        return this.mTranspilationContext.transpilationCallback(pInstance);
    }

    /**
     * Transpile instance.
     *
     * @param pInstance - AST instance.
     *
     * @returns The transpiled code.
     */
    protected abstract onProcess(pInstance: TTarget): string;
}

/**
 * Function for transpiling sub ASTs.
 */
export type TranspilerProcessorTranspile = (pInstance: AbstractSyntaxTree) => string;

export type TranspilerProcessorContext<TTarget extends AbstractSyntaxTree> = {
    instance: TTarget;
    meta: TranspilationMeta;
    transpilationCallback: TranspilerProcessorTranspile;
};

export type TranspilerProcessorConstructor<T extends AbstractSyntaxTree> = {
    new(): TranspilerProcessor<T>;
};
