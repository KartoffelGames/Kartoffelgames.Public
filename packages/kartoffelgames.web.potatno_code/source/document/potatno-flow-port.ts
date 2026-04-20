import { PortDirection } from '../node/port-direction.enum.ts';

/**
 * A flow port instance on a node. Carries execution order.
 */
export class PotatnoFlowPort {
    private readonly mDirection: PortDirection;
    private readonly mId: string;
    private readonly mName: string;

    private mConnectedTo: PotatnoFlowPort | null;

    /**
     * The connected flow port, or null.
     */
    public get connectedTo(): PotatnoFlowPort | null {
        return this.mConnectedTo;
    }

    /**
     * Set the connected flow port, or null to disconnect.
     */
    public set connectedTo(pValue: PotatnoFlowPort | null) {
        this.mConnectedTo = pValue;
    }

    /**
     * Get the direction of the port.
     */
    public get direction(): PortDirection {
        return this.mDirection;
    }

    /**
     * Get the unique identifier for the port.
     */
    public get id(): string {
        return this.mId;
    }

    /**
     * Get the display name of the port.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Create a new flow port.
     *
     * @param pId - Unique identifier for the port.
     * @param pName - Display name of the port.
     * @param pDirection - Whether the port is an input or output.
     */
    public constructor(pId: string, pName: string, pDirection: PortDirection) {
        this.mId = pId;
        this.mName = pName;
        this.mDirection = pDirection;
        this.mConnectedTo = null;
    }
}
