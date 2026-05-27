import { Exception } from '@kartoffelgames/core';
import type { PotatnoDocumentFunction } from '../document/potatno-document-function.ts';
import type { PotatnoDocumentNode } from '../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../document/potatno-document-port.ts';
import type { PotatnoDocument } from '../document/potatno-document.ts';
import { FlowConjunctionNodeDefinition } from '../project/node_definition/potatno-flow-conjunction-node-definition.ts';
import { PotatnoFunctionNodeDefinition } from '../project/node_definition/potatno-function-node-definition.ts';
import { type PotatnoCodeGeneratorInputPort, type PotatnoCodeGeneratorOutputPort, PotatnoNodeDefinition, type PotatnoNodeDefinitionGeneratorContext } from '../project/node_definition/potatno-node-definition.ts';
import { ValueConjunctionNodeDefinition } from '../project/node_definition/potatno-value-conjunction-node-definition.ts';
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
    public generateDocument(pDocument: PotatnoDocument<TProject>, pDebug: boolean = false): PotatnoCodeGeneratorDocumentResult<TProject> {
        // Locate the entry-point function (the system function in the document).
        const lEntryPointFunction: PotatnoDocumentFunction<TProject> | undefined = [...pDocument.functions].find((pFunction) => {
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
    public generateFunction(pFunction: PotatnoDocumentFunction<TProject>, pDebug: boolean = false): PotatnoCodeGeneratorDocumentResult<TProject> {
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
    public generateNode(pExitNode: PotatnoDocumentNode<TProject>, pDebug: boolean = false): PotatnoCodeGeneratorDocumentResult<TProject> {
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
    private buildDocumentResult(pDocument: PotatnoDocument<TProject>, pExitNodes: Array<PotatnoDocumentNode<TProject>>, pDebug: boolean): PotatnoCodeGeneratorDocumentResult<TProject> {
        const lPassData: PotatnoCodeGeneratorPassData<TProject> = {
            counter: { valueId: 0 },
            debug: pDebug,
            nodeDefinitions: new Map<PotatnoDocumentFunction<TProject>, Map<string, PotatnoNodeDefinition<TProject>>>()
        };

        // Generate everything. The last entry is the requested entry function result.
        const lFunctionGenerationResults: Array<PotatnoCodeGeneratorFunctionResult<TProject>> = this.generateFunctionWithDependencies(lPassData, pExitNodes, new Set<PotatnoDocumentFunction<TProject>>());
        const lEntryPointResult: PotatnoCodeGeneratorFunctionResult<TProject> = lFunctionGenerationResults.shift()!;

        return new PotatnoCodeGeneratorDocumentResult(pDocument, lEntryPointResult, lFunctionGenerationResults);
    }

    /**
     * Recursive generate code for the starting exit nodes.
     * After the initial generation the exit nodes dependencies get generated.
     * 
     * @param pPassData - Shared pass state (counter, debug).
     * @param pFunctionExitNodes - Staring nodes of the first function that should be generated. 
     */
    private generateFunctionWithDependencies(pPassData: PotatnoCodeGeneratorPassData<TProject>, pFunctionExitNodes: Array<PotatnoDocumentNode<TProject>>, pFunctionBuffer: Set<PotatnoDocumentFunction<TProject>>): Array<PotatnoCodeGeneratorFunctionResult<TProject>> {
        // Result list of generated functions.
        const lGeneratedFunctions: Array<PotatnoCodeGeneratorFunctionResult<TProject>> = new Array<PotatnoCodeGeneratorFunctionResult<TProject>>();

        // Validate that something has been generated.
        if (pFunctionExitNodes.length === 0) {
            return lGeneratedFunctions;
        }

        // Read the document function by looking at the first exit node. 
        const lFunction: PotatnoDocumentFunction<TProject> = pFunctionExitNodes.at(0)!.function;

        // Define current function as "generated" to preempty skip endless recursion.
        // This buffer is passthough to all function generations by reference and is shared among them.
        pFunctionBuffer.add(lFunction);

        // Create an empty function result and store it directly. The reference will be filled later.
        const lFunctionResult: PotatnoCodeGeneratorFunctionResult<TProject> = new PotatnoCodeGeneratorFunctionResult(lFunction);
        lGeneratedFunctions.push(lFunctionResult);

        // Walk every requested exit node's subgraph (defaults to all of the function's exits) and attach the produced NodeResult.
        for (const lExitNode of pFunctionExitNodes) {
            const lGeneratedGraph: PotatnoCodeGeneratorNodeResult<TProject> = this.generateNodeCode(pPassData, lExitNode);
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
    private generateNodeCode(pPassData: PotatnoCodeGeneratorPassData<TProject>, pExitNode: PotatnoDocumentNode<TProject>): PotatnoCodeGeneratorNodeResult<TProject> {
        // Build a fresh cursor with the top-level scope and a pass-wide dependencies accumulator.
        const lCursor: PotatnoCodeGeneratorPassCursor<TProject> = {
            dependencies: new Array<PotatnoDocumentFunction<TProject>>(),
            scope: this.createScope(pExitNode, null)
        };

        // Walk the exit node and retrive the starting node in this process.
        const lEntryNode: PotatnoDocumentNode<TProject> = this.walkBackward(pPassData, lCursor, pExitNode, null);

        // Compose the body code in execution order. The buffer accumulates code in REVERSE execution order via push, so we reverse before joining.
        const lBodyCode: string = lCursor.scope.codeOutput.join(' ');

        return new PotatnoCodeGeneratorNodeResult({
            bodyCode: lBodyCode,
            dependencies: lCursor.dependencies,
            entryNode: lEntryNode,
            exitNode: pExitNode,

            // Copy current value ids so the current scope cant be changed outside.
            portValueIds: new Map<PotatnoDocumentPort<TProject>, string>(lCursor.scope.valueIds)
        });
    }

    /**
     * Construct a fresh scope ready to be used by a backward walk.
     *
     * @param pStartNode - The node the walk will start from.
     * @param pStopNode - The walk's stop sentinel (null at top-level).
     */
    private createScope(pStartNode: PotatnoDocumentNode<TProject>, pStopNode: PotatnoDocumentNode<TProject> | null): PotatnoCodeGeneratorPassCursorScope<TProject> {
        return {
            valueIds: new Map<PotatnoDocumentPort<TProject>, string>(),
            remaining: this.countNodeEncounter(pStartNode, pStopNode),
            codeOutput: new Array<string>()
        };
    }

    /**
     * Resolve a value input port to either the valueId of its connected source output or to an inline literal from port's direct value.
     * Decrements the producer's reference count when the producer is a pure-value node and triggers emission once the count hits zero.
     *
     * @param pPassData - Shared pass state.
     * @param pCursor - The pass cursor.
     * @param pInputPort - The value input port to resolve.
     * 
     * @returns the value id or the actual value for a input port.
     */
    private resolveValueInput(pPassData: PotatnoCodeGeneratorPassData<TProject>, pCursor: PotatnoCodeGeneratorPassCursor<TProject>, pInputPort: PotatnoDocumentPort<TProject>): PotatnoCodeGeneratorInputPort {
        // Resolve the input ports connection.
        const lIncomingPort: PotatnoDocumentPort<TProject> | null = this.resolveValueConjunctions(pInputPort);

        // Unconnected. Return an inline literal from the project type's converter (or '' when the data type can't be resolved).
        if (!lIncomingPort) {
            if (this.mProject.types.isGenericType(pInputPort.dataType)) {
                throw new Exception(`Generic value inputs must be allways connected`, this);
            }

            return {
                valueId: this.mProject.types.getType(pInputPort.dataType).convert([...pInputPort.directValue]),
                isDirectValue: true
            };
        }

        // Connected. Walk through value conjunctions to the real producer's output port.
        const lProducerNode: PotatnoDocumentNode<TProject> = lIncomingPort.node;

        // If the producer is a pure-value node, tick its refcount. Emit on depletion.
        if (!lProducerNode.hasFlowPorts) {
            // Remaining in scope should allways be set otherwise something is broken in this code.
            const lRemaining: number = pCursor.scope.remaining.get(lProducerNode)!;
            pCursor.scope.remaining.set(lProducerNode, lRemaining - 1);

            if (lRemaining <= 1) {
                // Pure-value producer: no flow outputs, so no inner-by-port mapping required.
                this.emitNode(pPassData, pCursor, lProducerNode, {});
            }
        }

        return {
            valueId: this.getPortValueId(pPassData, pCursor, lIncomingPort),
            isDirectValue: false
        };
    }

    /**
     * Get a valueId from the pass counter to a document port.
     * Auto generates a new value id when none exists. 
     * 
     * @param pPassData - Shared pass state.
     * @param pCursor - The pass cursor.
     * @param pPort - Port the value id requested.
     * 
     * @returns the value id for a port.
     */
    private getPortValueId(pPassData: PotatnoCodeGeneratorPassData<TProject>, pCursor: PotatnoCodeGeneratorPassCursor<TProject>, pPort: PotatnoDocumentPort<TProject>): string {
        // Allocate a fresh valueId on first encounter in this scope.
        if (!pCursor.scope.valueIds.has(pPort)) {
            pCursor.scope.valueIds.set(pPort, `v_${pPassData.counter.valueId++}`);
        }

        return pCursor.scope.valueIds.get(pPort)!;
    }

    /**
     * Collect the real upstream flow output ports connected to a node's flow inputs.
     * A single flow input may fan in from multiple upstream output ports, and each one may itself be on a chain of flow conjunctions that fan further out — those are resolved through to the real (non-conjunction) source ports.
     *
     * @param pNode - The node whose flow-input upstream source ports to collect.
     *
     * @returns the distinct list of upstream non-conjunction flow output ports. Each port's `.node` gives the upstream node.
     */
    private getNodesInputFlowPorts(pNode: PotatnoDocumentNode<TProject>): Array<PotatnoDocumentPort<TProject>> {
        const lResult: Array<PotatnoDocumentPort<TProject>> = new Array<PotatnoDocumentPort<TProject>>();

        for (const lInputPort of pNode.inputs.flow) {
            lResult.push(...this.resolveFlowConjunctions(lInputPort));
        }

        // Distinct list.
        return [...new Set(lResult)];
    }

    /**
     * Recursive walk backward through chains of flow-conjunction reroute nodes to find all upstream non-conjunction output ports.
     * A flow conjunction's input port may have multiple connections (fan-in), so resolution can yield multiple results.
     *
     * @param pInputPort - The input port whose upstream sources to resolve.
     *
     * @return The actual, conjunction-cleared upstream output flow ports.
     */
    private resolveFlowConjunctions(pInputPort: PotatnoDocumentPort<TProject>): Array<PotatnoDocumentPort<TProject>> {
        const lResults: Array<PotatnoDocumentPort<TProject>> = new Array<PotatnoDocumentPort<TProject>>();

        for (const lOutputPort of pInputPort.connectedPorts) {
            // Port does not belong to a conjunction. Push the real upstream output port directly.
            if (lOutputPort.node.definitionId !== FlowConjunctionNodeDefinition.DEFINITION_ID) {
                lResults.push(lOutputPort);
                continue;
            }

            // Read the conjunction's single flow input port. When it has no connection, the chain dead-ends here.
            const lInputPort: PotatnoDocumentPort<TProject> | undefined = lOutputPort.node.inputs.flow[0];
            if (!lInputPort || lInputPort.connectedPorts.size === 0) {
                continue;
            }

            // Read and recursive resolve incoming port.
            lResults.push(...this.resolveFlowConjunctions(lInputPort));
        }

        return lResults;
    }

    /**
     * Recursive walk backward through chains of value-conjunction reroute nodes to find the real upstream output port.
     * Value inputs are single-connection (per the value port rule), so the resolution always yields exactly one port.
     *
     * @param pInputPort - The input port with possible connections.
     *
     * @return The actual, conjunction-cleared upstream output value port.
     */
    private resolveValueConjunctions(pInputPort: PotatnoDocumentPort<TProject>): PotatnoDocumentPort<TProject> | null {
        // Check if input port has any connection.
        if (pInputPort.connectedPorts.size === 0) {
            return null;
        }

        // Get the first connection.
        const lIncommingConnection: PotatnoDocumentPort<TProject> = pInputPort.connectedPorts.values().next().value!;

        // Port does not belong to a conjunction. Return it.
        if (lIncommingConnection.node.definitionId !== ValueConjunctionNodeDefinition.DEFINITION_ID) {
            return lIncommingConnection;
        }

        // Read the conjunction's single value input port. When it has no connection, the chain dead-ends here.
        const lConjunctionInputPort: PotatnoDocumentPort<TProject> | undefined = lIncommingConnection.node.inputs.value[0];
        if (!lConjunctionInputPort || lConjunctionInputPort.connectedPorts.size === 0) {
            return null;
        }

        // Recurse with the single upstream output port the conjunction's input is connected to.
        return this.resolveValueConjunctions(lConjunctionInputPort);
    }

    /**
     * Pass that counts each encountered node, starting at a root node.
     *
     * @param pStartNode - The starting node (the scope's exit / fan-in predecessor).
     * @param pStopNode - When set, traversal stops at this node (used by sub-walks to bound their scope to the branch).
     * 
     * @returns the mapping between the document nodes and the encounter counter.
     */
    private countNodeEncounter(pStartNode: PotatnoDocumentNode<TProject>, pStopNode: PotatnoDocumentNode<TProject> | null): Map<PotatnoDocumentNode<TProject>, number> {
        const lRemaining: Map<PotatnoDocumentNode<TProject>, number> = new Map<PotatnoDocumentNode<TProject>, number>();

        const lCheckedNodes: Set<PotatnoDocumentNode<TProject>> = new Set<PotatnoDocumentNode<TProject>>();
        const lNodeTasks: Array<PotatnoDocumentNode<TProject>> = new Array<PotatnoDocumentNode<TProject>>(pStartNode);
        while (lNodeTasks.length > 0) {
            // Get next flow node task from stack. Skip if node should not be checked or the node was already checked.
            const lNode: PotatnoDocumentNode<TProject> = lNodeTasks.pop()!;

            // Count any incomming connection, even when a node port has multiple connections to the same node.
            lRemaining.set(lNode, (lRemaining.get(lNode) ?? 0) + 1);

            // Skip on stop node or when node was already marched.
            if (lNode === pStopNode || lCheckedNodes.has(lNode)) {
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
                const lIncomingValuePort: PotatnoDocumentPort<TProject> | null = this.resolveValueConjunctions(lInputValuePort);
                if (lIncomingValuePort) {
                    lNodeTasks.push(lIncomingValuePort.node);
                }
            }
        }

        return lRemaining;
    }



















    /**
     * Find which flow output port on the branch point ultimately reaches pFirstNode (the first node executed after the branch point in the branch).
     *
     * Walks every flow output of the branch point forward through flow-conjunction reroutes and returns the first output whose downstream resolves to pFirstNode.
     * Flow conjunctions have exactly one flow output that connects to exactly one downstream flow input, so the forward walk through them is unambiguous.
     *
     * @param pBranchPoint - The branch point node.
     * @param pFirstNode - The first execution-order node after the branch point in some branch (or null when the sub-walk emitted nothing).
     */
    private findBranchOutputPortForFirstNode(pBranchPoint: PotatnoDocumentNode<TProject>, pFirstNode: PotatnoDocumentNode<TProject> | null): PotatnoDocumentPort<TProject> | null {
        if (!pFirstNode) {
            return null;
        }

        for (const lOutputPort of pBranchPoint.outputs.flow) {
            for (const lConnectedInput of lOutputPort.connectedPorts) {
                // Walk forward through any chain of flow-conjunction reroutes to reach the real downstream node. Flow conjunctions only have one flow output, which always points at the next node in the chain.
                let lDownstreamNode: PotatnoDocumentNode<TProject> = lConnectedInput.node;
                while (lDownstreamNode.definitionId === FlowConjunctionNodeDefinition.DEFINITION_ID) {
                    const lConjunctionOutput: PotatnoDocumentPort<TProject> | undefined = lDownstreamNode.outputs.flow[0];
                    if (!lConjunctionOutput || lConjunctionOutput.connectedPorts.size === 0) {
                        throw new Exception('Conjunction nodes must have a valid input and output connection', this);
                    }
                    lDownstreamNode = lConjunctionOutput.connectedPorts.values().next().value!.node;
                }

                if (lDownstreamNode === pFirstNode) {
                    return lOutputPort;
                }
            }
        }

        return null;
    }


    /**
     * Tagged backward BFS to find the branch point that ultimately fans into pMergeNode.
     *
     * Each fan-in predecessor seeds its own tag. Tags propagate as the search walks backward through flow inputs.
     * The first node whose accumulated tag set covers all branches is the branch point.
     *
     * @param pMergeNode - A node with ≥2 flow-input connections.
     */
    private findBranchPoint(pMergeNode: PotatnoDocumentNode<TProject>): PotatnoDocumentNode<TProject> {
        const lPredecessorPorts: Array<PotatnoDocumentPort<TProject>> = this.getNodesInputFlowPorts(pMergeNode);
        const lTotalTags: number = lPredecessorPorts.length;

        const lTagsByNode: Map<PotatnoDocumentNode<TProject>, Set<number>> = new Map<PotatnoDocumentNode<TProject>, Set<number>>();
        const lQueue: Array<PotatnoDocumentNode<TProject>> = new Array<PotatnoDocumentNode<TProject>>();

        // Seed: one tag per fan-in predecessor.
        for (let lIndex: number = 0; lIndex < lPredecessorPorts.length; lIndex++) {
            const lPredecessorNode: PotatnoDocumentNode<TProject> = lPredecessorPorts[lIndex]!.node;
            lTagsByNode.set(lPredecessorNode, new Set<number>([lIndex]));
            lQueue.push(lPredecessorNode);
        }

        while (lQueue.length > 0) {
            const lNode: PotatnoDocumentNode<TProject> = lQueue.shift()!;
            const lTags: Set<number> = lTagsByNode.get(lNode)!;

            // Branch point found if this node has accumulated all tags.
            if (lTags.size === lTotalTags) {
                return lNode;
            }

            // Propagate tags to flow-input predecessors.
            for (const lFlowPredecessorPort of this.getNodesInputFlowPorts(lNode)) {
                const lFlowPredecessorNode: PotatnoDocumentNode<TProject> = lFlowPredecessorPort.node;
                const lPredecessorTags: Set<number> = lTagsByNode.get(lFlowPredecessorNode) ?? new Set<number>();
                let lAdded: boolean = false;
                for (const lTag of lTags) {
                    if (!lPredecessorTags.has(lTag)) {
                        lPredecessorTags.add(lTag);
                        lAdded = true;
                    }
                }
                lTagsByNode.set(lFlowPredecessorNode, lPredecessorTags);
                if (lAdded) {
                    lQueue.push(lFlowPredecessorNode);
                }
            }
        }

        throw new Exception('No common branch point found for merge node.', this);
    }

    /**
     * Iterative backward walk through a flow chain.
     *
     * Owns cursor.scope.buffer for its frame. Appends what emit* helpers return.
     * Sub-walks at merge points get their own fresh scope swapped in temporarily and restored on return.
     *
     * Tracks the "active port" of the current cursor — the cursor's flow output port that leads (through any flow-conjunction chain) to the previously-emitted node downstream. That port becomes the single inner-by-port entry for the cursor's emit, so each flow output only receives the buffer code if it is genuinely the path the walk came from. Other flow outputs default to empty inner.
     *
     * @param pPassData - Shared pass state.
     * @param pCursor - The pass cursor.
     * @param pStartNode - The node the walk begins at.
     * @param pStopBefore - When set, the walk stops as soon as the cursor would advance to this node. The node is NOT emitted. Null at top-level so the walk runs until reaching a real entry node (CASE A).
     * @param pInitialActivePort - The active flow output port of pStartNode at the start of the walk. Used by sub-walks at merges to thread the merge-fan-in port into the predecessor's first emit. Null at top-level (the start node is a true exit with no downstream).
     *
     * @returns the last generated node.
     */
    private walkBackward(pPassData: PotatnoCodeGeneratorPassData<TProject>, pCursor: PotatnoCodeGeneratorPassCursor<TProject>, pStartNode: PotatnoDocumentNode<TProject>, pStopBefore: PotatnoDocumentNode<TProject> | null, pInitialActivePort: PotatnoDocumentPort<TProject> | null = null): PotatnoDocumentNode<TProject> {
        let lCursorNode: PotatnoDocumentNode<TProject> | null = pStartNode;
        let lActivePort: PotatnoDocumentPort<TProject> | null = pInitialActivePort;
        let lLastGeneratedNode: PotatnoDocumentNode<TProject> | null = null;

        while (lCursorNode !== null && lCursorNode !== pStopBefore) {
            // Resolve flow-input predecessors, skipping flow conjunctions on the way. Each result is a source flow output port on the upstream side.
            const lPredecessorPorts: Array<PotatnoDocumentPort<TProject>> = this.getNodesInputFlowPorts(lCursorNode);

            // CASE C: >1 predecessors. Cursor is a merge point.
            // handleMergeAndAdvance emits both the merge node and the branch point, and returns the branch point (= last emitted in this call).
            // The outer walk continues from the branch point's flow-input predecessor.
            if (lPredecessorPorts.length > 1) {
                lLastGeneratedNode = this.handleMergeAndAdvance(pPassData, pCursor, lCursorNode, lActivePort, lPredecessorPorts);
                const lBranchPointPredecessorPorts: Array<PotatnoDocumentPort<TProject>> = this.getNodesInputFlowPorts(lLastGeneratedNode);
                lActivePort = lBranchPointPredecessorPorts[0] ?? null;
                lCursorNode = lActivePort?.node ?? null;
                continue;
            }

            // CASE A (0 predecessors) and CASE B (1 predecessor) both emit the current node.
            // Pass the active port as the single inner-by-port entry — only the flow output that leads to the already-emitted downstream gets the buffer code; other flow outputs get empty inner.
            const lInnerByPort: Record<string, string> = {};
            if (lActivePort !== null) {
                lInnerByPort[lActivePort.definitionId] = pCursor.scope.codeOutput.join(' ');
            }
            lLastGeneratedNode = this.emitNode(pPassData, pCursor, lCursorNode, lInnerByPort);

            // CASE A: entry node or dead-end.
            if (lPredecessorPorts.length === 0) {
                break;
            }

            // CASE B: advance to the single predecessor. The predecessor port becomes its node's active port for the next emit.
            lActivePort = lPredecessorPorts[0]!;
            lCursorNode = lActivePort.node;
        }

        // There is something wrong when not a single node was walked.
        if (!lLastGeneratedNode) {
            throw new Exception(`Walk did not reach an entry node from exit "${pStartNode.label}".`, this);
        }

        return lLastGeneratedNode;
    }

    /**
     * Handle CASE C of the backward walk.
     *
     * Emits the merge node, snapshots the buffer as `next`, runs one sub-walk per fan-in branch into a fresh scope,
     * then emits the branch point with the per-branch inner strings and the shared next string pre-filled in its pContext.
     * The branch point is the last node emitted in this call and is returned so the outer walkBackward can track it as lLastGeneratedNode and compute the next cursor.
     *
     * @param pPassData - Shared pass state.
     * @param pCursor - The pass cursor.
     * @param pMergeNode - The cursor node that triggered the merge handling.
     * @param pMergeActivePort - The merge node's flow output port leading to the already-emitted downstream (null when the merge has no active downstream — e.g. top-of-walk merge).
     * @param pPredecessorPorts - The merge's fan-in predecessor source ports (already conjunction-resolved).
     *
     * @returns The branch point node (= last node emitted in this call).
     */
    private handleMergeAndAdvance(pPassData: PotatnoCodeGeneratorPassData<TProject>, pCursor: PotatnoCodeGeneratorPassCursor<TProject>, pMergeNode: PotatnoDocumentNode<TProject>, pMergeActivePort: PotatnoDocumentPort<TProject> | null, pPredecessorPorts: Array<PotatnoDocumentPort<TProject>>): PotatnoDocumentNode<TProject> {
        // 1. Emit the merge node first. It's a regular flow node with its own code.
        // Active port = the merge's flow output to the already-emitted downstream; only that port gets the buffer code as inner.
        const lMergeInnerByPort: Record<string, string> = {};
        if (pMergeActivePort !== null) {
            lMergeInnerByPort[pMergeActivePort.definitionId] = pCursor.scope.codeOutput.join(' ');
        }
        this.emitNode(pPassData, pCursor, pMergeNode, lMergeInnerByPort);

        // 2. Snapshot the buffer so far as the branch point's `next`. The buffer is in execution order (unshift), so a plain join produces the merged-tail string directly.
        const lNextCode: string = pCursor.scope.codeOutput.join(' ');
        pCursor.scope.codeOutput = new Array<string>();

        // 3. Find the branch point.
        const lBranchPoint: PotatnoDocumentNode<TProject> = this.findBranchPoint(pMergeNode);

        // 4. Run a sub-walk per fan-in branch into a fresh scope. Each sub-walk starts at the predecessor node with the predecessor port as its initial active port.
        const lInnerByPort: Record<string, string> = {};
        const lParentScope: PotatnoCodeGeneratorPassCursorScope<TProject> = pCursor.scope;
        try {
            for (const lPredecessorPort of pPredecessorPorts) {
                pCursor.scope = this.createScope(lPredecessorPort.node, lBranchPoint);
                const lLastGeneratedNode = this.walkBackward(pPassData, pCursor, lPredecessorPort.node, lBranchPoint, lPredecessorPort);

                // The sub-walk's first node (in execution order) is the one we stopped just-before-advancing-to-branchPoint.
                // Map it back to the branch point's flow output port that initiated this branch.
                const lBranchOutputPort: PotatnoDocumentPort<TProject> | null = this.findBranchOutputPortForFirstNode(lBranchPoint, lLastGeneratedNode); // TODO: Still seems broken
                const lBranchKey: string = lBranchOutputPort ? lBranchOutputPort.definitionId : lPredecessorPort.definitionId;
                lInnerByPort[lBranchKey] = pCursor.scope.codeOutput.join(' ');
            }
        } finally {
            // Reset scope to old scope.
            pCursor.scope = lParentScope;
        }

        // 5. Emit the branch point with inner/next in its pContext. Return it so the outer walk knows the last-emitted node.
        return this.emitNode(pPassData, pCursor, lBranchPoint, lInnerByPort, lNextCode);
    }

    /**
     * Build the node's PotatnoNodeDefinitionGeneratorContext, call its code generator, append the result to the current scope's buffer, and record the node as last-emitted.
     *
     * Callers are required to supply pInnerByPort. Every flow output port either gets the inner string explicitly mapped via pInnerByPort, or defaults to empty.
     * Callers that want the "current scope buffer" as a flow output's inner must compute it themselves and pass it in — emitNode never reads the buffer for the default.
     *
     * Function-call nodes (PotatnoFunctionNodeDefinition) record their target document function in the cursor's dependency list (not generated here).
     *
     * @param pPassData - Shared pass state.
     * @param pCursor - The pass cursor.
     * @param pNode - The node to emit code for.
     * @param pInnerByPort - Inner code per flow output port id.
     * @param pNextCode - Merged-tail code for a branching node. Defaults to empty.
     */
    private emitNode(pPassData: PotatnoCodeGeneratorPassData<TProject>, pCursor: PotatnoCodeGeneratorPassCursor<TProject>, pNode: PotatnoDocumentNode<TProject>, pInnerByPort: Record<string, string>, pNextCode?: string): PotatnoDocumentNode<TProject> {
        // Initialize missing node definition lookups for this function.
        if (!pPassData.nodeDefinitions.get(pNode.function)) {
            const lNodeLookup: Map<string, PotatnoNodeDefinition<TProject>> = new Map<string, PotatnoNodeDefinition<TProject>>();
            for (const lDefinition of pNode.function.nodeDefinitions) {
                lNodeLookup.set(lDefinition.id, lDefinition);
            }
            pPassData.nodeDefinitions.set(pNode.function, lNodeLookup);
        }

        // Resolve the live node definition for this node via the per-function cache.
        const lNodeDefinition: PotatnoNodeDefinition<TProject> | undefined = pPassData.nodeDefinitions.get(pNode.function)!.get(pNode.definitionId);
        if (!lNodeDefinition) {
            throw new Exception(`Node definition "${pNode.definitionId}" not found for node "${pNode.label}".`, this);
        }

        // Function-call nodes: record the target document function as a dependency. Duplicates inside a single NodeResult are harmless. The outer generateFunctionWithDependencies loop deduplicates via pFunctionBuffer.
        if (lNodeDefinition instanceof PotatnoFunctionNodeDefinition) {
            pCursor.dependencies.push(lNodeDefinition.function);
        }

        // Build the input port surfaces. Only value inputs make it into pContext.inputs.
        const lInputs: Record<string, PotatnoCodeGeneratorInputPort> = {};
        for (const lPort of pNode.inputs.value) {
            lInputs[lPort.definitionId] = this.resolveValueInput(pPassData, pCursor, lPort);
        }

        // Build the output port surfaces. Value outputs get freshly allocated valueIds. Flow outputs get the caller-supplied inner code, defaulting to empty when the port is not present in pInnerByPort.
        const lOutputs: Record<string, PotatnoCodeGeneratorOutputPort> = {};
        for (const lPort of pNode.outputs.list) {
            lOutputs[lPort.definitionId] = {
                valueId: this.getPortValueId(pPassData, pCursor, lPort),
                code: {
                    inner: lPort.portType === 'flow' ? (pInnerByPort[lPort.definitionId] ?? '') : ''
                }
            };
        }

        // Assemble the full context, invoke the node's code generator, append the produced code to the scope buffer and record the node as last-emitted.
        let lNodeCode: string = lNodeDefinition.codeGenerator({
            inputs: lInputs,
            outputs: lOutputs,
            code: { next: pNextCode ?? '' }
        });

        // Attach each input and output value id as hook after the generated code. But only on debug :)
        if (pPassData.debug) {
            lNodeCode += Object.values(lInputs).reduce((pCurrent, pNext) => {
                // Skip output of ports with no read value id.
                if(pNext.isDirectValue) {
                    return pCurrent;
                }

                return pCurrent + this.mProject.generator.hook(pNext.valueId);
            }, '');
            lNodeCode += Object.values(lOutputs).reduce((pCurrent, pNext) => {
                return pCurrent + this.mProject.generator.hook(pNext.valueId);
            }, '');
        }

        // Add the produced code at the buffer start. Because the walk is backward, the buffer is always in correct execution order.
        pCursor.scope.codeOutput.unshift(lNodeCode);

        return pNode;
    }
}

/**
 * Pass state shared across every walk in a single generation pass.
 */
type PotatnoCodeGeneratorPassData<TProject extends PotatnoProject> = {
    /**
     * Monotonic source of fresh valueId strings.
     */
    counter: {
        valueId: number;
    };

    /**
     * Forwarded to node code generators as pContext.debug. Set by the public entry point that started this pass.
     */
    debug: boolean;

    /**
     * Per-function cache of node-definition lookups, keyed by document function and then by definition id.
     */
    nodeDefinitions: Map<PotatnoDocumentFunction<TProject>, Map<string, PotatnoNodeDefinition<TProject>>>;
};

/**
 * Pass-level state threaded through a single backward walk.
 *
 * The `scope` slot is swapped per backward walk (one per top-level call, plus one per sub-walk spawned at a merge).
 * Everything else is shared across all scopes within a single walk.
 */
type PotatnoCodeGeneratorPassCursor<TProject extends PotatnoProject> = {
    /**
     * Dependent document functions discovered during the walk via PotatnoFunctionNodeDefinition usages.
     * Sub-walks share the same array. The generation of these dependency functions is deferred to generateAllDependencies; the walker only records appearance order here.
     */
    dependencies: Array<PotatnoDocumentFunction<TProject>>;

    /**
     * The current scope. Replaced when entering a sub-walk and restored when the sub-walk returns.
     */
    scope: PotatnoCodeGeneratorPassCursorScope<TProject>;
};

/**
 * State scoped to one backward walk frame.
 */
type PotatnoCodeGeneratorPassCursorScope<TProject extends PotatnoProject> = {
    /**
     * Output ports allocated WITHIN this scope, mapped to their valueIds.
     */
    valueIds: Map<PotatnoDocumentPort<TProject>, string>;

    /**
     * Refcount for each pure-value producer used in this scope.
     * Initialised by preCountConsumers. Decremented in resolveValueInput as flow nodes are emitted.
     */
    remaining: Map<PotatnoDocumentNode<TProject>, number>;

    /**
     * Backward buffer accumulating emitted code in correct execution order.
     */
    codeOutput: Array<string>;
};