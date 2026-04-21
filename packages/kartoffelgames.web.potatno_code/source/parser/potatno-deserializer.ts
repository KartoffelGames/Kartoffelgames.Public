import { PortKind } from '../node/port-kind.enum.ts';
import { PotatnoConnection } from '../document/potatno-connection.ts';
import { PotatnoNode } from '../document/potatno-node.ts';
import { PotatnoFunction } from '../document/potatno-function.ts';
import { PotatnoDocument } from '../document/potatno-document.ts';
import type { PotatnoFlowPort } from '../document/potatno-flow-port.ts';
import type { PotatnoDocumentPort } from '../document/potatno-document-port.ts';
import type { PotatnoFunctionDefinition } from '../project/potatno-function-definition.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';
import type { PotatnoMetadata, SerializedFunction, SerializedNode, SerializedConnection } from './potatno-serialization-types.ts';

/**
 * Reconstructs a PotatnoCodeFile from a PotatnoMetadata object.
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
     * Deserialize a metadata object into a PotatnoCodeFile.
     *
     * @param pData - The metadata object containing serialized functions, nodes, and connections.
     *
     * @returns The reconstructed code file containing all deserialized functions.
     */
    public deserialize(pData: PotatnoMetadata): PotatnoDocument {
        const lFile: PotatnoDocument = new PotatnoDocument();

        // Reconstruct functions from metadata.
        for (const lFuncData of pData.functions) {
            const lFunc: PotatnoFunction = this.reconstructFunction(lFuncData);

            // Reconstruct nodes.
            this.reconstructNodes(lFunc, lFuncData.nodes);

            // Restore port connections from serialized node data.
            this.restoreAllPortData(lFunc, lFuncData.nodes);

            // Reconstruct connections.
            this.reconstructConnections(lFunc, lFuncData.connections);

            lFile.addFunction(lFunc);
        }

        return lFile;
    }

    /**
     * Reconstruct a function from serialized data.
     *
     * @param pData - The serialized function data.
     *
     * @returns The reconstructed function.
     */
    private reconstructFunction(pData: SerializedFunction): PotatnoFunction {
        // Look up the function definition from the project.
        const lDefinition: PotatnoFunctionDefinition = this.findFunctionDefinition(pData.definitionId ?? '');

        const lFunc: PotatnoFunction = new PotatnoFunction(
            pData.id,
            pData.name,
            pData.label,
            pData.system,
            pData.editableByUser,
            lDefinition
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
            // Get the node definition from the configuration.
            const lDefinition = this.mProject.nodeDefinitions.get(lNodeData.type);

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
                        const lSourcePort: PotatnoDocumentPort | null = this.findOutputPortByValueId(pFunction, lInputData.connectedTo);
                        if (lSourcePort) {
                            lPort.connectedTo = lSourcePort;
                        }
                    }
                }
            }

            // Restore flow input port connections.
            if (Array.isArray(lNodeData.flowInputs)) {
                for (const lFlowData of lNodeData.flowInputs) {
                    const lPort = lNode.flowInputs.get(lFlowData.name);
                    if (lPort && lFlowData.connectedTo) {
                        const lConnected: PotatnoFlowPort | null = this.findFlowPortAcrossFunction(pFunction, lFlowData.connectedTo);
                        if (lConnected) {
                            lPort.connectedTo = lConnected;
                        }
                    }
                }
            }

            // Restore flow output port connections.
            if (Array.isArray(lNodeData.flowOutputs)) {
                for (const lFlowData of lNodeData.flowOutputs) {
                    const lPort = lNode.flowOutputs.get(lFlowData.name);
                    if (lPort && lFlowData.connectedTo) {
                        const lConnected: PotatnoFlowPort | null = this.findFlowPortAcrossFunction(pFunction, lFlowData.connectedTo);
                        if (lConnected) {
                            lPort.connectedTo = lConnected;
                        }
                    }
                }
            }
        }
    }

    /**
     * Find an output data port across all nodes in a function by its valueId.
     *
     * @param pFunction - The function to search.
     * @param pValueId - The valueId to match.
     *
     * @returns The matching port, or null if not found.
     */
    private findOutputPortByValueId(pFunction: PotatnoFunction, pValueId: string): PotatnoDocumentPort | null {
        for (const lNode of pFunction.graph.nodes.values()) {
            for (const lPort of lNode.outputs.values()) {
                if (lPort.valueId === pValueId) {
                    return lPort;
                }
            }
        }
        return null;
    }

    /**
     * Find a flow port across all nodes in a function by its ID.
     *
     * @param pFunction - The function to search.
     * @param pPortId - The port ID to match.
     *
     * @returns The matching flow port, or null if not found.
     */
    private findFlowPortAcrossFunction(pFunction: PotatnoFunction, pPortId: string): PotatnoFlowPort | null {
        for (const lNode of pFunction.graph.nodes.values()) {
            const lPort: PotatnoFlowPort | null = this.findFlowPortById(lNode, pPortId);
            if (lPort) {
                return lPort;
            }
        }
        return null;
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

            // Look up source and target nodes.
            const lSourceNode: PotatnoNode | undefined = pFunction.graph.getNode(lConnData.sourceNodeId);
            const lTargetNode: PotatnoNode | undefined = pFunction.graph.getNode(lConnData.targetNodeId);

            if (!lSourceNode || !lTargetNode) {
                continue;
            }

            // Look up source and target ports.
            const lSourcePort: PotatnoDocumentPort | PotatnoFlowPort | null = lKind === PortKind.Data
                ? this.findDataPortById(lSourceNode, lConnData.sourcePortId)
                : this.findFlowPortById(lSourceNode, lConnData.sourcePortId);

            const lTargetPort: PotatnoDocumentPort | PotatnoFlowPort | null = lKind === PortKind.Data
                ? this.findDataPortById(lTargetNode, lConnData.targetPortId)
                : this.findFlowPortById(lTargetNode, lConnData.targetPortId);

            if (!lSourcePort || !lTargetPort) {
                continue;
            }

            const lConnection: PotatnoConnection = new PotatnoConnection(
                lConnData.id,
                lSourceNode,
                lSourcePort,
                lTargetNode,
                lTargetPort,
                lKind
            );

            lConnection.valid = lConnData.valid ?? true;

            pFunction.graph.addExistingConnection(lConnection);
        }
    }

    /**
     * Find the function definition for a given definition ID.
     * Checks the entry point first, then user functions.
     *
     * @param pDefinitionId - The definition ID to look up.
     *
     * @returns The matching function definition, or the entry point as fallback.
     */
    private findFunctionDefinition(pDefinitionId: string): PotatnoFunctionDefinition {
        if (pDefinitionId === this.mProject.entryPoint.id) {
            return this.mProject.entryPoint;
        }

        const lUserFunc: PotatnoFunctionDefinition | undefined = this.mProject.userFunctions.get(pDefinitionId);
        if (lUserFunc) {
            return lUserFunc;
        }

        // Fallback to entry point if definition is not found.
        return this.mProject.entryPoint;
    }

    /**
     * Find a data port by ID on a node.
     *
     * @param pNode - The node to search.
     * @param pPortId - The port ID to find.
     *
     * @returns The matching port, or null if not found.
     */
    private findDataPortById(pNode: PotatnoNode, pPortId: string): PotatnoDocumentPort | null {
        for (const lPort of pNode.inputs.values()) {
            if (lPort.id === pPortId) {
                return lPort;
            }
        }
        for (const lPort of pNode.outputs.values()) {
            if (lPort.id === pPortId) {
                return lPort;
            }
        }
        return null;
    }

    /**
     * Find a flow port by ID on a node.
     *
     * @param pNode - The node to search.
     * @param pPortId - The port ID to find.
     *
     * @returns The matching flow port, or null if not found.
     */
    private findFlowPortById(pNode: PotatnoNode, pPortId: string): PotatnoFlowPort | null {
        for (const lPort of pNode.flowInputs.values()) {
            if (lPort.id === pPortId) {
                return lPort;
            }
        }
        for (const lPort of pNode.flowOutputs.values()) {
            if (lPort.id === pPortId) {
                return lPort;
            }
        }
        return null;
    }
}
