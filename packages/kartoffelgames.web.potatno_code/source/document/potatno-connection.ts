import { PortKind } from '../node/port-kind.enum.ts';
import type { PotatnoFlowPort } from './potatno-flow-port.ts';
import type { PotatnoNode } from './potatno-node.ts';
import type { PotatnoPort } from './potatno-port.ts';

/**
 * A connection between two ports.
 */
export class PotatnoConnection {
    private readonly mId: string;
    private readonly mKind: PortKind;
    private readonly mSourceNode: PotatnoNode;
    private readonly mSourcePort: PotatnoPort | PotatnoFlowPort;
    private readonly mTargetNode: PotatnoNode;
    private readonly mTargetPort: PotatnoPort | PotatnoFlowPort;

    private mValid: boolean;

    /**
     * Get the unique identifier for the connection.
     */
    public get id(): string {
        return this.mId;
    }

    /**
     * Get whether this is a data or flow connection.
     */
    public get kind(): PortKind {
        return this.mKind;
    }

    /**
     * Get the source node of the connection.
     */
    public get sourceNode(): PotatnoNode {
        return this.mSourceNode;
    }

    /**
     * Get the source port of the connection.
     */
    public get sourcePort(): PotatnoPort | PotatnoFlowPort {
        return this.mSourcePort;
    }

    /**
     * Get the target node of the connection.
     */
    public get targetNode(): PotatnoNode {
        return this.mTargetNode;
    }

    /**
     * Get the target port of the connection.
     */
    public get targetPort(): PotatnoPort | PotatnoFlowPort {
        return this.mTargetPort;
    }

    /**
     * Whether the connection is valid (types match).
     */
    public get valid(): boolean {
        return this.mValid;
    }

    /**
     * Set whether the connection is valid.
     */
    public set valid(pValue: boolean) {
        this.mValid = pValue;
    }

    /**
     * Create a new connection between two ports.
     *
     * @param pId - Unique identifier for the connection.
     * @param pSourceNode - The source node.
     * @param pSourcePort - The source port.
     * @param pTargetNode - The target node.
     * @param pTargetPort - The target port.
     * @param pKind - Whether this is a data or flow connection.
     */
    public constructor(pId: string, pSourceNode: PotatnoNode, pSourcePort: PotatnoPort | PotatnoFlowPort, pTargetNode: PotatnoNode, pTargetPort: PotatnoPort | PotatnoFlowPort, pKind: PortKind) {
        this.mId = pId;
        this.mSourceNode = pSourceNode;
        this.mSourcePort = pSourcePort;
        this.mTargetNode = pTargetNode;
        this.mTargetPort = pTargetPort;
        this.mKind = pKind;
        this.mValid = true;
    }
}
