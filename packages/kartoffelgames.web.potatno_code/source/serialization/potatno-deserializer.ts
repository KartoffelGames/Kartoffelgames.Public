import { PotatnoDocumentFunction } from '../document/potatno-document-function.ts';
import { PotatnoDocumentNode } from '../document/potatno-document-node.ts';
import { PotatnoDocumentPort } from '../document/potatno-document-port.ts';
import { PotatnoDocument } from '../document/potatno-document.ts';
import type { PotatnoFunctionDefinition } from '../project/potatno-function-definition.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';
import type { PotatnoCodeFileSerializationResult, SerializedFunction, SerializedNode, SerializedPortDefinition } from './potatno-serialization-types.ts';

/**
 * Reconstructs a PotatnoDocument from a PotatnoMetadata object produced by PotatnoSerializer.
 *
 * Deserialization order within each function:
 *   1. Create the PotatnoDocumentFunction from its definition.
 *   2. Restore the function-signature I/O port definitions.
 *   3. Create all PotatnoDocumentNode instances and record them in a
 *      temporary Map<nodeId, PotatnoDocumentNode>.
 *   4. Restore port connections using the stored connectedTo references.
 *      Only value-input and flow-output ports carry connection data; calling
 *      port.connect() on those sides is sufficient because connect() is
 *      bidirectional and will update the partner port automatically.
 */
export class PotatnoDeserializer {
    private readonly mProject: PotatnoProject<any>;

    /**
     * Constructor.
     *
     * @param pProject - The project configuration used to look up definitions.
     */
    public constructor(pProject: PotatnoProject<any>) {
        this.mProject = pProject;
    }

    /**
     * Reconstruct a PotatnoDocument from serialized metadata.
     *
     * @param pData - The metadata object previously produced by PotatnoSerializer.
     *
     * @returns The fully reconstructed document.
     */
    public deserialize(pData: PotatnoCodeFileSerializationResult): PotatnoDocument {
        const lDocument: PotatnoDocument = new PotatnoDocument();

        for (const lFuncData of pData.functions) {
            const lFunc: PotatnoDocumentFunction = this.deserializeFunction(lFuncData);
            lDocument.addFunction(lFunc);
        }

        return lDocument;
    }

    // ── Private helpers ────────────────────────────────────────────────────────

    /**
     * Reconstruct a single function from its serialized form.
     */
    private deserializeFunction(pData: SerializedFunction): PotatnoDocumentFunction {
        const lDefinition: PotatnoFunctionDefinition = this.findFunctionDefinition(pData.definitionId);
        const lFunc: PotatnoDocumentFunction = new PotatnoDocumentFunction(lDefinition, pData.label, pData.system);

        // Restore imports.
        for (const lImport of pData.imports) {
            lFunc.addImport(lImport);
        }

        // Restore function-signature I/O port definitions.
        for (const lPortDef of pData.inputs) {
            lFunc.addInput(this.createPortFromDefinition(lPortDef, 'input'));
        }
        for (const lPortDef of pData.outputs) {
            lFunc.addOutput(this.createPortFromDefinition(lPortDef, 'output'));
        }

        // Create all nodes and build a nodeId → node lookup map.
        const lNodeMap: Map<string, PotatnoDocumentNode> = new Map();
        for (const lNodeData of pData.nodes) {
            const lNode: PotatnoDocumentNode = this.deserializeNode(lNodeData);
            lNodeMap.set(lNodeData.id, lNode);
            lFunc.addNode(lNode);
        }

        // Restore port connections once all nodes exist.
        this.restoreConnections(pData.nodes, lNodeMap);

        return lFunc;
    }

    /**
     * Reconstruct a single node from its serialized form.
     * Ports are created automatically by PotatnoDocumentNode from its definition.
     */
    private deserializeNode(pData: SerializedNode): PotatnoDocumentNode {
        const lDefinition = this.mProject.nodeDefinitions.get(pData.definitionId);
        if (!lDefinition) {
            throw new Error(`Node definition not found: "${pData.definitionId}"`);
        }

        const lNode: PotatnoDocumentNode = new PotatnoDocumentNode(lDefinition, { ...pData.transformation }, pData.system);
        lNode.name = pData.name;

        return lNode;
    }

    /**
     * Iterate serialized port data and call port.connect() for every stored
     * connectedTo reference.
     *
     * Only value-input ports and flow-output ports carry connection data.
     * connect() is bidirectional, so calling it on these constrained sides is
     * sufficient to restore all connections.
     */
    private restoreConnections(pNodes: Array<SerializedNode>, pNodeMap: Map<string, PotatnoDocumentNode>): void {
        for (const lNodeData of pNodes) {
            const lSourceNode: PotatnoDocumentNode | undefined = pNodeMap.get(lNodeData.id);
            if (!lSourceNode) {
                continue;
            }

            for (const lPortData of lNodeData.ports) {
                // Only ports that stored connection data need processing.
                const lCarriesConnectionData: boolean =
                    (lPortData.portType === 'value' && lPortData.direction === 'input') ||
                    (lPortData.portType === 'flow' && lPortData.direction === 'output');

                if (!lCarriesConnectionData) {
                    continue;
                }

                if (!lPortData.connectedToNodeId || !lPortData.connectedToPortName) {
                    continue;
                }

                // Locate the port on the current (source) node.
                const lPort: PotatnoDocumentPort | undefined = lPortData.direction === 'input'
                    ? lSourceNode.inputs.get(lPortData.name)
                    : lSourceNode.outputs.get(lPortData.name);

                if (!lPort) {
                    continue;
                }

                // Locate the target node.
                const lTargetNode: PotatnoDocumentNode | undefined = pNodeMap.get(lPortData.connectedToNodeId);
                if (!lTargetNode) {
                    continue;
                }

                // The connected port is always on the opposite direction.
                const lTargetPort: PotatnoDocumentPort | undefined = lPortData.direction === 'input'
                    ? lTargetNode.outputs.get(lPortData.connectedToPortName)
                    : lTargetNode.inputs.get(lPortData.connectedToPortName);

                if (!lTargetPort) {
                    continue;
                }

                lPort.connect(lTargetPort);
            }
        }
    }

    /**
     * Create a PotatnoDocumentPort from a serialized port definition.
     */
    private createPortFromDefinition(pDef: SerializedPortDefinition, pDirection: 'input' | 'output'): PotatnoDocumentPort {
        return new PotatnoDocumentPort(pDef.name, pDirection, pDef.portType, pDef.dataType);
    }

    /**
     * Look up a function definition by id from the project.
     * Falls back to the entry point if the definition is not found.
     */
    private findFunctionDefinition(pDefinitionId: string): PotatnoFunctionDefinition {
        if (this.mProject.entryPoint.id === pDefinitionId) {
            return this.mProject.entryPoint;
        }

        const lUserFunc: PotatnoFunctionDefinition | undefined = this.mProject.userFunctions.get(pDefinitionId);
        if (lUserFunc) {
            return lUserFunc;
        }

        // Fallback to the entry point if the definition is not found.
        return this.mProject.entryPoint;
    }
}
