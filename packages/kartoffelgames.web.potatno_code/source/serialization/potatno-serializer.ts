import type { PotatnoDocumentFunction } from '../document/potatno-document-function.ts';
import type { PotatnoDocumentNode } from '../document/potatno-document-node.ts';
import type { PotatnoDocument } from '../document/potatno-document.ts';
import type { PotatnoProjectTypesDefinition } from '../project/potatno-project-types-definition.ts';
import type { PotatnoCodeFileSerializationResult, SerializedConnection, SerializedFunction, SerializedFunctionPort, SerializedNode, SerializedNodePort, SerializedNodePreview } from './potatno-serialization.type.ts';

/**
 * Serializes a PotatnoDocument to a plain JSON metadata object.
 *
 * Node identity is ephemeral: stable nodeIds are generated fresh during each
 * serialization pass using a local Map<PotatnoDocumentNode, string> and stored
 * in the JSON so the deserializer can reconstruct connections.
 *
 * Connection strategy: all connections are stored as a flat list on the function
 * using source (output) → target (input) references. Both endpoints are stored
 * explicitly for stability.
 */
export class PotatnoSerializer<TProjectTypes extends PotatnoProjectTypesDefinition> {
    /**
     * Constructor.
     */
    public constructor() { }

    /**
     * Serialize a complete PotatnoDocument.
     *
     * @param pDocument - The document to serialize.
     *
     * @returns Serialization result containing the metadata JSON.
     *          The code field is reserved for a separate code-generation step.
     */
    public serialize(pDocument: PotatnoDocument<TProjectTypes>): PotatnoCodeFileSerializationResult {
        // Serialize all functions in the document.
        return {
            functions: [...pDocument.functions].map((pFunction) => {
                return this.serializeFunction(pFunction);
            })
        };
    }

    /**
     * Serialize a single function including all its nodes and port connections.
     */
    private serializeFunction(pFunction: PotatnoDocumentFunction<TProjectTypes>): SerializedFunction {
        // Build a temporary node to id map for this serialization pass.
        const lNodeIdMap = new Map<PotatnoDocumentNode<TProjectTypes>, string>();

        // Assign stable nodeIds based on the order of nodes in the function's graph.
        [...pFunction.nodes].forEach((pNode, pIndex) => {
            lNodeIdMap.set(pNode, `n${pIndex}`);
        });

        // Serialize all nodes.
        const lNodes: Array<SerializedNode> = [...pFunction.nodes].map((pNode) => {
            return this.serializeNode(pNode, lNodeIdMap.get(pNode)!);
        });

        // Collect all connections by iterating output ports on every node.
        // Each connection is stored once: source (output) → target (input).
        const lConnections: Array<SerializedConnection> = [];
        for (const lNode of pFunction.nodes) {
            // Get the source nodeId from the temporary map.
            const lSourceNodeId: string = lNodeIdMap.get(lNode)!;

            // Iterate all output ports and their connected ports to build connection data.
            for (const lOutputPort of lNode.outputs.list) {
                // Each connected port is a target (input) port. Find the target nodeId from the temporary map.
                for (const lConnectedPort of lOutputPort.connectedPorts) {
                    // Find the target nodeId from the temporary map.
                    const lTargetNodeId: string = lNodeIdMap.get(lConnectedPort.node)!;

                    lConnections.push({
                        sourceNodeId: lSourceNodeId,
                        sourcePortId: lOutputPort.definitionId,
                        targetNodeId: lTargetNodeId,
                        targetPortId: lConnectedPort.definitionId
                    });
                }
            }
        }

        // Serialize function-signature ports.
        const lInputs: Array<SerializedFunctionPort> = pFunction.inputs.map((pPort) => ({
            label: pPort.label,
            dataType: pPort.dataType
        }));

        const lOutputs: Array<SerializedFunctionPort> = pFunction.outputs.map((pPort) => ({
            label: pPort.label,
            dataType: pPort.dataType
        }));

        return {
            id: pFunction.id,
            label: pFunction.label,
            isSystem: pFunction.isSystem,
            definitionId: pFunction.definitionId,
            inputs: lInputs,
            outputs: lOutputs,
            imports: [...pFunction.imports],
            nodes: lNodes,
            connections: lConnections
        };
    }

    /**
     * Serialize a single node with all its ports.
     */
    private serializeNode(pNode: PotatnoDocumentNode<TProjectTypes>, pNodeId: string): SerializedNode {
        const lPorts: Array<SerializedNodePort> = [...pNode.inputs.list, ...pNode.outputs.list].map((pPort) => {
            return {
                definitionId: pPort.definitionId,
                label: pPort.label,
                direction: pPort.direction,
                portType: pPort.portType,
                dataType: pPort.portType === 'value' ? pPort.dataType : null,
                directValue: [...pPort.directValue]
            } satisfies SerializedNodePort;
        });

        // Preserve the per-node preview opt-in so the user's choice survives reloads. `null`
        // and "no preview" are equivalent on the runtime side; both serialize as omitted.
        const lPreview: SerializedNodePreview | null = (() => {
            if (!pNode.preview) {
                return null;
            }

            // Copy as it is likly changed after serialization.
            return {
                portDefinitionId: pNode.preview.portDefinitionId,
                displayId: pNode.preview.displayId
            };
        })();

        return {
            id: pNodeId,
            definitionId: pNode.definitionId,
            label: pNode.label,
            transformation: { ...pNode.transformation },
            ports: lPorts,
            preview: lPreview
        };
    }
}
