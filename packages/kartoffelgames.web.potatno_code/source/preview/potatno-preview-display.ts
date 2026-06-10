import { Exception } from '@kartoffelgames/core';
import type { PotatnoProjectTypesDefinition, PotatnoProjectTypeValue } from '../project/potatno-project-types-definition.ts';

/**
 * One pluggable preview display.
 *
 * A display owns the rendering surface (DOM element, audio node, …) and the type adapters that
 * coerce previewed values into its render shape. The adapter record doubles as the display's
 * allowed-type list: a value type without an adapter is not previewable on this display.
 *
 * `TParams` and `TResult` are inferred from the `update` callback's executor annotation, e.g.
 * `pExecutor: PotatnoPreviewDisplayExecutorCallable<{ x: number; }, [number, number, number]>`.
 *
 * @typeParam TTypes - The project types definition this display targets.
 * @typeParam TElement - The DOM/audio element type produced by `generate`.
 * @typeParam TParams - The iteration parameter shape passed into the wrapped executor each call.
 * @typeParam TResult - The result shape every type adapter produces.
 * @typeParam TAdapter - The literal record type of the supplied adapters.
 */
export class PotatnoPreviewDisplay<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>, TElement extends Element, TParams extends Record<string, unknown>, TResult, TAdapter extends PotatnoPreviewDisplayTypeAdapter<TTypes, TResult>> {
    /**
     * Create a new PotatnoPreviewDisplay. All generics are inferred from the supplied callbacks;
     * `pTypes` only carries `TTypes` so adapter keys and their `pValue` parameters can be typed.
     *
     * @typeParam TTypes - Inferred project types definition.
     * @typeParam TElement - Inferred element type of `generate`.
     * @typeParam TParams - Inferred iteration parameter shape.
     * @typeParam TResult - Inferred result shape produced by adapters.
     * @typeParam TAdapter - Inferred adapter record shape.
     *
     * @param _pTypes - Project types definition used only for inference. Discarded at runtime.
     * @param pParameters - Display configuration.
     *
     * @returns The constructed display.
     */
    public static new<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>, TElement extends Element, TParams extends Record<string, unknown>, TResult, TAdapter extends PotatnoPreviewDisplayTypeAdapter<TTypes, TResult>>(_pTypes: TTypes, pParameters: PotatnoPreviewDisplayConstructorParameter<TTypes, TElement, TParams, TResult, TAdapter>): PotatnoPreviewDisplay<TTypes, TElement, TParams, TResult, TAdapter> {
        return new PotatnoPreviewDisplay<TTypes, TElement, TParams, TResult, TAdapter>(pParameters);
    }

    private readonly mGenerate: () => TElement;
    private readonly mId: string;
    private readonly mTypeAdapter: TAdapter;
    private readonly mUpdate: PotatnoPreviewDisplayUpdate<TElement, TParams, TResult>;

    /**
     * Stable identifier of this display. Persisted with per-node preview bindings.
     */
    public get id(): string {
        return this.mId;
    }

    /**
     * Constructor.
     *
     * @param pParameters - The display configuration captured by `new`.
     */
    protected constructor(pParameters: PotatnoPreviewDisplayConstructorParameter<TTypes, TElement, TParams, TResult, TAdapter>) {
        this.mGenerate = pParameters.generate;
        this.mId = pParameters.id;
        this.mTypeAdapter = pParameters.typeAdapter;
        this.mUpdate = pParameters.update;
    }

    /**
     * Get the adapter for a given type name. Callers must check `allowsType` first and skip
     * unsupported types.
     *
     * @param pTypeName - The type name to look up.
     *
     * @returns The matching adapter.
     *
     * @throws {@link Exception} - When no adapter is registered for the type.
     */
    public adapterFor(pTypeName: string): (pValue: unknown) => TResult {
        // Cast through unknown so the per-key narrowed types collapse to a single callable shape.
        const lAdapter: unknown = (this.mTypeAdapter as Record<string, unknown>)[pTypeName];
        if (lAdapter === undefined) {
            throw new Exception(`Display "${this.mId}" has no type adapter for type "${pTypeName}".`, this);
        }

        return lAdapter as (pValue: unknown) => TResult;
    }

    /**
     * Whether this display can render values of the given type — an adapter exists for it.
     *
     * @param pTypeName - The type name to check.
     *
     * @returns `true` when an adapter is registered for the type.
     */
    public allowsType(pTypeName: string): boolean {
        return (this.mTypeAdapter as Record<string, unknown>)[pTypeName] !== undefined;
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
     * Run the outer iteration loop, invoking the wrapped executor and writing each result back
     * into the element. Called per render tick by the driver.
     *
     * @param pElement - The element previously produced by `generate`.
     * @param pExecutor - The driver-wrapped iteration callable, adapter coercion already applied.
     *
     * @returns A promise resolving when the update pass is complete, or `void` for synchronous updates.
     */
    public update(pElement: TElement, pExecutor: PotatnoPreviewDisplayExecutorCallable<TParams, TResult>): void | Promise<void> {
        return this.mUpdate(pElement, pExecutor);
    }
}

/**
 * Per-type adapter record contract — the union of types a display can render.
 *
 * Keys are either registered project type names (their adapter's `pValue` is typed from the
 * matching type's `default.value`) or custom type names like `'fullOutput'` reported by an
 * executor's build result (their `pValue` must be annotated by the author).
 *
 * @typeParam TTypes - The project types definition the display targets.
 * @typeParam TResult - The shared result shape every adapter must produce.
 */
export type PotatnoPreviewDisplayTypeAdapter<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>, TResult> = Partial<{
    [K in TTypes['typeNames'][number]]: (pValue: PotatnoProjectTypeValue<TTypes, K>) => TResult;
}> & Record<string, ((pValue: never) => TResult) | undefined>;

/**
 * Driver-wrapped iteration callable handed to the display's `update` loop. Adapter coercion is
 * already baked in.
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
export type PotatnoPreviewDisplayConstructorParameter<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>, TElement extends Element, TParams extends Record<string, unknown>, TResult, TAdapter extends PotatnoPreviewDisplayTypeAdapter<TTypes, TResult>> = {
    /**
     * Stable id for this display. Persisted with per-node preview bindings.
     */
    id: string;

    /**
     * Per-type adapter record. Defines every type this display can render.
     */
    typeAdapter: TAdapter;

    /**
     * Build the element. Called once per driver, on first `element` access.
     */
    generate: () => TElement;

    /**
     * Per-render update loop. Receives the element and the wrapped executor callable. Annotate
     * `pExecutor` to declare the iteration parameter and result shapes.
     */
    update: PotatnoPreviewDisplayUpdate<TElement, TParams, TResult>;
};
