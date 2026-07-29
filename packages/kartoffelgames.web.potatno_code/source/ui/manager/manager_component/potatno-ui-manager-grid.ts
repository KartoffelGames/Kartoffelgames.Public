import { PotatnoCodeUiManagerChangeType, PotatnoUiManager } from "../potatno-ui-manager.ts";

/**
 * Ui manager grid component.
 * Owns grid sizing and panning.
 */
export class PotatnoUiManagerGrid {
    private static readonly GRID_SIZE: number = 25;
    private static readonly MAX_ZOOM: number = 2.0;
    private static readonly MIN_ZOOM: number = 0.1;

    private readonly mManager: PotatnoUiManager;
    private mPanX: number;
    private mPanY: number;
    private mZoom: number;

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