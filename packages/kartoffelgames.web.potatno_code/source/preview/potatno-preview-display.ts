import { Exception } from '@kartoffelgames/core';
import type { PotatnoDocumentFunction } from '../document/potatno-document-function.ts';
import type { PotatnoDocumentPort } from '../document/potatno-document-port.ts';
import type { PotatnoProjectTypesDefinition } from '../project/potatno-project-types-definition.ts';
import { PotatnoPreviewDriver, type PotatnoPreviewDriverDisplay } from './potatno-preview-driver.ts';
import type { PotatnoPreviewFunctionExecutor, PotatnoPreviewResultType } from './potatno-preview-function-executor.ts';

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
export class PotatnoPreviewDisplay<TProjectTypes extends PotatnoProjectTypesDefinition, TElement extends Element, TParams extends Record<string, unknown>, TExecutorResultType extends PotatnoPreviewResultType<TProjectTypes>, TDisplayResultType extends PotatnoPreviewResultType<TProjectTypes>, TResult> {
    private readonly mExecutor: PotatnoPreviewFunctionExecutor<TProjectTypes, TParams, TExecutorResultType>;
    private readonly mGenerate: () => TElement;
    private readonly mId: string;
    private readonly mName: string;
    private readonly mTypeAdapters: Map<TDisplayResultType, PotatnoPreviewDisplayTypeAdapter<TResult>>;
    private readonly mUpdate: PotatnoPreviewDisplayUpdate<TElement, TParams, TResult>;

    /**
     * Executor this display renders.
     */
    public get executor(): PotatnoPreviewFunctionExecutor<TProjectTypes, TParams, TExecutorResultType> {
        return this.mExecutor;
    }

    /**
     * Stable identifier of this display.
     * Persisted with per-node preview bindings.
     */
    public get id(): string {
        return `${this.mId}-${this.mExecutor.function.id}`;
    }

    /**
     * Display name shown in preview selectors.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Constructor.
     *
     * @param pExecutor - Executor this display renders.
     * @param pParameters - Display configuration.
     */
    public constructor(pExecutor: PotatnoPreviewFunctionExecutor<TProjectTypes, TParams, TExecutorResultType>, pParameters: PotatnoPreviewDisplayConstructorParameter<TElement, TParams, TDisplayResultType, TResult>) {
        this.mId = pParameters.id;
        this.mName = pParameters.name;
        this.mExecutor = pExecutor;
        this.mGenerate = pParameters.generate;
        this.mUpdate = pParameters.update;

        // Convert type adapters into a mapping of it.
        this.mTypeAdapters = new Map<TDisplayResultType, PotatnoPreviewDisplayTypeAdapter<TResult>>();
        for (const [lTypeName, lAdapter] of Object.entries(pParameters.typeAdapter)) {
            // Skip any adapter that is not supported by the executor.
            if (!this.mExecutor.types.has(lTypeName as TExecutorResultType)) {
                continue;
            }

            this.mTypeAdapters.set(lTypeName as TDisplayResultType, lAdapter as PotatnoPreviewDisplayTypeAdapter<TResult>);
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
    public adapterFor(pTypeName: string): PotatnoPreviewDisplayTypeAdapter<TResult> {
        // "Convert" typename into "correct" type.
        const lTypeName: TDisplayResultType = pTypeName as TDisplayResultType;

        // Cast through unknown so the per-key narrowed types collapse to a single callable shape.
        if (!this.mTypeAdapters.has(lTypeName)) {
            throw new Exception(`Display "${this.mId}" has no type adapter for type "${pTypeName}".`, this);
        }

        return this.mTypeAdapters.get(lTypeName)!;
    }

    /**
     * Whether this display can render values of the given type.
     * Meaning that an adapter exists for it.
     *
     * @param pTypeName - The type name to check.
     *
     * @returns `true` when an adapter is registered for the type.
     */
    public allowsType(pTypeName: string): boolean {
        return this.mTypeAdapters.has(pTypeName as TDisplayResultType);
    }

    /**
     * Build a driver from this display and its bound executor.
     *
     * @param pTarget - The previewed document port or document function.
     *
     * @returns The freshly constructed driver.
     */
    public createDriver(pTarget: PotatnoDocumentFunction<TProjectTypes> | PotatnoDocumentPort<TProjectTypes>): PotatnoPreviewDriver<TProjectTypes> {
        return new PotatnoPreviewDriver<TProjectTypes>(
            this as unknown as PotatnoPreviewDriverDisplay<TProjectTypes>,
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
    public update(pElement: TElement, pExecutor: PotatnoPreviewDisplayExecutorCallable<TParams, TResult>): void {
        return this.mUpdate(pElement, pExecutor);
    }
}

/**
 * Per-type adapter record.
 */
export type PotatnoPreviewDisplayTypeAdapters<TResultType extends string, TResult> = {
    [K in TResultType]: PotatnoPreviewDisplayTypeAdapter<TResult>;
};

/**
 * Type adapter function, converting a value into a predefined displayable type.
 */
export type PotatnoPreviewDisplayTypeAdapter<TResult> = (pValue: any) => TResult;

/**
 * Driver-wrapped iteration callable handed to the display's `update` loop. Adapter coercion is
 * already baked in.
 */
export type PotatnoPreviewDisplayExecutorCallable<TParams, TResult> = (pParameters: TParams) => TResult;

/**
 * Display update callback. Owns the per-render iteration loop and writes results into the element.
 */
export type PotatnoPreviewDisplayUpdate<TElement extends Element, TParams, TResult> = (pElement: TElement, pExecutor: PotatnoPreviewDisplayExecutorCallable<TParams, TResult>) => void;

/**
 * Constructor parameters for PotatnoPreviewDisplay.
 *
 * @typeParam TElement - The element type returned by `generate`.
 * @typeParam TParams - The iteration parameter shape passed to `pExecutor` inside `update`.
 * @typeParam TResult - The result shape every adapter produces and every `pExecutor` call yields.
 * @typeParam TResultType - Union of supported result type names.
 */
export type PotatnoPreviewDisplayConstructorParameter<TElement extends Element, TParams extends Record<string, unknown>, TResultType extends string, TResult> = {
    /**
     * Stable id for this display.
     * Is merged with the executors function definition id to form a stable display id.
     */
    id: string;

    /**
     * Display name of this display.
     */
    name: string;

    /**
     * Per-type adapter record. Defines every type this display can render.
     */
    typeAdapter: PotatnoPreviewDisplayTypeAdapters<TResultType, TResult>;

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
