import { PotatnoDocumentFunction } from '../document/potatno-document-function.ts';
import { PotatnoDocumentNode } from '../document/potatno-document-node.ts';
import { PotatnoDocument } from '../document/potatno-document.ts';
import type { PotatnoFunctionDefinition } from '../project/potatno-function-definition.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';
import type { PotatnoCodeFileSerializationResult, SerializedFunction, SerializedNode } from './potatno-serialization-types.ts';

/**
 * Reconstructs a PotatnoDocument from a PotatnoMetadata object produced by PotatnoSerializer.
 *
 * Deserialization order within each function:
 *   1. Create the PotatnoDocumentFunction from its definition.
 *   2. Restore the function-signature I/O port definitions.
 *   3. Create all PotatnoDocumentNode instances and record them in a
 *      temporary Map<nodeId, PotatnoDocumentNode>.
 *   4. Restore port connections from the flat connections list.
 *      connect() is bidirectional, so calling it on the source port is sufficient.
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
            lDocument.addFunction(this.deserializeFunction(lFuncData));
        }

        return lDocument;
    }

    // ── Private helpers ────────────────────────────────────────────────────────

    /**
     * Reconstruct a single function from its serialized form.
     */
    private deserializeFunction(pData: SerializedFunction): PotatnoDocumentFunction {
        const lDefinition: PotatnoFunctionDefinition = this.findFunctionDefinition(pData.definitionId);
        const lFunc: PotatnoDocumentFunction = new PotatnoDocumentFunction(lDefinition, pData.id, pData.label, pData.isSystem);

        // Restore imports.
        for (const lImport of pData.imports) {
            lFunc.addImport(lImport);
        }

        // Restore function-signature I/O port definitions.
        for (const lPortDef of pData.inputs) {
            lFunc.addInput({ name: lPortDef.name, dataType: lPortDef.dataType });
        }
        for (const lPortDef of pData.outputs) {
            lFunc.addOutput({ name: lPortDef.name, dataType: lPortDef.dataType });
        }

        // Create all nodes and build a nodeId → node lookup map.
        const lNodeMap: Map<string, PotatnoDocumentNode> = new Map();
        for (const lNodeData of pData.nodes) {
            const lNode: PotatnoDocumentNode = this.deserializeNode(lNodeData);
            lNodeMap.set(lNodeData.id, lNode);
            lFunc.addNode(lNode);
        }

        // Restore port connections from the flat connections list.
        for (const lConn of pData.connections) {
            const lSourceNode: PotatnoDocumentNode | undefined = lNodeMap.get(lConn.sourceNodeId);
            const lTargetNode: PotatnoDocumentNode | undefined = lNodeMap.get(lConn.targetNodeId);
            if (!lSourceNode || !lTargetNode) {
                continue;
            }

            const lSourcePort = lSourceNode.outputs.get(lConn.sourcePortName);
            const lTargetPort = lTargetNode.inputs.get(lConn.targetPortName);
            if (!lSourcePort || !lTargetPort) {
                continue;
            }

            lSourcePort.connect(lTargetPort);
        }

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

        const lNode: PotatnoDocumentNode = new PotatnoDocumentNode(lDefinition, { ...pData.transformation }, pData.isSystem);
        lNode.name = pData.name;

        return lNode;
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
