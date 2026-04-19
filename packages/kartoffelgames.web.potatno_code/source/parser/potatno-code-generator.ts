import type { PotatnoFunction } from '../document/potatno-function.ts';
import type { PotatnoGraph } from '../document/potatno-graph.ts';
import type { PotatnoNode } from '../document/potatno-node.ts';
import { NodeCategory } from '../node/node-category.enum.ts';
import { PortKind } from '../node/port-kind.enum.ts';
import { PotatnoCodeNode, type PotatnoCodeNodeContext } from '../node/potatno-code-node.ts';
import { PotatnoCodeSetLocalNode } from '../node/potatno-code-set-local-node.ts';
import { PotatnoCodeTemplateNode } from '../node/potatno-code-template-node.ts';
import type { PotatnoNodeDefinitionPort } from "../project/potatno-node-definition.ts";
import type { PotatnoProject } from '../project/potatno-project.ts';
import { PotatnoCodeFunction } from './potatno-code-function.ts';

/**
 * Walks the graph in topological order and generates clean code without metadata markers.
 */
export class PotatnoCodeGenerator {
    private readonly mConfig: PotatnoProject;

    /**
     * Constructor.
     *
     * @param pConfig - The project configuration providing node definitions and code generation settings.
     */
    public constructor(pConfig: PotatnoProject) {
        this.mConfig = pConfig;
    }

    /**
     * Generate clean code for a single function.
     *
     * @param pFunction - The function to generate code for.
     *
     * @returns The generated code string without any metadata markers.
     */
    public generateFunctionCode(pFunction: PotatnoFunction): string {
        const lGraph: PotatnoGraph = pFunction.graph;
        let lBodyCode: string = this.generateGraphCode(lGraph);

        // Prepend local variable declarations.
        const lVarDecls: Array<string> = [];
        for (const lVar of pFunction.localVariables) {
            lVarDecls.push(`    let ${lVar.name};`);
        }
        if (lVarDecls.length > 0) {
            lBodyCode = lVarDecls.join('\n') + '\n' + lBodyCode;
        }

        // Build PotatnoCodeFunction.
        const lCodeFunc: PotatnoCodeFunction = new PotatnoCodeFunction();
        lCodeFunc.name = pFunction.name;
        lCodeFunc.bodyCode = lBodyCode;
        for (const lImport of pFunction.imports) {
            lCodeFunc.imports.push(lImport);
        }

        for (const [lName, lPortDef] of Object.entries(pFunction.inputs)) {
            const lValueId: string = this.findInputNodeValueId(lGraph, lName);
            const lType: string = (lPortDef.nodeType === 'value' || lPortDef.nodeType === 'input') ? lPortDef.dataType : '';
            lCodeFunc.inputs.push({ name: lName, type: lType, valueId: lValueId });
        }

        for (const [lName, lPortDef] of Object.entries(pFunction.outputs)) {
            const lValueId: string = this.findOutputNodeValueId(lGraph, lName);
            const lType: string = (lPortDef.nodeType === 'value' || lPortDef.nodeType === 'input') ? lPortDef.dataType : '';
            lCodeFunc.outputs.push({ name: lName, type: lType, valueId: lValueId });
        }

        // Wrap in function code generator callback if set.
        if (this.mConfig.entryPoint.codeGenerator) {
            return this.mConfig.entryPoint.codeGenerator(lCodeFunc);
        }

        return lBodyCode;
    }

    /**
     * Generate clean code for a single function, along with intermediate code snapshots
     * for nodes that have previews. Each intermediate snapshot contains the full function
     * code up to and including that node, wrapped by the entry point's codeGenerator.
     *
     * @param pFunction - The function to generate code for.
     * @param pPreviewNodeIds - Set of node IDs that have previews and need intermediate code.
     *
     * @returns The full code, the code function metadata, and a map of node intermediates.
     */
    public generateFunctionCodeWithIntermediates(pFunction: PotatnoFunction, pPreviewNodeIds: Set<string>): FunctionCodeWithIntermediates {
        const lGraph: PotatnoGraph = pFunction.graph;
        const lNodes: Array<PotatnoNode> = this.topologicalSort(lGraph);
        const lCodeParts: Array<string> = new Array<string>();
        const lNodeIntermediates: Map<string, NodeIntermediateData> = new Map();

        // Build local variable declarations prefix.
        let lVarPrefix: string = '';
        const lVarDecls: Array<string> = [];
        for (const lVar of pFunction.localVariables) {
            lVarDecls.push(`    let ${lVar.name};`);
        }
        if (lVarDecls.length > 0) {
            lVarPrefix = lVarDecls.join('\n') + '\n';
        }

        // Pre-compute function inputs/outputs for PotatnoCodeFunction construction.
        const lFuncInputs: Array<{ name: string; type: string; valueId: string }> = [];
        for (const [lName, lPortDef] of Object.entries(pFunction.inputs)) {
            const lValueId: string = this.findInputNodeValueId(lGraph, lName);
            const lType: string = (lPortDef.nodeType === 'value' || lPortDef.nodeType === 'input') ? lPortDef.dataType : '';
            lFuncInputs.push({ name: lName, type: lType, valueId: lValueId });
        }

        const lFuncOutputs: Array<{ name: string; type: string; valueId: string }> = [];
        for (const [lName, lPortDef] of Object.entries(pFunction.outputs)) {
            const lValueId: string = this.findOutputNodeValueId(lGraph, lName);
            const lType: string = (lPortDef.nodeType === 'value' || lPortDef.nodeType === 'input') ? lPortDef.dataType : '';
            lFuncOutputs.push({ name: lName, type: lType, valueId: lValueId });
        }

        // Walk nodes in topological order, generating code and capturing intermediates.
        for (const lNode of lNodes) {
            if (lNode.category === NodeCategory.Input || lNode.category === NodeCategory.Output || lNode.category === NodeCategory.Reroute || lNode.category === NodeCategory.GetLocal) {
                continue;
            }

            const lDefinition = this.mConfig.nodeDefinitions.get(lNode.definitionId);
            if (!lDefinition) {
                continue;
            }

            const lCodeNode: PotatnoCodeNode = this.buildCodeNode(lGraph, lNode);

            for (const [lFlowName, lFlowPort] of lNode.flowOutputs) {
                if (lFlowPort.connectedTo) {
                    const lBodyCode: string = this.generateFlowBodyCode(lGraph, lFlowPort.connectedTo);
                    lCodeNode.body.set(lFlowName, { code: lBodyCode });
                } else {
                    lCodeNode.body.set(lFlowName, { code: '' });
                }
            }

            const lNodeCode: string = lCodeNode.generateCode();
            lCodeParts.push(lNodeCode);

            // Capture intermediate data for nodes that have previews.
            if (pPreviewNodeIds.has(lNode.id)) {
                const lIntermediateBody: string = lVarPrefix + lCodeParts.join('\n');

                // Build an intermediate PotatnoCodeFunction with body up to this node.
                const lIntermediateFunc: PotatnoCodeFunction = new PotatnoCodeFunction();
                lIntermediateFunc.name = pFunction.name;
                lIntermediateFunc.bodyCode = lIntermediateBody;
                for (const lImport of pFunction.imports) {
                    lIntermediateFunc.imports.push(lImport);
                }
                for (const lInput of lFuncInputs) {
                    lIntermediateFunc.inputs.push({ ...lInput });
                }
                for (const lOutput of lFuncOutputs) {
                    lIntermediateFunc.outputs.push({ ...lOutput });
                }

                // Wrap with entry point's codeGenerator.
                let lIntermediateCode: string;
                if (this.mConfig.entryPoint.codeGenerator) {
                    lIntermediateCode = this.mConfig.entryPoint.codeGenerator(lIntermediateFunc);
                } else {
                    lIntermediateCode = lIntermediateBody;
                }

                lNodeIntermediates.set(lNode.id, {
                    intermediateCode: lIntermediateCode,
                    context: lCodeNode.buildContext(),
                    codeFunction: lIntermediateFunc
                });
            }
        }

        // Build the full function.
        const lFullBody: string = lVarPrefix + lCodeParts.join('\n');
        const lCodeFunc: PotatnoCodeFunction = new PotatnoCodeFunction();
        lCodeFunc.name = pFunction.name;
        lCodeFunc.bodyCode = lFullBody;
        for (const lImport of pFunction.imports) {
            lCodeFunc.imports.push(lImport);
        }
        for (const lInput of lFuncInputs) {
            lCodeFunc.inputs.push({ ...lInput });
        }
        for (const lOutput of lFuncOutputs) {
            lCodeFunc.outputs.push({ ...lOutput });
        }

        let lFullCode: string;
        if (this.mConfig.entryPoint.codeGenerator) {
            lFullCode = this.mConfig.entryPoint.codeGenerator(lCodeFunc);
        } else {
            lFullCode = lFullBody;
        }

        return {
            fullCode: lFullCode,
            codeFunction: lCodeFunc,
            nodeIntermediates: lNodeIntermediates
        };
    }

    /**
     * Generate clean code for all functions in the project.
     *
     * @param pFunctions - The map of functions to generate code for.
     *
     * @returns The combined clean code string for all functions.
     */
    public generateProjectCode(pFunctions: ReadonlyMap<string, PotatnoFunction>): string {
        const lParts: Array<string> = new Array<string>();

        for (const lFunc of pFunctions.values()) {
            lParts.push(this.generateFunctionCode(lFunc));
        }

        return lParts.join('\n\n');
    }

    /**
     * Generate the clean body code for a graph via topological sort.
     *
     * @param pGraph - The graph to generate code for.
     *
     * @returns The generated body code string without metadata markers.
     */
    private generateGraphCode(pGraph: PotatnoGraph): string {
        const lNodes: Array<PotatnoNode> = this.topologicalSort(pGraph);
        const lCodeParts: Array<string> = new Array<string>();

        for (const lNode of lNodes) {
            // Skip nodes that produce no executable code — they are handled by the function wrapper, passthrough resolution, or are purely visual.
            if (lNode.category === NodeCategory.Input || lNode.category === NodeCategory.Output || lNode.category === NodeCategory.Reroute || lNode.category === NodeCategory.GetLocal || lNode.category === NodeCategory.Comment) {
                continue;
            }

            const lDefinition = this.mConfig.nodeDefinitions.get(lNode.definitionId);
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
            lCodeParts.push(lNodeCode);
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

            const lDefinition = this.mConfig.nodeDefinitions.get(lOwnerNode.definitionId);
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
            lCodeParts.push(lNodeCode);

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
    private buildCodeNode(pGraph: PotatnoGraph, pNode: PotatnoNode): PotatnoCodeNode {
        const lDefinition = this.mConfig.nodeDefinitions.get(pNode.definitionId);
        const lCodeGenerator = lDefinition?.codeGenerator ?? (() => '');
        const lCodeNode: PotatnoCodeNode = this.createNodeForCategory(pNode.category, lCodeGenerator);

        // Determine port nodeTypes from the definition's input/output records.
        const lInputDefs: Record<string, PotatnoNodeDefinitionPort> = lDefinition ? Object.fromEntries(Object.entries(lDefinition.inputs)) : {};
        const lOutputDefs: Record<string, PotatnoNodeDefinitionPort> = lDefinition ? Object.fromEntries(Object.entries(lDefinition.outputs)) : {};

        // Map data inputs with resolved value IDs and port types.
        for (const [lName, lPort] of pNode.inputs) {
            const lValueId: string = this.resolveRerouteChain(pGraph, lPort.connectedTo ?? lPort.valueId);
            const lNodeType = lInputDefs[lName]?.nodeType ?? 'value';
            lCodeNode.inputs.set(lName, { name: lName, type: lPort.type, valueId: lValueId, nodeType: lNodeType });
        }

        // Map flow inputs.
        for (const [lFlowName] of pNode.flowInputs) {
            lCodeNode.inputs.set(lFlowName, { name: lFlowName, type: '', valueId: '', nodeType: 'flow' });
        }

        // Map data outputs.
        for (const [lName, lPort] of pNode.outputs) {
            const lNodeType = lOutputDefs[lName]?.nodeType ?? 'value';
            lCodeNode.outputs.set(lName, { name: lName, type: lPort.type, valueId: lPort.valueId, nodeType: lNodeType });
        }

        // Map flow outputs.
        for (const [lFlowName] of pNode.flowOutputs) {
            lCodeNode.outputs.set(lFlowName, { name: lFlowName, type: '', valueId: '', nodeType: 'flow' });
        }

        // Copy properties.
        for (const [lKey, lValue] of pNode.properties) {
            lCodeNode.properties.set(lKey, lValue);
        }

        // For GetLocal nodes, override the output valueId to the variable name.
        if (pNode.category === NodeCategory.GetLocal) {
            const lVarName = pNode.properties.get('variableName') ?? '';
            const lFirst = lCodeNode.outputs.values().next().value;
            if (lFirst && lVarName) {
                lCodeNode.outputs.set(lFirst.name, { name: lFirst.name, type: lFirst.type, valueId: lVarName, nodeType: lFirst.nodeType });
            }
        }

        return lCodeNode;
    }

    /**
     * Create the appropriate code node subclass based on the node category.
     *
     * @param pCategory - The node category.
     * @param pCodeGenerator - The code generator callback for template-based nodes.
     *
     * @returns The appropriate code node subclass instance.
     */
    private createNodeForCategory(pCategory: string, pCodeGenerator: (pContext: PotatnoCodeNodeContext) => string): PotatnoCodeNode {
        switch (pCategory) {
            case NodeCategory.SetLocal:
                return new PotatnoCodeSetLocalNode();
            case NodeCategory.Comment:
            case NodeCategory.Input:
            case NodeCategory.Output:
            case NodeCategory.Reroute:
            case NodeCategory.GetLocal:
                return new PotatnoCodeNode();
            default:
                return new PotatnoCodeTemplateNode(pCodeGenerator);
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
            if (lNode.category === NodeCategory.Input && lNode.definitionId === pName) {
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
            if (lNode.category === NodeCategory.Output && lNode.definitionId === pName) {
                const lFirstInput = lNode.inputs.values().next().value;
                if (lFirstInput && lFirstInput.connectedTo) {
                    return this.resolveRerouteChain(pGraph, lFirstInput.connectedTo);
                }
                return lFirstInput?.valueId ?? pName;
            }
        }
        return pName;
    }

    /**
     * Resolve a valueId through any reroute node chain. If the valueId
     * belongs to a reroute node's output, follow its input's connectedTo
     * recursively until a non-reroute source is found.
     *
     * @param pGraph - The graph to search.
     * @param pValueId - The valueId to resolve.
     *
     * @returns The resolved valueId from the original non-reroute source.
     */
    private resolveRerouteChain(pGraph: PotatnoGraph, pValueId: string): string {
        // Find the node whose output owns this valueId.
        for (const lNode of pGraph.nodes.values()) {
            for (const lPort of lNode.outputs.values()) {
                if (lPort.valueId === pValueId && lNode.category === NodeCategory.Reroute) {
                    // This valueId belongs to a reroute node's output.
                    // Follow the reroute's input connectedTo upstream.
                    const lFirstInput = lNode.inputs.values().next().value;
                    if (lFirstInput && lFirstInput.connectedTo) {
                        return this.resolveRerouteChain(pGraph, lFirstInput.connectedTo);
                    }
                    // Reroute input is not connected — return the reroute's input valueId as fallback.
                    return lFirstInput?.valueId ?? pValueId;
                }
            }
        }

        // Not a reroute output — return as-is.
        return pValueId;
    }

    /**
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

}

/**
 * Result of generating function code with intermediate snapshots for node previews.
 */
export type FunctionCodeWithIntermediates = {
    /** The full wrapped function code. */
    fullCode: string;
    /** The PotatnoCodeFunction metadata for the full function. */
    codeFunction: PotatnoCodeFunction;
    /** Per-node intermediate data, keyed by node ID. */
    nodeIntermediates: Map<string, NodeIntermediateData>;
};

/**
 * Intermediate code data for a single node with a preview.
 */
export type NodeIntermediateData = {
    /** The full function code up to and including this node, wrapped by the entry point's codeGenerator. */
    intermediateCode: string;
    /** The node's code generation context (input/output valueIds). */
    context: PotatnoCodeNodeContext;
    /** The PotatnoCodeFunction with body code up to this node. */
    codeFunction: PotatnoCodeFunction;
};
