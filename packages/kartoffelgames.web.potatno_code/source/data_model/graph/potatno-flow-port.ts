import { PortDirection } from '../enum/port-direction.enum.ts';

/**
 * A flow port instance on a node. Carries execution order.
 */
export class PotatnoFlowPort {
    public readonly direction: PortDirection;
    public readonly id: string;
    public readonly name: string;

    private mConnectedTo: string | null;

    /**
     * The id of the connected flow port, or null.
     */
    public get connectedTo(): string | null {
        return this.mConnectedTo;
    }

    public set connectedTo(pValue: string | null) {
        this.mConnectedTo = pValue;
    }

    public constructor(pId: string, pName: string, pDirection: PortDirection) {
        this.id = pId;
        this.name = pName;
        this.direction = pDirection;
        this.mConnectedTo = null;
    }
}
