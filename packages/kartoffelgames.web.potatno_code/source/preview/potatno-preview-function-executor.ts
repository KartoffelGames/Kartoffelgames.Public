import type { PotatnoDocumentPort } from '../document/potatno-document-port.ts';
import type { PotatnoCodeGeneratorFunctionResult } from '../parser/result/potatno-code-generator-function-result.ts';
import type { PotatnoCodeGeneratorNodeResult } from '../parser/result/potatno-code-generator-node-result.ts';
import type { PotatnoFunctionDefinition } from '../project/potatno-function-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../project/potatno-project-types-definition.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';

/**
 * Runs a single function definition under a single display.
 *
 * An executor binds a `PotatnoFunctionDefinition` together with the iteration parameter shape
 * the matching display will feed in per call, and two user-supplied build callbacks: one for
 * function-level previews that yield the natural `TResult`, and one for per-node previews that
 * yield the targeted port's raw value (typed as `unknown` since the value's static type varies
 * with the port's `dataType`; the display's adapter then coerces it into `TResult` shape).
 *
 * Splitting the two paths into separate callbacks keeps each return type precise — the
 * function-level callback proves it returns `TResult`, the per-node callback returns whatever
 * the targeted port produces — without forcing either side through a widening cast.
 *
 * @typeParam TTypes - The project types definition the executor targets.
 * @typeParam TParams - The iteration parameter shape supplied by the paired display per call.
 * @typeParam TResult - The result shape the function-level callable produces.
 */
export class PotatnoPreviewFunctionExecutor<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>, TParams extends Readonly<Record<string, unknown>>, TResult> {
    /**
     * Create a new PotatnoPreviewFunctionExecutor.
     *
     * `pTypes` is taken purely for type inference and stored so build callbacks can read
     * project type defaults at compile time via `pExecutor.projectTypes`.
     *
     * @typeParam TTypes - Inferred project types definition.
     * @typeParam TParams - Inferred iteration parameter shape.
     * @typeParam TResult - Inferred function-level result shape.
     *
     * @param pTypes - Project types definition. Used for type inference and runtime helper access from inside the build callbacks.
     * @param pFunction - The function definition this executor wraps. Becomes `pExecutor.function`.
     * @param pParameters - Executor configuration: iteration parameter spec and the two build callbacks.
     *
     * @returns The constructed executor.
     */
    public static new<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>, TParams extends Readonly<Record<string, unknown>>, TResult>(pTypes: TTypes, pFunction: PotatnoFunctionDefinition<PotatnoProject<TTypes>>, pParameters: PotatnoPreviewFunctionExecutorConstructorParameter<TTypes, TParams, TResult>): PotatnoPreviewFunctionExecutor<TTypes, TParams, TResult> {
        return new PotatnoPreviewFunctionExecutor<TTypes, TParams, TResult>(pTypes, pFunction, pParameters);
    }

    private readonly mBuildFunction: PotatnoPreviewFunctionExecutorBuildFunction<TTypes, TParams, TResult>;
    private readonly mBuildNode: PotatnoPreviewFunctionExecutorBuildNode<TTypes, TParams>;
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
     * accessor inside the build callbacks when the user needs the parameter names/defaults.
     */
    public get parameters(): TParams {
        return this.mParameters;
    }

    /**
     * The project types definition. Exposed for use inside build callbacks — typically to
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
    protected constructor(pTypes: TTypes, pFunction: PotatnoFunctionDefinition<PotatnoProject<TTypes>>, pParameters: PotatnoPreviewFunctionExecutorConstructorParameter<TTypes, TParams, TResult>) {
        this.mProjectTypes = pTypes;
        this.mFunction = pFunction;
        this.mParameters = pParameters.parameters;
        this.mBuildFunction = pParameters.buildFunction;
        this.mBuildNode = pParameters.buildNode;
    }

    /**
     * Compile the function-level generator result into a per-iteration callable.
     *
     * Invokes `buildFunction` with a slim build context, the full function-result code (with
     * all hooks intact), and returns the callable the display will invoke per iteration.
     *
     * @param pGeneratorResult - The function-level code generator result.
     *
     * @returns A callable accepting one iteration's parameter object and returning the function's natural `TResult`.
     */
    public compileFunction(pGeneratorResult: PotatnoCodeGeneratorFunctionResult<PotatnoProject<TTypes>>): PotatnoPreviewFunctionExecutorCallable<TParams, TResult> {
        return this.mBuildFunction(this.buildContext(), pGeneratorResult);
    }

    /**
     * Compile a per-node generator result into a per-iteration callable.
     *
     * Invokes `buildNode` with the build context, the per-node graph result (whose `.code` is
     * the bounded subgraph body), and the port target identifying which intermediate value to
     * return. The returned callable yields the raw port value — the driver applies the
     * matching display adapter before handing it to `display.update`.
     *
     * @param pGeneratorResult - The per-node graph result whose exit node is the previewed node.
     * @param pPortTarget - The document port being previewed plus its bound `valueId`.
     *
     * @returns A callable accepting one iteration's parameter object and returning the targeted port's raw value.
     */
    public compileNode(pGeneratorResult: PotatnoCodeGeneratorNodeResult<PotatnoProject<TTypes>>, pPortTarget: PotatnoPreviewFunctionExecutorPortTarget<PotatnoProject<TTypes>>): PotatnoPreviewFunctionExecutorCallable<TParams, unknown> {
        return this.mBuildNode(this.buildContext(), pGeneratorResult, pPortTarget);
    }

    /**
     * Build the stable context view handed to both build callbacks. Kept off the executor
     * instance so TResult never appears in a contravariant inference position from the
     * callbacks' perspective.
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
 * Build-time view handed to the build callbacks. Carries the helpers documented in the
 * preview design — the bound function definition, the iteration parameter spec, and the project
 * types definition — without leaking TResult into a contravariant inference position.
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
 * Iteration callable produced by a build callback and invoked by the display per iteration.
 *
 * The return shape is `TResult | Promise<TResult>` so executors backed by async work — a
 * WebGPU dispatch, an audio worklet round-trip — fit alongside synchronous compiled JS. The
 * driver always normalises results through `Promise.resolve` before handing them to the
 * display.
 */
export type PotatnoPreviewFunctionExecutorCallable<TParams, TResult> = (pParameters: TParams) => TResult | Promise<TResult>;

/**
 * Discriminator for the per-node preview path passed to `buildNode`. Identifies which port's
 * intermediate value the per-node callable should yield.
 *
 * @typeParam TProject - The project the previewed port belongs to.
 */
export type PotatnoPreviewFunctionExecutorPortTarget<TProject extends PotatnoProject> = {
    /**
     * The document port being previewed.
     */
    documentPort: PotatnoDocumentPort<TProject>;

    /**
     * The valueId assigned to the port's output during code generation. The `buildNode`
     * callback rewrites the matching `/*[valueId]*\/`-style comment into a return statement
     * so the compiled function yields this intermediate value.
     */
    value: string;
};

/**
 * Function-level build callback. Called once per cache miss for function-level previews to
 * turn the generator's function-result code into a per-iteration callable returning the
 * function's natural `TResult`.
 *
 * @typeParam TTypes - The project types definition the executor targets.
 * @typeParam TParams - The iteration parameter shape.
 * @typeParam TResult - The function-level result shape.
 */
export type PotatnoPreviewFunctionExecutorBuildFunction<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>, TParams extends Readonly<Record<string, unknown>>, TResult> = (pExecutor: PotatnoPreviewFunctionExecutorBuildContext<TTypes, TParams>, pGeneratorResult: PotatnoCodeGeneratorFunctionResult<PotatnoProject<TTypes>>) => PotatnoPreviewFunctionExecutorCallable<TParams, TResult>;

/**
 * Per-node build callback. Called once per cache miss for per-node previews to compile the
 * targeted-node graph result into a per-iteration callable returning the port's raw value.
 *
 * The callable's return type is `unknown` rather than `TResult` because per-node previews
 * yield whatever the targeted port emits — a single number, a string, a custom struct — which
 * is not the same shape as the display's `TResult`. The driver bridges the gap by wrapping
 * the callable with the display's matching type adapter.
 *
 * @typeParam TTypes - The project types definition the executor targets.
 * @typeParam TParams - The iteration parameter shape.
 */
export type PotatnoPreviewFunctionExecutorBuildNode<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>, TParams extends Readonly<Record<string, unknown>>> = (pExecutor: PotatnoPreviewFunctionExecutorBuildContext<TTypes, TParams>, pGeneratorResult: PotatnoCodeGeneratorNodeResult<PotatnoProject<TTypes>>, pPortTarget: PotatnoPreviewFunctionExecutorPortTarget<PotatnoProject<TTypes>>) => PotatnoPreviewFunctionExecutorCallable<TParams, unknown>;

/**
 * Constructor parameters for PotatnoPreviewFunctionExecutor.
 *
 * @typeParam TTypes - The project types definition the executor targets.
 * @typeParam TParams - The iteration parameter shape.
 * @typeParam TResult - The function-level result shape.
 */
export type PotatnoPreviewFunctionExecutorConstructorParameter<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>, TParams extends Readonly<Record<string, unknown>>, TResult> = {
    /**
     * Iteration parameter spec — JS-value defaults. Must structurally match the paired display's
     * `expectedParameters`.
     */
    parameters: TParams;

    /**
     * Build callback for the function-level preview path. Receives the full function-result
     * code and returns a callable yielding the function's natural `TResult`.
     */
    buildFunction: PotatnoPreviewFunctionExecutorBuildFunction<TTypes, TParams, TResult>;

    /**
     * Build callback for the per-node preview path. Receives the per-node graph result plus
     * the port target and returns a callable yielding the targeted port's raw value.
     */
    buildNode: PotatnoPreviewFunctionExecutorBuildNode<TTypes, TParams>;
};
