import { PortKind } from '../../enum/port-kind.enum.ts';
import type { PotatnoConnection } from '../../graph/potatno-connection.ts';
import type { PotatnoGraph } from '../../graph/potatno-graph.ts';
import type { PotatnoHistoryAction } from '../potatno-history-action.ts';

/**
 * Action: Add a connection between two ports.
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

    public get connection(): PotatnoConnection | null {
        return this.mConnection;
    }

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

    public apply(): void {
        if (this.mConnection) {
            this.mGraph.addExistingConnection(this.mConnection);
        } else {
            this.mConnection = this.mGraph.addConnection(this.mSourceNodeId, this.mSourcePortId, this.mTargetNodeId, this.mTargetPortId, this.mKind);
        }
    }

    public revert(): void {
        if (this.mConnection) {
            this.mGraph.removeConnection(this.mConnection.id);
        }
    }
}

/**
 * Action: Remove a connection.
 */
export class ConnectionRemoveAction implements PotatnoHistoryAction {
    public readonly description: string;

    private readonly mConnectionId: string;
    private readonly mGraph: PotatnoGraph;
    private mRemovedConnection: PotatnoConnection | null;

    public constructor(pGraph: PotatnoGraph, pConnectionId: string) {
        this.description = 'Remove connection';
        this.mGraph = pGraph;
        this.mConnectionId = pConnectionId;
        this.mRemovedConnection = null;
    }

    public apply(): void {
        this.mRemovedConnection = this.mGraph.removeConnection(this.mConnectionId);
    }

    public revert(): void {
        if (this.mRemovedConnection) {
            this.mGraph.addExistingConnection(this.mRemovedConnection);
        }
    }
}
