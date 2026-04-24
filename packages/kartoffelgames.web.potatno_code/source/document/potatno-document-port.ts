import { Exception } from "../../../kartoffelgames.core/source/exception/exception.ts";
import { PotatnoPortDefinitionDirection, PotatnoPortDefinitionType } from "../project/potatno-port-definition.ts";

/**
 * A data port instance on a node.
 */
export class PotatnoDocumentPort {
    private readonly mConnectedPorts: Set<PotatnoDocumentPort>;
    private readonly mDirection: PotatnoPortDefinitionDirection;
    private readonly mName: string;
    private readonly mValueType: string | null;
    private readonly mPortType: PotatnoPortDefinitionType;

    /**
     * The connected port.
     */
    public get connectedPorts(): Set<PotatnoDocumentPort> {
        return this.mConnectedPorts;
    }

    /**
     * Get the direction of the port.
     */
    public get direction(): PotatnoPortDefinitionDirection {
        return this.mDirection;
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
    public get portType(): PotatnoPortDefinitionType {
        return this.mPortType;
    }

    /**
     * Get the data type of the port.
     */
    public get type(): string {
        return this.mValueType ?? '';
    }

    /**
     * Create a new data port.
     *
     * @param pName - Name of the port, also used for display.
     * @param pDirection - Whether the port is an input or output.
     * @param pPortType - Whether the port is a flow port or a value port.
     * @param pValueType - Data type of the port. Should be empty for flow ports and must be set for value ports.
     */
    public constructor(pName: string, pDirection: PotatnoPortDefinitionDirection, pPortType: PotatnoPortDefinitionType, pValueType: string | null) {
        // Validate port type and value type consistency.
        if (pPortType === 'flow' && pValueType !== null) {
            throw new Exception(`Flow ports cannot have a value type.`, this);
        }
        if (pPortType === 'value' && pValueType === null) {
            throw new Exception(`Value ports must have a value type.`, this);
        }

        this.mName = pName;
        this.mValueType = pValueType;
        this.mDirection = pDirection;
        this.mPortType = pPortType;
        this.mConnectedPorts = new Set<PotatnoDocumentPort>();
    }

    /**
     * Connect this port to another.
     * The ports must have opposite directions and the same data type.
     * It also updates the connected port's state to maintain consistency.
     * 
     * @param pPort - The port to connect to. 
     */
    public connect(pPort: PotatnoDocumentPort): void {
        // Skip if already connected.
        if (this.mConnectedPorts.has(pPort)) {
            return;
        }

        // Validate that the ports can be connected by port type.
        if (this.mPortType !== pPort.portType) {
            throw new Exception(`Cannot connect port ${this.mName} to port ${pPort.mName} due to incompatible port types.`, this);
        }

        // Validate that the ports can be connected by direction.
        if (this.mDirection === pPort.direction) {
            throw new Exception(`Cannot connect port ${this.mName} to port ${pPort.mName} due to incompatible directions.`, this);
        }

        // Validate that the ports can be connected by value type if they are value ports.
        if (this.mPortType === 'value' && this.mValueType !== pPort.type) {
            throw new Exception(`Cannot connect port ${this.mName} to port ${pPort.mName} due to incompatible value types.`, this);
        }

        // Check if port allows multiple connections.
        // Flow ports can only have a N-Import and 1-Export
        // Value ports can only have a 1-Import and N-Export
        const lAllowsMultipleConnections: boolean = (this.mPortType === 'flow' && this.mDirection === 'input') || (this.mPortType === 'value' && this.mDirection === 'output');

        // Flow inputs and value outputs can fan out. The opposite sides are limited to one connection.
        if (!lAllowsMultipleConnections) {
            for (const connectedPort of Array.from(this.mConnectedPorts)) {
                this.disconnect(connectedPort);
            }
        }

        // Connect port.
        this.mConnectedPorts.add(pPort);

        // Also connect the other port.
        pPort.connect(this);
    }

    /**
     * Disconnect this port from another.
     * It also updates the connected port's state to maintain consistency.
     * 
     * @param pPort - The port that should be disconnected. 
     */
    public disconnect(pPort: PotatnoDocumentPort): void {
        // Skip if not connected.
        if (!this.mConnectedPorts.has(pPort)) {
            return;
        }

        // Disconnect port.
        this.mConnectedPorts.delete(pPort);

        // Also disconnect the other port.
        pPort.disconnect(this);
    }
}