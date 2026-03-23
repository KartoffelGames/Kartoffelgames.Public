import { PwbComponent, Processor, PwbExport, PwbComponentEvent, ComponentEventEmitter } from '@kartoffelgames/web-potato-web-builder';
import { NodeCategory, NODE_CATEGORY_META } from '../../node/node-category.enum.ts';
import templateCss from './potatno-node-library.css';
import libraryTemplate from './potatno-node-library.html';

/**
 * Node definition entry for the library display.
 */
interface NodeLibraryEntry {
    name: string;
    category: NodeCategory;
}

/**
 * Internal group representation: category key with its matching node entries.
 */
interface CategoryGroup {
    category: NodeCategory;
    icon: string;
    label: string;
    cssColor: string;
    nodes: Array<NodeLibraryEntry>;
}

/**
 * Node library component for the potatno-code visual editor.
 * Displays available node definitions grouped by category with search filtering.
 */
@PwbComponent({
    selector: 'potatno-node-library',
    template: libraryTemplate,
    style: templateCss,
})
export class PotatnoNodeLibrary extends Processor {
    private mNodeDefinitions: Array<NodeLibraryEntry> = [];
    private mCachedFilteredGroups: Array<CategoryGroup> = [];

    /**
     * Event emitted when a node entry is mousedown-ed for drag-to-canvas.
     */
    @PwbComponentEvent('node-drag-start')
    private accessor mNodeDragStart!: ComponentEventEmitter<string>;

    private mSearchQuery: string = '';
    private mCollapsedCategories: Record<string, boolean> = {};

    /**
     * Array of node definitions to display in the library.
     */
    @PwbExport
    public set nodeDefinitions(pValue: Array<NodeLibraryEntry>) {
        this.mNodeDefinitions = pValue;
        this.rebuildFilteredGroups();
    }

    /**
     * Get the array of node definitions.
     */
    public get nodeDefinitions(): Array<NodeLibraryEntry> {
        return this.mNodeDefinitions;
    }

    /**
     * Get the filtered and grouped node definitions based on the current search query.
     */
    public get filteredGroups(): Array<CategoryGroup> {
        return this.mCachedFilteredGroups;
    }

    /**
     * Rebuild the cached filtered groups based on current node definitions and search query.
     */
    private rebuildFilteredGroups(): void {
        const lQuery: string = this.mSearchQuery.toLowerCase();
        const lGroupMap: Map<NodeCategory, Array<NodeLibraryEntry>> = new Map();

        for (const lEntry of this.mNodeDefinitions) {
            if (lQuery && !lEntry.name.toLowerCase().includes(lQuery)) {
                continue;
            }

            let lGroup: Array<NodeLibraryEntry> | undefined = lGroupMap.get(lEntry.category);
            if (!lGroup) {
                lGroup = [];
                lGroupMap.set(lEntry.category, lGroup);
            }
            lGroup.push(lEntry);
        }

        const lResult: Array<CategoryGroup> = [];
        const lCategoryOrder: Array<NodeCategory> = Object.values(NodeCategory);

        for (const lCategory of lCategoryOrder) {
            const lNodes: Array<NodeLibraryEntry> | undefined = lGroupMap.get(lCategory);
            if (lNodes && lNodes.length > 0) {
                const lMeta = NODE_CATEGORY_META[lCategory];
                lResult.push({
                    category: lCategory,
                    icon: lMeta.icon,
                    label: lMeta.label,
                    cssColor: lMeta.cssColor,
                    nodes: lNodes
                });
            }
        }

        this.mCachedFilteredGroups = lResult;
    }

    /**
     * Handle search input changes.
     *
     * @param pEvent - Input event from the search field.
     */
    public onSearchInput(pEvent: Event): void {
        this.mSearchQuery = (pEvent.target as HTMLInputElement).value;
        this.rebuildFilteredGroups();
    }

    /**
     * Toggle the collapsed state of a category group.
     *
     * @param pCategory - The category to toggle.
     */
    public toggleCategory(pCategory: NodeCategory): void {
        this.mCollapsedCategories[pCategory] = !this.mCollapsedCategories[pCategory];
        this.rebuildFilteredGroups();
    }

    /**
     * Check if a category is currently collapsed.
     *
     * @param pCategory - The category to check.
     * @returns True if collapsed.
     */
    public isCategoryCollapsed(pCategory: NodeCategory): boolean {
        return !!this.mCollapsedCategories[pCategory];
    }

    /**
     * Get the CSS class for the toggle arrow indicator.
     *
     * @param pCategory - The category to check.
     * @returns CSS class string.
     */
    public getToggleClass(pCategory: NodeCategory): string {
        return this.mCollapsedCategories[pCategory] ? 'category-toggle collapsed' : 'category-toggle';
    }

    /**
     * Handle mousedown on a node entry to start drag operation.
     *
     * @param pName - The node definition name.
     */
    public onNodeMouseDown(pName: string): void {
        this.mNodeDragStart.dispatchEvent(pName);
    }
}
