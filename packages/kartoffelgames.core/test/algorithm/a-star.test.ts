import { expect } from '@kartoffelgames/core-test';
import { Astar } from '../../source/algorithm/a-star.ts';

class TestAstar extends Astar<TestNode> {
    private readonly mNodeMap: Map<TestNodeId, TestNode>;

    public constructor(pNodeMap: Map<TestNodeId, TestNode>) {
        super();

        // Assign node cache.
        this.mNodeMap = pNodeMap;
    }

    /**
     * Compare node coordinates for equality.
     */
    protected override nodesAreEqual(pNodeA: TestNode, pNodeB: TestNode): boolean {
        return pNodeA.x === pNodeB.x && pNodeA.y === pNodeB.y
    }

    /**
     * Return fixed traversal cost of 1.
     */
    protected override costOfTraversal(..._pNodes: Array<TestNode>): number {
        return 1;
    }

    /**
     * Calculate manhattan distance.
     */
    protected override heuristic(pCurrentNode: TestNode, pEndNode: TestNode): number {
        return Math.abs(pCurrentNode.x - pEndNode.x) + Math.abs(pCurrentNode.y - pEndNode.y);
    }

    protected override neighborNodes(pNode: TestNode): Array<TestNode> {
        // Collect valid direct neighbors.
        const lNeighborNodes: Array<TestNode> = new Array<TestNode>();
        const lNeighborCoordinates: Array<TestNode> = [
            { x: pNode.x, y: pNode.y - 1 },
            { x: pNode.x - 1, y: pNode.y },
            { x: pNode.x + 1, y: pNode.y },
            { x: pNode.x, y: pNode.y + 1 }
        ];

        for (const lCoordinate of lNeighborCoordinates) {
            // Build node id.
            const lKey: TestNodeId = `${lCoordinate.x}|${lCoordinate.y}`;

            // Skip node when out out bounds or a obstacle.
            if (lCoordinate.x < 0 || lCoordinate.x >= 20 || lCoordinate.y < 0 || lCoordinate.y >= 20 || gObstacleNodeKeys.has(lKey)) {
                continue;
            }

            if (this.mNodeMap.has(lKey)) {
                lNeighborNodes.push(this.mNodeMap.get(lKey)!);
                continue;
            }

            this.mNodeMap.set(lKey, lCoordinate);
            lNeighborNodes.push(lCoordinate);
        }

        return lNeighborNodes;
    }
}

type TestNodeId = `${number}|${number}`;

const gObstacleNodeKeys: Set<TestNodeId> = new Set<TestNodeId>([
    // First line.
    '10|0', '10|1', '10|2', '10|3', '10|4', '10|5', '10|6', '10|7', '10|8',

    // Second line.
    '10|11', '10|12', '10|13', '10|14', '10|15', '10|16', '10|17', '10|18', '10|19'
]);

Deno.test('Astar.start()', async (pContext) => {
    await pContext.step('Find path through obstacle gap', () => {
        // Setup.
        const lNodeMap: Map<TestNodeId, TestNode> = new Map<TestNodeId, TestNode>();
        const lStartNode: TestNode = { x: 0, y: 0 };
        const lEndNode: TestNode = { x: 19, y: 19 };
        lNodeMap.set(`${lStartNode.x}|${lStartNode.y}`, lStartNode);
        lNodeMap.set(`${lEndNode.x}|${lEndNode.y}`, lEndNode);

        const lAstar: TestAstar = new TestAstar(lNodeMap);

        // Process.
        const lPath: Array<TestNode> = lAstar.start(lStartNode, lEndNode);

        // Evaluation.
        expect(lPath).toHaveLength(39);
        expect(lPath.at(0)).toBe(lStartNode);
        expect(lPath.at(-1)).toBe(lEndNode);

        for (let lIndex: number = 0; lIndex < lPath.length; lIndex++) {
            const lCurrentNode: TestNode = lPath[lIndex];
            expect(gObstacleNodeKeys.has(`${lCurrentNode.x}|${lCurrentNode.y}`)).toBe(false);

            // First element has no parent item. Skip parent item tests.
            if (lIndex === 0) {
                continue;
            }

            // Distance between each path item must be 1 because only four directional movement is allowed.
            const lPreviousNode: TestNode = lPath[lIndex - 1];
            const lDistance: number = Math.abs(lCurrentNode.x - lPreviousNode.x) + Math.abs(lCurrentNode.y - lPreviousNode.y);
            expect(lDistance).toBe(1);
        }
    });
});

type TestNode = { x: number; y: number; };
