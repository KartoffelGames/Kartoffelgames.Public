import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Component, ComponentEventEmitter, ComponentState, IComponentOnConnect, IComponentOnUpdate, PwbChild, PwbComponent, PwbComponentEvent, PwbExport, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager, type PotatnoCodeUiManagerUnsubscribe } from '../../manager/potatno-ui-manager.ts';
import { PotatnoResizeBoxComponent, PotatnoResizeBoxComponentResizeDirection, type PotatnoResizeBoxComponentResize } from '../potatno-resize-box/potatno-resize-box-component.ts';
import nodeCss from './potatno-comment-node-component.css' with { type: 'text' };
import nodeTemplate from './potatno-comment-node-component.html' with { type: 'text' };

/**
 * Comment node component for the potatno-code visual editor.
 * Handles resize and position on its own.
 */
@PwbComponent({
    selector: 'potatno-comment-node',
    template: nodeTemplate,
    style: nodeCss,
    components: [PotatnoResizeBoxComponent]
})
export class PotatnoCommentNodeComponent implements IComponentOnDeconstruct, IComponentOnConnect, IComponentOnUpdate {
    private readonly mComponent: Component;
    private readonly mManager: PotatnoUiManager;
    private readonly mUnsubscribe: PotatnoCodeUiManagerUnsubscribe;
    private readonly mUnsubscribeGrid: PotatnoCodeUiManagerUnsubscribe;
    private mNodeData: PotatnoDocumentNode<PotatnoProjectTypesDefinition> | null;
    private mDoubleClickState: PotatnoCommentNodeComponentDoubleClickState | null;

    /**
     * If comment text is in edit mode.
     */
    @ComponentState.state()
    public accessor editMode: Boolean;

    /**
     * If comment is viewed from far away.
     */
    @ComponentState.state()
    public accessor enableBigview: Boolean;

    /**
     * The domain node object to render.
     */
    @PwbExport
    public get nodeData(): PotatnoDocumentNode<PotatnoProjectTypesDefinition> | null {
        return this.mNodeData;
    } set nodeData(pNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition> | null) {
        // Set node data and reset node definition.
        this.mNodeData = pNode;

        // For syncing, a node must be specified.
        if (!pNode) {
            return;
        }

        // Resync nodes transformation on change.
        this.resyncComponent(pNode);

        // Syncron update to reduce popping.
        this.mComponent.updater.update();
    }

    /**
     * Emitted with the definition the user picked, for the host to insert.
     */
    @PwbComponentEvent('node-drag')
    private accessor mDrag!: ComponentEventEmitter<PotatnoNodeComponentMove>;

    /**
     * The actual resizeable element.
     */
    @PwbChild('ResizeBox')
    private accessor resizeBox!: PotatnoResizeBoxComponent & Element | null;

    /**
     * Node display label.
     */
    public get comment(): string {
        return this.nodeData?.label ?? '';
    } set comment(pComment: string) {
        // Skip update.
        if (!this.nodeData) {
            return;
        }

        this.nodeData.label = pComment;
    }

    /**
     * The comment input.
     */
    @PwbChild('CommentInput')
    public accessor commentInput!: HTMLInputElement | null;

    /**
     * Current zoom of grid.
     */
    @ComponentState.state()
    public accessor gridZoom: number;

    /**
     * Create the node component.
     *
     * @param pComponent - Injected component reference, used to trigger self-updates.
     * @param pManager - Injected shared UI manager singleton.
     */
    public constructor(pComponent: Component = Injection.use(Component), pManager: PotatnoUiManager = Injection.use(PotatnoUiManager)) {
        this.mComponent = pComponent;
        this.mManager = pManager;
        this.mNodeData = null;
        this.mDoubleClickState = null;
        this.editMode = false;
        this.enableBigview = false;
        this.gridZoom = 0;

        // Resinitialize zoom level.
        this.updateForZoomLevel();

        // Enable big view of comment when viewed from far away.
        this.mUnsubscribeGrid = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.SpecialGrid, () => {
            this.updateForZoomLevel();
        });

        this.mUnsubscribe = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.Node, (pItem) => {
            // Only trigger a transformation if its affects the current node data.
            if (pItem.item !== this.nodeData) {
                return;
            }

            // Calculate the current size of the component.
            this.resyncComponent(this.nodeData!);
        });
    }

    /**
     * Resync component once the component is connected.
     */
    public onConnect(): void {
        if (!this.nodeData) {
            return;
        }

        this.resyncComponent(this.nodeData);
    }

    /**
     * Detach the manager subscription.
     */
    public onDeconstruct(): void {
        this.mUnsubscribe();
        this.mUnsubscribeGrid();
    }


    /**
     * Focus input element and select all text on an update, when its not already focused.
     */
    public onUpdate(): void {
        // Skip if not rendered.
        if (!this.commentInput) {
            return;
        }

        // Skip if its already focused.
        if (this.getFocusedElement(document) === this.commentInput) {
            return;
        }

        this.commentInput.select();
    }

    /**
     * Deep find the actual selected element inside layers of shadow roots.
     * 
     * @param root - Root document or shadow root.
     * 
     * @returns the focused element or null if no element is focused. 
     */
    private getFocusedElement(root: Document | ShadowRoot): Element | null {
        // Check root for active.
        const rootsActiveElement: Element | null = root.activeElement;
        if (!rootsActiveElement) {
            return null;
        }

        // Not a host element. So it is the actual focused.
        if (!rootsActiveElement.shadowRoot) {
            return rootsActiveElement;
        }

        // Recursive call into the host elements shadow root.
        return this.getFocusedElement(rootsActiveElement.shadowRoot);
    }

    /**
     * Handle pointer down on the resize corners handle.
     *
     * @param pEvent - Pointer event from the resize handle.
     */
    public dragNodeOrEnableEdit(pEvent: PointerEvent): void {
        // Cant transform without node data.
        if (!this.nodeData) {
            return;
        }

        // Start a timer when its not already started.
        if (!this.mDoubleClickState) {
            // The timer does reset the itself set double click state.
            this.mDoubleClickState = {
                timer: globalThis.setTimeout(() => {
                    this.mDoubleClickState = null;
                }, 300)
            };
        } else {
            // Enable edit mode when a double click state was set.
            this.editMode = true;
        }

        // Prevent dragging on edit mode.
        if (this.editMode) {
            return;
        }

        pEvent.preventDefault();

        // Save current coordinate so the current pointer position determinates exactly this coordinate.
        const lStartingCoordinateX: number = this.nodeData.transformation.x * this.mManager.grid.gridSize;
        const lStartingCoordinateY: number = this.nodeData.transformation.y * this.mManager.grid.gridSize;

        let lCurrentX: number = this.nodeData.transformation.x;
        let lCurrentY: number = this.nodeData.transformation.y;

        // Scale of any transformed parent: ratio of rendered (actual size) to layout (unscaled) size.
        const lComponentSize: DOMRect = this.mComponent.element.getBoundingClientRect();
        const lScaleX: number = this.mComponent.element.offsetWidth ? lComponentSize.width / this.mComponent.element.offsetWidth : 1;
        const lScaleY: number = this.mComponent.element.offsetHeight ? lComponentSize.height / this.mComponent.element.offsetHeight : 1;

        // Save the starting pointer coordinates to only transform the actual movement.
        const lStartX = pEvent.clientX;
        const lStartY = pEvent.clientY;

        // Drag magic listener (●'◡'●)つ━☆・*。
        const lPointerMoveListener = (pMoveEvent: PointerEvent): void => {
            pMoveEvent.stopPropagation();

            // Divide by scale to convert mouse movement into scale actual drag.
            const lMovementChangeX: number = (pMoveEvent.clientX - lStartX) / lScaleX;
            const lMovementChangeY: number = (pMoveEvent.clientY - lStartY) / lScaleY;

            // Calculate position inside grid. Round to keep movement in "center".
            const lX: number = Math.round((lStartingCoordinateX + lMovementChangeX) / this.mManager.grid.gridSize);
            const lY: number = Math.round((lStartingCoordinateY + lMovementChangeY) / this.mManager.grid.gridSize);

            // Skip any movement when nothing has changed.
            if (lCurrentX === lX && lCurrentY === lY) {
                return;
            }

            // And then update node position.
            this.mManager.graph.transformNode(this.nodeData, (pNode) => {
                pNode.moveTo(lX, lY);
            });

            // Dispatch drag event.
            this.mDrag.dispatchEvent(new PotatnoNodeComponentMove(lX - lCurrentX, lY - lCurrentY));

            // Save new current position.
            lCurrentX = lX;
            lCurrentY = lY;
        };

        // Pointer up listener, cleaning up temporary listener.
        const lPointerUpListener = (): void => {
            // Remove temporary mouse move listener.
            document.removeEventListener('pointermove', lPointerMoveListener);
            document.removeEventListener('pointerup', lPointerUpListener);
        };

        // Add temporary mouse move listener.
        document.addEventListener('pointermove', lPointerMoveListener);
        document.addEventListener('pointerup', lPointerUpListener);
    }

    /**
     * Escape edit mode on esc button press.
     * 
     * @param pEvent - Keyboard event.
     */
    public escapeEditMode(pEvent: KeyboardEvent): void {
        // Close edit mode when escape is pressed.
        if (pEvent.key === "Escape" || pEvent.key === "Enter") {
            pEvent.preventDefault();
            this.editMode = false;
        }
    }

    /**
     * Resize the node data to the set resize data.
     * The node resize restriction applies.
     * 
     * @param pResize - Resize data.
     */
    public transformNodeData(pResize: PotatnoResizeBoxComponentResize): void {
        this.mManager.graph.transformNode(this.nodeData, (pNode) => {
            // Save size before resizing.
            const lLastWidth: number = pNode.transformation.width;
            const lLastheight: number = pNode.transformation.height;

            // Resize size.
            pNode.resizeTo(pResize.width / this.mManager.grid.gridSize, pResize.height / this.mManager.grid.gridSize);

            // Calculate size change.
            const lWidthChange: number = pNode.transformation.width - lLastWidth;
            const lHeightChange: number = pNode.transformation.height - lLastheight;

            // Move the coordinate in the right direction based on the used handle.
            if (lHeightChange !== 0 && (pResize.resizeHandle & PotatnoResizeBoxComponentResizeDirection.top) > 0) {
                // Move y coordinate up the moved height amount.
                pNode.moveTo(pNode.transformation.x, pNode.transformation.y - lHeightChange);
            }
            if (lWidthChange !== 0 && (pResize.resizeHandle & PotatnoResizeBoxComponentResizeDirection.left) > 0) {
                // Move y coordinate up the moved height amount.
                pNode.moveTo(pNode.transformation.x - lWidthChange, pNode.transformation.y);
            }
        });
    }

    /**
     * Update the actual component size and position and read all available preview ports.
     * 
     * @param pNode - Node data. 
     */
    private resyncComponent(pNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition>): void {
        // Set the node position on the actual component.
        const lNodeX: number = pNode.transformation.x * this.mManager.grid.gridSize;
        const lNodeY: number = pNode.transformation.y * this.mManager.grid.gridSize;
        this.mComponent.element.style.setProperty('left', `${lNodeX}px`);
        this.mComponent.element.style.setProperty('top', `${lNodeY}px`);

        // Calculate and update node size.
        if (this.resizeBox) {
            const lNodeWidth: number = pNode.transformation.width * this.mManager.grid.gridSize;
            const lNodeHeight: number = pNode.transformation.height * this.mManager.grid.gridSize;
            this.resizeBox.resize(lNodeWidth, lNodeHeight);
        }

        this.mComponent.updater.updateAsync();
    }

    private updateForZoomLevel(): void {
        // Enable satellite view on higher zoom level.
        this.enableBigview = this.mManager.grid.zoom < 0.25;

        // Only update zoom level when the satellite view is enabled
        if (this.enableBigview) {
            this.gridZoom = this.mManager.grid.zoom;
        }

        this.mComponent.element.style.setProperty('z-index', (this.enableBigview ? 9999 : -1).toString());
    }
}


/**
 * Event data of dragged distance.
 */
export class PotatnoNodeComponentMove {
    private readonly mX: number;
    private readonly mY: number;

    /**
     * Moved x distance.
     */
    public get x(): number {
        return this.mX;
    }


    /**
     * Moved y distance.
     */
    public get y(): number {
        return this.mY;
    }

    /**
     * Constructor.
     * 
     * @param pX - Moved x distance.
     * @param pY - Moved y distance.
     */
    public constructor(pX: number, pY: number) {
        this.mX = pX;
        this.mY = pY;
    }
}

type PotatnoCommentNodeComponentDoubleClickState = {
    timer: number;
};