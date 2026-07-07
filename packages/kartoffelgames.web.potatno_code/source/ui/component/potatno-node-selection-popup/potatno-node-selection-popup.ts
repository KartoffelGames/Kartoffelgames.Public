import { Injection } from '@kartoffelgames/core-dependency-injection';
import { ComponentState, PwbChild, PwbComponent, PwbComponentEvent, type ComponentEventEmitter, type IComponentOnConnect, type IComponentOnUpdate } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoNodeDefinition } from '../../../project/node_definition/potatno-node-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import { PotatnoUiManager } from '../../manager/potatno-ui-manager.ts';
import addNodePopupCss from './potatno-node-selection-popup.css' with { type: 'text' };
import addNodePopupTemplate from './potatno-node-selection-popup.html' with { type: 'text' };

/**
 * Searchable popup listing every node definition available to the active function.
 * Dispatches the "node-select" event on selecting a node.
 */
@PwbComponent({
    selector: 'potatno-node-selection-popup',
    template: addNodePopupTemplate,
    style: addNodePopupCss,
})
export class PotatnoNodeSelectionPopup implements IComponentOnConnect, IComponentOnUpdate {
    private readonly mManager: PotatnoUiManager;

    /**
     * Filtered result entries shown in the list.
     */
    @ComponentState.state({ complexValue: true })
    public accessor results: Array<PotatnoAddNodePopupEntry>;

    /**
     * Search field element, focused when the popup opens.
     */
    @PwbChild('searchInput')
    public accessor searchInput!: HTMLInputElement;

    /**
     * Emitted with the definition the user picked, for the host to insert.
     */
    @PwbComponentEvent('node-select')
    private accessor mNodeSelect!: ComponentEventEmitter<PotatnoNodeDefinition<PotatnoProjectTypesDefinition>>;

    /**
     * Current search field text.
     */
    @ComponentState.state()
    public accessor searchValue: string;

    /**
     * Current selected definition id.
     */
    @ComponentState.state()
    private accessor selectedDefinitionId: string | null;

    /**
     * Create the add-node popup.
     *
     * @param pManager - Injected shared UI manager singleton.
     */
    public constructor(pManager: PotatnoUiManager = Injection.use(PotatnoUiManager)) {
        this.mManager = pManager;

        this.selectedDefinitionId = null;
        this.results = new Array<PotatnoAddNodePopupEntry>();
        this.searchValue = '';
    }

    /**
     * Focus the search field when the popup opens.
     */
    public onConnect(): void {
        this.searchInput.focus();
    }

    /**
     * Handle keyboard navigation in the search field.
     *
     * @param pEvent - Keyboard event from the search field.
     */
    public onKeyDown(pEvent: KeyboardEvent): void {
        // Both, the send as well as the selected does not work when the search list is empty.
        if (this.results.length === 0) {
            return;
        }

        // Select node on arrows.
        if (pEvent.key === 'ArrowDown' || pEvent.key === 'ArrowUp') {
            pEvent.preventDefault();

            // Find list index of current selected definition.
            let lEntryIndex = this.results.findIndex((pEntry: PotatnoAddNodePopupEntry) => {
                return pEntry.definition.id === this.selectedDefinitionId;
            });
            lEntryIndex = Math.max(0, lEntryIndex);

            // Direction based on pressed arrow.
            const lDirection: number = pEvent.key === 'ArrowDown' ? 1 : -1;

            // Move index into direction. Starting again from bottom or top.
            const lNextIndex: number = (lEntryIndex + lDirection + this.results.length) % this.results.length;

            // Set new definition index.
            this.selectedDefinitionId = this.results[lNextIndex].definition.id;

            return;
        }

        // Send node on enter.
        if (pEvent.key === 'Enter') {
            this.sendSelectedEntry(this.selectedDefinitionId);
        }
    }

    /**
     * Result search result list whenever the component is updated.
     * That includes when something is typed into the searchbar. 
     */
    public onUpdate(): void {
        this.rebuildResults();
    }

    /**
     * Stop pointer interaction from reaching the graph canvas behind the popup.
     *
     * @param pEvent - Pointer event from the popup root.
     */
    public stopPropagation(pEvent: PointerEvent): void {
        pEvent.stopPropagation();
    }

    /**
     * Rebuild the result list from the active function and the current search query.
     */
    private rebuildResults(): void {
        // No function, no results. Reset list.
        if (!this.mManager.activeFunction) {
            this.results = new Array<PotatnoAddNodePopupEntry>();
            return;
        }

        // Build a entry list for all dynamic nodes.
        const lEntryList: Array<PotatnoAddNodePopupEntry> = this.mManager.activeFunction.dynamicNodeDefinitions.map((pNodeDefinition) => {
            return {
                category: pNodeDefinition.category.name,
                definition: pNodeDefinition,
                label: pNodeDefinition.label.toLowerCase(),
                color: this.mManager.generateStringColor(pNodeDefinition.category.name),
                icon: pNodeDefinition.category.icon
            };
        });

        // Normalize searchterm.
        const lSearchTerm: string = this.searchValue.trim().toLowerCase();

        // Filter entry list by searchterm.
        this.results = lEntryList.filter((pEntry: PotatnoAddNodePopupEntry) => {
            return pEntry.label.includes(lSearchTerm);
        });

        // Select the first result when the current selected definition is not in the search result.
        if (!this.results.some((pEntry: PotatnoAddNodePopupEntry) => pEntry.definition.id === this.selectedDefinitionId)) {
            this.selectedDefinitionId = this.results[0]?.definition.id ?? null;
        }
    }

    /**
     * Emit the currently selected entry (or the first one) for insertion.
     * 
     * @param pSelectedIndex - Selected id.
     */
    private sendSelectedEntry(pSelectedIndex: string | null): void {
        // Skip when nothing was selected.
        if (pSelectedIndex === null) {
            return;
        }

        // Find entry be selected definition id.
        const lEntry: PotatnoAddNodePopupEntry | undefined = this.results.find((pEntry: PotatnoAddNodePopupEntry) => {
            return pEntry.definition.id === pSelectedIndex;
        });

        // When still nothing is selected, the search has no result.
        if (!lEntry) {
            return;
        }

        this.mNodeSelect.dispatchEvent(lEntry.definition);
    }
}

/**
 * Display and insertion data for one available node definition shown in the popup.
 */
type PotatnoAddNodePopupEntry = {
    category: string;
    color: string;
    definition: PotatnoNodeDefinition<PotatnoProjectTypesDefinition>;
    label: string;
    icon: string;
};
