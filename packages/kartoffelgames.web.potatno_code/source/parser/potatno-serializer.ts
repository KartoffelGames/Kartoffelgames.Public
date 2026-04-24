import type { PotatnoProject } from '../project/potatno-project.ts';
import type { PotatnoDocument } from '../document/potatno-document.ts';
import type { PotatnoDocumentFunction } from '../document/potatno-document-function.ts';
import type { PotatnoDocumentNode } from '../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../document/potatno-document-port.ts';
import type {
    PotatnoCodeFileSerializationResult,
    PotatnoMetadata,
    SerializedFunction,
    SerializedNode,
    SerializedNodePort,
    SerializedPortDefinition
} from './potatno-serialization-types.ts';

/**
 * Serializes a PotatnoDocument to a plain JSON metadata object.
 *
 * Node identity is ephemeral: stable nodeIds are generated fresh during each
 * serialization pass using a local Map<PotatnoDocumentNode, string> and stored
 * in the JSON so the deserializer can reconstruct connections without requiring
 * an id property on the node class itself.
 *
 * Connection strategy: only value-input ports and flow-output ports store a
 * connectedTo reference because those sides are limited to exactly one connection
 * each, which avoids duplicating connection data in the JSON.
 */
export class PotatnoSerializer {
    private readonly mProject: PotatnoProject<any>;

    /**
     * Constructor.
     *
     * @param pProject - The project configuration.
     */
    public constructor(pProject: PotatnoProject<any>) {
        this.mProject = pProject;
    }

    /**
     * Serialize a complete PotatnoDocument.
     *
     * @param pDocument - The document to serialize.
     *
     * @returns Serialization result containing the metadata JSON.
     *          The code field is reserved for a separate code-generation step.
     */
    public serialize(pDocument: PotatnoDocument): PotatnoCodeFileSerializationResult {
        const lMetadata: PotatnoMetadata = this.buildMetadata(pDocument);
        return { code: '', json: lMetadata };
    }

    // ── Private helpers ────────────────────────────────────────────────────────

    /**
     * Build the top-level metadata object.
     */
    private buildMetadata(pDocument: PotatnoDocument): PotatnoMetadata {
        const lFunctions: Array<SerializedFunction> = [];

        for (const lFunc of pDocument.functions) {
            lFunctions.push(this.serializeFunction(lFunc));
        }

        return { functions: lFunctions };
    }

    /**
     * Serialize a single function including all its nodes and port connections.
     */
    private serializeFunction(pFunction: PotatnoDocumentFunction): SerializedFunction {
        // Build a temporary node → id map for this serialization pass.
        const lNodeIdMap = new Map<PotatnoDocumentNode, string>();
        let lCounter = 0;
        for (const lNode of pFunction.nodes) {
            lNodeIdMap.set(lNode, `node_${lCounter++}`);
        }

        // Serialize all nodes.
        const lNodes: Array<SerializedNode> = [];
        for (const lNode of pFunction.nodes) {
            const lNodeId: string = lNodeIdMap.get(lNode)!;
            lNodes.push(this.serializeNode(lNode, lNodeId, lNodeIdMap));
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
            system: pFunction.system,
            definitionId: pFunction.definition.id,
            inputs: lInputs,
            outputs: lOutputs,
            imports: [...pFunction.imports],
            nodes: lNodes
        };
    }

    /**
     * Serialize a single node with all its ports.
     */
    private serializeNode(pNode: PotatnoDocumentNode, pNodeId: string, pNodeIdMap: Map<PotatnoDocumentNode, string>): SerializedNode {
        const lPorts: Array<SerializedNodePort> = [];

        for (const lPort of pNode.inputs.values()) {
            lPorts.push(this.serializePort(lPort, pNodeIdMap));
        }

        for (const lPort of pNode.outputs.values()) {
            lPorts.push(this.serializePort(lPort, pNodeIdMap));
        }

        return {
            nodeId: pNodeId,
            definitionId: pNode.definition.id,
            name: pNode.name,
            system: pNode.system,
            transformation: { ...pNode.transformation },
            ports: lPorts
        };
    }

    /**
     * Serialize a single port.
     *
     * Connection data is written only for value-input and flow-output ports
     * because those are the constrained sides (at most one connection each).
     * The opposite sides (value-output / flow-input) fan out to many partners
     * and will be restored implicitly when the constrained sides are reconnected.
     */
    private serializePort(pPort: PotatnoDocumentPort, pNodeIdMap: Map<PotatnoDocumentNode, string>): SerializedNodePort {
        const lSerialized: SerializedNodePort = {
            name: pPort.name,
            direction: pPort.direction,
            portType: pPort.portType,
            dataType: pPort.portType === 'value' ? pPort.type : null
        };

        const lShouldStoreConnection: boolean =
            (pPort.portType === 'value' && pPort.direction === 'input') ||
            (pPort.portType === 'flow' && pPort.direction === 'output');

        if (lShouldStoreConnection && pPort.connectedPorts.size > 0) {
            const lConnectedPort: PotatnoDocumentPort = [...pPort.connectedPorts][0];
            const lConnectedNodeId: string | null = this.findNodeIdForPort(lConnectedPort, pNodeIdMap);

            lSerialized.connectedToNodeId = lConnectedNodeId;
            lSerialized.connectedToPortName = lConnectedNodeId !== null ? lConnectedPort.name : null;
        }

        return lSerialized;
    }

    /**
     * Find the serialized nodeId for the node that owns the given port.
     */
    private findNodeIdForPort(pPort: PotatnoDocumentPort, pNodeIdMap: Map<PotatnoDocumentNode, string>): string | null {
        for (const [lNode, lId] of pNodeIdMap) {
            for (const lNodePort of [...lNode.inputs.values(), ...lNode.outputs.values()]) {
                if (lNodePort === pPort) {
                    return lId;
                }
            }
        }

        return null;
    }
}
