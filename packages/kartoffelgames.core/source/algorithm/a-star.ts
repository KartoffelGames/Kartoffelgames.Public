/**
 * A* search algorithm.
 * Graph search version.
 */
export abstract class Astar<TNode> {
    /**
     * Start pathfinding from start to end node.
     * 
     * @param pStartNode - Start node. 
     * @param pEndNode - End node.
     *  
     * @returns the path finding result. 
     */
    public start(pStartNode: TNode, pEndNode: TNode): AstarResult<TNode> {
        // Create open nodes list and initialize it with the starting point.
        // The list should allways be sorted from highest to lowest guessed cost where the highest cost is on index [0].
        const lOpenNodes: Array<TNode> = new Array<TNode>();
        const lOpenNodesSet: Set<TNode> = new Set<TNode>();
        lOpenNodes.push(pStartNode);
        lOpenNodesSet.add(pStartNode);

        // Cost for a path that goes from start to this node. Initialize with the starting node as zero cost.
        const lNodePathCost: Map<TNode, number> = new Map<TNode, number>();
        lNodePathCost.set(pStartNode, 0);

        // Maping for the guesses of a path cost between the node and the end node.
        const lNodePathCostGuess: Map<TNode, number> = new Map<TNode, number>();
        lNodePathCostGuess.set(pStartNode, this.heuristic(pStartNode, {
            startNode: pStartNode,
            endNode: pEndNode,
            path: new Array<TNode>().values()
        }));

        // Map to trace back nodes.
        const lBestParentNodeMap: Map<TNode, TNode> = new Map<TNode, TNode>();

        // Save processed nodes for monitoring reasons.
        const lProcessedNodes: Array<TNode> = new Array<TNode>();

        // Let the pathing begin.
        while (lOpenNodes.length !== 0) {
            // Get the node with the lowest guessed cost. Should be easy as the open paths are 
            const lCurrentNode: TNode = lOpenNodes.pop()!;
            lOpenNodesSet.delete(lCurrentNode);

            // Add node to processed list.
            lProcessedNodes.push(lCurrentNode);

            // When current node is the end node. Rebuild path.
            if (this.nodesAreEqual(lCurrentNode, pEndNode)) {
                // Create path from current node to the start node.
                return {
                    path: [...this.pathTracer(lCurrentNode, lBestParentNodeMap)].reverse(),
                    processedNodes: lProcessedNodes
                };
            }

            // Get all neighbors of the current node.
            for (const lNeighbor of this.neighborNodes(lCurrentNode)) {
                // Get the path cost with the neighbor for the path of current node and the cost of the best path with the neighbor.
                const lTentativePathCost: number = (lNodePathCost.get(lCurrentNode) ?? Number.MAX_SAFE_INTEGER) + this.costOfTraversal(lNeighbor, {
                    startNode: pStartNode,
                    endNode: pEndNode,

                    // Path that ends with the previous node.
                    path: this.pathTracer(lCurrentNode, lBestParentNodeMap)
                });

                const lNeighborPathCost: number = lNodePathCost.get(lNeighbor) ?? Number.MAX_SAFE_INTEGER;

                // Tentative cost is smaller, when either the neighbor had no calculated cost,
                // Or a better path with this neighbor was previously traversed.
                if (lTentativePathCost >= lNeighborPathCost) {
                    continue;
                }

                // When the cost of the current node path is better than the previous path with the neighbor node, override the best parent of the neighbor with the current node.
                lBestParentNodeMap.set(lNeighbor, lCurrentNode);

                // Save new, better path costs.
                lNodePathCost.set(lNeighbor, lTentativePathCost);

                // Save the new updated path cost guess.
                lNodePathCostGuess.set(lNeighbor, lTentativePathCost + this.heuristic(lNeighbor, {
                    startNode: pStartNode,
                    endNode: pEndNode,

                    // Path that ends with the previous node.
                    path: this.pathTracer(lCurrentNode, lBestParentNodeMap)
                }));

                // Add node when it does not exist any more.
                if (!lOpenNodesSet.has(lNeighbor)) {
                    lOpenNodesSet.add(lNeighbor);

                    // Add node into open node list in order.
                    this.insertNodeSorted(lOpenNodes, lNeighbor, lNodePathCostGuess);
                }
            }
        }

        // A path could not be found.
        return {
            path: new Array<TNode>(),
            processedNodes: lProcessedNodes
        };
    }

    /**
     * Add node into an array in order from highest to lowest cost where the highest cost is on index [0].
     * 
     * @param pTargetArray - Target array.
     * @param pNode - Node to add.
     * @param pCostMapping - The cost mapping for each node.
     */
    private insertNodeSorted(pTargetArray: Array<TNode>, pNode: TNode, pCostMapping: Map<TNode, number>): void {
        // Get nodes cost.
        const lNodeCost: number = pCostMapping.get(pNode) ?? Number.MAX_SAFE_INTEGER;

        const lCostOfIndex = (pIndex: number) => {
            return pCostMapping.get(pTargetArray[pIndex]) ?? Number.MAX_SAFE_INTEGER;
        };

        // Binary search sorted array for the target index.
        const lTargetIndex: number = (() => {
            // Array is empty or cost is higher than anything. Insert at bottom.
            if (pTargetArray.length === 0 || lNodeCost > lCostOfIndex(0)) {
                return 0;
            }

            // Cost is lowest, insert at top.
            if (lNodeCost < lCostOfIndex(pTargetArray.length - 1)) {
                return pTargetArray.length;
            }

            // Start searching in full range.
            let lMinIndex = 0;
            let lMaxIndex = pTargetArray.length - 1;

            while (lMinIndex <= lMaxIndex) {
                // Find middle index between min and max index.
                const lCenterIndex = (lMaxIndex + lMinIndex) >> 1;

                if (lNodeCost < lCostOfIndex(lCenterIndex)) {
                    lMinIndex = lCenterIndex + 1;
                } else if (lNodeCost > lCostOfIndex(lCenterIndex)) {
                    lMaxIndex = lCenterIndex - 1;
                } else {
                    return lCenterIndex;
                }
            }

            return -lMinIndex - 1;
        })();

        // Insert node at target index.
        pTargetArray.splice(lTargetIndex, 0, pNode);
    }

    /**
     * Rebuild path back until start the start node is reached.
     * 
     * @param pEndNode - End node of path.
     * @param pParentMap - Backwards mapping of node to parent for each traversed node.
     * 
     * @returns the path from start to end. 
     */
    private *pathTracer(pEndNode: TNode, pParentMap: Map<TNode, TNode>): Generator<TNode, void, unknown> {
        // Traverse back until start is reached.
        let lCurrentNode: TNode | undefined = pEndNode;
        do {
            // Add node to path.
            yield lCurrentNode;
        } while (!!(lCurrentNode = pParentMap.get(lCurrentNode)));
    }

    /**
     * Calculate the cost of the traversal between two adjacent nodes.
     * Cost is usually one, but can be different for each node.
     * 
     * @param pNode - Node the path wants to traverse.
     * @param pPathInformation - Path information that leads to the current node.
     * 
     * @return cost of node.
     */
    protected abstract costOfTraversal(pNode: TNode, pPathInformation: AstarPathInformation<TNode>): number;

    /**
     * Calculate a cost that describes the cost for a direct path from the current node to the end node.  
     * 
     * @param pNode - Current node where the heuristic should be calculated for.
     * @param pPathInformation - Path information that leads to the current node.
     * 
     * @return cost of the path between the current and end node.
     */
    protected abstract heuristic(pNode: TNode, pPathInformation: AstarPathInformation<TNode>): number;

    /**
     * Get all neighbors of a node.
     * 
     * @param pNode - Target node with neighbors.
     * 
     * @return all neighbors of the node. 
     */
    protected abstract neighborNodes(pNode: TNode): Array<TNode>;

    /**
     * Compare two nodes for equality.
     * 
     * @param pNodeA - Node a.
     * @param pNodeB - Node b.
     * 
     * @returns comparison result.
     */
    protected abstract nodesAreEqual(pNodeA: TNode, pNodeB: TNode): boolean;
}

export type AstarResult<TNode> = {
    path: Array<TNode>;
    processedNodes: Array<TNode>;
};

export type AstarPathInformation<TNode> = {
    startNode: TNode;
    endNode: TNode;
    path: Iterator<TNode, void, unknown>;
};