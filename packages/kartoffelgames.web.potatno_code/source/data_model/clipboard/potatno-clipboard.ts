import type { PotatnoConnection } from '../graph/potatno-connection.ts';
import type { PotatnoGraph } from '../graph/potatno-graph.ts';
import type { PotatnoNode } from '../graph/potatno-node.ts';

/**
 * Clipboard data structure for copied nodes.
 */
interface ClipboardData {
    nodes: Array<{
        definitionName: string;
        position: { x: number; y: number };
        size: { w: number; h: number };
        properties: Record<string, string>;
        inputConnections: Array<{ portName: string; connectedValueId: string }>;
    }>;
    internalConnections: Array<{
        sourceNodeIndex: number;
        sourcePortName: string;
        targetNodeIndex: number;
        targetPortName: string;
    }>;
}

/**
 * Copy/paste logic for graph nodes.
 */
export class PotatnoClipboard {
    private mData: ClipboardData | null;

    public get hasData(): boolean {
        return this.mData !== null;
    }

    public constructor() {
        this.mData = null;
    }

    /**
     * Copy selected nodes and their internal connections.
     */
    public copy(pGraph: PotatnoGraph, pSelectedNodeIds: ReadonlySet<string>): void {
        const lSelectedNodes: Array<PotatnoNode> = new Array<PotatnoNode>();
        const lNodeIndexMap: Map<string, number> = new Map<string, number>();

        for (const lNodeId of pSelectedNodeIds) {
            const lNode: PotatnoNode | undefined = pGraph.getNode(lNodeId);
            if (lNode && !lNode.system) {
                lNodeIndexMap.set(lNode.id, lSelectedNodes.length);
                lSelectedNodes.push(lNode);
            }
        }

        if (lSelectedNodes.length === 0) {
            return;
        }

        // Serialize nodes.
        const lNodes = lSelectedNodes.map((lNode) => {
            const lProperties: Record<string, string> = {};
            for (const [lK, lV] of lNode.properties) {
                lProperties[lK] = lV;
            }

            const lInputConnections: Array<{ portName: string; connectedValueId: string }> = new Array();
            for (const [lName, lPort] of lNode.inputs) {
                if (lPort.connectedTo) {
                    lInputConnections.push({ portName: lName, connectedValueId: lPort.connectedTo });
                }
            }

            return {
                definitionName: lNode.definitionName,
                position: { ...lNode.position },
                size: { ...lNode.size },
                properties: lProperties,
                inputConnections: lInputConnections
            };
        });

        // Find internal data connections (both ends in selection).
        const lInternalConnections: Array<{ sourceNodeIndex: number; sourcePortName: string; targetNodeIndex: number; targetPortName: string }> = new Array();

        for (const lConnection of pGraph.connections.values()) {
            const lSourceIdx: number | undefined = lNodeIndexMap.get(lConnection.sourceNodeId);
            const lTargetIdx: number | undefined = lNodeIndexMap.get(lConnection.targetNodeId);

            if (lSourceIdx !== undefined && lTargetIdx !== undefined) {
                // Find port names by ID.
                const lSourceNode: PotatnoNode = lSelectedNodes[lSourceIdx];
                const lTargetNode: PotatnoNode = lSelectedNodes[lTargetIdx];

                let lSourcePortName: string = '';
                for (const [lName, lPort] of lSourceNode.outputs) {
                    if (lPort.id === lConnection.sourcePortId) {
                        lSourcePortName = lName;
                        break;
                    }
                }

                let lTargetPortName: string = '';
                for (const [lName, lPort] of lTargetNode.inputs) {
                    if (lPort.id === lConnection.targetPortId) {
                        lTargetPortName = lName;
                        break;
                    }
                }

                if (lSourcePortName && lTargetPortName) {
                    lInternalConnections.push({
                        sourceNodeIndex: lSourceIdx,
                        sourcePortName: lSourcePortName,
                        targetNodeIndex: lTargetIdx,
                        targetPortName: lTargetPortName
                    });
                }
            }
        }

        this.mData = { nodes: lNodes, internalConnections: lInternalConnections };
    }

    /**
     * Get the clipboard data for pasting. Returns null if empty.
     */
    public getData(): ClipboardData | null {
        return this.mData;
    }
}
