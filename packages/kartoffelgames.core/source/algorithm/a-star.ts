import { Exception } from '../exception/exception.ts';

/**
 * A* search algorithm.
 * Graph search version.
 * 
 * Nodes are cached between calls. THATS A FEATURE!!!!
 */
export abstract class Astar<TNode> {
    private readonly mNodeCache: Map<PropertyKey, TNode>;

    /**
     * Constructor.
     * Initializes new node cache.
     */
    public constructor() {
        this.mNodeCache = new Map<PropertyKey, TNode>();
    }

    /**
     * Start pathfinding from start to end node.
     * 
     * @param pStartNode - Start node. 
     * @param pEndNode - End node.
     *  
     * @returns the path finding result. 
     */
    public start(pStartNode: TNode, pEndNode: TNode): AstarResult<TNode> {
        // Read start and end node from cache or cache them.
        const lStartNode: TNode = this.readFromCache(pStartNode);
        const lEndNode: TNode = this.readFromCache(pEndNode);

        // Create open nodes list and initialize it with the starting point.
        const lOpenNodes: AstarPriorityList<TNode> = new AstarPriorityList<TNode>();
        lOpenNodes.set(lStartNode, 0);

        // Cost for a path that goes from start to this node. Initialize with the starting node as zero cost.
        const lNodePathCost: Map<TNode, number> = new Map<TNode, number>();
        lNodePathCost.set(lStartNode, 0);

        // Map to trace back nodes.
        const lBestParentNodeMap: Map<TNode, TNode> = new Map<TNode, TNode>();

        // Save processed nodes for monitoring reasons.
        const lProcessedNodes: Array<TNode> = new Array<TNode>();

        // Let the pathing begin.
        while (lOpenNodes.length !== 0) {
            // Get the node with the lowest guessed cost. Should be easy as the open paths are 
            const lCurrentNode: TNode = lOpenNodes.popLowest();

            // Add node to processed list.
            lProcessedNodes.push(lCurrentNode);

            // When current node is the end node. Rebuild path.
            if (lCurrentNode === lEndNode) {
                // Create path from current node to the start node.
                return {
                    path: [...this.pathTracer(lCurrentNode, lBestParentNodeMap)].reverse(),
                    processedNodes: lProcessedNodes
                };
            }

            // Get all neighbors of the current node.
            for (const lNeighbor of this.getNeighborNodes(lCurrentNode)) {
                // Get the path cost with the neighbor for the path of current node and the cost of the best path with the neighbor.
                const lTentativePathCost: number = (lNodePathCost.get(lCurrentNode) ?? Number.POSITIVE_INFINITY) + this.costOfTraversal(lNeighbor, {
                    startNode: lStartNode,
                    endNode: lEndNode,

                    // Path that ends with the previous node.
                    path: this.pathTracer(lCurrentNode, lBestParentNodeMap)
                });

                const lNeighborPathCost: number = lNodePathCost.get(lNeighbor) ?? Number.POSITIVE_INFINITY;

                // Tentative cost is smaller, when either the neighbor had no calculated cost,
                // Or a better path with this neighbor was previously traversed.
                if (lTentativePathCost >= lNeighborPathCost) {
                    continue;
                }

                // When the cost of the current node path is better than the previous path with the neighbor node, override the best parent of the neighbor with the current node.
                lBestParentNodeMap.set(lNeighbor, lCurrentNode);

                // Save new, better path costs.
                lNodePathCost.set(lNeighbor, lTentativePathCost);

                // Calculaze the cost of the path to the neighbor.
                const lNeighborCostGuess: number = lTentativePathCost + this.heuristic(lNeighbor, {
                    startNode: lStartNode,
                    endNode: lEndNode,

                    // Path that ends with the previous node.
                    path: this.pathTracer(lCurrentNode, lBestParentNodeMap)
                });

                // Add node to potential path nodes. Does not dublicate.
                lOpenNodes.set(lNeighbor, lNeighborCostGuess);
            }
        }

        // A path could not be found.
        return {
            path: new Array<TNode>(),
            processedNodes: lProcessedNodes
        };
    }

    /**
     * Get all neighbors of a node.
     * Uses cached nodes when possible to keep the references straight.
     * 
     * @param pNode - Target node with neighbors.
     * 
     * @return all neighbors of the node. 
     */
    private getNeighborNodes(pNode: TNode): Array<TNode> {
        // Read neighbor nodes. When a node is iterated that has the same id as a cached, use the cached.
        return this.neighborNodes(pNode).map((pNeighborNode) => {
            return this.readFromCache(pNeighborNode);
        });
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
        while (true) {
            // Add node to path.
            yield lCurrentNode;

            // Skip yielding when no parent is found
            if (!pParentMap.has(lCurrentNode)) {
                break;
            }

            // Read next parent.
            lCurrentNode = pParentMap.get(lCurrentNode)!;
        }
    }

    /**
     * Read the internal reference of a node from cache.
     * Caches this reference when it is not already cached.
     * 
     * @param pNode - Node with a possible different internal reference.
     * 
     * @returns the internal reference of the node.
     */
    private readFromCache(pNode: TNode): TNode {
        const lNodeId: PropertyKey = this.nodeId(pNode);

        // Read from cache when node id is already cached.
        if (this.mNodeCache.has(lNodeId)) {
            return this.mNodeCache.get(lNodeId)!;
        }

        // Use new node and cache it.
        this.mNodeCache.set(lNodeId, pNode);
        return pNode;
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
     * Create a deterministic id for a node.
     * 
     * @param pNode - Node.
     */
    protected abstract nodeId(pNode: TNode): PropertyKey;
}

/**
 * Runtime optimized version for list, searchable by the lowest value.
 */
class AstarPriorityList<TNode> {
    private readonly mExistingNodes: Map<TNode, number>;
    private readonly mList: Array<AstarPriorityListItem<TNode>>;
    private mLowestCost: number;
    private mLowestCostCounter: number;

    /**
     * Length of list.
     */
    public get length(): number {
        return this.mList.length;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mList = new Array<AstarPriorityListItem<TNode>>();
        this.mExistingNodes = new Map<TNode, number>();

        // Initialize lowest cost as with max value.
        this.mLowestCost = Number.POSITIVE_INFINITY;
        this.mLowestCostCounter = 0;
    }

    /**
     * Pop off lowest cost item from list.
     * 
     * @returns the lowest cost item of the list.
     */
    public popLowest(): TNode {
        // Validate priority list.
        if (this.mList.length === 0) {
            throw new Exception('Can not read next node from an empty priority list.', this);
        }

        // Reverse search list to the lowest cost.
        const [lLowestItem, lFoundLowestCostCounter] = (() => {
            let lCurrentLowest: AstarPriorityListItem<TNode> | null = null;
            let lCurrentLowestCount: number = 0;

            for (let lItemIndex: number = this.mList.length - 1; lItemIndex > -1; lItemIndex--) {
                // Read current item.
                const lItem: AstarPriorityListItem<TNode> = this.mList[lItemIndex];

                // When a list global lowest cost is set, return the first occurrence. 
                if (lItem.cost === this.mLowestCost) {
                    return [lItem, 0];
                }

                // Update lowest. Reset counting of lowest.
                if (lCurrentLowest === null || lItem.cost < lCurrentLowest.cost) {
                    lCurrentLowest = lItem;
                    lCurrentLowestCount = 0;
                }

                // Count up item count with the same lowest cost.
                if (lItem.cost === lCurrentLowest.cost) {
                    lCurrentLowestCount++;
                }
            }

            if (lCurrentLowest === null) {
                throw new Exception('Lowest could not be found. Data is corrupted.', this);
            }

            return [lCurrentLowest, lCurrentLowestCount];
        })();

        // Update lowest cost. Cost can only be lower when no lowest cost was previously set.
        if (lLowestItem.cost < this.mLowestCost) {
            // Set lowest cost and reset counter.
            this.mLowestCost = lLowestItem.cost;
            this.mLowestCostCounter = lFoundLowestCostCounter;
        }

        // Decrease counter when nodes cost is current lowest.
        if (lLowestItem.cost === this.mLowestCost) {
            this.mLowestCostCounter--;
        }

        // Invalidate lowest cost cache.
        if (this.mLowestCostCounter < 1) {
            this.mLowestCost = Number.POSITIVE_INFINITY;
            this.mLowestCostCounter = 0;
        }

        // Get index of item.
        const lItemIndex: number = this.mExistingNodes.get(lLowestItem.node)!;

        // Get top item index and item.
        const lTopItemIndex: number = this.mList.length - 1;
        const lTopItem: AstarPriorityListItem<TNode> = this.mList[lTopItemIndex];

        // Switch with the top item.
        this.mList[lTopItemIndex] = lLowestItem;
        this.mList[lItemIndex] = lTopItem;
        this.mExistingNodes.set(lTopItem.node, lItemIndex);

        // Rmove found value item from mList and mExistingNode.
        this.mExistingNodes.delete(lLowestItem.node);
        return this.mList.pop()!.node;
    }

    /**
     * Add or update existing node with the specified cost.
     * 
     * @param pNode - Node. 
     * @param pCost - Node cost.
     */
    public set(pNode: TNode, pCost: number): void {
        // Update lowest cost.
        if (this.mLowestCostCounter > 0 && pCost < this.mLowestCost) {
            // Set lowest cost and reset counter.
            this.mLowestCost = pCost;
            this.mLowestCostCounter = 0;
        }

        // Increase counter when nodes cost is current lowest.
        if (pCost === this.mLowestCost) {
            this.mLowestCostCounter++;
        }

        // When node does exist, just update cost value.
        if (this.mExistingNodes.has(pNode)) {
            // Read current index of existing item.
            const lItemIndex: number = this.mExistingNodes.get(pNode)!;
            const lItem: AstarPriorityListItem<TNode> = this.mList[lItemIndex];

            // Skip if nothing has changed.
            if (lItem.cost === pCost) {
                // Because we prviously incremented the lowest cost counter, we need to decrease it again because the actual count has not changed.
                if (pCost === this.mLowestCost) {
                    this.mLowestCostCounter--;
                }
                return;
            }

            lItem.cost = pCost;
            return;
        }

        // Insert new item and store its index.
        this.mList.push({ cost: pCost, node: pNode });
        this.mExistingNodes.set(pNode, this.mList.length - 1);
    }
}

type AstarPriorityListItem<TNode> = {
    node: TNode;
    cost: number;
};

export type AstarResult<TNode> = {
    path: Array<TNode>;
    processedNodes: Array<TNode>;
};

export type AstarPathInformation<TNode> = {
    startNode: TNode;
    endNode: TNode;
    path: Iterator<TNode, void, unknown>;
};