import { PotatnoDocumentFunction } from '../document/potatno-document-function.ts';
import { PotatnoDocumentNode } from '../document/potatno-document-node.ts';
import { PotatnoDocument } from '../document/potatno-document.ts';
import type { PotatnoFunctionDefinition } from '../project/potatno-function-definition.ts';
import { PotatnoProjectType } from "../project/potatno-project-types-definition.ts";
import type { PotatnoProject } from '../project/potatno-project.ts';
import type { PotatnoCodeFileSerializationResult, SerializedFunction, SerializedNode } from './potatno-serialization.type.ts';

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
export class PotatnoDeserializer<TProject extends PotatnoProject<any>> {
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
        const lDefinition: PotatnoFunctionDefinition<TProject> = this.findFunctionDefinition(pData.definitionId);
        const lFunc: PotatnoDocumentFunction<TProject> = new PotatnoDocumentFunction(this.mProject, lDefinition, pData.id, pData.name, pData.isSystem);

        // Restore imports.
        for (const lImport of pData.imports) {
            lFunc.addImport(lImport);
        }

        // Restore function-signature I/O port definitions.
        for (const lPortDefinition of pData.inputs) {
            lFunc.addInput({ name: lPortDefinition.name, dataType: lPortDefinition.dataType });
        }
        for (const lPortDefinition of pData.outputs) {
            lFunc.addOutput({ name: lPortDefinition.name, dataType: lPortDefinition.dataType });
        }

        // Create all nodes and build a nodeId → node lookup map.
        const lNodeMap: Map<string, PotatnoDocumentNode<TProject>> = new Map();
        for (const lNodeData of pData.nodes) {
            const lNode: PotatnoDocumentNode<TProject> = this.deserializeNode(lNodeData, pDocument);
            lNodeMap.set(lNodeData.id, lNode);
            lFunc.addNode(lNode);
        }

        // Restore port connections from the flat connections list.
        for (const lConnection of pData.connections) {
            const lSourceNode: PotatnoDocumentNode<TProject> | undefined = lNodeMap.get(lConnection.sourceNodeId);
            const lTargetNode: PotatnoDocumentNode<TProject> | undefined = lNodeMap.get(lConnection.targetNodeId);
            if (!lSourceNode || !lTargetNode) {
                continue;
            }

            const lSourcePort = lSourceNode.outputs.get(lConnection.sourcePortName);
            const lTargetPort = lTargetNode.inputs.get(lConnection.targetPortName);
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
    private deserializeNode(pData: SerializedNode, pDocument: PotatnoDocument<TProject>): PotatnoDocumentNode<TProject> {
        // Check project node definitions first, then document function node definitions.
        const lDefinition = this.mProject.nodeDefinitions.get(pData.definitionId) ?? pDocument.functionNodeDefinitions.get(pData.definitionId);
        if (!lDefinition) {
            throw new Error(`Node definition not found: "${pData.definitionId}"`);
        }

        const lNode: PotatnoDocumentNode<TProject> = new PotatnoDocumentNode(this.mProject, lDefinition, { ...pData.transformation }, pData.isSystem);
        lNode.label = pData.label;

        // Restore direct values for value input ports.
        for (const lPortData of pData.ports) {
            if (lPortData.portType === 'value' && lPortData.directValue.length > 0) {
                const lPort = lNode.inputs.get(lPortData.name);
                if (lPort) {
                    lPort.setDirectValue(lPortData.directValue);
                }
            }
        }

        return lNode;
    }

    /**
     * Look up a function definition by id from the project.
     * Falls back to the entry point if the definition is not found.
     */
    private findFunctionDefinition(pDefinitionId: string): PotatnoFunctionDefinition<TProject> {
        if (this.mProject.entryPoint.id === pDefinitionId) {
            return this.mProject.entryPoint;
        }

        const lUserFunc: PotatnoFunctionDefinition<TProject> | undefined = this.mProject.userFunctions.get(pDefinitionId);
        if (lUserFunc) {
            return lUserFunc;
        }

        // Fallback to the entry point if the definition is not found.
        return this.mProject.entryPoint;
    }
}
