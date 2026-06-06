import { Injection } from '@kartoffelgames/core-dependency-injection';
import { ComponentEventEmitter, ComponentState, PwbChild, PwbComponent, PwbComponentEvent, type IComponentOnConnect } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import type { PotatnoNodeDefinition } from '../../../project/node_definition/potatno-node-definition.ts';
import { PotatnoUiManager } from '../../manager/potatno-ui-manager.ts';
import { NodeCategoryMeta } from '../../node/node-category.enum.ts';
import type { PotatnoUiProject } from '../../potatno-ui-project.ts';
import addNodePopupCss from './potatno-add-node-popup.css' with { type: 'text' };
import addNodePopupTemplate from './potatno-add-node-popup.html' with { type: 'text' };

/**
 * Searchable popup listing every node definition available to the active function.
 *
 * Owns only its own search/selection state; it builds its entry list straight from the shared
 * {@link PotatnoUiManager}'s active function and emits the chosen definition via `node-select`.
 * Placement is the host's concern — the node graph renders this popup at the context-menu position
 * and inserts the selected node at the matching world coordinate, so the popup itself stays
 * placement-agnostic. Pointer/wheel/context-menu events on the popup are stopped here so they never
 * reach the graph canvas behind it.
 */
@PwbComponent({
    selector: 'potatno-add-node-popup',
    template: addNodePopupTemplate,
    style: addNodePopupCss,
})
export class PotatnoAddNodePopup implements IComponentOnConnect {
    private readonly mManager: PotatnoUiManager;
    private mSearchQuery: string;
    private mSelectedDefinitionId: string | null;

    /**
     * Filtered node definition entries shown in the result list.
     */
    @ComponentState.state({ complexValue: true })
    private accessor mFilteredEntries: Array<PotatnoAddNodePopupEntry> = [];

    /**
     * Search field element, focused when the popup opens.
     */
    @PwbChild('searchInput')
    public accessor searchInput!: HTMLInputElement;

    /**
     * Emitted with the definition the user picked, for the host to insert.
     */
    @PwbComponentEvent('node-select')
    private accessor mNodeSelect!: ComponentEventEmitter<PotatnoNodeDefinition<PotatnoUiProject>>;

    /**
     * Emitted when the user dismisses the popup (Escape).
     */
    @PwbComponentEvent('close')
    private accessor mClose!: ComponentEventEmitter<void>;

    /**
     * Filtered result entries shown in the list.
     */
    public get results(): Array<PotatnoAddNodePopupEntry> {
        return this.mFilteredEntries;
    }

    /**
     * Current search field text.
     */
    public get searchValue(): string {
        return this.mSearchQuery;
    }

    /**
     * Create the add-node popup.
     *
     * @param pManager - Injected shared UI manager singleton.
     */
    public constructor(pManager: PotatnoUiManager = Injection.use(PotatnoUiManager)) {
        this.mManager = pManager;
        this.mSearchQuery = '';
        this.mSelectedDefinitionId = null;
        this.mFilteredEntries = [];
    }

    /**
     * Return the CSS class for a result row.
     *
     * @param pEntry - Entry whose selected state should be checked.
     *
     * @returns CSS class for the result row.
     */
    public getEntryClass(pEntry: PotatnoAddNodePopupEntry): string {
        return pEntry.id === this.mSelectedDefinitionId ? 'add-node-result selected' : 'add-node-result';
    }

    /**
     * Resolve the category accent color for a result row.
     *
     * @param pEntry - Entry whose category color to resolve.
     *
     * @returns A CSS color string for the entry's category.
     */
    public getEntryColor(pEntry: PotatnoAddNodePopupEntry): string {
        return NodeCategoryMeta.get(pEntry.category).cssColor;
    }

    /**
     * Resolve the category icon glyph for a result row.
     *
     * @param pEntry - Entry whose category icon to resolve.
     *
     * @returns The category icon glyph.
     */
    public getEntryIcon(pEntry: PotatnoAddNodePopupEntry): string {
        return NodeCategoryMeta.get(pEntry.category).icon;
    }

    /**
     * Resolve the human-readable category label for a result row.
     *
     * @param pEntry - Entry whose category label to resolve.
     *
     * @returns The display label of the entry's category.
     */
    public getEntryCategoryLabel(pEntry: PotatnoAddNodePopupEntry): string {
        return NodeCategoryMeta.get(pEntry.category).label;
    }

    /**
     * Build the initial result list and focus the search field.
     */
    public onConnect(): void {
        this.rebuildResults();
        this.focusSearchInput();
    }

    /**
     * Handle search text changes.
     *
     * @param pEvent - Input event from the search field.
     */
    public onSearchInput(pEvent: Event): void {
        if (!(pEvent.target instanceof HTMLInputElement)) {
            return;
        }

        this.mSearchQuery = pEvent.target.value;
        this.rebuildResults();
    }

    /**
     * Handle keyboard navigation in the search field.
     *
     * @param pEvent - Keyboard event from the search field.
     */
    public onSearchKeyDown(pEvent: KeyboardEvent): void {
        if (pEvent.key === 'Escape') {
            pEvent.preventDefault();
            this.mClose.dispatchEvent(undefined as unknown as void);
            return;
        }

        if (pEvent.key === 'Enter') {
            pEvent.preventDefault();
            this.emitSelectedEntry();
            return;
        }

        if (pEvent.key === 'ArrowDown' || pEvent.key === 'ArrowUp') {
            pEvent.preventDefault();
            this.moveSelection(pEvent.key === 'ArrowDown' ? 1 : -1);
        }
    }

    /**
     * Insert a clicked result entry.
     *
     * @param pEvent - Pointer event from the result row.
     * @param pEntry - Entry to insert.
     */
    public onEntryPointerDown(pEvent: PointerEvent, pEntry: PotatnoAddNodePopupEntry): void {
        pEvent.preventDefault();
        pEvent.stopPropagation();
        this.mNodeSelect.dispatchEvent(pEntry.definition);
    }

    /**
     * Stop pointer interaction from reaching the graph canvas behind the popup.
     *
     * @param pEvent - Pointer event from the popup root.
     */
    public onRootPointerDown(pEvent: PointerEvent): void {
        pEvent.stopPropagation();
    }

    /**
     * Let the result list scroll on its own instead of the canvas zooming behind it.
     *
     * @param pEvent - Wheel event from the popup root.
     */
    public onRootWheel(pEvent: WheelEvent): void {
        pEvent.stopPropagation();
    }

    /**
     * Keep a right-click inside the popup from reopening the popup on the canvas behind it.
     *
     * @param pEvent - Context menu event from the popup root.
     */
    public onRootContextMenu(pEvent: MouseEvent): void {
        pEvent.stopPropagation();
    }

    /**
     * Build the available node definition list for the active function from project, document,
     * function-specific, and enabled import definitions.
     *
     * @param pActiveFunction - Function whose node library context should be read.
     *
     * @returns Ordered node definition entries available to the function.
     */
    private buildAvailableNodeDefinitionEntries(pActiveFunction: PotatnoDocumentFunction<PotatnoUiProject> | null): Array<PotatnoAddNodePopupEntry> {
        const lEntries: Array<PotatnoAddNodePopupEntry> = [];
        const lAddedIds: Set<string> = new Set<string>();

        if (!pActiveFunction) {
            return lEntries;
        }

        // Add a definition if it was not already listed by an earlier source.
        const addDefinition = (pDefinition: PotatnoNodeDefinition<PotatnoUiProject>): void => {
            if (lAddedIds.has(pDefinition.id)) {
                return;
            }

            lAddedIds.add(pDefinition.id);
            lEntries.push({
                category: pDefinition.category,
                definition: pDefinition,
                id: pDefinition.id,
                name: pDefinition.label
            });
        };

        for (const lDefinition of pActiveFunction.project.nodeDefinitions) {
            addDefinition(lDefinition);
        }

        for (const lDefinition of pActiveFunction.nodeDefinitions) {
            addDefinition(lDefinition);
        }

        const lEnabledImports: Set<string> = new Set<string>(pActiveFunction.imports);
        for (const lImport of pActiveFunction.project.imports) {
            if (!lEnabledImports.has(lImport.label)) {
                continue;
            }

            for (const lDefinition of lImport.nodes) {
                addDefinition(lDefinition);
            }
        }

        return lEntries;
    }

    /**
     * Emit the currently selected entry (or the first one) for insertion.
     */
    private emitSelectedEntry(): void {
        const lEntry: PotatnoAddNodePopupEntry | undefined = this.mFilteredEntries.find((pEntry: PotatnoAddNodePopupEntry) => pEntry.id === this.mSelectedDefinitionId)
            ?? this.mFilteredEntries[0];
        if (!lEntry) {
            return;
        }

        this.mNodeSelect.dispatchEvent(lEntry.definition);
    }

    /**
     * Focus and select the search field after it has rendered.
     */
    private focusSearchInput(): void {
        requestAnimationFrame(() => {
            try {
                this.searchInput.focus();
                this.searchInput.select();
            } catch {
                // The field is not in the DOM yet; ignore.
            }
        });
    }

    /**
     * Move the result selection by an offset, wrapping around the list.
     *
     * @param pOffset - Direction to move in the result list.
     */
    private moveSelection(pOffset: number): void {
        if (this.mFilteredEntries.length === 0) {
            this.mSelectedDefinitionId = null;
            return;
        }

        const lCurrentIndex: number = Math.max(0, this.mFilteredEntries.findIndex((pEntry: PotatnoAddNodePopupEntry) => pEntry.id === this.mSelectedDefinitionId));
        const lNextIndex: number = (lCurrentIndex + pOffset + this.mFilteredEntries.length) % this.mFilteredEntries.length;
        this.mSelectedDefinitionId = this.mFilteredEntries[lNextIndex].id;
        this.mFilteredEntries = [...this.mFilteredEntries];
    }

    /**
     * Rebuild the result list from the active function and the current search query.
     */
    private rebuildResults(): void {
        const lQuery: string = this.mSearchQuery.trim().toLowerCase();
        this.mFilteredEntries = this.buildAvailableNodeDefinitionEntries(this.mManager.activeFunction)
            .filter((pEntry: PotatnoAddNodePopupEntry) => !lQuery || pEntry.name.toLowerCase().includes(lQuery));

        if (!this.mFilteredEntries.some((pEntry: PotatnoAddNodePopupEntry) => pEntry.id === this.mSelectedDefinitionId)) {
            this.mSelectedDefinitionId = this.mFilteredEntries[0]?.id ?? null;
        }
    }
}

/**
 * Display and insertion data for one available node definition shown in the popup.
 */
export type PotatnoAddNodePopupEntry = {
    readonly category: string;
    readonly definition: PotatnoNodeDefinition<PotatnoUiProject>;
    readonly id: string;
    readonly name: string;
};
