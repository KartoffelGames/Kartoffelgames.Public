import { IAnyParameterConstructor } from "../../../kartoffelgames.core/source/interface/i-constructor.ts";
import { AbstractSyntaxTree } from "../abstract_syntax_tree/abstract-syntax-tree.ts";

export abstract class PgslValidatorProcessor<TTarget extends AbstractSyntaxTree> {
    /**
     * The target abstract syntax tree constructor that this processor handles.
     */
    public abstract readonly target: IAnyParameterConstructor<TTarget>;

    /**
     * 
     * @param pInstance - The syntax tree instance to transpile.
     * @param pTranspile - Callback function to transpile child nodes.
     * @param pMeta - Transpilation meta information.
     * 
     * @template T - The specific syntax tree node type being transpiled.
     */
    public validate(pInstance: TTarget, pValidate: PgslValidatorProcessorValidate, pMeta: TranspilationMeta): boolean {

    }

    protected abstract onValidate(pInstance: TTarget, pValidate: PgslValidatorProcessorValidate): void;

    /**
     * Add a validation incident.
     * 
     * @param pMessage 
     */
    protected pushIncident(pMessage: string): void {
        // TODO: 
    }
}

/**
 * Function for validating sub ASTs.
 */
export type PgslValidatorProcessorValidate = (pInstance: AbstractSyntaxTree) => string;