import { Exception } from "@kartoffelgames/core";
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import { PotatnoCanvasInteraction } from '../../potatno-canvas-interaction.ts';

/**
 * Ui manager grid component.
 * Owns grid sizing and rendered port component lookup for the graph UI.
 */
export class PotatnoUiManagerGrid {
    private static readonly GRID_SIZE: number = 25;

    private readonly mElementPorts: WeakMap<Element, PotatnoDocumentPort<PotatnoProjectTypesDefinition>>;
    private readonly mInteraction: PotatnoCanvasInteraction;

    /**
     * Currently dragged port.
     */
    public draggedPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | null;

    /**
     * Grid size in pixels.
     */
    public get gridSize(): number {
        return PotatnoUiManagerGrid.GRID_SIZE;
    }

    /**
     * Shared canvas pan and zoom interaction state.
     */
    public get interaction(): PotatnoCanvasInteraction {
        return this.mInteraction;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mElementPorts = new WeakMap<Element, PotatnoDocumentPort<PotatnoProjectTypesDefinition>>();
        this.mInteraction = new PotatnoCanvasInteraction(PotatnoUiManagerGrid.GRID_SIZE);
        this.draggedPort = null;
    }

    /**
     * Create an orthogonal grid-routed SVG path between two grid cells.
     *
     * @param pStart - Start grid cell.
     * @param pEnd - End grid cell.
     * @param pSourcePort - Source port of the connection.
     *
     * @returns SVG path data.
     */
    public createConnectionPath(pStart: PotatnoUiManagerGridPoint, pEnd: PotatnoUiManagerGridPoint, pSourcePort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>): string {
        const lGridPath: Array<PotatnoUiManagerGridPoint> = this.createGridPath(pStart, pEnd, pSourcePort);
        return this.createSvgPath(lGridPath);
    }

    /**
     * Find the registered port under a viewport position.
     *
     * @param pClientX - Viewport x coordinate.
     * @param pClientY - Viewport y coordinate.
     *
     * @returns The port under the position, or null when none exists.
     */
    public getPortFromPosition(pClientX: number, pClientY: number): PotatnoDocumentPort<PotatnoProjectTypesDefinition> | null {
        // Read element from position.
        const lElement: Element | null = this.getElementFromPosition(pClientX, pClientY);
        if (!lElement) {
            return null;
        }

        // When a element is hit, try to get the component host element from it.
        const lComponentElement: Element = (() => {
            const lRoot: Node = lElement.getRootNode();

            // Root must be a shadow root to exclude window elements.
            if (lRoot instanceof ShadowRoot && lRoot.host instanceof Element) {
                return lRoot.host;
            }

            return lElement;
        })();

        // Try to return the registered components port.
        return this.mElementPorts.get(lComponentElement) ?? null;
    }

    /**
     * Calculate the port anchor grid cell.
     *
     * @param pPort - Port whose anchor should be located.
     *
     * @returns Grid cell for the port.
     */
    public getPortGridPoint(pPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>): PotatnoUiManagerGridPoint {
        const lNode = pPort.node;
        const lPortList: ReadonlyArray<PotatnoDocumentPort<PotatnoProjectTypesDefinition>> = pPort.direction === 'output' ? lNode.outputs.list : lNode.inputs.list;
        let lIndex: number = 0;

        for (const lCandidatePort of lPortList) {
            if (lCandidatePort === pPort) {
                break;
            }
            lIndex++;
        }

        return {
            x: pPort.direction === 'output' ? lNode.transformation.x + lNode.transformation.width - 1 : lNode.transformation.x,
            y: lNode.transformation.y + 1 + lIndex
        };
    }

    /**
     * Convert pixel coordinates to grid space.
     *
     * @param pX - Pixel x coordinate.
     * @param pY - Pixel y coordinate.
     *
     * @returns Grid point.
     */
    public pixelToGridSpace(pX: number, pY: number): PotatnoUiManagerGridPoint {
        return {
            x: Math.floor(pX / this.gridSize),
            y: Math.floor(pY / this.gridSize)
        };
    }

    /**
     * Register a rendered port component element.
     *
     * @param pPort - Port represented by the element.
     * @param pElement - Rendered port component element.
     */
    public registerPortElement(pPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>, pElement: Element): void {
        this.mElementPorts.set(pElement, pPort);
    }

    private appendGridLine(pPath: Array<PotatnoUiManagerGridPoint>, pTarget: PotatnoUiManagerGridPoint): void {
        const lLastPoint: PotatnoUiManagerGridPoint = pPath[pPath.length - 1];
        const lStepX: number = Math.sign(pTarget.x - lLastPoint.x);
        const lStepY: number = Math.sign(pTarget.y - lLastPoint.y);

        for (let lX: number = lLastPoint.x + lStepX; lStepX !== 0 && (lStepX > 0 ? lX <= pTarget.x : lX >= pTarget.x); lX += lStepX) {
            pPath.push({ x: lX, y: lLastPoint.y });
        }

        const lLineStart: PotatnoUiManagerGridPoint = pPath[pPath.length - 1];
        for (let lY: number = lLineStart.y + lStepY; lStepY !== 0 && (lStepY > 0 ? lY <= pTarget.y : lY >= pTarget.y); lY += lStepY) {
            pPath.push({ x: lLineStart.x, y: lY });
        }
    }

    private createGridPath(pStart: PotatnoUiManagerGridPoint, pEnd: PotatnoUiManagerGridPoint, pSourcePort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>): Array<PotatnoUiManagerGridPoint> {
        let lStart: PotatnoUiManagerGridPoint = pSourcePort.direction === 'input' ? pEnd : pStart;
        let lEnd: PotatnoUiManagerGridPoint = pSourcePort.direction === 'input' ? pStart : pEnd;

        if (lStart.x > lEnd.x) {
            const lSwapStart: PotatnoUiManagerGridPoint = lStart;
            lStart = lEnd;
            lEnd = lSwapStart;
        }

        const lPath: Array<PotatnoUiManagerGridPoint> = [{ ...lStart }];
        if (lEnd.x <= lStart.x + 1) {
            this.appendGridLine(lPath, { x: lStart.x, y: lEnd.y });
            this.appendGridLine(lPath, lEnd);
            return lPath;
        }

        const lStartRoute: PotatnoUiManagerGridPoint = { x: lStart.x , y: lStart.y };
        const lEndRoute: PotatnoUiManagerGridPoint = { x: lEnd.x , y: lEnd.y };
        const lBaseMidX: number = Math.round(lStartRoute.x + (lEndRoute.x - lStartRoute.x) / 2);
        const lMidX: number = Math.max(lStartRoute.x, Math.min(lEndRoute.x, lBaseMidX + this.getSourceConnectionLaneOffset(pSourcePort)));

        this.appendGridLine(lPath, lStartRoute);
        this.appendGridLine(lPath, { x: lMidX, y: lStartRoute.y });
        this.appendGridLine(lPath, { x: lMidX, y: lEndRoute.y });
        this.appendGridLine(lPath, lEndRoute);
        this.appendGridLine(lPath, lEnd);
        return lPath;
    }

    private getElementFromPosition(pClientX: number, pClientY: number): Element | null {
        // Recursive function that finds element from a position nexted in shadow roots.
        const lReadElementInRoot = (pRoot: Document | ShadowRoot, pClientX: number, pClientY: number): Element | null => {
            // Try to read the hit element inside the current root.
            const lElement: Element | null = pRoot.elementFromPoint(pClientX, pClientY);
            if (!lElement) {
                return null;
            }

            // If the element has a shadow root, look into that shadow root.
            if (lElement.shadowRoot) {
                const lShadowRootElement: Element | null = lReadElementInRoot(lElement.shadowRoot, pClientX, pClientY);
                if (lShadowRootElement) {
                    return lShadowRootElement;
                }
            }

            return lElement;
        };

        return lReadElementInRoot(document, pClientX, pClientY);
    }

    private getSourceConnectionLaneOffset(pSourcePort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>): number {
        if (pSourcePort.direction !== 'output') {
            return 0;
        }

        const lOutputPorts: ReadonlyArray<PotatnoDocumentPort<PotatnoProjectTypesDefinition>> = pSourcePort.node.outputs.list;
        const lPortIndex: number = lOutputPorts.indexOf(pSourcePort);
        if (lPortIndex === -1) {
            return 0;
        }

        return lOutputPorts.length - lPortIndex - 1;
    }

    /**
     * Get the absolute grid pixel position of a point and the direction.
     * 
     * @param pPoint - Grid point.
     * @param pOrientation - Orientation in the grid cell.
     * 
     * @returns the pixel point of the grid point. 
     */
    private getGridPosition(pPoint: PotatnoUiManagerGridPoint, pOrientation: PotatnoUiManagerGridDirection): Point {
        // Create middle point.
        const lPoint: Point = {
            x: pPoint.x * this.gridSize + this.gridSize / 2,
            y: pPoint.y * this.gridSize + this.gridSize / 2
        };

        // Calculate half grid length.
        const lHalfLength: number = this.gridSize / 2;

        // Move point toward orientation.
        switch (pOrientation) {
            case 'top': lPoint.y -= lHalfLength; break;
            case 'right': lPoint.x += lHalfLength; break;
            case 'bottom': lPoint.y += lHalfLength; break;
            case 'left': lPoint.x -= lHalfLength; break;
        }

        return lPoint;
    }

    /**
     * Create path svg by the given path.
     * This function assumes that previous and next path points of the current are a direct neighbors.
     *  
     * @param pPath - Grid point array representing a path.
     * 
     * @returns a svg path string. 
     */
    private createSvgPath(pPath: Array<PotatnoUiManagerGridPoint>): string {
        // Get point direction from origin and target points.
        const lPointDirection = (pOriginPoint: PotatnoUiManagerGridPoint, pTargetPoint: PotatnoUiManagerGridPoint): PotatnoUiManagerGridDirection => {
            const lDistanceX = pTargetPoint.x - pOriginPoint.x;
            const lDistanceY = pTargetPoint.y - pOriginPoint.y;

            switch (true) {
                case lDistanceX == 0 && lDistanceY == 1: return 'bottom';
                case lDistanceX == 0 && lDistanceY == -1: return 'top';
                case lDistanceX == -1 && lDistanceY == 0: return 'left';
                case lDistanceX == 1 && lDistanceY == 0: return 'right';
                default: throw new Exception('Missformed path. Path points are not directly next to each other.', this);
            }
        };

        // Recursivly create path.
        let lPath: string = '';
        for (let lPathIndex: number = 0; lPathIndex < pPath.length; lPathIndex++) {
            const lPathPoint: PotatnoUiManagerGridPoint = pPath[lPathIndex];

            // Get previous point, when its not available, its ALLWAYS the direct left point.
            // Get next point , when its not available, its ALLWAYS the direct right point.
            const lPreviousPoint: PotatnoUiManagerGridPoint = pPath[lPathIndex - 1] ?? { x: lPathPoint.x - 1, y: lPathPoint.y };
            const lNextPoint: PotatnoUiManagerGridPoint = pPath[lPathIndex + 1] ?? { x: lPathPoint.x + 1, y: lPathPoint.y };

            // Create directions for previous and next point.
            const lFromDirection: PotatnoUiManagerGridDirection = lPointDirection(lPathPoint, lPreviousPoint);
            const lToDirection: PotatnoUiManagerGridDirection = lPointDirection(lPathPoint, lNextPoint);

            // And then draw everything.
            lPath += this.createGridCellPath(lPathPoint, lFromDirection, lToDirection);
        }

        return lPath;
    }

    /**
     * Draw a curved line for a grid point.
     * 
     * @param pPoint 
     * @param pDirection 
     */
    private createGridCellPath(pPoint: PotatnoUiManagerGridPoint, pFromDirection: PotatnoUiManagerGridDirection, pToDirection: PotatnoUiManagerGridDirection) {
        // Create end and start points.
        const lStartPoint: Point = this.getGridPosition(pPoint, pFromDirection);
        const lEndPoint: Point = this.getGridPosition(pPoint, pToDirection);

        // Create a bezier control point by using the x of start and y of end.
        // When its a straight line, the control point does nothing. 
        const lControlPoint: Point = {
            x: pFromDirection === 'bottom' || pFromDirection === 'top' ? lStartPoint.x : lEndPoint.x,
            y: pFromDirection === 'left' || pFromDirection === 'right' ? lStartPoint.y : lEndPoint.y,
        };

        // Create a path between two points with a bezier curve.
        // Move to start point. Draw to endpoint. And use the control point.
        return `M ${lStartPoint.x},${lStartPoint.y} Q ${lControlPoint.x},${lControlPoint.y} ${lEndPoint.x},${lEndPoint.y}`;
    }

}

type PotatnoUiManagerGridDirection = 'top' | 'right' | 'bottom' | 'left';

export type PotatnoUiManagerGridPoint = {
    x: number;
    y: number;
};

type Point = {
    x: number;
    y: number;
};
