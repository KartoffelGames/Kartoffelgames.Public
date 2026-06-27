import { Astar, AstarNeighborNode, type AstarPathInformation, type AstarResult } from '../../source/algorithm/a-star.ts';

/**
 * Astar adapter for the rendered grid.
 */
class PageAstar extends Astar<AstarGridNode> {
    private readonly mCostOfTraversal: PageAstarTraversalCostFunction;
    private readonly mHeuristic: PageAstarHeuristicFunction;
    private readonly mObstacleKeys: Set<string>;

    /**
     * Create a page astar instance.
     *
     * @param pParameter - Astar configuration.
     */
    public constructor(pParameter: PageAstarConstructorParameter) {
        super();

        // Assign configuration.
        this.mCostOfTraversal = pParameter.costOfTraversal;
        this.mHeuristic = pParameter.heuristic;
        this.mObstacleKeys = pParameter.obstacleKeys;
    }

    /**
     * Calculate traversal cost between two neighbor nodes.
     *
     * @param pNode - Target node.
     * @param pPathInformation - Path information that leads to the node. 
     *
     * @returns Traversal cost.
     */
    protected override costOfTraversal(pNode: AstarGridNode, pPathInformation: AstarPathInformation<AstarGridNode>): number {
        // Execute custom traversal cost.
        return this.mCostOfTraversal(pNode, pPathInformation);
    }

    /**
     * Calculate the heuristic between two nodes.
     *
     * @param pCurrentNode - Current node.
     * @param pPathInformation - Path information that leads to the node. 
     *
     * @returns Heuristic cost.
     */
    protected override heuristic(pCurrentNode: AstarGridNode, pPathInformation: AstarPathInformation<AstarGridNode>): number {
        // Execute custom heuristic.
        return this.mHeuristic(pCurrentNode, pPathInformation);
    }

    /**
     * Get walkable neighbor nodes.
     *
     * @param pNode - Source node.
     *
     * @returns Neighbor nodes.
     */
    protected override neighborNodes(pNode: AstarGridNode): Array<AstarGridNode> {
        // Collect grid neighbors.
        const lNeighborCoordinates: Array<AstarGridNode> = [
            { x: pNode.x, y: pNode.y - 1 },
            { x: pNode.x - 1, y: pNode.y },
            { x: pNode.x + 1, y: pNode.y },
            { x: pNode.x, y: pNode.y + 1 }
        ];

        // Filter invalid and blocked neighbors.
        const lNeighborNodes: Array<AstarGridNode> = new Array<AstarGridNode>();
        for (const lCoordinate of lNeighborCoordinates) {
            const lKey: string = AstarGrid.nodeKey(lCoordinate);
            if (lCoordinate.x < 0 || lCoordinate.x >= AstarGrid.GRID_SIZE || lCoordinate.y < 0 || lCoordinate.y >= AstarGrid.GRID_SIZE || this.mObstacleKeys.has(lKey)) {
                continue;
            }

            lNeighborNodes.push(lCoordinate);
        }

        return lNeighborNodes;
    }

    /**
     * Create a deterministic id for a node.
     * 
     * @param pNode - Node.
     */
    protected override nodeId(pNode: AstarGridNode): PropertyKey {
        return AstarGrid.nodeKey(pNode);
    }
}

/**
 * Renders the astar grid and handles user interaction.
 */
class AstarGrid {
    public static readonly COST_OF_TRAVERSAL_CODE: string = 'return 1;';
    public static readonly GRID_SIZE: number = 51;
    public static readonly HEURISTIC_CODE: string = 'return Math.abs(node.x - pathInformation.endNode.x) + Math.abs(node.y - pathInformation.endNode.y);';

    /**
     * Build the stable key of a node.
     *
     * @param pNode - Source node.
     *
     * @returns Node key.
     */
    public static nodeKey(pNode: AstarGridNode): string {
        // Build node key.
        return `${pNode.x}|${pNode.y}`;
    }

    private readonly mCellElements: Map<string, HTMLButtonElement>;
    private mCostOfTraversalFunction: PageAstarTraversalCostFunction;
    private mDragObstacleState: boolean | undefined;
    private readonly mEndNode: AstarGridNode;
    private readonly mGridElement: HTMLElement;
    private mHeuristicFunction: PageAstarHeuristicFunction;
    private readonly mObstacleKeys: Set<string>;
    private readonly mStartNode: AstarGridNode;

    /**
     * Create a rendered astar grid.
     *
     * @param pGridElement - Grid root element.
     * @param pCostOfTraversalElement - Cost editor element.
     * @param pHeuristicElement - Heuristic editor element.
     */
    public constructor(pGridElement: HTMLElement, pCostOfTraversalElement: HTMLTextAreaElement, pHeuristicElement: HTMLTextAreaElement) {
        // Initialize state.
        this.mCellElements = new Map<string, HTMLButtonElement>();
        this.mCostOfTraversalFunction = this.compileTraversalCost(AstarGrid.COST_OF_TRAVERSAL_CODE);
        this.mDragObstacleState = undefined;
        this.mEndNode = { x: 50, y: 25 };
        this.mGridElement = pGridElement;
        this.mHeuristicFunction = this.compileHeuristic(AstarGrid.HEURISTIC_CODE);
        this.mObstacleKeys = new Set<string>();
        this.mStartNode = { x: 0, y: 25 };

        // Initialize code editors.
        pCostOfTraversalElement.value = AstarGrid.COST_OF_TRAVERSAL_CODE;
        pHeuristicElement.value = AstarGrid.HEURISTIC_CODE;

        // Register code editor events.
        pCostOfTraversalElement.addEventListener('change', () => {
            this.mCostOfTraversalFunction = this.compileTraversalCost(pCostOfTraversalElement.value);
            this.renderPath();
        });

        pHeuristicElement.addEventListener('change', () => {
            this.mHeuristicFunction = this.compileHeuristic(pHeuristicElement.value);
            this.renderPath();
        });

        // Register drag cleanup events.
        document.addEventListener('pointerup', () => {
            this.mDragObstacleState = undefined;
        });

        document.addEventListener('pointercancel', () => {
            this.mDragObstacleState = undefined;
        });

        // Build initial grid.
        this.renderGrid();
        this.renderPath();
    }

    /**
     * Compile heuristic editor code.
     *
     * @param pCode - Function body code.
     *
     * @returns Compiled heuristic function.
     */
    private compileHeuristic(pCode: string): PageAstarHeuristicFunction {
        // Compile heuristic code.
        return Function('node', 'pathInformation', pCode) as PageAstarHeuristicFunction;
    }

    /**
     * Compile traversal cost editor code.
     *
     * @param pCode - Function body code.
     *
     * @returns Compiled traversal cost function.
     */
    private compileTraversalCost(pCode: string): PageAstarTraversalCostFunction {
        // Compile traversal cost code.
        return Function('node', 'pathInformation', pCode) as PageAstarTraversalCostFunction;
    }

    /**
     * Create an interactive grid cell.
     *
     * @param pNode - Node represented by the cell.
     *
     * @returns Created cell element.
     */
    private createCell(pNode: AstarGridNode): HTMLButtonElement {
        // Create grid cell.
        const lCellElement: HTMLButtonElement = document.createElement('button');
        lCellElement.className = 'astar-page__grid-cell';
        lCellElement.type = 'button';
        lCellElement.dataset['key'] = AstarGrid.nodeKey(pNode);

        // Start obstacle painting or erasing on primary pointer down.
        lCellElement.addEventListener('pointerdown', (pEvent: PointerEvent) => {
            if (pEvent.button !== 0 || this.nodesAreEqual(pNode, this.mStartNode) || this.nodesAreEqual(pNode, this.mEndNode)) {
                return;
            }

            pEvent.preventDefault();
            this.mDragObstacleState = !this.mObstacleKeys.has(AstarGrid.nodeKey(pNode));
            this.setObstacle(pNode, this.mDragObstacleState);
        });

        // Continue the active paint mode while dragging across cells.
        lCellElement.addEventListener('pointerenter', (pEvent: PointerEvent) => {
            if (this.mDragObstacleState === undefined) {
                return;
            }

            if ((pEvent.buttons & 1) !== 1) {
                this.mDragObstacleState = undefined;
                return;
            }

            this.setObstacle(pNode, this.mDragObstacleState);
        });

        return lCellElement;
    }

    /**
     * Compare two nodes by coordinate.
     *
     * @param pNodeA - First node.
     * @param pNodeB - Second node.
     *
     * @returns True when both nodes share coordinates.
     */
    private nodesAreEqual(pNodeA: AstarGridNode, pNodeB: AstarGridNode): boolean {
        // Compare node coordinates.
        return pNodeA.x === pNodeB.x && pNodeA.y === pNodeB.y;
    }

    /**
     * Calculate the processed cell lightness.
     *
     * @param pProcessedCount - Amount of processing passes.
     *
     * @returns CSS lightness value.
     */
    private processedLightness(pProcessedCount: number): string {
        // Calculate darker processed color for repeated processing.
        return `${Math.max(34, 66 - ((pProcessedCount - 1) * 10))}%`;
    }

    /**
     * Render the static grid cells.
     */
    private renderGrid(): void {
        // Create all grid cells once.
        for (let lY: number = 0; lY < AstarGrid.GRID_SIZE; lY++) {
            for (let lX: number = 0; lX < AstarGrid.GRID_SIZE; lX++) {
                const lNode: AstarGridNode = { x: lX, y: lY };
                const lCellElement: HTMLButtonElement = this.createCell(lNode);
                this.mCellElements.set(AstarGrid.nodeKey(lNode), lCellElement);
                this.mGridElement.appendChild(lCellElement);
            }
        }
    }

    /**
     * Run Astar and update cell states.
     */
    private renderPath(): void {
        // Calculate astar result with fresh node cache.
        const lNodeMap: Map<string, AstarGridNode> = new Map<string, AstarGridNode>();
        lNodeMap.set(AstarGrid.nodeKey(this.mStartNode), this.mStartNode);
        lNodeMap.set(AstarGrid.nodeKey(this.mEndNode), this.mEndNode);

        const lAstar: PageAstar = new PageAstar({
            costOfTraversal: this.mCostOfTraversalFunction,
            heuristic: this.mHeuristicFunction,
            nodeMap: lNodeMap,
            obstacleKeys: this.mObstacleKeys
        });
        const lResult: AstarResult<AstarGridNode> = lAstar.start(this.mStartNode, this.mEndNode);
        const lPathKeys: Set<string> = new Set<string>(lResult.path.map((pNode: AstarGridNode) => AstarGrid.nodeKey(pNode)));

        // Count repeated processing per cell.
        const lProcessedCounts: Map<string, number> = new Map<string, number>();
        for (const lProcessedNode of lResult.processedNodes) {
            const lKey: string = AstarGrid.nodeKey(lProcessedNode);
            lProcessedCounts.set(lKey, (lProcessedCounts.get(lKey) ?? 0) + 1);
        }

        // Update all cell states.
        for (const [lKey, lCellElement] of this.mCellElements.entries()) {
            const lProcessedCount: number = lProcessedCounts.get(lKey) ?? 0;
            lCellElement.classList.toggle('astar-page__grid-cell--blocked', this.mObstacleKeys.has(lKey));
            lCellElement.classList.toggle('astar-page__grid-cell--end', lKey === AstarGrid.nodeKey(this.mEndNode));
            lCellElement.classList.toggle('astar-page__grid-cell--path', lPathKeys.has(lKey));
            lCellElement.classList.toggle('astar-page__grid-cell--processed', lProcessedCount > 0);
            lCellElement.classList.toggle('astar-page__grid-cell--start', lKey === AstarGrid.nodeKey(this.mStartNode));
            lCellElement.style.setProperty('--processed-lightness', this.processedLightness(lProcessedCount));
        }
    }

    /**
     * Set obstacle state for one node.
     *
     * @param pNode - Target node.
     * @param pIsObstacle - New obstacle state.
     */
    private setObstacle(pNode: AstarGridNode, pIsObstacle: boolean): void {
        // Ignore fixed endpoint cells and unchanged states.
        const lKey: string = AstarGrid.nodeKey(pNode);
        if (this.nodesAreEqual(pNode, this.mStartNode) || this.nodesAreEqual(pNode, this.mEndNode) || this.mObstacleKeys.has(lKey) === pIsObstacle) {
            return;
        }

        // Apply obstacle change.
        if (pIsObstacle) {
            this.mObstacleKeys.add(lKey);
        } else {
            this.mObstacleKeys.delete(lKey);
        }

        this.renderPath();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Create grid renderer after page elements are available.
    new AstarGrid(
        document.querySelector<HTMLElement>('.astar-page__grid')!,
        document.querySelector<HTMLTextAreaElement>('#cost-of-traversal')!,
        document.querySelector<HTMLTextAreaElement>('#heuristic')!
    );
});

type AstarGridNode = { x: number; y: number; };

type PageAstarConstructorParameter = {
    costOfTraversal: PageAstarTraversalCostFunction;
    heuristic: PageAstarHeuristicFunction;
    nodeMap: Map<string, AstarGridNode>;
    obstacleKeys: Set<string>;
};

type PageAstarHeuristicFunction = (pCurrentNode: AstarGridNode, pPathInformation: AstarPathInformation<AstarGridNode>) => number;
type PageAstarTraversalCostFunction = (pNode: AstarGridNode, pPathInformation: AstarPathInformation<AstarGridNode>) => number;
