import { PortKind } from '../node/port-kind.enum.ts';
import type { PotatnoNodeDefinition } from "../project/potatno-node-definition.ts";
import { PotatnoConnection } from './potatno-connection.ts';
import { PotatnoFlowPort } from './potatno-flow-port.ts';
import { PotatnoNode } from './potatno-node.ts';
import { PotatnoPort } from './potatno-port.ts';

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
            const lSourcePort: PotatnoPort | null = this.findDataPortById(lSourceNode, pSourcePortId);
            const lTargetPort: PotatnoPort | null = this.findDataPortById(lTargetNode, pTargetPortId);
            if (!lSourcePort || !lTargetPort) {
                return null;
            }

            // Type check — exact string match.
            const lValid: boolean = lSourcePort.type === lTargetPort.type;

            // Remove existing connection to the target input port.
            for (const [lId, lConn] of this.mConnections) {
                if (lConn.targetNode.id === pTargetNodeId && lConn.targetPort.id === pTargetPortId && lConn.kind === PortKind.Data) {
                    this.mConnections.delete(lId);
                    break;
                }
            }

            // Set the connection reference on the target port.
            lTargetPort.connectedTo = lSourcePort;

            const lId: string = crypto.randomUUID();
            const lConnection: PotatnoConnection = new PotatnoConnection(lId, lSourceNode, lSourcePort, lTargetNode, lTargetPort, pKind);
            lConnection.valid = lValid;
            this.mConnections.set(lId, lConnection);
            return lConnection;
        } else {
            // Flow connection.
            const lSourcePort: PotatnoFlowPort | null = this.findFlowPortById(lSourceNode, pSourcePortId);
            const lTargetPort: PotatnoFlowPort | null = this.findFlowPortById(lTargetNode, pTargetPortId);
            if (!lSourcePort || !lTargetPort) {
                return null;
            }

            // Remove existing flow connection from source.
            for (const [lId, lConn] of this.mConnections) {
                if (lConn.sourceNode.id === pSourceNodeId && lConn.sourcePort.id === pSourcePortId && lConn.kind === PortKind.Flow) {
                    this.mConnections.delete(lId);
                    break;
                }
            }

            lSourcePort.connectedTo = lTargetPort;
            lTargetPort.connectedTo = lSourcePort;

            const lId: string = crypto.randomUUID();
            const lConnection: PotatnoConnection = new PotatnoConnection(lId, lSourceNode, lSourcePort, lTargetNode, lTargetPort, pKind);
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
     * Add a new node to the graph.
     */
    public addNode(pDefinition: PotatnoNodeDefinition, pPosition: { x: number; y: number }, pSystem: boolean = false): PotatnoNode {
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
            if (lConnection.sourceNode.id === pNodeId || lConnection.targetNode.id === pNodeId) {
                lResult.push(lConnection);
            }
        }
        return lResult;
    }

    /**
     * Get a node by ID.
     */
    public getNode(pNodeId: string): PotatnoNode | undefined {
        return this.mNodes.get(pNodeId);
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
        if (lConnection.kind === PortKind.Data) {
            const lTargetPort: PotatnoPort | null = this.findDataPortById(lConnection.targetNode, lConnection.targetPort.id);
            if (lTargetPort) {
                lTargetPort.connectedTo = null;
            }
        } else {
            const lSourcePort: PotatnoFlowPort | null = this.findFlowPortById(lConnection.sourceNode, lConnection.sourcePort.id);
            const lTargetPort: PotatnoFlowPort | null = this.findFlowPortById(lConnection.targetNode, lConnection.targetPort.id);
            if (lSourcePort) {
                lSourcePort.connectedTo = null;
            }
            if (lTargetPort) {
                lTargetPort.connectedTo = null;
            }
        }

        this.mConnections.delete(pConnectionId);
        return lConnection;
    }

    /**
     * Remove a node and all its connections from the graph.
     */
    public removeNode(pNodeId: string): Array<PotatnoConnection> {
        const lRemovedConnections: Array<PotatnoConnection> = new Array<PotatnoConnection>();

        // Remove all connections involving this node.
        for (const [lId, lConnection] of this.mConnections) {
            if (lConnection.sourceNode.id === pNodeId || lConnection.targetNode.id === pNodeId) {
                lRemovedConnections.push(lConnection);
                this.mConnections.delete(lId);
            }
        }

        this.mNodes.delete(pNodeId);
        return lRemovedConnections;
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

            const lSourcePort: PotatnoPort | null = this.findDataPortById(lConnection.sourceNode, lConnection.sourcePort.id);
            const lTargetPort: PotatnoPort | null = this.findDataPortById(lConnection.targetNode, lConnection.targetPort.id);

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
     * Find a data port by its ID within a node.
     */
    private findDataPortById(pNode: PotatnoNode, pPortId: string): PotatnoPort | null {
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
    private findFlowPortById(pNode: PotatnoNode, pPortId: string): PotatnoFlowPort | null {
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
