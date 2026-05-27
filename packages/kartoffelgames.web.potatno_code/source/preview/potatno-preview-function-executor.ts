import type { PotatnoDocumentPort } from '../document/potatno-document-port.ts';
import type { PotatnoCodeGeneratorFunctionResult } from '../parser/result/potatno-code-generator-function-result.ts';
import type { PotatnoCodeGeneratorNodeResult } from '../parser/result/potatno-code-generator-node-result.ts';
import type { PotatnoFunctionDefinition } from '../project/potatno-function-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../project/potatno-project-types-definition.ts';
import { PotatnoProject } from '../project/potatno-project.ts';

/**
 * Runs a single function definition under a single display.
 *
 * An executor binds a `PotatnoFunctionDefinition` together with the iteration parameter shape
 * the matching display will feed in per call, and a user-supplied `build` callback that
 * compiles the generator's code into a callable. The same function may have multiple executors
 * (e.g. one running via `new Function()` for a 2d-canvas display, another via WebGPU for a
 * higher-fidelity display); each lives independently in the preview registry.
 *
 * `build` is invoked by the driver once per (code-version × port-target) combination and its
 * return value is cached opaquely until the cache is externally invalidated.
 *
 * @typeParam TTypes - The project types definition the executor targets.
 * @typeParam TParams - The iteration parameter shape supplied by the paired display per call.
 * @typeParam TResult - The result shape the iteration callable produces.
 */
export class PotatnoPreviewFunctionExecutor<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>, TParams extends Readonly<Record<string, unknown>>, TResult> {
    /**
     * Create a new PotatnoPreviewFunctionExecutor.
     *
     * `pTypes` is taken purely for type inference and stored so the user's `build` callback can
     * read project type defaults at compile time via `pExecutor.projectTypes`.
     *
     * @typeParam TTypes - Inferred project types definition.
     * @typeParam TParams - Inferred iteration parameter shape.
     * @typeParam TResult - Inferred iteration result shape.
     *
     * @param pTypes - Project types definition. Used for type inference and runtime helper access from inside `build`.
     * @param pFunction - The function definition this executor wraps. Becomes `pExecutor.function`.
     * @param pParameters - Executor configuration: iteration parameter spec and the build callback.
     *
     * @returns The constructed executor.
     */
    public static new<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>, TParams extends Readonly<Record<string, unknown>>, TResult>(pTypes: TTypes, pFunction: PotatnoFunctionDefinition<PotatnoProject<TTypes>>, pParameters: PotatnoPreviewFunctionExecutorConstructorParameter<TTypes, TParams, TResult>): PotatnoPreviewFunctionExecutor<TTypes, TParams, TResult> {
        return new PotatnoPreviewFunctionExecutor<TTypes, TParams, TResult>(pTypes, pFunction, pParameters);
    }

    private readonly mBuild: PotatnoPreviewFunctionExecutorBuild<TTypes, TParams, TResult>;
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
     * accessor inside `build` when the user needs the parameter names/defaults.
     */
    public get parameters(): TParams {
        return this.mParameters;
    }

    /**
     * The project types definition. Exposed for use inside `build` — typically to resolve a
     * function's static inputs from their project type's `default.value`.
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
    protected constructor(pTypes: TTypes, pFunction: PotatnoFunctionDefinition<PotatnoProject<TTypes>>, pParameters: PotatnoPreviewFunctionExecutorConstructorParameter<TTypes, TParams, TResult>) {
        this.mProjectTypes = pTypes;
        this.mFunction = pFunction;
        this.mParameters = pParameters.parameters;
        this.mBuild = pParameters.build;
    }

    /**
     * Compile a generator result into a per-iteration callable.
     *
     * Invokes the user-supplied `build` callback with a slim build-context view of this
     * executor, the generator result whose code contains the auto-emitted hooks, and the port
     * target (or `null` for function-level previews). The returned callable is what the
     * display's `update` loop will invoke per iteration. The driver caches this return value
     * until invalidated.
     *
     * @param pGeneratorResult - The code generator's output for the bound function. Carries all hooks intact; the user's `build` is responsible for rewriting the requested hook when `pPortTarget` is non-null.
     * @param pPortTarget - For function-level previews, `null`. For per-node previews, the document port being previewed plus its bound `valueId`.
     *
     * @returns A callable accepting one iteration's parameter object and returning the raw result.
     */
    public compile(pGeneratorResult: PotatnoCodeGeneratorFunctionResult<PotatnoProject<TTypes>> | PotatnoCodeGeneratorNodeResult<PotatnoProject<TTypes>>, pPortTarget: PotatnoPreviewFunctionExecutorPortTarget<PotatnoProject<TTypes>> | null): PotatnoPreviewFunctionExecutorCallable<TParams, TResult> {
        // Hand the user a stable context view rather than `this`. Keeping TResult off the context
        // is what lets TS infer TResult solely from the build callback's return type at the
        // `.new` call site.
        const lContext: PotatnoPreviewFunctionExecutorBuildContext<TTypes, TParams> = {
            function: this.mFunction,
            parameters: this.mParameters,
            projectTypes: this.mProjectTypes
        };

        return this.mBuild(lContext, pGeneratorResult, pPortTarget);
    }
}

/**
 * Build-time view handed to the user's `build` callback. Carries the helpers documented in the
 * preview design — the bound function definition, the iteration parameter spec, and the project
 * types definition — without leaking `TResult` into a contravariant inference position, which
 * would otherwise stop TS from inferring `TResult` from the callback's return type.
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
 * Iteration callable produced by `build` and invoked by the display per iteration.
 *
 * The return shape is `TResult | Promise<TResult>` so executors backed by async work — a
 * WebGPU dispatch, an audio worklet round-trip — fit alongside synchronous compiled JS. The
 * driver always normalises results through `Promise.resolve` before handing them to the
 * display.
 */
export type PotatnoPreviewFunctionExecutorCallable<TParams, TResult> = (pParameters: TParams) => TResult | Promise<TResult>;

/**
 * Discriminator for the per-node preview path passed to `build`. For function-level previews
 * `null` is supplied instead.
 *
 * @typeParam TProject - The project the previewed port belongs to.
 */
export type PotatnoPreviewFunctionExecutorPortTarget<TProject extends PotatnoProject> = {
    /**
     * The document port being previewed.
     */
    documentPort: PotatnoDocumentPort<TProject>;

    /**
     * The valueId assigned to the port's output during code generation. The `build` callback
     * rewrites the matching `/*HOOK[valueId]*\/`-style comment into a return statement so the
     * compiled function yields this intermediate value instead of its natural result.
     */
    valueId: string;
};

/**
 * User-supplied build callback. Called once per cache miss to turn the generator's code into
 * a per-iteration callable. Free to compile via `new Function()`, build a WebGPU pipeline,
 * spin up an AudioContext node graph — whatever the display needs.
 *
 * The `pExecutor` parameter is intentionally typed as a slim build-context view rather than the
 * full executor instance. Threading TResult only through the return type lets TS infer it
 * cleanly from the callable the callback hands back — the same trick the rest of the codebase
 * uses to keep call sites free of explicit generic arguments.
 *
 * @typeParam TTypes - The project types definition the executor targets.
 * @typeParam TParams - The iteration parameter shape.
 * @typeParam TResult - The iteration result shape.
 */
export type PotatnoPreviewFunctionExecutorBuild<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>, TParams extends Readonly<Record<string, unknown>>, TResult> = (pExecutor: PotatnoPreviewFunctionExecutorBuildContext<TTypes, TParams>, pGeneratorResult: PotatnoCodeGeneratorFunctionResult<PotatnoProject<TTypes>> | PotatnoCodeGeneratorNodeResult<PotatnoProject<TTypes>>, pPortTarget: PotatnoPreviewFunctionExecutorPortTarget<PotatnoProject<TTypes>> | null) => PotatnoPreviewFunctionExecutorCallable<TParams, TResult>;

/**
 * Constructor parameters for PotatnoPreviewFunctionExecutor.
 *
 * @typeParam TTypes - The project types definition the executor targets.
 * @typeParam TParams - The iteration parameter shape.
 * @typeParam TResult - The iteration result shape.
 */
export type PotatnoPreviewFunctionExecutorConstructorParameter<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>, TParams extends Readonly<Record<string, unknown>>, TResult> = {
    /**
     * Iteration parameter spec — JS-value defaults. Must structurally match the paired display's
     * `expectedParameters`.
     */
    parameters: TParams;

    /**
     * Build callback turning the generator's code into a per-iteration callable.
     */
    build: PotatnoPreviewFunctionExecutorBuild<TTypes, TParams, TResult>;
};
