import { Exception } from '@kartoffelgames/core';
import { PotatnoDocumentFunction } from "../../../document/potatno-document-function.ts";
import type { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import { PotatnoUiGridPathFinding, type PotatnoUiManagerGridPathFindingPoint } from '../helper/potatno-ui-grid-path-finding.ts';
import { PotatnoCodeUiManagerChangeType, type PotatnoUiManager, type PotatnoUiManagerChangeEvent } from '../potatno-ui-manager.ts';

/**
 * Ui manager grid component.
 * Owns grid sizing and rendered port component lookup for the graph UI.
 */
export class PotatnoUiManagerConnections {
    private mGridElement: Element | null;
    private readonly mManager: PotatnoUiManager;
    private readonly mPathFinder: PotatnoUiGridPathFinding;

    /**
     * Set only grid element.
     * Used to position by pixel space.
     */
    public set gridElement(pGridElement: Element) {
        this.mGridElement = pGridElement;
    }

    /**
     * Constructor.
     * 
     * @param pManager - Parents ui manager.
     */
    public constructor(pManager: PotatnoUiManager) {
        this.mManager = pManager;
        this.mGridElement = null;
        this.mPathFinder = new PotatnoUiGridPathFinding();

        // Register node transformation change event.
        this.mManager.subscribe(PotatnoCodeUiManagerChangeType.NodeTransform | PotatnoCodeUiManagerChangeType.NodeAdd | PotatnoCodeUiManagerChangeType.NodeDelete | PotatnoCodeUiManagerChangeType.SpecialActiveFunction, null, (pEvent: PotatnoUiManagerChangeEvent) => {
            // Update ever node when document is set.
            if ((pEvent.changeType & PotatnoCodeUiManagerChangeType.SpecialActiveFunction) > 0) {
                // Can only be processed with a active function.
                if (!this.mManager.activeFunction) {
                    return;
                }

                // Clear path finder caches.
                this.mPathFinder.clear('all');

                // Update every node.
                for (const lNode of this.mManager.activeFunction.nodes) {
                    this.mPathFinder.updateNodeArea(lNode);
                }

                // And at the end... redo anything :(
                this.updatePaths();
                
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

            // And at the end... redo anything :(
            this.updatePaths();
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
    public createTemporaryPath(pStart: PotatnoUiManagerGridPathFindingPoint | PotatnoDocumentPort<PotatnoProjectTypesDefinition>, pEnd: PotatnoUiManagerGridPathFindingPoint | PotatnoDocumentPort<PotatnoProjectTypesDefinition>): string {
        // Convert entry items to grid points.
        const lItemToPoint = (pItem: PotatnoUiManagerGridPathFindingPoint | PotatnoDocumentPort<PotatnoProjectTypesDefinition>) => {
            if (pItem instanceof PotatnoDocumentPort) {
                return this.getPortGridPoint(pItem);
            }

            return pItem;
        };

        // Convert both points into a restricting values.
        const lStart: PotatnoUiManagerGridPathFindingPoint = lItemToPoint(pStart);
        const lEnd: PotatnoUiManagerGridPathFindingPoint = lItemToPoint(pEnd);

        // Execute path finding.
        const lGridPath: Array<PotatnoUiManagerGridPathFindingPoint> = this.mPathFinder.start(lStart, lEnd).path;

        return this.createSvgPath(lGridPath);
    }

    public getConnectionPath(pStartPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>, pEndPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>): string {
        // Read current generated path.
        const lPath: Array<PotatnoUiManagerGridPathFindingPoint> = this.mPathFinder.getPath(pStartPort, pEndPort);

        
        return this.createSvgPath(lPath);
    }

    /**
     * Calculate the port anchor grid cell.
     *
     * @param pPort - Port whose anchor should be located.
     *
     * @returns Grid cell for the port.
     */
    public getPortGridPoint(pPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>): PotatnoUiManagerGridPathFindingPoint {
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
    public pixelToGridSpace(pX: number, pY: number): PotatnoUiManagerGridPathFindingPoint {
        let lPointX: number = pX;
        let lPointY: number = pY;

        // Move the pixel point related to the grid element.
        if (this.mGridElement) {
            const lGridPosition: DOMRect = this.mGridElement.getBoundingClientRect();
            lPointX -= lGridPosition.left;
            lPointY -= lGridPosition.top;
        }

        // Move by panning.
        lPointX -= this.mManager.grid.panX;
        lPointY -= this.mManager.grid.panY;

        lPointX /= this.mManager.grid.zoom;
        lPointY /= this.mManager.grid.zoom;

        return {
            x: Math.floor(lPointX / this.mManager.grid.gridSize),
            y: Math.floor(lPointY / this.mManager.grid.gridSize)
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
    private getGridPosition(pPoint: PotatnoUiManagerGridPathFindingPoint, pOrientation: PotatnoUiManagerGridDirection): PotatnoUiManagerGridPixelPoint {
        // Create middle point.
        const lPoint: PotatnoUiManagerGridPixelPoint = {
            x: pPoint.x * this.mManager.grid.gridSize + this.mManager.grid.gridSize / 2,
            y: pPoint.y * this.mManager.grid.gridSize + this.mManager.grid.gridSize / 2
        };

        // Calculate half grid length.
        const lHalfLength: number = this.mManager.grid.gridSize / 2;

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
    private createSvgPath(pPath: Array<PotatnoUiManagerGridPathFindingPoint>): string {
        // Get point direction from origin and target points.
        const lPointDirection = (pOriginPoint: PotatnoUiManagerGridPathFindingPoint, pTargetPoint: PotatnoUiManagerGridPathFindingPoint): PotatnoUiManagerGridDirection => {
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
            const lPathPoint: PotatnoUiManagerGridPathFindingPoint = pPath[lPathIndex];

            // Get previous and next point.
            const lPreviousPoint: PotatnoUiManagerGridPathFindingPoint = pPath[lPathIndex - 1];
            const lNextPoint: PotatnoUiManagerGridPathFindingPoint = pPath[lPathIndex + 1];

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
    private createGridCellPath(pPoint: PotatnoUiManagerGridPathFindingPoint, pFromDirection: PotatnoUiManagerGridDirection, pToDirection: PotatnoUiManagerGridDirection) {
        // Create end and start points.
        const lStartPoint: PotatnoUiManagerGridPixelPoint = this.getGridPosition(pPoint, pFromDirection);
        const lEndPoint: PotatnoUiManagerGridPixelPoint = this.getGridPosition(pPoint, pToDirection);

        // Create a bezier control point by using the x of start and y of end.
        // When its a straight line, the control point does nothing. 
        const lControlPoint: PotatnoUiManagerGridPixelPoint = {
            x: pFromDirection === 'bottom' || pFromDirection === 'top' ? lStartPoint.x : lEndPoint.x,
            y: pFromDirection === 'left' || pFromDirection === 'right' ? lStartPoint.y : lEndPoint.y,
        };

        // Create a path between two points with a bezier curve.
        // Move to start point. Draw to endpoint. And use the control point.
        return `M ${lStartPoint.x},${lStartPoint.y} Q ${lControlPoint.x},${lControlPoint.y} ${lEndPoint.x},${lEndPoint.y}`;
    }

    /**
     * Update paths for all nodes in the current active function.
     */
    private updatePaths(): void {
        // Clear path finder caches.
        this.mPathFinder.clear('path');

        // Read current active function.
        const lActiveFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> | null = this.mManager.activeFunction;
        if (!lActiveFunction) {
            return;
        }

        for (const lNode of lActiveFunction.nodes) {
            // First generate flow ports. Flow ports have a single connection on output ports.
            for (const lStartPort of lNode.outputs.flow) {
                // Read single end port.
                const lEndPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | undefined = lStartPort.connectedPorts.values().next().value;
                if (!lEndPort) {
                    continue;
                }

                this.createPath(lStartPort, lEndPort);
            }

            // Then generate value ports. Value ports have a single connection on input ports.
            for (const lStartPort of lNode.inputs.value) {
                // Read single end port.
                const lEndPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | undefined = lStartPort.connectedPorts.values().next().value;
                if (!lEndPort) {
                    continue;
                }

                this.createPath(lStartPort, lEndPort);
            }
        }
    }

    /**
     * Create a persistent path.
     * 
     * @param pStart - Start port.
     * @param pEnd - End port.
     */
    private createPath(pStart: PotatnoDocumentPort<PotatnoProjectTypesDefinition>, pEnd: PotatnoDocumentPort<PotatnoProjectTypesDefinition>): void {
        // Convert both points into a restricting values.
        const lStartPoint: PotatnoUiManagerGridPathFindingPoint = this.getPortGridPoint(pStart);
        const lEndPoint: PotatnoUiManagerGridPathFindingPoint = this.getPortGridPoint(pEnd);

        // Execute path finding.
        this.mPathFinder.updatePath(pStart, lStartPoint, pEnd, lEndPoint);
    }
}

type PotatnoUiManagerGridDirection = 'top' | 'right' | 'bottom' | 'left';

type PotatnoUiManagerGridPixelPoint = {
    x: number;
    y: number;
};