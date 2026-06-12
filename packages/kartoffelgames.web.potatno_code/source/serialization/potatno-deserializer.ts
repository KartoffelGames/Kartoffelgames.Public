import { PotatnoDocumentFunction } from '../document/potatno-document-function.ts';
import { PotatnoDocumentNode, PotatnoDocumentNodePortConfiguration } from '../document/potatno-document-node.ts';
import { PotatnoDocument } from '../document/potatno-document.ts';
import { PotatnoProjectTypesDefinition } from "../project/potatno-project-types-definition.ts";
import type { PotatnoProject } from '../project/potatno-project.ts';
import type { PotatnoCodeFileSerializationResult, SerializedFunction, SerializedNode } from './potatno-serialization.type.ts';

/**
 * Reconstructs a PotatnoDocument from a PotatnoMetadata object produced by PotatnoSerializer.
 *
 * Deserialization order within each function:
 *   1. Create the PotatnoDocumentFunction from its definition id.
 *   2. Restore the function-signature I/O port definitions.
 *   3. Create all PotatnoDocumentNode instances and record them in a
 *      temporary Map<nodeId, PotatnoDocumentNode>.
 *   4. Restore port connections from the flat connections list.
 *      connect() is bidirectional, so calling it on the source port is sufficient.
 */
export class PotatnoDeserializer<TProjectTypes extends PotatnoProjectTypesDefinition> {
    private readonly mProject: PotatnoProject<TProjectTypes>;

    /**
     * Constructor.
     *
     * @param pProject - The project configuration used to look up definitions.
     */
    public constructor(pProject: PotatnoProject<TProjectTypes>) {
        this.mProject = pProject;
    }

    /**
     * Reconstruct a PotatnoDocument from serialized metadata.
     *
     * @param pData - The metadata object previously produced by PotatnoSerializer.
     *
     * @returns The fully reconstructed document.
     */
    public deserialize(pData: PotatnoCodeFileSerializationResult): PotatnoDocument<TProjectTypes> {
        const lDocument: PotatnoDocument<TProjectTypes> = new PotatnoDocument(this.mProject);

        for (const lFuncData of pData.functions) {
            lDocument.addFunction(this.deserializeFunction(lFuncData, lDocument));
        }

        return lDocument;
    }

    /**
     * Reconstruct a single function from its serialized form.
     */
    private deserializeFunction(pData: SerializedFunction, pDocument: PotatnoDocument<TProjectTypes>): PotatnoDocumentFunction<TProjectTypes> {
        const lFunction: PotatnoDocumentFunction<TProjectTypes> = new PotatnoDocumentFunction(this.mProject, pDocument, {
            definitionId: pData.definitionId,
            id: pData.id,
            label: pData.label,
            isSystem: pData.isSystem
        });

        // Restore import ids.
        for (const lImportId of pData.imports) {
            lFunction.addImport(lImportId);
        }

        // Restore function-signature I/O port definitions.
        for (const lPortDefinition of pData.inputs) {
            lFunction.addInput({ label: lPortDefinition.label, dataType: lPortDefinition.dataType });
        }
        for (const lPortDefinition of pData.outputs) {
            lFunction.addOutput({ label: lPortDefinition.label, dataType: lPortDefinition.dataType });
        }

        // Create all nodes and build a nodeId → node lookup map.
        const lNodeMap: Map<string, PotatnoDocumentNode<TProjectTypes>> = new Map();
        for (const lNodeData of pData.nodes) {
            lNodeMap.set(lNodeData.id, this.deserializeNode(lNodeData, lFunction, pDocument));
        }

        // Restore port connections from the flat connections list.
        for (const lConnection of pData.connections) {
            if (!lNodeMap.has(lConnection.sourceNodeId) || !lNodeMap.has(lConnection.targetNodeId)) {
                continue;
            }

            const lSourceNode: PotatnoDocumentNode<TProjectTypes> = lNodeMap.get(lConnection.sourceNodeId)!;
            const lTargetNode: PotatnoDocumentNode<TProjectTypes> = lNodeMap.get(lConnection.targetNodeId)!;

            const lSourcePort = lSourceNode.outputs.map.get(lConnection.sourcePortId);
            const lTargetPort = lTargetNode.inputs.map.get(lConnection.targetPortId);
            if (!lSourcePort || !lTargetPort) {
                continue;
            }

            lSourcePort.connect(lTargetPort);
        }

        return lFunction;
    }

    /**
     * Reconstruct a single node from its serialized form.
     * When the definition is still present in the project or document, newNodeByDefinition is used.
     * When the definition is gone, newNode reconstructs the node from the serialized port snapshot.
     */
    private deserializeNode(pData: SerializedNode, pFunction: PotatnoDocumentFunction<TProjectTypes>, pDocument: PotatnoDocument<TProjectTypes>): PotatnoDocumentNode<TProjectTypes> {
        // Try to find definition in project node definitions first, then document function node definitions.
        const lDefinition = pDocument.nodeDefinitions.find((pDefinition) => pDefinition.id === pData.definitionId);

        const lNode: PotatnoDocumentNode<TProjectTypes> = (() => {
            // Use the actual node definition for construction.
            if (lDefinition) {
                return pFunction.addNodeByDefinition(lDefinition, pData.transformation);
            }

            // Definition is gone — reconstruct from the serialized port snapshot.
            const lInputPorts: Array<PotatnoDocumentNodePortConfiguration<TProjectTypes>> = pData.ports.filter((pPort) => pPort.direction === 'input').map((pPort) => {
                return {
                    dataType: pPort.dataType,
                    definitionId: pPort.definitionId,
                    label: pPort.label,
                    portType: pPort.portType
                } satisfies PotatnoDocumentNodePortConfiguration<TProjectTypes>;
            });

            const lOutputPorts: Array<PotatnoDocumentNodePortConfiguration<TProjectTypes>> = pData.ports.filter((pPort) => pPort.direction === 'output').map((pPort) => {
                return {
                    dataType: pPort.dataType,
                    definitionId: pPort.definitionId,
                    label: pPort.label,
                    portType: pPort.portType
                } satisfies PotatnoDocumentNodePortConfiguration<TProjectTypes>;
            });

            // Create a new node.
            return new PotatnoDocumentNode<TProjectTypes>(this.mProject, pDocument, pFunction, {
                category: pData.category,
                definitionId: pData.definitionId,
                ports: {
                    input: lInputPorts,
                    output: lOutputPorts
                },
                label: pData.label,
                transformation: { ...pData.transformation }
            });
        })();

        lNode.label = pData.label;
        pFunction.addNode(lNode);

        // Restore direct values for value input ports.
        for (const lPortData of pData.ports) {
            if (lPortData.portType === 'value' && lPortData.directValue.length > 0) {
                const lPort = lNode.inputs.map.get(lPortData.definitionId);
                if (lPort) {
                    lPort.setDirectValue(lPortData.directValue);
                }
            }
        }

        // Restore per-node preview opt-in. Missing or null means "no preview".
        lNode.preview = pData.preview ?? null;

        return lNode;
    }
}
