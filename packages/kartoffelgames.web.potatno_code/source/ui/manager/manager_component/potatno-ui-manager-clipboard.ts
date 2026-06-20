import type { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import type { PotatnoDocumentNode, PotatnoDocumentNodeTransformation } from '../../../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import type { PotatnoNodeDefinition } from '../../../project/node_definition/potatno-node-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import type { PotatnoUiManager } from '../potatno-ui-manager.ts';

/**
 * Ui manager clipboard component.
 * Owns copy and paste snapshots for graph nodes.
 */
export class PotatnoUiManagerClipboard {
    private static readonly PASTE_OFFSET: number = 2;

    private mClipboardNodes: Array<PotatnoUiManagerClipboardDataNode>;
    private readonly mManager: PotatnoUiManager;

    /**
     * Constructor.
     *
     * @param pManager - Parent ui manager.
     */
    public constructor(pManager: PotatnoUiManager) {
        this.mManager = pManager;
        this.mClipboardNodes = new Array<PotatnoUiManagerClipboardDataNode>();
    }

    /**
     * Copy the selected nodes and their internal connections.
     *
     * @param pSelectedNodes - The nodes to copy.
     */
    public copy(pSelectedNodes: ReadonlySet<PotatnoDocumentNode<PotatnoProjectTypesDefinition>>): void {
        // Skip copy operation when nothing was selected.
        if (pSelectedNodes.size === 0) {
            return;
        }

        // Convert selected nodes into a easily iteratable data type.
        const lSelectedNodex: Array<PotatnoDocumentNode<PotatnoProjectTypesDefinition>> = [...pSelectedNodes];

        // Create clipboard nodes with stable clipboard ids.
        const lCopiedNodes: Map<PotatnoDocumentNode<PotatnoProjectTypesDefinition>, PotatnoUiManagerClipboardDataNode> = new Map<PotatnoDocumentNode<PotatnoProjectTypesDefinition>, PotatnoUiManagerClipboardDataNode>();

        // Iterate selected nodes and use its index as id.
        for (let lNodeIndex: number = 0; lNodeIndex < lSelectedNodex.length; lNodeIndex++) {
            const lNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition> = lSelectedNodex[lNodeIndex];

            // Save all direct values of any input port.
            const lInputDirectValues: Array<PotatnoUiManagerClipboardDataPortData> = lNode.inputs.value.map((pPort) => {
                return { definitionId: pPort.definitionId, values: [...pPort.directValue] };
            });

            // Copy transformation and apply an offset to its position.
            const lNodeTransformation: PotatnoDocumentNodeTransformation = { ...lNode.transformation };
            lNodeTransformation.x += PotatnoUiManagerClipboard.PASTE_OFFSET;
            lNodeTransformation.y += PotatnoUiManagerClipboard.PASTE_OFFSET;

            lCopiedNodes.set(lNode, {
                connections: new Array<PotatnoUiManagerClipboardDataConnection>(),
                definitionId: lNode.definitionId,
                id: lNodeIndex,
                portDirectValues: lInputDirectValues,
                label: lNode.label,
                transformation: lNodeTransformation
            });
        }

        // Store internal outgoing connections on their source clipboard node.
        for (const [lSourceNode, lSourceClipboardNode] of lCopiedNodes) {
            // Only store output connections.
            for (const lOutputPort of lSourceNode.outputs.list) {
                // For each connection of the port.
                for (const lConnectedPort of lOutputPort.connectedPorts) {
                    // Connection can be outside the selected nodes, if so, skip it.
                    const lTargetNode: PotatnoUiManagerClipboardDataNode | undefined = lCopiedNodes.get(lConnectedPort.node);
                    if (!lTargetNode) {
                        continue;
                    }

                    lSourceClipboardNode.connections.push({
                        sourcePortName: lOutputPort.definitionId,
                        targetNodeId: lTargetNode.id,
                        targetPortName: lConnectedPort.definitionId
                    });
                }
            }
        }

        this.mClipboardNodes = [...lCopiedNodes.values()];
    }

    /**
     * Paste copied nodes into the active function, offset by the given delta.
     *
     * @returns Array of the newly created nodes, or an empty array if nothing was pasted.
     */
    public paste(): Array<PotatnoDocumentNode<PotatnoProjectTypesDefinition>> {
        // Skip pasting when no node is copied.
        if (this.mClipboardNodes.length === 0) {
            return new Array<PotatnoDocumentNode<PotatnoProjectTypesDefinition>>();
        }

        // Skip paste when no active function is selected.
        const lActiveFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> | null = this.mManager.activeFunction;
        if (!lActiveFunction) {
            return [];
        }

        // Create all nodes first so connections can resolve stable clipboard ids.
        const lCreatedNodes: Map<number, PotatnoDocumentNode<PotatnoProjectTypesDefinition>> = new Map<number, PotatnoDocumentNode<PotatnoProjectTypesDefinition>>();

        // First pass, creating the nodes.
        for (const lNodeData of this.mClipboardNodes) {
            // Find the node definition in the current function. Only use the dynamic definitions so no system nodes are pasted.
            // Node definitions can be deleted between copy and paste.
            const lDefinition: PotatnoNodeDefinition<PotatnoProjectTypesDefinition> | undefined = lActiveFunction.dynamicNodeDefinitions.find((pDefinition) => pDefinition.id === lNodeData.definitionId);
            if (!lDefinition) {
                continue;
            }

            // Create a new node in the current active function.
            const lNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition> = this.mManager.graph.addNode(lActiveFunction, lDefinition, lNodeData.transformation);
            this.mManager.graph.updateNode(lNode, (pNode) => {
                pNode.label = lNodeData.label;

                // Set direct values to each port.
                for (const lPortValue of lNodeData.portDirectValues) {
                    if (pNode.inputs.map.has(lPortValue.definitionId)) {
                        pNode.inputs.map.get(lPortValue.definitionId)!.setDirectValue(lPortValue.values);
                    }
                }
            });

            // Store the new node and dispatch a node change event.
            lCreatedNodes.set(lNodeData.id, lNode);
        }

        // Second pass, restore connections after node creation.
        for (const lNodeData of this.mClipboardNodes) {
            // Read the created node for the clipboard node. It can be undefined when the node definition was not found.
            const lSourceNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition> | undefined = lCreatedNodes.get(lNodeData.id);
            if (!lSourceNode) {
                continue;
            }

            // Create a new connection for each copied node connection.
            for (const lConnection of lNodeData.connections) {
                // Read target node. Can be undefined when the created node definition can not be found.
                const lTargetNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition> | undefined = lCreatedNodes.get(lConnection.targetNodeId);
                if (!lTargetNode) {
                    continue;
                }

                const lSourcePort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | undefined = lSourceNode.outputs.map.get(lConnection.sourcePortName);
                const lTargetPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | undefined = lTargetNode.inputs.map.get(lConnection.targetPortName);
                if (!lSourcePort || !lTargetPort) {
                    continue;
                }

                // Connect ports.
                this.mManager.graph.connectPorts(lSourcePort, lTargetPort);
            }
        }

        return [...lCreatedNodes.values()];
    }
}


type PotatnoUiManagerClipboardDataNode = {
    connections: Array<PotatnoUiManagerClipboardDataConnection>;
    definitionId: string;
    id: number;
    portDirectValues: Array<PotatnoUiManagerClipboardDataPortData>;
    label: string;
    transformation: PotatnoDocumentNodeTransformation;
};

type PotatnoUiManagerClipboardDataPortData = {
    definitionId: string;
    values: Array<string>;
};

type PotatnoUiManagerClipboardDataConnection = {
    sourcePortName: string;
    targetNodeId: number;
    targetPortName: string;
};
