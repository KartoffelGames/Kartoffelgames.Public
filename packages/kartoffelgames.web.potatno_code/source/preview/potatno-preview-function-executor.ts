import type { PotatnoDocumentPort } from '../document/potatno-document-port.ts';
import type { PotatnoCodeGeneratorDocumentResult } from '../parser/result/potatno-code-generator-document-result.ts';
import type { PotatnoFunctionDefinition } from '../project/potatno-function-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../project/potatno-project-types-definition.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';

/**
 * Runs a single function definition for a preview.
 *
 * An executor binds a `PotatnoFunctionDefinition` together with the iteration parameter shape the
 * matching display feeds in per call, and a single `build` callback. The callback receives an
 * optional port target: when it is `null` the whole function is previewed (function-level), when
 * it is set the previewed value is the targeted port's intermediate value. There is no separate
 * function/node callback — the user code branches on `pPortTarget` if it needs to.
 *
 * The callback returns both the per-iteration callable and the project type name of the value it
 * yields, so the paired display can pick the matching type adapter to coerce that value into its
 * render shape — for the full-function result just as for a single port value.
 *
 * @typeParam TTypes - The project types definition the executor targets.
 * @typeParam TParams - The iteration parameter shape supplied by the paired display per call.
 */
export class PotatnoPreviewFunctionExecutor<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>, TParams extends Readonly<Record<string, unknown>>> {
    /**
     * Create a new PotatnoPreviewFunctionExecutor.
     *
     * `pTypes` is taken purely for type inference and stored so the build callback can read
     * project type defaults at compile time via `pExecutor.projectTypes`.
     *
     * @typeParam TTypes - Inferred project types definition.
     * @typeParam TParams - Inferred iteration parameter shape.
     *
     * @param pTypes - Project types definition. Used for type inference and runtime helper access from inside the build callback.
     * @param pFunction - The function definition this executor wraps. Becomes `pExecutor.function`.
     * @param pParameters - Executor configuration: iteration parameter spec and the build callback.
     *
     * @returns The constructed executor.
     */
    public static new<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>, TParams extends Readonly<Record<string, unknown>>>(pTypes: TTypes, pFunction: PotatnoFunctionDefinition<PotatnoProject<TTypes>>, pParameters: PotatnoPreviewFunctionExecutorConstructorParameter<TTypes, TParams>): PotatnoPreviewFunctionExecutor<TTypes, TParams> {
        return new PotatnoPreviewFunctionExecutor<TTypes, TParams>(pTypes, pFunction, pParameters);
    }

    private readonly mBuild: PotatnoPreviewFunctionExecutorBuild<TTypes, TParams>;
    private readonly mFunction: PotatnoFunctionDefinition<PotatnoProject<TTypes>>;
    private readonly mParameters: TParams;
    private readonly mProjectTypes: TTypes;

    /**
     * The function definition this executor wraps.
     */
    public get function(): PotatnoFunctionDefinition<PotatnoProject<TTypes>> {
        return this.mFunction;
    }

    /**
     * The iteration parameter spec the paired display feeds in each call. Used both for
     * compile-time pair matching with the display's `expectedParameters` and as the typed
     * accessor inside the build callback when the user needs the parameter names/defaults.
     */
    public get parameters(): TParams {
        return this.mParameters;
    }

    /**
     * The project types definition. Exposed for use inside the build callback — typically to
     * resolve a function's static inputs from their project type's `default.value`.
     */
    public get projectTypes(): TTypes {
        return this.mProjectTypes;
    }

    /**
     * Constructor.
     *
     * @param pTypes - Project types definition.
     * @param pFunction - Bound function definition.
     * @param pParameters - The executor configuration captured by `new`.
     */
    protected constructor(pTypes: TTypes, pFunction: PotatnoFunctionDefinition<PotatnoProject<TTypes>>, pParameters: PotatnoPreviewFunctionExecutorConstructorParameter<TTypes, TParams>) {
        this.mProjectTypes = pTypes;
        this.mFunction = pFunction;
        this.mParameters = pParameters.parameters;
        this.mBuild = pParameters.build;
    }

    /**
     * Compile the generator result into a per-iteration build result.
     *
     * Invokes `build` with a slim build context, the full document-result code (the entry function
     * plus every dependency function declaration, with all hooks intact) and the port target. The
     * whole document is passed — not just the entry function — so a preview of a graph that calls
     * user functions has those declarations in scope. The returned build result pairs the callable
     * the display invokes per iteration with the project type name of the value it yields.
     *
     * @param pGeneratorResult - The document-level code generator result.
     * @param pPortTarget - The previewed port plus its resolved value identifier, or `null` for a function-level preview.
     *
     * @returns The build result: the iteration callable and the type name of the yielded value.
     */
    public compile(pGeneratorResult: PotatnoCodeGeneratorDocumentResult<PotatnoProject<TTypes>>, pPortTarget: PotatnoPreviewFunctionExecutorPortTarget<PotatnoProject<TTypes>> | null): PotatnoPreviewFunctionExecutorBuildResult<TParams> {
        return this.mBuild(this.buildContext(), pGeneratorResult, pPortTarget);
    }

    /**
     * Build the stable context view handed to the build callback. Kept off the executor instance so
     * the iteration parameter spec and project types are accessed through one cohesive object.
     *
     * @returns The build context for this executor.
     */
    private buildContext(): PotatnoPreviewFunctionExecutorBuildContext<TTypes, TParams> {
        return {
            function: this.mFunction,
            parameters: this.mParameters,
            projectTypes: this.mProjectTypes
        };
    }
}

/**
 * Build-time view handed to the build callback. Carries the bound function definition, the
 * iteration parameter spec, and the project types definition.
 *
 * @typeParam TTypes - The project types definition the executor targets.
 * @typeParam TParams - The iteration parameter shape.
 */
export type PotatnoPreviewFunctionExecutorBuildContext<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>, TParams extends Readonly<Record<string, unknown>>> = {
    /**
     * The bound function definition.
     */
    function: PotatnoFunctionDefinition<PotatnoProject<TTypes>>;

    /**
     * The iteration parameter spec.
     */
    parameters: TParams;

    /**
     * The project types definition; used to resolve static argument defaults.
     */
    projectTypes: TTypes;
};

/**
 * Iteration callable produced by the build callback and invoked by the display per iteration.
 *
 * The return shape is `unknown | Promise<unknown>` so executors backed by async work — a WebGPU
 * dispatch, an audio worklet round-trip — fit alongside synchronous compiled JS. The driver
 * always normalises results through `Promise.resolve` and the display's type adapter before
 * handing them to the display.
 */
export type PotatnoPreviewFunctionExecutorCallable<TParams> = (pParameters: TParams) => unknown | Promise<unknown>;

/**
 * Result of one `build` call: the per-iteration callable plus the project type name of the value
 * it yields. The driver uses the type to select the display's matching adapter.
 *
 * @typeParam TParams - The iteration parameter shape.
 */
export type PotatnoPreviewFunctionExecutorBuildResult<TParams> = {
    /**
     * The per-iteration callable the display invokes.
     */
    execute: PotatnoPreviewFunctionExecutorCallable<TParams>;

    /**
     * Project type name of the value the callable yields. Selects the display's type adapter.
     */
    type: string;
};

/**
 * Identifies which port the preview targets. `null` is passed to the build callback instead of a
 * target for function-level previews.
 *
 * @typeParam TProject - The project the previewed port belongs to.
 */
export type PotatnoPreviewFunctionExecutorPortTarget<TProject extends PotatnoProject> = {
    /**
     * The document port being previewed.
     */
    documentPort: PotatnoDocumentPort<TProject>;

    /**
     * The resolved identifier of the targeted value. For per-node previews this is the valueId
     * allocated to the port's output during code generation (the build callback rewrites the
     * matching `/*[valueId]*\/`-style hook into a return); for a function-output preview it is the
     * output label keying the function's returned object.
     */
    value: string;
};

/**
 * The single build callback. Called once per cache refresh to turn the generator result into a
 * per-iteration callable plus its yielded value type. `pPortTarget` is `null` for function-level
 * previews and set for per-port previews.
 *
 * @typeParam TTypes - The project types definition the executor targets.
 * @typeParam TParams - The iteration parameter shape.
 */
export type PotatnoPreviewFunctionExecutorBuild<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>, TParams extends Readonly<Record<string, unknown>>> = (pExecutor: PotatnoPreviewFunctionExecutorBuildContext<TTypes, TParams>, pGeneratorResult: PotatnoCodeGeneratorDocumentResult<PotatnoProject<TTypes>>, pPortTarget: PotatnoPreviewFunctionExecutorPortTarget<PotatnoProject<TTypes>> | null) => PotatnoPreviewFunctionExecutorBuildResult<TParams>;

/**
 * Constructor parameters for PotatnoPreviewFunctionExecutor.
 *
 * @typeParam TTypes - The project types definition the executor targets.
 * @typeParam TParams - The iteration parameter shape.
 */
export type PotatnoPreviewFunctionExecutorConstructorParameter<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>, TParams extends Readonly<Record<string, unknown>>> = {
    /**
     * Iteration parameter spec — JS-value defaults. Must structurally match the paired display's
     * `expectedParameters`.
     */
    parameters: TParams;

    /**
     * Build callback turning a generator result (and optional port target) into a callable plus
     * the project type name of the value it yields.
     */
    build: PotatnoPreviewFunctionExecutorBuild<TTypes, TParams>;
};
