import type { IAnyParameterConstructor } from '../../../kartoffelgames.core/source/interface/i-constructor.ts';
import type { BasePgslSyntaxTree } from '../syntax_tree/base-pgsl-syntax-tree.ts';
import type { PgslTrace } from '../trace/pgsl-trace.ts';

export interface IPgslTranspilerProcessor<TTarget extends BasePgslSyntaxTree> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    readonly target: IAnyParameterConstructor<TTarget>;

    /**
     * Function type for transpilation processors that convert specific syntax tree node types
     * into target language code. Each processor is responsible for transpiling one type
     * of syntax tree node.
     * 
     * @param pInstance - The syntax tree instance to transpile.
     * @param pTrace - The syntax tree trace for context and error reporting.
     * 
     * @template T - The specific syntax tree node type being transpiled.
     */
    process(pInstance: TTarget, pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string;
}

/**
 * Function type for transpiling a child syntax tree node and returning the result as a string.
 * Provided to processors to allow recursive transpilation of child nodes.
 */
export type PgslTranspilerProcessorTranspile = (pInstance: BasePgslSyntaxTree) => string;
