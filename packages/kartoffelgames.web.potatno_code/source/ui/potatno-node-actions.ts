import type { PotatnoConnection } from '../document/potatno-connection.ts';
import type { PotatnoGraph } from '../document/potatno-graph.ts';
import type { PotatnoNode } from '../document/potatno-node.ts';
import type { PotatnoNodeDefinitionData } from "../project/potatno-node-definition.ts";
import type { PotatnoHistoryAction } from './potatno-history-action.ts';

/**
 * History action that adds a node to the graph.
 * On revert, the node is removed. On re-apply, the same node instance is restored.
 */
export class NodeAddAction implements PotatnoHistoryAction {
    public readonly description: string;

    private readonly mDefinition: PotatnoNodeDefinitionData;
    private readonly mGraph: PotatnoGraph;
    private mNode: PotatnoNode | null;
    private readonly mPosition: { x: number; y: number; };
    private readonly mSystem: boolean;

    /**
     * The node that was created by this action, or null if the action has not been applied yet.
     */
    public get node(): PotatnoNode | null {
        return this.mNode;
    }

    /**
     * Constructor.
     *
     * @param pGraph - The graph to add the node to.
     * @param pDefinition - The node definition describing the node type.
     * @param pPosition - The initial position for the node.
     * @param pSystem - Whether the node is a system node. Defaults to false.
     */
    public constructor(pGraph: PotatnoGraph, pDefinition: PotatnoNodeDefinitionData, pPosition: { x: number; y: number; }, pSystem: boolean = false) {
        this.description = `Add node: ${pDefinition.name}`;
        this.mGraph = pGraph;
        this.mDefinition = pDefinition;
        this.mPosition = pPosition;
        this.mSystem = pSystem;
        this.mNode = null;
    }

    /**
     * Apply the action by adding the node to the graph.
     * If the node was previously created and reverted, the existing instance is restored.
     */
    public apply(): void {
        if (this.mNode) {
            this.mGraph.addExistingNode(this.mNode);
        } else {
            this.mNode = this.mGraph.addNode(this.mDefinition, this.mPosition, this.mSystem);
        }
    }

    /**
     * Revert the action by removing the node from the graph.
     */
    public revert(): void {
        if (this.mNode) {
            this.mGraph.removeNode(this.mNode.id);
        }
    }
}

/**
 * History action that removes a node from the graph.
 * On revert, both the node and all its connections are restored.
 */
export class NodeRemoveAction implements PotatnoHistoryAction {
    public readonly description: string;

    private readonly mGraph: PotatnoGraph;
    private readonly mNodeId: string;
    private mRemovedConnections: Array<PotatnoConnection>;
    private mRemovedNode: PotatnoNode | null;

    /**
     * Constructor.
     *
     * @param pGraph - The graph to remove the node from.
     * @param pNodeId - ID of the node to remove.
     */
    public constructor(pGraph: PotatnoGraph, pNodeId: string) {
        this.description = `Remove node`;
        this.mGraph = pGraph;
        this.mNodeId = pNodeId;
        this.mRemovedNode = null;
        this.mRemovedConnections = new Array<PotatnoConnection>();
    }

    /**
     * Apply the action by removing the node and recording its connections for later restoration.
     */
    public apply(): void {
        this.mRemovedNode = this.mGraph.getNode(this.mNodeId) ?? null;
        this.mRemovedConnections = this.mGraph.removeNode(this.mNodeId);
    }

    /**
     * Revert the action by restoring the removed node and all its connections to the graph.
     */
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
 * History action that moves a node to a new position in the graph.
 * Records both the old and new positions for undo/redo support.
 */
export class NodeMoveAction implements PotatnoHistoryAction {
    public readonly description: string;

    private readonly mNewPosition: { x: number; y: number; };
    private readonly mNode: PotatnoNode;
    private mOldPosition: { x: number; y: number; };

    /**
     * Constructor.
     *
     * @param pNode - The node to move.
     * @param pNewX - The target X coordinate.
     * @param pNewY - The target Y coordinate.
     */
    public constructor(pNode: PotatnoNode, pNewX: number, pNewY: number) {
        this.description = `Move node`;
        this.mNode = pNode;
        this.mNewPosition = { x: pNewX, y: pNewY };
        this.mOldPosition = { x: pNode.position.x, y: pNode.position.y };
    }

    /**
     * Apply the action by moving the node to the new position.
     * The current position is saved before the move for accurate revert.
     */
    public apply(): void {
        this.mOldPosition = { x: this.mNode.position.x, y: this.mNode.position.y };
        this.mNode.moveTo(this.mNewPosition.x, this.mNewPosition.y);
    }

    /**
     * Revert the action by moving the node back to its previous position.
     */
    public revert(): void {
        this.mNode.moveTo(this.mOldPosition.x, this.mOldPosition.y);
    }
}
