import { Exception } from "@kartoffelgames/core";
import { PotatnoPortDefinitionDirection, PotatnoPortDefinitionType } from "../project/potatno-port-definition.ts";
import { PotatnoProjectGenericType, PotatnoProjectType, PotatnoProjectTypesDefinition } from "../project/potatno-project-types-definition.ts";
import { PotatnoProject } from "../project/potatno-project.ts";
import { IPotatnoDocumentItem } from "./i-potatno-document-item.ts";
import { PotatnoDocumentNode } from "./potatno-document-node.ts";
import { PotatnoDocument, PotatnoDocumentPortValidationError } from "./potatno-document.ts";

/**
 * A data port instance on a node.
 */
export class PotatnoDocumentPort<TProject extends PotatnoProject<PotatnoProjectTypesDefinition<string>>> implements IPotatnoDocumentItem<TProject> {
    private mLabel: string;
    private readonly mConnectedPorts: Set<PotatnoDocumentPort<TProject>>;
    private readonly mDefinitionId: string;
    private readonly mDirection: PotatnoPortDefinitionDirection;
    private readonly mDirectValue: Array<string>;
    private readonly mDocument: PotatnoDocument<TProject>;
    private readonly mNode: PotatnoDocumentNode<TProject>;
    private readonly mPortType: PotatnoPortDefinitionType;
    private readonly mProject: TProject;
    private readonly mValueType: PotatnoProjectType<TProject> | PotatnoProjectGenericType | null;

    /**
     * The connected port.
     */
    public get connectedPorts(): Set<PotatnoDocumentPort<TProject>> {
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
     * Get the definition id of the port.
     */
    public get definitionId(): string {
        return this.mDefinitionId;
    }

    /**
     * The document this function belongs to.
     */
    public get document(): PotatnoDocument<TProject> {
        return this.mDocument;
    }

    /**
     * Get the label of the port.
     */
    public get label(): string {
        return this.mLabel;
    } set label(pLabel: string) {
        this.mLabel = pLabel;
    }

    /**
     * Get the node this port belongs to.
     */
    public get node(): PotatnoDocumentNode<TProject> {
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
    public get project(): TProject {
        return this.mProject;
    }

    /**
     * Get the data type of the port.
     * For generic output ports, resolves the generic by finding a connected input port on this node with the same generic type.
     */
    public get dataType(): PotatnoProjectType<TProject> | PotatnoProjectGenericType {
        return this.mValueType ?? '';
    }

    /**
     * Get the resolved data type of the port. 
     * For generic ports, this is the type of the connected port on the opposite side of the generic.
     */
    public get resolvedDataType(): PotatnoProjectType<TProject> | PotatnoProjectGenericType {
        // For none value ports, resolved type is always empty string.
        if (this.mPortType !== 'value') {
            return this.dataType;
        }

        // Resolved type is the same as dataType for non-generic ports.
        if (!this.mProject.types.isGenericType(this.mValueType ?? '')) {
            return this.dataType;
        }

        // When it is a output generic port, use the type of the connected input port with the same generic to resolve the generic type.
        if (this.mDirection === 'output') {
            const lResolvingInputPort = this.mNode.inputs.values().find((pInputPort) => pInputPort.dataType === this.mValueType);
            if (!lResolvingInputPort) {
                return this.dataType;
            }

            return lResolvingInputPort.resolvedDataType;
        }

        // When it is a input generic port, use the type of the connected output port to resolve the generic type.
        if (this.mDirection === 'input') {
            // No connections, no type.
            if (this.mConnectedPorts.size === 0) {
                return this.dataType;
            }

            const lConnectedPort: PotatnoDocumentPort<TProject> = this.mConnectedPorts.values().next().value!;
            return lConnectedPort.resolvedDataType;
        }

        return this.dataType;
    }

    /**
     * Create a new data port.
     *
     * @param pId - Name of the port, also used for display.
     * @param pDirection - Whether the port is an input or output.
     * @param pPortType - Whether the port is a flow port or a value port.
     * @param pValueType - Data type of the port. Should be empty for flow ports and must be set for value ports.
     */
    public constructor(pProject: TProject, pDocument: PotatnoDocument<TProject>, pParameter: PotatnoDocumentPortConstructorParameter<TProject>) {
        // Validate port type and value type consistency.
        if (pParameter.portType === 'flow' && pParameter.dataType !== null) {
            throw new Exception(`Flow ports cannot have a value type.`, this);
        }
        if (pParameter.portType === 'value' && pParameter.dataType === null) {
            throw new Exception(`Value ports must have a value type.`, this);
        }

        this.mProject = pProject;
        this.mDocument = pDocument;
        this.mNode = pParameter.node;
        this.mDefinitionId = pParameter.definitionId;
        this.mLabel = pParameter.label;
        this.mValueType = pParameter.dataType;
        this.mDirection = pParameter.direction;
        this.mPortType = pParameter.portType;
        this.mConnectedPorts = new Set<PotatnoDocumentPort<TProject>>();

        this.mDirectValue = new Array<string>();
        if (pParameter.dataType && !this.mProject.types.isGenericType(pParameter.dataType)) {
            this.mDirectValue.push(...pProject.types.getType(pParameter.dataType).defaultValue);
        }
    }

    /**
     * Connect this port to another.
     * The ports must have opposite directions and the same data type.
     * It also updates the connected port's state to maintain consistency.
     * 
     * @param pPort - The port to connect to. 
     */
    public connect(pPort: PotatnoDocumentPort<TProject>): void {
        // Skip if already connected.
        if (this.mConnectedPorts.has(pPort)) {
            return;
        }

        // Validate that the ports can be connected by port type.
        if (this.mPortType !== pPort.portType) {
            throw new Exception(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to port ${pPort.mDefinitionId} of node ${pPort.node.label} due to incompatible port types.`, this);
        }

        // Validate that the ports can be connected by direction.
        if (this.mDirection === pPort.direction) {
            throw new Exception(`Cannot connect port ${this.mDefinitionId} of node ${this.mNode.label} to port ${pPort.mDefinitionId} of node ${pPort.node.label} due to incompatible directions.`, this);
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
    public disconnect(pPort: PotatnoDocumentPort<TProject>): void {
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

        // Check value type is not generic, as generic ports cannot have a direct value.
        if (this.mProject.types.isGenericType(this.mValueType!)) {
            throw new Exception(`Generic value ports cannot have a direct value.`, this);
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
    public validate(): Array<PotatnoDocumentPortValidationError<TProject>> {
        const lErrors: Array<PotatnoDocumentPortValidationError<TProject>> = new Array<PotatnoDocumentPortValidationError<TProject>>();

        // Output ports.
        if (this.mDirection === 'output') {
            // Flow output ports.
            if (this.mPortType === 'flow') {
                // Flow output ports can have a single connection.
                if (this.mConnectedPorts.size > 1) {
                    lErrors.push(new PotatnoDocumentPortValidationError(`Flow output port "${this.mDefinitionId}" on node "${this.mNode.label}" can only have one connection.`, this));
                }
            }

            // Generic value output: all input ports on this node sharing the same generic must be connected.
            if (this.mPortType === 'value' && this.mProject.types.isGenericType(this.mValueType ?? '')) {
                // Find all input ports on this node with the same generic type.
                const lGenericInputPorts: IteratorObject<PotatnoDocumentPort<TProject>> = this.mNode.inputs.values().filter((pInputPort) => {
                    return pInputPort.dataType === this.mValueType;
                });

                // Check that all these ports are connected, otherwise the generic type cannot be resolved.
                for (const lGenericInputPort of lGenericInputPorts) {
                    if (lGenericInputPort.connectedPorts.size === 0) {
                        lErrors.push(new PotatnoDocumentPortValidationError(`Generic output port "${this.mDefinitionId}" on node "${this.mNode.label}" cannot resolve generic type "${this.mValueType}" because its input port "${lGenericInputPort.definitionId}" is not connected.`, this));
                    }
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
                    lErrors.push(new PotatnoDocumentPortValidationError(`Flow input port "${this.mDefinitionId}" on node "${this.mNode.label}" must have at least one connection.`, this));
                }

                return lErrors;
            }

            // Value input ports.
            if (this.mPortType === 'value') {
                // Only one connection allowed for value input ports.
                if (this.mConnectedPorts.size > 1) {
                    lErrors.push(new PotatnoDocumentPortValidationError(`Value input port "${this.mDefinitionId}" on node "${this.mNode.label}" can only have one connection.`, this));
                }

                // Value input port must have the same type. Skip when either side is a generic.
                for (const lConnectedPort of this.mConnectedPorts) {
                    if (lConnectedPort.resolvedDataType !== this.resolvedDataType) {
                        lErrors.push(new PotatnoDocumentPortValidationError(`Value input port "${this.mDefinitionId}" on node "${this.mNode.label}" expects type "${this.resolvedDataType}" but is connected to type "${lConnectedPort.resolvedDataType}".`, this));
                    }
                }

                return lErrors;
            }
        }

        return lErrors;
    }
}

type PotatnoDocumentPortConstructorParameter<TProject extends PotatnoProject> = {
    definitionId: string,
    direction: PotatnoPortDefinitionDirection,
    label: string,
    node: PotatnoDocumentNode<TProject>,
    portType: PotatnoPortDefinitionType,
    dataType: PotatnoProjectType<TProject> | null;
};
