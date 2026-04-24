import type { PotatnoProject } from '../project/potatno-project.ts';
import type { PotatnoDocument } from '../document/potatno-document.ts';
import type { PotatnoDocumentFunction } from '../document/potatno-document-function.ts';
import type { PotatnoDocumentNode } from '../document/potatno-document-node.ts';
import type { PotatnoConnection } from '../document/potatno-connection.ts';
import { PotatnoCodeGenerator } from './potatno-code-generator.ts';
import type { PotatnoCodeFileSerializationResult, PotatnoMetadata, SerializedFunction, SerializedNode, SerializedPort, SerializedFlowPort, SerializedConnection } from './potatno-serialization-types.ts';

/**
 * Generates clean code and a separate JSON metadata object containing
 * the full graph structure for deserialization.
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
     * Serialize a code file to a result containing the generated code and metadata object.
     *
     * @param pFile - The code file containing all functions to serialize.
     *
     * @returns The serialization result with separate code and JSON metadata.
     */
    public serialize(pFile: PotatnoDocument): PotatnoCodeFileSerializationResult {
        const lGenerator: PotatnoCodeGenerator = new PotatnoCodeGenerator(this.mConfig);
        const lCleanCode: string = lGenerator.generateProjectCode(pFile.functions);
        const lMetadata: PotatnoMetadata = this.buildMetadata(pFile);

        return { code: lCleanCode, json: lMetadata };
    }

    /**
     * Serialize a single function to a result containing the generated code and metadata object.
     *
     * @param pFunction - The function to serialize.
     *
     * @returns The serialization result for the function.
     */
    public serializeFunction(pFunction: PotatnoDocumentFunction): PotatnoCodeFileSerializationResult {
        const lGenerator: PotatnoCodeGenerator = new PotatnoCodeGenerator(this.mConfig);
        const lCleanCode: string = lGenerator.generateFunctionCode(pFunction);
        const lMetadata: PotatnoMetadata = { functions: [this.serializeFunctionData(pFunction)] };

        return { code: lCleanCode, json: lMetadata };
    }

    /**
     * Build the complete metadata object for a code file.
     *
     * @param pFile - The code file to extract metadata from.
     *
     * @returns The metadata structure containing all functions, nodes, and connections.
     */
    private buildMetadata(pFile: PotatnoDocument): PotatnoMetadata {
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
    private serializeFunctionData(pFunction: PotatnoDocumentFunction): SerializedFunction {
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
            definitionId: pFunction.definition.id,
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
    private serializeNode(pNode: PotatnoDocumentNode): SerializedNode {
        // Serialize input ports.
        const lInputs: Array<SerializedPort> = new Array<SerializedPort>();
        for (const [lName, lPort] of pNode.inputs) {
            lInputs.push({
                name: lName,
                type: lPort.type,
                id: lPort.id,
                valueId: lPort.valueId,
                connectedTo: lPort.connectedTo?.valueId ?? null
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
                connectedTo: lPort.connectedTo?.id ?? null
            });
        }

        // Serialize flow output ports.
        const lFlowOutputs: Array<SerializedFlowPort> = new Array<SerializedFlowPort>();
        for (const [lName, lPort] of pNode.flowOutputs) {
            lFlowOutputs.push({
                name: lName,
                id: lPort.id,
                connectedTo: lPort.connectedTo?.id ?? null
            });
        }

        // Serialize properties.
        const lProperties: Record<string, string> = {};
        for (const [lKey, lValue] of pNode.properties) {
            lProperties[lKey] = lValue;
        }

        return {
            id: pNode.id,
            type: pNode.definition.id,
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
            sourceNodeId: pConnection.sourceNode.id,
            sourcePortId: pConnection.sourcePort.id,
            targetNodeId: pConnection.targetNode.id,
            targetPortId: pConnection.targetPort.id,
            valid: pConnection.valid
        };
    }
}
