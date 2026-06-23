import { Exception } from "@kartoffelgames/core";
import { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import { PotatnoCanvasInteraction } from '../../potatno-canvas-interaction.ts';
import { PotatnoDocumentNode, PotatnoDocumentNodePorts } from "../../../document/potatno-document-node.ts";
import { PotatnoPortDefinitionDirection } from "../../../project/potatno-port-definition.ts";

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
     * @param pStart - Start position or port of connection path.
     * @param pEnd - End  position or port of connection path.
     *
     * @returns SVG path data.
     */
    public createConnectionPath(pStart: GridPoint | PotatnoDocumentPort<PotatnoProjectTypesDefinition>, pEnd: GridPoint | PotatnoDocumentPort<PotatnoProjectTypesDefinition>): string {
        const lGridPath: Array<GridPoint> = this.createGridPath(pStart, pEnd);
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
    public getPortGridPoint(pPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>): GridPoint {
        // Read node of port.
        const lNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition> = pPort.node;

        // Dependent on port direction, either read input or output port list from node.
        const lNodePortList: ReadonlyArray<PotatnoDocumentPort<PotatnoProjectTypesDefinition>> = (() => {
            if (pPort.direction === 'input') {
                return lNode.inputs.list;
            }

            return lNode.outputs.list;
        })();

        // Find index of port in the node port list.
        const lPortIndex: number = (() => {
            // Count index until found, or port is not found i guess.
            let lIndex: number = 0;
            for (; lIndex < lNodePortList.length; lIndex++) {
                if (lNodePortList[lIndex] === pPort) {
                    break;
                }
            }

            return lIndex;
        })();

        // Get the X coordinate based on the node and port direction.
        const lPointX: number = (() => {
            if (pPort.direction === 'input') {
                return lNode.transformation.x;
            }

            // Move x coorinate to right side of node, if its an output. 
            return lNode.transformation.x + lNode.transformation.width - 2;
        })();

        return {
            // Nodes ports start after the 1 height header. 
            y: lNode.transformation.y + 1 + lPortIndex,

            x: lPointX
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
    public pixelToGridSpace(pX: number, pY: number): GridPoint {
        let lPointX: number = pX;
        let lPointY: number = pY;

        // Move by panning.
        lPointX -= this.mInteraction.panX;
        lPointY -= this.mInteraction.panY;

        lPointX /= this.mInteraction.zoom;
        lPointY /= this.mInteraction.zoom;

        return {
            x: Math.floor(lPointX / this.gridSize) ,
            y: Math.floor(lPointY / this.gridSize) 
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

    /**
     * Get element by pixel position.
     * Does look recursivly into shadow roots to find the actual top element.
     * 
     * @param pClientX - Pixel position x.
     * @param pClientY - Pixel position y.
     * 
     * @returns the top most element of the pixel position 
     */
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

    /**
     * Get the absolute grid pixel position of a point and the direction.
     * 
     * @param pPoint - Grid point.
     * @param pOrientation - Orientation in the grid cell.
     * 
     * @returns the pixel point of the grid point. 
     */
    private getGridPosition(pPoint: GridPoint, pOrientation: PotatnoUiManagerGridDirection): Point {
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
    private createSvgPath(pPath: Array<GridPoint>): string {
        // Get point direction from origin and target points.
        const lPointDirection = (pOriginPoint: GridPoint, pTargetPoint: GridPoint): PotatnoUiManagerGridDirection => {
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
            const lPathPoint: GridPoint = pPath[lPathIndex];

            // Get previous point, when its not available, its ALLWAYS the direct left point.
            // Get next point , when its not available, its ALLWAYS the direct right point.
            const lPreviousPoint: GridPoint = pPath[lPathIndex - 1] ?? { x: lPathPoint.x - 1, y: lPathPoint.y };
            const lNextPoint: GridPoint = pPath[lPathIndex + 1] ?? { x: lPathPoint.x + 1, y: lPathPoint.y };

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
    private createGridCellPath(pPoint: GridPoint, pFromDirection: PotatnoUiManagerGridDirection, pToDirection: PotatnoUiManagerGridDirection) {
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


    // --------------------- REWORK ----------------------------

    private createGridPath(pStart: GridPoint | PotatnoDocumentPort<PotatnoProjectTypesDefinition>, pEnd: GridPoint | PotatnoDocumentPort<PotatnoProjectTypesDefinition>): Array<GridPoint> {
        // Convert both points into a restricting values.
        let lStart: PotatnoUiManagerGridPointRestriction = this.readPointRestriction(pStart);
        let lEnd: PotatnoUiManagerGridPointRestriction = this.readPointRestriction(pEnd);

        // Based on the ports direction or, when no port is set, swap the start with the end.
        if (!lStart.direction && !lEnd.direction) {
            if (lStart.origin.x > lEnd.origin.x) {
                // Swap.
                [lStart, lEnd] = [lEnd, lStart];
            }
        } else {
            if (lStart.direction === 'input' || lEnd.direction === 'output') {
                // Swap.
                [lStart, lEnd] = [lEnd, lStart];
            }
        }

        console.log(lStart, lEnd);

        // Set current point to start.
        let lCurrentPoint: GridPoint = { x: lStart.origin.x, y: lStart.origin.y };
        let lRestriction: PotatnoUiManagerGridPointRestriction = lStart;

        // Calculate meta data for the path.
        const lPathLength: number = Math.abs(lStart.origin.x - lEnd.origin.y) + Math.abs(lStart.origin.y - lEnd.origin.y);

        // Iterate as long as end is not reached.
        const lPath: Array<GridPoint> = new Array<GridPoint>();
        while (lCurrentPoint.x !== lEnd.origin.x || lCurrentPoint.y !== lEnd.origin.y) {
            // Set current point into path.
            lPath.push({ x: lCurrentPoint.x, y: lCurrentPoint.y });


            // TODO:
            // Move 
            if (lCurrentPoint.x != lEnd.origin.x) {
                lCurrentPoint.x += (lEnd.origin.x - lCurrentPoint.x) / Math.abs((lEnd.origin.x - lCurrentPoint.x));
            } else {
                lCurrentPoint.y += (lEnd.origin.y - lCurrentPoint.y) / Math.abs((lEnd.origin.y - lCurrentPoint.y));
            }

        }

        return lPath;
    }

    /**
     * Read the restricting parameters of a point or port for the path generation.
     * 
     * @param pPoint - Point or port.
     * 
     * @returns restriction parameters of the point. 
     */
    private readPointRestriction(pPoint: GridPoint | PotatnoDocumentPort<PotatnoProjectTypesDefinition>): PotatnoUiManagerGridPointRestriction {
        // When point is not a port, it has no restrictions.
        if (!(pPoint instanceof PotatnoDocumentPort)) {
            return {
                origin: pPoint,
                direction: null,
                restriction: {
                    up: 0, down: 0,
                    rectangle: {
                        origin: { x: 0, y: 0 },
                        width: 0, height: 0
                    }
                }
            };
        }

        // Read node of port.
        const lNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition> = pPoint.node;

        // Dependent on port direction, either read input or output port list from node.
        const lNodePortList: ReadonlyArray<PotatnoDocumentPort<PotatnoProjectTypesDefinition>> = (() => {
            if (pPoint.direction === 'input') {
                return lNode.inputs.list;
            }

            return lNode.outputs.list;
        })();

        // Count ports before and after target port.
        let lPortBeforeCount: number = 0;
        let lPortAfterCount: number = -1;
        for (const lNodePort of lNodePortList) {
            // Allways count after count.
            lPortAfterCount++;

            // When port was hit, move count value in before count and reset after.
            if (lNodePort === pPoint) {
                lPortBeforeCount = lPortAfterCount;
                lPortAfterCount = 0;
            }
        }

        // Get point of port.
        const lPortGridPoint: GridPoint = this.getPortGridPoint(pPoint);

        return {
            origin: lPortGridPoint,
            direction: pPoint.direction,
            restriction: {
                up: lPortBeforeCount,
                down: lPortAfterCount,

                // Rectangle is simple the node transformation.
                rectangle: {
                    origin: {
                        x: lNode.transformation.x,
                        y: lNode.transformation.y,
                    },
                    width: lNode.transformation.width,
                    height: lNode.transformation.height
                }
            }
        };
    }
}

type PotatnoUiManagerGridDirection = 'top' | 'right' | 'bottom' | 'left';

type PotatnoUiManagerGridPointRestriction = {
    origin: GridPoint;
    direction: PotatnoPortDefinitionDirection | null;
    restriction: {
        /**
         * Grid count horizontal from origin that the path is not allowed to move up.
         */
        up: number;

        /**
         * Grid count horizontal from origin that the path is not allowed to move down.
         */
        down: number;

        rectangle: {
            origin: GridPoint;
            width: number;
            height: number;
        };
    };



};

export type GridPoint = {
    x: number;
    y: number;
};

type Point = {
    x: number;
    y: number;
};
