import type { PotatnoNodeDefinitionPorts } from '../project/potatno-node-definition.ts';

/**
 * Result of serializing a PotatnoCodeFile.
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
    id: string;
    name: string;
    label: string;
    system: boolean;
    editableByUser: boolean;
    definitionId: string;
    inputs: PotatnoNodeDefinitionPorts;
    outputs: PotatnoNodeDefinitionPorts;
    imports: Array<string>;
    nodes: Array<SerializedNode>;
    connections: Array<SerializedConnection>;
};

/**
 * Serialized representation of a node.
 */
export type SerializedNode = {
    id: string;
    type: string;
    category: string;
    position: { x: number; y: number };
    size: { w: number; h: number };
    system: boolean;
    properties: Record<string, string>;
    inputs: Array<SerializedPort>;
    outputs: Array<SerializedPort>;
    flowInputs: Array<SerializedFlowPort>;
    flowOutputs: Array<SerializedFlowPort>;
};

/**
 * Serialized representation of a data port.
 */
export type SerializedPort = {
    name: string;
    type: string;
    id: string;
    valueId: string;
    connectedTo?: string | null;
};

/**
 * Serialized representation of a flow port.
 */
export type SerializedFlowPort = {
    name: string;
    id: string;
    connectedTo?: string | null;
};

/**
 * Serialized representation of a connection.
 */
export type SerializedConnection = {
    id: string;
    kind: string;
    sourceNodeId: string;
    sourcePortId: string;
    targetNodeId: string;
    targetPortId: string;
    valid: boolean;
};
