import { PortDirection } from '../node/port-direction.enum.ts';

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

    /**
     * Set the id of the connected flow port, or null to disconnect.
     */
    public set connectedTo(pValue: string | null) {
        this.mConnectedTo = pValue;
    }

    /**
     * Create a new flow port.
     *
     * @param pId - Unique identifier for the port.
     * @param pName - Display name of the port.
     * @param pDirection - Whether the port is an input or output.
     */
    public constructor(pId: string, pName: string, pDirection: PortDirection) {
        this.id = pId;
        this.name = pName;
        this.direction = pDirection;
        this.mConnectedTo = null;
    }
}
