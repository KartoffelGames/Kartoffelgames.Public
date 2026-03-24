/**
 * SVG namespace constant used for creating SVG elements.
 */
const SVG_NS: string = 'http://www.w3.org/2000/svg';

/**
 * Data attribute used to identify temporary connection paths.
 */
const TEMP_CONNECTION_ATTR: string = 'data-temp-connection';

/**
 * Width of the invisible hit area behind each connection path for click detection.
 */
const HIT_AREA_STROKE_WIDTH: number = 12;

/**
 * Pure logic class that renders SVG bezier connection paths onto an SVG element.
 */
export class PotatnoCanvasRenderer {
    /**
     * Remove all connection paths (including temp) from the SVG layer.
     *
     * @param pSvg - The SVG element to clear all paths from.
     */
    public clearAll(pSvg: SVGSVGElement): void {
        const lPaths: NodeListOf<Element> = pSvg.querySelectorAll('path');
        for (const lPath of lPaths) {
            lPath.remove();
        }
    }

    /**
     * Remove the temporary connection path from the SVG layer.
     *
     * @param pSvg - The SVG element to remove the temporary path from.
     */
    public clearTempConnection(pSvg: SVGSVGElement): void {
        const lExisting: Element | null = pSvg.querySelector(`[${TEMP_CONNECTION_ATTR}]`);
        if (lExisting) {
            lExisting.remove();
        }
    }

    /**
     * Generate a cubic bezier path string between two points.
     * The curve runs horizontally: control points are offset by approximately
     * 40% of the horizontal distance between the endpoints. When the target is
     * to the left of the source, a minimum control offset is enforced so the
     * curve loops back smoothly.
     *
     * @param pX1 - Source X coordinate.
     * @param pY1 - Source Y coordinate.
     * @param pX2 - Target X coordinate.
     * @param pY2 - Target Y coordinate.
     *
     * @returns SVG path "d" attribute string.
     */
    public generateBezierPath(pX1: number, pY1: number, pX2: number, pY2: number): string {
        const lDx: number = Math.abs(pX2 - pX1);
        const lOffset: number = Math.max(lDx * 0.4, 50);

        const lCp1X: number = pX1 + lOffset;
        const lCp1Y: number = pY1;
        const lCp2X: number = pX2 - lOffset;
        const lCp2Y: number = pY2;

        return `M ${pX1} ${pY1} C ${lCp1X} ${lCp1Y}, ${lCp2X} ${lCp2Y}, ${pX2} ${pY2}`;
    }

    /**
     * Render all connections onto the SVG element. Existing connection paths
     * (excluding temporary connections) are cleared and re-created.
     * Each connection gets an invisible wider hit-area path for click detection
     * placed behind the visible path.
     *
     * @param pSvg - The SVG element to render into.
     * @param pConnections - Array of connection render data objects.
     */
    public renderConnections(pSvg: SVGSVGElement, pConnections: Array<ConnectionRenderData>): void {
        // Remove all existing connection paths except the temp connection.
        const lExistingPaths: NodeListOf<Element> = pSvg.querySelectorAll(`path:not([${TEMP_CONNECTION_ATTR}])`);
        for (const lPath of lExistingPaths) {
            lPath.remove();
        }

        // Create a hit-area path and a visible path for each connection.
        for (const lConnection of pConnections) {
            const lD: string = this.generateBezierPath(
                lConnection.sourceX,
                lConnection.sourceY,
                lConnection.targetX,
                lConnection.targetY
            );

            // Invisible wide hit-area path (inserted first, so it's behind the visible path).
            const lHitPath: SVGPathElement = document.createElementNS(SVG_NS, 'path') as SVGPathElement;
            lHitPath.setAttribute('d', lD);
            lHitPath.setAttribute('fill', 'none');
            lHitPath.setAttribute('data-connection-id', lConnection.id);
            lHitPath.setAttribute('data-hit-area', 'true');
            lHitPath.style.stroke = 'transparent';
            lHitPath.style.strokeWidth = `${HIT_AREA_STROKE_WIDTH}`;
            lHitPath.style.pointerEvents = 'stroke';
            lHitPath.style.cursor = 'pointer';
            pSvg.appendChild(lHitPath);

            // Visible path.
            const lPath: SVGPathElement = document.createElementNS(SVG_NS, 'path') as SVGPathElement;
            lPath.setAttribute('d', lD);
            lPath.setAttribute('fill', 'none');
            lPath.setAttribute('data-connection-id', lConnection.id);
            lPath.style.stroke = lConnection.valid ? '#a6adc8' : '#f38ba8';
            lPath.style.strokeWidth = '2';
            lPath.style.pointerEvents = 'none';

            if (!lConnection.valid) {
                lPath.setAttribute('stroke-dasharray', '6 3');
            }

            pSvg.appendChild(lPath);
        }
    }

    /**
     * Render a temporary connection path (e.g. while the user is dragging
     * a wire from a port). If a previous temporary path exists it is replaced.
     *
     * @param pSvg - The SVG element to render into.
     * @param pStart - Start position of the temporary connection.
     * @param pEnd - Current end position of the temporary connection.
     * @param pColor - Stroke color for the temporary path.
     */
    public renderTempConnection(pSvg: SVGSVGElement, pStart: { x: number; y: number }, pEnd: { x: number; y: number }, pColor: string): void {
        // Remove any existing temp connection first.
        this.clearTempConnection(pSvg);

        const lPath: SVGPathElement = document.createElementNS(SVG_NS, 'path') as SVGPathElement;
        lPath.setAttribute('d', this.generateBezierPath(pStart.x, pStart.y, pEnd.x, pEnd.y));
        lPath.setAttribute('fill', 'none');
        lPath.setAttribute(TEMP_CONNECTION_ATTR, 'true');
        lPath.style.stroke = pColor;
        lPath.style.strokeWidth = '2';
        lPath.style.opacity = '0.6';
        lPath.style.strokeDasharray = '8 4';
        lPath.style.pointerEvents = 'none';

        pSvg.appendChild(lPath);
    }
}

/**
 * Render data for a single connection between two ports.
 */
export interface ConnectionRenderData {
    color: string;
    id: string;
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
    valid: boolean;
}
