import { Exception } from '@kartoffelgames/core';
import type { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import type { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import { PotatnoCodeUiManagerChangeType, type PotatnoUiManager } from '../potatno-ui-manager.ts';

/**
 * Ui manager grid component.
 * Owns grid sizing and panning.
 */
export class PotatnoUiManagerGrid {
    private static readonly GRID_SIZE_REM: number = 2;
    private static readonly MAX_ZOOM: number = 5.0;
    private static readonly MIN_ZOOM: number = 0.1;

    private mDraggedPortInformation: PotatnoUiManagerGridDraggedPort;
    private mGridElement: Element | null;
    private readonly mGridPositions: WeakMap<PotatnoDocumentFunction<PotatnoProjectTypesDefinition>, PotatnoUiManagerGridTransformation>;
    private readonly mGridSize: number;
    private readonly mManager: PotatnoUiManager;
    private readonly mSelectedNodes: Set<PotatnoDocumentNode<PotatnoProjectTypesDefinition>>;
    private mTransformation: PotatnoUiManagerGridTransformation;

    /**
     * Currently dragged port.
     */
    public get draggedPort(): PotatnoUiManagerGridDraggedPort {
        return this.mDraggedPortInformation;
    }

    /**
     * Set only grid element.
     * Used to position by pixel space.
     */
    public set gridElement(pGridElement: Element) {
        this.mGridElement = pGridElement;
    }

    /**
     * Grid size in pixels.
     */
    public get gridSize(): number {
        return this.mGridSize;
    }

    /**
     * Horizontal pan offset in pixels.
     */
    public get panX(): number {
        return this.mTransformation.panX;
    }

    /**
     * Vertical pan offset in pixels.
     */
    public get panY(): number {
        return this.mTransformation.panY;
    }

    /**
     * Current selected nodes.
     */
    public get selectedNodes(): ReadonlySet<PotatnoDocumentNode<PotatnoProjectTypesDefinition>> {
        return this.mSelectedNodes;
    }

    /**
     * Current zoom level.
     */
    public get zoom(): number {
        return this.mTransformation.zoom;
    }

    /**
     * Constructor.
     *
     * @param pGridSize - Grid size in pixels.
     */
    public constructor(pManager: PotatnoUiManager) {
        this.mManager = pManager;

        this.mGridElement = null;
        this.mDraggedPortInformation = new PotatnoUiManagerGridDraggedPort(this.mManager, []);
        this.mGridPositions = new WeakMap<PotatnoDocumentFunction<PotatnoProjectTypesDefinition>, PotatnoUiManagerGridTransformation>();
        this.mSelectedNodes = new Set<PotatnoDocumentNode<PotatnoProjectTypesDefinition>>();

        // Set default position. Wont be used anyway just like anything i made.
        this.mTransformation = {
            panX: 0,
            panY: 0,
            zoom: 1.0
        };

        // Calculate pixel size from grid rem size.
        this.mGridSize = parseInt(getComputedStyle(document.documentElement).fontSize) * PotatnoUiManagerGrid.GRID_SIZE_REM;

        this.mManager.subscribe(PotatnoCodeUiManagerChangeType.SpecialActiveFunction, () => {
            // Init default positions for a new active function if it has not already.
            if (!this.mGridPositions.has(this.mManager.activeFunction)) {
                this.mGridPositions.set(this.mManager.activeFunction, {
                    panX: 0,
                    panY: 0,
                    zoom: 1.0
                });
            }

            // Load the current grid positions.
            this.mTransformation = this.mGridPositions.get(this.mManager.activeFunction)!;

            // Find any selected node that is not on active function.
            const lInvalidSelections = Array.from(this.mSelectedNodes).filter((pSelectedNode) => {
                return pSelectedNode.function !== this.mManager.activeFunction;
            });

            // Remove any selected node that is not on active function.
            for (const lInvalidSelectedNode of lInvalidSelections) {
                this.mSelectedNodes.delete(lInvalidSelectedNode);
            }
        });
    }

    /**
     * Convert grid pixel space into grid space.
     * 
     * @param pPixel - Grid pixel coordinate.
     * 
     * @returns converted pixel to grid space. 
     */
    public gridPixelSpaceToGridSpace(pPixel: PotatnoUiManagerGridPixelCoordinate, pSnap: boolean): PotatnoUiManagerGridCoordinate {
        // Into grid space by deviding by grid size. Easy.
        let lX: number = pPixel.x / this.gridSize;
        let lY: number = pPixel.y / this.gridSize;

        // Optional round of position.
        if (pSnap) {
            lX = Math.floor(lX);
            lY = Math.floor(lY);
        }

        return {
            x: lX,
            y: lY
        };
    }

    /**
     * Update pan offset by the given deltas.
     *
     * @param pDeltaX - Horizontal delta in screen pixels.
     * @param pDeltaY - Vertical delta in screen pixels.
     */
    public pan(pDeltaX: number, pDeltaY: number): void {
        this.mTransformation.panX += pDeltaX;
        this.mTransformation.panY += pDeltaY;

        // Dispatch grid change.
        this.mManager.dispatch(PotatnoCodeUiManagerChangeType.SpecialGrid, null);
    }

    /**
     * Convert pixel coordinates to grid pixel space.
     *
     * @param pX - Global pixel x coordinate.
     * @param pY - Global pixel y coordinate.
     *
     * @returns Grid point.
     */
    public pixelToGridPixelSpace(pX: number, pY: number): PotatnoUiManagerGridPixelCoordinate {
        let lPointX: number = pX;
        let lPointY: number = pY;

        // Move the pixel point related to the grid element.
        if (this.mGridElement) {
            const lGridPosition: DOMRect = this.mGridElement.getBoundingClientRect();
            lPointX -= lGridPosition.left;
            lPointY -= lGridPosition.top;
        }

        // Move by panning then zooming.
        return {
            x: (lPointX - this.mTransformation.panX) / this.mTransformation.zoom,
            y: (lPointY - this.mTransformation.panY) / this.mTransformation.zoom
        };
    }

    /**
     * Convert pixel coordinates to grid space.
     *
     * @param pX - Global pixel x coordinate.
     * @param pY - Global pixel y coordinate.
     *
     * @returns Grid point.
     */
    public pixelToGridSpace(pX: number, pY: number): PotatnoUiManagerGridCoordinate {
        return this.gridPixelSpaceToGridSpace(this.pixelToGridPixelSpace(pX, pY), true);
    }

    /**
     * Select nodes and optionaly bring them into view center.
     * 
     * @param pNodes - Nodes that should be selected.
     * @param pFocus - Focus selected nodes.
     */
    public selectNodes(pNodes: Array<PotatnoDocumentNode<PotatnoProjectTypesDefinition>>, pFocus: boolean = false): void {
        // Clear current selected...
        this.mSelectedNodes.clear();

        // Skip actual selecting when there is nothing to select.
        if (pNodes.length === 0) {
            this.mManager.dispatch(PotatnoCodeUiManagerChangeType.SpecialSelectNode, null);
            return;
        }

        // Save common function of selected nodes.
        let lNodeFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> | null = null;

        // Set new nodes.
        for (const lSelectedNode of pNodes) {
            // Store first encountered 
            if (lNodeFunction === null) {
                lNodeFunction = lSelectedNode.function;
            }

            if (lNodeFunction !== lSelectedNode.function) {
                throw new Exception('Selected nodes must be of the same function', this);
            }

            this.mSelectedNodes.add(lSelectedNode);
        }

        // Switch ative function if nodes function is not selected.
        if (this.mManager.activeFunction !== lNodeFunction) {
            this.mManager.setActiveFunction(lNodeFunction!);
        }

        // Bring the current nodes into focus/view.
        if (pFocus) {
            // Calculate the bounding box of all selected nodes.
            const lSelectionBoundingBox = { top: Infinity, right: -Infinity, bottom: -Infinity, left: Infinity };
            for (const lNode of pNodes) {
                // Top.
                const lTop: number = lNode.transformation.y;
                if (lTop < lSelectionBoundingBox.top) {
                    lSelectionBoundingBox.top = lTop;
                }

                // Top.
                const lRight: number = lNode.transformation.x + lNode.transformation.width;
                if (lRight > lSelectionBoundingBox.right) {
                    lSelectionBoundingBox.right = lRight;
                }

                // Bottom.
                const lBottom: number = lNode.transformation.y + lNode.transformation.height;
                if (lBottom > lSelectionBoundingBox.bottom) {
                    lSelectionBoundingBox.bottom = lBottom;
                }

                // Left.
                const lLeft: number = lNode.transformation.x;
                if (lLeft < lSelectionBoundingBox.left) {
                    lSelectionBoundingBox.left = lLeft;
                }
            }

            // Init default positions for a new active function if it has not already.
            if (!this.mGridPositions.has(lNodeFunction!)) {
                this.mGridPositions.set(lNodeFunction!, {
                    panX: 0,
                    panY: 0,
                    zoom: 1.0
                });
            }

            // Get the transformation of nodes function.
            const lGridTransformation: PotatnoUiManagerGridTransformation = this.mGridPositions.get(lNodeFunction!)!;

            // Get the current grid dimension.
            const lGridDimension = this.mGridElement?.getBoundingClientRect();
            if (!lGridDimension) {
                return;
            }

            // Pan selection bounding box into center
            lGridTransformation.panX = lGridDimension.width / 2;
            lGridTransformation.panX -= (lSelectionBoundingBox.left + ((lSelectionBoundingBox.right - lSelectionBoundingBox.left) / 2)) * this.gridSize * lGridTransformation.zoom;

            lGridTransformation.panY = lGridDimension.height / 2;
            lGridTransformation.panY -= (lSelectionBoundingBox.top + ((lSelectionBoundingBox.bottom - lSelectionBoundingBox.top) / 2)) * this.gridSize * lGridTransformation.zoom;
        }

        // Dispatch event after selecting nodes.
        this.mManager.dispatch(PotatnoCodeUiManagerChangeType.SpecialSelectNode, null);
    }

    /**
     * Set a new dragged port or null if nothing is dragged.
     * 
     * @param pPort - Dragged port.
     */
    public setDraggingPort(pPorts: Array<PotatnoDocumentPort<PotatnoProjectTypesDefinition>>): void {
        this.mDraggedPortInformation = new PotatnoUiManagerGridDraggedPort(this.mManager, pPorts);
    }

    /**
     * Zoom toward or away from a specific screen position.
     * The zoom is clamped between MIN_ZOOM and MAX_ZOOM.
     * The pan is adjusted so that the point under the mouse stays fixed.
     *
     * @param pScreenX - X position of the zoom focus in screen pixels.
     * @param pScreenY - Y position of the zoom focus in screen pixels.
     * @param pDelta - Zoom delta. Negative values zoom in, positive zoom out.
     */
    public zoomAt(pScreenX: number, pScreenY: number, pDelta: number): void {
        const lOldZoom: number = this.mTransformation.zoom;

        // Compute the zoom factor from the scroll delta.
        const lZoomFactor: number = 1 + pDelta;
        let lNewZoom: number = this.mTransformation.zoom * lZoomFactor;

        // Clamp to allowed range.
        lNewZoom = Math.max(PotatnoUiManagerGrid.MIN_ZOOM, Math.min(PotatnoUiManagerGrid.MAX_ZOOM, lNewZoom));

        // Compute the world point under the mouse before zoom.
        const lWorldX: number = (pScreenX - this.mTransformation.panX) / lOldZoom;
        const lWorldY: number = (pScreenY - this.mTransformation.panY) / lOldZoom;

        // Update zoom.
        this.mTransformation.zoom = lNewZoom;

        // Adjust pan so that the world point remains under the same screen position.
        this.mTransformation.panX = pScreenX - lWorldX * this.mTransformation.zoom;
        this.mTransformation.panY = pScreenY - lWorldY * this.mTransformation.zoom;

        // Dispatch grid change.
        this.mManager.dispatch(PotatnoCodeUiManagerChangeType.SpecialGrid, null);
    }
}

/**
 * Dragged port register for a grid port dragging action.
 */
export class PotatnoUiManagerGridDraggedPort {
    private readonly mManager: PotatnoUiManager;
    private readonly mPointerGridPosition: PotatnoUiManagerGridCoordinate;
    private readonly mPortPositions: Map<PotatnoDocumentPort<PotatnoProjectTypesDefinition>, PotatnoUiManagerGridCoordinate>;
    private readonly mPorts: Set<PotatnoDocumentPort<PotatnoProjectTypesDefinition>>;

    /**
     * Get if any port is currently dragged.
     */
    public get isDragging(): boolean {
        return this.mPorts.size > 0;
    }

    /**
     * Port positions of dragged ports.
     */
    public get portPositions(): ReadonlyMap<PotatnoDocumentPort<PotatnoProjectTypesDefinition>, PotatnoUiManagerGridCoordinate> {
        return this.mPortPositions;
    }

    /**
     * Get current dragged port.
     * If no port is dragged, this property throws.
     */
    public get ports(): Array<PotatnoDocumentPort<PotatnoProjectTypesDefinition>> {
        return [...this.mPorts];
    }

    /**
     * Constructor.
     * 
     * @param pManager - Instanced ui manager.
     * @param pPorts - Dragged ports. Empty if nothing is dragged.
     * @param pPortPosition - Port position in grid space.
     */
    public constructor(pManager: PotatnoUiManager, pPorts: Array<PotatnoDocumentPort<PotatnoProjectTypesDefinition>>) {
        this.mManager = pManager;
        this.mPorts = new Set(pPorts);
        this.mPointerGridPosition = { x: Infinity, y: Infinity };

        // Set default position and override with actual if set.
        this.mPortPositions = new Map<PotatnoDocumentPort<PotatnoProjectTypesDefinition>, PotatnoUiManagerGridCoordinate>();
        for (const lPort of pPorts) {
            // Get port position of dragged port.
            const lPortPosition = this.mManager.connections.getPortGridPoint(lPort);

            // Adjust port position by offsetting one cell to the right for output ports.
            // Thats because the svg is left aligned in the input port.
            if (lPort.direction === 'output') {
                lPortPosition.x += 1;
            }

            this.mPortPositions.set(lPort, {
                x: lPortPosition.x,
                y: lPortPosition.y
            });
        }
    }

    /**
     * If current dragging contains node.
     * 
     * @param pPort - Port.
     *  
     * @returns true if port is currently dragged. 
     */
    public hasPort(pPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | null): boolean {
        if (!pPort) {
            return false;
        }

        return this.mPorts.has(pPort);
    }

    /**
     * Update grid position based on pointer.
     * Returns true if pointerposition in grid has changed.
     * 
     * @param pClientX - Global mouse position X. 
     * @param pClientY - Global mouse position Y.
     * 
     * @returns Returns true if pointerposition in grid has changed otherwise false.
     */
    public updatePointer(pClientX: number, pClientY: number): boolean {
        const lPointerPosition: PotatnoUiManagerGridCoordinate = this.mManager.grid.pixelToGridSpace(pClientX, pClientY);
        if (lPointerPosition.x === this.mPointerGridPosition.x && lPointerPosition.y === this.mPointerGridPosition.y) {
            return false;
        }

        // Update pointer position.
        this.mPointerGridPosition.x = lPointerPosition.x;
        this.mPointerGridPosition.y = lPointerPosition.y;

        return true;
    }
}

type PotatnoUiManagerGridTransformation = {
    panX: number;
    panY: number;
    zoom: number;
};

export type PotatnoUiManagerGridCoordinate = {
    x: number;
    y: number;
};

export type PotatnoUiManagerGridPixelCoordinate = {
    x: number;
    y: number;
};