/**
 * Pure logic class that manages viewport transform state, coordinate conversion,
 * grid snapping, and selection box tracking for the canvas.
 */
export class PotatnoCanvasInteraction {
    private static readonly MAX_ZOOM: number = 2.0;
    private static readonly MIN_ZOOM: number = 0.25;

    private readonly mGridSize: number;
    private mPanX: number;
    private mPanY: number;
    private mSelectionEnd: { x: number; y: number } | null;
    private mSelectionStart: { x: number; y: number } | null;
    private mZoom: number;

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
        return this.mPanX;
    }

    /**
     * Vertical pan offset in pixels.
     */
    public get panY(): number {
        return this.mPanY;
    }

    /**
     * End point of the selection box in world coordinates, or null if no selection is active.
     */
    public get selectionEnd(): { x: number; y: number } | null {
        return this.mSelectionEnd;
    }

    /**
     * Start point of the selection box in world coordinates, or null if no selection is active.
     */
    public get selectionStart(): { x: number; y: number } | null {
        return this.mSelectionStart;
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
     * @param pGridSize - Size of the grid in pixels. Defaults to 20.
     */
    public constructor(pGridSize: number = 20) {
        this.mGridSize = pGridSize;
        this.mPanX = 0;
        this.mPanY = 0;
        this.mZoom = 1.0;
        this.mSelectionStart = null;
        this.mSelectionEnd = null;
    }

    /**
     * Clear the selection box state.
     */
    public clearSelection(): void {
        this.mSelectionStart = null;
        this.mSelectionEnd = null;
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

        // Two layers: major grid lines (every 5 cells) and minor grid lines.
        const lMajorGrid: number = lScaledGrid * 5;
        const lMajorOffsetX: number = this.mPanX % lMajorGrid;
        const lMajorOffsetY: number = this.mPanY % lMajorGrid;

        return [
            `background-size: ${lScaledGrid}px ${lScaledGrid}px, ${lMajorGrid}px ${lMajorGrid}px`,
            `background-position: ${lOffsetX}px ${lOffsetY}px, ${lMajorOffsetX}px ${lMajorOffsetY}px`,
            `background-image: radial-gradient(circle, var(--pn-grid-color) 1px, transparent 1px), radial-gradient(circle, var(--pn-grid-color) 1.5px, transparent 1.5px)`
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
     * Set the end point of the selection box in world coordinates.
     *
     * @param pWorldX - X position in world coordinates.
     * @param pWorldY - Y position in world coordinates.
     */
    public setSelectionEnd(pWorldX: number, pWorldY: number): void {
        this.mSelectionEnd = { x: pWorldX, y: pWorldY };
    }

    /**
     * Set the start point of the selection box in world coordinates.
     *
     * @param pWorldX - X position in world coordinates.
     * @param pWorldY - Y position in world coordinates.
     */
    public setSelectionStart(pWorldX: number, pWorldY: number): void {
        this.mSelectionStart = { x: pWorldX, y: pWorldY };
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
     * Convert world coordinates to screen coordinates by applying the
     * pan and zoom transforms.
     *
     * @param pWorldX - X position in world coordinates.
     * @param pWorldY - Y position in world coordinates.
     *
     * @returns Screen coordinates.
     */
    public worldToScreen(pWorldX: number, pWorldY: number): { x: number; y: number } {
        return {
            x: pWorldX * this.mZoom + this.mPanX,
            y: pWorldY * this.mZoom + this.mPanY
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
