import { PortKind } from '../node/port-kind.enum.ts';
import { PotatnoConnection } from '../document/potatno-connection.ts';
import { PotatnoNode } from '../document/potatno-node.ts';
import { PotatnoFunction } from '../document/potatno-function.ts';
import { PotatnoCodeFile } from '../document/potatno-code-file.ts';
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
    public deserialize(pData: PotatnoMetadata): PotatnoCodeFile {
        const lFile: PotatnoCodeFile = new PotatnoCodeFile();

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

        // Set first function as active.
        const lFirstId: string | undefined = lFile.functions.keys().next().value;
        if (lFirstId) {
            lFile.setActiveFunction(lFirstId);
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
