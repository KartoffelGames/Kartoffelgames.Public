
export abstract class Astar<TNode> {

    public start(pStart: TNode, pEnd: TNode): Array<TNode> {
        // Create open nodes list and initialize it with the starting point.
        // The list should allways be sorted from highest to lowest guessed cost where the highest cost is on index [0].
        const lOpenNodes: Array<TNode> = new Array<TNode>();
        const lOpenNodesSet: Set<TNode> = new Set<TNode>();
        lOpenNodes.push(pStart);
        lOpenNodesSet.add(pStart);

        // Cost for a path that goes from start to this node. Initialize with the starting node as zero cost.
        const lNodePathCost: Map<TNode, number> = new Map<TNode, number>();
        lNodePathCost.set(pStart, 0);

        // Maping for the guesses of a path cost between the node and the end node.
        const lNodePathCostGuess: Map<TNode, number> = new Map<TNode, number>();
        lNodePathCostGuess.set(pStart, this.heuristic(pStart, pEnd));

        // Map to trace back nodes.
        const lBestParentNodeMap: Map<TNode, TNode> = new Map<TNode, TNode>();

        // Let the pathing begin.
        while (lOpenNodes.length !== 0) {
            // Get the node with the lowest guessed cost. Should be easy as the open paths are 
            const lCurrentNode: TNode = lOpenNodes.pop()!;
            lOpenNodesSet.delete(lCurrentNode);

            // When current node is the end node. Rebuild path.
            if (this.compareNode(lCurrentNode, pEnd) === 0) {
                // Create path from current node to the start node.
                return this.rebuildPath(lCurrentNode, lBestParentNodeMap);
            }

            // Get all neighbors of the current node.
            for (const lNeighbor of this.neighborNodes(lCurrentNode)) {
                // Get the path cost with the neighbor for the path of current node and the cost of the best path with the neighbor.
                const lTentativePathCost: number = (lNodePathCost.get(lCurrentNode) ?? Number.MAX_SAFE_INTEGER) + this.costOfTraversal(lNeighbor, lCurrentNode);
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
                lNodePathCostGuess.set(lNeighbor, lTentativePathCost + this.heuristic(lNeighbor, pEnd));

                // Add node when it does not exist any more.
                if (!lOpenNodesSet.has(lNeighbor)) {
                    lOpenNodesSet.add(lNeighbor);

                    // Add node into open node list in order.
                    this.insertNodeSorted(lOpenNodes, lNeighbor, lNodePathCostGuess);
                }
            }
        }

        // A path could not be found.
        return new Array<TNode>();
    }

    /**
     * Compare two nodes.
     * When node a is greater than b return 1.
     * When node a is smaller than b return -1-
     * Otherwise both are equal, return 0;
     * 
     * @param pNodeA - Node a.
     * @param pNodeB - Node b.
     * 
     * @returns comparison result.
     */
    protected abstract compareNode(pNodeA: TNode, pNodeB: TNode): number;

    /**
     * Calculate the cost of the traversal between two adjacent nodes.
     * Cost is usually one, but can be different for each nodex.
     * 
     * @param pNode - Node the path wants to traverse.
     * @param pCurrentNode - Node the path currently stands.
     */
    protected abstract costOfTraversal(pNode: TNode, pCurrentNode: TNode): number;

    /**
     * Calculate a cost that describes the cost for a direct path from the current node to the end node.  
     * 
     * @param pCurrentNode - Current node where the heuristic should be calculated for.
     * @param pEndNode - End node of path.
     * 
     * @return cost of the path between the current and end node.
     */
    protected abstract heuristic(pCurrentNode: TNode, pEndNode: TNode): number;

    /**
     * Get all neighbors of a node.
     * 
     * @param pNode - Target node with neighbors.
     * 
     * @return all neighbors of the node. 
     */
    protected abstract neighborNodes(pNode: TNode): Array<TNode>;

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
                let lCenterIndex = (lMaxIndex + lMinIndex) >> 1;

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
     * Rebuild path back until start.
     * 
     * @param pEndNode - End node of path.
     * @param pParentMap - Backwards mapping of node to parent for each traversed node.
     * 
     * @returns the path from start to end. 
     */
    private rebuildPath(pEndNode: TNode, pParentMap: Map<TNode, TNode>): Array<TNode> {
        const lReversePath: Array<TNode> = new Array<TNode>();

        // Traverse back until start is reached.
        let lCurrentNode: TNode | undefined;
        while (!!(lCurrentNode = pParentMap.get(pEndNode))) {
            // Add node to path.
            lReversePath.push(lCurrentNode);
        }

        return lReversePath.reverse();
    }
}