import type { PotatnoCodeGeneratorDocumentResult } from '../parser/result/potatno-code-generator-document-result.ts';
import type { PotatnoCodeGeneratorNodeResult } from '../parser/result/potatno-code-generator-node-result.ts';
import type { PotatnoProjectGenericType, PotatnoProjectType } from '../project/potatno-project-types-definition.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';
import type { PotatnoPreviewDisplay, PotatnoPreviewDisplayTypeAdapter } from './potatno-preview-display.ts';
import type { PotatnoPreviewFunctionExecutor, PotatnoPreviewFunctionExecutorCallable, PotatnoPreviewFunctionExecutorPortTarget } from './potatno-preview-function-executor.ts';

/**
 * Runtime object the UI binds to one visible preview.
 *
 * Bundles a `(display, executor, port-target)` triple together with a callback that yields the
 * current generator result. Lazily creates the element via `display.generate()`, lazily compiles
 * the executor callable on first `render` after an invalidation, transparently wraps the
 * callable with the matching adapter for per-node previews, and delegates the per-render
 * iteration loop to `display.update`.
 *
 * Cache invalidation is external — the driver does not observe graph mutations. The framework
 * calls `invalidateCache()` whenever the underlying code-gen result is known to be stale.
 *
 * The driver is generic over the bound `TProject` directly (rather than the project's `TTypes`)
 * so consumers carrying a project type can plug a driver in without reconstructing the project
 * type from its types definition — the kind of reconstruction TypeScript treats as a brand-new,
 * incompatible type.
 *
 * @typeParam TProject - The project type the driver targets.
 * @typeParam TElement - The element type produced by the display.
 * @typeParam TParams - The iteration parameter shape.
 * @typeParam TResult - The result shape both adapter and display consume.
 */
export class PotatnoPreviewDriver<TProject extends PotatnoProject, TElement extends Element, TParams extends Readonly<Record<string, unknown>>, TResult> implements PotatnoPreviewDriverHandle {
    private mCachedCallable: PotatnoPreviewFunctionExecutorCallable<TParams, TResult> | null;
    private readonly mDisplay: PotatnoPreviewDisplay<TProject['types'], TElement, TParams, TResult, PotatnoPreviewDisplayTypeAdapter<TProject['types'], TResult>>;
    private mElement: TElement | null;
    private readonly mExecutor: PotatnoPreviewFunctionExecutor<TProject['types'], TParams, TResult>;
    private readonly mFunctionResultProvider: (() => PotatnoCodeGeneratorDocumentResult<TProject>) | null;
    private readonly mNodeResultProvider: (() => PotatnoCodeGeneratorNodeResult<TProject>) | null;
    private readonly mPortTarget: PotatnoPreviewFunctionExecutorPortTarget<TProject> | null;

    /**
     * The project type id of the port being previewed, or `null` for function-level previews.
     * The framework uses this to decide which display adapter to wrap the executor with.
     */
    public get dataType(): PotatnoProjectType<TProject> | PotatnoProjectGenericType | null {
        if (!this.mPortTarget) {
            return null;
        }

        return this.mPortTarget.documentPort.dataType;
    }

    /**
     * The element the display renders into. Lazily created on first access via `display.generate()`.
     */
    public get element(): TElement {
        if (!this.mElement) {
            this.mElement = this.mDisplay.generate();
        }

        return this.mElement;
    }

    /**
     * The bound port target, or `null` when this driver represents a function-level preview.
     */
    public get portTarget(): PotatnoPreviewFunctionExecutorPortTarget<TProject> | null {
        return this.mPortTarget;
    }

    /**
     * Constructor.
     *
     * @param pParameters - Driver configuration capturing the display/executor/port-target triple and the generator-result provider.
     */
    public constructor(pParameters: PotatnoPreviewDriverConstructorParameter<TProject, TElement, TParams, TResult>) {
        this.mDisplay = pParameters.display;
        this.mExecutor = pParameters.executor;
        this.mCachedCallable = null;
        this.mElement = null;

        // The constructor parameter is a discriminated union: function-level drivers ship a
        // document-result provider with `portTarget: null`; per-node drivers ship a node-result
        // provider with a non-null port target. Splitting them onto separate fields lets the
        // render path call the right one without a runtime cast on the result type.
        if (pParameters.portTarget === null) {
            this.mPortTarget = null;
            this.mFunctionResultProvider = pParameters.generatorResultProvider;
            this.mNodeResultProvider = null;
        } else {
            this.mPortTarget = pParameters.portTarget;
            this.mFunctionResultProvider = null;
            this.mNodeResultProvider = pParameters.generatorResultProvider;
        }
    }

    /**
     * Drop the cached iteration callable. The next `render` call will pull a fresh generator
     * result and re-invoke `executor.compile`. The element itself is preserved so the previous
     * preview stays visible until the new callable is ready.
     */
    public invalidateCache(): void {
        this.mCachedCallable = null;
    }

    /**
     * Run one render pass.
     *
     * Compile-on-demand: when the cache is empty, fetches the current generator result and
     * compiles a fresh callable via `executor.compile`. Then wraps the callable with the
     * display's adapter for per-node previews (function-level previews skip the wrap, since the
     * executor already returns a value in `defaultResult` shape) and hands control to
     * `display.update`.
     *
     * @returns A promise resolving when the display's update pass completes.
     */
    public async render(): Promise<void> {
        // Compile-on-demand. Build is only re-invoked when something external invalidated the
        // cache. The function-level path stays strictly typed against TResult; the per-node
        // path runs through the display's adapter to coerce the port's raw value into TResult.
        if (!this.mCachedCallable) {
            this.mCachedCallable = this.compileCachedCallable();
        }

        // Hand off to the display's update loop. Awaiting covers both sync and async updates.
        await Promise.resolve(this.mDisplay.update(this.element, this.mCachedCallable));
    }

    /**
     * Resolve a freshly compiled per-iteration callable from the current generator result.
     *
     * For function-level drivers the callable comes directly from `executor.compileFunction`
     * and is TResult-typed end to end. For per-node drivers the callable comes from
     * `executor.compileNode` (returning the port's raw value, typed `unknown`) wrapped in the
     * display's matching type adapter so the result lands in the same TResult shape the
     * display's `update` expects.
     *
     * @returns The composed iteration callable to cache and hand to `display.update`.
     */
    private compileCachedCallable(): PotatnoPreviewFunctionExecutorCallable<TParams, TResult> {
        // Function-level: pipe the document-result code through the executor's function build.
        // The function build returns a TResult-typed callable; no adapter wrap needed.
        if (this.mFunctionResultProvider !== null) {
            return this.mExecutor.compileFunction(this.mFunctionResultProvider());
        }

        // Per-node: the node-result provider and port target are guaranteed non-null by the
        // constructor's discriminated union — if we got here, both are set.
        const lNodeResult: PotatnoCodeGeneratorNodeResult<TProject> = this.mNodeResultProvider!();
        const lRawCallable: PotatnoPreviewFunctionExecutorCallable<TParams, unknown> = this.mExecutor.compileNode(lNodeResult, this.mPortTarget!);

        // Wrap with the display's matching type adapter so the loop sees TResult-shaped values
        // just like the function-level path. Falling back to an identity wrap keeps things
        // rendering when no adapter is registered — at runtime the port value flows through
        // unchanged.
        const lDataType: string = this.mPortTarget!.documentPort.dataType;
        const lAdapter: ((pValue: unknown) => TResult) | undefined = this.mDisplay.adapterFor(lDataType);
        const lAdapterFunction: (pValue: unknown) => TResult = lAdapter ?? ((pValue: unknown): TResult => pValue as TResult);

        return async (pParameters: TParams): Promise<TResult> => {
            const lRawResult: unknown = await Promise.resolve(lRawCallable(pParameters));
            return lAdapterFunction(lRawResult);
        };
    }
}

/**
 * Constructor parameters for PotatnoPreviewDriver.
 *
 * The parameter is a discriminated union on `portTarget` so the generator-result provider's
 * return type is precise per case: function-level drivers get a document-result provider,
 * per-node drivers get a node-result provider. No casting is required inside the driver to
 * narrow between the two.
 *
 * @typeParam TProject - The project type the driver targets.
 * @typeParam TElement - The display's element type.
 * @typeParam TParams - The iteration parameter shape.
 * @typeParam TResult - The shared result shape.
 */
export type PotatnoPreviewDriverConstructorParameter<TProject extends PotatnoProject, TElement extends Element, TParams extends Readonly<Record<string, unknown>>, TResult> =
    & PotatnoPreviewDriverConstructorBaseParameter<TProject, TElement, TParams, TResult>
    & (PotatnoPreviewDriverConstructorFunctionParameter<TProject> | PotatnoPreviewDriverConstructorNodeParameter<TProject>);

/**
 * Shared portion of the driver's constructor parameter — the display/executor pair that does
 * not depend on which preview path (function-level vs per-node) is active.
 *
 * @typeParam TProject - The project type the driver targets.
 * @typeParam TElement - The display's element type.
 * @typeParam TParams - The iteration parameter shape.
 * @typeParam TResult - The shared result shape.
 */
export type PotatnoPreviewDriverConstructorBaseParameter<TProject extends PotatnoProject, TElement extends Element, TParams extends Readonly<Record<string, unknown>>, TResult> = {
    /**
     * The display side of the bundled triple.
     */
    display: PotatnoPreviewDisplay<TProject['types'], TElement, TParams, TResult, PotatnoPreviewDisplayTypeAdapter<TProject['types'], TResult>>;

    /**
     * The executor side of the bundled triple.
     */
    executor: PotatnoPreviewFunctionExecutor<TProject['types'], TParams, TResult>;
};

/**
 * Function-level branch of the discriminated constructor parameter. `portTarget` is `null`
 * and the provider yields document-result code.
 *
 * @typeParam TProject - The project type the driver targets.
 */
export type PotatnoPreviewDriverConstructorFunctionParameter<TProject extends PotatnoProject> = {
    readonly portTarget: null;
    readonly generatorResultProvider: () => PotatnoCodeGeneratorDocumentResult<TProject>;
};

/**
 * Per-node branch of the discriminated constructor parameter. `portTarget` is non-null and
 * the provider yields a node-result whose exit node is the previewed node.
 *
 * @typeParam TProject - The project type the driver targets.
 */
export type PotatnoPreviewDriverConstructorNodeParameter<TProject extends PotatnoProject> = {
    readonly portTarget: PotatnoPreviewFunctionExecutorPortTarget<TProject>;
    readonly generatorResultProvider: () => PotatnoCodeGeneratorNodeResult<TProject>;
};

/**
 * Type-erased view of a driver. Carries only the operations and properties consumers actually
 * need at the registry / preview-manager level — the project-, element-, params- and
 * result-specific generics stay sealed inside the concrete `PotatnoPreviewDriver` instance.
 *
 * The interface exists so heterogeneous drivers (one per registered display/executor pair,
 * each with its own narrow generics) can be stored side-by-side in a single list without
 * round-tripping through `unknown` — a concrete driver class trivially implements this
 * interface and is therefore directly assignable to it.
 */
export interface PotatnoPreviewDriverHandle {
    /**
     * The DOM element the display renders into. Lazily created by the underlying driver.
     */
    readonly element: Element;

    /**
     * Drive one render pass on the underlying driver.
     */
    render(): Promise<void>;

    /**
     * Drop the underlying driver's cached iteration callable so the next render rebuilds
     * from a fresh generator result.
     */
    invalidateCache(): void;
}
