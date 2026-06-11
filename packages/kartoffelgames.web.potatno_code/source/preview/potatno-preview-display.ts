import { Exception } from '@kartoffelgames/core';
import type { PotatnoDocumentFunction } from '../document/potatno-document-function.ts';
import type { PotatnoDocumentPort } from '../document/potatno-document-port.ts';
import { PotatnoProjectTypesDefinition } from "../project/potatno-project-types-definition.ts";
import { PotatnoPreviewDriver } from './potatno-preview-driver.ts';
import type { PotatnoPreviewFunctionExecutor, PotatnoPreviewResultType } from './potatno-preview-function-executor.ts';
import type { PotatnoPreviewEntryDisplay, PotatnoPreviewEntryExecutor } from './potatno-preview.ts';

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
 * @typeParam TProject - The project this display targets.
 * @typeParam TElement - The DOM/audio element type produced by `generate`.
 * @typeParam TParams - The iteration parameter shape passed into the wrapped executor each call.
 * @typeParam TResult - The result shape every type adapter produces.
 * @typeParam TResultType - Union of executor result type names this display may adapt.
 */
export class PotatnoPreviewDisplay<TProjectTypes extends PotatnoProjectTypesDefinition, TElement extends Element, TParams extends Record<string, unknown>, TResult, TResultType extends PotatnoPreviewResultType<TProjectTypes>> {
    private readonly mExecutor: PotatnoPreviewFunctionExecutor<TProjectTypes, TParams, TResultType>;
    private readonly mGenerate: () => TElement;
    private readonly mId: string;
    private readonly mTypeAdapter: PotatnoPreviewDisplayTypeAdapter<TResult, TResultType>;
    private readonly mUpdate: PotatnoPreviewDisplayUpdate<TElement, TParams, TResult>;

    /**
     * Stable identifier of this display. Persisted with per-node preview bindings.
     */
    public get id(): string {
        return this.mId;
    }

    /**
     * Executor this display renders.
     */
    public get executor(): PotatnoPreviewFunctionExecutor<TProjectTypes, TParams, TResultType> {
        return this.mExecutor;
    }

    /**
     * Constructor.
     *
     * @param pExecutor - Executor this display renders.
     * @param pParameters - Display configuration.
     */
    public constructor(pExecutor: PotatnoPreviewFunctionExecutor<TProjectTypes, TParams, TResultType>, pParameters: PotatnoPreviewDisplayConstructorParameter<TElement, TParams, TResult, TResultType>) {
        this.mExecutor = pExecutor;
        this.mGenerate = pParameters.generate;
        this.mId = pParameters.id;
        this.mTypeAdapter = pParameters.typeAdapter;
        this.mUpdate = pParameters.update;

        for (const lTypeName of Object.keys(this.mTypeAdapter)) {
            if (!this.mExecutor.types.includes(lTypeName as TResultType)) {
                throw new Exception(`Display "${this.mId}" declares type "${lTypeName}" that executor "${this.mExecutor.function.id}" does not support.`, this);
            }
        }
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
     * Build a driver from this display and its bound executor.
     *
     * @param pTarget - The previewed document port or document function.
     *
     * @returns The freshly constructed driver.
     */
    public createDriver<TProjectTypes extends PotatnoProjectTypesDefinition>(pTarget: PotatnoDocumentFunction<TProjectTypes> | PotatnoDocumentPort<TProjectTypes>): PotatnoPreviewDriver<TProjectTypes> {
        return new PotatnoPreviewDriver<TProjectTypes>(
            this as unknown as PotatnoPreviewEntryDisplay<TProjectTypes>,
            this.mExecutor as unknown as PotatnoPreviewEntryExecutor<TProjectTypes>,
            pTarget
        );
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
 * Keys are executor-supported result types. Adapter input values are typed as `never` so display
 * authors can annotate each adapter with the concrete runtime value shape they expect.
 *
 * @typeParam TResult - The shared result shape every adapter must produce.
 * @typeParam TResultType - Union of supported result type names.
 */
export type PotatnoPreviewDisplayTypeAdapter<TResult, TResultType extends string> = Partial<{
    [K in TResultType]: (pValue: never) => TResult;
}>;

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
 * @typeParam TElement - The element type returned by `generate`.
 * @typeParam TParams - The iteration parameter shape passed to `pExecutor` inside `update`.
 * @typeParam TResult - The result shape every adapter produces and every `pExecutor` call yields.
 * @typeParam TResultType - Union of supported result type names.
 */
export type PotatnoPreviewDisplayConstructorParameter<TElement extends Element, TParams extends Record<string, unknown>, TResult, TResultType extends string> = {
    /**
     * Stable id for this display. Persisted with per-node preview bindings.
     */
    id: string;

    /**
     * Per-type adapter record. Defines every type this display can render.
     */
    typeAdapter: PotatnoPreviewDisplayTypeAdapter<TResult, TResultType>;

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
