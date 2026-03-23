import { PortKind } from '../node/port-kind.enum.ts';

/**
 * A connection between two ports.
 */
export class PotatnoConnection {
    public readonly id: string;
    public readonly kind: PortKind;
    public readonly sourceNodeId: string;
    public readonly sourcePortId: string;
    public readonly targetNodeId: string;
    public readonly targetPortId: string;

    private mValid: boolean;

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
     * @param pSourceNodeId - Identifier of the source node.
     * @param pSourcePortId - Identifier of the source port.
     * @param pTargetNodeId - Identifier of the target node.
     * @param pTargetPortId - Identifier of the target port.
     * @param pKind - Whether this is a data or flow connection.
     */
    public constructor(pId: string, pSourceNodeId: string, pSourcePortId: string, pTargetNodeId: string, pTargetPortId: string, pKind: PortKind) {
        this.id = pId;
        this.sourceNodeId = pSourceNodeId;
        this.sourcePortId = pSourcePortId;
        this.targetNodeId = pTargetNodeId;
        this.targetPortId = pTargetPortId;
        this.kind = pKind;
        this.mValid = true;
    }
}
