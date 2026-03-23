import { PortKind } from '../node/port-kind.enum.ts';
import type { PotatnoConnection } from '../document/potatno-connection.ts';
import type { PotatnoGraph } from '../document/potatno-graph.ts';
import type { PotatnoHistoryAction } from './potatno-history-action.ts';

/**
 * History action that adds a connection between two ports in the graph.
 * On revert, the connection is removed. On re-apply, the same connection instance is restored.
 */
export class ConnectionAddAction implements PotatnoHistoryAction {
    public readonly description: string;

    private mConnection: PotatnoConnection | null;
    private readonly mGraph: PotatnoGraph;
    private readonly mKind: PortKind;
    private readonly mSourceNodeId: string;
    private readonly mSourcePortId: string;
    private readonly mTargetNodeId: string;
    private readonly mTargetPortId: string;

    /**
     * The connection that was created by this action, or null if the action has not been applied yet.
     */
    public get connection(): PotatnoConnection | null {
        return this.mConnection;
    }

    /**
     * Constructor.
     *
     * @param pGraph - The graph to add the connection to.
     * @param pSourceNodeId - ID of the source node.
     * @param pSourcePortId - ID of the source port.
     * @param pTargetNodeId - ID of the target node.
     * @param pTargetPortId - ID of the target port.
     * @param pKind - The kind of port (data or flow).
     */
    public constructor(pGraph: PotatnoGraph, pSourceNodeId: string, pSourcePortId: string, pTargetNodeId: string, pTargetPortId: string, pKind: PortKind) {
        this.description = 'Add connection';
        this.mGraph = pGraph;
        this.mSourceNodeId = pSourceNodeId;
        this.mSourcePortId = pSourcePortId;
        this.mTargetNodeId = pTargetNodeId;
        this.mTargetPortId = pTargetPortId;
        this.mKind = pKind;
        this.mConnection = null;
    }

    /**
     * Apply the action by adding the connection to the graph.
     * If the connection was previously created and reverted, the existing instance is restored.
     */
    public apply(): void {
        if (this.mConnection) {
            this.mGraph.addExistingConnection(this.mConnection);
        } else {
            this.mConnection = this.mGraph.addConnection(this.mSourceNodeId, this.mSourcePortId, this.mTargetNodeId, this.mTargetPortId, this.mKind);
        }
    }

    /**
     * Revert the action by removing the connection from the graph.
     */
    public revert(): void {
        if (this.mConnection) {
            this.mGraph.removeConnection(this.mConnection.id);
        }
    }
}

/**
 * History action that removes a connection from the graph.
 * On revert, the removed connection is restored.
 */
export class ConnectionRemoveAction implements PotatnoHistoryAction {
    public readonly description: string;

    private readonly mConnectionId: string;
    private readonly mGraph: PotatnoGraph;
    private mRemovedConnection: PotatnoConnection | null;

    /**
     * Constructor.
     *
     * @param pGraph - The graph to remove the connection from.
     * @param pConnectionId - ID of the connection to remove.
     */
    public constructor(pGraph: PotatnoGraph, pConnectionId: string) {
        this.description = 'Remove connection';
        this.mGraph = pGraph;
        this.mConnectionId = pConnectionId;
        this.mRemovedConnection = null;
    }

    /**
     * Apply the action by removing the connection from the graph.
     */
    public apply(): void {
        this.mRemovedConnection = this.mGraph.removeConnection(this.mConnectionId);
    }

    /**
     * Revert the action by restoring the previously removed connection to the graph.
     */
    public revert(): void {
        if (this.mRemovedConnection) {
            this.mGraph.addExistingConnection(this.mRemovedConnection);
        }
    }
}
