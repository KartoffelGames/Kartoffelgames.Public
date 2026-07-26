import type { PotatnoDocumentPort } from '../document/potatno-document-port.ts';
import type { PotatnoCodeGeneratorDocumentResult } from '../parser/result/potatno-code-generator-document-result.ts';
import type { PotatnoFunctionDefinition } from '../project/potatno-function-definition.ts';
import type { PotatnoProjectTypeNames, PotatnoProjectTypesDefinition } from '../project/potatno-project-types-definition.ts';

/**
 * Runs a single function definition for a preview based on a target port.
 * When no port is specified, the whole function should be executed with the special type "MAIN".
 *
 * @typeParam TProject - The project the executor targets.
 * @typeParam TParams - The iteration parameter shape supplied by the paired display per call.
 * @typeParam TResultType - Union of type names this executor can report.
 */
export class PotatnoPreviewFunctionExecutor<TProjectTypes extends PotatnoProjectTypesDefinition, TParams extends Record<string, unknown> = Record<string, unknown>, TResultType extends PotatnoPreviewResultType<TProjectTypes> = PotatnoPreviewResultType<TProjectTypes>> {
    /**
     * Full-function preview type.
     */
    public static readonly MAIN = 'MAIN' as const;

    private readonly mBuild: PotatnoPreviewFunctionExecutorBuild<TProjectTypes, TParams, TResultType>;
    private readonly mDefaultParameters: TParams;
    private readonly mFunction: PotatnoFunctionDefinition<TProjectTypes>;
    private readonly mTypes: Set<TResultType>;

    /**
     * Default values for the iteration parameters. The driver feeds these to the compiled callable
     * on every iteration, overlaid by user-specified and display-supplied values.
     */
    public get defaultParameters(): TParams {
        return this.mDefaultParameters;
    }

    /**
     * The function definition this executor wraps. Read by the preview registry to answer which
     * functions can be previewed.
     */
    public get function(): PotatnoFunctionDefinition<TProjectTypes> {
        return this.mFunction;
    }

    /**
     * Result type names this executor can report.
     */
    public get types(): ReadonlySet<TResultType> {
        return this.mTypes;
    }

    /**
     * Constructor.
     *
     * @param pFunction - Bound function definition.
     * @param pParameters - Executor configuration.
     */
    public constructor(pFunction: PotatnoFunctionDefinition<TProjectTypes>, pParameters: PotatnoPreviewFunctionExecutorConstructorParameter<TProjectTypes, TParams, TResultType>) {
        this.mFunction = pFunction;
        this.mDefaultParameters = pParameters.defaultParameters;
        this.mTypes = new Set<TResultType>(pParameters.types);
        this.mBuild = pParameters.build;
    }

    /**
     * Compile the generator result into a executable function.
     *
     * @param pGeneratorResult - The document-level code generator result.
     * @param pPortTarget - The previewed port plus its resolved value identifier, or `null` for a function-level preview.
     *
     * @returns The build result: the iteration callable and the type name of the yielded value.
     */
    public compile(pGeneratorResult: PotatnoCodeGeneratorDocumentResult<TProjectTypes>, pPortTarget: PotatnoPreviewFunctionExecutorPortTarget<TProjectTypes, TResultType> | null): PotatnoPreviewFunctionExecutorBuildResult<TParams, TResultType> {
        return this.mBuild({ defaultParameters: this.mDefaultParameters, function: this.mFunction, projectTypes: pGeneratorResult.entryPoint.function.project.types }, pGeneratorResult, pPortTarget);
    }
}

export type PotatnoPreviewMainType = typeof PotatnoPreviewFunctionExecutor.MAIN;
export type PotatnoPreviewResultType<TProjectTypes extends PotatnoProjectTypesDefinition> = PotatnoProjectTypeNames<TProjectTypes> | PotatnoPreviewMainType;

/**
 * Build-time view handed to the build callback.
 *
 * @typeParam TProject - The project the executor targets.
 * @typeParam TParams - The iteration parameter shape.
 */
export type PotatnoPreviewFunctionExecutorBuildContext<TProjectTypes extends PotatnoProjectTypesDefinition, TParams extends Record<string, unknown>> = {
    /**
     * Default values for the iteration parameters.
     */
    defaultParameters: TParams;

    /**
     * The bound function definition.
     */
    function: PotatnoFunctionDefinition<TProjectTypes>;

    /**
     * The project types definition; used to resolve static argument defaults.
     */
    projectTypes: TProjectTypes;
};

/**
 * Executable function for a "compiled" graph function.
 */
export type PotatnoPreviewFunctionExecutorCallable<TParams> = (pParameters: TParams) => unknown | Promise<unknown>;

/**
 * Result of one `build` call.
 *
 * @typeParam TParams - The iteration parameter shape.
 * @typeParam TResultType - Union of type names the executor can report.
 */
export type PotatnoPreviewFunctionExecutorBuildResult<TParams, TResultType extends string = string> = {
    /**
     * The per-iteration callable the display invokes.
     */
    execute: PotatnoPreviewFunctionExecutorCallable<TParams>;

    /**
     * Type name of the value the callable yields. Selects the display's matching adapter.
     */
    type: TResultType;
};

/**
 * Identifies which port the preview targets. `null` is passed instead for function-level previews.
 *
 * @typeParam TProject - The project the previewed port belongs to.
 */
export type PotatnoPreviewFunctionExecutorPortTarget<TProjectTypes extends PotatnoProjectTypesDefinition, TResultType extends PotatnoPreviewResultType<TProjectTypes> = PotatnoPreviewResultType<TProjectTypes>> = {
    /**
     * The document port being previewed.
     */
    documentPort: PotatnoDocumentPort<TProjectTypes> & {
        readonly resolvedDataType: TResultType;
    };

    /**
     * Debug hook marker that can be replaced by the executor when previewing this target.
     */
    nodeHook: string;

    /**
     * Value of the target port. Can be eighter a port value id or the actual value as a string representation.
     */
    value: string;
};

/**
 * The single build callback. Called once per driver refresh to turn the generator result into a
 * per-iteration callable plus its yielded value type.
 *
 * @typeParam TProject - The project the executor targets.
 * @typeParam TParams - The iteration parameter shape.
 * @typeParam TResultType - Union of type names the callback can report.
 */
export type PotatnoPreviewFunctionExecutorBuild<TProjectTypes extends PotatnoProjectTypesDefinition, TParams extends Record<string, unknown>, TResultType extends PotatnoPreviewResultType<TProjectTypes>> = (pExecutor: PotatnoPreviewFunctionExecutorBuildContext<TProjectTypes, TParams>, pGeneratorResult: PotatnoCodeGeneratorDocumentResult<TProjectTypes>, pPortTarget: PotatnoPreviewFunctionExecutorPortTarget<TProjectTypes, TResultType> | null) => PotatnoPreviewFunctionExecutorBuildResult<TParams, TResultType>;

/**
 * Constructor parameters for PotatnoPreviewFunctionExecutor.
 *
 * @typeParam TProject - The project the executor targets.
 * @typeParam TParams - The iteration parameter shape.
 * @typeParam TResultType - Union of type names the build callback can report.
 */
export type PotatnoPreviewFunctionExecutorConstructorParameter<TProjectTypes extends PotatnoProjectTypesDefinition, TParams extends Record<string, unknown>, TResultType extends PotatnoPreviewResultType<TProjectTypes>> = {
    /**
     * Default values for the iteration parameters. Must structurally match the paired display's
     * iteration parameter shape; the defaults seed every iteration call.
     */
    defaultParameters: TParams;

    /**
     * Result type names supported by this executor. Display adapters must be a subset of this list.
     */
    types: Array<TResultType>;

    /**
     * Build callback turning a generator result (and optional port target) into a callable plus
     * the type name of the value it yields.
     */
    build: PotatnoPreviewFunctionExecutorBuild<TProjectTypes, TParams, NoInfer<TResultType>>;
};
