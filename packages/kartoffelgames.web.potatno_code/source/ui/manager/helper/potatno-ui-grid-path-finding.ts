import { Astar, type AstarPathInformation } from '@kartoffelgames/core';
import type { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';

/**
 * A* path finding for grid connections.
 */
export class PotatnoUiGridPathFinding extends Astar<PotatnoUiManagerGridPathFindingPoint> {
    private readonly mGridNodeArea: WeakMap<PotatnoDocumentNode<PotatnoProjectTypesDefinition>, PotatnoUiManagerGridPathFindingNodeArea>;
    private readonly mNodeArea: Map<PotatnoUiManagerGridPathFindingNodeId, number>;
    private readonly mPathArea: Map<PotatnoUiManagerGridPathFindingNodeId, number>;

    /**
     * Constructor.
     */
    public constructor() {
        super();

        // Initialize node area configurations.
        this.mGridNodeArea = new WeakMap<PotatnoDocumentNode<PotatnoProjectTypesDefinition>, PotatnoUiManagerGridPathFindingNodeArea>();

        // Different node areas and their count of how many entities are present.
        this.mNodeArea = new Map<PotatnoUiManagerGridPathFindingNodeId, number>();
        this.mPathArea = new Map<PotatnoUiManagerGridPathFindingNodeId, number>();
    }

    public clear(): void {
        this.mNodeArea.clear();
        this.mPathArea.clear();
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
        lCurrentNodeArea.area = new Array<PotatnoUiManagerGridPathFindingNodeId>();
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
        const lCurrentNodeArea: PotatnoUiManagerGridPathFindingNodeArea = this.mGridNodeArea.get(pNode) ?? {
            area: new Array<PotatnoUiManagerGridPathFindingNodeId>(),
        };

        // Iterate over each node area.
        for (let lX: number = 0; lX < lWidth; lX++) {
            for (let lY: number = 0; lY < lHeight; lY++) {
                // Construct grid point.
                const lGridNodePoint: PotatnoUiManagerGridPathFindingNodeId = `${lX + lPositionX}|${lY + lPositionY}`;

                // Increase grid point count.
                const lGridPointCount: number = (this.mNodeArea.get(lGridNodePoint) ?? 0) + 1;
                this.mNodeArea.set(lGridNodePoint, lGridPointCount);

                // Add point to node area.
                lCurrentNodeArea.area.push(lGridNodePoint);
            }
        }

        // Update nodes area.
        this.mGridNodeArea.set(pNode, lCurrentNodeArea);
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
        const lGridPoint: PotatnoUiManagerGridPathFindingNodeId = `${pNode.x}|${pNode.y}`;

        let lCost: number = 1;

        // Node bodies are hard barriers. Ports are handled above as the start or end node.
        if (this.mNodeArea.has(lGridPoint) && pNode !== pPathInformation.endNode) {
            lCost *= 20;
        }

        // Existing path cells are allowed, but make crossing them more expensive than using a free lane.
        if (this.mPathArea.has(lGridPoint)) {
            lCost *= 1.5;
        }

        // Read previous path nodes once so all path-shaping stays in traversal cost.
        const lPreviousNode: PotatnoUiManagerGridPathFindingPoint | undefined = pPathInformation.path.next().value as PotatnoUiManagerGridPathFindingPoint | undefined;
        if (lPreviousNode) {
            // End node can be inside a node area, but the connection should enter the port horizontally.
            if (pNode === pPathInformation.endNode && lPreviousNode.y !== pNode.y) {
                // Keep the final port entry horizontal instead of approaching the node from top or bottom.
                lCost *= 6;
            }

            const lIsHorizontalMovement: boolean = pNode.y === lPreviousNode.y;

            // Horizontal movement keeps the wire in predictable lanes, so vertical movement pays extra.
            if (!lIsHorizontalMovement) {
                lCost *= 1.5;
            }

            // The first step out of the start port should leave the node horizontally.
            if (lPreviousNode === pPathInformation.startNode && !lIsHorizontalMovement) {
                lCost *= 6;
            }

            // Continue in the same direction when possible to avoid unnecessary bends.
            const lPreviousPreviousNode: PotatnoUiManagerGridPathFindingPoint | undefined = pPathInformation.path.next().value as PotatnoUiManagerGridPathFindingPoint | undefined;
            if (lPreviousPreviousNode && (pNode.x === lPreviousPreviousNode.x || pNode.y === lPreviousPreviousNode.y)) {
                lCost *= 0.9;
            }
        }

        // Prefer the start y-lane before the midpoint and the end y-lane after the midpoint.
        const lMiddleCoordinateX: number = (pPathInformation.endNode.x + pPathInformation.startNode.x) >> 1;
        const lIsFirstHalf: boolean = (() => {
            if (pPathInformation.startNode.x <= pPathInformation.endNode.x) {
                return pNode.x < lMiddleCoordinateX;
            }

            return pNode.x > lMiddleCoordinateX;
        })();
        if (lIsFirstHalf && pNode.y === pPathInformation.startNode.y) {
            lCost *= 0.5;
        } else if (!lIsFirstHalf && pNode.y === pPathInformation.endNode.y) {
            lCost *= 0.5;
        }

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
        const lWeighting: number = 5;

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
}

type PotatnoUiManagerGridPathFindingNodeArea = {
    area: Array<PotatnoUiManagerGridPathFindingNodeId>;
};

type PotatnoUiManagerGridPathFindingNodeId = `${number}|${number}`;

export type PotatnoUiManagerGridPathFindingPoint = {
    x: number;
    y: number;
};
