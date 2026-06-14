import type { PotatnoFunctionDefinition } from '../project/potatno-function-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../project/potatno-project-types-definition.ts';
import type { PotatnoPreviewDisplay } from './potatno-preview-display.ts';
import type { PotatnoPreviewResultType } from './potatno-preview-function-executor.ts';

/**
 * Project-wide preview registry.
 * Holds every display the project supports.
 *
 * @typeParam TProject - The project this registry targets.
 */
export class PotatnoPreview<TProjectTypes extends PotatnoProjectTypesDefinition> {
    private readonly mDisplays: Map<string, PotatnoPreviewEntryDisplay<TProjectTypes>>;

    /**
     * Every registered display entry id.
     */
    public get displayIds(): Array<string> {
        return [...this.mDisplays.keys()];
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mDisplays = new Map<string, PotatnoPreviewEntryDisplay<TProjectTypes>>();
    }

    /**
     * Register one display.
     *
     * @param pDisplay - The display to register.
     */
    public addDisplay(pDisplay: PotatnoPreviewDisplay<TProjectTypes, any, any, any, any, any>): void {
        // Append new entry. "Convert" display and executor into a more flexibly type
        this.mDisplays.set(pDisplay.id, pDisplay);
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
    public availableDisplays(pFunctionDefinition: PotatnoFunctionDefinition<TProjectTypes>, pProjectType: string | null = null): Array<string> {
        const lDisplays: Array<string> = new Array<string>();
        for (const [lDisplayId, lDisplay] of this.mDisplays) {
            // Filter for the function.
            if (lDisplay.executor.function.id !== pFunctionDefinition.id) {
                continue;
            }

            if ((pProjectType === null || lDisplay.allowsType(pProjectType))) {
                lDisplays.push(lDisplayId);
            }
        }

        return lDisplays;
    }

    /**
     * Get a display of this previews container by id.
     * 
     * @param pDisplayId - Id of display.
     * 
     * @returns the display instance.
     */
    public getDisplay(pDisplayId: string): PotatnoPreviewEntryDisplay<TProjectTypes> | null {
        return this.mDisplays.get(pDisplayId) ?? null;
    }
}

/**
 * Existential display type of a registry entry — element, parameter and result shapes widened.
 *
 * @typeParam TProject - The project the registry targets.
 */
export type PotatnoPreviewEntryDisplay<TProjectTypes extends PotatnoProjectTypesDefinition> = PotatnoPreviewDisplay<TProjectTypes, Element, Record<string, unknown>, PotatnoPreviewResultType<TProjectTypes>, PotatnoPreviewResultType<TProjectTypes>, unknown>;
