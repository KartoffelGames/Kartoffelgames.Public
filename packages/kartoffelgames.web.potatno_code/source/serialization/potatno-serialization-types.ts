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
     * Port name. 
     */
    name: string;

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
     * User-set display name of the node.
      */
    name: string;

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
};

/**
 * Serialized representation of a single port on a node.
 */
export type SerializedNodePort = {
    /** 
     * Port name as registered on the node definition. 
     */
    name: string;

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
     * Port name on the source node. 
     */
    sourcePortName: string;

    /** 
     * NodeId of the node that owns the input port. 
     */
    targetNodeId: string;

    /** 
     * Port name on the target node. 
     */
    targetPortName: string;
};
