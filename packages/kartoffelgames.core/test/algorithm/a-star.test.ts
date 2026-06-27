import { expect } from '@kartoffelgames/core-test';
import { Astar, AstarPathInformation, type AstarResult } from '../../source/algorithm/a-star.ts';

class TestAstar extends Astar<TestNode> {
    /**
     * Return fixed traversal cost of 1.
     */
    protected override costOfTraversal(_pNode: TestNode, _pPathInformation: AstarPathInformation<TestNode>): number {
        return 1;
    }

    /**
     * Calculate manhattan distance.
     */
    protected override heuristic(pNode: TestNode, pPathInformation: AstarPathInformation<TestNode>): number {
        return Math.abs(pNode.x - pPathInformation.endNode.x) + Math.abs(pNode.y - pPathInformation.endNode.y);
    }

    /**
     * Find neighbors.
     */
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
            const lKey: TestNodeId = this.nodeId(lCoordinate);

            // Skip node when out out bounds or a obstacle.
            if (lCoordinate.x < 0 || lCoordinate.x >= 20 || lCoordinate.y < 0 || lCoordinate.y >= 20 || gObstacleNodeKeys.has(lKey)) {
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
    protected override nodeId(pNode: TestNode): TestNodeId {
        return `${pNode.x}|${pNode.y}`;
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
        const lStartNode: TestNode = { x: 0, y: 0 };
        const lEndNode: TestNode = { x: 19, y: 19 };

        const lAstar: TestAstar = new TestAstar();

        // Process.
        const lPathfindingResult: AstarResult<TestNode> = lAstar.start(lStartNode, lEndNode);

        // Evaluation.
        expect(lPathfindingResult.path).toHaveLength(39);
        expect(lPathfindingResult.path.at(0)).toBe(lStartNode);
        expect(lPathfindingResult.path.at(-1)).toBe(lEndNode);

        for (let lIndex: number = 0; lIndex < lPathfindingResult.path.length; lIndex++) {
            const lCurrentNode: TestNode = lPathfindingResult.path[lIndex];
            expect(gObstacleNodeKeys.has(`${lCurrentNode.x}|${lCurrentNode.y}`)).toBe(false);

            // First element has no parent item. Skip parent item tests.
            if (lIndex === 0) {
                continue;
            }

            // Distance between each path item must be 1 because only four directional movement is allowed.
            const lPreviousNode: TestNode = lPathfindingResult.path[lIndex - 1];
            const lDistance: number = Math.abs(lCurrentNode.x - lPreviousNode.x) + Math.abs(lCurrentNode.y - lPreviousNode.y);
            expect(lDistance).toBe(1);
        }
    });
});

type TestNode = { x: number; y: number; };
