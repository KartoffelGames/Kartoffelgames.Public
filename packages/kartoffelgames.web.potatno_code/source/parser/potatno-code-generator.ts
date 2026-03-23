import type { PotatnoEditorConfiguration } from '../project/potatno-editor-configuration.ts';
import type { PotatnoNodeDefinition } from '../node/potatno-node-definition.ts';
import { NodeCategory } from '../node/node-category.enum.ts';
import { PortKind } from '../node/port-kind.enum.ts';
import type { PotatnoConnection } from '../document/potatno-connection.ts';
import type { PotatnoGraph } from '../document/potatno-graph.ts';
import type { PotatnoNode } from '../document/potatno-node.ts';
import type { PotatnoFunction } from '../project/potatno-function.ts';
import { PotatnoCodeFunction } from '../project/potatno-code-function.ts';
import { PotatnoCodeNode } from '../node/potatno-code-node.ts';
import { PotatnoCodeCommentNode } from '../node/potatno-code-comment-node.ts';
import { PotatnoCodeInputNode } from '../node/potatno-code-input-node.ts';
import { PotatnoCodeOutputNode } from '../node/potatno-code-output-node.ts';
import { PotatnoCodeTemplateNode } from '../node/potatno-code-template-node.ts';
import { PotatnoCodeValueNode } from '../node/potatno-code-value-node.ts';
import { PotatnoCodeFlowNode } from '../node/potatno-code-flow-node.ts';

/**
 * Walks the graph in topological order and generates code.
 */
export class PotatnoCodeGenerator {
    private readonly mConfig: PotatnoEditorConfiguration;

    /**
     * Constructor.
     *
     * @param pConfig - The editor configuration providing node definitions and code generation settings.
     */
    public constructor(pConfig: PotatnoEditorConfiguration) {
        this.mConfig = pConfig;
    }

    /**
     * Generate code for a single function including metadata comments.
     *
     * @param pFunction - The function to generate code for.
     *
     * @returns The generated code string wrapped with metadata markers.
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
     *
     * @param pFunctions - The map of functions to generate code for.
     *
     * @returns The combined code string for all functions.
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
     *
     * @param pGraph - The graph to generate code for.
     *
     * @returns The generated body code string.
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

            const lNodeCode: string = lCodeNode.generateCode();
            const lWrapped: string = this.wrapNodeWithMetadata(lNode, lNodeCode);
            lCodeParts.push(lWrapped);
        }

        return lCodeParts.join('\n');
    }

    /**
     * Generate code for a flow body chain starting from a flow port ID.
     *
     * @param pGraph - The graph containing the flow chain.
     * @param pFlowPortId - The flow port ID to start from.
     *
     * @returns The generated code for the flow chain.
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

            const lNodeCode: string = lCodeNode.generateCode();
            lCodeParts.push(this.wrapNodeWithMetadata(lOwnerNode, lNodeCode));

            // Follow the flow chain: look for a "next" flow output, or stop.
            lCurrentPortId = null;
        }

        return lCodeParts.join('\n');
    }

    /**
     * Build a PotatnoCodeNode from a graph node, selecting the appropriate
     * subclass based on the node's category.
     *
     * @param pGraph - The graph containing the node.
     * @param pNode - The graph node to build a code node from.
     *
     * @returns The constructed code node with populated ports and properties.
     */
    private buildCodeNode(_pGraph: PotatnoGraph, pNode: PotatnoNode): PotatnoCodeNode {
        const lDefinition: PotatnoNodeDefinition | undefined = this.mConfig.nodeDefinitions.get(pNode.definitionName);
        const lCodeNode: PotatnoCodeNode = this.createNodeForCategory(pNode.category, lDefinition?.codeTemplate ?? '');

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
     * Create the appropriate code node subclass based on the node category.
     *
     * @param pCategory - The node category.
     * @param pCodeTemplate - The code template string for template-based nodes.
     *
     * @returns The appropriate code node subclass instance.
     */
    private createNodeForCategory(pCategory: NodeCategory, pCodeTemplate: string): PotatnoCodeNode {
        switch (pCategory) {
            case NodeCategory.Comment:
                return new PotatnoCodeCommentNode();
            case NodeCategory.Input:
                return new PotatnoCodeInputNode();
            case NodeCategory.Output:
                return new PotatnoCodeOutputNode();
            case NodeCategory.Value:
                return new PotatnoCodeValueNode(pCodeTemplate);
            case NodeCategory.Flow:
                return new PotatnoCodeFlowNode(pCodeTemplate);
            default:
                return new PotatnoCodeTemplateNode(pCodeTemplate);
        }
    }

    /**
     * Topological sort of nodes based on data dependencies.
     *
     * @param pGraph - The graph whose nodes should be sorted.
     *
     * @returns The nodes in topological order.
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
     *
     * @param pGraph - The graph to search.
     * @param pName - The input node name.
     *
     * @returns The value ID of the input node's first output port, or the name itself as fallback.
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
     *
     * @param pGraph - The graph to search.
     * @param pName - The output node name.
     *
     * @returns The connected value ID, or the name itself as fallback.
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
     *
     * @param pGraph - The graph to search.
     * @param pPortId - The flow port ID to find.
     *
     * @returns The node that owns the port, or null if not found.
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
     *
     * @param pFunction - The function whose metadata should be included.
     * @param pCode - The generated code to wrap.
     *
     * @returns The code wrapped with metadata markers.
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
     *
     * @param pNode - The node whose metadata should be included.
     * @param pCode - The generated code to wrap.
     *
     * @returns The code wrapped with metadata markers.
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
