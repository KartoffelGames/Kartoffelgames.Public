import { Astar, type AstarPathInformation, AstarResult, Exception } from '@kartoffelgames/core';
import type { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import type { PotatnoPortDefinitionDirection } from '../../../project/potatno-port-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import { PotatnoCanvasInteraction } from '../../potatno-canvas-interaction.ts';
import { PotatnoCodeUiManagerChangeType, type PotatnoUiManager, type PotatnoUiManagerChangeEvent } from '../potatno-ui-manager.ts';

/**
 * Ui manager grid component.
 * Owns grid sizing and rendered port component lookup for the graph UI.
 */
export class PotatnoUiManagerGrid {
    private static readonly GRID_SIZE: number = 25;

    private mGridElement: Element | null;
    private readonly mInteraction: PotatnoCanvasInteraction;
    private readonly mManager: PotatnoUiManager;
    private readonly mPathFinder: PotatnoUiManagerGridPathFinding;




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
        this.mPathFinder = new PotatnoUiManagerGridPathFinding();

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
                    this.mPathFinder.updateNodeArea(lNode);
                }

                return;
            }

            // When node is deleted, only delete it.
            const lDeleteNode: boolean = (pEvent.changeType & PotatnoCodeUiManagerChangeType.NodeDelete) > 0;

            // Update grid node area.
            if (lDeleteNode) {
                this.mPathFinder.removeNodeArea(pEvent.item as PotatnoDocumentNode<PotatnoProjectTypesDefinition>);
            } else {
                this.mPathFinder.updateNodeArea(pEvent.item as PotatnoDocumentNode<PotatnoProjectTypesDefinition>);
            }
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
                case lDistanceX === 0 && lDistanceY === 1: return 'bottom';
                case lDistanceX === 0 && lDistanceY === -1: return 'top';
                case lDistanceX === -1 && lDistanceY === 0: return 'left';
                case lDistanceX === 1 && lDistanceY === 0: return 'right';
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
        // Convert entry items to grid points.
        const lItemToPoint = (pItem: GridPoint | PotatnoDocumentPort<PotatnoProjectTypesDefinition>) => {
            if (pItem instanceof PotatnoDocumentPort) {
                return this.getPortGridPoint(pItem);
            }

            return pItem;
        };

        // Convert both points into a restricting values.
        const lStart: GridPoint = lItemToPoint(pStart);
        const lEnd: GridPoint = lItemToPoint(pEnd);

        // Swap point when 
        // TODO:

        // Execute path finding.
        return this.mPathFinder.start(lStart, lEnd).path;
    }
}

type PotatnoUiManagerGridDirection = 'top' | 'right' | 'bottom' | 'left';

type PotatnoUiManagerGridPointRestriction = {
    origin: GridPoint;
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


export class PotatnoUiManagerGridPathFinding extends Astar<GridPoint> {

    private readonly mPathArea: Map<GridNodePoint, number>;
    private readonly mForecourtArea: Map<GridNodePoint, number>;
    private readonly mNodeCache: Map<GridNodePoint, GridPoint>;

    private readonly mGridNodeArea: WeakMap<PotatnoDocumentNode<PotatnoProjectTypesDefinition>, PotatnoUiManagerGridPathFindingNodeArea>;
    private readonly mNodeArea: Map<GridNodePoint, number>;

    public constructor() {
        super();
        // Initialize node area configurations.
        this.mGridNodeArea = new WeakMap<PotatnoDocumentNode<PotatnoProjectTypesDefinition>, PotatnoUiManagerGridPathFindingNodeArea>();

        // Initialize new node cache so the node reference for each coordinate stays the same.
        this.mNodeCache = new Map<GridNodePoint, GridPoint>();

        // Different node areas and their count of how many entities are present.
        this.mNodeArea = new Map<GridNodePoint, number>();
        this.mForecourtArea = new Map<GridNodePoint, number>();
        this.mPathArea = new Map<GridNodePoint, number>();
    }

    public updateNodeArea(pNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition>): void {
        // Remove old areas.
        this.removeNodeArea(pNode);

        // Read node position and dimension.
        const lPositionX: number = pNode.transformation.x;
        const lPositionY: number = pNode.transformation.y;
        const lWidth: number = pNode.transformation.width;
        const lHeight: number = pNode.transformation.height;

        // Read current grid area.
        const lCurrentNodeArea: PotatnoUiManagerGridPathFindingNodeArea = this.mGridNodeArea.get(pNode) ?? {
            area: new Array<GridNodePoint>(),
            forecourt: new Array<GridNodePoint>()
        };

        // Iterate over each node area.
        for (let lX: number = 0; lX < lWidth; lX++) {
            for (let lY: number = 0; lY < lHeight; lY++) {
                // Construct grid point.
                const lGridNodePoint: GridNodePoint = `${lX + lPositionX}|${lY + lPositionY}`;

                // Increase grid point count.
                const lGridPointCount: number = (this.mNodeArea.get(lGridNodePoint) ?? 0) + 1;
                this.mNodeArea.set(lGridNodePoint, lGridPointCount);

                // Add point to node area.
                lCurrentNodeArea.area.push(lGridNodePoint);
            }
        }

        // TODO: calculate port forecourt.

        // Update nodes area.
        this.mGridNodeArea.set(pNode, lCurrentNodeArea);
    }

    public removeNodeArea(pNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition>): void {
        // When nothing to remove, remove nothing. Yes. That comment makes sense.
        if (!this.mGridNodeArea.has(pNode)) {
            return;
        }

        // Read current grid area.
        const lCurrentNodeArea: PotatnoUiManagerGridPathFindingNodeArea = this.mGridNodeArea.get(pNode)!;

        // Remove old node area.
        for (const lNodeAreaPoint of lCurrentNodeArea.area) {
            // Read current count. Update count or delete if count is zero.
            const lAreaPointCount: number = (this.mNodeArea.get(lNodeAreaPoint) ?? 0) - 1;
            if (lAreaPointCount < 1) {
                this.mNodeArea.delete(lNodeAreaPoint);
            } else {
                this.mNodeArea.set(lNodeAreaPoint, lAreaPointCount);
            }
        }

        // Reset old area.
        lCurrentNodeArea.area = new Array<GridNodePoint>();

        // Remove old node forecourt.
        for (const lNodeForecourtPoint of lCurrentNodeArea.forecourt) {
            // Read current count. Update count or delete if count is zero.
            const lAreaPointCount: number = (this.mForecourtArea.get(lNodeForecourtPoint) ?? 0) - 1;
            if (lAreaPointCount < 1) {
                this.mForecourtArea.delete(lNodeForecourtPoint);
            } else {
                this.mForecourtArea.set(lNodeForecourtPoint, lAreaPointCount);
            }
        }

        // Reset old forecourt.
        lCurrentNodeArea.forecourt = new Array<GridNodePoint>();
    }

    /**
     * Calculate the cost of the traversal between two adjacent nodes.
     * Cost is usually one, but can be different for each node.
     * 
     * @param pNode - Node the path wants to traverse.
     * @param pPathInformation - Path information that leads to the current node.
     */
    protected override costOfTraversal(pNode: GridPoint, pPathInformation: AstarPathInformation<GridPoint>): number {
        // Convert node point into grid point.
        const lGridPoint: GridNodePoint = `${pNode.x}|${pNode.y}`;

        // Start and end node should never have a cost.
        if(pNode.x === pPathInformation.startNode.x && pNode.y === pPathInformation.startNode.y) {
            return 0;
        }
        if(pNode.x === pPathInformation.endNode.x && pNode.y === pPathInformation.endNode.y) {
            return 0;
        }

        // Never go inside node areas unless no other path can be used.
        if (this.mNodeArea.has(lGridPoint)) {
            // FYI: dont make it 1000. It kills the site when the user hovers over a node.
            return 10;
        }

        // Preferr not to cross ports starting areas.
        if (this.mPathArea.has(lGridPoint)) {
            return 1.5;
        }

        // Preferr not to cross other paths.
        if (this.mForecourtArea.has(lGridPoint)) {
            return 1.2;
        }

        // Default cost of each node.
        return 1;
    }

    /**
     * Heuristic calculation.
     * Priorize x movement.
     * Try to stay on the y level of the start node on the first half and on the y level of the end node on the second.
     * 
     * @param pNode - Current node where the heuristic should be calculated for.
     * @param pPathInformation - Path information that leads to the current node.
     * 
     * @return cost of the path between the current and end node.
     */
    protected override heuristic(pNode: GridPoint, pPathInformation: AstarPathInformation<GridPoint>): number {
        // Calculate the middle point x between the start and end node.
        const mMiddleXCoordinate = Math.abs(pPathInformation.endNode.x - pPathInformation.startNode.x) >> 1;

        let lNavigationCost = (() => {
            const previous: GridPoint | undefined = pPathInformation.path.next().value as GridPoint | undefined;
            const previousPrevious: GridPoint | undefined = pPathInformation.path.next().value as GridPoint | undefined;

            // Use the default cost when the new point is behind the previous node.
            // Pushing the path forward. 
            if (!previous || previous.x > pNode.x) {
                return 1;
            }

            // Preferr steight paths. Discouraging curves.
            if (previousPrevious && (pNode.x === previousPrevious.x || pNode.y === previousPrevious.y)) {
                return 0.9;
            }

            // Preferr movement on the x axis.
            if (pNode.x > previous.x && previous.y === pNode.y) {
                return 0.9;
            }

            return 1;
        })();

        // Prefer middle paths.
        if (pNode.x === mMiddleXCoordinate) {
            lNavigationCost *= 0.5;
        }

        // Culculate the distance to the end point.
        let lPathDistance: number = Math.abs(pNode.x - pPathInformation.endNode.x) + Math.abs(pNode.y - pPathInformation.endNode.y);

        // Add the navigation cost to the path cost and use it as a rougth path cost.
        lPathDistance += lNavigationCost;

        // Add weighing.
        lPathDistance *= 2; 

        // Add the navigation cost to the path cost and use it as a rougth path cost.
        return lPathDistance;
    }

    /**
     * Get all neighbor nodes of the center node.
     * 
     * @param pNode - Center node.
     * 
     * @returns All neighbor nodes. 
     */
    protected override neighborNodes(pNode: GridPoint): Array<GridPoint> {
        // Collect grid neighbors.
        const lNeighborNodes: Array<GridPoint> = new Array<GridPoint>();
        const lNeighborCoordinates: Array<GridPoint> = [
            { x: pNode.x, y: pNode.y - 1 },
            { x: pNode.x - 1, y: pNode.y },
            { x: pNode.x + 1, y: pNode.y },
            { x: pNode.x, y: pNode.y + 1 }
        ];

        // Filter invalid and blocked neighbors.
        for (const lNeighborNode of lNeighborCoordinates) {
            const lKey: GridNodePoint = `${lNeighborNode.x}|${lNeighborNode.y}`;

            // Reuse node references so Astar maps remain stable.
            if (this.mNodeCache.has(lKey)) {
                lNeighborNodes.push(lNeighborNode);
                continue;
            }

            this.mNodeCache.set(lKey, lNeighborNode);
        }

        return lNeighborNodes;
    }

    /**
     * Compare two nodes for equality.
     * 
     * @param pNodeA - Node a.
     * @param pNodeB - Node b.
     * 
     * @returns comparison result.
     */
    protected override nodesAreEqual(pNodeA: GridPoint, pNodeB: GridPoint): boolean {
        return pNodeA.x === pNodeB.x && pNodeA.y === pNodeB.y;
    }
}

type PotatnoUiManagerGridPathFindingNodeArea = {
    area: Array<GridNodePoint>;
    forecourt: Array<GridNodePoint>;
};