import type { PotatnoEditorConfiguration } from '../configuration/potatno-editor-configuration.ts';
import type { PotatnoNodeDefinition } from '../configuration/potatno-node-definition.ts';
import { NodeCategory } from '../enum/node-category.enum.ts';
import { PortKind } from '../enum/port-kind.enum.ts';
import type { PotatnoConnection } from '../graph/potatno-connection.ts';
import type { PotatnoGraph } from '../graph/potatno-graph.ts';
import type { PotatnoNode } from '../graph/potatno-node.ts';
import type { PotatnoFunction } from '../function/potatno-function.ts';
import { PotatnoCodeFunction } from './potatno-code-function.ts';
import { PotatnoCodeNode } from './potatno-code-node.ts';

/**
 * Walks the graph in topological order and generates code.
 */
export class PotatnoCodeGenerator {
    private readonly mConfig: PotatnoEditorConfiguration;

    public constructor(pConfig: PotatnoEditorConfiguration) {
        this.mConfig = pConfig;
    }

    /**
     * Generate code for a single function including metadata comments.
     */
    public generateFunctionCode(pFunction: PotatnoFunction): string {
        const lGraph: PotatnoGraph = pFunction.graph;
        const lBodyCode: string = this.generateGraphCode(lGraph);

        // Build PotatnoCodeFunction.
        const lCodeFunc: PotatnoCodeFunction = new PotatnoCodeFunction();
        lCodeFunc.name = pFunction.name;
        lCodeFunc.bodyCode = lBodyCode;

        for (const lInput of pFunction.inputs) {
            const lValueId: string = this.findInputNodeValueId(lGraph, lInput.name);
            lCodeFunc.inputs.push({ name: lInput.name, type: lInput.type, valueId: lValueId });
        }

        for (const lOutput of pFunction.outputs) {
            const lValueId: string = this.findOutputNodeValueId(lGraph, lOutput.name);
            lCodeFunc.outputs.push({ name: lOutput.name, type: lOutput.type, valueId: lValueId });
        }

        // Wrap in function code generator.
        if (this.mConfig.functionCodeGenerator) {
            const lFunctionCode: string = this.mConfig.functionCodeGenerator(lCodeFunc);
            return this.wrapWithMetadata(pFunction, lFunctionCode);
        }

        return this.wrapWithMetadata(pFunction, lBodyCode);
    }

    /**
     * Generate code for all functions in the project.
     */
    public generateProjectCode(pFunctions: ReadonlyMap<string, PotatnoFunction>): string {
        const lParts: Array<string> = new Array<string>();

        for (const lFunc of pFunctions.values()) {
            lParts.push(this.generateFunctionCode(lFunc));
        }

        return lParts.join('\n\n');
    }

    /**
     * Generate the body code for a graph via topological sort.
     */
    private generateGraphCode(pGraph: PotatnoGraph): string {
        const lNodes: Array<PotatnoNode> = this.topologicalSort(pGraph);
        const lCodeParts: Array<string> = new Array<string>();

        for (const lNode of lNodes) {
            // Skip input/output nodes — they are handled by the function wrapper.
            if (lNode.category === NodeCategory.Input || lNode.category === NodeCategory.Output) {
                continue;
            }

            const lDefinition: PotatnoNodeDefinition | undefined = this.mConfig.nodeDefinitions.get(lNode.definitionName);
            if (!lDefinition) {
                continue;
            }

            const lCodeNode: PotatnoCodeNode = this.buildCodeNode(pGraph, lNode);

            // For flow nodes, generate body code for each flow output.
            for (const [lFlowName, lFlowPort] of lNode.flowOutputs) {
                if (lFlowPort.connectedTo) {
                    const lBodyCode: string = this.generateFlowBodyCode(pGraph, lFlowPort.connectedTo);
                    lCodeNode.body.set(lFlowName, { code: lBodyCode });
                } else {
                    lCodeNode.body.set(lFlowName, { code: '' });
                }
            }

            const lNodeCode: string = lDefinition.codeGenerator(lCodeNode);
            const lWrapped: string = this.wrapNodeWithMetadata(lNode, lNodeCode);
            lCodeParts.push(lWrapped);
        }

        return lCodeParts.join('\n');
    }

    /**
     * Generate code for a flow body chain starting from a flow port ID.
     */
    private generateFlowBodyCode(pGraph: PotatnoGraph, pFlowPortId: string): string {
        const lCodeParts: Array<string> = new Array<string>();

        // Find the node that owns this flow input port.
        let lCurrentPortId: string | null = pFlowPortId;

        while (lCurrentPortId) {
            const lOwnerNode: PotatnoNode | null = this.findNodeByFlowPortId(pGraph, lCurrentPortId);
            if (!lOwnerNode) {
                break;
            }

            const lDefinition: PotatnoNodeDefinition | undefined = this.mConfig.nodeDefinitions.get(lOwnerNode.definitionName);
            if (!lDefinition) {
                break;
            }

            const lCodeNode: PotatnoCodeNode = this.buildCodeNode(pGraph, lOwnerNode);

            // Recursive: generate body code for flow outputs.
            for (const [lFlowName, lFlowPort] of lOwnerNode.flowOutputs) {
                if (lFlowPort.connectedTo) {
                    const lBodyCode: string = this.generateFlowBodyCode(pGraph, lFlowPort.connectedTo);
                    lCodeNode.body.set(lFlowName, { code: lBodyCode });
                } else {
                    lCodeNode.body.set(lFlowName, { code: '' });
                }
            }

            const lNodeCode: string = lDefinition.codeGenerator(lCodeNode);
            lCodeParts.push(this.wrapNodeWithMetadata(lOwnerNode, lNodeCode));

            // Follow the flow chain: look for a "next" flow output, or stop.
            lCurrentPortId = null;
        }

        return lCodeParts.join('\n');
    }

    /**
     * Build a PotatnoCodeNode from a graph node.
     */
    private buildCodeNode(pGraph: PotatnoGraph, pNode: PotatnoNode): PotatnoCodeNode {
        const lCodeNode: PotatnoCodeNode = new PotatnoCodeNode();

        // Map inputs with resolved value IDs.
        for (const [lName, lPort] of pNode.inputs) {
            const lValueId: string = lPort.connectedTo ?? lPort.valueId;
            lCodeNode.inputs.set(lName, { name: lName, type: lPort.type, valueId: lValueId });
        }

        // Map outputs.
        for (const [lName, lPort] of pNode.outputs) {
            lCodeNode.outputs.set(lName, { name: lName, type: lPort.type, valueId: lPort.valueId });
        }

        // Copy properties.
        for (const [lKey, lValue] of pNode.properties) {
            lCodeNode.properties.set(lKey, lValue);
        }

        return lCodeNode;
    }

    /**
     * Topological sort of nodes based on data dependencies.
     */
    private topologicalSort(pGraph: PotatnoGraph): Array<PotatnoNode> {
        const lVisited: Set<string> = new Set<string>();
        const lResult: Array<PotatnoNode> = new Array<PotatnoNode>();

        // Build adjacency: for each node, which nodes must come before it.
        const lDependencies: Map<string, Set<string>> = new Map<string, Set<string>>();
        for (const lNode of pGraph.nodes.values()) {
            lDependencies.set(lNode.id, new Set<string>());
        }

        for (const lConnection of pGraph.connections.values()) {
            if (lConnection.kind === PortKind.Data) {
                const lDeps: Set<string> | undefined = lDependencies.get(lConnection.targetNodeId);
                if (lDeps) {
                    lDeps.add(lConnection.sourceNodeId);
                }
            }
        }

        const lVisit = (pNodeId: string): void => {
            if (lVisited.has(pNodeId)) {
                return;
            }
            lVisited.add(pNodeId);

            const lDeps: Set<string> | undefined = lDependencies.get(pNodeId);
            if (lDeps) {
                for (const lDepId of lDeps) {
                    lVisit(lDepId);
                }
            }

            const lNode: PotatnoNode | undefined = pGraph.getNode(pNodeId);
            if (lNode) {
                lResult.push(lNode);
            }
        };

        for (const lNodeId of pGraph.nodes.keys()) {
            lVisit(lNodeId);
        }

        return lResult;
    }

    /**
     * Find the value ID of an input node by its name.
     */
    private findInputNodeValueId(pGraph: PotatnoGraph, pName: string): string {
        for (const lNode of pGraph.nodes.values()) {
            if (lNode.category === NodeCategory.Input && lNode.definitionName === pName) {
                const lFirstOutput = lNode.outputs.values().next().value;
                if (lFirstOutput) {
                    return lFirstOutput.valueId;
                }
            }
        }
        return pName;
    }

    /**
     * Find the value ID of an output node's connected input.
     */
    private findOutputNodeValueId(pGraph: PotatnoGraph, pName: string): string {
        for (const lNode of pGraph.nodes.values()) {
            if (lNode.category === NodeCategory.Output && lNode.definitionName === pName) {
                const lFirstInput = lNode.inputs.values().next().value;
                if (lFirstInput && lFirstInput.connectedTo) {
                    return lFirstInput.connectedTo;
                }
                return lFirstInput?.valueId ?? pName;
            }
        }
        return pName;
    }

    /**
     * Find a node that owns a flow port by the port's ID.
     */
    private findNodeByFlowPortId(pGraph: PotatnoGraph, pPortId: string): PotatnoNode | null {
        for (const lNode of pGraph.nodes.values()) {
            for (const lPort of lNode.flowInputs.values()) {
                if (lPort.id === pPortId) {
                    return lNode;
                }
            }
            for (const lPort of lNode.flowOutputs.values()) {
                if (lPort.id === pPortId) {
                    return lNode;
                }
            }
        }
        return null;
    }

    /**
     * Wrap a function's generated code with __POTATNO_START and __POTATNO_END metadata comments.
     */
    private wrapWithMetadata(pFunction: PotatnoFunction, pCode: string): string {
        const lToken: string = this.mConfig.commentToken;
        const lMeta = {
            type: 'function',
            label: pFunction.label,
            name: pFunction.name,
            system: pFunction.system,
            inputs: [...pFunction.inputs],
            outputs: [...pFunction.outputs],
            imports: [...pFunction.imports]
        };

        const lStart: string = `${lToken} __POTATNO_START: ${pFunction.id} ${JSON.stringify(lMeta)}`;
        const lEnd: string = `${lToken} __POTATNO_END: ${pFunction.id}`;

        return `${lStart}\n${pCode}\n${lEnd}`;
    }

    /**
     * Wrap a node's generated code with metadata comments.
     */
    private wrapNodeWithMetadata(pNode: PotatnoNode, pCode: string): string {
        const lToken: string = this.mConfig.commentToken;

        // Serialize port data for reconstruction.
        const lInputs: Array<object> = new Array<object>();
        for (const [lName, lPort] of pNode.inputs) {
            lInputs.push({ name: lName, type: lPort.type, id: lPort.id, valueId: lPort.valueId, connectedTo: lPort.connectedTo });
        }

        const lOutputs: Array<object> = new Array<object>();
        for (const [lName, lPort] of pNode.outputs) {
            lOutputs.push({ name: lName, type: lPort.type, id: lPort.id, valueId: lPort.valueId });
        }

        const lFlowInputs: Array<object> = new Array<object>();
        for (const [lName, lPort] of pNode.flowInputs) {
            lFlowInputs.push({ name: lName, id: lPort.id, connectedTo: lPort.connectedTo });
        }

        const lFlowOutputs: Array<object> = new Array<object>();
        for (const [lName, lPort] of pNode.flowOutputs) {
            lFlowOutputs.push({ name: lName, id: lPort.id, connectedTo: lPort.connectedTo });
        }

        const lProperties: Record<string, string> = {};
        for (const [lKey, lValue] of pNode.properties) {
            lProperties[lKey] = lValue;
        }

        const lMeta = {
            type: pNode.definitionName,
            category: pNode.category,
            position: pNode.position,
            size: pNode.size,
            system: pNode.system,
            inputs: lInputs,
            outputs: lOutputs,
            flowInputs: lFlowInputs,
            flowOutputs: lFlowOutputs,
            properties: lProperties
        };

        const lStart: string = `${lToken} __POTATNO_START: ${pNode.id} ${JSON.stringify(lMeta)}`;
        const lEnd: string = `${lToken} __POTATNO_END: ${pNode.id}`;

        return `${lStart}\n${pCode}\n${lEnd}`;
    }
}
