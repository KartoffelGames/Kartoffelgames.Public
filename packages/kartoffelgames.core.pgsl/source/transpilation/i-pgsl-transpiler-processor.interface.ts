import { IAnyParameterConstructor } from "../../../kartoffelgames.core/source/interface/i-constructor.ts";
import { BasePgslSyntaxTree } from "../syntax_tree/base-pgsl-syntax-tree.ts";
import { PgslTrace } from "../trace/pgsl-trace.ts";

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
     * @param pSendResult - Function to call with generated code segments.
     * 
     * @template T - The specific syntax tree node type being transpiled.
     */
    process(pInstance: TTarget, pTrace: PgslTrace, pSendResult: PgslTranspilerProcessorSendResult, pTranspile: PgslTranspilerProcessorTranspile): void;
}

/**
 * Function type for sending transpilation results during the transpilation process.
 * Called by transpilation processors to emit generated code segments.
 * 
 * @param pResult - The generated code segment as a string.
 */
export type PgslTranspilerProcessorSendResult = (pResult: string) => void;

/**
 * Function type for transpiling a child syntax tree node and returning the result as a string.
 * Provided to processors to allow recursive transpilation of child nodes.
 */
export type PgslTranspilerProcessorTranspile = (pInstance: BasePgslSyntaxTree) => string;
