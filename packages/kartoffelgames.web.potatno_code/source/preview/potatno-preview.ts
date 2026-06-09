import type { PotatnoProjectTypesDefinition } from '../project/potatno-project-types-definition.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';
import { PotatnoPreviewDisplay, type PotatnoPreviewDisplayTypeAdapter } from './potatno-preview-display.ts';
import { PotatnoPreviewDriver, type PotatnoPreviewDriverConstructorFunctionParameter, type PotatnoPreviewDriverConstructorNodeParameter } from './potatno-preview-driver.ts';
import type { PotatnoPreviewFunctionExecutor } from './potatno-preview-function-executor.ts';

/**
 * Project-wide preview registry.
 * Holds every `(display, executor)` pair the project supports.
 *
 * @typeParam TTypes - The project types definition this registry targets.
 */
export class PotatnoPreview<TTypes extends PotatnoProjectTypesDefinition<string>> {
    private readonly mEntries: Array<PotatnoPreviewEntry<TTypes>>;

    /**
     * Every registered `(display, executor)` pair in insertion order.
     */
    public get entries(): ReadonlyArray<PotatnoPreviewEntry<TTypes>> {
        return this.mEntries;
    }

    /**
     * Constructor.
     *
     * @param _pTypes - The project types definition. Used only as a type hint. 
     */
    public constructor(_pTypes: TTypes) {
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
            display: pDisplay,
            executor: pExecutor,
            createDriver: <TProject extends PotatnoProject>(pParameter: PotatnoPreviewEntryCreateDriverParameter<TProject>): PotatnoPreviewDriver<TProject, TElement, TParams, TResult> => {
                // Construct the driver with the precise narrow types captured by `addDisplay`'s
                // generics. The factory's return type is the project-agnostic
                // `PotatnoPreviewDriverHandle` interface, which the concrete driver class
                // implements; upcasting to the implemented interface is sound for any narrow
                // generics, so no `unknown` round-trip is needed. The discriminated branch in
                // `pParameter` flows directly into the driver's matching constructor branch.
                return new PotatnoPreviewDriver<TProject, TElement, TParams, TResult>({
                    display: pDisplay,
                    executor: pExecutor,
                    ...pParameter
                });
            }
        });
    }
}

/**
 * Constructor parameters handed to a registry entry's `createDriver` factory. Mirrors the
 * driver's own discriminated-union shape: callers either pass the function-level branch
 * (`portTarget: null` + function-result provider) or the per-node branch
 * (non-null port target + node-result provider).
 *
 * @typeParam TProject - The project type the driver is being built for.
 */
export type PotatnoPreviewEntryCreateDriverParameter<TProject extends PotatnoProject> =
    | PotatnoPreviewDriverConstructorFunctionParameter<TProject>
    | PotatnoPreviewDriverConstructorNodeParameter<TProject>;

/**
 * One registered `(display, executor)` pair inside a `PotatnoPreview` registry.
 *
 * Stored as an existential — the original `display`/`executor` are sealed inside the entry's
 * `createDriver` closure, which projects them back into a driver typed against the consumer's
 * `TProject`. The only fields visible from outside are the two ids and the factory, so the
 * registry never has to surface the heterogeneous narrow types as a single union.
 *
 * @typeParam _TTypes - The project types definition the registry targets.
 */
export type PotatnoPreviewEntry<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>> = {
    /**
     * Preview display.
     */
    readonly display:  PotatnoPreviewDisplay<TTypes, TElement, TParams, TResult, TAdapter>;

    /**
     * Preview code executor.
     */
    readonly executor: PotatnoPreviewFunctionExecutor<TTypes, TParams, TResult>

    /**
     * Build a `PotatnoPreviewDriver` bound to this entry's display and executor. 
     *
     * @typeParam TProject - The project type the consumer is building a driver against.
     *
     * @param pParameter - The project-scoped portions of the driver configuration.
     *
     * @returns The freshly constructed driver, exposed under its handle interface.
     */
    createDriver<TProject extends PotatnoProject>(pParameter: PotatnoPreviewEntryCreateDriverParameter<TProject>): PotatnoPreviewDriver<TProject, TElement, TParams, TResult>;
};
