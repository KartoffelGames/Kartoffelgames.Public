import type { PotatnoProjectNodeDefinition } from '../node/potatno-node-definition.ts';
import { PortKind } from '../node/port-kind.enum.ts';
import { PotatnoConnection } from './potatno-connection.ts';
import { PotatnoNode } from './potatno-node.ts';

/**
 * The core graph for a single function. Contains nodes and connections.
 */
export class PotatnoGraph {
    private readonly mConnections: Map<string, PotatnoConnection>;
    private readonly mNodes: Map<string, PotatnoNode>;

    /**
     * Read-only map of all connections in the graph.
     */
    public get connections(): ReadonlyMap<string, PotatnoConnection> {
        return this.mConnections;
    }

    /**
     * Read-only map of all nodes in the graph.
     */
    public get nodes(): ReadonlyMap<string, PotatnoNode> {
        return this.mNodes;
    }

    /**
     * Create an empty graph.
     */
    public constructor() {
        this.mNodes = new Map<string, PotatnoNode>();
        this.mConnections = new Map<string, PotatnoConnection>();
    }

    /**
     * Add a new node to the graph.
     */
    public addNode(pDefinition: PotatnoProjectNodeDefinition, pPosition: { x: number; y: number }, pSystem: boolean = false): PotatnoNode {
        const lId: string = crypto.randomUUID();
        const lNode: PotatnoNode = new PotatnoNode(lId, pDefinition, pPosition, pSystem);
        this.mNodes.set(lId, lNode);
        return lNode;
    }

    /**
     * Add a pre-constructed node directly (used for deserialization and undo).
     */
    public addExistingNode(pNode: PotatnoNode): void {
        this.mNodes.set(pNode.id, pNode);
    }

    /**
     * Remove a node and all its connections from the graph.
     */
    public removeNode(pNodeId: string): Array<PotatnoConnection> {
        const lRemovedConnections: Array<PotatnoConnection> = new Array<PotatnoConnection>();

        // Remove all connections involving this node.
        for (const [lId, lConnection] of this.mConnections) {
            if (lConnection.sourceNodeId === pNodeId || lConnection.targetNodeId === pNodeId) {
                lRemovedConnections.push(lConnection);
                this.mConnections.delete(lId);
            }
        }

        this.mNodes.delete(pNodeId);
        return lRemovedConnections;
    }

    /**
     * Add a data connection between two ports.
     * Returns the connection or null if validation fails.
     */
    public addConnection(pSourceNodeId: string, pSourcePortId: string, pTargetNodeId: string, pTargetPortId: string, pKind: PortKind): PotatnoConnection | null {
        const lSourceNode: PotatnoNode | undefined = this.mNodes.get(pSourceNodeId);
        const lTargetNode: PotatnoNode | undefined = this.mNodes.get(pTargetNodeId);

        if (!lSourceNode || !lTargetNode) {
            return null;
        }

        // Prevent self-connections.
        if (pSourceNodeId === pTargetNodeId) {
            return null;
        }

        // Validate port existence.
        if (pKind === PortKind.Data) {
            const lSourcePort = this.findDataPortById(lSourceNode, pSourcePortId);
            const lTargetPort = this.findDataPortById(lTargetNode, pTargetPortId);
            if (!lSourcePort || !lTargetPort) {
                return null;
            }

            // Type check — exact string match.
            const lValid: boolean = lSourcePort.type === lTargetPort.type;

            // Remove existing connection to the target input port.
            for (const [lId, lConn] of this.mConnections) {
                if (lConn.targetNodeId === pTargetNodeId && lConn.targetPortId === pTargetPortId && lConn.kind === PortKind.Data) {
                    this.mConnections.delete(lId);
                    break;
                }
            }

            // Set the connection reference on the target port.
            lTargetPort.connectedTo = lSourcePort.valueId;

            const lId: string = crypto.randomUUID();
            const lConnection: PotatnoConnection = new PotatnoConnection(lId, pSourceNodeId, pSourcePortId, pTargetNodeId, pTargetPortId, pKind);
            lConnection.valid = lValid;
            this.mConnections.set(lId, lConnection);
            return lConnection;
        } else {
            // Flow connection.
            const lSourcePort = this.findFlowPortById(lSourceNode, pSourcePortId);
            const lTargetPort = this.findFlowPortById(lTargetNode, pTargetPortId);
            if (!lSourcePort || !lTargetPort) {
                return null;
            }

            // Remove existing flow connection from source.
            for (const [lId, lConn] of this.mConnections) {
                if (lConn.sourceNodeId === pSourceNodeId && lConn.sourcePortId === pSourcePortId && lConn.kind === PortKind.Flow) {
                    this.mConnections.delete(lId);
                    break;
                }
            }

            lSourcePort.connectedTo = lTargetPort.id;
            lTargetPort.connectedTo = lSourcePort.id;

            const lId: string = crypto.randomUUID();
            const lConnection: PotatnoConnection = new PotatnoConnection(lId, pSourceNodeId, pSourcePortId, pTargetNodeId, pTargetPortId, pKind);
            this.mConnections.set(lId, lConnection);
            return lConnection;
        }
    }

    /**
     * Add a pre-constructed connection directly (used for deserialization and undo).
     */
    public addExistingConnection(pConnection: PotatnoConnection): void {
        this.mConnections.set(pConnection.id, pConnection);
    }

    /**
     * Remove a connection by ID.
     */
    public removeConnection(pConnectionId: string): PotatnoConnection | null {
        const lConnection: PotatnoConnection | undefined = this.mConnections.get(pConnectionId);
        if (!lConnection) {
            return null;
        }

        // Clear port references.
        const lTargetNode: PotatnoNode | undefined = this.mNodes.get(lConnection.targetNodeId);
        if (lTargetNode) {
            if (lConnection.kind === PortKind.Data) {
                const lPort = this.findDataPortById(lTargetNode, lConnection.targetPortId);
                if (lPort) {
                    lPort.connectedTo = null;
                }
            } else {
                const lSourceNode: PotatnoNode | undefined = this.mNodes.get(lConnection.sourceNodeId);
                const lSourcePort = lSourceNode ? this.findFlowPortById(lSourceNode, lConnection.sourcePortId) : null;
                const lTargetPort = this.findFlowPortById(lTargetNode, lConnection.targetPortId);
                if (lSourcePort) {
                    lSourcePort.connectedTo = null;
                }
                if (lTargetPort) {
                    lTargetPort.connectedTo = null;
                }
            }
        }

        this.mConnections.delete(pConnectionId);
        return lConnection;
    }

    /**
     * Validate all connections. Returns connections that have type mismatches.
     */
    public validate(): Array<PotatnoConnection> {
        const lInvalid: Array<PotatnoConnection> = new Array<PotatnoConnection>();

        for (const lConnection of this.mConnections.values()) {
            if (lConnection.kind !== PortKind.Data) {
                continue;
            }

            const lSourceNode: PotatnoNode | undefined = this.mNodes.get(lConnection.sourceNodeId);
            const lTargetNode: PotatnoNode | undefined = this.mNodes.get(lConnection.targetNodeId);

            if (!lSourceNode || !lTargetNode) {
                lConnection.valid = false;
                lInvalid.push(lConnection);
                continue;
            }

            const lSourcePort = this.findDataPortById(lSourceNode, lConnection.sourcePortId);
            const lTargetPort = this.findDataPortById(lTargetNode, lConnection.targetPortId);

            if (!lSourcePort || !lTargetPort) {
                lConnection.valid = false;
                lInvalid.push(lConnection);
                continue;
            }

            const lValid: boolean = lSourcePort.type === lTargetPort.type;
            lConnection.valid = lValid;
            if (!lValid) {
                lInvalid.push(lConnection);
            }
        }

        return lInvalid;
    }

    /**
     * Get a node by ID.
     */
    public getNode(pNodeId: string): PotatnoNode | undefined {
        return this.mNodes.get(pNodeId);
    }

    /**
     * Get a connection by ID.
     */
    public getConnection(pConnectionId: string): PotatnoConnection | undefined {
        return this.mConnections.get(pConnectionId);
    }

    /**
     * Find connections involving a specific node.
     */
    public getConnectionsForNode(pNodeId: string): Array<PotatnoConnection> {
        const lResult: Array<PotatnoConnection> = new Array<PotatnoConnection>();
        for (const lConnection of this.mConnections.values()) {
            if (lConnection.sourceNodeId === pNodeId || lConnection.targetNodeId === pNodeId) {
                lResult.push(lConnection);
            }
        }
        return lResult;
    }

    /**
     * Find a data port by its ID within a node.
     */
    private findDataPortById(pNode: PotatnoNode, pPortId: string): import('./potatno-port.ts').PotatnoPort | null {
        for (const lPort of pNode.inputs.values()) {
            if (lPort.id === pPortId) {
                return lPort;
            }
        }
        for (const lPort of pNode.outputs.values()) {
            if (lPort.id === pPortId) {
                return lPort;
            }
        }
        return null;
    }

    /**
     * Find a flow port by its ID within a node.
     */
    private findFlowPortById(pNode: PotatnoNode, pPortId: string): import('./potatno-flow-port.ts').PotatnoFlowPort | null {
        for (const lPort of pNode.flowInputs.values()) {
            if (lPort.id === pPortId) {
                return lPort;
            }
        }
        for (const lPort of pNode.flowOutputs.values()) {
            if (lPort.id === pPortId) {
                return lPort;
            }
        }
        return null;
    }
}
