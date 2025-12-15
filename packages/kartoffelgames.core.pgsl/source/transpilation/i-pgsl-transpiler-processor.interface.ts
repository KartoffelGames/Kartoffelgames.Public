import type { IAnyParameterConstructor } from '../../../kartoffelgames.core/source/interface/i-constructor.ts';
import type { AbstractSyntaxTree } from '../abstract_syntax_tree/abstract-syntax-tree.ts';
import { PgslTranspilationMeta } from "./pgsl-transpilation-meta.ts";

export interface IPgslTranspilerProcessor<TTarget extends AbstractSyntaxTree> {
    /**
     * The target abstract syntax tree constructor that this processor handles.
     */
    readonly target: IAnyParameterConstructor<TTarget>;

    /**
     * Function type for transpilation processors that convert specific syntax tree node types
     * into target language code. Each processor is responsible for transpiling one type
     * of syntax tree node.
     * 
     * @param pInstance - The syntax tree instance to transpile.
     * @param pTranspile - Callback function to transpile child nodes.
     * @param pMeta - Transpilation meta information.
     * 
     * @template T - The specific syntax tree node type being transpiled.
     */
    process(pInstance: TTarget, pTranspile: PgslTranspilerProcessorTranspile, pMeta: PgslTranspilationMeta): string;
}

/**
 * Function type for transpiling a child syntax tree node and returning the result as a string.
 * Provided to processors to allow recursive transpilation of child nodes.
 */
export type PgslTranspilerProcessorTranspile = (pInstance: AbstractSyntaxTree) => string;
