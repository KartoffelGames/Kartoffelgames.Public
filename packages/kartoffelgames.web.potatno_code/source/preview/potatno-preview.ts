import type { PotatnoFunctionDefinition } from '../project/potatno-function-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../project/potatno-project-types-definition.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';
import { PotatnoPreviewDriver, type PotatnoPreviewDriverPortTarget } from './potatno-preview-driver.ts';
import type { PotatnoPreviewDisplay, PotatnoPreviewDisplayTypeAdapter } from './potatno-preview-display.ts';
import type { PotatnoCodeGeneratorDocumentResult } from '../parser/result/potatno-code-generator-document-result.ts';
import type { PotatnoPreviewFunctionExecutor } from './potatno-preview-function-executor.ts';

/**
 * Project-wide preview registry.
 * Holds every `(display, executor)` pair the project supports and answers which of them apply to a
 * given function.
 *
 * @typeParam TTypes - The project types definition this registry targets.
 */
export class PotatnoPreview<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>> {
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
     * The compile-time pair check is enforced by the shared `TParams` generic: the display's
     * `expectedParameters` must structurally match the executor's `parameters`.
     *
     * @typeParam TElement - The display's element type.
     * @typeParam TParams - The shared iteration parameter shape.
     * @typeParam TResult - The display's result shape.
     * @typeParam TAdapter - The display's adapter record shape.
     *
     * @param pDisplay - The display side of the pair.
     * @param pExecutor - The executor side of the pair. Its `parameters` must satisfy `pDisplay.expectedParameters`.
     */
    public addDisplay<TElement extends Element, TParams extends Readonly<Record<string, unknown>>, TResult, TAdapter extends PotatnoPreviewDisplayTypeAdapter<TTypes, TResult>>(pDisplay: PotatnoPreviewDisplay<TTypes, TElement, TParams, TResult, TAdapter>, pExecutor: PotatnoPreviewFunctionExecutor<TTypes, TParams>): void {
        // Each entry closes over its own narrow types in a `createDriver` factory rather than
        // exposing the display/executor under their narrow generics. The stored display/executor are
        // widened existentials used only for id/function lookups; the factory rebinds the narrow
        // types when a consumer asks for a driver, so the registry never upcasts at construction.
        this.mEntries.push({
            display: pDisplay as unknown as PotatnoPreviewEntry<TTypes>['display'],
            executor: pExecutor as unknown as PotatnoPreviewEntry<TTypes>['executor'],
            createDriver: <TProject extends PotatnoProject>(pParameter: PotatnoPreviewEntryCreateDriverParameter<TProject>): PotatnoPreviewDriver<TProject> => {
                return new PotatnoPreviewDriver<TProject, TElement, TParams, TResult>({
                    display: pDisplay as unknown as PotatnoPreviewDisplay<TProject['types'], TElement, TParams, TResult, PotatnoPreviewDisplayTypeAdapter<TProject['types'], TResult>>,
                    executor: pExecutor as unknown as PotatnoPreviewFunctionExecutor<TProject['types'], TParams>,
                    portTarget: pParameter.portTarget,
                    generatorResultProvider: pParameter.generatorResultProvider
                }) as unknown as PotatnoPreviewDriver<TProject>;
            }
        });
    }

    /**
     * All registered pairs that can preview a value produced within the given function — the entries
     * whose executor wraps the function. Used when building a per-port driver (node output or
     * function output).
     *
     * `pProjectType` carries the previewed value's project type for the caller's context; the filter
     * itself is by function — a display's actual ability to render a given type is handled later by
     * its adapter (identity fallback when none is registered), not by excluding it here.
     *
     * @param pFunctionDefinition - The function whose previews to list.
     * @param _pProjectType - The project type name of the previewed value (loose hint, not a filter).
     *
     * @returns The matching entries, in registration order.
     */
    public availablePreviews(pFunctionDefinition: PotatnoFunctionDefinition<PotatnoProject>, _pProjectType: string): Array<PotatnoPreviewEntry<TTypes>> {
        return this.mEntries.filter((pEntry) => {
            return pEntry.executor.function.id === pFunctionDefinition.id;
        });
    }

    /**
     * The display ("style") ids registered for the given function, deduplicated and in
     * registration order. Drives the preview display selectors.
     *
     * @param pFunctionDefinition - The function whose preview displays to list.
     *
     * @returns The matching display ids.
     */
    public availablePreviewTypes(pFunctionDefinition: PotatnoFunctionDefinition<PotatnoProject>): Array<string> {
        const lDisplays: Set<string> = new Set<string>();
        for (const lEntry of this.mEntries) {
            if (lEntry.executor.function.id === pFunctionDefinition.id) {
                lDisplays.add(lEntry.display.id);
            }
        }

        return [...lDisplays];
    }
}

/**
 * Constructor parameters handed to a registry entry's `createDriver` factory.
 *
 * @typeParam TProject - The project type the driver is being built for.
 */
export type PotatnoPreviewEntryCreateDriverParameter<TProject extends PotatnoProject> = {
    /**
     * The previewed port plus its value resolver, or `null` for a function-level preview.
     */
    readonly portTarget: PotatnoPreviewDriverPortTarget<TProject> | null;

    /**
     * Yields the current document generator result on every driver refresh.
     */
    readonly generatorResultProvider: () => PotatnoCodeGeneratorDocumentResult<TProject>;
};

/**
 * One registered `(display, executor)` pair inside a `PotatnoPreview` registry.
 *
 * The `display`/`executor` are stored widened to existential types — only their `id` and bound
 * `function` are read from the outside. The narrow types are sealed inside the `createDriver`
 * closure, which projects them back into a driver typed against the consumer's `TProject`.
 *
 * @typeParam TTypes - The project types definition the registry targets.
 */
export type PotatnoPreviewEntry<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>> = {
    /**
     * Preview display, widened to an existential — read for its `id` and `adapterFor`.
     */
    readonly display: PotatnoPreviewDisplay<TTypes, Element, Readonly<Record<string, unknown>>, unknown, PotatnoPreviewDisplayTypeAdapter<TTypes, unknown>>;

    /**
     * Preview code executor, widened to an existential — read for its bound `function`.
     */
    readonly executor: PotatnoPreviewFunctionExecutor<TTypes, Readonly<Record<string, unknown>>>;

    /**
     * Build a `PotatnoPreviewDriver` bound to this entry's display and executor.
     *
     * @typeParam TProject - The project type the consumer is building a driver against.
     *
     * @param pParameter - The project-scoped portions of the driver configuration.
     *
     * @returns The freshly constructed driver.
     */
    createDriver<TProject extends PotatnoProject>(pParameter: PotatnoPreviewEntryCreateDriverParameter<TProject>): PotatnoPreviewDriver<TProject>;
};
