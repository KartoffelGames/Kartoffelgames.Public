import type { PotatnoProjectTypesDefinition } from '../project/potatno-project-types-definition.ts';
import { PotatnoPreviewDisplay, type PotatnoPreviewDisplayTypeAdapter } from './potatno-preview-display.ts';
import type { PotatnoPreviewFunctionExecutor } from './potatno-preview-function-executor.ts';

/**
 * Project-wide preview registry.
 *
 * Holds every `(display, executor)` pair the project supports. The framework iterates registered
 * pairs to decide which previews to offer the user: a pair whose executor wraps the document's
 * entry function becomes a candidate function-level preview, and a pair whose display ships an
 * adapter for some value port's `dataType` becomes a candidate per-node preview for that port.
 *
 * `PotatnoPreview.new` only takes the project types — the project itself is constructed later
 * and references this registry through its `previews` field. This avoids the chicken-and-egg
 * between the project and a registry that needs to be constructed before it.
 *
 * @typeParam TTypes - The project types definition this registry targets.
 */
export class PotatnoPreview<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>> {
    /**
     * Create a new, empty preview registry bound to the given project types.
     *
     * @typeParam TTypes - Inferred project types definition.
     *
     * @param pTypes - Project types definition. Used purely for inference and forwarded to the registry instance for future helper access.
     *
     * @returns The fresh, empty registry.
     */
    public static new<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>>(pTypes: TTypes): PotatnoPreview<TTypes> {
        return new PotatnoPreview<TTypes>(pTypes);
    }

    private readonly mEntries: Array<PotatnoPreviewEntry<TTypes>>;
    private readonly mProjectTypes: TTypes;

    /**
     * Every registered `(display, executor)` pair in insertion order. Read-only — pairs are
     * added via `addDisplay`.
     */
    public get entries(): ReadonlyArray<PotatnoPreviewEntry<TTypes>> {
        return this.mEntries;
    }

    /**
     * The project types definition this registry was created against.
     */
    public get projectTypes(): TTypes {
        return this.mProjectTypes;
    }

    /**
     * Constructor.
     *
     * @param pTypes - The project types definition the registry binds against.
     */
    protected constructor(pTypes: TTypes) {
        this.mProjectTypes = pTypes;
        this.mEntries = new Array<PotatnoPreviewEntry<TTypes>>();
    }

    /**
     * Register one `(display, executor)` pair.
     *
     * The compile-time pair check is enforced by the shared `TParams` and `TResult` generics:
     * the display's `expectedParameters`/`defaultResult` must structurally match the executor's
     * `parameters`/result shape.
     *
     * @typeParam TElement - The display's element type.
     * @typeParam TParams - The shared iteration parameter shape.
     * @typeParam TResult - The shared result shape.
     * @typeParam TAdapter - The display's adapter record shape.
     *
     * @param pDisplay - The display side of the pair.
     * @param pExecutor - The executor side of the pair. Its `parameters` must satisfy `pDisplay.expectedParameters`.
     */
    public addDisplay<TElement extends Element, TParams extends Readonly<Record<string, unknown>>, TResult, TAdapter extends PotatnoPreviewDisplayTypeAdapter<TTypes, TResult>>(pDisplay: PotatnoPreviewDisplay<TTypes, TElement, TParams, TResult, TAdapter>, pExecutor: PotatnoPreviewFunctionExecutor<TTypes, TParams, TResult>): void {
        // Store the pair, widening to the registry's any-shape entry type. The compile-time check
        // already proved the pair is internally consistent; the cast simply collapses the call-site
        // generics into the heterogeneous entries list. Routing through `unknown` is required
        // because TElement is covariant on update's parameter — direct casts are rejected even
        // though the widening is sound at the storage boundary.
        this.mEntries.push({
            display: pDisplay as unknown as PotatnoPreviewDisplay<TTypes, Element, Readonly<Record<string, unknown>>, unknown, PotatnoPreviewDisplayTypeAdapter<TTypes, unknown>>,
            executor: pExecutor as unknown as PotatnoPreviewFunctionExecutor<TTypes, Readonly<Record<string, unknown>>, unknown>
        });
    }
}

/**
 * One registered `(display, executor)` pair inside a `PotatnoPreview` registry. Generics are
 * collapsed to wide bounds so the registry can hold heterogeneous pairs in a single array — the
 * framework's driver construction re-binds the narrow generics when it pulls a pair out for a
 * concrete preview.
 *
 * @typeParam TTypes - The project types definition the registry targets.
 */
export type PotatnoPreviewEntry<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>> = {
    /**
     * The registered display.
     */
    display: PotatnoPreviewDisplay<TTypes, Element, Readonly<Record<string, unknown>>, unknown, PotatnoPreviewDisplayTypeAdapter<TTypes, unknown>>;

    /**
     * The executor paired with the display.
     */
    executor: PotatnoPreviewFunctionExecutor<TTypes, Readonly<Record<string, unknown>>, unknown>;
};
