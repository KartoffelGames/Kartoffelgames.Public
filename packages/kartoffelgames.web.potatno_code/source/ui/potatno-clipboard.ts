import type { PotatnoDocumentFunction } from '../document/potatno-document-function.ts';
import type { PotatnoDocumentNode, PotatnoDocumentNodeTransformation } from '../document/potatno-document-node.ts';
import type { PotatnoDocument } from '../document/potatno-document.ts';
import { PotatnoProject } from "../project/potatno-project.ts";

/**
 * Copy/paste logic for graph nodes.
 * Stores a snapshot of selected nodes and their internal connections.
 */
export class PotatnoClipboard<TProject extends PotatnoProject> {
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
    public copy(pSelectedNodes: ReadonlySet<PotatnoDocumentNode<TProject>>): void {
        const lNodes: Array<PotatnoDocumentNode<TProject>> = [];
        const lNodeIndexMap: Map<PotatnoDocumentNode<TProject>, number> = new Map();

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
            for (const [lPortDefinitionId, lPort] of lNode.inputs.map) {
                if (lPort.portType === 'value' && lPort.directValue.length > 0) {
                    lInputDirectValues[lPortDefinitionId] = [...lPort.directValue];
                }
            }

            return {
                definitionId: lNode.definitionId,
                transformation: { ...lNode.transformation },
                label: lNode.label,
                inputDirectValues: lInputDirectValues
            };
        });

        // Collect connections where both endpoints are within the selected set.
        const lInternalConnections: ClipboardData['internalConnections'] = [];
        for (const lSourceNode of lNodes) {
            const lSourceIdx = lNodeIndexMap.get(lSourceNode)!;
            for (const [lPortDefinitionId, lOutputPort] of lSourceNode.outputs.map) {
                for (const lConnectedPort of lOutputPort.connectedPorts) {
                    const lTargetIdx = lNodeIndexMap.get(lConnectedPort.node);
                    if (lTargetIdx !== undefined) {
                        lInternalConnections.push({
                            sourceNodeIndex: lSourceIdx,
                            sourcePortName: lPortDefinitionId,
                            targetNodeIndex: lTargetIdx,
                            targetPortName: lConnectedPort.label
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
    public paste(pFunction: PotatnoDocumentFunction<TProject>, pDocument: PotatnoDocument<TProject>, pOffsetX: number, pOffsetY: number): Array<PotatnoDocumentNode<TProject>> {
        if (!this.mData) {
            return [];
        }

        const lCreated: Array<PotatnoDocumentNode<TProject>> = [];

        for (const lNodeData of this.mData.nodes) {
            const lDefinition = pFunction.project.nodeDefinitions.find((pDefinition) => pDefinition.id === lNodeData.definitionId)
                ?? pDocument.nodeDefinitions.find((pDefinition) => pDefinition.id === lNodeData.definitionId);
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
                const lPort = lNode.inputs.map.get(lPortName);
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

            const lSourcePort = lSourceNode.outputs.map.get(lConn.sourcePortName);
            const lTargetPort = lTargetNode.inputs.map.get(lConn.targetPortName);
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
