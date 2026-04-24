import type { PotatnoDocumentFunction } from '../document/potatno-document-function.ts';
import type { PotatnoDocumentNode } from '../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../document/potatno-document-port.ts';
import type { PotatnoDocument } from '../document/potatno-document.ts';
import type { PotatnoCodeFileSerializationResult, SerializedConnection, SerializedFunction, SerializedNode, SerializedNodePort, SerializedPortDefinition } from '../serialization/potatno-serialization-types.ts';

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
export class PotatnoSerializer {
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
    public serialize(pDocument: PotatnoDocument): PotatnoCodeFileSerializationResult {
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
    private serializeFunction(pFunction: PotatnoDocumentFunction): SerializedFunction {
        // Build a temporary node to id map for this serialization pass.
        const lNodeIdMap = new Map<PotatnoDocumentNode, string>();

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
            for (const lOutputPort of lNode.outputs.values()) {
                // Each connected port is a target (input) port. Find the target nodeId from the temporary map.
                for (const lConnectedPort of lOutputPort.connectedPorts) {
                    // Find the target nodeId from the temporary map.
                    const lTargetNodeId: string = lNodeIdMap.get(lConnectedPort.node)!;

                    lConnections.push({
                        sourceNodeId: lSourceNodeId,
                        sourcePortName: lOutputPort.name,
                        targetNodeId: lTargetNodeId,
                        targetPortName: lConnectedPort.name
                    });
                }
            }
        }

        // Serialize function-signature ports.
        const lInputs: Array<SerializedPortDefinition> = pFunction.inputs.map((pPort) => ({
            name: pPort.name,
            portType: pPort.portType,
            dataType: pPort.portType === 'value' ? pPort.type : null
        }));

        const lOutputs: Array<SerializedPortDefinition> = pFunction.outputs.map((pPort) => ({
            name: pPort.name,
            portType: pPort.portType,
            dataType: pPort.portType === 'value' ? pPort.type : null
        }));

        return {
            label: pFunction.label,
            isSystem: pFunction.isSystem,
            definitionId: pFunction.definition.id,
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
    private serializeNode(pNode: PotatnoDocumentNode, pNodeId: string): SerializedNode {
        const lPorts: Array<SerializedNodePort> = [...pNode.inputs.values(), ...pNode.outputs.values()].map((pPort) => ({
            name: pPort.name,
            direction: pPort.direction,
            portType: pPort.portType,
            dataType: pPort.portType === 'value' ? pPort.type : null
        }));

        return {
            id: pNodeId,
            definitionId: pNode.definition.id,
            name: pNode.name,
            isSystem: pNode.isSystem,
            transformation: { ...pNode.transformation },
            ports: lPorts
        };
    }
}
