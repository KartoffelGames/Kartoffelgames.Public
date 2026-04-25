import type { PotatnoDocumentFunction } from '../document/potatno-document-function.ts';
import type { PotatnoDocumentNode } from '../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../document/potatno-document-port.ts';
import { NodeCategory } from './node/node-category.enum.ts';
import { PotatnoCodeNode, type PotatnoCodeNodeContext } from './node/potatno-code-node.ts';
import { PotatnoCodeTemplateNode } from './node/potatno-code-template-node.ts';
import type { PotatnoFunctionDefinition } from '../project/potatno-function-definition.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';
import { PotatnoCodeFunction } from './potatno-code-function.ts';

/**
 * Walks the graph in topological order and generates code without metadata markers.
 *
 * Value identifiers (valueIds) are assigned freshly each generation pass using a
 * Map<PotatnoDocumentPort, string> — they are not stored on the port objects.
 */
export class PotatnoCodeGenerator {
    private readonly mConfig: PotatnoProject<any>;

    /**
     * Constructor.
     *
     * @param pConfig - The project configuration providing node definitions and code generation settings.
     */
    public constructor(pConfig: PotatnoProject<any>) {
        this.mConfig = pConfig;
    }

    /**
     * Generate code for a single function.
     *
     * @param pFunction - The function to generate code for.
     *
     * @returns The generated code string.
     */
    public generateFunctionCode(pFunction: PotatnoDocumentFunction): string {
        const lFuncDef: PotatnoFunctionDefinition = pFunction.definition;
        const lNodes: ReadonlySet<PotatnoDocumentNode> = pFunction.nodes;
        const lValueIdMap: Map<PotatnoDocumentPort, string> = this.buildValueIdMap(lNodes);
        const lBodyCode: string = this.generateGraphCode(lNodes, lValueIdMap);
        const lCodeFunc: PotatnoCodeFunction = this.buildCodeFunction(pFunction, lNodes, lValueIdMap, lBodyCode);

        const lCodeGenerator = lFuncDef.codeGenerator.codeGenerator;
        if (lCodeGenerator) {
            return lCodeGenerator(lCodeFunc);
        }

        return lBodyCode;
    }

    /**
     * Generate code for a function along with intermediate snapshots for nodes that have previews.
     *
     * @param pFunction - The function to generate code for.
     * @param pPreviewNodes - Set of node instances that need intermediate code snapshots.
     *
     * @returns The full code, code function metadata, and per-node intermediate data.
     */
    public generateFunctionCodeWithIntermediates(pFunction: PotatnoDocumentFunction, pPreviewNodes: Set<PotatnoDocumentNode>): FunctionCodeWithIntermediates {
        const lFuncDef: PotatnoFunctionDefinition = pFunction.definition;
        const lNodes: ReadonlySet<PotatnoDocumentNode> = pFunction.nodes;
        const lValueIdMap: Map<PotatnoDocumentPort, string> = this.buildValueIdMap(lNodes);
        const lSortedNodes: Array<PotatnoDocumentNode> = this.topologicalSort(lNodes);
        const lCodeParts: Array<string> = [];
        const lNodeIntermediates: Map<PotatnoDocumentNode, NodeIntermediateData> = new Map();

        const lFuncInputs = this.collectFunctionInputs(pFunction, lNodes, lValueIdMap);
        const lFuncOutputs = this.collectFunctionOutputs(pFunction, lNodes, lValueIdMap);

        for (const lNode of lSortedNodes) {
            const lCategory: string = lNode.definition.category;
            if (lCategory === NodeCategory.Input || lCategory === NodeCategory.Output || lCategory === NodeCategory.Reroute || lCategory === NodeCategory.Comment) {
                continue;
            }

            const lCodeNode: PotatnoCodeNode = this.buildCodeNode(lNode, lValueIdMap);
            this.attachFlowBodies(lNode, lCodeNode, lValueIdMap);
            lCodeParts.push(lCodeNode.generateCode());

            if (pPreviewNodes.has(lNode)) {
                const lIntermediateBody: string = lCodeParts.join('\n');
                const lIntermediateFunc: PotatnoCodeFunction = new PotatnoCodeFunction();
                lIntermediateFunc.name = pFunction.label;
                lIntermediateFunc.bodyCode = lIntermediateBody;
                for (const lImport of pFunction.imports) {
                    lIntermediateFunc.imports.push(lImport);
                }
                for (const lIn of lFuncInputs) {
                    lIntermediateFunc.inputs.push({ ...lIn });
                }
                for (const lOut of lFuncOutputs) {
                    lIntermediateFunc.outputs.push({ ...lOut });
                }

                const lIntermediateCode: string = lFuncDef.codeGenerator.codeGenerator
                    ? lFuncDef.codeGenerator.codeGenerator(lIntermediateFunc)
                    : lIntermediateBody;

                lNodeIntermediates.set(lNode, {
                    intermediateCode: lIntermediateCode,
                    context: lCodeNode.buildContext(),
                    codeFunction: lIntermediateFunc
                });
            }
        }

        const lFullBody: string = lCodeParts.join('\n');
        const lCodeFunc: PotatnoCodeFunction = this.buildCodeFunction(pFunction, lNodes, lValueIdMap, lFullBody);
        const lFullCode: string = lFuncDef.codeGenerator.codeGenerator
            ? lFuncDef.codeGenerator.codeGenerator(lCodeFunc)
            : lFullBody;

        return { fullCode: lFullCode, codeFunction: lCodeFunc, nodeIntermediates: lNodeIntermediates };
    }

    /**
     * Generate code for all functions in the project.
     *
     * @param pFunctions - The map of functions to generate code for.
     *
     * @returns The combined code string for all functions.
     */
    public generateProjectCode(pFunctions: ReadonlyMap<string, PotatnoDocumentFunction>): string {
        return [...pFunctions.values()].map((pFunc) => this.generateFunctionCode(pFunc)).join('\n\n');
    }

    // ── Private helpers ────────────────────────────────────────────────────────

    /**
     * Assign a unique value identifier to every port in the node set.
     * Identifiers are simple counters prefixed with an underscore to avoid
     * conflicts with language keywords regardless of the target language.
     */
    private buildValueIdMap(pNodes: ReadonlySet<PotatnoDocumentNode>): Map<PotatnoDocumentPort, string> {
        const lMap = new Map<PotatnoDocumentPort, string>();
        let lCounter = 0;
        for (const lNode of pNodes) {
            for (const lPort of [...lNode.inputs.values(), ...lNode.outputs.values()]) {
                lMap.set(lPort, `_v${lCounter++}`);
            }
        }
        return lMap;
    }

    /**
     * Construct a PotatnoCodeFunction from a document function, its nodes, and the value-id map.
     */
    private buildCodeFunction(
        pFunction: PotatnoDocumentFunction,
        pNodes: ReadonlySet<PotatnoDocumentNode>,
        pValueIdMap: Map<PotatnoDocumentPort, string>,
        pBodyCode: string
    ): PotatnoCodeFunction {
        const lCodeFunc = new PotatnoCodeFunction();
        lCodeFunc.name = pFunction.label;
        lCodeFunc.bodyCode = pBodyCode;
        for (const lImport of pFunction.imports) {
            lCodeFunc.imports.push(lImport);
        }
        for (const lIn of this.collectFunctionInputs(pFunction, pNodes, pValueIdMap)) {
            lCodeFunc.inputs.push(lIn);
        }
        for (const lOut of this.collectFunctionOutputs(pFunction, pNodes, pValueIdMap)) {
            lCodeFunc.outputs.push(lOut);
        }
        return lCodeFunc;
    }

    /**
     * Map function input port definitions to code function input descriptors,
     * resolving each input's valueId via the corresponding Input node in the graph.
     */
    private collectFunctionInputs(
        pFunction: PotatnoDocumentFunction,
        pNodes: ReadonlySet<PotatnoDocumentNode>,
        pValueIdMap: Map<PotatnoDocumentPort, string>
    ): Array<{ name: string; type: string; valueId: string }> {
        return pFunction.inputs.map((pPortDef) => ({
            name: pPortDef.name,
            type: pPortDef.dataType,
            valueId: this.findInputNodeValueId(pNodes, pPortDef.name, pValueIdMap)
        }));
    }

    /**
     * Map function output port definitions to code function output descriptors,
     * resolving each output's valueId via the corresponding Output node in the graph.
     */
    private collectFunctionOutputs(
        pFunction: PotatnoDocumentFunction,
        pNodes: ReadonlySet<PotatnoDocumentNode>,
        pValueIdMap: Map<PotatnoDocumentPort, string>
    ): Array<{ name: string; type: string; valueId: string }> {
        return pFunction.outputs.map((pPortDef) => ({
            name: pPortDef.name,
            type: pPortDef.dataType,
            valueId: this.findOutputNodeValueId(pNodes, pPortDef.name, pValueIdMap)
        }));
    }

    /**
     * Generate body code for a node set by walking nodes in topological order.
     */
    private generateGraphCode(pNodes: ReadonlySet<PotatnoDocumentNode>, pValueIdMap: Map<PotatnoDocumentPort, string>): string {
        const lCodeParts: Array<string> = [];

        for (const lNode of this.topologicalSort(pNodes)) {
            const lCategory: string = lNode.definition.category;
            if (lCategory === NodeCategory.Input || lCategory === NodeCategory.Output || lCategory === NodeCategory.Reroute || lCategory === NodeCategory.Comment) {
                continue;
            }

            const lCodeNode: PotatnoCodeNode = this.buildCodeNode(lNode, pValueIdMap);
            this.attachFlowBodies(lNode, lCodeNode, pValueIdMap);
            lCodeParts.push(lCodeNode.generateCode());
        }

        return lCodeParts.join('\n');
    }

    /**
     * Populate each flow output port of a code node with its generated body code.
     */
    private attachFlowBodies(pNode: PotatnoDocumentNode, pCodeNode: PotatnoCodeNode, pValueIdMap: Map<PotatnoDocumentPort, string>): void {
        for (const [lName, lPort] of pNode.outputs) {
            if (lPort.portType !== 'flow') {
                continue;
            }

            const lConnectedPort: PotatnoDocumentPort | undefined = [...lPort.connectedPorts][0];
            pCodeNode.body.set(lName, {
                code: lConnectedPort ? this.generateFlowBodyCode(lConnectedPort, pValueIdMap) : ''
            });
        }
    }

    /**
     * Recursively generate code for a flow chain starting from a flow input port.
     *
     * @param pFlowInputPort - The flow input port that receives flow from an upstream node.
     * @param pValueIdMap - The value identifier map for the current generation pass.
     */
    private generateFlowBodyCode(pFlowInputPort: PotatnoDocumentPort, pValueIdMap: Map<PotatnoDocumentPort, string>): string {
        const lOwnerNode: PotatnoDocumentNode = pFlowInputPort.node;

        if (!this.mConfig.nodeDefinitions.get(lOwnerNode.definition.id) && lOwnerNode.definition.category !== 'function') {
            return '';
        }

        const lCodeNode: PotatnoCodeNode = this.buildCodeNode(lOwnerNode, pValueIdMap);
        this.attachFlowBodies(lOwnerNode, lCodeNode, pValueIdMap);
        return lCodeNode.generateCode();
    }

    /**
     * Build a PotatnoCodeNode from a graph node, selecting the appropriate
     * subclass based on the node's category and populating ports from the value-id map.
     */
    private buildCodeNode(pNode: PotatnoDocumentNode, pValueIdMap: Map<PotatnoDocumentPort, string>): PotatnoCodeNode {
        // Use the node's own definition's codeGenerator directly — works for both
        // project-registered nodes and PotatnoFunctionNodeDefinition instances.
        const lCodeGenerator = pNode.definition.codeGenerator;
        const lCodeNode: PotatnoCodeNode = this.createNodeForCategory(pNode.definition.category, lCodeGenerator);

        for (const [lName, lPort] of pNode.inputs) {
            if (lPort.portType === 'value') {
                const lSourcePort: PotatnoDocumentPort | undefined = [...lPort.connectedPorts][0];
                const lValueId: string = lSourcePort
                    ? this.resolveRerouteChain(lSourcePort, pValueIdMap)
                    : (pValueIdMap.get(lPort) ?? lName);
                lCodeNode.inputs.set(lName, { name: lName, type: lPort.type, valueId: lValueId, nodeType: 'value' });
            } else {
                lCodeNode.inputs.set(lName, { name: lName, type: '', valueId: '', nodeType: 'flow' });
            }
        }

        for (const [lName, lPort] of pNode.outputs) {
            if (lPort.portType === 'value') {
                lCodeNode.outputs.set(lName, { name: lName, type: lPort.type, valueId: pValueIdMap.get(lPort) ?? lName, nodeType: 'value' });
            } else {
                lCodeNode.outputs.set(lName, { name: lName, type: '', valueId: '', nodeType: 'flow' });
            }
        }

        return lCodeNode;
    }

    /**
     * Create the appropriate PotatnoCodeNode subclass based on the node category.
     */
    private createNodeForCategory(pCategory: string, pCodeGenerator: (pContext: PotatnoCodeNodeContext) => string): PotatnoCodeNode {
        switch (pCategory) {
            case NodeCategory.Comment:
            case NodeCategory.Input:
            case NodeCategory.Output:
            case NodeCategory.Reroute:
                return new PotatnoCodeNode();
            default:
                return new PotatnoCodeTemplateNode(pCodeGenerator);
        }
    }

    /**
     * Topological sort of nodes based on value-port data dependencies.
     * Uses node object references as keys — no string IDs required.
     */
    private topologicalSort(pNodes: ReadonlySet<PotatnoDocumentNode>): Array<PotatnoDocumentNode> {
        const lVisited = new Set<PotatnoDocumentNode>();
        const lResult: Array<PotatnoDocumentNode> = [];

        // Build dependency map: for each node, which nodes must be emitted before it.
        const lDependencies = new Map<PotatnoDocumentNode, Set<PotatnoDocumentNode>>();
        for (const lNode of pNodes) {
            lDependencies.set(lNode, new Set<PotatnoDocumentNode>());
        }
        for (const lNode of pNodes) {
            for (const lPort of lNode.inputs.values()) {
                if (lPort.portType === 'value') {
                    for (const lConnected of lPort.connectedPorts) {
                        lDependencies.get(lNode)?.add(lConnected.node);
                    }
                }
            }
        }

        const lVisit = (pNode: PotatnoDocumentNode): void => {
            if (lVisited.has(pNode)) {
                return;
            }
            lVisited.add(pNode);
            for (const lDep of lDependencies.get(pNode) ?? []) {
                lVisit(lDep);
            }
            lResult.push(pNode);
        };

        for (const lNode of pNodes) {
            lVisit(lNode);
        }

        return lResult;
    }

    /**
     * Find the valueId of the output port on the Input node for a given function input name.
     */
    private findInputNodeValueId(pNodes: ReadonlySet<PotatnoDocumentNode>, pName: string, pValueIdMap: Map<PotatnoDocumentPort, string>): string {
        for (const lNode of pNodes) {
            if (lNode.definition.category === NodeCategory.Input && lNode.definition.id === pName) {
                for (const lPort of lNode.outputs.values()) {
                    if (lPort.portType === 'value') {
                        return pValueIdMap.get(lPort) ?? pName;
                    }
                }
            }
        }
        return pName;
    }

    /**
     * Find the valueId of the connected source for the Output node matching a given function output name.
     */
    private findOutputNodeValueId(pNodes: ReadonlySet<PotatnoDocumentNode>, pName: string, pValueIdMap: Map<PotatnoDocumentPort, string>): string {
        for (const lNode of pNodes) {
            if (lNode.definition.category === NodeCategory.Output && lNode.definition.id === pName) {
                for (const lPort of lNode.inputs.values()) {
                    if (lPort.portType === 'value') {
                        const lConnected: PotatnoDocumentPort | undefined = [...lPort.connectedPorts][0];
                        if (lConnected) {
                            return this.resolveRerouteChain(lConnected, pValueIdMap);
                        }
                        return pValueIdMap.get(lPort) ?? pName;
                    }
                }
            }
        }
        return pName;
    }

    /**
     * Follow a reroute node chain upstream and return the effective valueId of the
     * original non-reroute source port.
     */
    private resolveRerouteChain(pPort: PotatnoDocumentPort, pValueIdMap: Map<PotatnoDocumentPort, string>): string {
        if (pPort.node.definition.category === NodeCategory.Reroute) {
            for (const lInputPort of pPort.node.inputs.values()) {
                if (lInputPort.portType === 'value') {
                    const lConnected: PotatnoDocumentPort | undefined = [...lInputPort.connectedPorts][0];
                    if (lConnected) {
                        return this.resolveRerouteChain(lConnected, pValueIdMap);
                    }
                    return pValueIdMap.get(lInputPort) ?? '';
                }
            }
        }
        return pValueIdMap.get(pPort) ?? '';
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
    /** Per-node intermediate data, keyed by node instance. */
    nodeIntermediates: Map<PotatnoDocumentNode, NodeIntermediateData>;
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
