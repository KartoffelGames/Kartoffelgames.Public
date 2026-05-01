import { Exception } from "@kartoffelgames/core";
import { PotatnoPortDefinitionDirection, PotatnoPortDefinitionType } from "../project/potatno-port-definition.ts";
import { PotatnoDocumentNode } from "./potatno-document-node.ts";
import { PotatnoProject } from "../project/potatno-project.ts";
import { PotatnoProjectType } from "../project/potatno-project-types-definition.ts";

/**
 * A data port instance on a node.
 */
export class PotatnoDocumentPort<TProjectType extends PotatnoProjectType> {
    private readonly mConnectedPorts: Set<PotatnoDocumentPort<TProjectType>>;
    private readonly mDirection: PotatnoPortDefinitionDirection;
    private readonly mName: string;
    private readonly mValueType: TProjectType | null;
    private readonly mPortType: PotatnoPortDefinitionType;
    private readonly mNode: PotatnoDocumentNode<TProjectType>;
    private readonly mDirectValue: Array<string>;
    private readonly mProject: PotatnoProject<TProjectType>;

    /**
     * The connected port.
     */
    public get connectedPorts(): Set<PotatnoDocumentPort<TProjectType>> {
        return this.mConnectedPorts;
    }

    /**
     * Get the direction of the port.
     */
    public get direction(): PotatnoPortDefinitionDirection {
        return this.mDirection;
    }

    /**
     * Get the direct value of the port. Only applicable for value ports. This value is used when the port is not connected to any other port.
     */
    public get directValue(): ReadonlyArray<string> {
        return this.mDirectValue;
    }

    /**
     * Get the display name of the port.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Get the node this port belongs to.
     */
    public get node(): PotatnoDocumentNode<TProjectType> {
        return this.mNode;
    }

    /**
     * Get the type of the port.
     */
    public get portType(): PotatnoPortDefinitionType {
        return this.mPortType;
    }

    /**
     * Get the project this port belongs to.
     */
    public get project(): PotatnoProject<TProjectType> {
        return this.mProject;
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
    public constructor(pProject: PotatnoProject<TProjectType>, pNode: PotatnoDocumentNode<TProjectType>, pName: string, pDirection: PotatnoPortDefinitionDirection, pPortType: PotatnoPortDefinitionType, pValueType: TProjectType | null) {
        // Validate port type and value type consistency.
        if (pPortType === 'flow' && pValueType !== null) {
            throw new Exception(`Flow ports cannot have a value type.`, this);
        }
        if (pPortType === 'value' && pValueType === null) {
            throw new Exception(`Value ports must have a value type.`, this);
        }

        this.mProject = pProject;
        this.mNode = pNode;
        this.mName = pName;
        this.mValueType = pValueType;
        this.mDirection = pDirection;
        this.mPortType = pPortType;
        this.mConnectedPorts = new Set<PotatnoDocumentPort<TProjectType>>();

        this.mDirectValue = new Array<string>();
        if (pValueType) {
            this.mDirectValue.push(...pProject.types.getType(pValueType).defaultValue);
        }
    }

    /**
     * Connect this port to another.
     * The ports must have opposite directions and the same data type.
     * It also updates the connected port's state to maintain consistency.
     * 
     * @param pPort - The port to connect to. 
     */
    public connect(pPort: PotatnoDocumentPort<TProjectType>): void {
        // Skip if already connected.
        if (this.mConnectedPorts.has(pPort)) {
            return;
        }

        // Validate that the ports can be connected by port type.
        if (this.mPortType !== pPort.portType) {
            throw new Exception(`Cannot connect port ${this.mName} of node ${this.mNode.name} to port ${pPort.mName} of node ${pPort.node.name} due to incompatible port types.`, this);
        }

        // Validate that the ports can be connected by direction.
        if (this.mDirection === pPort.direction) {
            throw new Exception(`Cannot connect port ${this.mName} of node ${this.mNode.name} to port ${pPort.mName} of node ${pPort.node.name} due to incompatible directions.`, this);
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
    public disconnect(pPort: PotatnoDocumentPort<TProjectType>): void {
        // Skip if not connected.
        if (!this.mConnectedPorts.has(pPort)) {
            return;
        }

        // Disconnect port.
        this.mConnectedPorts.delete(pPort);

        // Also disconnect the other port.
        pPort.disconnect(this);
    }

    /**
     * Set a direct value for this port. Only applicable for value ports.
     * This value is used when the port is not connected to any other port.
     * 
     * @param pValue - The value to set, represented as an array of strings. The format of the strings depends on the port's data type and is defined by the project's type configuration. 
     */
    public setDirectValue(pValue: Array<string>): void {
        if (this.mPortType !== 'value') {
            throw new Exception(`Only value ports can have a direct value.`, this);
        }

        // Check if the project type has the same default value length.
        if (pValue.length !== this.mProject.types.getType(this.mValueType!).defaultValue.length) {
            throw new Exception(`The provided value does not match the expected length of the default value for this port's type.`, this);
        }

        // Remove and update the direct value.
        this.mDirectValue.splice(0, this.mDirectValue.length);
        this.mDirectValue.push(...pValue);
    }

    /**
     * Validate this port and return any errors found.
     */
    public validate(): Array<PotatnoDocumentPortValidationError<TProjectType>> {
        const lErrors: Array<PotatnoDocumentPortValidationError<TProjectType>> = new Array<PotatnoDocumentPortValidationError<TProjectType>>();

        // Output ports.
        if (this.mDirection === 'output') {
            // Flow output ports.
            if (this.mPortType === 'flow') {
                // Flow output ports can have a single connection.
                if (this.mConnectedPorts.size > 1) {
                    lErrors.push(new PotatnoDocumentPortValidationError(`Flow output port "${this.mName}" on node "${this.mNode.name}" can only have one connection.`, this));
                }
            }

            return lErrors;
        }

        // Input ports.
        if (this.mDirection === 'input') {
            // Flow input ports.
            if (this.mPortType === 'flow') {
                // Flow input ports must have at least one connection.
                if (this.mConnectedPorts.size === 0) {
                    lErrors.push(new PotatnoDocumentPortValidationError(`Flow input port "${this.mName}" on node "${this.mNode.name}" must have at least one connection.`, this));
                }

                return lErrors;
            }

            // Value input ports.
            if (this.mPortType === 'value') {
                // Only one connection allowed for value input ports.
                if (this.mConnectedPorts.size > 1) {
                    lErrors.push(new PotatnoDocumentPortValidationError(`Value input port "${this.mName}" on node "${this.mNode.name}" can only have one connection.`, this));
                }

                // Value input port must have the same type.
                for (const lConnectedPort of this.mConnectedPorts) {
                    if (lConnectedPort.type !== this.mValueType) {
                        lErrors.push(new PotatnoDocumentPortValidationError(`Value input port "${this.mName}" on node "${this.mNode.name}" expects type "${this.mValueType}" but is connected to type "${lConnectedPort.type}".`, this));
                    }
                }

                return lErrors;
            }
        }

        return lErrors;
    }
}

/**
 * A validation error for a document port.
 */
export class PotatnoDocumentPortValidationError<TProjectType extends PotatnoProjectType> {
    private readonly mMessage: string;
    private readonly mPort: PotatnoDocumentPort<TProjectType>;

    /**
     * Get the error message describing the validation error.
     */
    public get message(): string {
        return this.mMessage;
    }

    /**
     * Get the port that caused the validation error.
     */
    public get port(): PotatnoDocumentPort<TProjectType> {
        return this.mPort;
    }

    public constructor(pMessage: string, pPort: PotatnoDocumentPort<TProjectType>) {
        this.mMessage = pMessage;
        this.mPort = pPort;
    }
}