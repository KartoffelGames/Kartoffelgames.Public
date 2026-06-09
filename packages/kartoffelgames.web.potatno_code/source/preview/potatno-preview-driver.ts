import type { PotatnoDocumentPort } from '../document/potatno-document-port.ts';
import type { PotatnoCodeGeneratorDocumentResult } from '../parser/result/potatno-code-generator-document-result.ts';
import type { PotatnoProjectGenericType, PotatnoProjectType } from '../project/potatno-project-types-definition.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';
import type { PotatnoPreviewDisplay, PotatnoPreviewDisplayTypeAdapter } from './potatno-preview-display.ts';
import type { PotatnoPreviewFunctionExecutor, PotatnoPreviewFunctionExecutorBuildResult, PotatnoPreviewFunctionExecutorCallable } from './potatno-preview-function-executor.ts';

/**
 * Runtime object the UI binds to one visible preview.
 *
 * Bundles a `(display, executor, port-target)` triple together with a callback that yields the
 * current generator result. Lazily creates the element via `display.generate()`. Compilation and
 * rendering are two separate steps:
 *  - `refresh()` pulls a fresh generator result, re-resolves the targeted port's value and
 *    recompiles the iteration callable. Called whenever the underlying graph changed.
 *  - `execute()` runs one render pass with the last compiled callable. Called every frame. It never
 *    compiles, so a stale-but-valid preview keeps rendering while the document is invalid.
 *
 * The driver is generic over the bound `TProject` directly (rather than the project's `TTypes`) so
 * consumers carrying a project type can plug a driver in without reconstructing the project type
 * from its types definition.
 *
 * @typeParam TProject - The project type the driver targets.
 * @typeParam TElement - The element type produced by the display.
 * @typeParam TParams - The iteration parameter shape.
 * @typeParam TResult - The result shape the display consumes after adapter coercion.
 */
export class PotatnoPreviewDriver<TProject extends PotatnoProject, TElement extends Element = Element, TParams extends Readonly<Record<string, unknown>> = {}, TResult = any> {
    private mCachedCallable: PotatnoPreviewDisplayCallable<TParams, TResult> | null;
    private readonly mDisplay: PotatnoPreviewDisplay<TProject['types'], TElement, TParams, TResult, PotatnoPreviewDisplayTypeAdapter<TProject['types'], TResult>>;
    private mElement: TElement | null;
    private readonly mExecutor: PotatnoPreviewFunctionExecutor<TProject['types'], TParams>;
    private readonly mGeneratorResultProvider: () => PotatnoCodeGeneratorDocumentResult<TProject>;
    private readonly mPortTarget: PotatnoPreviewDriverPortTarget<TProject> | null;

    /**
     * The project type id of the port being previewed, or `null` for function-level previews.
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
    public get portTarget(): PotatnoPreviewDriverPortTarget<TProject> | null {
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
        this.mGeneratorResultProvider = pParameters.generatorResultProvider;
        this.mPortTarget = pParameters.portTarget;
        this.mCachedCallable = null;
        this.mElement = null;
    }

    /**
     * Run one render pass with the last compiled callable.
     *
     * Does not compile: a driver that has never been refreshed (or whose target value could not be
     * resolved on the last refresh) is skipped. This keeps the previously rendered preview visible
     * while the document is invalid, since no fresh — and possibly failing — generation is run.
     *
     * @returns A promise resolving when the display's update pass completes.
     */
    public async execute(): Promise<void> {
        if (!this.mCachedCallable) {
            return;
        }

        await Promise.resolve(this.mDisplay.update(this.element, this.mCachedCallable));
    }

    /**
     * Recompile the iteration callable from the latest generator result.
     *
     * Pulls a fresh document result, re-resolves the targeted port's value (so a shifted valueId is
     * always current), runs the executor's build callback and wraps the resulting callable with the
     * display's adapter matching the value type the build reports. When the port's value is not
     * emitted by the current graph, the cached callable is cleared so `execute` no-ops.
     */
    public refresh(): void {
        const lGeneratorResult: PotatnoCodeGeneratorDocumentResult<TProject> = this.mGeneratorResultProvider();

        // Resolve the per-port value identifier against the fresh result. A `null` means the port's
        // value is not emitted (nothing downstream consumes it), so there is nothing to preview.
        let lPortTarget: { documentPort: PotatnoDocumentPort<TProject>; value: string; } | null = null;
        if (this.mPortTarget) {
            const lValue: string | null = this.mPortTarget.valueResolver(lGeneratorResult);
            if (lValue === null) {
                this.mCachedCallable = null;
                return;
            }

            lPortTarget = { documentPort: this.mPortTarget.documentPort, value: lValue };
        }

        // Build the raw callable plus the project type name of the value it yields.
        const lBuildResult: PotatnoPreviewFunctionExecutorBuildResult<TParams> = this.mExecutor.compile(lGeneratorResult, lPortTarget);

        // Pick the display adapter for that type, coercing the raw value into the display's TResult
        // shape. Falling back to an identity wrap keeps things rendering when no adapter is
        // registered for the reported type — the value flows through unchanged.
        const lAdapter: ((pValue: unknown) => TResult) | undefined = this.mDisplay.adapterFor(lBuildResult.type);
        const lAdapterFunction: (pValue: unknown) => TResult = lAdapter ?? ((pValue: unknown): TResult => pValue as TResult);
        const lRawCallable: PotatnoPreviewFunctionExecutorCallable<TParams> = lBuildResult.execute;

        this.mCachedCallable = async (pParameters: TParams): Promise<TResult> => {
            const lRawResult: unknown = await Promise.resolve(lRawCallable(pParameters));
            return lAdapterFunction(lRawResult);
        };
    }
}

/**
 * Driver-internal callable handed to the display's `update` loop — adapter coercion baked in.
 */
type PotatnoPreviewDisplayCallable<TParams, TResult> = (pParameters: TParams) => TResult | Promise<TResult>;

/**
 * Per-port preview target carried by the driver. Unlike the executor's port target it holds a
 * resolver rather than a fixed value, so each refresh re-derives the current value identifier from
 * the latest generator result instead of baking in a now-stale one.
 *
 * @typeParam TProject - The project type the driver targets.
 */
export type PotatnoPreviewDriverPortTarget<TProject extends PotatnoProject> = {
    /**
     * The document port being previewed.
     */
    readonly documentPort: PotatnoDocumentPort<TProject>;

    /**
     * Resolve the targeted value identifier from a generator result, or `null` when the port's
     * value is not emitted by the current graph.
     */
    readonly valueResolver: (pGeneratorResult: PotatnoCodeGeneratorDocumentResult<TProject>) => string | null;
};

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
    executor: PotatnoPreviewFunctionExecutor<TProject['types'], TParams>;

    /**
     * The previewed port plus its value resolver, or `null` for a function-level preview.
     */
    portTarget: PotatnoPreviewDriverPortTarget<TProject> | null;

    /**
     * Yields the current document generator result on every refresh.
     */
    generatorResultProvider: () => PotatnoCodeGeneratorDocumentResult<TProject>;
};
