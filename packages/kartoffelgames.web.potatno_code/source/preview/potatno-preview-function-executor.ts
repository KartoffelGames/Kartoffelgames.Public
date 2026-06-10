import type { PotatnoDocumentPort } from '../document/potatno-document-port.ts';
import type { PotatnoCodeGeneratorDocumentResult } from '../parser/result/potatno-code-generator-document-result.ts';
import type { PotatnoFunctionDefinition } from '../project/potatno-function-definition.ts';
import type { PotatnoProjectType } from '../project/potatno-project-types-definition.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';

/**
 * Runs a single function definition for a preview.
 *
 * Binds a `PotatnoFunctionDefinition` together with the iteration parameter spec and a `build`
 * callback. The callback receives an optional port target — `null` previews the whole function,
 * otherwise the targeted port's intermediate value — and returns the per-iteration callable plus
 * the type name of the value it yields.
 *
 * `TResultType` is inferred from the configured `types` array. It is the union of project type
 * names plus `MAIN`, the full-function preview type.
 *
 * @typeParam TProject - The project the executor targets.
 * @typeParam TParams - The iteration parameter shape supplied by the paired display per call.
 * @typeParam TResultType - Union of type names this executor can report.
 */
export class PotatnoPreviewFunctionExecutor<TProject extends PotatnoProject, TParams extends Record<string, unknown>, TResultType extends PotatnoPreviewResultType<TProject> = PotatnoPreviewResultType<TProject>> {
    /**
     * Full-function preview type.
     */
    public static readonly MAIN: 'MAIN' = 'MAIN';

    private readonly mBuild: PotatnoPreviewFunctionExecutorBuild<TProject, TParams, TResultType>;
    private readonly mDefaultParameters: TParams;
    private readonly mFunction: PotatnoFunctionDefinition<TProject>;
    private readonly mTypes: ReadonlyArray<TResultType>;

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
    public get function(): PotatnoFunctionDefinition<TProject> {
        return this.mFunction;
    }

    /**
     * Result type names this executor can report.
     */
    public get types(): ReadonlyArray<TResultType> {
        return this.mTypes;
    }

    /**
     * Constructor.
     *
     * @param pFunction - Bound function definition.
     * @param pParameters - Executor configuration.
     */
    public constructor(pFunction: PotatnoFunctionDefinition<TProject>, pParameters: PotatnoPreviewFunctionExecutorConstructorParameter<TProject, TParams, TResultType>) {
        this.mFunction = pFunction;
        this.mDefaultParameters = pParameters.defaultParameters;
        this.mTypes = pParameters.types;
        this.mBuild = pParameters.build;
    }

    /**
     * Compile the generator result into a per-iteration build result. The whole document result is
     * passed — entry function plus every dependency declaration — so previews of graphs calling
     * user functions have those in scope.
     *
     * @param pGeneratorResult - The document-level code generator result.
     * @param pPortTarget - The previewed port plus its resolved value identifier, or `null` for a function-level preview.
     *
     * @returns The build result: the iteration callable and the type name of the yielded value.
     */
    public compile(pGeneratorResult: PotatnoCodeGeneratorDocumentResult<TProject>, pPortTarget: PotatnoPreviewFunctionExecutorPortTarget<TProject> | null): PotatnoPreviewFunctionExecutorBuildResult<TParams, TResultType> {
        return this.mBuild({ defaultParameters: this.mDefaultParameters, function: this.mFunction, projectTypes: pGeneratorResult.entryPoint.function.project.types }, pGeneratorResult, pPortTarget);
    }
}

export type PotatnoPreviewMainType = typeof PotatnoPreviewFunctionExecutor.MAIN;
export type PotatnoPreviewResultType<TProject extends PotatnoProject> = PotatnoProjectType<TProject> | PotatnoPreviewMainType;

/**
 * Build-time view handed to the build callback.
 *
 * @typeParam TProject - The project the executor targets.
 * @typeParam TParams - The iteration parameter shape.
 */
export type PotatnoPreviewFunctionExecutorBuildContext<TProject extends PotatnoProject, TParams extends Record<string, unknown>> = {
    /**
     * Default values for the iteration parameters.
     */
    defaultParameters: TParams;

    /**
     * The bound function definition.
     */
    function: PotatnoFunctionDefinition<TProject>;

    /**
     * The project types definition; used to resolve static argument defaults.
     */
    projectTypes: TProject['types'];
};

/**
 * Iteration callable produced by the build callback and invoked per iteration. The result shape is
 * `unknown` so async executors (WebGPU dispatch, audio worklet) fit alongside compiled JS — the
 * driver awaits every result and coerces it through the display's type adapter.
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
export type PotatnoPreviewFunctionExecutorPortTarget<TProject extends PotatnoProject> = {
    /**
     * The document port being previewed.
     */
    documentPort: PotatnoDocumentPort<TProject>;

    /**
     * The identifier of the targeted value. Output ports carry the valueId allocated during code
     * generation; input ports carry their definition id — e.g. the output label keying a
     * function's returned object.
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
export type PotatnoPreviewFunctionExecutorBuild<TProject extends PotatnoProject, TParams extends Record<string, unknown>, TResultType extends PotatnoPreviewResultType<TProject>> = (pExecutor: PotatnoPreviewFunctionExecutorBuildContext<TProject, TParams>, pGeneratorResult: PotatnoCodeGeneratorDocumentResult<TProject>, pPortTarget: PotatnoPreviewFunctionExecutorPortTarget<TProject> | null) => PotatnoPreviewFunctionExecutorBuildResult<TParams, TResultType>;

/**
 * Constructor parameters for PotatnoPreviewFunctionExecutor.
 *
 * @typeParam TProject - The project the executor targets.
 * @typeParam TParams - The iteration parameter shape.
 * @typeParam TResultType - Union of type names the build callback can report.
 */
export type PotatnoPreviewFunctionExecutorConstructorParameter<TProject extends PotatnoProject, TParams extends Record<string, unknown>, TResultType extends PotatnoPreviewResultType<TProject>> = {
    /**
     * Default values for the iteration parameters. Must structurally match the paired display's
     * iteration parameter shape; the defaults seed every iteration call.
     */
    defaultParameters: TParams;

    /**
     * Result type names supported by this executor. Display adapters must be a subset of this list.
     */
    types: ReadonlyArray<TResultType>;

    /**
     * Build callback turning a generator result (and optional port target) into a callable plus
     * the type name of the value it yields.
     */
    build: PotatnoPreviewFunctionExecutorBuild<TProject, TParams, TResultType>;
};
