import { Exception } from '@kartoffelgames/core';
import type { PotatnoDocumentFunction } from '../document/potatno-document-function.ts';
import type { PotatnoDocumentNode } from '../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../document/potatno-document-port.ts';
import type { PotatnoDocumentValidationResult } from '../document/potatno-document-validation-result.ts';
import type { PotatnoDocument } from '../document/potatno-document.ts';
import { FlowConjunctionNodeDefinition } from '../project/node_definition/potatno-flow-conjunction-node-definition.ts';
import { PotatnoFunctionNodeDefinition } from '../project/node_definition/potatno-function-node-definition.ts';
import type { PotatnoCodeGeneratorInputPort, PotatnoCodeGeneratorOutputPort, PotatnoNodeDefinition } from '../project/node_definition/potatno-node-definition.ts';
import { ValueConjunctionNodeDefinition } from '../project/node_definition/potatno-value-conjunction-node-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../project/potatno-project-types-definition.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';
import { PotatnoCodeGeneratorDocumentResult } from './result/potatno-code-generator-document-result.ts';
import { PotatnoCodeGeneratorFunctionResult } from './result/potatno-code-generator-function-result.ts';
import { PotatnoCodeGeneratorNodeResult } from './result/potatno-code-generator-node-result.ts';

/**
 * Code generator for Potatno documents.
 * The generator stays language-agnostic.
 *
 * Walks each function's graphs backward from their exit nodes, gathering code via the registered node definitions' code generators,
 * and aggregates the per-graph results into function-level and document-level outputs.
 * It only chains the strings node generators return, never emits syntax of its own.
 */
export class PotatnoCodeGenerator<TProjectTypes extends PotatnoProjectTypesDefinition> {
    private readonly mProject: PotatnoProject<TProjectTypes>;

    /**
     * Constructor.
     *
     * @param pProject - The project providing node definitions and code generation settings.
     */
    public constructor(pProject: PotatnoProject<TProjectTypes>) {
        this.mProject = pProject;
    }

    /**
     * Generate code for an entire document.
     *
     * Locates the document's system entry-point function and delegates to generateFunction.
     * Dependency function results are appended to the document result in appearance order.
     *
     * @param pDocument - The document to generate code for.
     * @param pDebug - When true, node code generators receive pContext.debug=true and can emit preview hooks. Defaults to false for whole-document builds.
     *
     * @returns A DocumentResult with the entry-point function result and all transitive dependencies.
     */
    public generateDocument(pDocument: PotatnoDocument<TProjectTypes>, pDebug: boolean = false): PotatnoCodeGeneratorDocumentResult<TProjectTypes> {
        // Locate the entry-point function (the system function in the document).
        const lEntryPointFunction: PotatnoDocumentFunction<TProjectTypes> | undefined = [...pDocument.functions].find((pFunction) => {
            return pFunction.isSystem;
        });

        if (!lEntryPointFunction) {
            throw new Exception('No entry point function found for code generation.', this);
        }

        // Delegate to generateFunction so all three public entry points share the same pipeline.
        return this.generateFunction(lEntryPointFunction, pDebug);
    }

    /**
     * Generate code for a single function and every function it transitively depends on.
     * The function itself becomes the document result's entry point. Every exit node declared by the function definition is generated.
     *
     * @param pFunction - The function to generate code for.
     * @param pDebug - Forwarded to node code generators as pContext.debug. Defaults to true since this entry point is typically used for intermediate / preview builds.
     *
     * @returns A DocumentResult with pFunction's result as the entry point plus all transitive dependencies.
     */
    public generateFunction(pFunction: PotatnoDocumentFunction<TProjectTypes>, pDebug: boolean = false): PotatnoCodeGeneratorDocumentResult<TProjectTypes> {
        return this.buildDocumentResult(pFunction.document, pFunction.getExitNodes(), pDebug);
    }

    /**
     * Generate code for the subgraph terminating at a single exit node.
     * The originating function is wrapped as the document result's entry point, containing only the one generated NodeResult.
     *
     * @param pExitNode - The exit node anchoring the subgraph.
     * @param pDebug - Forwarded to node code generators as pContext.debug. Defaults to true since this entry point is typically used for intermediate / preview builds.
     *
     * @returns A DocumentResult with the single-graph FunctionResult as the entry point plus all transitive dependencies.
     */
    public generateNode(pExitNode: PotatnoDocumentNode<TProjectTypes>, pDebug: boolean = false): PotatnoCodeGeneratorDocumentResult<TProjectTypes> {
        return this.buildDocumentResult(pExitNode.document, [pExitNode], pDebug);
    }

    /**
     * Build a DocumentResult from a given entry-point function and a specific set of exit nodes to walk.
     * The entry FunctionResult contains exactly one NodeResult per exit node in pExitNodes (no more, no less).
     * Function-call dependencies discovered during the walks are then collected and generated to fill the result's dependency list.
     *
     * @param pDocument - The document the entry point belongs to.
     * @param pEntryPointFunction - The function that anchors the document result.
     * @param pExitNodes - The exit nodes whose subgraphs are walked into the entry FunctionResult.
     * @param pDebug - Debug flag for the whole pass.
     */
    private buildDocumentResult(pDocument: PotatnoDocument<TProjectTypes>, pExitNodes: Array<PotatnoDocumentNode<TProjectTypes>>, pDebug: boolean): PotatnoCodeGeneratorDocumentResult<TProjectTypes> {
        // Validate document before generation.
        const lValidationResult: PotatnoDocumentValidationResult<TProjectTypes> = pDocument.validate();
        if (lValidationResult.errors.length > 0) {
            throw new Exception('Code generation exited. Code graph validation failed.', this);
        }

        const lPassData: PotatnoCodeGeneratorPassData<TProjectTypes> = {
            counter: { nodeIndex: 0, portIndex: 0 },
            debug: pDebug,
            nodeDefinitions: new Map<PotatnoDocumentFunction<TProjectTypes>, Map<string, PotatnoNodeDefinition<TProjectTypes>>>()
        };

        // Generate everything. The last entry is the requested entry function result.
        const lFunctionGenerationResults: Array<PotatnoCodeGeneratorFunctionResult<TProjectTypes>> = this.generateFunctionWithDependencies(lPassData, pExitNodes, new Set<PotatnoDocumentFunction<TProjectTypes>>());
        const lEntryPointResult: PotatnoCodeGeneratorFunctionResult<TProjectTypes> = lFunctionGenerationResults.shift()!;

        return new PotatnoCodeGeneratorDocumentResult(pDocument, lEntryPointResult, lFunctionGenerationResults);
    }

    /**
     * Pass that counts each encountered node, starting at a root node.
     *
     * @param pStartNode - The starting node (the scope's exit / fan-in predecessor).
     * @param pEndNode - When set, traversal stops at this node (used by sub-walks to bound their scope to the branch).
     *
     * @returns the mapping between the document nodes and the encounter counter.
     */
    private countNodeEncounter(pStartNode: PotatnoDocumentNode<TProjectTypes>, pEndNode: PotatnoDocumentNode<TProjectTypes> | null): Map<PotatnoDocumentNode<TProjectTypes>, number> {
        const lRemaining: Map<PotatnoDocumentNode<TProjectTypes>, number> = new Map<PotatnoDocumentNode<TProjectTypes>, number>();

        const lCheckedNodes: Set<PotatnoDocumentNode<TProjectTypes>> = new Set<PotatnoDocumentNode<TProjectTypes>>();
        const lNodeTasks: Array<PotatnoDocumentNode<TProjectTypes>> = new Array<PotatnoDocumentNode<TProjectTypes>>(pStartNode);
        while (lNodeTasks.length > 0) {
            // Get next flow node task from stack. Skip if node should not be checked or the node was already checked.
            const lNode: PotatnoDocumentNode<TProjectTypes> = lNodeTasks.pop()!;

            // Count any incomming connection, even when a node port has multiple connections to the same node.
            lRemaining.set(lNode, (lRemaining.get(lNode) ?? 0) + 1);

            // Skip on end node or when node was already marched.
            if (lNode === pEndNode || lCheckedNodes.has(lNode)) {
                continue;
            }

            // Add node to checked node.
            lCheckedNodes.add(lNode);

            // Move backwards of each flow output port and add these flow nodes as next flow tasks. Each flow input may have multiple connections.
            for (const lInputFlowPort of lNode.inputs.flow) {
                for (const lUpstreamPort of this.resolveFlowConjunctions(lInputFlowPort)) {
                    lNodeTasks.push(lUpstreamPort.node);
                }
            }

            // Move backwards for each value node.
            for (const lInputValuePort of lNode.inputs.value) {
                const lIncomingValuePort: PotatnoDocumentPort<TProjectTypes> | null = this.resolveValueConjunctions(lInputValuePort);
                if (lIncomingValuePort) {
                    lNodeTasks.push(lIncomingValuePort.node);
                }
            }
        }

        return lRemaining;
    }

    /**
     * Construct a fresh scope ready to be used by a backward walk.
     *
     * @param pStartNode - The node the walk will start from.
     * @param pEndNode - The walk's stop sentinel (null at top-level).
     */
    private createScope(pStartNode: PotatnoDocumentNode<TProjectTypes>, pEndNode: PotatnoDocumentNode<TProjectTypes> | null): PotatnoCodeGeneratorPassCursorScope<TProjectTypes> {
        return {
            emittedNodes: new Set<PotatnoDocumentNode<TProjectTypes>>(),
            remaining: this.countNodeEncounter(pStartNode, pEndNode)
        };
    }

    /**
     * Build the node's generator context, run its code generator, and return the produced code as an emit result.
     *
     * Each flow output gets its inner string from pInnerByPort (empty when absent); emitNode never reads a buffer itself.
     * Pure-value producers feeding this node's value inputs are emitted here and folded into the result (producers first, then this node's code).
     * Function-call nodes record their target function in the cursor's dependency list.
     *
     * @param pPassData - Shared pass state.
     * @param pCursor - The pass cursor.
     * @param pNode - The node to emit code for.
     * @param pFlowPortCodeOutput - Inner code per flow output port id.
     * @param pNextCode - Merged-tail code for a branching node. Defaults to empty.
     *
     * @returns this node's emit result (its code plus any value-producer code) with the node as last-generated.
     */
    private emitNode(pPassData: PotatnoCodeGeneratorPassData<TProjectTypes>, pCursor: PotatnoCodeGeneratorPassCursor<TProjectTypes>, pNode: PotatnoDocumentNode<TProjectTypes>, pFlowPortCodeOutput: Record<string, string>, pNextCode?: string): PotatnoCodeGeneratorEmitResult<TProjectTypes> {
        // Initialize missing node definition lookups for this function.
        if (!pPassData.nodeDefinitions.get(pNode.function)) {
            const lNodeLookup: Map<string, PotatnoNodeDefinition<TProjectTypes>> = new Map<string, PotatnoNodeDefinition<TProjectTypes>>();
            for (const lDefinition of pNode.function.nodeDefinitions) {
                lNodeLookup.set(lDefinition.id, lDefinition);
            }
            pPassData.nodeDefinitions.set(pNode.function, lNodeLookup);
        }

        // Resolve the live node definition for this node via the per-function cache.
        const lNodeDefinition: PotatnoNodeDefinition<TProjectTypes> | undefined = pPassData.nodeDefinitions.get(pNode.function)!.get(pNode.definitionId);
        if (!lNodeDefinition) {
            throw new Exception(`Node definition "${pNode.definitionId}" not found for node "${pNode.label}".`, this);
        }

        // Function-call nodes: record the target document function as a dependency. Duplicates inside a single NodeResult are harmless. The outer generateFunctionWithDependencies loop deduplicates via pFunctionBuffer.
        if (lNodeDefinition instanceof PotatnoFunctionNodeDefinition) {
            pCursor.dependencies.push(lNodeDefinition.function);
        }

        // Build the input port surfaces. Only value inputs make it into pContext.inputs.
        // A pure-value producer resolved here hands back its own emit result. Collect them in input order.
        const lInputs: Record<string, PotatnoCodeGeneratorInputPort> = {};
        const lProducerEmits: Array<PotatnoCodeGeneratorEmitResult<TProjectTypes>> = new Array<PotatnoCodeGeneratorEmitResult<TProjectTypes>>();
        for (const lPort of pNode.inputs.value) {
            // Resolve the input value of the port.
            const lResolvedInput: PotatnoCodeGeneratorResolvedInput<TProjectTypes> = this.resolveInputValue(pPassData, pCursor, lPort);
            lInputs[lPort.definitionId] = lResolvedInput.inputPort;

            // Set the resolved port value as value... yeaaaa
            pCursor.ports.set(lPort, lResolvedInput.inputPort.value);

            if (lResolvedInput.emitResult) {
                lProducerEmits.push(lResolvedInput.emitResult);
            }
        }

        // Build the output port surfaces. Value outputs get freshly allocated valueIds. Flow outputs get the caller-supplied inner code, defaulting to empty when the port is not present in pInnerByPort.
        const lOutputs: Record<string, PotatnoCodeGeneratorOutputPort> = {};
        for (const lPort of pNode.outputs.list) {
            // Get port value already sets the value.
            lOutputs[lPort.definitionId] = {
                value: this.generatePortValue(pPassData, pCursor, lPort),
                code: {
                    inner: pFlowPortCodeOutput[lPort.definitionId] ?? ''
                }
            };
        }

        // Assemble the full context and invoke the node's code generator.
        let lNodeCode: string = lNodeDefinition.codeGenerator({
            inputs: lInputs,
            outputs: lOutputs,
            code: { next: pNextCode ?? '' }
        });

        // Wrap generated node code with debug hooks.
        const lNodeId: string = this.getGeneratedNodeId(pPassData, pCursor, pNode);
        if (pPassData.debug) {
            lNodeCode = this.mProject.generator.value.hook(`start-${lNodeId}`)
                + lNodeCode
                + this.mProject.generator.value.hook(`end-${lNodeId}`);
        }

        // Assemble this node's contribution in execution order: each value producer's code first (in input order),
        // then this node's own code, so a produced value is always defined before the node that consumes it.
        const lCodeOutput: Array<string> = new Array<string>();
        for (const lProducerEmit of lProducerEmits) {
            lCodeOutput.push(...lProducerEmit.codeOutput);
        }
        lCodeOutput.push(lNodeCode);

        return {
            codeOutput: lCodeOutput,
            lastGeneratedNode: pNode,

            // An emit happens without a flow port.
            endFlowPort: null
        };
    }

    /**
     * Find the branch point that fans into pMergeNode via a tagged backward BFS: each fan-in predecessor seeds a tag,
     * tags propagate backward, and the first node accumulating every tag is the branch point.
     *
     * @param pMergeNode - A node with ≥2 flow-input connections.
     */
    private findBranchStartPoint(pMergeNode: PotatnoDocumentNode<TProjectTypes>): PotatnoDocumentNode<TProjectTypes> {
        // Each fan-in branch seeds a distinct tag; the first node that accumulates every tag is the common branch point.
        const lBranchPorts: Array<PotatnoDocumentPort<TProjectTypes>> = this.getNodesInputFlowPorts(pMergeNode);
        const lMaxBrachCount: number = lBranchPorts.length;

        // Union pTags into pNode's tag set, creating it on first encounter, and enqueue pNode whenever it gained a tag.
        const lNodeTags: Map<PotatnoDocumentNode<TProjectTypes>, Set<number>> = new Map<PotatnoDocumentNode<TProjectTypes>, Set<number>>();
        const lQueue: Array<PotatnoDocumentNode<TProjectTypes>> = new Array<PotatnoDocumentNode<TProjectTypes>>();
        const lMergeTags = (pNode: PotatnoDocumentNode<TProjectTypes>, pAddingTags: Iterable<number>): Set<number> => {
            // Read or create the current tags of the node.
            const lTags: Set<number> = (() => {
                if (!lNodeTags.has(pNode)) {
                    lNodeTags.set(pNode, new Set<number>());
                }

                return lNodeTags.get(pNode)!;
            })();

            // Save the current tag count to check for growth after the union.
            const lSizeBefore: number = lTags.size;
            for (const lNewTag of pAddingTags) {
                lTags.add(lNewTag);
            }

            // Check for new tags on node and enqueue if it gained any.
            if (lTags.size > lSizeBefore) {
                lQueue.push(pNode);
            }

            return lTags;
        };

        // Seed one tag per fan-in branch. Ports sharing a node union their tags so that node starts with all of them.
        for (const [lTag, lBranchPort] of lBranchPorts.entries()) {
            lMergeTags(lBranchPort.node, [lTag]);
        }

        // Propagate tags backward. The first node holding every tag is the branch point.
        while (lQueue.length > 0) {
            const lNode: PotatnoDocumentNode<TProjectTypes> = lQueue.shift()!;
            const lTags: Set<number> = lNodeTags.get(lNode)!;

            // Union this node's tags into each flow predecessor.
            for (const lPredecessorPort of this.getNodesInputFlowPorts(lNode)) {
                // Merge tags and check if this predecessor is the branch point.
                if (lMergeTags(lPredecessorPort.node, lTags).size === lMaxBrachCount) {
                    return lPredecessorPort.node;
                }
            }
        }

        throw new Exception('No common branch point found for merge node.', this);
    }

    /**
     * Recursive generate code for the starting exit nodes.
     * After the initial generation the exit nodes dependencies get generated.
     * 
     * @param pPassData - Shared pass state (counter, debug).
     * @param pFunctionExitNodes - Staring nodes of the first function that should be generated. 
     */
    private generateFunctionWithDependencies(pPassData: PotatnoCodeGeneratorPassData<TProjectTypes>, pFunctionExitNodes: Array<PotatnoDocumentNode<TProjectTypes>>, pFunctionBuffer: Set<PotatnoDocumentFunction<TProjectTypes>>): Array<PotatnoCodeGeneratorFunctionResult<TProjectTypes>> {
        // Result list of generated functions.
        const lGeneratedFunctions: Array<PotatnoCodeGeneratorFunctionResult<TProjectTypes>> = new Array<PotatnoCodeGeneratorFunctionResult<TProjectTypes>>();

        // Validate that something has been generated.
        if (pFunctionExitNodes.length === 0) {
            return lGeneratedFunctions;
        }

        // Read the document function by looking at the first exit node. 
        const lFunction: PotatnoDocumentFunction<TProjectTypes> = pFunctionExitNodes.at(0)!.function;

        // Define current function as "generated" to preempty skip endless recursion.
        // This buffer is passthough to all function generations by reference and is shared among them.
        pFunctionBuffer.add(lFunction);

        // Create an empty function result and store it directly. The reference will be filled later.
        const lFunctionResult: PotatnoCodeGeneratorFunctionResult<TProjectTypes> = new PotatnoCodeGeneratorFunctionResult(lFunction);
        lGeneratedFunctions.push(lFunctionResult);

        // Walk every requested exit node's subgraph (defaults to all of the function's exits) and attach the produced NodeResult.
        for (const lExitNode of pFunctionExitNodes) {
            const lGeneratedGraph: PotatnoCodeGeneratorNodeResult<TProjectTypes> = this.generateNodeCode(pPassData, lExitNode);
            lFunctionResult.addGraph(lGeneratedGraph);

            // Add each dependency into the task list.
            for (const lDependencyFunction of lGeneratedGraph.dependencies) {
                // Skip functions that already generated or are currently generating.
                if (pFunctionBuffer.has(lDependencyFunction)) {
                    continue;
                }

                // Start the generation of the dependency and their dependencies. Save the result. 
                lGeneratedFunctions.push(...this.generateFunctionWithDependencies(pPassData, lDependencyFunction.getExitNodes(), pFunctionBuffer));
            }
        }

        // Reverse the output before returning to order the dependencies by ([No dependencies] ... [Required dependencies]).
        return lGeneratedFunctions.reverse();
    }

    /**
     * Walk one subgraph and build the corresponding NodeResult.
     *
     * Constructs a cursor with a fresh top-level scope, pre-counts the value-producer consumers,
     * runs the backward walk, then assembles the NodeResult from the accumulated buffer and the discovered entry node.
     *
     * @param pPassData - Shared pass state.
     * @param pExitNode - The exit node anchoring the subgraph.
     * 
     * @returns A NodeResult capturing the subgraph's body code, entry/exit nodes, and function-call dependencies.
     */
    private generateNodeCode(pPassData: PotatnoCodeGeneratorPassData<TProjectTypes>, pExitNode: PotatnoDocumentNode<TProjectTypes>): PotatnoCodeGeneratorNodeResult<TProjectTypes> {
        // Build a fresh cursor with the top-level scope and a pass-wide dependencies accumulator.
        const lCursor: PotatnoCodeGeneratorPassCursor<TProjectTypes> = {
            dependencies: new Array<PotatnoDocumentFunction<TProjectTypes>>(),
            nodes: new Map<PotatnoDocumentNode<TProjectTypes>, string>(),
            ports: new Map<PotatnoDocumentPort<TProjectTypes>, string>(),
            scope: this.createScope(pExitNode, null)
        };

        // Walk the exit node. The walk returns the collected code and the entry node it reached.
        const lGenerationResult: PotatnoCodeGeneratorEmitResult<TProjectTypes> = this.walkBackward(pPassData, lCursor, pExitNode, null);

        // Compose the body code in execution order.
        const lBodyCode: string = lGenerationResult.codeOutput.join(' ');

        return new PotatnoCodeGeneratorNodeResult({
            bodyCode: lBodyCode,
            dependencies: lCursor.dependencies,
            entryNode: lGenerationResult.lastGeneratedNode,
            exitNode: pExitNode,
            // Copy current nodes and ports so the current scope cant be changed outside.
            nodeIds: new Map<PotatnoDocumentNode<TProjectTypes>, string>(lCursor.nodes),
            portValues: new Map<PotatnoDocumentPort<TProjectTypes>, string>(lCursor.ports)
        });
    }

    /**
     * Get a generated valueId from the pass counter to a document port.
     * Auto generates a new value id when none exists. 
     * 
     * @param pPassData - Shared pass state.
     * @param pCursor - The pass cursor.
     * @param pPort - Port the value id requested.
     * 
     * @returns the value id for a port.
     */
    private generatePortValue(pPassData: PotatnoCodeGeneratorPassData<TProjectTypes>, pCursor: PotatnoCodeGeneratorPassCursor<TProjectTypes>, pPort: PotatnoDocumentPort<TProjectTypes>): string {
        // Allocate a fresh valueId on first encounter in this graph.
        if (!pCursor.ports.has(pPort)) {
            // Convert label of port and index into a global valid value id. 
            const lCodeCompliantName: string = this.mProject.generator.value.name(pPort.label);
            const lCodeValueId: string = this.mProject.generator.value.id(lCodeCompliantName, pPassData.counter.portIndex++);

            // Save port with code id.
            pCursor.ports.set(pPort, lCodeValueId);
        }

        return pCursor.ports.get(pPort)!;
    }

    /**
     * Get the generated debug id for a document node.
     *
     * @param pPassData - Shared pass state.
     * @param pCursor - The pass cursor.
     * @param pNode - Node the id is requested for.
     *
     * @returns The generated eight-character uppercase hex id.
     */
    private getGeneratedNodeId(pPassData: PotatnoCodeGeneratorPassData<TProjectTypes>, pCursor: PotatnoCodeGeneratorPassCursor<TProjectTypes>, pNode: PotatnoDocumentNode<TProjectTypes>): string {
        // Allocate a fresh node id on first encounter in this graph.
        if (!pCursor.nodes.has(pNode)) {
            const lNewNodeIndex: number = ++pPassData.counter.nodeIndex;
            const lNodeId: string = lNewNodeIndex.toString(16).toUpperCase().padStart(8, '0');

            pCursor.nodes.set(pNode, lNodeId);
        }

        return pCursor.nodes.get(pNode)!;
    }

    /**
     * Collect the real upstream flow output ports connected to a node's flow inputs.
     * A single flow input may fan in from multiple upstream output ports, and each one may itself be on a chain of flow conjunctions that fan further out — those are resolved through to the real (non-conjunction) source ports.
     *
     * @param pNode - The node whose flow-input upstream source ports to collect.
     *
     * @returns the distinct list of upstream non-conjunction flow output ports. Each port's `.node` gives the upstream node.
     */
    private getNodesInputFlowPorts(pNode: PotatnoDocumentNode<TProjectTypes>): Array<PotatnoDocumentPort<TProjectTypes>> {
        const lResult: Array<PotatnoDocumentPort<TProjectTypes>> = new Array<PotatnoDocumentPort<TProjectTypes>>();

        for (const lInputPort of pNode.inputs.flow) {
            lResult.push(...this.resolveFlowConjunctions(lInputPort));
        }

        // Distinct list.
        return [...new Set(lResult)];
    }

    /**
     * Handle CASE C of the backward walk: the merge node has already been emitted by the caller; its code becomes the branch point's `next`.
     * Find the branch point, sub-walk each fan-in branch in a fresh scope, then emit the branch point with the per-branch inner code and shared next.
     *
     * @param pPassData - Shared pass state.
     * @param pCursor - The pass cursor.
     * @param pMergeNode - The already-emitted merge node that triggered the merge handling.
     * @param pPredecessorPorts - The merge's fan-in predecessor source ports (conjunction-resolved).
     * @param pMergeCode - The merge node's emitted code (with the downstream already folded into its inner), used as the branch point's `next`.
     *
     * @returns the branch point's emit result (= last node emitted here and the code collected in this call).
     */
    private handleFlowMerge(pPassData: PotatnoCodeGeneratorPassData<TProjectTypes>, pCursor: PotatnoCodeGeneratorPassCursor<TProjectTypes>, pMergeNode: PotatnoDocumentNode<TProjectTypes>, pPredecessorPorts: Array<PotatnoDocumentPort<TProjectTypes>>, pMergeCode: Array<string>): PotatnoCodeGeneratorEmitResult<TProjectTypes> {
        // The merge node's emitted code (with the downstream folded into its inner) is the branch point's `next`.
        const lNextCode: string = pMergeCode.join(' ');

        // Find the flow branching point of the flow merge.
        const lBranchPoint: PotatnoDocumentNode<TProjectTypes> = this.findBranchStartPoint(pMergeNode);

        // Run a sub-walk per fan-in branch into a fresh scope. Each sub-walk starts at the predecessor node with the predecessor port as its initial active port.
        const lFlowPortOutputCode: Record<string, string> = {};
        const lParentScope: PotatnoCodeGeneratorPassCursorScope<TProjectTypes> = pCursor.scope;
        try {
            for (const lPredecessorPort of pPredecessorPorts) {
                pCursor.scope = this.createScope(lPredecessorPort.node, lBranchPoint);

                // The walk ended on the branch point so the port it ended on is the branch point's flow output that initiated this branch.
                // Map this branch's code back to that output port. The end flow port MUST be set when a end node is specified in a walk.
                const lBranchEmitResult: PotatnoCodeGeneratorEmitResult<TProjectTypes> = this.walkBackward(pPassData, pCursor, lPredecessorPort.node, lBranchPoint);
                lFlowPortOutputCode[lBranchEmitResult.endFlowPort!.definitionId] = lBranchEmitResult.codeOutput.join(' ');
            }
        } finally {
            // Reset scope to old scope.
            pCursor.scope = lParentScope;
        }

        // 4. Emit the branch point with inner/next in its pContext. Its emit result is returned so the outer walk knows the last-emitted node and the merged code.
        return this.emitNode(pPassData, pCursor, lBranchPoint, lFlowPortOutputCode, lNextCode);
    }

    /**
     * Recursive walk backward through chains of flow-conjunction reroute nodes to find all upstream non-conjunction output ports.
     * A flow conjunction's input port may have multiple connections (fan-in), so resolution can yield multiple results.
     *
     * @param pInputPort - The input port whose upstream sources to resolve.
     *
     * @return The actual, conjunction-cleared upstream output flow ports.
     */
    private resolveFlowConjunctions(pInputPort: PotatnoDocumentPort<TProjectTypes>): Array<PotatnoDocumentPort<TProjectTypes>> {
        const lResults: Array<PotatnoDocumentPort<TProjectTypes>> = new Array<PotatnoDocumentPort<TProjectTypes>>();

        for (const lOutputPort of pInputPort.connectedPorts) {
            // Port does not belong to a conjunction. Push the real upstream output port directly.
            if (lOutputPort.node.definitionId !== FlowConjunctionNodeDefinition.DEFINITION_ID) {
                lResults.push(lOutputPort);
                continue;
            }

            // Read the conjunction's single flow input port. When it has no connection, the chain dead-ends here.
            const lInputPort: PotatnoDocumentPort<TProjectTypes> | undefined = lOutputPort.node.inputs.flow[0];
            if (!lInputPort || lInputPort.connectedPorts.size === 0) {
                continue;
            }

            // Read and recursive resolve incoming port.
            lResults.push(...this.resolveFlowConjunctions(lInputPort));
        }

        return lResults;
    }

    /**
     * Resolve a value input port to either the valueId of its connected source output or to an inline literal from port's direct value.
     * Decrements the producer's reference count when the producer is a pure-value node and triggers emission once the count hits zero.
     *
     * @param pPassData - Shared pass state.
     * @param pCursor - The pass cursor.
     * @param pInputPort - The value input port to resolve.
     *
     * @returns the resolved input surface plus the emit result of any pure-value producer generated while resolving (null when none was emitted).
     */
    private resolveInputValue(pPassData: PotatnoCodeGeneratorPassData<TProjectTypes>, pCursor: PotatnoCodeGeneratorPassCursor<TProjectTypes>, pInputPort: PotatnoDocumentPort<TProjectTypes>): PotatnoCodeGeneratorResolvedInput<TProjectTypes> {
        // Resolve the input ports connection.
        const lIncomingPort: PotatnoDocumentPort<TProjectTypes> | null = this.resolveValueConjunctions(pInputPort);

        // Unconnected. Return an inline literal from the project type's converter (or '' when the data type can't be resolved). No producer is emitted.
        if (!lIncomingPort) {
            if (this.mProject.types.isGenericType(pInputPort.dataType)) {
                throw new Exception(`Generic value inputs must be allways connected`, this);
            }

            return {
                inputPort: {
                    value: this.mProject.types.getType(pInputPort.dataType!).convert([...pInputPort.directValue]),
                    isDirectValue: true
                },
                emitResult: null
            };
        }

        // Connected. Walk through value conjunctions to the real producer's output port.
        const lProducerNode: PotatnoDocumentNode<TProjectTypes> = lIncomingPort.node;
        const lIsValueNode: boolean = !lProducerNode.hasFlowPorts;

        // If the producer is a pure-value node, tick its refcount. Emit on depletion.
        const lProducerEmit: PotatnoCodeGeneratorEmitResult<TProjectTypes> | null = (() => {
            if (!lProducerNode.hasFlowPorts) {
                if (pCursor.scope.emittedNodes.has(lProducerNode)) {
                    return null;
                }

                // Remaining in scope should allways be set otherwise something is broken in this code.
                let lRemaining: number = pCursor.scope.remaining.get(lProducerNode)!;

                // When the node has no flow ports, the node must be emitted immediately because value nodes are emitted front to back unless flow nodes.
                if (lIsValueNode) {
                    lRemaining = 0;
                }

                // Save remaining node encounter.
                pCursor.scope.remaining.set(lProducerNode, lRemaining);

                if (lRemaining <= 0) {
                    // Save node as already emitted so its not emitted again.       
                    pCursor.scope.emittedNodes.add(lProducerNode);

                    // Pure-value producer: no flow outputs, so no inner-by-port mapping required.
                    return this.emitNode(pPassData, pCursor, lProducerNode, {});
                }
            }

            return null;
        })();

        return {
            inputPort: {
                value: this.generatePortValue(pPassData, pCursor, lIncomingPort),
                isDirectValue: false
            },
            emitResult: lProducerEmit
        };
    }

    /**
     * Recursive walk backward through chains of value-conjunction reroute nodes to find the real upstream output port.
     * Value inputs are single-connection (per the value port rule), so the resolution always yields exactly one port.
     *
     * @param pInputPort - The input port with possible connections.
     *
     * @return The actual, conjunction-cleared upstream output value port.
     */
    private resolveValueConjunctions(pInputPort: PotatnoDocumentPort<TProjectTypes>): PotatnoDocumentPort<TProjectTypes> | null {
        // Check if input port has any connection.
        if (pInputPort.connectedPorts.size === 0) {
            return null;
        }

        // Get the first connection.
        const lIncommingConnection: PotatnoDocumentPort<TProjectTypes> = pInputPort.connectedPorts.values().next().value!;

        // Port does not belong to a conjunction. Return it.
        if (lIncommingConnection.node.definitionId !== ValueConjunctionNodeDefinition.DEFINITION_ID) {
            return lIncommingConnection;
        }

        // Read the conjunction's single value input port. When it has no connection, the chain dead-ends here.
        const lConjunctionInputPort: PotatnoDocumentPort<TProjectTypes> | undefined = lIncommingConnection.node.inputs.value[0];
        if (!lConjunctionInputPort || lConjunctionInputPort.connectedPorts.size === 0) {
            return null;
        }

        // Recurse with the single upstream output port the conjunction's input is connected to.
        return this.resolveValueConjunctions(lConjunctionInputPort);
    }

    /**
     * Iterative backward walk through a flow chain until no parent node is found or the end node is reached.
     * Emits each node while walking, including value nodes.
     * End node is excluded and not generated.
     *
     * @param pPassData - Shared pass state.
     * @param pCursor - The pass cursor.
     * @param pStartNode - The node the walk begins at.
     * @param pEndNode - Stop before advancing to this node (not emitted). Null at top-level.
     * @param pInitialActivePort - The start node's active flow output. Null at top-level.
     *
     * @returns the collected code and the last (most upstream) node generated.
     */
    private walkBackward(pPassData: PotatnoCodeGeneratorPassData<TProjectTypes>, pCursor: PotatnoCodeGeneratorPassCursor<TProjectTypes>, pStartNode: PotatnoDocumentNode<TProjectTypes>, pEndNode: PotatnoDocumentNode<TProjectTypes> | null): PotatnoCodeGeneratorEmitResult<TProjectTypes> {
        // Iteration values.
        let lEmitResult: PotatnoCodeGeneratorEmitResult<TProjectTypes> = {
            codeOutput: new Array<string>(),
            lastGeneratedNode: null!, // Must be handled.
            endFlowPort: null
        };
        let lActivePort: PotatnoDocumentPort<TProjectTypes> | null = null;

        // Skip when no node is iterated or the node is a ending node.
        let lCursorNode: PotatnoDocumentNode<TProjectTypes> | null = pStartNode;
        while (lCursorNode !== null && lCursorNode !== pEndNode) {
            // Emit the current node, folding the active port's downstream code into its inner.
            // Only the flow output that leads to the already-emitted downstream gets the collected code; other flow outputs get empty inner.
            const lFlowPortCodeOutput: Record<string, string> = {};
            if (lActivePort !== null) {
                // Write current code into flow port code output.
                lFlowPortCodeOutput[lActivePort.definitionId] = lEmitResult.codeOutput.join(' ');
                lEmitResult.codeOutput = new Array<string>();
            }

            // Emit the node and merge its code in front of the code collected so far.
            const lPreEmitCodeOutput: Array<string> = lEmitResult.codeOutput;
            lEmitResult = this.emitNode(pPassData, pCursor, lCursorNode, lFlowPortCodeOutput);
            lEmitResult.codeOutput = [...lEmitResult.codeOutput, ...lPreEmitCodeOutput];

            // Resolve flow-input predecessors of the emitted node and skip when on dead end.
            let lPredecessorPorts: Array<PotatnoDocumentPort<TProjectTypes>> = this.getNodesInputFlowPorts(lCursorNode);
            if (lPredecessorPorts.length === 0) {
                break;
            }

            // The just-emitted node is a merge point.
            if (lPredecessorPorts.length > 1) {
                lEmitResult = this.handleFlowMerge(pPassData, pCursor, lCursorNode, lPredecessorPorts, lEmitResult.codeOutput);

                // Advance past the merged flow by reading the flow ports of the last node that was emited by the merge.
                lPredecessorPorts = this.getNodesInputFlowPorts(lEmitResult.lastGeneratedNode);
            }

            // The predecessor port becomes its node's active port for the next emit.
            lActivePort = lPredecessorPorts[0] ?? null;
            lCursorNode = lActivePort?.node ?? null;
        }

        // There is something wrong when not a single node was walked.
        if (!lEmitResult.lastGeneratedNode) {
            throw new Exception(`Walk did not reach an entry node from exit "${pStartNode.label}".`, this);
        }

        // When an end node is set, it MUST be reached.
        if (pEndNode && lCursorNode !== pEndNode) {
            throw new Exception('Malformed graph. End node not reached', this);
        }

        // The current active port is also the end node.
        lEmitResult.endFlowPort = lActivePort;

        return lEmitResult;
    }
}

/**
 * Pass state shared across every walk in a single generation pass.
 */
type PotatnoCodeGeneratorPassData<TProjectTypes extends PotatnoProjectTypesDefinition> = {
    /**
     * Monotonic source of fresh valueId strings.
     */
    counter: {
        nodeIndex: number;
        portIndex: number;
    };

    /**
     * Forwarded to node code generators as pContext.debug. Set by the public entry point that started this pass.
     */
    debug: boolean;

    /**
     * Per-function cache of node-definition lookups, keyed by document function and then by definition id.
     */
    nodeDefinitions: Map<PotatnoDocumentFunction<TProjectTypes>, Map<string, PotatnoNodeDefinition<TProjectTypes>>>;
};

/**
 * Pass-level state threaded through a single backward walk.
 *
 * The `scope` slot is swapped per backward walk (one per top-level call, plus one per sub-walk spawned at a merge).
 * Everything else is shared across all scopes within a single walk.
 */
type PotatnoCodeGeneratorPassCursor<TProjectTypes extends PotatnoProjectTypesDefinition> = {
    /**
     * Dependent document functions discovered during the walk via PotatnoFunctionNodeDefinition usages.
     * Sub-walks share the same array. The generation of these dependency functions is deferred to generateAllDependencies; the walker only records appearance order here.
     */
    dependencies: Array<PotatnoDocumentFunction<TProjectTypes>>;

    /**
     * Generated debug node ids discovered during the walk.
     */
    nodes: Map<PotatnoDocumentNode<TProjectTypes>, string>;

    /**
     * Generated port values discovered during the walk.
     */
    ports: Map<PotatnoDocumentPort<TProjectTypes>, string>;

    /**
     * The current scope. Replaced when entering a sub-walk and restored when the sub-walk returns.
     */
    scope: PotatnoCodeGeneratorPassCursorScope<TProjectTypes>;
};

/**
 * State scoped to one backward walk frame.
 */
type PotatnoCodeGeneratorPassCursorScope<TProjectTypes extends PotatnoProjectTypesDefinition> = {
    /**
     * Pure-value Nodes emitted in this scope.
     */
    emittedNodes: Set<PotatnoDocumentNode<TProjectTypes>>;

    /**
     * Reference count for each pure-value producer used in this scope.
     * Initialised by countNodeEncounter. Decremented in resolveInputValue as nodes consume pure values.
     */
    remaining: Map<PotatnoDocumentNode<TProjectTypes>, number>;
};

/**
 * Code emitted by a single walk step, sub-walk, or merge handler.
 * Returned up the call chain so callers can merge fragments together instead of sharing a mutable buffer.
 */
type PotatnoCodeGeneratorEmitResult<TProjectTypes extends PotatnoProjectTypesDefinition> = {
    /**
     * Emitted code fragments in execution order (front = earliest).
     */
    codeOutput: Array<string>;

    /**
     * The last node generated in this emit (the most upstream node of a walk, or the emitted node itself).
     */
    lastGeneratedNode: PotatnoDocumentNode<TProjectTypes>;

    /**
     * The flow-output port the walk or emit ended on.
     */
    endFlowPort: PotatnoDocumentPort<TProjectTypes> | null;
};

/**
 * Result of resolving a single value input port.
 */
type PotatnoCodeGeneratorResolvedInput<TProjectTypes extends PotatnoProjectTypesDefinition> = {
    /**
     * The resolved input surface handed to the node code generator (value id or inline literal).
     */
    inputPort: PotatnoCodeGeneratorInputPort;

    /**
     * Emit result of the pure-value producer generated while resolving this input, or null when none was emitted.
     */
    emitResult: PotatnoCodeGeneratorEmitResult<TProjectTypes> | null;
};
