import type { PotatnoGraph } from '../document/potatno-graph.ts';
import type { PotatnoNode } from '../document/potatno-node.ts';
import { PortKind } from '../node/port-kind.enum.ts';
import type { PotatnoNodeDefinition } from './potatno-node-definition.ts';
import type { PotatnoProject } from './potatno-project.ts';

/**
 * Result of evaluating preview data for a single node.
 */
export type NodePreviewData = {
    readonly inputs: Record<string, unknown>;
    readonly outputs: Record<string, unknown>;
};

/**
 * Evaluates preview data for all nodes in a graph by walking the graph in topological order.
 * Each node's `updatePreviewData` callback is called with input data gathered from connected upstream nodes.
 */
export class PotatnoPreviewEvaluator {
    /**
     * Evaluate preview data for all nodes in the given graph.
     *
     * @param pProject - The project configuration containing node definitions.
     * @param pGraph - The graph to evaluate.
     * @param pEntryData - Initial data for static entry nodes, keyed by node definition id. Each value is a record mapping output port names to their values.
     *
     * @returns A map from node id to its computed input and output preview data.
     */
    public static evaluate(pProject: PotatnoProject, pGraph: PotatnoGraph, pEntryData: Record<string, Record<string, unknown>>): Map<string, NodePreviewData> {
        const lResult: Map<string, NodePreviewData> = new Map();

        // Build lookup: portId -> { nodeId, portName, direction }
        const lPortIdToInfo: Map<string, { nodeId: string; portName: string; }> = new Map();
        for (const lNode of pGraph.nodes.values()) {
            for (const [lName, lPort] of lNode.outputs) {
                lPortIdToInfo.set(lPort.id, { nodeId: lNode.id, portName: lName });
            }
            for (const [lName, lPort] of lNode.inputs) {
                lPortIdToInfo.set(lPort.id, { nodeId: lNode.id, portName: lName });
            }
            for (const [lName, lPort] of lNode.flowOutputs) {
                lPortIdToInfo.set(lPort.id, { nodeId: lNode.id, portName: lName });
            }
            for (const [lName, lPort] of lNode.flowInputs) {
                lPortIdToInfo.set(lPort.id, { nodeId: lNode.id, portName: lName });
            }
        }

        // Build data connection index: targetNodeId -> Array<{ sourceNodeId, sourcePortName, targetPortName }>
        const lDataConnectionsByTarget: Map<string, Array<{ sourceNodeId: string; sourcePortName: string; targetPortName: string; }>> = new Map();
        // Build in-degree for data connections only (for topological sort).
        const lInDegree: Map<string, number> = new Map();

        for (const lNode of pGraph.nodes.values()) {
            lInDegree.set(lNode.id, 0);
        }

        for (const lConnection of pGraph.connections.values()) {
            if (lConnection.kind !== PortKind.Data) {
                continue;
            }

            const lSourceInfo = lPortIdToInfo.get(lConnection.sourcePortId);
            const lTargetInfo = lPortIdToInfo.get(lConnection.targetPortId);
            if (!lSourceInfo || !lTargetInfo) {
                continue;
            }

            // Add to target's incoming connections.
            let lTargetConns = lDataConnectionsByTarget.get(lConnection.targetNodeId);
            if (!lTargetConns) {
                lTargetConns = [];
                lDataConnectionsByTarget.set(lConnection.targetNodeId, lTargetConns);
            }
            lTargetConns.push({
                sourceNodeId: lSourceInfo.nodeId,
                sourcePortName: lSourceInfo.portName,
                targetPortName: lTargetInfo.portName
            });

            // Increment in-degree.
            lInDegree.set(lConnection.targetNodeId, (lInDegree.get(lConnection.targetNodeId) ?? 0) + 1);
        }

        // Topological sort using Kahn's algorithm.
        const lQueue: Array<string> = [];
        for (const [lNodeId, lDegree] of lInDegree) {
            if (lDegree === 0) {
                lQueue.push(lNodeId);
            }
        }

        const lSortedOrder: Array<string> = [];
        while (lQueue.length > 0) {
            const lNodeId: string = lQueue.shift()!;
            lSortedOrder.push(lNodeId);

            // Find all outgoing data connections from this node.
            for (const lConnection of pGraph.connections.values()) {
                if (lConnection.kind !== PortKind.Data || lConnection.sourceNodeId !== lNodeId) {
                    continue;
                }

                const lTargetDegree: number = (lInDegree.get(lConnection.targetNodeId) ?? 0) - 1;
                lInDegree.set(lConnection.targetNodeId, lTargetDegree);
                if (lTargetDegree === 0) {
                    lQueue.push(lConnection.targetNodeId);
                }
            }
        }

        // Walk nodes in topological order and evaluate preview data.
        for (const lNodeId of lSortedOrder) {
            const lNode: PotatnoNode | undefined = pGraph.getNode(lNodeId);
            if (!lNode) {
                continue;
            }

            const lDefinition: PotatnoNodeDefinition | undefined = pProject.nodeDefinitions.get(lNode.definitionId);

            // Build input data for this node.
            const lInputData: Record<string, unknown> = {};

            // Gather data from connected upstream nodes.
            const lIncoming = lDataConnectionsByTarget.get(lNodeId);
            if (lIncoming) {
                for (const lConn of lIncoming) {
                    const lSourceData = lResult.get(lConn.sourceNodeId);
                    if (lSourceData) {
                        lInputData[lConn.targetPortName] = lSourceData.outputs[lConn.sourcePortName];
                    }
                }
            }

            // For unconnected data input ports, use default values or node property values.
            for (const [lName, lPort] of lNode.inputs) {
                if (lInputData[lName] === undefined) {
                    // Check if this is an input-type port with a user-entered value.
                    const lPropertyValue: string | undefined = lNode.properties.get('value');
                    const lDefPort = lDefinition ? (lDefinition.outputs as Record<string, any>)[lName] ?? (lDefinition.inputs as Record<string, any>)[lName] : undefined;

                    if (lDefPort?.nodeType === 'input' && lPropertyValue !== undefined) {
                        lInputData[lName] = PotatnoPreviewEvaluator.parsePropertyValue(lPropertyValue, lDefPort.inputType);
                    } else {
                        // Use type default: 0 for number, '' for string, false for boolean.
                        lInputData[lName] = PotatnoPreviewEvaluator.getTypeDefault(lPort.type);
                    }
                }
            }

            // For flow input ports, default to true (active).
            for (const [lName] of lNode.flowInputs) {
                if (lInputData[lName] === undefined) {
                    lInputData[lName] = true;
                }
            }

            // Check if this is a static entry node with entry data provided.
            const lEntryDataForNode = pEntryData[lNode.definitionId];

            let lOutputData: Record<string, unknown>;

            if (lEntryDataForNode && Object.keys(lInputData).length === 0) {
                // Static entry source node: use entry data as output values directly.
                lOutputData = { ...lEntryDataForNode };
            } else {
                // No preview data function defined: produce default outputs.
                lOutputData = PotatnoPreviewEvaluator.buildDefaultOutputs(lNode);
            }

            lResult.set(lNodeId, { inputs: lInputData, outputs: lOutputData });
        }

        return lResult;
    }

    /**
     * Parse a string property value to the correct type.
     */
    private static parsePropertyValue(pValue: string, pInputType: string): unknown {
        switch (pInputType) {
            case 'number':
                return parseFloat(pValue) || 0;
            case 'boolean':
                return pValue === 'true';
            case 'string':
            default:
                return pValue;
        }
    }

    /**
     * Get the default value for a given type string.
     */
    private static getTypeDefault(pType: string): unknown {
        switch (pType) {
            case 'number':
                return 0;
            case 'boolean':
                return false;
            case 'string':
            default:
                return '';
        }
    }

    /**
     * Build default output values for a node (zeros/empty/false based on port types).
     */
    private static buildDefaultOutputs(pNode: PotatnoNode): Record<string, unknown> {
        const lOutputs: Record<string, unknown> = {};
        for (const [lName, lPort] of pNode.outputs) {
            lOutputs[lName] = PotatnoPreviewEvaluator.getTypeDefault(lPort.type);
        }
        for (const [lName] of pNode.flowOutputs) {
            lOutputs[lName] = true;
        }
        return lOutputs;
    }
}
