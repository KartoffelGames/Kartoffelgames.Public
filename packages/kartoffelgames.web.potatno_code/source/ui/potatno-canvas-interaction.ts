/**
 * Pure logic class that manages viewport transform state, coordinate conversion,
 * grid snapping, and selection box tracking for the canvas.
 */
export class PotatnoCanvasInteraction {
    private static readonly MAX_ZOOM: number = 2.0;
    private static readonly MIN_ZOOM: number = 0.25;

    private mPanX: number;
    private mPanY: number;
    private readonly mGridSize: number;
    private mZoom: number;


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
    public constructor(pGridSize: number) {
        this.mGridSize = pGridSize;
        this.mPanX = 0;
        this.mPanY = 0;
        this.mZoom = 1.0;
    }

    /**
     * Get a CSS background style string that renders the grid pattern.
     * The grid accounts for the current pan and zoom values.
     *
     * @returns CSS background property value for the grid pattern.
     */
    public getGridBackgroundCss(): string {
        const lScaledGrid: number = this.mGridSize * this.mZoom;
        const lOffsetX: number = this.mPanX % lScaledGrid;
        const lOffsetY: number = this.mPanY % lScaledGrid;

        const lPlusGridSvg: string = '%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 viewBox%3D%220 0 100 100%22%3E%3Cpath d%3D%22M0 0h18M0 0v18M100 0H82M100 0v18M0 100h18M0 100V82M100 100H82M100 100V82%22 stroke%3D%22%23313244%22 stroke-width%3D%225%22 stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E';

        return [
            `background-size: ${lScaledGrid}px ${lScaledGrid}px`,
            `background-position: ${lOffsetX}px ${lOffsetY}px`,
            `background-image: url("data:image/svg+xml,${lPlusGridSvg}")`
        ].join('; ');
    }

    /**
     * Get a CSS transform string representing the current pan and zoom state.
     * Intended for use on the grid/content container.
     *
     * @returns CSS transform value string.
     */
    public getTransformCss(): string {
        return `translate(${this.mPanX}px, ${this.mPanY}px) scale(${this.mZoom})`;
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
    }

    /**
     * Convert screen coordinates to world coordinates by reversing the
     * pan and zoom transforms.
     *
     * @param pScreenX - X position in screen pixels.
     * @param pScreenY - Y position in screen pixels.
     *
     * @returns World coordinates.
     */
    public screenToWorld(pScreenX: number, pScreenY: number): { x: number; y: number } {
        return {
            x: (pScreenX - this.mPanX) / this.mZoom,
            y: (pScreenY - this.mPanY) / this.mZoom
        };
    }

    /**
     * Snap the given world coordinates to the nearest grid point.
     *
     * @param pWorldX - X position in world coordinates.
     * @param pWorldY - Y position in world coordinates.
     *
     * @returns Snapped world coordinates.
     */
    public snapToGrid(pWorldX: number, pWorldY: number): { x: number; y: number } {
        return {
            x: Math.round(pWorldX / this.mGridSize) * this.mGridSize,
            y: Math.round(pWorldY / this.mGridSize) * this.mGridSize
        };
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
        lNewZoom = Math.max(PotatnoCanvasInteraction.MIN_ZOOM, Math.min(PotatnoCanvasInteraction.MAX_ZOOM, lNewZoom));

        // Compute the world point under the mouse before zoom.
        const lWorldX: number = (pScreenX - this.mPanX) / lOldZoom;
        const lWorldY: number = (pScreenY - this.mPanY) / lOldZoom;

        // Update zoom.
        this.mZoom = lNewZoom;

        // Adjust pan so that the world point remains under the same screen position.
        this.mPanX = pScreenX - lWorldX * this.mZoom;
        this.mPanY = pScreenY - lWorldY * this.mZoom;
    }
}
