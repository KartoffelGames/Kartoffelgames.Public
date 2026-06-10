import type { PotatnoDocumentFunction } from '../document/potatno-document-function.ts';
import type { PotatnoDocumentPort } from '../document/potatno-document-port.ts';
import type { PotatnoFunctionDefinition } from '../project/potatno-function-definition.ts';
import type { PotatnoProjectGenericType, PotatnoProjectTypesDefinition } from '../project/potatno-project-types-definition.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';
import type { PotatnoPreviewDisplay, PotatnoPreviewDisplayTypeAdapter } from './potatno-preview-display.ts';
import { PotatnoPreviewDriver } from './potatno-preview-driver.ts';
import type { PotatnoPreviewFunctionExecutor } from './potatno-preview-function-executor.ts';

/**
 * Project-wide preview registry.
 * Holds every `(display, executor)` pair the project supports. Entries answer which previews apply
 * to a function and value type, and build the drivers bound to them.
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
     * Register one `(display, executor)` pair. Two compile-time checks are enforced: the shared
     * `TParams` generic matches the display's iteration parameters with the executor's, and every
     * type name the executor's build can report must either be a project type or carry an adapter
     * in the display's record.
     *
     * @typeParam TElement - The display's element type.
     * @typeParam TParams - The shared iteration parameter shape.
     * @typeParam TResult - The display's result shape.
     * @typeParam TAdapter - The display's adapter record shape.
     *
     * @param pDisplay - The display side of the pair.
     * @param pExecutor - The executor side of the pair.
     */
    public addDisplay<TElement extends Element, TParams extends Readonly<Record<string, unknown>>, TResult, TAdapter extends PotatnoPreviewDisplayTypeAdapter<TTypes, TResult>>(pDisplay: PotatnoPreviewDisplay<TTypes, TElement, TParams, TResult, TAdapter>, pExecutor: PotatnoPreviewFunctionExecutor<TTypes, TParams, Extract<keyof TAdapter, string> | TTypes['typeNames'][number] | PotatnoProjectGenericType>): void {
        // Store the pair widened to existential types; the narrow types were already validated
        // against each other by this method's generics.
        const lEntry: PotatnoPreviewEntry<TTypes> = {
            display: pDisplay as unknown as PotatnoPreviewEntryDisplay<TTypes>,
            executor: pExecutor as unknown as PotatnoPreviewEntryExecutor<TTypes>,
            createDriver: <TProject extends PotatnoProject>(pTarget: PotatnoDocumentFunction<TProject> | PotatnoDocumentPort<TProject>): PotatnoPreviewDriver<TProject> => {
                return new PotatnoPreviewDriver<TProject>(lEntry as unknown as PotatnoPreviewEntry<TProject['types']>, pTarget);
            }
        };

        this.mEntries.push(lEntry);
    }

    /**
     * All registered pairs that can preview a value of the given type within the given function:
     * the executor must wrap the function and the display's adapter record must allow the type.
     *
     * @param pFunctionDefinition - The function whose previews to list.
     * @param pProjectType - Type name of the previewed value. Project type or custom type like `'fullOutput'`.
     *
     * @returns The matching entries, in registration order.
     */
    public availablePreviews(pFunctionDefinition: PotatnoFunctionDefinition<PotatnoProject>, pProjectType: string): Array<PotatnoPreviewEntry<TTypes>> {
        return this.mEntries.filter((pEntry) => {
            return pEntry.executor.function.id === pFunctionDefinition.id && pEntry.display.allowsType(pProjectType);
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

    /**
     * Find the entry registered for the exact `(display, executor)` pair.
     *
     * @typeParam TElement - The display's element type.
     * @typeParam TParams - The shared iteration parameter shape.
     * @typeParam TResult - The display's result shape.
     * @typeParam TAdapter - The display's adapter record shape.
     *
     * @param pDisplay - The display side of the pair.
     * @param pExecutor - The executor side of the pair.
     *
     * @returns The matching entry, or `null` when the pair was never registered.
     */
    public entryOf<TElement extends Element, TParams extends Readonly<Record<string, unknown>>, TResult, TAdapter extends PotatnoPreviewDisplayTypeAdapter<TTypes, TResult>>(pDisplay: PotatnoPreviewDisplay<TTypes, TElement, TParams, TResult, TAdapter>, pExecutor: PotatnoPreviewFunctionExecutor<TTypes, TParams>): PotatnoPreviewEntry<TTypes> | null {
        return this.mEntries.find((pEntry) => {
            return pEntry.display === (pDisplay as unknown) && pEntry.executor === (pExecutor as unknown);
        }) ?? null;
    }
}

/**
 * One registered `(display, executor)` pair inside a `PotatnoPreview` registry. The pair is stored
 * widened to existential types; `createDriver` builds a driver bound to it.
 *
 * @typeParam TTypes - The project types definition the registry targets.
 */
export type PotatnoPreviewEntry<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>> = {
    /**
     * Preview display, widened to an existential.
     */
    readonly display: PotatnoPreviewEntryDisplay<TTypes>;

    /**
     * Preview code executor, widened to an existential.
     */
    readonly executor: PotatnoPreviewEntryExecutor<TTypes>;

    /**
     * Build a {@link PotatnoPreviewDriver} bound to this entry's display and executor.
     *
     * @typeParam TProject - The project type the driver is built for.
     *
     * @param pTarget - The previewed document port, or a document function for a full-output preview.
     *
     * @returns The freshly constructed driver.
     */
    createDriver<TProject extends PotatnoProject>(pTarget: PotatnoDocumentFunction<TProject> | PotatnoDocumentPort<TProject>): PotatnoPreviewDriver<TProject>;
};

/**
 * Existential display type of a registry entry — element, parameter and result shapes widened.
 *
 * @typeParam TTypes - The project types definition the registry targets.
 */
export type PotatnoPreviewEntryDisplay<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>> = PotatnoPreviewDisplay<TTypes, Element, Readonly<Record<string, unknown>>, unknown, PotatnoPreviewDisplayTypeAdapter<TTypes, unknown>>;

/**
 * Existential executor type of a registry entry — parameter and result type shapes widened.
 *
 * @typeParam TTypes - The project types definition the registry targets.
 */
export type PotatnoPreviewEntryExecutor<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>> = PotatnoPreviewFunctionExecutor<TTypes, Readonly<Record<string, unknown>>, string>;
