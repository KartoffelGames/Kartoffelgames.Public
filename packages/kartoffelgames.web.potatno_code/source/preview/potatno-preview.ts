import type { PotatnoDocumentFunction } from '../document/potatno-document-function.ts';
import type { PotatnoDocumentPort } from '../document/potatno-document-port.ts';
import type { PotatnoFunctionDefinition } from '../project/potatno-function-definition.ts';
import { PotatnoProjectTypesDefinition } from "../project/potatno-project-types-definition.ts";
import type { PotatnoPreviewDisplay } from './potatno-preview-display.ts';
import { PotatnoPreviewDriver } from './potatno-preview-driver.ts';
import type { PotatnoPreviewFunctionExecutor, PotatnoPreviewResultType } from './potatno-preview-function-executor.ts';

/**
 * Project-wide preview registry.
 * Holds every display the project supports. Entries answer which previews apply
 * to a function and value type, and build the drivers bound to them.
 *
 * @typeParam TProject - The project this registry targets.
 */
export class PotatnoPreview<TProjectTypes extends PotatnoProjectTypesDefinition> {
    private readonly mEntries: Array<PotatnoPreviewEntry<TProjectTypes>>;

    /**
     * Every registered display entry in insertion order.
     */
    public get entries(): ReadonlyArray<PotatnoPreviewEntry<TProjectTypes>> {
        return this.mEntries;
    }

    /**
     * Constructor.
     *
     */
    public constructor() {
        this.mEntries = new Array<PotatnoPreviewEntry<TProjectTypes>>();
    }

    /**
     * Register one display. The display is already bound to its executor, so the registry only
     * stores a widened entry for discovery and driver construction.
     *
     * @typeParam TElement - The display's element type.
     * @typeParam TParams - The shared iteration parameter shape.
     * @typeParam TResult - The display's result shape.
     * @typeParam TResultType - The executor result type union this display adapts.
     *
     * @param pDisplay - The display to register.
     */
    public addDisplay<TElement extends Element, TParams extends Record<string, unknown>, TResult, TResultType extends PotatnoPreviewResultType<TProjectTypes>>(pDisplay: PotatnoPreviewDisplay<TProjectTypes, TElement, TParams, TResult, TResultType>): void {
        // "Convert" display and executor into a more flexibly type
        const lDisplay: PotatnoPreviewEntryDisplay<TProjectTypes> = pDisplay as unknown as PotatnoPreviewEntryDisplay<TProjectTypes>;
        const lExecutor: PotatnoPreviewEntryExecutor<TProjectTypes> = pDisplay.executor as unknown as PotatnoPreviewEntryExecutor<TProjectTypes>;

        // Append new entry.
        this.mEntries.push({
            display: lDisplay,
            executor: lExecutor,

            // Dynamic preview driver generator.
            createDriver: (pTarget: PotatnoDocumentFunction<TProjectTypes> | PotatnoDocumentPort<TProjectTypes>): PotatnoPreviewDriver<TProjectTypes> => {
                return lDisplay.createDriver(pTarget);
            }
        });
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
    public availablePreviews(pFunctionDefinition: PotatnoFunctionDefinition<TProjectTypes>, pProjectType: string): Array<PotatnoPreviewEntry<TProjectTypes>> {
        return this.mEntries.filter((pEntry) => {
            return pEntry.executor.function.id === pFunctionDefinition.id
                && pEntry.executor.types.includes(pProjectType)
                && pEntry.display.allowsType(pProjectType);
        });
    }

    /**
     * The display ("style") ids registered for the given function, deduplicated and in
     * registration order. Drives the preview display selectors.
     *
     * @param pFunctionDefinition - The function whose preview displays to list.
     * @param pProjectType - Optional result type to restrict the display list.
     *
     * @returns The matching display ids.
     */
    public availablePreviewTypes(pFunctionDefinition: PotatnoFunctionDefinition<TProjectTypes>, pProjectType: string | null = null): Array<string> {
        const lDisplays: Set<string> = new Set<string>();
        for (const lEntry of this.mEntries) {
            if (lEntry.executor.function.id === pFunctionDefinition.id && (pProjectType === null || (lEntry.executor.types.includes(pProjectType) && lEntry.display.allowsType(pProjectType)))) {
                lDisplays.add(lEntry.display.id);
            }
        }

        return [...lDisplays];
    }
}

/**
 * One registered display inside a `PotatnoPreview` registry. The display and its executor are stored
 * widened to existential types; `createDriver` builds a driver bound to it.
 *
 * @typeParam TProject - The project the registry targets.
 */
export type PotatnoPreviewEntry<TProjectTypes extends PotatnoProjectTypesDefinition> = {
    /**
     * Preview display, widened to an existential.
     */
    readonly display: PotatnoPreviewEntryDisplay<TProjectTypes>;

    /**
     * Preview code executor, widened to an existential.
     */
    readonly executor: PotatnoPreviewEntryExecutor<TProjectTypes>;

    /**
     * Build a {@link PotatnoPreviewDriver} bound to this entry's display and executor.
     *
     * @typeParam TProject - The project type the driver is built for.
     *
     * @param pTarget - The previewed document port, or a document function for a full-output preview.
     *
     * @returns The freshly constructed driver.
     */
    createDriver(pTarget: PotatnoDocumentFunction<TProjectTypes> | PotatnoDocumentPort<TProjectTypes>): PotatnoPreviewDriver<TProjectTypes>;
};

/**
 * Existential display type of a registry entry — element, parameter and result shapes widened.
 *
 * @typeParam TProject - The project the registry targets.
 */
export type PotatnoPreviewEntryDisplay<TProjectTypes extends PotatnoProjectTypesDefinition> = PotatnoPreviewDisplay<TProjectTypes, Element, Record<string, unknown>, unknown, PotatnoPreviewResultType<TProjectTypes>>;

/**
 * Existential executor type of a registry entry — parameter and result type shapes widened.
 *
 * @typeParam TProject - The project the registry targets.
 */
export type PotatnoPreviewEntryExecutor<TProjectTypes extends PotatnoProjectTypesDefinition> = PotatnoPreviewFunctionExecutor<TProjectTypes, Record<string, unknown>, PotatnoPreviewResultType<TProjectTypes>>;
