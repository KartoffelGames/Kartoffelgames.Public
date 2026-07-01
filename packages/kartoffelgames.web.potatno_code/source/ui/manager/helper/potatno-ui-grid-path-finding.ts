import { Astar, AstarResult, type AstarPathInformation } from '@kartoffelgames/core';
import type { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import { PotatnoDocumentPort } from "../../../document/potatno-document-port.ts";
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';

/**
 * A* path finding for grid connections.
 */
export class PotatnoUiGridPathFinding extends Astar<PotatnoUiManagerGridPathFindingPoint> {
    private readonly mGridNodeArea: WeakMap<PotatnoDocumentNode<PotatnoProjectTypesDefinition>, Array<PotatnoUiManagerGridPathFindingNodeId>>;
    private readonly mNodeArea: Map<PotatnoUiManagerGridPathFindingNodeId, number>;
    private readonly mGridPaths: WeakMap<PotatnoDocumentPort<PotatnoProjectTypesDefinition>, Array<PotatnoUiManagerGridPathFindingPoint>>;
    private readonly mPathArea: Map<PotatnoUiManagerGridPathFindingNodeId, PotatnoUiManagerGridPathFindingPathAreaCell>;

    /**
     * Constructor.
     */
    public constructor() {
        super();

        // Initialize node area configurations.
        this.mGridNodeArea = new WeakMap<PotatnoDocumentNode<PotatnoProjectTypesDefinition>, Array<PotatnoUiManagerGridPathFindingNodeId>>();
        this.mNodeArea = new Map<PotatnoUiManagerGridPathFindingNodeId, number>();

        this.mGridPaths = new WeakMap<PotatnoDocumentPort<PotatnoProjectTypesDefinition>, Array<PotatnoUiManagerGridPathFindingPoint>>;
        this.mPathArea = new Map<PotatnoUiManagerGridPathFindingNodeId, PotatnoUiManagerGridPathFindingPathAreaCell>();
    }

    /**
     * Clear current registered areas.
     */
    public clear(pMode: 'all' | 'path'): void {
        // Skip node clear on path only clears.
        if (pMode === 'all') {
            this.mNodeArea.clear();
        }

        this.mPathArea.clear();
    }

    /**
     * Get already calculated path.
     * 
     * @param pStartPort - Starting port of path.
     * @param pEndPort - Ending port of path.
     * 
     * @returns The calculated path. 
     */
    public getPath(pStartPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>, pEndPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>): Array<PotatnoUiManagerGridPathFindingPoint> {
        // Start port must be an input-value or an output-flow node.
        const lStartPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> = (() => {
            if (pStartPort.direction === 'input' && pStartPort.portType === 'value' || pStartPort.direction === 'output' && pStartPort.portType === 'flow') {
                return pStartPort;
            }

            return pEndPort;
        })();

        // Try to read path data.
        return this.mGridPaths.get(lStartPort) ?? new Array<PotatnoUiManagerGridPathFindingPoint>();
    }

    /**
     * Remove any node area from path finding.
     * 
     * @param pNode - Node. 
     */
    public removeNodeArea(pNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition>): void {
        // When nothing to remove, remove nothing. Yes. That comment makes sense.
        if (!this.mGridNodeArea.has(pNode)) {
            return;
        }

        // Read current grid area.
        const lCurrentNodeArea: Array<PotatnoUiManagerGridPathFindingNodeId> = this.mGridNodeArea.get(pNode)!;

        // Remove old node area.
        for (const lNodeAreaPoint of lCurrentNodeArea) {
            // Read current count. Update count or delete if count is zero.
            const lAreaPointCount: number = (this.mNodeArea.get(lNodeAreaPoint) ?? 0) - 1;
            if (lAreaPointCount < 1) {
                this.mNodeArea.delete(lNodeAreaPoint);
            } else {
                this.mNodeArea.set(lNodeAreaPoint, lAreaPointCount);
            }
        }

        // Reset old area.
        this.mGridNodeArea.delete(pNode);
    }

    /**
     * Remove any port area from path finding.
     * 
     * @param pStartPort - Starting port of path.
     * @param pEndPort - Ending port of path.
     */
    public removePath(pStartPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>, pEndPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>): void {
        // Start port must be an input-value or an output-flow node.
        const lStartPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> = (() => {
            if (pStartPort.direction === 'input' && pStartPort.portType === 'value' || pStartPort.direction === 'output' && pStartPort.portType === 'flow') {
                return pStartPort;
            }

            return pEndPort;
        })();

        // Remove old area.
        this.removePathArea(lStartPort);
    }

    /**
     * Update the path between two ports.
     * 
     * @param pStartPort - Starting port. 
     * @param pStartPortPoint - Position of starting port.
     * @param pEndPort - Exit port.
     * @param pEndPortPoint - Position of exit port. 
     */
    public updatePath(pStartPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>, pStartPortPoint: PotatnoUiManagerGridPathFindingPoint, pEndPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>, pEndPortPoint: PotatnoUiManagerGridPathFindingPoint): void {
        // Start port must be an input-value or an output-flow node.
        const [lStartPort, lStartPortPoint, lEndPort, lEndPortPoint] = (() => {
            if (pStartPort.direction === 'input' && pStartPort.portType === 'value' || pStartPort.direction === 'output' && pStartPort.portType === 'flow') {
                return [pStartPort, pStartPortPoint, pEndPort, pEndPortPoint];
            }

            return [pEndPort, pEndPortPoint, pStartPort, pStartPortPoint];
        })();

        // Remove old area.
        this.removePathArea(lStartPort);

        // Calculate path.
        const lPath: AstarResult<PotatnoUiManagerGridPathFindingPoint> = this.start(lStartPortPoint, lEndPortPoint);

        // First of all assign the path to the port.
        this.mGridPaths.set(lStartPort, lPath.path);

        // Create node ids for both entry points of the path.
        const lPathEntryPointStart: PotatnoUiManagerGridPathFindingNodeId = this.nodeId(pStartPortPoint);
        const lPathEntryPointEnd: PotatnoUiManagerGridPathFindingNodeId = this.nodeId(pEndPortPoint);

        // Assign port to its correct path node id. 
        for (const lPathItem of lPath.path) {
            // Convert item into its node id.
            const lPortAreaPoint: PotatnoUiManagerGridPathFindingNodeId = this.nodeId(lPathItem);

            // Read current point information. Create a new if not already existing.
            const lPathAreaCell: PotatnoUiManagerGridPathFindingPathAreaCell = (() => {
                if (!this.mPathArea.has(lPortAreaPoint)) {
                    return {
                        ports: new Map<PotatnoDocumentPort<PotatnoProjectTypesDefinition>, [PotatnoUiManagerGridPathFindingNodeId, PotatnoUiManagerGridPathFindingNodeId]>(),
                        entryPoints: new Set<PotatnoUiManagerGridPathFindingNodeId>()
                    };
                }

                return this.mPathArea.get(lPortAreaPoint)!;
            })();

            // Add port and port point to area cell.
            lPathAreaCell.ports.set(lStartPort, [lPathEntryPointStart, lPathEntryPointEnd]);
            lPathAreaCell.entryPoints.add(lPathEntryPointStart);
            lPathAreaCell.entryPoints.add(lPathEntryPointEnd);

            // Update path area cell.
            this.mPathArea.set(lPortAreaPoint, lPathAreaCell);
        }
    }

    /**
     * Add or update the node areas for a node.
     * 
     * @param pNode - Node.
     */
    public updateNodeArea(pNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition>): void {
        // Remove old areas.
        this.removeNodeArea(pNode);

        // Read node position and dimension.
        const lPositionX: number = pNode.transformation.x;
        const lPositionY: number = pNode.transformation.y;
        const lWidth: number = pNode.transformation.width;
        const lHeight: number = pNode.transformation.height;

        // Read current grid area.
        const lNewNodeArea: Array<PotatnoUiManagerGridPathFindingNodeId> = new Array<PotatnoUiManagerGridPathFindingNodeId>();

        // Iterate over each node area.
        for (let lX: number = 0; lX < lWidth; lX++) {
            for (let lY: number = 0; lY < lHeight; lY++) {
                // Construct grid point.
                const lGridNodePoint: PotatnoUiManagerGridPathFindingNodeId = `${lX + lPositionX}|${lY + lPositionY}`;

                // Increase grid point count.
                const lGridPointCount: number = (this.mNodeArea.get(lGridNodePoint) ?? 0) + 1;
                this.mNodeArea.set(lGridNodePoint, lGridPointCount);

                // Add point to node area.
                lNewNodeArea.push(lGridNodePoint);
            }
        }

        // Update nodes area.
        this.mGridNodeArea.set(pNode, lNewNodeArea);
    }

    /**
     * Calculate the cost of the traversal between two adjacent nodes.
     * Cost starts with one and gets shaped with modifiers for the visual path.
     * 
     * @param pNode - Node the path wants to traverse.
     * @param pPathInformation - Path information that leads to the current node.
     */
    protected override costOfTraversal(pNode: PotatnoUiManagerGridPathFindingPoint, pPathInformation: AstarPathInformation<PotatnoUiManagerGridPathFindingPoint>): number {
        // Convert node point into grid point.
        const lGridPoint: PotatnoUiManagerGridPathFindingNodeId = this.nodeId(pNode);

        let lCost: number = 1;

        // Node bodies are hard barriers. Ports are handled above as the start or end node.
        if (this.mNodeArea.has(lGridPoint) && pNode !== pPathInformation.endNode) {
            lCost *= 20;
        }

        // Existing path cells are allowed, but make crossing them more expensive than using a free lane.
        if (this.mPathArea.has(lGridPoint)) {
            const lEntryPoints: PotatnoUiManagerGridPathFindingPathAreaCell = this.mPathArea.get(lGridPoint)!;

            // If this path share one of the entry point, guid the path over it.
            const lStartPoint: PotatnoUiManagerGridPathFindingNodeId = this.nodeId(pPathInformation.startNode);
            const lEndPoint: PotatnoUiManagerGridPathFindingNodeId = this.nodeId(pPathInformation.endNode);
            if (lEntryPoints.entryPoints.has(lStartPoint) || lEntryPoints.entryPoints.has(lEndPoint)) {
                lCost *= 0.2;
            } else {
                lCost *= 5;
            }
        }

        // Read previous path nodes once so all path-shaping stays in traversal cost.
        const lPreviousNode: PotatnoUiManagerGridPathFindingPoint | undefined = pPathInformation.path.next().value as PotatnoUiManagerGridPathFindingPoint | undefined;
        if (lPreviousNode) {
            const lIsHorizontalMovement: boolean = pNode.y === lPreviousNode.y;

            // Keep the port entry or exit horizontal instead of approaching the node from top or bottom.
            if ((pNode === pPathInformation.endNode || lPreviousNode === pPathInformation.startNode) && !lIsHorizontalMovement) {
                lCost *= 100;
            }

            // Continue in the same direction when possible to avoid unnecessary bends.
            const lPreviousPreviousNode: PotatnoUiManagerGridPathFindingPoint | undefined = pPathInformation.path.next().value as PotatnoUiManagerGridPathFindingPoint | undefined;
            if (lPreviousPreviousNode && (pNode.x === lPreviousPreviousNode.x || pNode.y === lPreviousPreviousNode.y)) {
                lCost *= 0.7;
            }
        }

        // Calculate if the current point is closer to start or end port.
        const lDistanceStartX: number = Math.abs(pNode.x - pPathInformation.startNode.x);
        const lDistanceEndX: number = Math.abs(pNode.x - pPathInformation.endNode.x);
        const lIsStartSide: boolean = lDistanceStartX <= lDistanceEndX;

        // Depending on the current distance to the entry or exit, preferr to stay on the same height.
        if (lIsStartSide && pNode.y === pPathInformation.startNode.y) {
            lCost *= 0.5;
        } else if (!lIsStartSide && pNode.y === pPathInformation.endNode.y) {
            lCost *= 0.5;
        }

        // Prefer the start y-lane before the midpoint and the end y-lane after the midpoint.
        const lMiddleCoordinateX: number = (pPathInformation.endNode.x + pPathInformation.startNode.x) >> 1;
        if (pNode.x === lMiddleCoordinateX) {
            lCost *= 0.5;
        }

        return lCost;
    }

    /**
     * Heuristic calculation.
     * Only estimates remaining distance. Path-shaping costs live in {@link costOfTraversal}.
     * 
     * @param pNode - Current node where the heuristic should be calculated for.
     * @param pPathInformation - Path information that leads to the current node.
     * 
     * @return cost of the path between the current and end node.
     */
    protected override heuristic(pNode: PotatnoUiManagerGridPathFindingPoint, pPathInformation: AstarPathInformation<PotatnoUiManagerGridPathFindingPoint>): number {
        const lWeighting: number = 0.5;

        // Calculate plain Manhattan distance so the heuristic does not predict preferred path shapes.
        return (Math.abs(pNode.x - pPathInformation.endNode.x) + Math.abs(pNode.y - pPathInformation.endNode.y)) * lWeighting;
    }

    /**
     * Get all neighbor nodes of the center node.
     * 
     * @param pNode - Center node.
     * 
     * @returns All neighbor nodes. 
     */
    protected override neighborNodes(pNode: PotatnoUiManagerGridPathFindingPoint): Array<PotatnoUiManagerGridPathFindingPoint> {
        // Collect grid neighbors.
        return [
            { x: pNode.x, y: pNode.y - 1 },
            { x: pNode.x - 1, y: pNode.y },
            { x: pNode.x + 1, y: pNode.y },
            { x: pNode.x, y: pNode.y + 1 }
        ];
    }

    /**
     * Create a deterministic id for a node.
     * 
     * @param pNode - Node.
     *
     * @return node id. 
     */
    protected override nodeId(pNode: PotatnoUiManagerGridPathFindingPoint): PotatnoUiManagerGridPathFindingNodeId {
        return `${pNode.x}|${pNode.y}`;
    }

    /**
     * Remove any port area from path finding.
     * 
     * @param pPort - Port.
     */
    private removePathArea(pPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>): void {
        // When nothing to remove, remove nothing. Yes. That comment makes sense.
        if (!this.mGridPaths.has(pPort)) {
            return;
        }

        // Read current grid area.
        const lCurrentPathArea: Array<PotatnoUiManagerGridPathFindingPoint> = this.mGridPaths.get(pPort)!;

        // Remove old port area.
        for (const lPathItem of lCurrentPathArea) {
            // Convert item into its node id.
            const lPortAreaPoint: PotatnoUiManagerGridPathFindingNodeId = this.nodeId(lPathItem);

            // Read current count. Update count or delete if count is zero.
            const lPathAreaCell: PotatnoUiManagerGridPathFindingPathAreaCell | undefined = this.mPathArea.get(lPortAreaPoint);
            if (!lPathAreaCell) {
                continue;
            }

            // Read port start point for this port.
            const lPortEntryPoints: [PotatnoUiManagerGridPathFindingNodeId, PotatnoUiManagerGridPathFindingNodeId] | undefined = lPathAreaCell.ports.get(pPort);
            if (!lPortEntryPoints) {
                continue;
            }

            // Remove port from point.
            lPathAreaCell.ports.delete(pPort);
            lPathAreaCell.entryPoints.delete(lPortEntryPoints[0]);
            lPathAreaCell.entryPoints.delete(lPortEntryPoints[1]);

            // When no port occupies this point, remove the whole cell referrence.
            if (lPathAreaCell.ports.size === 0) {
                this.mPathArea.delete(lPortAreaPoint);
            } else {
                this.mPathArea.set(lPortAreaPoint, lPathAreaCell);
            }
        }

        // Reset old area.
        this.mGridPaths.delete(pPort);
    }
}

type PotatnoUiManagerGridPathFindingNodeId = `${number}|${number}`;

type PotatnoUiManagerGridPathFindingPathAreaCell = {
    /**
     * Mapping of ports to their start and end point.
     */
    ports: Map<PotatnoDocumentPort<PotatnoProjectTypesDefinition>, [PotatnoUiManagerGridPathFindingNodeId, PotatnoUiManagerGridPathFindingNodeId]>;

    /**
     * List of all start and end points of paths of this path area.
     */
    entryPoints: Set<PotatnoUiManagerGridPathFindingNodeId>;
};

export type PotatnoUiManagerGridPathFindingPoint = {
    x: number;
    y: number;
};
