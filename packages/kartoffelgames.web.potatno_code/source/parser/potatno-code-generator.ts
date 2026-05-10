import { Exception } from "@kartoffelgames/core";
import type { PotatnoDocumentFunction } from '../document/potatno-document-function.ts';
import type { PotatnoDocumentNode } from '../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../document/potatno-document-port.ts';
import { PotatnoDocument } from "../document/potatno-document.ts";
import { PotatnoFunctionNodeDefinition } from '../project/node_definition/potatno-function-node-definition.ts';
import type { PotatnoCodeGeneratorPort, PotatnoNodeDefinitionGeneratorContext } from '../project/node_definition/potatno-node-definition.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';
import { PotatnoFunctionDefinition } from "../project/potatno-function-definition.ts";
import { PotatnoCodeGeneratorFunctionContext } from './potatno-code-generator-function-context.ts';

/**
 * Walks the graph in topological order and generates code without metadata markers.
 *
 * Value identifiers (valueIds) are assigned freshly each generation pass using a
 * Map<PotatnoDocumentPort, string> — they are not stored on the port objects.
 */
export class PotatnoCodeGenerator<TProject extends PotatnoProject> {
    private readonly mProject: TProject;

    /**
     * Constructor.
     *
     * @param pProject - The project providing node definitions and code generation settings.
     */
    public constructor(pProject: TProject) {
        this.mProject = pProject;
    }

    /**
     * Generate code for a document.
     * Generates code for all functions reachable from the documents entry point.
     *
     * @param pDocument - The document to generate code for.
     *
     * @returns The generated code as a string.
     */
    public generateDocumentCode(pDocument: PotatnoDocument<TProject>): PotatnoCodeGeneratorResult<TProject> {
        // Find the primary function (entry point) to generate code for.
        const lEntryPointFunction: PotatnoDocumentFunction<TProject> | undefined = [...pDocument.functions].find((pFunction) => {
            return pFunction.isSystem;
        });

        if (!lEntryPointFunction) {
            throw new Exception('No entry point function found for code generation.', this);
        }

        // Generate code for the entry point function and all functions reachable from it.
        return this.generateFunctionCode(lEntryPointFunction);
    }

    /**
     * Generate code for a function.
     * Generates code for the given function and all functions reachable from it.
     *
     * @param pFunction - The function to generate code for.
     *
     * @returns the generated function code along with any dependent function code generations.
     */
    public generateFunctionCode(pFunction: PotatnoDocumentFunction<TProject>): PotatnoCodeGeneratorResult<TProject> {
        // Get the function definition.
        const lFunctionDefinition: PotatnoFunctionDefinition<TProject> | undefined = this.mProject.getFunction(pFunction.definitionId);
        if (!lFunctionDefinition) {
            throw new Exception(`Function definition not found for function "${pFunction.label}".`, this);
        }

        const lNodeDefinitions = lFunctionDefinition.getNodeDefinitions(pFunction);

        // Collect definition IDs for entry and exit nodes.
        const lEntryNodeDefinitionIds = new Set(lNodeDefinitions.entry.map((d) => d.id));
        const lExitNodeDefinitionIds = new Set(lNodeDefinitions.exit.map((d) => d.id));

        // Find the actual node instances in the function.
        const lExitNodes: Array<PotatnoDocumentNode<TProject>> = [...pFunction.nodes].filter((n) => lExitNodeDefinitionIds.has(n.definitionId));
        const lEntryNodes: Array<PotatnoDocumentNode<TProject>> = [...pFunction.nodes].filter((n) => lEntryNodeDefinitionIds.has(n.definitionId));

        // Shared state for the entire function generation pass.
        const lValueIdMap: Map<PotatnoDocumentPort<TProject>, string> = new Map<PotatnoDocumentPort<TProject>, string>();
        let lValueIdCounter: number = 0;
        const lGetOrCreateValueId = (pPort: PotatnoDocumentPort<TProject>): string => {
            if (!lValueIdMap.has(pPort)) {
                lValueIdMap.set(pPort, `__v${lValueIdCounter++}`);
            }
            return lValueIdMap.get(pPort)!;
        };

        // Pre-assign valueIds for all entry node value outputs so they are deterministic
        // and available even when the ports are not reached during backwards traversal.
        for (const lEntryNode of lEntryNodes) {
            for (const lOutputPort of lEntryNode.outputs.values()) {
                if (lOutputPort.portType === 'value') {
                    lGetOrCreateValueId(lOutputPort);
                }
            }
        }

        // Shared memoization set for pure-value nodes across all exit nodes.
        const lEmittedPureValueNodes: Set<PotatnoDocumentNode<TProject>> = new Set<PotatnoDocumentNode<TProject>>();
        const lDependentFunctionCodes: Array<PotatnoCodeGeneratorResultDependency<TProject>> = new Array<PotatnoCodeGeneratorResultDependency<TProject>>();

        const lCodeFunction: PotatnoCodeGeneratorFunctionContext<TProject> = new PotatnoCodeGeneratorFunctionContext<TProject>(pFunction.label, pFunction);

        // Generate per-exit-node results.
        for (const lExitNode of lExitNodes) {
            const lBodyCode: string = this.generateNodeCodeInternal(lExitNode, lDependentFunctionCodes, lValueIdMap, lGetOrCreateValueId, lEmittedPureValueNodes);

            // BFS backwards from the exit node to find which entry node (if any) dominates it.
            const lEntryNode: PotatnoDocumentNode<TProject> | null = this.findEntryNode(lExitNode, lEntryNodeDefinitionIds);

            // Collect value output ports of the entry node with their pre-assigned valueIds.
            const lEntryPorts: Array<{ name: string; type: string; valueId: string }> = [];
            if (lEntryNode) {
                for (const lOutputPort of lEntryNode.outputs.values()) {
                    if (lOutputPort.portType === 'value') {
                        lEntryPorts.push({
                            name: lOutputPort.label,
                            type: lOutputPort.dataType as string,
                            valueId: lValueIdMap.get(lOutputPort) ?? ''
                        });
                    }
                }
            }

            // Collect value input ports of the exit node with their resolved valueIds.
            const lExitPorts: Array<{ name: string; type: string; valueId: string }> = [];
            for (const lInputPort of lExitNode.inputs.values()) {
                if (lInputPort.portType === 'value') {
                    let lValueId: string = '';
                    if (lInputPort.connectedPorts.size > 0) {
                        const lConnectedOutputPort: PotatnoDocumentPort<TProject> = lInputPort.connectedPorts.values().next().value!;
                        lValueId = lValueIdMap.get(lConnectedOutputPort) ?? '';
                    } else if (lInputPort.dataType && !pFunction.project.types.isGenericType(lInputPort.dataType)) {
                        lValueId = pFunction.project.types.getType(lInputPort.dataType as any).convert([...lInputPort.directValue]);
                    }
                    lExitPorts.push({
                        name: lInputPort.label,
                        type: lInputPort.dataType as string,
                        valueId: lValueId
                    });
                }
            }

            lCodeFunction.nodes.push({
                bodyCode: lBodyCode,
                entryNode: lEntryNode,
                entryPorts: lEntryPorts,
                exitNode: lExitNode,
                exitPorts: lExitPorts
            });
        }

        return {
            code: lFunctionDefinition.codeGenerator.body(lCodeFunction),
            dependencies: lDependentFunctionCodes,
            functionContext: lCodeFunction
        };
    }

    /**
     * Generate code for a single node, along with any dependent function code generations.
     *
     * @param pNode - The node to generate code for.
     *
     * @returns The result of the code generation for the node.
     */
    public generateNodeCode(pNode: PotatnoDocumentNode<TProject>): PotatnoCodeGeneratorResult<TProject> {
        return this.generateNodeCodeWithDependencies(pNode, new Array<PotatnoCodeGeneratorResultDependency<TProject>>());
    }

    /**
     * BFS backwards through all incoming connections to find the first entry node reachable from pNode.
     *
     * @param pNode - Starting node for the backwards search.
     * @param pEntryNodeDefinitionIds - Set of definition IDs considered entry nodes.
     *
     * @returns The first entry node found, or null if none is reachable.
     */
    private findEntryNode(pNode: PotatnoDocumentNode<TProject>, pEntryNodeDefinitionIds: Set<string>): PotatnoDocumentNode<TProject> | null {
        const lVisited: Set<PotatnoDocumentNode<TProject>> = new Set<PotatnoDocumentNode<TProject>>();
        const lQueue: Array<PotatnoDocumentNode<TProject>> = [pNode];

        while (lQueue.length > 0) {
            const lCurrent: PotatnoDocumentNode<TProject> = lQueue.shift()!;
            if (lVisited.has(lCurrent)) {
                continue;
            }
            lVisited.add(lCurrent);

            if (lCurrent !== pNode && pEntryNodeDefinitionIds.has(lCurrent.definitionId)) {
                return lCurrent;
            }

            for (const lPort of lCurrent.inputs.values()) {
                for (const lConnectedPort of lPort.connectedPorts) {
                    if (!lVisited.has(lConnectedPort.node)) {
                        lQueue.push(lConnectedPort.node);
                    }
                }
            }
        }

        return null;
    }

    /**
     * Core recursive node code generation. Accepts shared state so multiple exit nodes
     * within the same function generation pass share the same valueId counter and memoization.
     */
    private generateNodeCodeInternal(
        pNode: PotatnoDocumentNode<TProject>,
        pFunctionDependencies: Array<PotatnoCodeGeneratorResultDependency<TProject>>,
        pValueIdMap: Map<PotatnoDocumentPort<TProject>, string>,
        pGetOrCreateValueId: (pPort: PotatnoDocumentPort<TProject>) => string,
        pEmittedPureValueNodes: Set<PotatnoDocumentNode<TProject>>
    ): string {
        // Create a map for resolving function ids to their instance.
        const lFunctionMap: Map<string, PotatnoDocumentFunction<TProject>> = new Map<string, PotatnoDocumentFunction<TProject>>();
        for (const lFunction of pNode.document.functions) {
            lFunctionMap.set(lFunction.id, lFunction);
        }

        const lIsPureValueNode = (pCurrentNode: PotatnoDocumentNode<TProject>): boolean => {
            for (const lPort of pCurrentNode.inputs.values()) {
                if (lPort.portType === 'flow') { return false; }
            }
            for (const lPort of pCurrentNode.outputs.values()) {
                if (lPort.portType === 'flow') { return false; }
            }
            return true;
        };

        const lGenerateNode = (pCurrentNode: PotatnoDocumentNode<TProject>): string => {
            // Skip pure value nodes that have already been declared.
            if (lIsPureValueNode(pCurrentNode)) {
                if (pEmittedPureValueNodes.has(pCurrentNode)) {
                    return '';
                }
                pEmittedPureValueNodes.add(pCurrentNode);
            }

            // Pre-assign output value IDs so downstream nodes can reference them.
            for (const lOutputPort of pCurrentNode.outputs.values()) {
                if (lOutputPort.portType === 'value') {
                    pGetOrCreateValueId(lOutputPort);
                }
            }

            // Find the node's definition in the function's available definitions.
            const lDefinition = pCurrentNode.function.nodeDefinitions.find((d) => d.id === pCurrentNode.definitionId);

            // When the node is a user-function call, generate the callee and add it as a dependency.
            if (lDefinition instanceof PotatnoFunctionNodeDefinition) {
                const lDocFunction: PotatnoDocumentFunction<TProject> | undefined = lFunctionMap.get(lDefinition.function.id);
                if (lDocFunction && !pFunctionDependencies.some((dep) => dep.function.id === lDocFunction.id)) {
                    const lFunctionResult: PotatnoCodeGeneratorResult<TProject> = this.generateFunctionCode(lDocFunction);
                    pFunctionDependencies.push({ code: lFunctionResult.code, function: lDocFunction });
                    for (const lTransitiveDep of lFunctionResult.dependencies) {
                        if (!pFunctionDependencies.some((dep) => dep.function.id === lTransitiveDep.function.id)) {
                            pFunctionDependencies.push(lTransitiveDep);
                        }
                    }
                }
            }

            // Generate preceding code for all value input dependencies (backwards traversal).
            let lPrecedingCode: string = '';
            for (const lInputPort of pCurrentNode.inputs.values()) {
                if (lInputPort.portType === 'value' && lInputPort.connectedPorts.size > 0) {
                    const lConnectedOutputPort: PotatnoDocumentPort<TProject> = lInputPort.connectedPorts.values().next().value!;
                    pGetOrCreateValueId(lConnectedOutputPort);
                    lPrecedingCode += lGenerateNode(lConnectedOutputPort.node);
                }
            }

            // Build context inputs.
            const lContextInputs: Record<string, PotatnoCodeGeneratorPort> = {};
            for (const [lPortId, lInputPort] of pCurrentNode.inputs) {
                if (lInputPort.portType === 'value') {
                    let lValueId: string = '';
                    if (lInputPort.connectedPorts.size > 0) {
                        const lConnectedOutputPort: PotatnoDocumentPort<TProject> = lInputPort.connectedPorts.values().next().value!;
                        lValueId = pValueIdMap.get(lConnectedOutputPort) ?? '';
                    } else if (lInputPort.dataType && !pCurrentNode.project.types.isGenericType(lInputPort.dataType)) {
                        lValueId = pCurrentNode.project.types.getType(lInputPort.dataType as any).convert([...lInputPort.directValue]);
                    }
                    lContextInputs[lPortId] = { valueId: lValueId, code: { inner: '', next: '' } };
                } else {
                    lContextInputs[lPortId] = { valueId: '', code: { inner: '', next: '' } };
                }
            }

            // Build context outputs.
            const lContextOutputs: Record<string, PotatnoCodeGeneratorPort> = {};
            for (const [lPortId, lOutputPort] of pCurrentNode.outputs) {
                if (lOutputPort.portType === 'value') {
                    lContextOutputs[lPortId] = { valueId: pValueIdMap.get(lOutputPort) ?? '', code: { inner: '', next: '' } };
                } else {
                    // Flow output: body is the concatenated code of all nodes connected through this output.
                    let lBodyCode: string = '';
                    for (const lConnectedFlowInput of lOutputPort.connectedPorts) {
                        lBodyCode += lGenerateNode(lConnectedFlowInput.node);
                    }
                    lContextOutputs[lPortId] = { valueId: '', code: { inner: lBodyCode, next: '' } };
                }
            }

            const lContext: PotatnoNodeDefinitionGeneratorContext = { inputs: lContextInputs, outputs: lContextOutputs };
            const lNodeCode: string = lDefinition?.codeGenerator(lContext) ?? '';

            return lPrecedingCode + lNodeCode;
        };

        return lGenerateNode(pNode);
    }

    private generateNodeCodeWithDependencies(pNode: PotatnoDocumentNode<TProject>, pFunctionDependencies: Array<PotatnoCodeGeneratorResultDependency<TProject>>): PotatnoCodeGeneratorResult<TProject> {
        const lValueIdMap: Map<PotatnoDocumentPort<TProject>, string> = new Map<PotatnoDocumentPort<TProject>, string>();
        let lValueIdCounter: number = 0;
        const lGetOrCreateValueId = (pPort: PotatnoDocumentPort<TProject>): string => {
            if (!lValueIdMap.has(pPort)) {
                lValueIdMap.set(pPort, `__v${lValueIdCounter++}`);
            }
            return lValueIdMap.get(pPort)!;
        };
        const lEmittedPureValueNodes: Set<PotatnoDocumentNode<TProject>> = new Set<PotatnoDocumentNode<TProject>>();

        return {
            code: this.generateNodeCodeInternal(pNode, pFunctionDependencies, lValueIdMap, lGetOrCreateValueId, lEmittedPureValueNodes),
            dependencies: pFunctionDependencies,
            functionContext: null
        };
    }
}

/**
 * Result of generating code for a single item, including any dependent function code generations.
 */
export type PotatnoCodeGeneratorResult<TProject extends PotatnoProject> = {
    /**
     * Generated code.
     */
    code: string;

    /**
     * List of function code generations that the node depends on.
     */
    dependencies: Array<PotatnoCodeGeneratorResultDependency<TProject>>;

    /**
     * The function context built during generation. Only set when generating function code;
     * null when generating a single node via generateNodeCode.
     */
    functionContext: PotatnoCodeGeneratorFunctionContext<TProject> | null;
};

/**
 * Represents a single function code generation that is a dependency of a code generation, including the generated code and the function it corresponds to.
 */
export type PotatnoCodeGeneratorResultDependency<TProject extends PotatnoProject> = {
    /**
     * The generated code for the dependent function.
     */
    code: string;

    /**
     * The function that was generated to produce the code.
     */
    function: PotatnoDocumentFunction<TProject>;
};
