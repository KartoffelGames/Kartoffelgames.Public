import type { PotatnoProject } from '../project/potatno-project.ts';
import type { PotatnoCodeFile } from '../document/potatno-code-file.ts';
import type { PotatnoFunction } from '../project/potatno-function.ts';
import type { PotatnoNode } from '../document/potatno-node.ts';
import type { PotatnoConnection } from '../document/potatno-connection.ts';
import type { PotatnoProjectNodeDefinitionPorts } from '../project/potatno-node-definition.ts';
import { PotatnoCodeGenerator } from './potatno-code-generator.ts';

/**
 * Generates clean code with a single-line JSON comment at the end containing
 * the full graph structure for deserialization.
 *
 * Output format:
 * ```
 * <generated code>
 * {commentToken} #potatno {json}
 * ```
 */
export class PotatnoSerializer {
    private readonly mConfig: PotatnoProject;

    /**
     * Constructor.
     *
     * @param pConfig - The editor configuration used to initialize the code generator.
     */
    public constructor(pConfig: PotatnoProject) {
        this.mConfig = pConfig;
    }

    /**
     * Serialize a code file to a clean code string with a trailing JSON metadata comment.
     *
     * @param pFile - The code file containing all functions to serialize.
     *
     * @returns The serialized code string with a single JSON metadata comment at the end.
     */
    public serialize(pFile: PotatnoCodeFile): string {
        const lGenerator: PotatnoCodeGenerator = new PotatnoCodeGenerator(this.mConfig);
        const lCleanCode: string = lGenerator.generateProjectCode(pFile.functions);
        const lMetadata: PotatnoMetadata = this.buildMetadata(pFile);
        const lToken: string = this.mConfig.commentToken;
        const lJsonLine: string = `${lToken} #potatno ${JSON.stringify(lMetadata)}`;

        return `${lCleanCode}\n${lJsonLine}`;
    }

    /**
     * Serialize a single function to a clean code string with a trailing JSON metadata comment.
     *
     * @param pFunction - The function to serialize.
     *
     * @returns The serialized code string for the function with a single JSON metadata comment.
     */
    public serializeFunction(pFunction: PotatnoFunction): string {
        const lGenerator: PotatnoCodeGenerator = new PotatnoCodeGenerator(this.mConfig);
        const lCleanCode: string = lGenerator.generateFunctionCode(pFunction);
        const lMetadata: PotatnoMetadata = { functions: [this.serializeFunctionData(pFunction)] };
        const lToken: string = this.mConfig.commentToken;
        const lJsonLine: string = `${lToken} #potatno ${JSON.stringify(lMetadata)}`;

        return `${lCleanCode}\n${lJsonLine}`;
    }

    /**
     * Build the complete metadata object for a code file.
     *
     * @param pFile - The code file to extract metadata from.
     *
     * @returns The metadata structure containing all functions, nodes, and connections.
     */
    private buildMetadata(pFile: PotatnoCodeFile): PotatnoMetadata {
        const lFunctions: Array<SerializedFunction> = new Array<SerializedFunction>();

        for (const lFunc of pFile.functions.values()) {
            lFunctions.push(this.serializeFunctionData(lFunc));
        }

        return { functions: lFunctions };
    }

    /**
     * Serialize a single function's complete graph structure.
     *
     * @param pFunction - The function to serialize.
     *
     * @returns The serialized function data.
     */
    private serializeFunctionData(pFunction: PotatnoFunction): SerializedFunction {
        const lNodes: Array<SerializedNode> = new Array<SerializedNode>();
        const lConnections: Array<SerializedConnection> = new Array<SerializedConnection>();

        // Serialize all nodes.
        for (const lNode of pFunction.graph.nodes.values()) {
            lNodes.push(this.serializeNode(lNode));
        }

        // Serialize all connections.
        for (const lConnection of pFunction.graph.connections.values()) {
            lConnections.push(this.serializeConnection(lConnection));
        }

        return {
            id: pFunction.id,
            name: pFunction.name,
            label: pFunction.label,
            system: pFunction.system,
            editableByUser: pFunction.editableByUser,
            inputs: { ...pFunction.inputs },
            outputs: { ...pFunction.outputs },
            imports: [...pFunction.imports],
            nodes: lNodes,
            connections: lConnections
        };
    }

    /**
     * Serialize a single node with all its port data and properties.
     *
     * @param pNode - The node to serialize.
     *
     * @returns The serialized node data.
     */
    private serializeNode(pNode: PotatnoNode): SerializedNode {
        // Serialize input ports.
        const lInputs: Array<SerializedPort> = new Array<SerializedPort>();
        for (const [lName, lPort] of pNode.inputs) {
            lInputs.push({
                name: lName,
                type: lPort.type,
                id: lPort.id,
                valueId: lPort.valueId,
                connectedTo: lPort.connectedTo
            });
        }

        // Serialize output ports.
        const lOutputs: Array<SerializedPort> = new Array<SerializedPort>();
        for (const [lName, lPort] of pNode.outputs) {
            lOutputs.push({
                name: lName,
                type: lPort.type,
                id: lPort.id,
                valueId: lPort.valueId
            });
        }

        // Serialize flow input ports.
        const lFlowInputs: Array<SerializedFlowPort> = new Array<SerializedFlowPort>();
        for (const [lName, lPort] of pNode.flowInputs) {
            lFlowInputs.push({
                name: lName,
                id: lPort.id,
                connectedTo: lPort.connectedTo
            });
        }

        // Serialize flow output ports.
        const lFlowOutputs: Array<SerializedFlowPort> = new Array<SerializedFlowPort>();
        for (const [lName, lPort] of pNode.flowOutputs) {
            lFlowOutputs.push({
                name: lName,
                id: lPort.id,
                connectedTo: lPort.connectedTo
            });
        }

        // Serialize properties.
        const lProperties: Record<string, string> = {};
        for (const [lKey, lValue] of pNode.properties) {
            lProperties[lKey] = lValue;
        }

        return {
            id: pNode.id,
            type: pNode.definitionName,
            category: pNode.category,
            position: pNode.position,
            size: pNode.size,
            system: pNode.system,
            properties: lProperties,
            inputs: lInputs,
            outputs: lOutputs,
            flowInputs: lFlowInputs,
            flowOutputs: lFlowOutputs
        };
    }

    /**
     * Serialize a single connection.
     *
     * @param pConnection - The connection to serialize.
     *
     * @returns The serialized connection data.
     */
    private serializeConnection(pConnection: PotatnoConnection): SerializedConnection {
        return {
            id: pConnection.id,
            kind: pConnection.kind,
            sourceNodeId: pConnection.sourceNodeId,
            sourcePortId: pConnection.sourcePortId,
            targetNodeId: pConnection.targetNodeId,
            targetPortId: pConnection.targetPortId,
            valid: pConnection.valid
        };
    }
}

/**
 * Top-level metadata structure appended as a JSON comment.
 */
interface PotatnoMetadata {
    functions: Array<SerializedFunction>;
}

/**
 * Serialized representation of a function.
 */
interface SerializedFunction {
    id: string;
    name: string;
    label: string;
    system: boolean;
    editableByUser: boolean;
    inputs: PotatnoProjectNodeDefinitionPorts;
    outputs: PotatnoProjectNodeDefinitionPorts;
    imports: Array<string>;
    nodes: Array<SerializedNode>;
    connections: Array<SerializedConnection>;
}

/**
 * Serialized representation of a node.
 */
interface SerializedNode {
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
}

/**
 * Serialized representation of a data port.
 */
interface SerializedPort {
    name: string;
    type: string;
    id: string;
    valueId: string;
    connectedTo?: string | null;
}

/**
 * Serialized representation of a flow port.
 */
interface SerializedFlowPort {
    name: string;
    id: string;
    connectedTo?: string | null;
}

/**
 * Serialized representation of a connection.
 */
interface SerializedConnection {
    id: string;
    kind: string;
    sourceNodeId: string;
    sourcePortId: string;
    targetNodeId: string;
    targetPortId: string;
    valid: boolean;
}
