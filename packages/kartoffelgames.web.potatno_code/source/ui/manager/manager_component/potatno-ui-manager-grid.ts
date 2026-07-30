import { PotatnoDocumentPort } from "../../../document/potatno-document-port.ts";
import { PotatnoProjectTypesDefinition } from "../../../project/potatno-project-types-definition.ts";
import { PotatnoUiManagerGridPathFindingPoint } from "../helper/potatno-ui-grid-path-finding.ts";
import { PotatnoCodeUiManagerChangeType, type PotatnoUiManager } from '../potatno-ui-manager.ts';

/**
 * Ui manager grid component.
 * Owns grid sizing and panning.
 */
export class PotatnoUiManagerGrid {
    private static readonly GRID_SIZE: number = 25;
    private static readonly MAX_ZOOM: number = 2.0;
    private static readonly MIN_ZOOM: number = 0.1;

    private mDraggedPortInformation: PotatnoUiManagerGridDraggedPort;
    private readonly mManager: PotatnoUiManager;
    private mPanX: number;
    private mPanY: number;
    private mZoom: number;

    /**
     * Currently dragged port.
     */
    public get draggedPort(): PotatnoUiManagerGridDraggedPort {
        return this.mDraggedPortInformation;
    }

    /**
     * Grid size in pixels.
     */
    public get gridSize(): number {
        return PotatnoUiManagerGrid.GRID_SIZE;
    }

    /**
     * Horizontal pan offset in pixels.
     */
    public get panX(): number {
        return this.mPanX;
    }

    /**
     * Vertical pan offset in pixels.
     */
    public get panY(): number {
        return this.mPanY;
    }

    /**
     * Current zoom level.
     */
    public get zoom(): number {
        return this.mZoom;
    }

    /**
     * Constructor.
     *
     * @param pGridSize - Grid size in pixels.
     */
    public constructor(pManager: PotatnoUiManager) {
        this.mManager = pManager;

        this.mPanX = 0;
        this.mPanY = 0;
        this.mZoom = 1.0;
        this.mDraggedPortInformation = new PotatnoUiManagerGridDraggedPort(this.mManager, new Array());
    }

    /**
     * Update pan offset by the given deltas.
     *
     * @param pDeltaX - Horizontal delta in screen pixels.
     * @param pDeltaY - Vertical delta in screen pixels.
     */
    public pan(pDeltaX: number, pDeltaY: number): void {
        this.mPanX += pDeltaX;
        this.mPanY += pDeltaY;

        // Dispatch grid change.
        this.mManager.dispatch(PotatnoCodeUiManagerChangeType.SpecialGrid, null);
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
        const lOldZoom: number = this.mZoom;

        // Compute the zoom factor from the scroll delta.
        const lZoomFactor: number = 1 + pDelta;
        let lNewZoom: number = this.mZoom * lZoomFactor;

        // Clamp to allowed range.
        lNewZoom = Math.max(PotatnoUiManagerGrid.MIN_ZOOM, Math.min(PotatnoUiManagerGrid.MAX_ZOOM, lNewZoom));

        // Compute the world point under the mouse before zoom.
        const lWorldX: number = (pScreenX - this.mPanX) / lOldZoom;
        const lWorldY: number = (pScreenY - this.mPanY) / lOldZoom;

        // Update zoom.
        this.mZoom = lNewZoom;

        // Adjust pan so that the world point remains under the same screen position.
        this.mPanX = pScreenX - lWorldX * this.mZoom;
        this.mPanY = pScreenY - lWorldY * this.mZoom;

        // Dispatch grid change.
        this.mManager.dispatch(PotatnoCodeUiManagerChangeType.SpecialGrid, null);
    }
}

/**
 * Dragged port register for a grid port dragging action.
 */
export class PotatnoUiManagerGridDraggedPort {
    private readonly mManager: PotatnoUiManager;
    private readonly mPorts: Set<PotatnoDocumentPort<PotatnoProjectTypesDefinition>>;
    private readonly mPortPositions: Map<PotatnoDocumentPort<PotatnoProjectTypesDefinition>, PotatnoUiManagerGridPathFindingPoint>;
    private readonly mPointerGridPosition: PotatnoUiManagerGridPathFindingPoint;

    /**
     * Get current dragged port.
     * If no port is dragged, this property throws.
     */
    public get ports(): Array<PotatnoDocumentPort<PotatnoProjectTypesDefinition>> {
        return [...this.mPorts];
    }

    /**
     * Get if any port is currently dragged.
     */
    public get isDragging(): boolean {
        return this.mPorts.size > 0;
    }

    /**
     * Port positions of dragged ports.
     */
    public get portPositions(): ReadonlyMap<PotatnoDocumentPort<PotatnoProjectTypesDefinition>, PotatnoUiManagerGridPathFindingPoint> {
        return this.mPortPositions;
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
        this.mPortPositions = new Map<PotatnoDocumentPort<PotatnoProjectTypesDefinition>, PotatnoUiManagerGridPathFindingPoint>();
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
        if(!pPort) {
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
        const lPointerPosition: PotatnoUiManagerGridPathFindingPoint = this.mManager.connections.pixelToGridSpace(pClientX, pClientY);
        if (lPointerPosition.x === this.mPointerGridPosition.x && lPointerPosition.y === this.mPointerGridPosition.y) {
            return false;
        }

        // Update pointer position.
        this.mPointerGridPosition.x = lPointerPosition.x;
        this.mPointerGridPosition.y = lPointerPosition.y;

        return true;
    }
}