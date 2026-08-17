import { Injection } from '@kartoffelgames/core-dependency-injection';
import { KgPopupComponent } from '@kartoffelgames/web-components';
import { Component, ComponentState, PwbChild, PwbComponent, PwbComponentEvent, type ComponentEventEmitter, type IComponentOnConnect, type IComponentOnUpdate } from '@kartoffelgames/web-potato-web-builder';
import { PwbExport } from '../../../../../kartoffelgames.web.potato_web_builder/source/module/export/pwb-export.decorator.ts';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import type { PotatnoNodeDefinition } from '../../../project/node_definition/potatno-node-definition.ts';
import type { PotatnoPortDefinition } from '../../../project/potatno-port-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import { PotatnoUiManager } from '../../manager/potatno-ui-manager.ts';
import addNodePopupCss from './potatno-node-selection-popup-component.css' with { type: 'text' };
import addNodePopupTemplate from './potatno-node-selection-popup-component.html' with { type: 'text' };

/**
 * Searchable popup listing every node definition available to the active function.
 * Dispatches the "node-select" event on selecting a node.
 */
@PwbComponent({
    selector: 'potatno-node-selection-popup',
    template: addNodePopupTemplate,
    style: addNodePopupCss,
    components: [KgPopupComponent]
})
export class PotatnoNodeSelectionPopupComponent implements IComponentOnConnect, IComponentOnUpdate {
    public static readonly POPUP_HEIGHT: number = 320;
    public static readonly POPUP_WIDTH: number = 280;

    private readonly mComponent: Component;
    private readonly mManager: PotatnoUiManager;
    private readonly mNodes: PotatnoNodeSelectionPopupComponentNodes;

    /**
     * Port context the current list is filted for.
     * All nodes in the filted node list can connect to this port.
     */
    @PwbExport
    public get contextport(): PotatnoDocumentPort<PotatnoProjectTypesDefinition> | null {
        return this.mNodes.context;
    } set contextport(pContext: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | null) {
        this.mNodes.context = pContext;

        this.mNodes.list.filtered = this.contexturizeNodeList(this.mNodes.context);
    }

    /**
     * Filtered result entries shown in the list.
     */
    @ComponentState.state({ complexValue: true })
    public accessor results: Array<PotatnoNodeSelectionPopupComponentEntry>;

    /**
     * Search field element, focused when the popup opens.
     */
    @PwbChild('searchInput')
    public accessor searchInput!: HTMLInputElement | null;

    /**
     * Emitted with the definition the user picked, for the host to insert.
     */
    @PwbComponentEvent('node-select')
    private accessor mNodeSelect!: ComponentEventEmitter<PotatnoNodeSelectionPopupComponentNodeSelection>;

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
    public constructor(pComponent: Component = Injection.use(Component), pManager: PotatnoUiManager = Injection.use(PotatnoUiManager)) {
        this.mManager = pManager;
        this.mComponent = pComponent;

        this.selectedDefinitionId = null;
        this.results = new Array<PotatnoNodeSelectionPopupComponentEntry>();
        this.searchValue = '';

        // Load available node list.
        const lFullNodeList: Array<PotatnoNodeSelectionPopupComponentEntry> = this.fetchNodeEntries();
        this.mNodes = {
            context: null,
            list: {
                full: lFullNodeList,
                filtered: lFullNodeList
            }
        };
    }

    /**
     * Focus the search field when the popup opens.
     */
    public onConnect(): void {
        this.searchInput?.focus();
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
            let lEntryIndex = this.results.findIndex((pEntry: PotatnoNodeSelectionPopupComponentEntry) => {
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
        // Filter entry list by searchterm.
        this.results = this.filterResults();

        // Select the first result when the current selected definition is not in the search result.
        if (!this.results.some((pEntry: PotatnoNodeSelectionPopupComponentEntry) => pEntry.definition.id === this.selectedDefinitionId)) {
            this.selectedDefinitionId = this.results[0]?.definition.id ?? null;
        }

        // Look into shadow root to find the selected element and scroll into view.
        const lSelectedElement = this.mComponent.element.shadowRoot!.querySelector('.selection-popup__result.selected');
        if (lSelectedElement) {
            lSelectedElement.scrollIntoView();
        }
    }

    /**
     * Stop pointer interaction from reaching the graph canvas behind the popup.
     *
     * @param pEvent - Pointer event from the popup root.
     */
    public stopPropagation(pEvent: PointerEvent, pPreventDefault: boolean): void {
        pEvent.stopPropagation();

        // Also prevent default?
        if (pPreventDefault) {
            pEvent.preventDefault();
        }
    }

    /**
     * Load a contexturized list based on the set context port.
     * 
     * @param pPortContext - Context port.
     * 
     * @returns filtered list based on context port. 
     */
    private contexturizeNodeList(pPortContext: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | null): Array<PotatnoNodeSelectionPopupComponentEntry> {
        // There is nothing to filter for, just use the full list.
        if (!pPortContext) {
            return this.mNodes.list.full;
        }

        // Filter entry list by searchterm.
        return this.mNodes.list.full.filter((pEntry: PotatnoNodeSelectionPopupComponentEntry) => {
            return !!this.findMatchingPortDefinition(pPortContext, pEntry.definition);
        });
    }

    /**
     * Fetch all selectable node definition entries.
     * 
     * @returns list of active and selectable node defintion entries.
     */
    private fetchNodeEntries(): Array<PotatnoNodeSelectionPopupComponentEntry> {
        return this.mManager.activeFunction.dynamicNodeDefinitions.map((pNodeDefinition) => {
            return {
                category: pNodeDefinition.category.name,
                definition: pNodeDefinition,
                label: pNodeDefinition.label.toLowerCase(),
                color: this.mManager.generateStringColor(pNodeDefinition.category.name),
                icon: pNodeDefinition.category.icon
            };
        });
    }

    /**
     * Rebuild the result list from the active function and the current search query.
     */
    private filterResults(): Array<PotatnoNodeSelectionPopupComponentEntry> {
        // Normalize searchterm.
        const lSearchTerm: string = this.searchValue.trim().toLowerCase();

        // Filter entry list by searchterm.
        return this.mNodes.list.filtered.filter((pEntry: PotatnoNodeSelectionPopupComponentEntry) => {
            return pEntry.label.includes(lSearchTerm);
        });
    }

    /**
     * Find the first matching port of a target node for a source port.
     * 
     * @param pSourcePort - Source port. 
     * @param pTargetNode - Target node.
     * 
     * @returns - The port definition of target node for a matching source port or null when nothing was found. 
     */
    private findMatchingPortDefinition(pSourcePort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>, pTargetNode: PotatnoNodeDefinition<PotatnoProjectTypesDefinition>): PotatnoPortDefinition<PotatnoProjectTypesDefinition> | null {
        // Get ports definition for the opposite direction.
        const lPortDefinitionList: ReadonlyArray<PotatnoPortDefinition<PotatnoProjectTypesDefinition>> = (() => {
            if (pSourcePort.direction === 'input') {
                return pTargetNode.outputs;
            }

            return pTargetNode.inputs;
        })();

        // Filter for each type or value type.
        for (const lPortDefinition of lPortDefinitionList) {
            if (lPortDefinition.portType !== pSourcePort.portType) {
                continue;
            }

            if (lPortDefinition.dataType !== pSourcePort.dataType) {
                continue;
            }

            return lPortDefinition;
        }

        return null;
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
        const lEntry: PotatnoNodeSelectionPopupComponentEntry | undefined = this.results.find((pEntry: PotatnoNodeSelectionPopupComponentEntry) => {
            return pEntry.definition.id === pSelectedIndex;
        });

        // When still nothing is selected, the search has no result.
        if (!lEntry) {
            return;
        }

        this.mNodeSelect.dispatchEvent({
            definition: lEntry.definition,
            port: (() => {
                // Nothing to filter.
                if (!this.mNodes.context) {
                    return null;
                }

                return {
                    source: this.mNodes.context,
                    target: this.findMatchingPortDefinition(this.mNodes.context, lEntry.definition)!
                };
            })()
        });
    }
}

/**
 * Display and insertion data for one available node definition shown in the popup.
 */
type PotatnoNodeSelectionPopupComponentEntry = {
    category: string;
    color: string;
    definition: PotatnoNodeDefinition<PotatnoProjectTypesDefinition>;
    label: string;
    icon: string;
};

type PotatnoNodeSelectionPopupComponentNodes = {
    list: {
        full: Array<PotatnoNodeSelectionPopupComponentEntry>;
        filtered: Array<PotatnoNodeSelectionPopupComponentEntry>;
    },
    context: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | null;
};

export type PotatnoNodeSelectionPopupComponentNodeSelection = {
    definition: PotatnoNodeDefinition<PotatnoProjectTypesDefinition>;
    port: null | {
        source: PotatnoDocumentPort<PotatnoProjectTypesDefinition>;
        target: PotatnoPortDefinition<PotatnoProjectTypesDefinition>;
    };
};