import { Exception } from "@kartoffelgames/core";
import { PotatnoDocumentNode } from "../../../document/potatno-document-node.ts";
import { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import { PotatnoPortDefinitionDirection } from "../../../project/potatno-port-definition.ts";
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import { PotatnoCanvasInteraction } from '../../potatno-canvas-interaction.ts';
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager, PotatnoUiManagerChangeEvent } from "../potatno-ui-manager.ts";

/**
 * Ui manager grid component.
 * Owns grid sizing and rendered port component lookup for the graph UI.
 */
export class PotatnoUiManagerGrid {
    private static readonly GRID_SIZE: number = 25;

    private mGridElement: Element | null;
    private readonly mInteraction: PotatnoCanvasInteraction;
    private readonly mManager: PotatnoUiManager;

    private mGridNodeArea: WeakMap<PotatnoDocumentNode<PotatnoProjectTypesDefinition>, Array<GridNodePoint>>;
    private mGridArea: Map<GridNodePoint, number>;


    /**
     * Grid size in pixels.
     */
    public get gridSize(): number {
        return PotatnoUiManagerGrid.GRID_SIZE;
    }

    /**
     * Set only grid element.
     * Used to position by pixel space.
     */
    public set gridElement(pGridElement: Element) {
        this.mGridElement = pGridElement;
    }

    /**
     * Shared canvas pan and zoom interaction state.
     */
    public get interaction(): PotatnoCanvasInteraction {
        return this.mInteraction;
    }

    /**
     * Constructor.
     * 
     * @param pManager - Parents ui manager.
     */
    public constructor(pManager: PotatnoUiManager) {
        this.mManager = pManager;
        this.mInteraction = new PotatnoCanvasInteraction(PotatnoUiManagerGrid.GRID_SIZE);
        this.mGridElement = null;

        this.mGridNodeArea = new WeakMap<PotatnoDocumentNode<PotatnoProjectTypesDefinition>, Array<GridNodePoint>>();
        this.mGridArea = new Map<GridNodePoint, number>();

        // Register node transformation change event.
        this.mManager.subscribe(PotatnoCodeUiManagerChangeType.NodeTransform | PotatnoCodeUiManagerChangeType.NodeAdd | PotatnoCodeUiManagerChangeType.NodeDelete | PotatnoCodeUiManagerChangeType.SpecialActiveFunction, null, (pEvent: PotatnoUiManagerChangeEvent) => {
            // Update ever node when document is set.
            if ((pEvent.changeType & PotatnoCodeUiManagerChangeType.SpecialActiveFunction) > 0) {
                // Can only be processed with a active function.
                if (!this.mManager.activeFunction) {
                    return;
                }

                // Update every node.
                for (const lNode of this.mManager.activeFunction.nodes) {
                    this.updateGridNodeArea(lNode, false);
                }

                return;
            }

            // When node is deleted, only delete it.
            const lDeleteNode: boolean = (pEvent.changeType & PotatnoCodeUiManagerChangeType.NodeDelete) > 0;

            // Update grid node area.
            this.updateGridNodeArea(pEvent.item as PotatnoDocumentNode<PotatnoProjectTypesDefinition>, lDeleteNode);
        });
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
            return lNode.transformation.x + lNode.transformation.width - 1;
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

        // Move the pixel point related to the grid element.
        if (this.mGridElement) {
            const lGridPosition: DOMRect = this.mGridElement.getBoundingClientRect();
            lPointX -= lGridPosition.left;
            lPointY -= lGridPosition.top;
        }

        // Move by panning.
        lPointX -= this.mInteraction.panX;
        lPointY -= this.mInteraction.panY;

        lPointX /= this.mInteraction.zoom;
        lPointY /= this.mInteraction.zoom;

        return {
            x: Math.floor(lPointX / this.gridSize),
            y: Math.floor(lPointY / this.gridSize)
        };
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

        let lPath: string = '';

        // Recursivly create path. The first and last path is not rendered but used to guide the paths direction.
        for (let lPathIndex: number = 1; lPathIndex < (pPath.length - 1); lPathIndex++) {
            const lPathPoint: GridPoint = pPath[lPathIndex];

            // Get previous and next point.
            const lPreviousPoint: GridPoint = pPath[lPathIndex - 1];
            const lNextPoint: GridPoint = pPath[lPathIndex + 1];

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

        type PathPoint = {
            direction: PotatnoPortDefinitionDirection;
            restriction: Set<GridNodePoint>;
            path: {
                currentPoint: GridPoint;
                items: Array<GridPoint>;
            };
        };

        // Create staring point path. Initialize with first path point with the starting point.
        const lStartPoint: PathPoint = {
            direction: 'output',
            restriction: lStart.restrictions,
            path: {
                currentPoint: { x: lStart.origin.x, y: lStart.origin.y },
                items: [{ x: lStart.origin.x, y: lStart.origin.y }]
            }
        };

        // Create end point path. Initialize with first path point with the starting point.
        const lEndPoint: PathPoint = {
            direction: 'input',
            restriction: lStart.restrictions,
            path: {
                currentPoint: { x: lEnd.origin.x, y: lEnd.origin.y },
                items: [{ x: lEnd.origin.x, y: lEnd.origin.y }]
            }
        };

        const lDirection = {
            none: 0,
            top: 1,
            right: 2,
            bottom: 4,
            left: 8
        } as const;

        const lMoveToward = (pPathPoint: PathPoint, pTarget: GridPoint, pBlockedDirections: number): boolean => {
            // Construct new point.
            const lCurrentPoint: GridPoint = {
                x: pPathPoint.path.currentPoint.x,
                y: pPathPoint.path.currentPoint.y,
            };

            // Check if current point does align with target. If so, return path end.
            if (lCurrentPoint.x === pTarget.x && lCurrentPoint.y === pTarget.y) {
                return true;
            }

            // Priorize horizontal movement.
            if (lCurrentPoint.x !== pTarget.x && (pBlockedDirections & 8) === 0) {
                lCurrentPoint.x += (pTarget.x - lCurrentPoint.x) / Math.abs((pTarget.x - lCurrentPoint.x));
            } else if (lCurrentPoint.y !== pTarget.y) {
                lCurrentPoint.y += (pTarget.y - lCurrentPoint.y) / Math.abs((pTarget.y - lCurrentPoint.y));
            }

            // Build GridNodePoint for the current point.
            const lGridNodePoint: GridNodePoint = `${lCurrentPoint.x}|${lCurrentPoint.y}`;
            if (this.mGridArea.has(lGridNodePoint)) {
                // Calculate the direction of the movement.
                const lMoveDirection: number = (() => {
                    const lDistanceX = pPathPoint.path.currentPoint.x - lCurrentPoint.x;
                    const lDistanceY = pPathPoint.path.currentPoint.y - lCurrentPoint.y;

                    switch (true) {
                        case lDistanceX == 0 && lDistanceY == 1: return lDirection.bottom;
                        case lDistanceX == 0 && lDistanceY == -1: return lDirection.top;
                        case lDistanceX == -1 && lDistanceY == 0: return lDirection.left;
                        case lDistanceX == 1 && lDistanceY == 0: return lDirection.right;
                        default: throw new Exception('Missformed path. Path points are not directly next to each other.', this);
                    }
                })();

                return lMoveToward(pPathPoint, pTarget, lMoveDirection | pBlockedDirections);
            }

            // Check if current point does align with target. If so, return path end.
            if (lCurrentPoint.x === pTarget.x && lCurrentPoint.y === pTarget.y) {
                return true;
            }

            // Update current path point.
            pPathPoint.path.currentPoint.x = lCurrentPoint.x;
            pPathPoint.path.currentPoint.y = lCurrentPoint.y;

            // Push point to path and signal that the path is not finished.
            pPathPoint.path.items.push(lCurrentPoint);
            return false;
        };

        // TODO: Shit counter. Prevents endless loops in testing.
        let lShitCounter: number = 0;

        while (true) {
            // Move start point towards end point.
            if (lMoveToward(lStartPoint, lEndPoint.path.currentPoint, lDirection.none)) {
                break;
            }

            // And move end point towards start point.
            if (lMoveToward(lEndPoint, lStartPoint.path.currentPoint, lDirection.none)) {
                break;
            }

            if (++lShitCounter > 100) {
                break;
            }
        }

        // Create combined path from start and Endpoint.
        const lCombinedPath: Array<GridPoint> = [...lStartPoint.path.items, ...lEndPoint.path.items.reverse()];

        console.log(lStartPoint.path.items, lEndPoint.path.items);
        console.log(lCombinedPath);

        return lCombinedPath;
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
                restrictions: new Set<GridNodePoint>()
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

        // TODO: Calculate custom node grid restrictions.
        const lNodeGridRestriction: Set<GridNodePoint> = new Set<GridNodePoint>();

        return {
            origin: lPortGridPoint,
            direction: pPoint.direction,
            restrictions: lNodeGridRestriction
        };
    }

    /**
     * Update the grid node area of a node.
     * 
     * @param pNode - Node area to update.
     * @param pDelete - Only delete node.
     */
    private updateGridNodeArea(pNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition>, pDelete: boolean): void {
        // Try to get old grid area.
        const lOldGridArea: Array<GridNodePoint> | null = this.mGridNodeArea.get(pNode) ?? null;
        if (lOldGridArea) {
            // Remove old grid area.
            for (const lGridPoint of lOldGridArea) {
                // Read current count. Update count or delete if count is zero.
                const lGridPointCount: number = (this.mGridArea.get(lGridPoint) ?? 0) - 1;
                if (lGridPointCount < 1) {
                    this.mGridArea.delete(lGridPoint);
                } else {
                    this.mGridArea.set(lGridPoint, lGridPointCount);
                }
            }
        }

        // Only delete node area.
        if (pDelete) {
            return;
        }

        // Read node position and dimension.
        const lPositionX: number = pNode.transformation.x;
        const lPositionY: number = pNode.transformation.y;
        const lWidth: number = pNode.transformation.width;
        const lHeight: number = pNode.transformation.height;

        // Create area array for node only.
        const lNodeArea: Array<GridNodePoint> = new Array<GridNodePoint>();

        // Iterate over each node area.
        for (let lX: number = 0; lX < lWidth; lX++) {
            for (let lY: number = 0; lY < lHeight; lY++) {
                // Construct grid point.
                const lGridNodePoint: GridNodePoint = `${lX + lPositionX}|${lY + lPositionY}`;

                // Increase grid point count.
                const lGridPointCount: number = (this.mGridArea.get(lGridNodePoint) ?? 0) + 1;
                this.mGridArea.set(lGridNodePoint, lGridPointCount);

                // Add point to node area.
                lNodeArea.push(lGridNodePoint);
            }
        }

        // Update nodes area.
        this.mGridNodeArea.set(pNode, lNodeArea);
    }
}

type PotatnoUiManagerGridDirection = 'top' | 'right' | 'bottom' | 'left';

type PotatnoUiManagerGridPointRestriction = {
    origin: GridPoint;
    direction: PotatnoPortDefinitionDirection | null;
    restrictions: Set<GridNodePoint>;
};

export type GridPoint = {
    x: number;
    y: number;
};

type Point = {
    x: number;
    y: number;
};

type GridNodePoint = `${number}|${number}`;
