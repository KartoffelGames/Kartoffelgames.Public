/**
 * Result of serializing a PotatnoDocument.
 * Contains the generated code and the metadata JSON object separately.
 */
export type PotatnoCodeFileSerializationResult = {
    /** The generated code string. */
    code: string;
    /** The metadata JSON object containing all graph structure data. */
    json: PotatnoMetadata;
};

/**
 * Top-level metadata structure for serialization.
 */
export type PotatnoMetadata = {
    functions: Array<SerializedFunction>;
};

/**
 * Serialized representation of a function.
 */
export type SerializedFunction = {
    /** Display label of the function. */
    label: string;
    /** Whether the function is system-defined and cannot be removed. */
    system: boolean;
    /** The id of the PotatnoFunctionDefinition this function was created from. */
    definitionId: string;
    /** Serialized input port definitions for the function signature. */
    inputs: Array<SerializedPortDefinition>;
    /** Serialized output port definitions for the function signature. */
    outputs: Array<SerializedPortDefinition>;
    /** Import strings active for this function. */
    imports: Array<string>;
    /** All nodes contained in this function's graph. */
    nodes: Array<SerializedNode>;
};

/**
 * Serialized port definition used for function-level I/O signatures.
 */
export type SerializedPortDefinition = {
    /** Port name. */
    name: string;
    /** Whether the port carries a value or controls execution flow. */
    portType: 'value' | 'flow';
    /** Data type for value ports; null for flow ports. */
    dataType: string | null;
};

/**
 * Serialized representation of a node instance.
 */
export type SerializedNode = {
    /**
     * Temporary stable id generated during serialization.
     * Used to reference this node from port connection data within the same JSON.
     */
    nodeId: string;
    /** The id of the PotatnoNodeDefinition this node was instantiated from. */
    definitionId: string;
    /** User-set display name of the node. */
    name: string;
    /** Whether this is a system node that cannot be removed. */
    system: boolean;
    /** Grid position and size of the node. */
    transformation: { x: number; y: number; width: number; height: number };
    /** All ports of this node including their connection data. */
    ports: Array<SerializedNodePort>;
};

/**
 * Serialized representation of a single port on a node.
 * Connection data is only stored on value-input and flow-output ports
 * because those sides have at most one connection, which avoids duplication.
 */
export type SerializedNodePort = {
    /** Port name as registered on the node definition. */
    name: string;
    /** Whether the port receives or emits data / flow. */
    direction: 'input' | 'output';
    /** Whether the port carries a value or controls execution flow. */
    portType: 'value' | 'flow';
    /** Data type for value ports; null for flow ports. */
    dataType: string | null;
    /**
     * The nodeId of the connected node.
     * Present only on value-input and flow-output ports when a connection exists.
     */
    connectedToNodeId?: string | null;
    /**
     * The port name on the connected node.
     * Present only on value-input and flow-output ports when a connection exists.
     */
    connectedToPortName?: string | null;
};
