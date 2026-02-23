import type { GameComponent } from '../../../source/core/component/game-component.ts';
import type { GameEnvironment, GameEnvironmentStateChange } from '../../../source/core/environment/game-environment.ts';
import type { GameEnvironmentStateType } from '../../../source/core/environment/game-environment-transmittion.ts';
import { GameScene } from '../../../source/core/game-scene.ts';
import { GameEntity } from '../../../source/core/hierarchy/game-entity.ts';
import type { GameNode } from '../../../source/core/hierarchy/game-node.ts';

/**
 * Renders the hierarchy panel in the left sidebar.
 * Shows all loaded scenes, their entities, and components as a tree.
 *
 * Does a full initial build of the tree, then listens for state change events
 * via the environment's debug sniffer callback. Events are buffered and processed
 * in a single requestAnimationFrame pass to avoid reading intermediate states
 * (e.g. when an entity is disabled, its components fire deactivate one by one).
 */
export class HierarchyPanel {
    private readonly mContainer: HTMLElement;
    private readonly mEnvironment: GameEnvironment;
    private readonly mCollapsedPaths: Set<string>;

    // DOM element tracking for incremental updates.
    private readonly mNodeElements: Map<GameNode, HierarchyNodeElements>;
    private readonly mComponentElements: Map<GameComponent, HTMLElement>;

    // Event buffering.
    private mPendingChanges: Array<GameEnvironmentStateChange>;
    private mUpdateScheduled: boolean;

    /**
     * Constructor. Builds the full initial tree and registers the sniffer callback.
     *
     * @param pContainer - The DOM element to render into (hierarchy-content).
     * @param pEnvironment - The game environment to read scene data from.
     */
    public constructor(pContainer: HTMLElement, pEnvironment: GameEnvironment) {
        this.mContainer = pContainer;
        this.mEnvironment = pEnvironment;
        this.mCollapsedPaths = new Set<string>();
        this.mNodeElements = new Map<GameNode, HierarchyNodeElements>();
        this.mComponentElements = new Map<GameComponent, HTMLElement>();
        this.mPendingChanges = new Array<GameEnvironmentStateChange>();
        this.mUpdateScheduled = false;

        // Build the full initial tree from currently loaded scenes.
        this.buildInitialTree();

        // Register sniffer callback for buffered incremental updates.
        this.mEnvironment.debugData.addStateChangeListener((pEvent: GameEnvironmentStateChange): void => {
            this.bufferStateChange(pEvent);
        });
    }

    /**
     * Build the full tree from currently loaded scenes. Called once at construction time.
     */
    private buildInitialTree(): void {
        for (const lScene of this.mEnvironment.loadedScenes) {
            this.buildSceneNode(lScene);
        }
    }

    /**
     * Build a scene node and all its descendants.
     */
    private buildSceneNode(pScene: GameScene): void {
        const lPath: string = pScene.label;
        const lHasChildren: boolean = pScene.childNodes.length > 0;
        const lElements: HierarchyNodeElements = this.createTreeNode(pScene.label, 'scene', 'S', pScene.enabled, lHasChildren, lPath);

        this.mContainer.appendChild(lElements.root);
        this.mNodeElements.set(pScene, lElements);

        // Build children recursively.
        for (const lChild of pScene.childNodes) {
            this.buildEntityNode(lChild, lElements, lPath);
        }
    }

    /**
     * Build an entity node and all its descendants. Recursively builds child entities and components.
     */
    private buildEntityNode(pNode: GameNode, pParentElements: HierarchyNodeElements, pParentPath: string): void {
        const lPath: string = pParentPath + '/' + pNode.label;
        const lIsEntity: boolean = pNode instanceof GameEntity;
        const lEntity: GameEntity | null = lIsEntity ? pNode as GameEntity : null;

        const lComponentCount: number = lEntity ? lEntity.components.size : 0;
        const lHasChildren: boolean = pNode.childNodes.length > 0 || lComponentCount > 0;

        const lElements: HierarchyNodeElements = this.createTreeNode(pNode.label, 'entity', 'E', pNode.enabled, lHasChildren, lPath);

        // Ensure parent has a child container (make it expandable if it wasn't).
        this.ensureChildContainer(pParentElements);
        pParentElements.childContainer!.appendChild(lElements.root);
        this.mNodeElements.set(pNode, lElements);

        // Add components.
        if (lEntity) {
            for (const lComponent of lEntity.components) {
                this.buildComponentNode(lComponent, lElements, lPath);
            }
        }

        // Add child nodes recursively.
        for (const lChild of pNode.childNodes) {
            this.buildEntityNode(lChild, lElements, lPath);
        }
    }

    /**
     * Build a component leaf node.
     */
    private buildComponentNode(pComponent: GameComponent, pParentElements: HierarchyNodeElements, pParentPath: string): void {
        const lPath: string = pParentPath + '/' + pComponent.constructor.name;
        const lElements: HierarchyNodeElements = this.createTreeNode(pComponent.constructor.name, 'component', 'C', pComponent.enabled, false, lPath);

        this.ensureChildContainer(pParentElements);
        pParentElements.childContainer!.appendChild(lElements.root);
        this.mComponentElements.set(pComponent, lElements.root);
    }

    /**
     * Buffer a state change event and schedule processing on the next animation frame.
     * Ignores update events since they don't affect the hierarchy.
     */
    private bufferStateChange(pEvent: GameEnvironmentStateChange): void {
        if (pEvent.type === 'update') {
            return;
        }

        this.mPendingChanges.push(pEvent);

        if (!this.mUpdateScheduled) {
            this.mUpdateScheduled = true;
            requestAnimationFrame(() => {
                this.processPendingChanges();
            });
        }
    }

    /**
     * Process all buffered state changes in a single pass.
     * By the time this runs, all component state changes within the same engine tick
     * have been queued, so entity enabled states are final and consistent.
     */
    private processPendingChanges(): void {
        this.mUpdateScheduled = false;

        const lChanges: Array<GameEnvironmentStateChange> = this.mPendingChanges;
        this.mPendingChanges = new Array<GameEnvironmentStateChange>();

        // Track entities that need an enabled-state refresh after all changes are processed.
        const lAffectedEntities: Set<GameEntity> = new Set<GameEntity>();

        for (const lChange of lChanges) {
            switch (lChange.type) {
                case 'add': {
                    this.handleComponentAdd(lChange.component);
                    break;
                }
                case 'remove': {
                    this.handleComponentRemove(lChange.component);
                    break;
                }
                case 'activate':
                case 'deactivate': {
                    // Update the component's own label.
                    this.updateComponentLabel(lChange.component);

                    // Defer the entity enabled-state check until all changes are processed.
                    lAffectedEntities.add(lChange.component.gameEntity);
                    break;
                }
            }
        }

        // Single pass over all affected entities to update their enabled state.
        // At this point all component activate/deactivate events have been processed,
        // so the entity's enabled property reflects the final state.
        for (const lEntity of lAffectedEntities) {
            const lEntityElements: HierarchyNodeElements | undefined = this.mNodeElements.get(lEntity);
            if (lEntityElements) {
                lEntityElements.label.className = lEntity.enabled ? 'tree-label' : 'tree-label disabled';
            }
        }
    }

    /**
     * Update a single component's label to reflect its current enabled state.
     */
    private updateComponentLabel(pComponent: GameComponent): void {
        const lComponentRoot: HTMLElement | undefined = this.mComponentElements.get(pComponent);
        if (lComponentRoot) {
            const lLabel: HTMLSpanElement = lComponentRoot.querySelector('.tree-label')!;
            lLabel.className = pComponent.enabled ? 'tree-label' : 'tree-label disabled';
        }
    }

    /**
     * Handle a component being added. Ensures the entity path exists in the DOM,
     * then adds the component node.
     */
    private handleComponentAdd(pComponent: GameComponent): void {
        // Skip if this component is already tracked.
        if (this.mComponentElements.has(pComponent)) {
            return;
        }

        const lEntity: GameEntity = pComponent.gameEntity;

        // Ensure the entity's entire ancestor chain exists in the DOM.
        this.ensureEntityInTree(lEntity);

        const lEntityElements: HierarchyNodeElements = this.mNodeElements.get(lEntity)!;
        const lEntityPath: string = this.buildNodePath(lEntity);

        // Add the component node.
        this.buildComponentNode(pComponent, lEntityElements, lEntityPath);
    }

    /**
     * Handle a component being removed. Removes its DOM node and cleans up
     * empty parent entity nodes.
     */
    private handleComponentRemove(pComponent: GameComponent): void {
        const lComponentRoot: HTMLElement | undefined = this.mComponentElements.get(pComponent);
        if (!lComponentRoot) {
            return;
        }

        // Remove from DOM.
        lComponentRoot.remove();
        this.mComponentElements.delete(pComponent);

        // Clean up empty entity nodes up the chain.
        const lEntity: GameEntity = pComponent.gameEntity;
        this.cleanupEmptyNode(lEntity);
    }

    /**
     * Ensure an entity and all its ancestors exist as DOM nodes in the tree.
     * Walks up the hierarchy from the entity to the scene, creating nodes as needed.
     */
    private ensureEntityInTree(pEntity: GameEntity): void {
        // If already in the DOM, nothing to do.
        if (this.mNodeElements.has(pEntity)) {
            return;
        }

        // Collect the ancestor chain from entity up to (but not including) the scene or an already-tracked node.
        const lChain: Array<GameNode> = new Array<GameNode>();
        let lCurrent: GameNode = pEntity;

        while (!this.mNodeElements.has(lCurrent)) {
            lChain.push(lCurrent);
            const lParent: GameNode | null = lCurrent.parent;

            if (!lParent) {
                // Reached a root node without a parent - this might be a scene.
                // Scenes should already be in the tree from initial build. If not, add it.
                if (lCurrent instanceof GameScene && !this.mNodeElements.has(lCurrent)) {
                    this.buildSceneNode(lCurrent);
                }
                break;
            }

            lCurrent = lParent;
        }

        // Walk back down the chain and create nodes.
        lChain.reverse();
        for (const lNode of lChain) {
            const lParent: GameNode | null = lNode.parent;
            if (!lParent) {
                continue;
            }

            const lParentElements: HierarchyNodeElements | undefined = this.mNodeElements.get(lParent);
            if (!lParentElements) {
                continue;
            }

            const lParentPath: string = this.buildNodePath(lParent);
            this.buildEntityNode(lNode, lParentElements, lParentPath);
        }
    }

    /**
     * Remove empty entity nodes from the DOM. After a component is removed,
     * the entity node might have no children left. If so, remove it and check its parent.
     */
    private cleanupEmptyNode(pNode: GameNode): void {
        // Don't clean up scenes.
        if (pNode instanceof GameScene) {
            return;
        }

        const lElements: HierarchyNodeElements | undefined = this.mNodeElements.get(pNode);
        if (!lElements) {
            return;
        }

        // Check if the node still has children in the DOM.
        if (lElements.childContainer && lElements.childContainer.childElementCount > 0) {
            return;
        }

        // No children left - remove this node from the DOM.
        lElements.root.remove();
        this.mNodeElements.delete(pNode);

        // Recurse to parent.
        const lParent: GameNode | null = pNode.parent;
        if (lParent) {
            this.cleanupEmptyNode(lParent);
        }
    }

    /**
     * Build the path string for a node by walking up the hierarchy.
     * Used for collapse state tracking.
     */
    private buildNodePath(pNode: GameNode): string {
        const lParts: Array<string> = new Array<string>();
        let lCurrent: GameNode | null = pNode;

        while (lCurrent) {
            lParts.push(lCurrent.label);
            lCurrent = lCurrent.parent;
        }

        lParts.reverse();
        return lParts.join('/');
    }

    /**
     * Ensure a node element has a child container. If the node was created as a leaf
     * (no children), this adds a child container and makes the toggle arrow visible.
     */
    private ensureChildContainer(pElements: HierarchyNodeElements): void {
        if (pElements.childContainer) {
            return;
        }

        // Create child container.
        const lChildren: HTMLDivElement = document.createElement('div');
        lChildren.className = 'tree-children';
        pElements.root.appendChild(lChildren);
        pElements.childContainer = lChildren;

        // Make toggle visible and functional.
        pElements.toggle.className = 'tree-toggle expanded';

        const lRow: HTMLElement = pElements.toggle.parentElement!;
        lRow.addEventListener('click', () => {
            const lCurrentlyExpanded: boolean = pElements.toggle.classList.contains('expanded');
            if (lCurrentlyExpanded) {
                pElements.toggle.classList.remove('expanded');
                lChildren.classList.add('collapsed');
                this.mCollapsedPaths.add(pElements.path);
            } else {
                pElements.toggle.classList.add('expanded');
                lChildren.classList.remove('collapsed');
                this.mCollapsedPaths.delete(pElements.path);
            }
        });
    }

    /**
     * Create a tree node DOM element and return the tracked element references.
     */
    private createTreeNode(pLabel: string, pIconClass: string, pIconLetter: string, pEnabled: boolean, pHasChildren: boolean, pPath: string): HierarchyNodeElements {
        const lNode: HTMLDivElement = document.createElement('div');
        lNode.className = 'tree-node';

        // Row.
        const lRow: HTMLDivElement = document.createElement('div');
        lRow.className = 'tree-node-row';

        // Determine if this node should be collapsed based on persisted state.
        const lIsCollapsed: boolean = pHasChildren && this.mCollapsedPaths.has(pPath);

        // Toggle arrow.
        const lToggle: HTMLSpanElement = document.createElement('span');
        if (pHasChildren) {
            lToggle.className = lIsCollapsed ? 'tree-toggle' : 'tree-toggle expanded';
        } else {
            lToggle.className = 'tree-toggle leaf';
        }
        lToggle.textContent = '\u25B6'; // right-pointing triangle
        lRow.appendChild(lToggle);

        // Icon.
        const lIcon: HTMLSpanElement = document.createElement('span');
        lIcon.className = `tree-icon ${pIconClass}`;
        lIcon.textContent = pIconLetter;
        lRow.appendChild(lIcon);

        // Label.
        const lLabel: HTMLSpanElement = document.createElement('span');
        lLabel.className = pEnabled ? 'tree-label' : 'tree-label disabled';
        lLabel.textContent = pLabel;
        lRow.appendChild(lLabel);

        lNode.appendChild(lRow);

        // Children container (only if it has children).
        let lChildContainer: HTMLDivElement | null = null;
        if (pHasChildren) {
            lChildContainer = document.createElement('div');
            lChildContainer.className = lIsCollapsed ? 'tree-children collapsed' : 'tree-children';
            lNode.appendChild(lChildContainer);

            // Toggle collapse on click and persist to set.
            lRow.addEventListener('click', () => {
                const lCurrentlyExpanded: boolean = lToggle.classList.contains('expanded');
                if (lCurrentlyExpanded) {
                    lToggle.classList.remove('expanded');
                    lChildContainer!.classList.add('collapsed');
                    this.mCollapsedPaths.add(pPath);
                } else {
                    lToggle.classList.add('expanded');
                    lChildContainer!.classList.remove('collapsed');
                    this.mCollapsedPaths.delete(pPath);
                }
            });
        }

        return {
            root: lNode,
            toggle: lToggle,
            label: lLabel,
            childContainer: lChildContainer,
            path: pPath
        };
    }
}

/**
 * Tracked DOM elements for a single tree node (scene or entity).
 */
type HierarchyNodeElements = {
    root: HTMLDivElement;
    toggle: HTMLSpanElement;
    label: HTMLSpanElement;
    childContainer: HTMLDivElement | null;
    path: string;
};
