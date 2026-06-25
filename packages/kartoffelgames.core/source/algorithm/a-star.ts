
export abstract class Astar<TNode> {

    public start(pStart: TNode, pEnd: TNode): Array<TNode> {
        // Create open nodes list and initialize it with the starting point.
        // The list should allways be sorted from highest to lowest guessed cost where the highest cost is on index [0].
        const lOpenNodes: Array<TNode> = new Array<TNode>();
        lOpenNodes.push(pStart);

        // Cost for a path that goes from start to this node. Initialize with the starting node as zero cost.
        const lNodePathCost: Map<TNode, number> = new Map<TNode, number>();
        lNodePathCost.set(pStart, 0);

        // Maping for the guesses of a path cost between the node and the end node.
        const lNodePathCostGuess: Map<TNode, number> = new Map<TNode, number>();
        lNodePathCostGuess.set(pStart, this.heuristic(pStart, pEnd));

        // Map to trace back nodes.
        const lParentMap: Map<TNode, TNode> = new Map<TNode, TNode>();

        // Let the pathing begin.
        while (lOpenNodes.length !== 0) {
            // Get the node with the lowest guessed cost. Should be easy as the open paths are 
            const lCurrentNode: TNode = lOpenNodes.pop()!;

            if (this.compareNode(lCurrentNode, pEnd) === 0) {
                // TODO: Create path from current node to the start node.
                return;
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
     * Calculate a cost that describes the cost for a direct path from the current node to the end node.  
     * 
     * @param pCurrentNode - Current node where the heuristic should be calculated for.
     * @param pEndNode - End node of path.
     * 
     * @return cost of the path between the current and end node.
     */
    protected abstract heuristic(pCurrentNode: TNode, pEndNode: TNode): number;
}