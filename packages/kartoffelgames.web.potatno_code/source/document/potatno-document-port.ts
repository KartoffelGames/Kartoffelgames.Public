import { Exception } from "../../../kartoffelgames.core/source/exception/exception.ts";

/**
 * A data port instance on a node.
 */
export class PotatnoDocumentPort {
    private mConnectedPort: PotatnoDocumentPort | null;
    private readonly mDirection: PotatnoDocumentPortDirection;
    private readonly mId: string;
    private readonly mName: string;
    private readonly mValueType: string;
    private readonly mPortType: PotatnoDocumentPortType;

    /**
     * The connected port.
     */
    public get connectedPort(): PotatnoDocumentPort | null {
        return this.mConnectedPort;
    }

    /**
     * Get the direction of the port.
     */
    public get direction(): PotatnoDocumentPortDirection {
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
     * Get the type of the port.
     */
    public get portType(): PotatnoDocumentPortType {
        return this.mPortType;
    }

    /**
     * Get the data type of the port.
     */
    public get type(): string {
        return this.mValueType;
    }

    /**
     * Create a new data port.
     *
     * @param pId - Unique identifier for the port.
     * @param pName - Display name of the port.
     * @param pValueType - Data type of the port.
     * @param pDirection - Whether the port is an input or output.
     * @param pValueId - Value identifier used for data propagation.
     */
    public constructor(pId: string, pName: string, pDirection: PotatnoDocumentPortDirection, pPortType: PotatnoDocumentPortType, pValueType: string = '') {
        // Validate port type and value type consistency.
        if (pPortType === 'flow' && pValueType !== '') {
            throw new Exception(`Flow ports cannot have a value type.`, this);
        }
        if (pPortType === 'value' && pValueType === '') {
            throw new Exception(`Value ports must have a value type.`, this);
        }

        this.mId = pId;
        this.mName = pName;
        this.mValueType = pValueType;
        this.mDirection = pDirection;
        this.mPortType = pPortType;
        this.mConnectedPort = null;
    }

    /**
     * Connect this port to another.
     * The ports must have opposite directions and the same data type.
     * It also updates the connected port's state to maintain consistency.
     * 
     * @param port - The port to connect to. 
     */
    public connectTo(port: PotatnoDocumentPort): void {
        // Validate that the ports can be connected by port type.
        if (this.mPortType !== port.portType) {
            throw new Exception(`Cannot connect port ${this.id} to port ${port.id} due to incompatible port types.`, this);
        }

        // Validate that the ports can be connected by direction.
        if (this.mDirection === port.direction) {
            throw new Exception(`Cannot connect port ${this.id} to port ${port.id} due to incompatible directions.`, this);
        }

        // Validate that the ports can be connected by value type if they are value ports.
        if (this.mPortType === 'value' && this.mValueType !== port.type) {
            throw new Exception(`Cannot connect port ${this.id} to port ${port.id} due to incompatible value types.`, this);
        }

        // TODO: I Fucked up. A output port can be connected to multiple input ports... :(

        if (this.mDirection === 'input' && port.direction === 'output') {
            this.mConnectedPort = port;
        } else if (this.mDirection === 'output' && port.direction === 'input') {
            port.mConnectedPort = this;
        } else {
            throw new Exception(`Cannot connect port ${this.id} to port ${port.id} due to incompatible directions.`, this);
        }
    }

    public disconnect(): void {
        if (!this.mConnectedPort) {
            return;
        }

        const connectedPort = this.mConnectedPort;
        this.mConnectedPort = null;

        // Also disconnect the other port
        if (connectedPort.connectedPort === this) {
            connectedPort.mConnectedPort = null;
        }
    }
}

export type PotatnoDocumentPortDirection = 'input' | 'output';
export type PotatnoDocumentPortType = 'value' | 'flow';