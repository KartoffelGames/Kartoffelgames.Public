import { ComponentState, PwbComponent, PwbExport } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import { NodeCategoryMeta } from "../../node/node-category.enum.ts";
import { buildAvailableNodeDefinitionEntries, type PotatnoNodeDefinitionListEntry, type PotatnoUiProject } from '../../potatno-node-definition-list.ts';
import { PotatnoNodeLibraryDragBus } from '../../potatno-node-library-drag.ts';
import templateCss from './potatno-node-library.css' with { type: 'text' };
import libraryTemplate from './potatno-node-library.html' with { type: 'text' };

/**
 * Node library component for the potatno-code visual editor.
 */
@PwbComponent({
    selector: 'potatno-node-library',
    template: libraryTemplate,
    style: templateCss,
})
export class PotatnoNodeLibrary {
    private mActiveFunction: PotatnoDocumentFunction<PotatnoUiProject> | null = null;
    private mCollapsedCategories: Record<string, boolean> = {};
    private mNodeDefinitions: Array<NodeLibraryEntry> = [];
    private mRefreshVersion: number = 0;
    private mSearchQuery: string = '';

    /**
     * Cached category groups rendered by the template.
     */
    @ComponentState.state()
    private accessor mCachedFilteredGroups: Array<CategoryGroup> = [];

    /**
     * Active function that determines which node definitions are available.
     */
    @PwbExport
    public set activeFunction(pValue: PotatnoDocumentFunction<PotatnoUiProject> | null) {
        if (this.mActiveFunction === pValue) {
            return;
        }

        this.mActiveFunction = pValue;
        this.refreshNodeDefinitions();
    }

    /**
     * Get the active function that backs the library.
     */
    public get activeFunction(): PotatnoDocumentFunction<PotatnoUiProject> | null {
        return this.mActiveFunction;
    }

    /**
     * Explicit refresh token from owning UI actions.
     */
    @PwbExport
    public set refreshVersion(pValue: number) {
        if (this.mRefreshVersion === pValue) {
            return;
        }

        this.mRefreshVersion = pValue;
        this.refreshNodeDefinitions();
    }

    /**
     * Get the current explicit refresh token.
     */
    public get refreshVersion(): number {
        return this.mRefreshVersion;
    }

    /**
     * Get the filtered and grouped node definitions based on the current search query.
     */
    public get filteredGroups(): Array<CategoryGroup> {
        return this.mCachedFilteredGroups;
    }

    /**
     * Handle search input changes.
     *
     * @param pEvent - Input event from the search field.
     */
    public onSearchInput(pEvent: Event): void {
        if (!(pEvent.target instanceof HTMLInputElement)) {
            return;
        }

        this.mSearchQuery = pEvent.target.value;
        this.rebuildFilteredGroups();
    }

    /**
     * Toggle the collapsed state of a category group.
     *
     * @param pCategory - The category to toggle.
     */
    public toggleCategory(pCategory: string): void {
        this.mCollapsedCategories[pCategory] = !this.mCollapsedCategories[pCategory];
        this.rebuildFilteredGroups();
    }

    /**
     * Check if a category is currently collapsed.
     *
     * @param pCategory - The category to check.
     *
     * @returns True if collapsed.
     */
    public isCategoryCollapsed(pCategory: string): boolean {
        return this.mCollapsedCategories[pCategory] === true;
    }

    /**
     * Get the CSS class for the toggle arrow indicator.
     *
     * @param pCategory - The category to check.
     *
     * @returns CSS class string.
     */
    public getToggleClass(pCategory: string): string {
        return this.mCollapsedCategories[pCategory] ? 'category-toggle collapsed' : 'category-toggle';
    }

    /**
     * Start a library drag for a node entry.
     *
     * @param pEvent - Pointer event that starts the drag.
     * @param pEntry - Node entry being dragged.
     */
    public onNodePointerDown(pEvent: PointerEvent, pEntry: NodeLibraryEntry): void {
        if (pEvent.button !== 0) {
            return;
        }

        PotatnoNodeLibraryDragBus.startDrag({
            clientX: pEvent.clientX,
            clientY: pEvent.clientY,
            definitionId: pEntry.id,
            label: pEntry.name
        });
    }

    /**
     * Request insertion of a node entry by clicking it.
     *
     * @param pEvent - Click event from the node entry.
     * @param pEntry - Node entry being inserted.
     */
    public onNodeClick(pEvent: MouseEvent, pEntry: NodeLibraryEntry): void {
        pEvent.preventDefault();
        PotatnoNodeLibraryDragBus.requestInsert({
            definitionId: pEntry.id,
            label: pEntry.name
        });
    }

    /**
     * Refresh the raw node definition entries from the active function.
     */
    private refreshNodeDefinitions(): void {
        this.mNodeDefinitions = buildAvailableNodeDefinitionEntries(this.mActiveFunction);
        this.rebuildFilteredGroups();
    }

    /**
     * Rebuild the cached filtered groups based on current node definitions and search query.
     */
    private rebuildFilteredGroups(): void {
        const lQuery: string = this.mSearchQuery.toLowerCase();
        const lGroupMap: Map<string, Array<NodeLibraryEntry>> = new Map<string, Array<NodeLibraryEntry>>();
        const lCategoryOrder: Array<string> = new Array<string>();

        for (const lEntry of this.mNodeDefinitions) {
            if (lQuery && !lEntry.name.toLowerCase().includes(lQuery)) {
                continue;
            }

            let lGroup: Array<NodeLibraryEntry> | undefined = lGroupMap.get(lEntry.category);
            if (!lGroup) {
                lGroup = [];
                lGroupMap.set(lEntry.category, lGroup);
                lCategoryOrder.push(lEntry.category);
            }
            lGroup.push(lEntry);
        }

        const lResult: Array<CategoryGroup> = [];

        for (const lCategory of lCategoryOrder) {
            const lNodes: Array<NodeLibraryEntry> | undefined = lGroupMap.get(lCategory);
            if (lNodes && lNodes.length > 0) {
                const lMeta = NodeCategoryMeta.get(lCategory);
                lResult.push({
                    category: lCategory,
                    cssColor: lMeta.cssColor,
                    icon: lMeta.icon,
                    label: lMeta.label,
                    nodes: lNodes
                });
            }
        }

        this.mCachedFilteredGroups = lResult;
    }
}

type NodeLibraryEntry = PotatnoNodeDefinitionListEntry<PotatnoUiProject>;

/**
 * Internal group representation for category headings and matching entries.
 */
interface CategoryGroup {
    category: string;
    cssColor: string;
    icon: string;
    label: string;
    nodes: Array<NodeLibraryEntry>;
}
