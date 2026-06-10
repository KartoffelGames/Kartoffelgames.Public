import type { PotatnoDocumentPort } from '../document/potatno-document-port.ts';
import type { PotatnoCodeGeneratorDocumentResult } from '../parser/result/potatno-code-generator-document-result.ts';
import type { PotatnoFunctionDefinition } from '../project/potatno-function-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../project/potatno-project-types-definition.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';

/**
 * Runs a single function definition for a preview.
 *
 * Binds a `PotatnoFunctionDefinition` together with the iteration parameter spec and a `build`
 * callback. The callback receives an optional port target — `null` previews the whole function,
 * otherwise the targeted port's intermediate value — and returns the per-iteration callable plus
 * the type name of the value it yields.
 *
 * `TResultType` is inferred from the build callback's returned `type` values. It is the union of
 * every type name this executor can report and is matched against a display's adapter record when
 * the pair is registered.
 *
 * @typeParam TTypes - The project types definition the executor targets.
 * @typeParam TParams - The iteration parameter shape supplied by the paired display per call.
 * @typeParam TResultType - Union of type names the build callback can report.
 */
export class PotatnoPreviewFunctionExecutor<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>, TParams extends Record<string, unknown>, TResultType extends string = string> {
    /**
     * Create a new PotatnoPreviewFunctionExecutor. `pTypes` is stored so the build callback can
     * read project type defaults via its context.
     *
     * @typeParam TTypes - Inferred project types definition.
     * @typeParam TParams - Inferred iteration parameter shape.
     * @typeParam TResultType - Inferred union of reported type names.
     *
     * @param pTypes - Project types definition.
     * @param pFunction - The function definition this executor wraps.
     * @param pParameters - Executor configuration: iteration parameter spec and the build callback.
     *
     * @returns The constructed executor.
     */
    public static new<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>, TParams extends Record<string, unknown>, TResultType extends string>(pTypes: TTypes, pFunction: PotatnoFunctionDefinition<PotatnoProject<TTypes>>, pParameters: PotatnoPreviewFunctionExecutorConstructorParameter<TTypes, TParams, TResultType>): PotatnoPreviewFunctionExecutor<TTypes, TParams, TResultType> {
        return new PotatnoPreviewFunctionExecutor<TTypes, TParams, TResultType>(pTypes, pFunction, pParameters);
    }

    private readonly mBuild: PotatnoPreviewFunctionExecutorBuild<TTypes, TParams, TResultType>;
    private readonly mDefaultParameters: TParams;
    private readonly mFunction: PotatnoFunctionDefinition<PotatnoProject<TTypes>>;
    private readonly mProjectTypes: TTypes;

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
    public get function(): PotatnoFunctionDefinition<PotatnoProject<TTypes>> {
        return this.mFunction;
    }

    /**
     * Constructor.
     *
     * @param pTypes - Project types definition.
     * @param pFunction - Bound function definition.
     * @param pParameters - The executor configuration captured by `new`.
     */
    protected constructor(pTypes: TTypes, pFunction: PotatnoFunctionDefinition<PotatnoProject<TTypes>>, pParameters: PotatnoPreviewFunctionExecutorConstructorParameter<TTypes, TParams, TResultType>) {
        this.mProjectTypes = pTypes;
        this.mFunction = pFunction;
        this.mDefaultParameters = pParameters.defaultParameters;
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
    public compile(pGeneratorResult: PotatnoCodeGeneratorDocumentResult<PotatnoProject<TTypes>>, pPortTarget: PotatnoPreviewFunctionExecutorPortTarget<PotatnoProject<TTypes>> | null): PotatnoPreviewFunctionExecutorBuildResult<TParams, TResultType> {
        return this.mBuild({ defaultParameters: this.mDefaultParameters, function: this.mFunction, projectTypes: this.mProjectTypes }, pGeneratorResult, pPortTarget);
    }
}

/**
 * Build-time view handed to the build callback.
 *
 * @typeParam TTypes - The project types definition the executor targets.
 * @typeParam TParams - The iteration parameter shape.
 */
export type PotatnoPreviewFunctionExecutorBuildContext<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>, TParams extends Record<string, unknown>> = {
    /**
     * Default values for the iteration parameters.
     */
    defaultParameters: TParams;

    /**
     * The bound function definition.
     */
    function: PotatnoFunctionDefinition<PotatnoProject<TTypes>>;

    /**
     * The project types definition; used to resolve static argument defaults.
     */
    projectTypes: TTypes;
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
 * @typeParam TTypes - The project types definition the executor targets.
 * @typeParam TParams - The iteration parameter shape.
 * @typeParam TResultType - Union of type names the callback can report.
 */
export type PotatnoPreviewFunctionExecutorBuild<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>, TParams extends Record<string, unknown>, TResultType extends string> = (pExecutor: PotatnoPreviewFunctionExecutorBuildContext<TTypes, TParams>, pGeneratorResult: PotatnoCodeGeneratorDocumentResult<PotatnoProject<TTypes>>, pPortTarget: PotatnoPreviewFunctionExecutorPortTarget<PotatnoProject<TTypes>> | null) => PotatnoPreviewFunctionExecutorBuildResult<TParams, TResultType>;

/**
 * Constructor parameters for PotatnoPreviewFunctionExecutor.
 *
 * @typeParam TTypes - The project types definition the executor targets.
 * @typeParam TParams - The iteration parameter shape.
 * @typeParam TResultType - Union of type names the build callback can report.
 */
export type PotatnoPreviewFunctionExecutorConstructorParameter<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>, TParams extends Record<string, unknown>, TResultType extends string> = {
    /**
     * Default values for the iteration parameters. Must structurally match the paired display's
     * iteration parameter shape; the defaults seed every iteration call.
     */
    defaultParameters: TParams;

    /**
     * Build callback turning a generator result (and optional port target) into a callable plus
     * the type name of the value it yields.
     */
    build: PotatnoPreviewFunctionExecutorBuild<TTypes, TParams, TResultType>;
};
