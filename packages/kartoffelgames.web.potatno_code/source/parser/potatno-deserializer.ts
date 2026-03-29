import { NodeCategory } from '../node/node-category.enum.ts';
import { PortKind } from '../node/port-kind.enum.ts';
import { PotatnoConnection } from '../document/potatno-connection.ts';
import { PotatnoNode } from '../document/potatno-node.ts';
import { PotatnoFunction } from '../document/potatno-function.ts';
import { PotatnoCodeFile } from '../document/potatno-code-file.ts';
import type { PotatnoNodeDefinition, PotatnoNodeDefinitionPorts } from "../project/potatno-node-definition.ts";
import type { PotatnoProject } from '../project/potatno-project.ts';

/**
 * Parses a code string with a trailing `{commentToken} #potatno {json}` metadata comment
 * back into a PotatnoCodeFile.
 */
export class PotatnoDeserializer {
    private readonly mProject: PotatnoProject;

    /**
     * Constructor.
     *
     * @param pConfig - The project configuration providing node definitions and settings.
     */
    public constructor(pConfig: PotatnoProject) {
        this.mProject = pConfig;
    }

    /**
     * Deserialize a code string into a PotatnoCodeFile.
     * Scans for the last line matching `{commentToken} #potatno ` and parses the JSON payload.
     *
     * @param pCode - The code string containing a trailing JSON metadata comment.
     *
     * @returns The reconstructed code file containing all deserialized functions.
     */
    public deserialize(pCode: string): PotatnoCodeFile {
        const lFile: PotatnoCodeFile = new PotatnoCodeFile();

        // Parse the metadata from the trailing comment line.
        const lMetadata: PotatnoMetadata | null = this.parseMetadataComment(pCode);
        if (!lMetadata) {
            return lFile;
        }

        // Reconstruct functions from metadata.
        for (const lFuncData of lMetadata.functions) {
            const lFunc: PotatnoFunction = this.reconstructFunction(lFuncData);

            // Reconstruct nodes.
            this.reconstructNodes(lFunc, lFuncData.nodes);

            // Restore port connections from serialized node data.
            this.restoreAllPortData(lFunc, lFuncData.nodes);

            // Reconstruct connections.
            this.reconstructConnections(lFunc, lFuncData.connections);

            lFile.addFunction(lFunc);
        }

        // Set first function as active.
        const lFirstId: string | undefined = lFile.functions.keys().next().value;
        if (lFirstId) {
            lFile.setActiveFunction(lFirstId);
        }

        return lFile;
    }

    /**
     * Parse the JSON metadata from the last matching comment line in the code.
     *
     * @param pCode - The raw code string to parse.
     *
     * @returns The parsed metadata structure, or null if no metadata comment was found.
     */
    private parseMetadataComment(pCode: string): PotatnoMetadata | null {
        const lToken: string = this.mProject.commentToken;
        const lPrefix: string = `${lToken} #potatno `;
        const lLines: Array<string> = pCode.split('\n');

        // Scan from the end for the last matching line.
        for (let lI: number = lLines.length - 1; lI >= 0; lI--) {
            const lTrimmed: string = lLines[lI].trim();
            if (lTrimmed.startsWith(lPrefix)) {
                const lJsonStr: string = lTrimmed.substring(lPrefix.length);
                try {
                    return JSON.parse(lJsonStr) as PotatnoMetadata;
                } catch {
                    return null;
                }
            }
        }

        return null;
    }

    /**
     * Reconstruct a function from serialized data.
     *
     * @param pData - The serialized function data.
     *
     * @returns The reconstructed function.
     */
    private reconstructFunction(pData: SerializedFunction): PotatnoFunction {
        const lFunc: PotatnoFunction = new PotatnoFunction(
            pData.id,
            pData.name,
            pData.label,
            pData.system,
            pData.editableByUser
        );

        if (pData.inputs && typeof pData.inputs === 'object') {
            lFunc.setInputs(pData.inputs);
        }
        if (pData.outputs && typeof pData.outputs === 'object') {
            lFunc.setOutputs(pData.outputs);
        }
        if (Array.isArray(pData.imports)) {
            lFunc.setImports(pData.imports);
        }

        return lFunc;
    }

    /**
     * Reconstruct nodes from serialized data and add them to a function's graph.
     *
     * @param pFunction - The function whose graph receives the reconstructed nodes.
     * @param pNodes - The serialized node data.
     */
    private reconstructNodes(pFunction: PotatnoFunction, pNodes: Array<SerializedNode>): void {
        for (const lNodeData of pNodes) {
            const lCategory: string = lNodeData.category;

            // Get the node definition from the configuration.
            const lDefinition = this.mProject.nodeDefinitions.get(lNodeData.nodeDefinitionId);

            if (lDefinition) {
                // Reconstruct via definition.
                const lNode: PotatnoNode = new PotatnoNode(
                    lNodeData.id,
                    lDefinition,
                    lNodeData.position ?? { x: 0, y: 0 },
                    lNodeData.system ?? false
                );

                // Restore size.
                if (lNodeData.size) {
                    lNode.resizeTo(lNodeData.size.w, lNodeData.size.h);
                }

                // Restore properties.
                if (lNodeData.properties) {
                    for (const [lKey, lValue] of Object.entries(lNodeData.properties)) {
                        lNode.properties.set(lKey, lValue);
                    }
                }

                pFunction.graph.addExistingNode(lNode);
            } else if (lCategory === NodeCategory.Input || lCategory === NodeCategory.Output) {
                // TODO: Create a node of type error if definition is missing instead of trying to reconstruct a minimal node.

                // Input/output nodes -- create a minimal definition from serialized port data.
                const lInputPorts: PotatnoNodeDefinitionPorts = {};
                for (const lPort of (lNodeData.inputs ?? [])) {
                    lInputPorts[lPort.name] = { nodeType: 'value', dataType: lPort.type };
                }
                const lOutputPorts: PotatnoNodeDefinitionPorts = {};
                for (const lPort of (lNodeData.outputs ?? [])) {
                    lOutputPorts[lPort.name] = { nodeType: 'value', dataType: lPort.type };
                }

                const lMinDef: PotatnoNodeDefinition = this.mProject.nodeDefinitions.get(lNodeData.nodeDefinitionId)!;

                const lNode: PotatnoNode = new PotatnoNode(
                    lNodeData.id,
                    lMinDef,
                    lNodeData.position ?? { x: 0, y: 0 },
                    lNodeData.system ?? true
                );

                // Restore size.
                if (lNodeData.size) {
                    lNode.resizeTo(lNodeData.size.w, lNodeData.size.h);
                }

                // Restore properties.
                if (lNodeData.properties) {
                    for (const [lKey, lValue] of Object.entries(lNodeData.properties)) {
                        lNode.properties.set(lKey, lValue);
                    }
                }

                pFunction.graph.addExistingNode(lNode);
            }
        }
    }

    /**
     * Restore port connection data on all nodes from the serialized node data.
     * Must be called after all nodes are created so that ports exist.
     *
     * @param pFunction - The function whose nodes need port data restoration.
     * @param pNodes - The serialized node data containing port connection info.
     */
    private restoreAllPortData(pFunction: PotatnoFunction, pNodes: Array<SerializedNode>): void {
        for (const lNodeData of pNodes) {
            const lNode: PotatnoNode | undefined = pFunction.graph.getNode(lNodeData.id);
            if (!lNode) {
                continue;
            }

            // Restore input port connections.
            if (Array.isArray(lNodeData.inputs)) {
                for (const lInputData of lNodeData.inputs) {
                    const lPort = lNode.inputs.get(lInputData.name);
                    if (lPort && lInputData.connectedTo) {
                        lPort.connectedTo = lInputData.connectedTo;
                    }
                }
            }

            // Restore flow input port connections.
            if (Array.isArray(lNodeData.flowInputs)) {
                for (const lFlowData of lNodeData.flowInputs) {
                    const lPort = lNode.flowInputs.get(lFlowData.name);
                    if (lPort && lFlowData.connectedTo) {
                        lPort.connectedTo = lFlowData.connectedTo;
                    }
                }
            }

            // Restore flow output port connections.
            if (Array.isArray(lNodeData.flowOutputs)) {
                for (const lFlowData of lNodeData.flowOutputs) {
                    const lPort = lNode.flowOutputs.get(lFlowData.name);
                    if (lPort && lFlowData.connectedTo) {
                        lPort.connectedTo = lFlowData.connectedTo;
                    }
                }
            }
        }
    }

    /**
     * Reconstruct connections from the serialized connection data and add them to the graph.
     *
     * @param pFunction - The function whose graph receives the reconstructed connections.
     * @param pConnections - The serialized connection data.
     */
    private reconstructConnections(pFunction: PotatnoFunction, pConnections: Array<SerializedConnection>): void {
        for (const lConnData of pConnections) {
            const lKind: PortKind = lConnData.kind === PortKind.Flow ? PortKind.Flow : PortKind.Data;

            const lConnection: PotatnoConnection = new PotatnoConnection(
                lConnData.id,
                lConnData.sourceNodeId,
                lConnData.sourcePortId,
                lConnData.targetNodeId,
                lConnData.targetPortId,
                lKind
            );

            lConnection.valid = lConnData.valid ?? true;

            pFunction.graph.addExistingConnection(lConnection);
        }
    }
}

/**
 * Top-level metadata structure parsed from the JSON comment.
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
    inputs: PotatnoNodeDefinitionPorts;
    outputs: PotatnoNodeDefinitionPorts;
    imports: Array<string>;
    nodes: Array<SerializedNode>;
    connections: Array<SerializedConnection>;
}

/**
 * Serialized representation of a node.
 */
interface SerializedNode {
    id: string;
    nodeDefinitionId: string;
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
