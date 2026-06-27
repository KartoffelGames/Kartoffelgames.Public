import { Astar, type AstarResult } from '../../source/algorithm/a-star.ts';

class PageAstar extends Astar<PageNode> {
    private readonly mCostOfTraversal: PageAstarTraversalCostFunction;
    private readonly mHeuristic: PageAstarHeuristicFunction;
    private readonly mNodeMap: Map<string, PageNode>;
    private readonly mObstacleKeys: Set<string>;

    public constructor(pParameter: PageAstarConstructorParameter) {
        super();

        // Assign configuration.
        this.mCostOfTraversal = pParameter.costOfTraversal;
        this.mHeuristic = pParameter.heuristic;
        this.mNodeMap = pParameter.nodeMap;
        this.mObstacleKeys = pParameter.obstacleKeys;
    }

    protected override costOfTraversal(pNode: PageNode, pCurrentNode: PageNode): number {
        // Execute custom traversal cost.
        return this.mCostOfTraversal(pNode, pCurrentNode);
    }

    protected override heuristic(pCurrentNode: PageNode, pEndNode: PageNode): number {
        // Execute custom heuristic.
        return this.mHeuristic(pCurrentNode, pEndNode);
    }

    protected override neighborNodes(pNode: PageNode): Array<PageNode> {
        // Collect grid neighbors.
        const lNeighborNodes: Array<PageNode> = new Array<PageNode>();
        const lNeighborCoordinates: Array<PageNode> = [
            { x: pNode.x, y: pNode.y - 1 },
            { x: pNode.x - 1, y: pNode.y },
            { x: pNode.x + 1, y: pNode.y },
            { x: pNode.x, y: pNode.y + 1 }
        ];

        for (const lCoordinate of lNeighborCoordinates) {
            const lKey: string = gNodeKey(lCoordinate);
            if (lCoordinate.x < 0 || lCoordinate.x >= gGridSize || lCoordinate.y < 0 || lCoordinate.y >= gGridSize || this.mObstacleKeys.has(lKey)) {
                continue;
            }

            let lNode: PageNode | undefined = this.mNodeMap.get(lKey);
            if (!lNode) {
                lNode = lCoordinate;
                this.mNodeMap.set(lKey, lNode);
            }

            lNeighborNodes.push(lNode);
        }

        return lNeighborNodes;
    }

    protected override nodesAreEqual(pNodeA: PageNode, pNodeB: PageNode): boolean {
        // Compare node coordinates.
        return pNodeA.x === pNodeB.x && pNodeA.y === pNodeB.y;
    }
}

const gCostOfTraversalCode: string = 'return 1;';
const gEndNode: PageNode = { x: 50, y: 25 };
const gGridSize: number = 51;
const gHeuristicCode: string = 'return Math.abs(currentNode.x - endNode.x) + Math.abs(currentNode.y - endNode.y);';
const gObstacleKeys: Set<string> = new Set<string>();
const gStartNode: PageNode = { x: 0, y: 25 };

let gCostOfTraversalFunction: PageAstarTraversalCostFunction = gCompileTraversalCost(gCostOfTraversalCode);
let gHeuristicFunction: PageAstarHeuristicFunction = gCompileHeuristic(gHeuristicCode);

function gCompileHeuristic(pCode: string): PageAstarHeuristicFunction {
    // Compile heuristic code.
    return Function('currentNode', 'endNode', pCode) as PageAstarHeuristicFunction;
}

function gCompileTraversalCost(pCode: string): PageAstarTraversalCostFunction {
    // Compile traversal cost code.
    return Function('node', 'currentNode', pCode) as PageAstarTraversalCostFunction;
}

function gCreateCell(pNode: PageNode): HTMLButtonElement {
    // Create grid cell.
    const lCellElement: HTMLButtonElement = document.createElement('button');
    lCellElement.className = 'grid-cell';
    lCellElement.type = 'button';
    lCellElement.dataset['key'] = gNodeKey(pNode);

    lCellElement.addEventListener('click', () => {
        // Toggle obstacle state.
        const lKey: string = gNodeKey(pNode);
        if (gNodesAreEqual(pNode, gStartNode) || gNodesAreEqual(pNode, gEndNode)) {
            return;
        }

        if (gObstacleKeys.has(lKey)) {
            gObstacleKeys.delete(lKey);
        } else {
            gObstacleKeys.add(lKey);
        }

        gRenderPath();
    });

    return lCellElement;
}

function gMain(): void {
    // Find page elements.
    const lGridElement: HTMLElement = document.querySelector<HTMLElement>('.grid')!;
    const lCostOfTraversalElement: HTMLTextAreaElement = document.querySelector<HTMLTextAreaElement>('#cost-of-traversal')!;
    const lHeuristicElement: HTMLTextAreaElement = document.querySelector<HTMLTextAreaElement>('#heuristic')!;

    // Initialize code editors.
    lCostOfTraversalElement.value = gCostOfTraversalCode;
    lHeuristicElement.value = gHeuristicCode;

    lCostOfTraversalElement.addEventListener('change', () => {
        // Recompile traversal cost and rerender path.
        gCostOfTraversalFunction = gCompileTraversalCost(lCostOfTraversalElement.value);
        gRenderPath();
    });

    lHeuristicElement.addEventListener('change', () => {
        // Recompile heuristic and rerender path.
        gHeuristicFunction = gCompileHeuristic(lHeuristicElement.value);
        gRenderPath();
    });

    // Build grid.
    for (let lY: number = 0; lY < gGridSize; lY++) {
        for (let lX: number = 0; lX < gGridSize; lX++) {
            lGridElement.appendChild(gCreateCell({ x: lX, y: lY }));
        }
    }

    // Render initial path.
    gRenderPath();
}

function gNodeKey(pNode: PageNode): string {
    // Build node key.
    return `${pNode.x}|${pNode.y}`;
}

function gNodesAreEqual(pNodeA: PageNode, pNodeB: PageNode): boolean {
    // Compare node coordinates.
    return pNodeA.x === pNodeB.x && pNodeA.y === pNodeB.y;
}

function gRenderPath(): void {
    // Calculate astar result.
    const lNodeMap: Map<string, PageNode> = new Map<string, PageNode>();
    lNodeMap.set(gNodeKey(gStartNode), gStartNode);
    lNodeMap.set(gNodeKey(gEndNode), gEndNode);

    const lAstar: PageAstar = new PageAstar({
        costOfTraversal: gCostOfTraversalFunction,
        heuristic: gHeuristicFunction,
        nodeMap: lNodeMap,
        obstacleKeys: gObstacleKeys
    });
    const lResult: AstarResult<PageNode> = lAstar.start(gStartNode, gEndNode);
    const lPathKeys: Set<string> = new Set<string>(lResult.path.map((pNode: PageNode) => gNodeKey(pNode)));
    const lProcessedKeys: Set<string> = new Set<string>(lResult.processedNodes.map((pNode: PageNode) => gNodeKey(pNode)));

    // Update grid cell states.
    for (const lCellElement of document.querySelectorAll<HTMLButtonElement>('.grid-cell')) {
        const lKey: string = lCellElement.dataset['key']!;
        lCellElement.classList.toggle('is-blocked', gObstacleKeys.has(lKey));
        lCellElement.classList.toggle('is-processed', lProcessedKeys.has(lKey));
        lCellElement.classList.toggle('is-path', lPathKeys.has(lKey));
        lCellElement.classList.toggle('is-start', lKey === gNodeKey(gStartNode));
        lCellElement.classList.toggle('is-end', lKey === gNodeKey(gEndNode));
    }
}

document.addEventListener('DOMContentLoaded', gMain);

type PageAstarConstructorParameter = {
    costOfTraversal: PageAstarTraversalCostFunction;
    heuristic: PageAstarHeuristicFunction;
    nodeMap: Map<string, PageNode>;
    obstacleKeys: Set<string>;
};

type PageAstarHeuristicFunction = (pCurrentNode: PageNode, pEndNode: PageNode) => number;
type PageAstarTraversalCostFunction = (pNode: PageNode, pCurrentNode: PageNode) => number;
type PageNode = { x: number; y: number; };
