import { PortKind } from '../enum/port-kind.enum.ts';

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

    public set valid(pValue: boolean) {
        this.mValid = pValue;
    }

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
