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
            counter: { valueIndex: 0 },
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

        // Walk the exit node. The walk returns the collected code and the entry node it reached.
        const lGenerationResult: PotatnoCodeGeneratorEmitResult<TProject> = this.walkBackward(pPassData, lCursor, pExitNode, null);

        // Compose the body code in execution order.
        const lBodyCode: string = lGenerationResult.codeOutput.join(' ');

        return new PotatnoCodeGeneratorNodeResult({
            bodyCode: lBodyCode,
            dependencies: lCursor.dependencies,
            entryNode: lGenerationResult.lastGeneratedNode,
            exitNode: pExitNode,

            // Copy current value ids so the current scope cant be changed outside.
            portValues: new Map<PotatnoDocumentPort<TProject>, string>(lCursor.scope.values)
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
            values: new Map<PotatnoDocumentPort<TProject>, string>(),
            remaining: this.countNodeEncounter(pStartNode, pStopNode)
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
     * @returns the resolved input surface plus the emit result of any pure-value producer generated while resolving (null when none was emitted).
     */
    private resolveInputValue(pPassData: PotatnoCodeGeneratorPassData<TProject>, pCursor: PotatnoCodeGeneratorPassCursor<TProject>, pInputPort: PotatnoDocumentPort<TProject>): PotatnoCodeGeneratorResolvedInput<TProject> {
        // Resolve the input ports connection.
        const lIncomingPort: PotatnoDocumentPort<TProject> | null = this.resolveValueConjunctions(pInputPort);

        // Unconnected. Return an inline literal from the project type's converter (or '' when the data type can't be resolved). No producer is emitted.
        if (!lIncomingPort) {
            if (this.mProject.types.isGenericType(pInputPort.dataType)) {
                throw new Exception(`Generic value inputs must be allways connected`, this);
            }

            return {
                inputPort: {
                    value: this.mProject.types.getType(pInputPort.dataType).convert([...pInputPort.directValue]),
                    isDirectValue: true
                },
                emitResult: null
            };
        }

        // Connected. Walk through value conjunctions to the real producer's output port.
        const lProducerNode: PotatnoDocumentNode<TProject> = lIncomingPort.node;

        // If the producer is a pure-value node, tick its refcount. Emit on depletion.
        let lProducerEmit: PotatnoCodeGeneratorEmitResult<TProject> | null = (() => {
            if (!lProducerNode.hasFlowPorts) {
                // Remaining in scope should allways be set otherwise something is broken in this code.
                const lRemaining: number = pCursor.scope.remaining.get(lProducerNode)!;
                pCursor.scope.remaining.set(lProducerNode, lRemaining - 1);

                if (lRemaining <= 1) {
                    // Pure-value producer: no flow outputs, so no inner-by-port mapping required.
                    return this.emitNode(pPassData, pCursor, lProducerNode, {});
                }
            }

            return null;
        })();


        return {
            inputPort: {
                value: this.getPortValue(pPassData, pCursor, lIncomingPort),
                isDirectValue: false
            },
            emitResult: lProducerEmit
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
    private getPortValue(pPassData: PotatnoCodeGeneratorPassData<TProject>, pCursor: PotatnoCodeGeneratorPassCursor<TProject>, pPort: PotatnoDocumentPort<TProject>): string {
        // Allocate a fresh valueId on first encounter in this scope.
        if (!pCursor.scope.values.has(pPort)) {
            pCursor.scope.values.set(pPort, this.mProject.generator.values.valueId(pPassData.counter.valueIndex++));
        }

        return pCursor.scope.values.get(pPort)!;
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
     * Iterative backward walk through a flow chain. Collects the emitted code for its frame and returns it as an emit result.
     * Each node's code is merged in front of the code collected so far, keeping the result in execution order.
     *
     * The "active port" is the cursor's flow output that leads to the already-emitted downstream node; only that port receives the collected code as its inner. Sub-walks at merges run in a fresh scope and return their own emit result.
     *
     * @param pPassData - Shared pass state.
     * @param pCursor - The pass cursor.
     * @param pStartNode - The node the walk begins at.
     * @param pStopBefore - Stop before advancing to this node (not emitted). Null at top-level.
     * @param pInitialActivePort - The start node's active flow output. Null at top-level.
     *
     * @returns the collected code and the last (most upstream) node generated.
     */
    private walkBackward(pPassData: PotatnoCodeGeneratorPassData<TProject>, pCursor: PotatnoCodeGeneratorPassCursor<TProject>, pStartNode: PotatnoDocumentNode<TProject>, pStopBefore: PotatnoDocumentNode<TProject> | null, pInitialActivePort: PotatnoDocumentPort<TProject> | null = null): PotatnoCodeGeneratorEmitResult<TProject> {
        let lCursorNode: PotatnoDocumentNode<TProject> | null = pStartNode;
        let lActivePort: PotatnoDocumentPort<TProject> | null = pInitialActivePort;
        let lLastGeneratedNode: PotatnoDocumentNode<TProject> | null = null;
        let lCodeOutput: Array<string> = new Array<string>();

        while (lCursorNode !== null) {
            // Skip on stop nodes.
            if (lCursorNode === pStopBefore) {
                break;
            }

            // Resolve flow-input predecessors, skipping flow conjunctions on the way. Each result is a source flow output port on the upstream side.
            const lPredecessorPorts: Array<PotatnoDocumentPort<TProject>> = this.getNodesInputFlowPorts(lCursorNode);

            // CASE C: >1 predecessors. Cursor is a merge point.
            // handleMergeAndAdvance emits both the merge node and the branch point and returns their combined emit result (= branch point as last node).
            // Its result replaces the accumulated code (the prior downstream is folded into the merge node's inner) and the outer walk continues from the branch point's flow-input predecessor.
            if (lPredecessorPorts.length > 1) {
                const lMergeResult: PotatnoCodeGeneratorEmitResult<TProject> = this.handleMergeAndAdvance(pPassData, pCursor, lCursorNode, lActivePort, lPredecessorPorts, lCodeOutput);
                lCodeOutput = lMergeResult.codeOutput;
                lLastGeneratedNode = lMergeResult.lastGeneratedNode;

                const lBranchPointPredecessorPorts: Array<PotatnoDocumentPort<TProject>> = this.getNodesInputFlowPorts(lLastGeneratedNode);
                lActivePort = lBranchPointPredecessorPorts[0] ?? null;
                lCursorNode = lActivePort?.node ?? null;
                continue;
            }

            // CASE A (0 predecessors) and CASE B (1 predecessor) both emit the current node.
            // Pass the active port as the single inner-by-port entry — only the flow output that leads to the already-emitted downstream gets the collected code; other flow outputs get empty inner.
            const lInnerByPort: Record<string, string> = {};
            if (lActivePort !== null) {
                lInnerByPort[lActivePort.definitionId] = lCodeOutput.join(' ');

                // The downstream code is now folded into the node's inner, so drop it before the node's own code is merged in front.
                lCodeOutput = new Array<string>();
            }

            // Emit the node and merge its code in front of the code collected so far.
            const lEmitResult: PotatnoCodeGeneratorEmitResult<TProject> = this.emitNode(pPassData, pCursor, lCursorNode, lInnerByPort);
            lCodeOutput = [...lEmitResult.codeOutput, ...lCodeOutput];
            lLastGeneratedNode = lEmitResult.lastGeneratedNode;

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

        return {
            codeOutput: lCodeOutput,
            lastGeneratedNode: lLastGeneratedNode
        };
    }

    /**
     * Find which of the branch point's flow outputs reaches pFirstNode, walking forward through any flow-conjunction reroutes.
     *
     * @param pBranchPoint - The branch point node.
     * @param pFirstNode - The first execution-order node after the branch point in a branch (null when the sub-walk emitted nothing).
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
     * Find the branch point that fans into pMergeNode via a tagged backward BFS: each fan-in predecessor seeds a tag,
     * tags propagate backward, and the first node accumulating every tag is the branch point.
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
     * Handle CASE C of the backward walk: emit the merge node (folding the downstream code into its inner) and use that as the branch point's `next`,
     * sub-walk each fan-in branch in a fresh scope, then emit the branch point with the per-branch inner code and shared next.
     *
     * @param pPassData - Shared pass state.
     * @param pCursor - The pass cursor.
     * @param pMergeNode - The cursor node that triggered the merge handling.
     * @param pMergeActivePort - The merge's flow output leading to the already-emitted downstream (null for a top-of-walk merge).
     * @param pPredecessorPorts - The merge's fan-in predecessor source ports (conjunction-resolved).
     * @param pDownstreamCode - The code collected downstream of the merge node, folded into the merge node's inner.
     *
     * @returns the branch point's emit result (= last node emitted here and the code collected in this call).
     */
    private handleMergeAndAdvance(pPassData: PotatnoCodeGeneratorPassData<TProject>, pCursor: PotatnoCodeGeneratorPassCursor<TProject>, pMergeNode: PotatnoDocumentNode<TProject>, pMergeActivePort: PotatnoDocumentPort<TProject> | null, pPredecessorPorts: Array<PotatnoDocumentPort<TProject>>, pDownstreamCode: Array<string>): PotatnoCodeGeneratorEmitResult<TProject> {
        // 1. Emit the merge node first. It's a regular flow node with its own code.
        // Active port = the merge's flow output to the already-emitted downstream; only that port gets the downstream code as inner.
        const lMergeInnerByPort: Record<string, string> = {};
        if (pMergeActivePort !== null) {
            lMergeInnerByPort[pMergeActivePort.definitionId] = pDownstreamCode.join(' ');
        }
        const lMergeEmitResult: PotatnoCodeGeneratorEmitResult<TProject> = this.emitNode(pPassData, pCursor, pMergeNode, lMergeInnerByPort);

        // 2. The merge node's emitted code (with the downstream folded into its inner) is the branch point's `next`.
        const lNextCode: string = lMergeEmitResult.codeOutput.join(' ');

        // 3. Find the branch point.
        const lBranchPoint: PotatnoDocumentNode<TProject> = this.findBranchPoint(pMergeNode);

        // 4. Run a sub-walk per fan-in branch into a fresh scope. Each sub-walk starts at the predecessor node with the predecessor port as its initial active port.
        const lInnerByPort: Record<string, string> = {};
        const lParentScope: PotatnoCodeGeneratorPassCursorScope<TProject> = pCursor.scope;
        try {
            for (const lPredecessorPort of pPredecessorPorts) {
                pCursor.scope = this.createScope(lPredecessorPort.node, lBranchPoint);
                const lBranchEmitResult: PotatnoCodeGeneratorEmitResult<TProject> = this.walkBackward(pPassData, pCursor, lPredecessorPort.node, lBranchPoint, lPredecessorPort);

                // The sub-walk's first node (in execution order) is the one we stopped just-before-advancing-to-branchPoint.
                // Map it back to the branch point's flow output port that initiated this branch.
                const lBranchOutputPort: PotatnoDocumentPort<TProject> | null = this.findBranchOutputPortForFirstNode(lBranchPoint, lBranchEmitResult.lastGeneratedNode); // TODO: Still seems broken
                const lBranchKey: string = lBranchOutputPort ? lBranchOutputPort.definitionId : lPredecessorPort.definitionId;
                lInnerByPort[lBranchKey] = lBranchEmitResult.codeOutput.join(' ');
            }
        } finally {
            // Reset scope to old scope.
            pCursor.scope = lParentScope;
        }

        // 5. Emit the branch point with inner/next in its pContext. Its emit result is returned so the outer walk knows the last-emitted node and the merged code.
        return this.emitNode(pPassData, pCursor, lBranchPoint, lInnerByPort, lNextCode);
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
     * @param pInnerByPort - Inner code per flow output port id.
     * @param pNextCode - Merged-tail code for a branching node. Defaults to empty.
     *
     * @returns this node's emit result (its code plus any value-producer code) with the node as last-generated.
     */
    private emitNode(pPassData: PotatnoCodeGeneratorPassData<TProject>, pCursor: PotatnoCodeGeneratorPassCursor<TProject>, pNode: PotatnoDocumentNode<TProject>, pInnerByPort: Record<string, string>, pNextCode?: string): PotatnoCodeGeneratorEmitResult<TProject> {
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
        // A pure-value producer resolved here hands back its own emit result; collect them in input order.
        const lInputs: Record<string, PotatnoCodeGeneratorInputPort> = {};
        const lProducerEmits: Array<PotatnoCodeGeneratorEmitResult<TProject>> = new Array<PotatnoCodeGeneratorEmitResult<TProject>>();
        for (const lPort of pNode.inputs.value) {
            const lResolvedInput: PotatnoCodeGeneratorResolvedInput<TProject> = this.resolveInputValue(pPassData, pCursor, lPort);
            lInputs[lPort.definitionId] = lResolvedInput.inputPort;

            if (lResolvedInput.emitResult !== null) {
                lProducerEmits.push(lResolvedInput.emitResult);
            }
        }

        // Build the output port surfaces. Value outputs get freshly allocated valueIds. Flow outputs get the caller-supplied inner code, defaulting to empty when the port is not present in pInnerByPort.
        const lOutputs: Record<string, PotatnoCodeGeneratorOutputPort> = {};
        for (const lPort of pNode.outputs.list) {
            lOutputs[lPort.definitionId] = {
                value: this.getPortValue(pPassData, pCursor, lPort),
                code: {
                    inner: lPort.portType === 'flow' ? (pInnerByPort[lPort.definitionId] ?? '') : ''
                }
            };
        }

        // Assemble the full context and invoke the node's code generator.
        let lNodeCode: string = lNodeDefinition.codeGenerator({
            inputs: lInputs,
            outputs: lOutputs,
            code: { next: pNextCode ?? '' }
        });

        // Attach each output value id as hook after the generated code. But only on debug :)
        if (pPassData.debug) {
            lNodeCode += Object.values(lOutputs).reduce((pCurrent, pNext) => {
                return pCurrent + this.mProject.generator.values.hook(pNext.value);
            }, '');
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
            lastGeneratedNode: pNode
        };
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
        valueIndex: number;
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
    values: Map<PotatnoDocumentPort<TProject>, string>;

    /**
     * Refcount for each pure-value producer used in this scope.
     * Initialised by preCountConsumers. Decremented in resolveValueInput as flow nodes are emitted.
     */
    remaining: Map<PotatnoDocumentNode<TProject>, number>;
};

/**
 * Code emitted by a single walk step, sub-walk, or merge handler.
 * Returned up the call chain so callers can merge fragments together instead of sharing a mutable buffer.
 */
type PotatnoCodeGeneratorEmitResult<TProject extends PotatnoProject> = {
    /**
     * Emitted code fragments in execution order (front = earliest).
     */
    codeOutput: Array<string>;

    /**
     * The last node generated in this emit (the most upstream node of a walk, or the emitted node itself).
     */
    lastGeneratedNode: PotatnoDocumentNode<TProject>;
};

/**
 * Result of resolving a single value input port.
 */
type PotatnoCodeGeneratorResolvedInput<TProject extends PotatnoProject> = {
    /**
     * The resolved input surface handed to the node code generator (value id or inline literal).
     */
    inputPort: PotatnoCodeGeneratorInputPort;

    /**
     * Emit result of the pure-value producer generated while resolving this input, or null when none was emitted.
     */
    emitResult: PotatnoCodeGeneratorEmitResult<TProject> | null;
};