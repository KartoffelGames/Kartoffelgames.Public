import { Exception } from '@kartoffelgames/core';
import type { PotatnoDocumentFunction } from '../document/potatno-document-function.ts';
import type { PotatnoDocumentNode } from '../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../document/potatno-document-port.ts';
import type { PotatnoDocument } from '../document/potatno-document.ts';
import { FlowConjunctionNodeDefinition } from '../project/node_definition/potatno-flow-conjunction-node-definition.ts';
import { PotatnoFunctionNodeDefinition } from '../project/node_definition/potatno-function-node-definition.ts';
import type { PotatnoCodeGeneratorInputPort, PotatnoCodeGeneratorOutputPort, PotatnoNodeDefinitionGeneratorContext } from '../project/node_definition/potatno-node-definition.ts';
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
        const lPassData: PotatnoCodeGeneratorPassData = {
            counter: { valueId: 0 },
            debug: pDebug
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
    private generateFunctionWithDependencies(pPassData: PotatnoCodeGeneratorPassData, pFunctionExitNodes: Array<PotatnoDocumentNode<TProject>>, pFunctionBuffer: Set<PotatnoDocumentFunction<TProject>>): Array<PotatnoCodeGeneratorFunctionResult<TProject>> {
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
    private generateNodeCode(pPassData: PotatnoCodeGeneratorPassData, pExitNode: PotatnoDocumentNode<TProject>): PotatnoCodeGeneratorNodeResult<TProject> {
        // Build a fresh cursor with the top-level scope and a pass-wide dependencies accumulator.
        const lCursor: PotatnoCodeGeneratorPassCursor<TProject> = {
            dependencies: new Array<PotatnoDocumentFunction<TProject>>(),
            scope: this.createScope(pExitNode, null)
        };

        // Walk the exit node and retrive the starting node in this process.
        const lEntryNode: PotatnoDocumentNode<TProject> = this.walkBackward(pPassData, lCursor, pExitNode, null);

        // Compose the body code in execution order. The buffer accumulates code in REVERSE execution order via push, so we reverse before joining.
        const lBodyCode: string = lCursor.scope.codeOutput.join('\n');

        return new PotatnoCodeGeneratorNodeResult({
            bodyCode: lBodyCode,
            dependencies: lCursor.dependencies,
            entryNode: lEntryNode,
            exitNode: pExitNode
        });
    }

    /**
     * Construct a fresh scope ready to be used by a backward walk.
     *
     * @param pStartNode - The node the walk will start from.
     * @param pStopBefore - The walk's stop sentinel (null at top-level).
     */
    private createScope(pStartNode: PotatnoDocumentNode<TProject>, pStopBefore: PotatnoDocumentNode<TProject> | null): PotatnoCodeGeneratorPassCursorScope<TProject> {
        return {
            valueIds: new Map<PotatnoDocumentPort<TProject>, string>(),
            remaining: this.preCountConsumers(pStartNode, pStopBefore),
            codeOutput: new Array<string>()
        };
    }

    /**
     * Iterative backward walk through a flow chain.
     *
     * Owns cursor.scope.buffer for its frame. Appends what emit* helpers return.
     * Sub-walks at merge points get their own fresh scope swapped in temporarily and restored on return.
     *
     * @param pPassData - Shared pass state.
     * @param pCursor - The pass cursor.
     * @param pStartNode - The node the walk begins at.
     * @param pStopBefore - When set, the walk stops as soon as the cursor would advance to this node. The node is NOT emitted. Null at top-level so the walk runs until reaching a real entry node (CASE A).
     *
     * @returns the last generated node. 
     */
    private walkBackward(pPassData: PotatnoCodeGeneratorPassData, pCursor: PotatnoCodeGeneratorPassCursor<TProject>, pStartNode: PotatnoDocumentNode<TProject>, pStopBefore: PotatnoDocumentNode<TProject> | null): PotatnoDocumentNode<TProject> {
        let lCursorNode: PotatnoDocumentNode<TProject> | null = pStartNode; // TODO: Remove the null when handleMergeAndAdvance is fixed.
        let lLastGeneratedNode: PotatnoDocumentNode<TProject> | null = null;

        while (lCursorNode !== null && lCursorNode !== pStopBefore) {
            // Resolve flow-input predecessors, skipping flow conjunctions on the way.
            const lPredecessors: Array<PotatnoDocumentPort<TProject>> = this.getFlowInputPredecessors(lCursorNode);

            // CASE C: >1 predecessors. Cursor is a merge point.
            if (lPredecessors.length > 1) {
                lCursorNode = this.handleMergeAndAdvance(pPassData, pCursor, lCursorNode, lPredecessors);
                lLastGeneratedNode = lCursorNode;
                continue;
            }

            // CASE A (0 predecessors) and CASE B (1 predecessor) both emit the current node.
            this.emitNode(pPassData, pCursor, lCursorNode);
            lLastGeneratedNode = lCursorNode;

            // CASE A: entry node or dead-end.
            if (lPredecessors.length === 0) {
                break;
            }

            // CASE B: advance to the single predecessor.
            lCursorNode = lPredecessors[0]!.node;
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
     * Returns the branch point's flow-input predecessor so the outer walk continues from there.
     *
     * @param pPassData - Shared pass state.
     * @param pCursor - The pass cursor.
     * @param pMergeNode - The cursor node that triggered the merge handling.
     * @param pPredecessorNodes - The merge's fan-in predecessors (already skipped through conjunctions).
     */
    private handleMergeAndAdvance(pPassData: PotatnoCodeGeneratorPassData, pCursor: PotatnoCodeGeneratorPassCursor<TProject>, pMergeNode: PotatnoDocumentNode<TProject>, pPredecessorNodes: Array<PotatnoDocumentPort<TProject>>): PotatnoDocumentNode<TProject> | null {
        // 1. Emit the merge node first. It's a regular flow node with its own code.
        this.emitNode(pPassData, pCursor, pMergeNode);

        // 2. Snapshot the buffer so far as the branch point's `next`. Reverse-then-join because the buffer is in backward order.
        const lNextCode: string = pCursor.scope.codeOutput.join('\n');
        pCursor.scope.codeOutput = new Array<string>();

        // 3. Find the branch point.
        const lBranchPoint: PotatnoDocumentNode<TProject> = this.findBranchPoint(pMergeNode);

        // 4. Run a sub-walk per fan-in branch into a fresh scope.
        const lInnerByPort: Record<string, string> = {};
        const lParentScope: PotatnoCodeGeneratorPassCursorScope<TProject> = pCursor.scope;
        for (const lPredecessorPort of pPredecessorNodes) {
            pCursor.scope = this.createScope(lPredecessorPort.node, lBranchPoint);
            const lLastGeneratedNode = this.walkBackward(pPassData, pCursor, lPredecessorPort.node, lBranchPoint);

            // The sub-walk's first node (in execution order) is the one we stopped just-before-advancing-to-branchPoint.
            // Map it back to the branch point's flow output port that initiated this branch.
            const lBranchOutputPort: PotatnoDocumentPort<TProject> | null = this.findBranchOutputPortForFirstNode(lBranchPoint, lLastGeneratedNode);
            const lBranchKey: string = lBranchOutputPort ? lBranchOutputPort.definitionId : lPredecessorPort.definitionId;
            lInnerByPort[lBranchKey] = pCursor.scope.codeOutput.join('\n');
        }
        pCursor.scope = lParentScope;

        // 5. Emit the branch point with inner/next in its pContext.
        this.emitNode(pPassData, pCursor, lBranchPoint, lInnerByPort, lNextCode);

        // 6. Continue from the branch point's flow-input predecessor.
        const lBranchPointPredecessors: Array<PotatnoDocumentPort<TProject>> = this.getFlowInputPredecessors(lBranchPoint);
        return lBranchPointPredecessors[0]?.node ?? null;
    }

    /**
     * Build the node's PotatnoNodeDefinitionGeneratorContext, call its code generator, append the result to the current scope's buffer, and record the node as last-emitted.
     *
     * For branching nodes (CASE C), callers pass pInnerByPort and pNextCode so the inner/next strings can be placed into the context.
     * For non-branching nodes (CASE A/B) the inner of each flow output defaults to the current scope buffer (everything accumulated downstream of this node so far) and next defaults to empty.
     *
     * Function-call nodes (PotatnoFunctionNodeDefinition) record their target document function in the cursor's dependency list (not generated here).
     *
     * @param pPassData - Shared pass state.
     * @param pCursor - The pass cursor.
     * @param pNode - The node to emit code for.
     * @param pInnerByPort - Inner code per flow output port id, when emitting a branching node. Optional.
     * @param pNextCode - Merged-tail code for a branching node. Optional.
     */
    private emitNode(pPassData: PotatnoCodeGeneratorPassData, pCursor: PotatnoCodeGeneratorPassCursor<TProject>, pNode: PotatnoDocumentNode<TProject>, pInnerByPort?: Record<string, string>, pNextCode?: string): void {
        // Resolve the live node definition for this node.
        const lNodeDefinition = pNode.function.nodeDefinitions.find((pDef) => pDef.id === pNode.definitionId);
        if (!lNodeDefinition) {
            throw new Exception(`Node definition "${pNode.definitionId}" not found for node "${pNode.label}".`, this);
        }

        // Function-call nodes: record the target document function as a dependency. The generation of dependency code is deferred to generateAllDependencies.
        if (lNodeDefinition instanceof PotatnoFunctionNodeDefinition) {
            const lTargetFunction: PotatnoDocumentFunction<TProject> = lNodeDefinition.function;
            if (!pCursor.dependencies.includes(lTargetFunction)) {
                pCursor.dependencies.push(lTargetFunction);
            }
        }

        // Build the input port surfaces. Only value inputs make it into pContext.inputs.
        const lInputs: Record<string, PotatnoCodeGeneratorInputPort> = {};
        for (const lPort of pNode.inputs.value) {
            lInputs[lPort.definitionId] = {
                valueId: this.resolveValueInput(pPassData, pCursor, lPort)
            };
        }

        // Default inner for flow outputs: everything we've accumulated downstream of this node in the current scope.
        const lDefaultInnerCode: string = pCursor.scope.codeOutput.join('\n');

        // Build the output port surfaces. Value outputs get freshly allocated valueIds. Flow outputs get inner code (overridden per port by pInnerByPort when emitting a branching node).
        const lOutputs: Record<string, PotatnoCodeGeneratorOutputPort> = {};
        for (const lPort of pNode.outputs.list) {
            if (lPort.portType === 'value') {
                if (!pCursor.scope.valueIds.has(lPort)) {
                    pCursor.scope.valueIds.set(lPort, this.allocateValueId(pPassData));
                }
                lOutputs[lPort.definitionId] = {
                    valueId: pCursor.scope.valueIds.get(lPort)!,
                    code: { inner: '' }
                };
                continue;
            }

            if (lPort.portType === 'flow') {
                const lInnerCode: string = pInnerByPort?.[lPort.definitionId] ?? lDefaultInnerCode;
                lOutputs[lPort.definitionId] = {
                    valueId: '',
                    code: { inner: lInnerCode }
                };
            }
        }

        // Assemble the full context, invoke the node's code generator, append the produced code to the scope buffer and record the node as last-emitted.
        const lContext: PotatnoNodeDefinitionGeneratorContext = {
            inputs: lInputs,
            outputs: lOutputs,
            debug: pPassData.debug,
            code: { next: pNextCode ?? '' }
        };

        // Add code at code buffer start. Because code generation is backwards.
        pCursor.scope.codeOutput.unshift(lNodeDefinition.codeGenerator(lContext));
    }

    /**
     * Resolve a value input port to either the valueId of its connected source output (allocating one if not yet present in this scope)
     * or to an inline literal derived from the unconnected port's direct value.
     *
     * Decrements the producer's reference count when the producer is a pure-value node and triggers emission once the count hits zero.
     * Placing the producer's `const v_N = ...;` line into the scope buffer at exactly the right backward position so it lands ABOVE its first execution-order consumer in the final output.
     *
     * @param pPassData - Shared pass state.
     * @param pCursor - The pass cursor.
     * @param pInputPort - The value input port to resolve.
     */
    private resolveValueInput(pPassData: PotatnoCodeGeneratorPassData, pCursor: PotatnoCodeGeneratorPassCursor<TProject>, pInputPort: PotatnoDocumentPort<TProject>): string {
        // Resolve the input ports connection.
        const lIncomingPort: PotatnoDocumentPort<TProject> | null = this.resolveValueConjunctions(pInputPort);

        // Unconnected. Return an inline literal from the project type's converter (or '' when the data type can't be resolved).
        if (!lIncomingPort) {
            const lDataType = pInputPort.dataType;
            if (this.mProject.types.isGenericType(lDataType)) {
                return '';
            }

            return this.mProject.types.getType(lDataType).convert([...pInputPort.directValue]);
        }

        // Connected. Walk through value conjunctions to the real producer's output port.
        const lProducerNode: PotatnoDocumentNode<TProject> = lIncomingPort.node;

        // Allocate a fresh valueId on first encounter in this scope.
        if (!pCursor.scope.valueIds.has(lIncomingPort)) {
            pCursor.scope.valueIds.set(lIncomingPort, this.allocateValueId(pPassData));
        }

        // If the producer is a pure-value node, tick its refcount. Emit on depletion.
        if (!lProducerNode.hasFlowPorts) {
            const lRemaining: number = (pCursor.scope.remaining.get(lProducerNode) ?? 0) - 1;
            pCursor.scope.remaining.set(lProducerNode, lRemaining);
            if (lRemaining === 0) {
                this.emitNode(pPassData, pCursor, lProducerNode);
            }
        }

        return pCursor.scope.valueIds.get(lIncomingPort)!;
    }

    /**
     * Allocate a fresh valueId from the pass counter.
     */
    private allocateValueId(pPassData: PotatnoCodeGeneratorPassData): string {
        return `v_${pPassData.counter.valueId++}`;
    }

    /**
     * Pre-pass that counts each pure-value producer's direct consumers within a given scope's reach.
     *
     * The result map is used by resolveValueInput to know when a producer has been referenced by every consumer in this scope and can therefore be emitted.
     *
     * Walks backward through flow inputs to collect every flow node reachable from pStartNode within pStopBefore,
     * then walks the value dependency closure from those flow nodes to collect every pure-value producer.
     * Finally counts each producer's references across both flow nodes and chained pure-value producers.
     *
     * @param pStartNode - The starting node (the scope's exit / fan-in predecessor).
     * @param pStopBefore - When set, traversal stops at this node (used by sub-walks to bound their scope to the branch).
     */
    private preCountConsumers(pStartNode: PotatnoDocumentNode<TProject>, pStopBefore: PotatnoDocumentNode<TProject> | null): Map<PotatnoDocumentNode<TProject>, number> {
        const lRemaining: Map<PotatnoDocumentNode<TProject>, number> = new Map<PotatnoDocumentNode<TProject>, number>();

        // Step 1: Collect every flow node reachable backward through flow inputs.
        const lFlowNodes: Set<PotatnoDocumentNode<TProject>> = new Set<PotatnoDocumentNode<TProject>>();
        const lFlowQueue: Array<PotatnoDocumentNode<TProject>> = [pStartNode];
        while (lFlowQueue.length > 0) {
            const lNode: PotatnoDocumentNode<TProject> = lFlowQueue.shift()!;
            if (lNode === pStopBefore || lFlowNodes.has(lNode)) {
                continue;
            }
            lFlowNodes.add(lNode);

            // Each flow input may have multiple connections (fan-in). Each connected source port may itself be on a chain of flow conjunctions that fan further out.
            for (const lInputPort of lNode.inputs.flow) {
                for (const lResolvedSourcePort of this.resolveFlowConjunctions(lInputPort)) {
                    lFlowQueue.push(lResolvedSourcePort.node);
                }
            }
        }

        // Step 2: Walk value-input edges to count consumer refs to each pure-value producer and transitively discover producer-to-producer chains.
        const lProducers: Set<PotatnoDocumentNode<TProject>> = new Set<PotatnoDocumentNode<TProject>>();
        const lProducerQueue: Array<PotatnoDocumentNode<TProject>> = new Array<PotatnoDocumentNode<TProject>>();
        const lCountAndDiscover = (pNode: PotatnoDocumentNode<TProject>): void => {
            for (const lInputPort of pNode.inputs.value) {
                // Resolve incomming ports.
                const lIncomingPort: PotatnoDocumentPort<TProject> | null = this.resolveValueConjunctions(lInputPort);
                if (!lIncomingPort) {
                    continue;
                }

                const lProducer: PotatnoDocumentNode<TProject> = lIncomingPort.node;
                if (lProducer.hasFlowPorts) {
                    continue;
                }

                lRemaining.set(lProducer, (lRemaining.get(lProducer) ?? 0) + 1);
                if (!lProducers.has(lProducer)) {
                    lProducers.add(lProducer);
                    lProducerQueue.push(lProducer);
                }
            }
        };
        for (const lFlowNode of lFlowNodes) {
            lCountAndDiscover(lFlowNode);
        }
        while (lProducerQueue.length > 0) {
            lCountAndDiscover(lProducerQueue.shift()!);
        }

        return lRemaining;
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
        const lPredecessorPorts: Array<PotatnoDocumentPort<TProject>> = this.getFlowInputPredecessors(pMergeNode);
        const lTotalTags: number = lPredecessorPorts.length;

        const lTagsByNode: Map<PotatnoDocumentNode<TProject>, Set<number>> = new Map<PotatnoDocumentNode<TProject>, Set<number>>();
        const lQueue: Array<PotatnoDocumentNode<TProject>> = new Array<PotatnoDocumentNode<TProject>>();

        // Seed: one tag per fan-in predecessor.
        for (let lIndex: number = 0; lIndex < lPredecessorPorts.length; lIndex++) {
            const lPredecessorPort: PotatnoDocumentPort<TProject> = lPredecessorPorts[lIndex]!;
            lTagsByNode.set(lPredecessorPort.node, new Set<number>([lIndex]));
            lQueue.push(lPredecessorPort.node);
        }

        while (lQueue.length > 0) {
            const lNode: PotatnoDocumentNode<TProject> = lQueue.shift()!;
            const lTags: Set<number> = lTagsByNode.get(lNode)!;

            // Branch point found if this node has accumulated all tags.
            if (lTags.size === lTotalTags) {
                return lNode;
            }

            // Propagate tags to flow-input predecessors.
            for (const lPredecessor of this.getFlowInputPredecessors(lNode)) {
                const lPredecessorTags: Set<number> = lTagsByNode.get(lPredecessor.node) ?? new Set<number>();
                let lAdded: boolean = false;
                for (const lTag of lTags) {
                    if (!lPredecessorTags.has(lTag)) {
                        lPredecessorTags.add(lTag);
                        lAdded = true;
                    }
                }
                lTagsByNode.set(lPredecessor.node, lPredecessorTags);
                if (lAdded) {
                    lQueue.push(lPredecessor.node);
                }
            }
        }

        throw new Exception('No common branch point found for merge node.', this);
    }

    /**
     * Collect a node's flow-input predecessors, walking through any flow-conjunction reroute nodes so the returned predecessors are always real (non-conjunction) nodes.
     * A single flow input may fan in from multiple upstream output ports, and each one may itself be on a chain of flow conjunctions that fan further out.
     *
     * @param pNode - The node whose predecessors to collect.
     * 
     * @returns all connected flow output ports.
     */
    private getFlowInputPredecessors(pNode: PotatnoDocumentNode<TProject>): Array<PotatnoDocumentPort<TProject>> {
        const lResult: Array<PotatnoDocumentPort<TProject>> = new Array<PotatnoDocumentPort<TProject>>();

        for (const lInputPort of pNode.inputs.flow) {
            lResult.push(...this.resolveFlowConjunctions(lInputPort));
        }

        return lResult;
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
                // Walk forward through any chain of flow-conjunction reroutes to reach the real downstream node.
                let lDownstreamNode: PotatnoDocumentNode<TProject> = lConnectedInput.node;
                while (lDownstreamNode.definitionId === FlowConjunctionNodeDefinition.DEFINITION_ID) {
                    // Conjunctions only have one output port. Read its single connection (if any) to advance forward. // TODO: What?? Conjunction...
                    const lConjunctionOutput: PotatnoDocumentPort<TProject> | undefined = lDownstreamNode.outputs.list.at(-1);
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
     * Recursive walk backward through chains of flow-conjunction reroute nodes to find all upstream non-conjunction output ports.
     * A flow conjunction's input port may have multiple connections (fan-in), so resolution can yield multiple results.
     *
     * @param pOutputPort - The candidate output port (may belong to a flow-conjunction node or a real node).
     *
     * @return The actual, conjunction-cleared upstream output flow ports.
     */
    private resolveFlowConjunctions(pInputPort: PotatnoDocumentPort<TProject>): Array<PotatnoDocumentPort<TProject>> {
        const lResults: Array<PotatnoDocumentPort<TProject>> = new Array<PotatnoDocumentPort<TProject>>();

        for (const lOutputPort of pInputPort.connectedPorts) {
            // Port does not belong to a conjunction. Just return it.
            if (lOutputPort.node.definitionId !== FlowConjunctionNodeDefinition.DEFINITION_ID) {
                lResults.push(lOutputPort);
                continue;
            }

            // Try to read the nodes first input port.
            // Conjuctions only have one in- and output port. When it has no connection, just throw.
            const lInputPort: PotatnoDocumentPort<TProject> | undefined = lOutputPort.node.inputs.flow.at(-1);
            if (!lInputPort || lInputPort.connectedPorts.size === 0) {
                continue;
            }

            // Read and recursive resolve all incoming ports.
            for (const lUpstreamOutputPort of lInputPort.connectedPorts) {
                lResults.push(...this.resolveFlowConjunctions(lUpstreamOutputPort));
            }
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

        // Try to read the nodes first input port.
        const lConjunctionInputPort: PotatnoDocumentPort<TProject> | undefined = lIncommingConnection.node.inputs.value.at(-1);
        if (!lConjunctionInputPort || lConjunctionInputPort.connectedPorts.size === 0) {
            return null;
        }

        // Recurse with the single upstream output port the conjunction's input is connected to.
        return this.resolveValueConjunctions(lConjunctionInputPort);
    }
}

/**
 * Pass state shared across every walk in a single generation pass.
 */
type PotatnoCodeGeneratorPassData = {
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