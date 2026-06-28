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
     * Cost is usually one, but can be different for each node.
     * 
     * @param pNode - Node the path wants to traverse.
     * @param pPathInformation - Path information that leads to the current node.
     */
    protected override costOfTraversal(pNode: PotatnoUiManagerGridPathFindingPoint, pPathInformation: AstarPathInformation<PotatnoUiManagerGridPathFindingPoint>): number {
        // Start node allways has default cost. Ignore any node areas.
        if (pNode === pPathInformation.startNode) {
            return 1;
        }

        // End node is only viable when its comes from a direct x navigation.
        if (pNode === pPathInformation.endNode) {
            // Read previous node.
            const lPreviousNode: PotatnoUiManagerGridPathFindingPoint | undefined = pPathInformation.path.next().value as PotatnoUiManagerGridPathFindingPoint | undefined;

            // Discourage y movements.
            if (lPreviousNode && lPreviousNode.y !== pNode.y) {
                return 6;
            }

            return 1;
        }

        // Convert node point into grid point.
        const lGridPoint: PotatnoUiManagerGridPathFindingNodeId = `${pNode.x}|${pNode.y}`;

        // Never go inside node areas unless no other path can be used.
        if (this.mNodeArea.has(lGridPoint)) {
            // FYI: dont make it 1000. It kills the site when the user hovers over a node.
            return 10;
        }

        // Preferr not to cross other paths.
        if (this.mPathArea.has(lGridPoint)) {
            return 1.5;
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
    protected override heuristic(pNode: PotatnoUiManagerGridPathFindingPoint, pPathInformation: AstarPathInformation<PotatnoUiManagerGridPathFindingPoint>): number {
        // Calculate additional navigation cost for each node.
        let lNavigationCost = (() => {
            // Set default navigation cost.
            let lCost: number = 5;

            const lPrevious: PotatnoUiManagerGridPathFindingPoint | undefined = pPathInformation.path.next().value as PotatnoUiManagerGridPathFindingPoint | undefined;
            if (lPrevious) {
                // Comming from a start node, x navigation should by highly preferred.
                if (lPrevious === pPathInformation.startNode && (pNode.y !== lPrevious.y || pNode.x !== (lPrevious.x + 1))) {
                    lCost *= 6;
                }

                // TODO: Maybe more?
            }

            // Read pre previous node, mainly to detect curves. Preferr steight paths. Discouraging curves.
            const lPreviousPrevious: PotatnoUiManagerGridPathFindingPoint | undefined = pPathInformation.path.next().value as PotatnoUiManagerGridPathFindingPoint | undefined;
            if (lPreviousPrevious && (pNode.x === lPreviousPrevious.x || pNode.y === lPreviousPrevious.y)) {
                lCost *= 0.8;
            }

            // Calculate the middle point x between the start and end node.
            const lMiddleCoordinateX = (pPathInformation.endNode.x + pPathInformation.startNode.x) >> 1;

            // Prefer middle paths.
            if (pNode.x !== lMiddleCoordinateX) {
                lCost *= 0.1;
            }

            return lCost;
        })();


        // Culculate the distance to the end point.
        let lPathDistance: number = Math.abs(pNode.x - pPathInformation.endNode.x) + Math.abs(pNode.y - pPathInformation.endNode.y);

        // Add the navigation cost to the path cost and use it as a rougth path cost.
        lPathDistance += lNavigationCost;

        // Add weighing. That speeds up path finding but reduces accuracy.
        lPathDistance *= 5;

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