import { PotatnoDocumentFunction } from '../document/potatno-document-function.ts';
import { PotatnoDocumentNode, PotatnoDocumentNodePortConfiguration } from '../document/potatno-document-node.ts';
import { PotatnoDocument } from '../document/potatno-document.ts';
import { PotatnoProjectType } from "../project/potatno-project-types-definition.ts";
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
export class PotatnoDeserializer<TProject extends PotatnoProject> {
    private readonly mProject: TProject;

    /**
     * Constructor.
     *
     * @param pProject - The project configuration used to look up definitions.
     */
    public constructor(pProject: TProject) {
        this.mProject = pProject;
    }

    /**
     * Reconstruct a PotatnoDocument from serialized metadata.
     *
     * @param pData - The metadata object previously produced by PotatnoSerializer.
     *
     * @returns The fully reconstructed document.
     */
    public deserialize(pData: PotatnoCodeFileSerializationResult): PotatnoDocument<TProject> {
        const lDocument: PotatnoDocument<TProject> = new PotatnoDocument(this.mProject);

        for (const lFuncData of pData.functions) {
            lDocument.addFunction(this.deserializeFunction(lFuncData, lDocument));
        }

        return lDocument;
    }

    // ── Private helpers ────────────────────────────────────────────────────────

    /**
     * Reconstruct a single function from its serialized form.
     */
    private deserializeFunction(pData: SerializedFunction, pDocument: PotatnoDocument<TProject>): PotatnoDocumentFunction<TProject> {
        const lFunc: PotatnoDocumentFunction<TProject> = new PotatnoDocumentFunction(this.mProject, pDocument, {
            definitionId: pData.definitionId,
            id: pData.id,
            label: pData.label,
            isSystem: pData.isSystem
        });

        // Restore imports.
        for (const lImport of pData.imports) {
            lFunc.addImport(lImport);
        }

        // Restore function-signature I/O port definitions.
        for (const lPortDefinition of pData.inputs) {
            lFunc.addInput({ label: lPortDefinition.label, dataType: lPortDefinition.dataType });
        }
        for (const lPortDefinition of pData.outputs) {
            lFunc.addOutput({ label: lPortDefinition.label, dataType: lPortDefinition.dataType });
        }

        // Create all nodes and build a nodeId → node lookup map.
        const lNodeMap: Map<string, PotatnoDocumentNode<TProject>> = new Map();
        for (const lNodeData of pData.nodes) {
            const lNode: PotatnoDocumentNode<TProject> = this.deserializeNode(lNodeData, lFunc, pDocument);
            lNodeMap.set(lNodeData.id, lNode);
        }

        // Restore port connections from the flat connections list.
        for (const lConnection of pData.connections) {
            const lSourceNode: PotatnoDocumentNode<TProject> | undefined = lNodeMap.get(lConnection.sourceNodeId);
            const lTargetNode: PotatnoDocumentNode<TProject> | undefined = lNodeMap.get(lConnection.targetNodeId);
            if (!lSourceNode || !lTargetNode) {
                continue;
            }

            const lSourcePort = lSourceNode.outputs.map.get(lConnection.sourcePortId);
            const lTargetPort = lTargetNode.inputs.map.get(lConnection.targetPortId);
            if (!lSourcePort || !lTargetPort) {
                continue;
            }

            lSourcePort.connect(lTargetPort);
        }

        return lFunc;
    }

    /**
     * Reconstruct a single node from its serialized form.
     * When the definition is still present in the project or document, newNodeByDefinition is used.
     * When the definition is gone, newNode reconstructs the node from the serialized port snapshot.
     */
    private deserializeNode(pData: SerializedNode, pFunction: PotatnoDocumentFunction<TProject>, pDocument: PotatnoDocument<TProject>): PotatnoDocumentNode<TProject> {
        // Try to find definition in project node definitions first, then document function node definitions.
        const lDefinition = this.mProject.nodeDefinitions.find((pDefinition) => pDefinition.id === pData.definitionId) ?? pDocument.nodeDefinitions.find((pDefinition) => pDefinition.id === pData.definitionId);

        let lNode: PotatnoDocumentNode<TProject>;

        if (lDefinition) {
            lNode = pFunction.newNode(lDefinition, { ...pData.transformation }, pData.isSystem);
        } else {
            // Definition is gone — reconstruct from the serialized port snapshot.
            const lInputPorts: Array<PotatnoDocumentNodePortConfiguration<TProject>> = pData.ports.filter((pPort) => pPort.direction === 'input')
                .map((pPort) => {
                    return {
                        dataType: pPort.dataType as PotatnoProjectType<TProject> | null,
                        definitionId: pPort.definitionId,
                        label: pPort.label,
                        portType: pPort.portType
                    } satisfies PotatnoDocumentNodePortConfiguration<TProject>;
                });

            const lOutputPorts: Array<PotatnoDocumentNodePortConfiguration<TProject>> = pData.ports.filter((pPort) => pPort.direction === 'output')
                .map((pPort) => {
                    return {
                        dataType: pPort.dataType as PotatnoProjectType<TProject> | null,
                        definitionId: pPort.definitionId,
                        label: pPort.label,
                        portType: pPort.portType
                    } satisfies PotatnoDocumentNodePortConfiguration<TProject>;
                });

            // Create a new node.
            lNode = new PotatnoDocumentNode<TProject>(this.mProject, pDocument, pFunction, {
                category: pData.category,
                definitionId: pData.definitionId,
                ports: {
                    input: lInputPorts,
                    output: lOutputPorts
                },
                isSystem: pData.isSystem,
                label: pData.label,
                transformation: { ...pData.transformation }
            });

            pFunction.addNode(lNode);
        }

        lNode.label = pData.label;

        // Restore direct values for value input ports.
        for (const lPortData of pData.ports) {
            if (lPortData.portType === 'value' && lPortData.directValue.length > 0) {
                const lPort = lNode.inputs.map.get(lPortData.definitionId);
                if (lPort) {
                    lPort.setDirectValue(lPortData.directValue);
                }
            }
        }

        return lNode;
    }
}
