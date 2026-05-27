import { PotatnoPortDefinitionDirection, PotatnoPortDefinitionType } from "../project/potatno-port-definition.ts";

/**
 * Top-level metadata structure for serialization.
 */
export type PotatnoCodeFileSerializationResult = {
    functions: Array<SerializedFunction>;
};

/**
 * Serialized representation of a function.
 */
export type SerializedFunction = {
    /**
     * Stable hex identifier for this function instance. Preserved across sessions
     * so the function can be referenced as a node in other graphs.
     */
    id: string;

    /**
     * Display label of the function.
     */
    label: string;

    /**
     * Whether the function is system-defined and cannot be removed.
     */
    isSystem: boolean;

    /**
     * The id of the PotatnoFunctionDefinition this function was created from.
     */
    definitionId: string;

    /**
     * Serialized input port definitions for the function signature.
     */
    inputs: Array<SerializedFunctionPort>;

    /**
     * Serialized output port definitions for the function signature.
     */
    outputs: Array<SerializedFunctionPort>;

    /**
     * Import strings active for this function.
     */
    imports: Array<string>;

    /**
     * All nodes contained in this function's graph.
     */
    nodes: Array<SerializedNode>;

    /**
     * All port connections within this function's graph.
     */
    connections: Array<SerializedConnection>;
};

/**
 * Serialized function port used for function-level I/O signatures.
 */
export type SerializedFunctionPort = {
    /**
     * Display label of the port.
     */
    label: string;

    /**
     * Data type of the value port.
     */
    dataType: string;
};

/**
 * Serialized representation of a node instance.
 */
export type SerializedNode = {
    /**
     * Temporary stable id generated during serialization.
     * Used to reference this node from port connection data within the same JSON.
     */
    id: string;

    /**
     * The id of the PotatnoNodeDefinition this node was instantiated from.
     */
    definitionId: string;

    /**
     * Category of the node, used for organizational purposes in the editor.
     */
    category: string;

    /**
     * User-set label of the node.
     */
    label: string;

    /**
     * Whether this is a system node that cannot be removed.
     */
    isSystem: boolean;

    /**
     * Grid position and size of the node.
     */
    transformation: { x: number; y: number; width: number; height: number; };

    /**
     * All ports of this node including their connection data.
     */
    ports: Array<SerializedNodePort>;

    /**
     * Per-node preview opt-in. `null` (or omitted) when the node has no preview;
     * otherwise the pairing of which value output port to preview and which registered
     * display id should render it.
     */
    preview?: SerializedNodePreview | null;
};

/**
 * Serialized form of a node's preview opt-in. Mirrors the runtime `PotatnoDocumentNodePreviewBinding`
 * shape so the choice survives a save/load roundtrip.
 */
export type SerializedNodePreview = {
    /**
     * Definition id of the value output port to preview.
     */
    portId: string;

    /**
     * Id of the registered display that should render the previewed value.
     */
    displayId: string;
};

/**
 * Serialized representation of a single port on a node.
 */
export type SerializedNodePort = {
    /**
     * The id of the port's definition. Used as the map key when looking up ports on a node.
     */
    definitionId: string;

    /**
     * Display label of the port.
     */
    label: string;

    /**
     * Whether the port receives or emits data / flow.
     */
    direction: PotatnoPortDefinitionDirection;

    /**
     * Whether the port carries a value or controls execution flow.
     */
    portType: PotatnoPortDefinitionType;

    /**
     * Data type for value ports; null for flow ports.
     */
    dataType: string | null;

    /**
     * Direct (literal) value for value input ports. Used when the port is not connected.
     * Empty array for flow ports and output ports.
     */
    directValue: Array<string>;
};

/**
 * A single connection between two ports within a function's graph.
 * The source is always the output side, the target is always the input side.
 */
export type SerializedConnection = {
    /**
     * NodeId of the node that owns the output port.
     */
    sourceNodeId: string;

    /**
     * Port id on the source node.
     */
    sourcePortId: string;

    /**
     * NodeId of the node that owns the input port.
     */
    targetNodeId: string;

    /**
     * Port id on the target node.
     */
    targetPortId: string;
};
