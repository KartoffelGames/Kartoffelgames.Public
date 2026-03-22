import type { PotatnoNodeDefinition } from '../../configuration/potatno-node-definition.ts';
import type { PotatnoConnection } from '../../graph/potatno-connection.ts';
import type { PotatnoGraph } from '../../graph/potatno-graph.ts';
import type { PotatnoNode } from '../../graph/potatno-node.ts';
import type { PotatnoHistoryAction } from '../potatno-history-action.ts';

/**
 * Action: Add a node to the graph.
 */
export class NodeAddAction implements PotatnoHistoryAction {
    public readonly description: string;

    private readonly mDefinition: PotatnoNodeDefinition;
    private readonly mGraph: PotatnoGraph;
    private mNode: PotatnoNode | null;
    private readonly mPosition: { x: number; y: number };
    private readonly mSystem: boolean;

    public get node(): PotatnoNode | null {
        return this.mNode;
    }

    public constructor(pGraph: PotatnoGraph, pDefinition: PotatnoNodeDefinition, pPosition: { x: number; y: number }, pSystem: boolean = false) {
        this.description = `Add node: ${pDefinition.name}`;
        this.mGraph = pGraph;
        this.mDefinition = pDefinition;
        this.mPosition = pPosition;
        this.mSystem = pSystem;
        this.mNode = null;
    }

    public apply(): void {
        if (this.mNode) {
            this.mGraph.addExistingNode(this.mNode);
        } else {
            this.mNode = this.mGraph.addNode(this.mDefinition, this.mPosition, this.mSystem);
        }
    }

    public revert(): void {
        if (this.mNode) {
            this.mGraph.removeNode(this.mNode.id);
        }
    }
}

/**
 * Action: Remove a node from the graph.
 */
export class NodeRemoveAction implements PotatnoHistoryAction {
    public readonly description: string;

    private readonly mGraph: PotatnoGraph;
    private readonly mNodeId: string;
    private mRemovedConnections: Array<PotatnoConnection>;
    private mRemovedNode: PotatnoNode | null;

    public constructor(pGraph: PotatnoGraph, pNodeId: string) {
        this.description = `Remove node`;
        this.mGraph = pGraph;
        this.mNodeId = pNodeId;
        this.mRemovedNode = null;
        this.mRemovedConnections = new Array<PotatnoConnection>();
    }

    public apply(): void {
        this.mRemovedNode = this.mGraph.getNode(this.mNodeId) ?? null;
        this.mRemovedConnections = this.mGraph.removeNode(this.mNodeId);
    }

    public revert(): void {
        if (this.mRemovedNode) {
            this.mGraph.addExistingNode(this.mRemovedNode);
            for (const lConn of this.mRemovedConnections) {
                this.mGraph.addExistingConnection(lConn);
            }
        }
    }
}

/**
 * Action: Move a node to a new position.
 */
export class NodeMoveAction implements PotatnoHistoryAction {
    public readonly description: string;

    private readonly mNewPosition: { x: number; y: number };
    private readonly mNode: PotatnoNode;
    private mOldPosition: { x: number; y: number };

    public constructor(pNode: PotatnoNode, pNewX: number, pNewY: number) {
        this.description = `Move node`;
        this.mNode = pNode;
        this.mNewPosition = { x: pNewX, y: pNewY };
        this.mOldPosition = { x: pNode.position.x, y: pNode.position.y };
    }

    public apply(): void {
        this.mOldPosition = { x: this.mNode.position.x, y: this.mNode.position.y };
        this.mNode.moveTo(this.mNewPosition.x, this.mNewPosition.y);
    }

    public revert(): void {
        this.mNode.moveTo(this.mOldPosition.x, this.mOldPosition.y);
    }
}
