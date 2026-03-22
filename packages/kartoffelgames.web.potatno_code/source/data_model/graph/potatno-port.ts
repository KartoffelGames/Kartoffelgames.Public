import { PortDirection } from '../enum/port-direction.enum.ts';

/**
 * A data port instance on a node. Carries typed values.
 */
export class PotatnoPort {
    public readonly direction: PortDirection;
    public readonly id: string;
    public readonly name: string;
    public readonly type: string;
    public readonly valueId: string;

    private mConnectedTo: string | null;

    /**
     * The valueId of the connected output port (for input ports), or null.
     */
    public get connectedTo(): string | null {
        return this.mConnectedTo;
    }

    public set connectedTo(pValue: string | null) {
        this.mConnectedTo = pValue;
    }

    public constructor(pId: string, pName: string, pType: string, pDirection: PortDirection, pValueId: string) {
        this.id = pId;
        this.name = pName;
        this.type = pType;
        this.direction = pDirection;
        this.valueId = pValueId;
        this.mConnectedTo = null;
    }
}
