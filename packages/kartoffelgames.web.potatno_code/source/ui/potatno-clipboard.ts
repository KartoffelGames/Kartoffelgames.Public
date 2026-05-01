import type { PotatnoDocumentFunction } from '../document/potatno-document-function.ts';
import type { PotatnoDocumentNode, PotatnoDocumentNodeTransformation } from '../document/potatno-document-node.ts';
import type { PotatnoDocument } from '../document/potatno-document.ts';
import { PotatnoProjectType } from "../project/potatno-project-types-definition.ts";

/**
 * Copy/paste logic for graph nodes.
 * Stores a snapshot of selected nodes and their internal connections.
 */
export class PotatnoClipboard<TProjectType extends PotatnoProjectType> {
    private mData: ClipboardData | null;

    /**
     * Whether the clipboard currently contains data that can be pasted.
     */
    public get hasData(): boolean {
        return this.mData !== null;
    }

    /**
     * Constructor. Initializes an empty clipboard.
     */
    public constructor() {
        this.mData = null;
    }

    /**
     * Copy selected (non-system) nodes and their internal connections.
     *
     * @param pSelectedNodes - The nodes to copy.
     */
    public copy(pSelectedNodes: ReadonlySet<PotatnoDocumentNode<TProjectType>>): void {
        const lNodes: Array<PotatnoDocumentNode<TProjectType>> = [];
        const lNodeIndexMap: Map<PotatnoDocumentNode<TProjectType>, number> = new Map();

        for (const lNode of pSelectedNodes) {
            if (!lNode.isSystem) {
                lNodeIndexMap.set(lNode, lNodes.length);
                lNodes.push(lNode);
            }
        }

        if (lNodes.length === 0) {
            return;
        }

        // Serialize nodes.
        const lSerializedNodes: ClipboardData['nodes'] = lNodes.map((lNode) => {
            const lInputDirectValues: Record<string, Array<string>> = {};
            for (const [lPortName, lPort] of lNode.inputs) {
                if (lPort.portType === 'value' && lPort.directValue.length > 0) {
                    lInputDirectValues[lPortName] = [...lPort.directValue];
                }
            }

            return {
                definitionId: lNode.definition.id,
                transformation: { ...lNode.transformation },
                label: lNode.label,
                inputDirectValues: lInputDirectValues
            };
        });

        // Collect connections where both endpoints are within the selected set.
        const lInternalConnections: ClipboardData['internalConnections'] = [];
        for (const lSourceNode of lNodes) {
            const lSourceIdx = lNodeIndexMap.get(lSourceNode)!;
            for (const [lPortName, lOutputPort] of lSourceNode.outputs) {
                for (const lConnectedPort of lOutputPort.connectedPorts) {
                    const lTargetIdx = lNodeIndexMap.get(lConnectedPort.node);
                    if (lTargetIdx !== undefined) {
                        lInternalConnections.push({
                            sourceNodeIndex: lSourceIdx,
                            sourcePortName: lPortName,
                            targetNodeIndex: lTargetIdx,
                            targetPortName: lConnectedPort.name
                        });
                    }
                }
            }
        }

        this.mData = { nodes: lSerializedNodes, internalConnections: lInternalConnections };
    }

    /**
     * Paste copied nodes into a function, offset by the given delta.
     * Returns the newly created nodes.
     *
     * @param pFunction - The function to paste into.
     * @param pDocument - The document, used to resolve user-function node definitions.
     * @param pOffsetX - Horizontal offset applied to each pasted node's position.
     * @param pOffsetY - Vertical offset applied to each pasted node's position.
     *
     * @returns Array of the newly created nodes, or an empty array if nothing was pasted.
     */
    public paste(pFunction: PotatnoDocumentFunction<TProjectType>, pDocument: PotatnoDocument<TProjectType>, pOffsetX: number, pOffsetY: number): Array<PotatnoDocumentNode<TProjectType>> {
        if (!this.mData) {
            return [];
        }

        const lCreated: Array<PotatnoDocumentNode<TProjectType>> = [];

        for (const lNodeData of this.mData.nodes) {
            const lDefinition = pFunction.project.nodeDefinitions.get(lNodeData.definitionId)
                ?? pDocument.functionNodeDefinitions.get(lNodeData.definitionId);
            if (!lDefinition) {
                continue;
            }

            const lTransformation: PotatnoDocumentNodeTransformation = {
                x: lNodeData.transformation.x + pOffsetX,
                y: lNodeData.transformation.y + pOffsetY,
                width: lNodeData.transformation.width,
                height: lNodeData.transformation.height
            };

            const lNode = pFunction.newNode(lDefinition, lTransformation, false);
            lNode.label = lNodeData.label;

            for (const [lPortName, lValues] of Object.entries(lNodeData.inputDirectValues)) {
                const lPort = lNode.inputs.get(lPortName);
                if (lPort) {
                    lPort.setDirectValue(lValues);
                }
            }

            lCreated.push(lNode);
        }

        // Restore internal connections.
        for (const lConn of this.mData.internalConnections) {
            const lSourceNode = lCreated[lConn.sourceNodeIndex];
            const lTargetNode = lCreated[lConn.targetNodeIndex];
            if (!lSourceNode || !lTargetNode) {
                continue;
            }

            const lSourcePort = lSourceNode.outputs.get(lConn.sourcePortName);
            const lTargetPort = lTargetNode.inputs.get(lConn.targetPortName);
            if (lSourcePort && lTargetPort) {
                lSourcePort.connect(lTargetPort);
            }
        }

        return lCreated;
    }
}

type ClipboardData = {
    nodes: Array<{
        definitionId: string;
        transformation: { x: number; y: number; width: number; height: number; };
        label: string;
        inputDirectValues: Record<string, Array<string>>;
    }>;
    internalConnections: Array<{
        sourceNodeIndex: number;
        sourcePortName: string;
        targetNodeIndex: number;
        targetPortName: string;
    }>;
};
