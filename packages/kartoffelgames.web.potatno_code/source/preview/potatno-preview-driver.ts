import type { PotatnoCodeGeneratorFunctionResult } from '../parser/result/potatno-code-generator-function-result.ts';
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
    private readonly mGeneratorResultProvider: PotatnoPreviewDriverGeneratorResultProvider<TProject>;
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
        this.mPortTarget = pParameters.portTarget;
        this.mGeneratorResultProvider = pParameters.generatorResultProvider;
        this.mCachedCallable = null;
        this.mElement = null;
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
        // Compile-on-demand. Build is only re-invoked when something external invalidated the cache.
        if (!this.mCachedCallable) {
            const lGeneratorResult: PotatnoCodeGeneratorFunctionResult<TProject> | PotatnoCodeGeneratorNodeResult<TProject> = this.mGeneratorResultProvider();
            this.mCachedCallable = this.mExecutor.compile(lGeneratorResult, this.mPortTarget);
        }

        // Wrap the executor with the display's per-type adapter when previewing a single port.
        // Function-level previews pass the raw callable through — its result is already in
        // `defaultResult` shape because the natural function return drives it.
        const lWrappedCallable: PotatnoPreviewFunctionExecutorCallable<TParams, TResult> = this.wrapCallableWithAdapter(this.mCachedCallable);

        // Hand off to the display's update loop. Awaiting covers both sync and async updates.
        await Promise.resolve(this.mDisplay.update(this.element, lWrappedCallable));
    }

    /**
     * Wrap the raw iteration callable with the display's per-type adapter when this driver is
     * bound to a port target. For function-level drivers the wrap is a no-op pass-through.
     *
     * @param pCallable - The raw iteration callable produced by `executor.compile`.
     *
     * @returns A callable returning values in the display's `defaultResult` shape regardless of whether the underlying executor returns the natural function result or a per-port intermediate.
     */
    private wrapCallableWithAdapter(pCallable: PotatnoPreviewFunctionExecutorCallable<TParams, TResult>): PotatnoPreviewFunctionExecutorCallable<TParams, TResult> {
        // Function-level: the executor's natural return already matches TResult. Skip the wrap.
        if (!this.mPortTarget) {
            return pCallable;
        }

        // Resolve the adapter once per render. Falls back to a pass-through if no adapter is
        // registered for this type — the per-node preview is still useful (the raw value lands
        // unchanged) and avoids a hard failure when the project ships partial adapter coverage.
        const lDataType: string = this.mPortTarget.documentPort.dataType;
        const lAdapter: ((pValue: unknown) => TResult) | undefined = this.mDisplay.adapterFor(lDataType);

        if (!lAdapter) {
            return pCallable;
        }

        // Compose the adapter onto the raw callable. The per-node callable returns the port's
        // raw value (typed as TResult in this code path, but a single value at runtime); the
        // adapter accepts `unknown` and produces a TResult-shaped result.
        return async (pParameters: TParams): Promise<TResult> => {
            const lRawResult: unknown = await Promise.resolve(pCallable(pParameters));
            return lAdapter(lRawResult);
        };
    }
}

/**
 * Constructor parameters for PotatnoPreviewDriver.
 *
 * @typeParam TProject - The project type the driver targets.
 * @typeParam TElement - The display's element type.
 * @typeParam TParams - The iteration parameter shape.
 * @typeParam TResult - The shared result shape.
 */
export type PotatnoPreviewDriverConstructorParameter<TProject extends PotatnoProject, TElement extends Element, TParams extends Readonly<Record<string, unknown>>, TResult> = {
    /**
     * The display side of the bundled triple.
     */
    display: PotatnoPreviewDisplay<TProject['types'], TElement, TParams, TResult, PotatnoPreviewDisplayTypeAdapter<TProject['types'], TResult>>;

    /**
     * The executor side of the bundled triple.
     */
    executor: PotatnoPreviewFunctionExecutor<TProject['types'], TParams, TResult>;

    /**
     * The port target the driver is bound to. `null` for function-level previews; the
     * `{ documentPort, valueId }` shape for per-node previews.
     */
    portTarget: PotatnoPreviewFunctionExecutorPortTarget<TProject> | null;

    /**
     * Callback yielding the current generator result. The driver pulls a fresh result on every
     * cache miss; the framework is responsible for keeping this callback pointed at the latest
     * code-gen output.
     */
    generatorResultProvider: PotatnoPreviewDriverGeneratorResultProvider<TProject>;
};

/**
 * Callback yielding the current code generator result for a driver's bound function.
 *
 * @typeParam TProject - The project type the driver targets.
 */
export type PotatnoPreviewDriverGeneratorResultProvider<TProject extends PotatnoProject> = () => PotatnoCodeGeneratorFunctionResult<TProject> | PotatnoCodeGeneratorNodeResult<TProject>;

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
