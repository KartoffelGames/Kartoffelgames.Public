import type { PotatnoProjectTypesDefinition, PotatnoProjectTypeValue } from '../project/potatno-project-types-definition.ts';

/**
 * One pluggable preview display.
 *
 * A display owns the rendering surface (DOM element, audio node, …) and the per-project-type
 * coercion rules. It is project-types-aware but stays decoupled from any concrete function or
 * executor — the same display can be paired with multiple executors via the preview registry.
 *
 * The five generics all flow from JS values supplied at the `new` call site:
 *  - `TElement`  - return type of `generate()`, also fed back into `update()`.
 *  - `TParams`   - the iteration parameter shape the display passes to the executor every call.
 *  - `TResult`   - the result shape every adapter coerces values into, also returned by the wrapped executor.
 *  - `TAdapter`  - the literal record of per-type adapters supplied at construction time. Stored
 *                  with its narrow keys so `adapterFor` can return the exact callback for a given type.
 *  - `TTypes`    - the project's type registry, used to type adapter keys and their `pValue` argument.
 *
 * @typeParam TTypes - The project types definition this display targets.
 * @typeParam TElement - The DOM/audio element type produced by `generate`.
 * @typeParam TParams - The iteration parameter shape passed into the wrapped executor each call.
 * @typeParam TResult - The result shape every type adapter produces.
 * @typeParam TAdapter - The literal record type of the supplied adapters.
 */
export class PotatnoPreviewDisplay<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>, TElement extends Element, TParams extends Readonly<Record<string, unknown>>, TResult, TAdapter extends PotatnoPreviewDisplayTypeAdapter<TTypes, TResult>> {
    /**
     * Create a new PotatnoPreviewDisplay.
     *
     * `pTypes` is taken purely for type inference — its only role is to carry `TTypes` into the
     * generics so the adapter keys can be validated against the project's registered type names
     * and the per-key `pValue` parameter can be typed from the matching type's `default.value`.
     *
     * @typeParam TTypes - Inferred project types definition.
     * @typeParam TElement - Inferred element type of `generate`.
     * @typeParam TParams - Inferred iteration parameter shape.
     * @typeParam TResult - Inferred result shape produced by adapters.
     * @typeParam TAdapter - Inferred adapter record shape.
     *
     * @param _pTypes - Project types definition used only for inference. Discarded at runtime.
     * @param pParameters - Display configuration: id, parameter spec, default result, adapters, element generator and update loop.
     *
     * @returns The constructed display.
     */
    public static new<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>, TElement extends Element, TParams extends Readonly<Record<string, unknown>>, TResult, TAdapter extends PotatnoPreviewDisplayTypeAdapter<TTypes, TResult>>(_pTypes: TTypes, pParameters: PotatnoPreviewDisplayConstructorParameter<TTypes, TElement, TParams, TResult, TAdapter>): PotatnoPreviewDisplay<TTypes, TElement, TParams, TResult, TAdapter> {
        return new PotatnoPreviewDisplay<TTypes, TElement, TParams, TResult, TAdapter>(pParameters);
    }

    private readonly mDefaultResult: TResult;
    private readonly mExpectedParameters: TParams;
    private readonly mGenerate: () => TElement;
    private readonly mId: string;
    private readonly mTypeAdapter: TAdapter;
    private readonly mUpdate: PotatnoPreviewDisplayUpdate<TElement, TParams, TResult>;

    /**
     * Sample of the result shape every adapter must coerce values into. Drives result-type
     * inference at the `new` call site.
     */
    public get defaultResult(): TResult {
        return this.mDefaultResult;
    }

    /**
     * Iteration parameter spec the display is paired with. Type-level: never read at runtime —
     * the compile-time pair check at `PotatnoPreview.addDisplay` and the parameter typing inside
     * `update` are its only roles.
     */
    public get expectedParameters(): TParams {
        return this.mExpectedParameters;
    }

    /**
     * Stable identifier of this display. Persisted on document nodes that opt into per-node
     * previews so the framework can re-bind the display after a reload.
     */
    public get id(): string {
        return this.mId;
    }

    /**
     * The raw adapter record exactly as supplied at construction time, with its literal key set
     * preserved so consumers can read any specific adapter via `adapterFor`.
     */
    public get typeAdapter(): TAdapter {
        return this.mTypeAdapter;
    }

    /**
     * Constructor.
     *
     * @param pParameters - The display configuration captured by `new`.
     */
    protected constructor(pParameters: PotatnoPreviewDisplayConstructorParameter<TTypes, TElement, TParams, TResult, TAdapter>) {
        this.mDefaultResult = pParameters.defaultResult;
        this.mExpectedParameters = pParameters.expectedParameters;
        this.mGenerate = pParameters.generate;
        this.mId = pParameters.id;
        this.mTypeAdapter = pParameters.typeAdapter;
        this.mUpdate = pParameters.update;
    }

    /**
     * Look up the adapter for a given project type name.
     *
     * Used by the driver when wrapping a per-node executor's raw output: the port's `dataType`
     * is fed in and the returned adapter coerces the executor's value into the display's
     * `defaultResult` shape.
     *
     * @param pTypeName - The project type name to look up.
     *
     * @returns The matching per-type adapter, or `undefined` if no adapter is registered for that type.
     */
    public adapterFor(pTypeName: string): ((pValue: unknown) => TResult) | undefined {
        // The adapter record is partial — a display does not need to declare an adapter for every
        // registered project type. Cast through unknown so the per-key narrowed types collapse to
        // a single callable shape the caller can invoke without per-key discrimination.
        const lAdapter: unknown = (this.mTypeAdapter as Readonly<Record<string, unknown>>)[pTypeName];
        return lAdapter as ((pValue: unknown) => TResult) | undefined;
    }

    /**
     * Build the preview element. Called once per driver, lazily on first `element` access.
     *
     * @returns The freshly created element.
     */
    public generate(): TElement {
        return this.mGenerate();
    }

    /**
     * Run the outer iteration loop, invoking the supplied wrapped executor and writing each
     * result back into the element. Called per render tick by the driver.
     *
     * @param pElement - The element previously produced by `generate`.
     * @param pExecutor - The driver-wrapped iteration callable: takes parameters, returns a value already in `TResult` shape (adapter applied for per-node previews).
     *
     * @returns A promise that resolves when the update pass is complete, or `void` for synchronous updates.
     */
    public update(pElement: TElement, pExecutor: PotatnoPreviewDisplayExecutorCallable<TParams, TResult>): void | Promise<void> {
        return this.mUpdate(pElement, pExecutor);
    }
}

/**
 * Per-project-type adapter record contract.
 *
 * Keys are constrained to the type-name union of the project's registered types and each
 * adapter receives a `pValue` typed from its matching project type's `default.value`.
 * The record is `Partial` — a display does not have to declare an adapter for every project
 * type, only those it knows how to coerce.
 *
 * @typeParam TTypes - The project types definition the display targets.
 * @typeParam TResult - The shared result shape every adapter must produce.
 */
export type PotatnoPreviewDisplayTypeAdapter<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>, TResult> = Partial<{
    [K in PotatnoPreviewDisplayProjectTypeNamesOf<TTypes>]: (pValue: PotatnoProjectTypeValue<TTypes, K>) => TResult;
}>;

/**
 * Driver-wrapped iteration callable handed to the display's `update` loop. Adapter coercion is
 * already baked in for per-node previews.
 */
export type PotatnoPreviewDisplayExecutorCallable<TParams, TResult> = (pParameters: TParams) => TResult | Promise<TResult>;

/**
 * Display update callback. Owns the per-render iteration loop and writes results into the element.
 */
export type PotatnoPreviewDisplayUpdate<TElement extends Element, TParams, TResult> = (pElement: TElement, pExecutor: PotatnoPreviewDisplayExecutorCallable<TParams, TResult>) => void | Promise<void>;

/**
 * Constructor parameters for PotatnoPreviewDisplay.
 *
 * @typeParam TTypes - The project types definition the display targets.
 * @typeParam TElement - The element type returned by `generate`.
 * @typeParam TParams - The iteration parameter shape passed to `pExecutor` inside `update`.
 * @typeParam TResult - The result shape every adapter produces and every `pExecutor` call yields.
 * @typeParam TAdapter - The literal adapter record shape.
 */
export type PotatnoPreviewDisplayConstructorParameter<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>, TElement extends Element, TParams extends Readonly<Record<string, unknown>>, TResult, TAdapter extends PotatnoPreviewDisplayTypeAdapter<TTypes, TResult>> = {
    /**
     * Stable id for this display. Persisted with per-node preview bindings.
     */
    id: string;

    /**
     * Iteration parameter spec — JS-value defaults. Type-level only: drives `TParams` inference
     * and the compile-time pair check against the executor at registration time.
     */
    expectedParameters: TParams;

    /**
     * Sample of the result shape (e.g. `[0, 0, 0]` for an RGB display). Drives `TResult` inference
     * and defines what every per-type adapter must coerce values into.
     */
    defaultResult: TResult;

    /**
     * Per-project-type adapter record. Keys must be valid project type names, values are
     * callables coercing a value of that project type into `TResult`.
     */
    typeAdapter: TAdapter;

    /**
     * Build the element. Called once per driver, on first `element` access.
     */
    generate: () => TElement;

    /**
     * Per-render update loop. Receives the element and the wrapped executor callable.
     */
    update: PotatnoPreviewDisplayUpdate<TElement, TParams, TResult>;
};

/**
 * Extract the type-name union of the project's registered types from a definition instance.
 */
type PotatnoPreviewDisplayProjectTypeNamesOf<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>> = TTypes extends PotatnoProjectTypesDefinition<infer TName, Record<string, unknown>> ? TName : never;
