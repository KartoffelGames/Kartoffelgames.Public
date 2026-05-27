import type { PotatnoProjectTypesDefinition } from '../project/potatno-project-types-definition.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';
import { PotatnoPreviewDriver, type PotatnoPreviewDriverGeneratorResultProvider, type PotatnoPreviewDriverHandle } from './potatno-preview-driver.ts';
import { PotatnoPreviewDisplay, type PotatnoPreviewDisplayTypeAdapter } from './potatno-preview-display.ts';
import type { PotatnoPreviewFunctionExecutor, PotatnoPreviewFunctionExecutorPortTarget } from './potatno-preview-function-executor.ts';

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
        // Each entry closes over its own narrow types in a `createDriver` factory rather than
        // exposing the display/executor directly. That keeps the heterogeneous list TS-sound:
        // the registry holds existential entries (one set of narrow types per slot) and the
        // factory rebinds them when a consumer asks for a driver — no upcast from narrow to
        // wide is ever needed at the storage boundary.
        this.mEntries.push({
            displayId: pDisplay.id,
            executorFunctionId: pExecutor.function.id,
            createDriver: <TProject extends PotatnoProject>(pParameter: PotatnoPreviewEntryCreateDriverParameter<TProject>): PotatnoPreviewDriverHandle => {
                // Construct the driver with the precise narrow types captured by `addDisplay`'s
                // generics. The factory's return type is the project-agnostic
                // `PotatnoPreviewDriverHandle` interface, which the concrete driver class
                // implements; upcasting to the implemented interface is sound for any narrow
                // generics, so no `unknown` round-trip is needed.
                return new PotatnoPreviewDriver<TProject, TElement, TParams, TResult>({
                    display: pDisplay,
                    executor: pExecutor,
                    portTarget: pParameter.portTarget,
                    generatorResultProvider: pParameter.generatorResultProvider
                });
            }
        });
    }
}

/**
 * Constructor parameters handed to a registry entry's `createDriver` factory. Holds the parts
 * the registry does not own — the project-scoped port target and generator-result provider —
 * so the factory only needs the precise types from its closure to build a driver.
 *
 * @typeParam TProject - The project type the driver is being built for.
 */
export type PotatnoPreviewEntryCreateDriverParameter<TProject extends PotatnoProject> = {
    /**
     * The port target the driver should be bound to; `null` for function-level previews.
     */
    portTarget: PotatnoPreviewFunctionExecutorPortTarget<TProject> | null;

    /**
     * Callback yielding the current code generator result on each cache miss.
     */
    generatorResultProvider: PotatnoPreviewDriverGeneratorResultProvider<TProject>;
};

/**
 * One registered `(display, executor)` pair inside a `PotatnoPreview` registry.
 *
 * Stored as an existential — the original `display`/`executor` are sealed inside the entry's
 * `createDriver` closure, which projects them back into a driver typed against the consumer's
 * `TProject`. The only fields visible from outside are the two ids and the factory, so the
 * registry never has to surface the heterogeneous narrow types as a single union.
 *
 * @typeParam TTypes - The project types definition the registry targets.
 */
export type PotatnoPreviewEntry<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>> = {
    /**
     * Stable id of the bound display. Used for opt-in matching against `node.preview`.
     */
    readonly displayId: string;

    /**
     * Function-definition id the bound executor wraps. Used for matching against the project's
     * entry-point or a per-node's owning function.
     */
    readonly executorFunctionId: string;

    /**
     * Project-types phantom on the entry. Keeps the registry's `TTypes` generic load-bearing so
     * unrelated entry types stay distinct at the type level even when the public fields would
     * otherwise be structurally identical across different projects.
     */
    readonly _tTypesPhantom?: TTypes;

    /**
     * Build a `PotatnoPreviewDriver` bound to this entry's display and executor. The closure
     * carries the precise narrow generics captured at `addDisplay` time; the returned handle
     * is the project-agnostic `PotatnoPreviewDriverHandle` view so the registry's list stays
     * heterogeneous-friendly.
     *
     * @typeParam TProject - The project type the consumer is building a driver against.
     *
     * @param pParameter - The project-scoped portions of the driver configuration.
     *
     * @returns The freshly constructed driver, exposed under its handle interface.
     */
    createDriver<TProject extends PotatnoProject>(pParameter: PotatnoPreviewEntryCreateDriverParameter<TProject>): PotatnoPreviewDriverHandle;
};
