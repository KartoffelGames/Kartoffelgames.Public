import { PortDirection } from '../node/port-direction.enum.ts';

/**
 * A data port instance on a node. Carries typed values.
 */
export class PotatnoPort {
    private readonly mDirection: PortDirection;
    private readonly mId: string;
    private readonly mName: string;
    private readonly mType: string;
    private readonly mValueId: string;

    private mConnectedTo: PotatnoPort | null;

    /**
     * The connected output port (for input ports), or null.
     */
    public get connectedTo(): PotatnoPort | null {
        return this.mConnectedTo;
    }

    /**
     * Set the connected output port, or null to disconnect.
     */
    public set connectedTo(pValue: PotatnoPort | null) {
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
     * Get the data type of the port.
     */
    public get type(): string {
        return this.mType;
    }

    /**
     * Get the value identifier used for data propagation.
     */
    public get valueId(): string {
        return this.mValueId;
    }

    /**
     * Create a new data port.
     *
     * @param pId - Unique identifier for the port.
     * @param pName - Display name of the port.
     * @param pType - Data type of the port.
     * @param pDirection - Whether the port is an input or output.
     * @param pValueId - Value identifier used for data propagation.
     */
    public constructor(pId: string, pName: string, pType: string, pDirection: PortDirection, pValueId: string) {
        this.mId = pId;
        this.mName = pName;
        this.mType = pType;
        this.mDirection = pDirection;
        this.mValueId = pValueId;
        this.mConnectedTo = null;
    }
}
