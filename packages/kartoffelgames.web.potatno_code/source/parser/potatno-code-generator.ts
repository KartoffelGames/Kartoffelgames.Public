import { Exception } from '@kartoffelgames/core';
import type { PotatnoDocumentFunction } from '../document/potatno-document-function.ts';
import type { PotatnoDocumentNode } from '../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../document/potatno-document-port.ts';
import type { PotatnoDocument } from '../document/potatno-document.ts';
import { FlowConjunctionNodeDefinition } from '../project/node_definition/potatno-flow-conjunction-node-definition.ts';
import { PotatnoFunctionNodeDefinition } from '../project/node_definition/potatno-function-node-definition.ts';
import type { PotatnoCodeGeneratorInputPort, PotatnoCodeGeneratorOutputPort, PotatnoNodeDefinitionGeneratorContext } from '../project/node_definition/potatno-node-definition.ts';
import { ValueConjunctionNodeDefinition } from '../project/node_definition/potatno-value-conjunction-node-definition.ts';
import type { PotatnoFunctionDefinition } from '../project/potatno-function-definition.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';
import { PotatnoCodeGeneratorFunctionResult } from './potatno-code-generator-function-result.ts';
import { PotatnoCodeGeneratorGraph, type PotatnoCodeGeneratorGraphPort } from './potatno-code-generator-graph.ts';
import { PotatnoCodeGeneratorGraphResult } from './potatno-code-generator-graph-result.ts';

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
     * Locates the document's system entry-point function and generates its code together with every function it transitively depends on.
     * Dependencies appear first in the output. The entry-point function is last.
     *
     * @param pDocument - The document to generate code for.
     *
     * @returns The complete generated code as a single string.
     */
    public generateDocument(pDocument: PotatnoDocument<TProject>): string {
        // Locate the entry-point function (the system function in the document).
        const lEntryPointFunction: PotatnoDocumentFunction<TProject> | undefined = [...pDocument.functions].find((pFunction) => {
            return pFunction.isSystem;
        });

        if (!lEntryPointFunction) {
            throw new Exception('No entry point function found for code generation.', this);
        }

        // Whole-document build runs with debug disabled. Build a fresh pass-global state shared across all recursive function generations.
        const lGlobals: PotatnoCodeGeneratorPassData<TProject> = this.createGenerationPassData(false);

        // TODO: Must somhow return the full generated function with all dependencies without just storing them in the globals.

        // Generate the entry-point function. Its result transitively pulls in all called functions via the shared cache.
        // Each function's wrapped body is appended to lGlobals.generatedFunctionBodies in topological order (dependencies first, entry last).
        // The returned FunctionResult is consumed by the other public entry points. Here only the side-effect on lGlobals is needed.
        this.generateFunctionCode(lEntryPointFunction, lGlobals);

        // TODO: Thats seems wrong. Maybe it should return a object with anything (code & dependencies) or something?.
        // TODO: So the function does the same as generate function???
        return lGlobals.generatedFunctionBodies.join('\n'); 
    }

    /**
     * Generate code for a single function and every function it depends
     * on (via PotatnoFunctionNodeDefinition usages).
     *
     * Non-whole-document entry point runs with debug enabled so node authors can
     * decide whether to emit preview hooks.
     *
     * @param pFunction - The function to generate code for.
     *
     * @returns A FunctionResult containing one Graph per exit node in the function.
     */
    public generateFunction(pFunction: PotatnoDocumentFunction<TProject>): PotatnoCodeGeneratorFunctionResult<TProject> {
        return this.generateFunctionCode(pFunction, this.createGenerationPassData(true));
    }

    /**
     * Generate code for the subgraph terminating at a single exit node.
     *
     * Intermediate / preview entry point runs with debug enabled.
     *
     * @param pExitNode - The exit node anchoring the subgraph.
     *
     * @returns A GraphResult containing one Graph for the subgraph.
     */
    public generateNode(pExitNode: PotatnoDocumentNode<TProject>): PotatnoCodeGeneratorGraphResult<TProject> {
        const lGlobals: PotatnoCodeGeneratorPassData<TProject> = this.createGenerationPassData(true);

        // Create new function result.
        const lResult: PotatnoCodeGeneratorGraphResult<TProject> = new PotatnoCodeGeneratorGraphResult(pExitNode.function);

        // Walk the subgraph anchored at pExitNode and wrap the produced Graph into a single-graph result.
        lResult.addGraph(this.generateNodeCode(pExitNode, lGlobals));

        return lResult;
    }

    /**
     * Construct a fresh global pass-state container.
     *
     * @param pDebug - Initial debug flag to use for this pass.
     */
    private createGenerationPassData(pDebug: boolean): PotatnoCodeGeneratorPassData<TProject> {
        return {
            counter: { valueId: 0 },
            functionGenerationCache: new Map<PotatnoDocumentFunction<TProject>, PotatnoCodeGeneratorFunctionResult<TProject>>(),
            generatedFunctionBodies: new Array<string>(),
            debug: pDebug
        };
    }

    /**
     * Generate code for a document function.
     * Also generates the function codes for function dependencies encountered during generation.
     *
     * @param pFunction - The function to generate code for.
     * @param pGlobals - Shared global pass state.
     *
     * @returns The FunctionResult (either freshly built or cached).
     */
    private generateFunctionCode(pFunction: PotatnoDocumentFunction<TProject>, pGlobals: PotatnoCodeGeneratorPassData<TProject>): PotatnoCodeGeneratorFunctionResult<TProject> {
        // Skip generation when the node is currently or is already generated.
        const lCached: PotatnoCodeGeneratorFunctionResult<TProject> | undefined = pGlobals.functionGenerationCache.get(pFunction);
        if (lCached) {
            return lCached;
        }

        // Resolve the function definition so we can find the exit-node definition ids.
        const lFunctionDefinition: PotatnoFunctionDefinition<TProject> | undefined = this.mProject.getFunction(pFunction.definitionId);
        if (!lFunctionDefinition) {
            throw new Exception(`Function definition not found for function "${pFunction.label}".`, this);
        }

        // Build the result and cache BEFORE walking so any function-call recursion terminates.
        const lFunctionResult: PotatnoCodeGeneratorFunctionResult<TProject> = new PotatnoCodeGeneratorFunctionResult(pFunction);
        pGlobals.functionGenerationCache.set(pFunction, lFunctionResult);

        // Read and convert the exit nodes of the function into a searchable set.
        const lExitDefinitionIds: Set<string> = new Set<string>(lFunctionDefinition.getNodeDefinitions(pFunction).exit.map((pDef) => {
            return pDef.id;
        }));

        // Walk each exit node's subgraph and attach the produced graph to the result.
        for (const lNode of pFunction.nodes) {
            // Skip any node that is not a exit node.
            if (!lExitDefinitionIds.has(lNode.definitionId)) {
                continue;
            }

            // Generate graph for the exit node and append it as result.
            lFunctionResult.addGraph(this.generateNodeCode(lNode, pGlobals));
        }

        // Wrap the body via the function definition's code generator and record in completion order.
        // By now all transitive callees are already in the list. Topological order is preserved.
        pGlobals.generatedFunctionBodies.push(lFunctionDefinition.codeGenerator.body(lFunctionResult));

        return lFunctionResult;
    }

    /**
     * Walk one subgraph and build the corresponding Graph instance.
     *
     * Constructs a cursor with a fresh top-level scope, pre-counts the
     * value-producer consumers, runs the backward walk, and assembles
     * the resulting Graph from the accumulated buffer plus the entry/exit
     * port mappings.
     *
     * @param pExitNode - The exit node anchoring the subgraph.
     * @param pGlobals - Shared global pass state.
     *
     * @returns A Graph capturing the subgraph's body code, entry/exit ports, imports, and dependencies.
     */
    private generateNodeCode(pExitNode: PotatnoDocumentNode<TProject>, pGlobals: PotatnoCodeGeneratorPassData<TProject>): PotatnoCodeGeneratorGraph<TProject> {
        // Build a fresh cursor with the top-level scope and dependencies accumulator.
        const lDependencies: Array<PotatnoCodeGeneratorFunctionResult<TProject>> = new Array<PotatnoCodeGeneratorFunctionResult<TProject>>();
        const lCursor: PotatnoCodeGeneratorPassCursor<TProject> = {
            counter: pGlobals.counter,
            functionGenerationCache: pGlobals.functionGenerationCache,
            generatedFunctionBodies: pGlobals.generatedFunctionBodies,
            dependencies: lDependencies,
            debug: pGlobals.debug,
            scope: this.createScope(pExitNode, null)
        };

        // Run the backward walk.
        this.walkBackward(pExitNode, null, lCursor);

        // The walk should have terminated by setting scope.entryNode (CASE A).
        const lEntryNode: PotatnoDocumentNode<TProject> | null = lCursor.scope.entryNode;
        if (!lEntryNode) {
            throw new Exception(`Walk did not reach an entry node from exit "${pExitNode.label}".`, this);
        }

        // Collect the entry-output and exit-input port valueIds.
        const lEntryPorts: Array<PotatnoCodeGeneratorGraphPort> = this.collectEntryPorts(lEntryNode, lCursor);
        const lExitPorts: Array<PotatnoCodeGeneratorGraphPort> = this.collectExitPorts(pExitNode, lCursor);

        // Compose the body code in execution order. The buffer accumulates code in REVERSE execution order via push, so we reverse before joining.
        const lBodyCode: string = lCursor.scope.buffer.slice().reverse().join('\n');

        return new PotatnoCodeGeneratorGraph({
            bodyCode: lBodyCode,
            dependencies: lDependencies,
            entryNode: lEntryNode,
            inputPorts: lEntryPorts,
            outputPorts: lExitPorts,
            generatedNode: pExitNode,
            imports: pExitNode.function.imports
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
            buffer: new Array<string>(),
            entryNode: null,
            lastEmittedNode: null
        };
    }

    /**
     * Iterative backward walk through a flow chain.
     *
     * Owns cursor.scope.buffer for its frame. Appends what emit*
     * helpers return. Sub-walks at merge points get their own fresh
     * scope swapped in temporarily and restored on return.
     *
     * @param pStartNode - The node the walk begins at.
     * @param pStopBefore - When set, the walk stops as soon as the cursor would advance to this node. The node is NOT emitted. Null at top-level so the walk runs until reaching a real entry node (CASE A).
     * @param pCursor - The pass cursor.
     */
    private walkBackward(pStartNode: PotatnoDocumentNode<TProject>, pStopBefore: PotatnoDocumentNode<TProject> | null, pCursor: PotatnoCodeGeneratorPassCursor<TProject>): void {
        let lCursorNode: PotatnoDocumentNode<TProject> | null = pStartNode;

        while (lCursorNode !== null && lCursorNode !== pStopBefore) {
            // Resolve flow-input predecessors, skipping flow conjunctions on the way.
            const lPredecessors: Array<PotatnoCodeGeneratorFlowPredecessor<TProject>> = this.getFlowInputPredecessors(lCursorNode);

            // CASE C: ≥2 predecessors. Cursor is a merge point.
            if (lPredecessors.length >= 2) {
                lCursorNode = this.handleMergeAndAdvance(lCursorNode, lPredecessors, pCursor);
                continue;
            }

            // CASE A (0 predecessors) and CASE B (1 predecessor) both emit the current node.
            this.appendEmittedCode(this.emitFlowNode(lCursorNode, pCursor), lCursorNode, pCursor);

            // CASE A: entry node or dead-end.
            if (lPredecessors.length === 0) {
                pCursor.scope.entryNode = lCursorNode;
                return;
            }

            // CASE B: advance to the single predecessor.
            lCursorNode = lPredecessors[0]!.node;
        }
    }

    /**
     * Handle CASE C of the backward walk.
     *
     * Emits the merge node, snapshots the buffer as `next`, runs one
     * sub-walk per fan-in branch into a fresh scope, then emits the
     * branch point with the per-branch inner strings and the shared
     * next string pre-filled in its pContext. Returns the branch
     * point's flow-input predecessor so the outer walk continues from
     * there.
     *
     * @param pMergeNode - The cursor node that triggered the merge handling.
     * @param pPredecessors - The merge's fan-in predecessors (already skipped through conjunctions).
     * @param pCursor - The pass cursor.
     */
    private handleMergeAndAdvance(pMergeNode: PotatnoDocumentNode<TProject>, pPredecessors: Array<PotatnoCodeGeneratorFlowPredecessor<TProject>>, pCursor: PotatnoCodeGeneratorPassCursor<TProject>): PotatnoDocumentNode<TProject> | null {
        // 1. Emit the merge node first. It's a regular flow node with its own code.
        this.appendEmittedCode(this.emitFlowNode(pMergeNode, pCursor), pMergeNode, pCursor);

        // 2. Snapshot the buffer so far as the branch point's `next`. Reverse-then-join because the buffer is in backward order.
        const lNextCode: string = pCursor.scope.buffer.slice().reverse().join('\n');
        pCursor.scope.buffer = new Array<string>();

        // 3. Find the branch point.
        const lBranchPoint: PotatnoDocumentNode<TProject> = this.findBranchPoint(pMergeNode);

        // 4. Run a sub-walk per fan-in branch into a fresh scope.
        const lInnerByPort: Record<string, string> = {};
        const lParentScope: PotatnoCodeGeneratorPassCursorScope<TProject> = pCursor.scope;
        for (const lPredecessor of pPredecessors) {
            pCursor.scope = this.createScope(lPredecessor.node, lBranchPoint);
            this.walkBackward(lPredecessor.node, lBranchPoint, pCursor);

            // The sub-walk's first node (in execution order) is the one we stopped just-before-advancing-to-branchPoint. Map back to the branch point's flow output port.
            const lBranchOutputPort: PotatnoDocumentPort<TProject> | null = this.findBranchOutputPortForFirstNode(lBranchPoint, pCursor.scope.lastEmittedNode);
            const lBranchKey: string = lBranchOutputPort ? lBranchOutputPort.definitionId : lPredecessor.sourcePort.definitionId;
            lInnerByPort[lBranchKey] = pCursor.scope.buffer.slice().reverse().join('\n');
        }
        pCursor.scope = lParentScope;

        // 5. Emit the branch point with inner/next in its pContext.
        this.appendEmittedCode(this.emitFlowNode(lBranchPoint, pCursor, lInnerByPort, lNextCode), lBranchPoint, pCursor);

        // 6. Continue from the branch point's flow-input predecessor.
        const lBranchPointPredecessors: Array<PotatnoCodeGeneratorFlowPredecessor<TProject>> = this.getFlowInputPredecessors(lBranchPoint);
        return lBranchPointPredecessors[0]?.node ?? null;
    }

    /**
     * Append a freshly emitted code chunk to the current scope's buffer
     * and record the node that produced it.
     *
     * @param pCode - The emitted code string.
     * @param pNode - The node that produced it.
     * @param pCursor - The pass cursor.
     */
    private appendEmittedCode(pCode: string, pNode: PotatnoDocumentNode<TProject>, pCursor: PotatnoCodeGeneratorPassCursor<TProject>): void {
        pCursor.scope.buffer.push(pCode);
        pCursor.scope.lastEmittedNode = pNode;
    }

    /**
     * Build the node's PotatnoNodeDefinitionGeneratorContext and call
     * its code generator.
     *
     * For branching nodes (CASE C), callers pass pInnerByPort and
     * pNextCode so the inner/next strings can be placed into the
     * context. For non-branching nodes (CASE A/B) the inner of each
     * flow output defaults to the current scope buffer (everything
     * accumulated downstream of this node so far) and next defaults
     * to empty.
     *
     * @param pNode - The node to emit code for.
     * @param pCursor - The pass cursor.
     * @param pInnerByPort - Inner code per flow output port id, when emitting a branching node. Optional.
     * @param pNextCode - Merged-tail code for a branching node. Optional.
     */
    private emitFlowNode(pNode: PotatnoDocumentNode<TProject>, pCursor: PotatnoCodeGeneratorPassCursor<TProject>, pInnerByPort?: Record<string, string>, pNextCode?: string): string {
        // Resolve the live node definition for this node.
        const lNodeDefinition = pNode.function.nodeDefinitions.find((pDef) => pDef.id === pNode.definitionId);
        if (!lNodeDefinition) {
            throw new Exception(`Node definition "${pNode.definitionId}" not found for node "${pNode.label}".`, this);
        }

        // Function-call nodes also trigger generation of the target function (deduplicated via the global cache).
        if (lNodeDefinition instanceof PotatnoFunctionNodeDefinition) {
            const lDependency: PotatnoCodeGeneratorFunctionResult<TProject> = this.generateFunctionCode(lNodeDefinition.function, pCursor);
            if (!pCursor.dependencies.includes(lDependency)) {
                pCursor.dependencies.push(lDependency);
            }
        }

        // Build the input port surfaces. Only value inputs make it into pContext.inputs.
        const lInputs: Record<string, PotatnoCodeGeneratorInputPort> = {};
        for (const lPort of pNode.inputs.values()) {
            if (lPort.portType !== 'value') {
                continue;
            }
            lInputs[lPort.definitionId] = {
                valueId: this.resolveValueInput(lPort, pCursor)
            };
        }

        // Default inner for flow outputs: everything we've accumulated downstream of this node in the current scope.
        const lDefaultInnerCode: string = pCursor.scope.buffer.slice().reverse().join('\n');

        // Build the output port surfaces. Value outputs get freshly allocated valueIds. Flow outputs get inner code (overridden per port by pInnerByPort when emitting a branching node).
        const lOutputs: Record<string, PotatnoCodeGeneratorOutputPort> = {};
        for (const lPort of pNode.outputs.values()) {
            if (lPort.portType === 'value') {
                if (!pCursor.scope.valueIds.has(lPort)) {
                    pCursor.scope.valueIds.set(lPort, this.allocateValueId(pCursor));
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

        // Assemble the full context and invoke the node's code generator.
        const lContext: PotatnoNodeDefinitionGeneratorContext = {
            inputs: lInputs,
            outputs: lOutputs,
            debug: pCursor.debug,
            code: { next: pNextCode ?? '' }
        };

        return lNodeDefinition.codeGenerator(lContext);
    }

    /**
     * Resolve a value input port to either the valueId of its connected source output (allocating one if not yet present in this scope)
     * or to an inline literal derived from the unconnected port's direct value.
     *
     * Decrements the producer's reference count when the producer is a pure-value node and triggers emission once the count hits zero.
     * Placing the producer's `const v_N = ...;` line into the scope buffer at exactly the right backward position so it lands ABOVE its first execution-order consumer in the final output.
     *
     * @param pInputPort - The value input port to resolve.
     * @param pCursor - The pass cursor.
     */
    private resolveValueInput(pInputPort: PotatnoDocumentPort<TProject>, pCursor: PotatnoCodeGeneratorPassCursor<TProject>): string {
        // Unconnected. Return an inline literal from the project type's converter.
        if (pInputPort.connectedPorts.size === 0) {
            return this.getPortValueLiteral(pInputPort);
        }

        // Connected. Walk through value conjunctions to the real producer's output port.
        const lFirstConnection: PotatnoDocumentPort<TProject> = pInputPort.connectedPorts.values().next().value!;
        const lSourcePort: PotatnoDocumentPort<TProject> = this.resolveValueConjunctions(lFirstConnection);
        const lProducerNode: PotatnoDocumentNode<TProject> = lSourcePort.node;

        // Allocate a fresh valueId on first encounter in this scope.
        if (!pCursor.scope.valueIds.has(lSourcePort)) {
            pCursor.scope.valueIds.set(lSourcePort, this.allocateValueId(pCursor));
        }

        // If the producer is a pure-value node, tick its refcount. Emit on depletion.
        if (this.isPureValueProducer(lProducerNode)) {
            const lRemaining: number = (pCursor.scope.remaining.get(lProducerNode) ?? 0) - 1;
            pCursor.scope.remaining.set(lProducerNode, lRemaining);
            if (lRemaining === 0) {
                this.appendEmittedCode(this.emitFlowNode(lProducerNode, pCursor), lProducerNode, pCursor);
            }
        }

        return pCursor.scope.valueIds.get(lSourcePort)!;
    }

    /**
     * Resolve an unconnected value-input port to its inline literal via
     * the project's type converter, or '' if no concrete type is known.
     *
     * @param pInputPort - The unconnected value input port.
     */
    private getPortValueLiteral(pInputPort: PotatnoDocumentPort<TProject>): string {
        const lDataType = pInputPort.dataType;
        if (!lDataType || this.mProject.types.isGenericType(lDataType)) {
            return '';
        }
        return this.mProject.types.getType(lDataType).convert([...pInputPort.directValue]);
    }

    /**
     * Allocate a fresh valueId from the global counter.
     */
    private allocateValueId(pCursor: PotatnoCodeGeneratorPassCursor<TProject>): string {
        const lId: number = pCursor.counter.valueId;
        pCursor.counter.valueId = lId + 1;
        return `v_${lId}`;
    }

    /**
     * Pre-pass that counts each pure-value producer's direct consumers
     * within a given scope's reach.
     *
     * The result map is used by resolveValueInput to know when a
     * producer has been referenced by every consumer in this scope and
     * can therefore be emitted.
     *
     * Walks backward through flow inputs to collect every flow node
     * reachable from pStartNode within pStopBefore, then walks the value
     * dependency closure from those flow nodes to collect every
     * pure-value producer. Finally counts each producer's references
     * across both flow nodes and chained pure-value producers.
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

            for (const lInputPort of lNode.inputs.values()) {
                if (lInputPort.portType !== 'flow') {
                    continue;
                }
                for (const lConnectedPort of lInputPort.connectedPorts) {
                    lFlowQueue.push(this.resolveFlowConjunctions(lConnectedPort.node));
                }
            }
        }

        // Step 2: Walk value-input edges to count consumer refs to each pure-value producer and transitively discover producer-to-producer chains.
        const lProducers: Set<PotatnoDocumentNode<TProject>> = new Set<PotatnoDocumentNode<TProject>>();
        const lProducerQueue: Array<PotatnoDocumentNode<TProject>> = new Array<PotatnoDocumentNode<TProject>>();
        const lCountAndDiscover = (pNode: PotatnoDocumentNode<TProject>): void => {
            for (const lInputPort of pNode.inputs.values()) {
                if (lInputPort.portType !== 'value' || lInputPort.connectedPorts.size === 0) {
                    continue;
                }
                const lSourcePort: PotatnoDocumentPort<TProject> = this.resolveValueConjunctions(lInputPort.connectedPorts.values().next().value!);
                const lProducer: PotatnoDocumentNode<TProject> = lSourcePort.node;
                if (!this.isPureValueProducer(lProducer)) {
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
     * Tagged backward BFS to find the branch point that ultimately fans
     * into pMergeNode.
     *
     * Each fan-in predecessor seeds its own tag. Tags propagate as the
     * search walks backward through flow inputs. The first node whose
     * accumulated tag set covers all branches is the branch point.
     *
     * @param pMergeNode - A node with ≥2 flow-input connections.
     */
    private findBranchPoint(pMergeNode: PotatnoDocumentNode<TProject>): PotatnoDocumentNode<TProject> {
        const lPredecessors: Array<PotatnoCodeGeneratorFlowPredecessor<TProject>> = this.getFlowInputPredecessors(pMergeNode);
        const lTotalTags: number = lPredecessors.length;

        const lTagsByNode: Map<PotatnoDocumentNode<TProject>, Set<number>> = new Map<PotatnoDocumentNode<TProject>, Set<number>>();
        const lQueue: Array<PotatnoDocumentNode<TProject>> = new Array<PotatnoDocumentNode<TProject>>();

        // Seed: one tag per fan-in predecessor.
        for (let lIndex: number = 0; lIndex < lPredecessors.length; lIndex++) {
            const lPredecessor: PotatnoCodeGeneratorFlowPredecessor<TProject> = lPredecessors[lIndex]!;
            lTagsByNode.set(lPredecessor.node, new Set<number>([lIndex]));
            lQueue.push(lPredecessor.node);
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
     * Collect a node's flow-input predecessors, walking through any
     * flow-conjunction reroute nodes so the returned predecessors are
     * always real (non-conjunction) nodes.
     *
     * @param pNode - The node whose predecessors to collect.
     */
    private getFlowInputPredecessors(pNode: PotatnoDocumentNode<TProject>): Array<PotatnoCodeGeneratorFlowPredecessor<TProject>> {
        const lResult: Array<PotatnoCodeGeneratorFlowPredecessor<TProject>> = new Array<PotatnoCodeGeneratorFlowPredecessor<TProject>>();

        for (const lInputPort of pNode.inputs.values()) {
            if (lInputPort.portType !== 'flow') {
                continue;
            }
            for (const lConnectedPort of lInputPort.connectedPorts) {
                lResult.push({
                    node: this.resolveFlowConjunctions(lConnectedPort.node),
                    sourcePort: lConnectedPort
                });
            }
        }

        return lResult;
    }

    /**
     * Find which flow output port on the branch point ultimately reaches
     * pFirstNode (the first node executed after the branch point in the
     * branch).
     *
     * Walks every flow output of the branch point forward through
     * flow-conjunction reroutes and returns the first output whose
     * downstream resolves to pFirstNode.
     *
     * @param pBranchPoint - The branch point node.
     * @param pFirstNode - The first execution-order node after the branch point in some branch (or null when the sub-walk emitted nothing).
     */
    private findBranchOutputPortForFirstNode(pBranchPoint: PotatnoDocumentNode<TProject>, pFirstNode: PotatnoDocumentNode<TProject> | null): PotatnoDocumentPort<TProject> | null {
        if (!pFirstNode) {
            return null;
        }

        for (const lOutputPort of pBranchPoint.outputs.values()) {
            if (lOutputPort.portType !== 'flow') {
                continue;
            }
            for (const lConnectedInput of lOutputPort.connectedPorts) {
                if (this.resolveFlowConjunctions(lConnectedInput.node) === pFirstNode) {
                    return lOutputPort;
                }
            }
        }

        return null;
    }

    /**
     * Recursive walk backward through chains of flow-conjunction reroute nodes to find all connected input flow ports.
     *
     * @param pOutputPort - The candidate output port.
     * 
     * @return the actual, conjunction-cleared output flow ports.
     */
    private resolveFlowConjunctions(pOutputPort: PotatnoDocumentPort<TProject>): Array<PotatnoDocumentPort<TProject>> {
        const lResults: Array<PotatnoDocumentPort<TProject>> = new Array<PotatnoDocumentPort<TProject>>();

        // Port does not belong to a conjunction. Just return it.
        if (pOutputPort.node.definitionId === FlowConjunctionNodeDefinition.DEFINITION_ID) {
            lResults.push(pOutputPort);
            return lResults;
        }

        // Try to read the nodes first input port.
        // Conjuctions only have one in- and output port. When it has no connection, just throw.
        const lInputPort: PotatnoDocumentPort<TProject> | undefined = pOutputPort.node.inputs.values().next().value;
        if (!lInputPort || lInputPort.connectedPorts.size === 0) {
            throw new Exception('Conjunction nodes must have a valid input and output connection', this);
        }

        // Read and recursive resolve all incoming ports.
        for (const lOutputPort of lInputPort.connectedPorts) {
            lResults.push(...this.resolveFlowConjunctions(lOutputPort));
        }

        return lResults;
    }

    /**
     * Recursive walk backward through chains of value-conjunction reroute nodes to find the real connected port. 
     *
     * @param pOutputPort - The candidate output port.
     * 
     * @return the actual, conjunction-cleared output value port.
     */
    private resolveValueConjunctions(pOutputPort: PotatnoDocumentPort<TProject>): PotatnoDocumentPort<TProject> {
        // Port does not belong to a conjunction. Return it.
        if (pOutputPort.node.definitionId !== ValueConjunctionNodeDefinition.DEFINITION_ID) {
            return pOutputPort;
        }

        // Try to read the nodes first input port.
        // Conjuctions only have one in- and output port. When it has no connection, just throw.
        const lInputPort: PotatnoDocumentPort<TProject> | undefined = pOutputPort.node.inputs.values().next().value;
        if (!lInputPort || lInputPort.connectedPorts.size === 0) {
            throw new Exception('Conjunction nodes must have a valid input and output connection', this);
        }

        // Read the next nodes input port.
        return this.resolveValueConjunctions(lInputPort);
    }

    /**
     * Check if a node is a pure-value producer by verifying it has no flow input or output ports.
     *
     * @param pNode - The node to test.
     */
    private isPureValueProducer(pNode: PotatnoDocumentNode<TProject>): boolean {
        // Check all input ports.
        for (const lPort of pNode.inputs.values()) {
            if (lPort.portType === 'flow') {
                return false;
            }
        }

        // Check all output ports.
        for (const lPort of pNode.outputs.values()) {
            if (lPort.portType === 'flow') {
                return false;
            }
        }

        return true;
    }

    /**
     * Collect the entry node's value output ports paired with their
     * allocated valueIds.
     *
     * @param pEntryNode - The entry node discovered by the walk.
     * @param pCursor - The pass cursor (used to read scope.valueIds).
     */
    private collectEntryPorts(pEntryNode: PotatnoDocumentNode<TProject>, pCursor: PotatnoCodeGeneratorPassCursor<TProject>): Array<PotatnoCodeGeneratorGraphPort> {
        const lPorts: Array<PotatnoCodeGeneratorGraphPort> = new Array<PotatnoCodeGeneratorGraphPort>();
        for (const lPort of pEntryNode.outputs.values()) {
            if (lPort.portType !== 'value') {
                continue;
            }
            const lValueId: string | undefined = pCursor.scope.valueIds.get(lPort);
            lPorts.push({
                definitionId: lPort.definitionId,
                valueId: lValueId ?? ''
            });
        }
        return lPorts;
    }

    /**
     * Collect the exit node's value input ports paired with the resolved
     * valueIds feeding them (or inline literals for unconnected ports).
     *
     * @param pExitNode - The exit node anchoring this subgraph.
     * @param pCursor - The pass cursor.
     */
    private collectExitPorts(pExitNode: PotatnoDocumentNode<TProject>, pCursor: PotatnoCodeGeneratorPassCursor<TProject>): Array<PotatnoCodeGeneratorGraphPort> {
        const lPorts: Array<PotatnoCodeGeneratorGraphPort> = new Array<PotatnoCodeGeneratorGraphPort>();
        for (const lPort of pExitNode.inputs.values()) {
            if (lPort.portType !== 'value') {
                continue;
            }
            lPorts.push({
                definitionId: lPort.definitionId,
                valueId: this.resolveValueInputReadOnly(lPort, pCursor)
            });
        }
        return lPorts;
    }

    /**
     * Read a port's already-resolved valueId or unconnected literal
     * without triggering side effects. Used when assembling exitPorts
     * after the walk has already done its bookkeeping.
     *
     * @param pInputPort - The value input port to read.
     * @param pCursor - The pass cursor.
     */
    private resolveValueInputReadOnly(pInputPort: PotatnoDocumentPort<TProject>, pCursor: PotatnoCodeGeneratorPassCursor<TProject>): string {
        if (pInputPort.connectedPorts.size === 0) {
            return this.getPortValueLiteral(pInputPort);
        }

        // Value inputs should always be connected to exactly one output port.
        const lFirstConnection: PotatnoDocumentPort<TProject> = pInputPort.connectedPorts.values().next().value!;

        const lSourcePort: PotatnoDocumentPort<TProject> = this.resolveValueConjunctions(lFirstConnection);
        return pCursor.scope.valueIds.get(lSourcePort) ?? '';
    }
}

/**
 * Globals shared across all scopes in a generation pass.
 */
type PotatnoCodeGeneratorPassData<TProject extends PotatnoProject> = {
    /**
     * Monotonic source of fresh valueId strings.
     */
    counter: {
        valueId: number;
    };

    /**
     * Deduplicates dependent function generations across the whole pass.
     */
    functionGenerationCache: Map<PotatnoDocumentFunction<TProject>, PotatnoCodeGeneratorFunctionResult<TProject>>;

    /**
     * Wrapped function bodies in completion (topological) order. Each entry is the
     * string produced by a function definition's body code generator, appended once
     * after the corresponding result and all transitively called functions have been
     * generated. Joined to form the final document output.
     */
    generatedFunctionBodies: Array<string>;

    /**
     * Forwarded to node code generators as pContext.debug. Set by the
     * public entry point that started this pass.
     */
    debug: boolean;
};

/**
 * Pass-level state threaded through the walk.
 *
 * The `scope` slot is swapped per backward walk (one per top-level
 * call, plus one per sub-walk spawned at a merge). Everything else
 * is shared across all scopes within a single generation pass.
 */
type PotatnoCodeGeneratorPassCursor<TProject extends PotatnoProject> = PotatnoCodeGeneratorPassData<TProject> & {
    /**
     * Dependent function results accumulated during the top-level walk.
     * Sub-walks share the same array. Dependencies are pass-wide, not scope-local.
     */
    dependencies: Array<PotatnoCodeGeneratorFunctionResult<TProject>>;

    /**
     * The current scope. Replaced when entering a sub-walk and restored
     * when the sub-walk returns.
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
     * Initialised by preCountConsumers. Decremented in resolveValueInput
     * as flow nodes are emitted.
     */
    remaining: Map<PotatnoDocumentNode<TProject>, number>;

    /**
     * Backward buffer accumulating emitted code in REVERSE execution order.
     */
    buffer: Array<string>;

    /**
     * The entry node discovered when CASE A is hit during this walk.
     * Set once and read by the top-level wrapper to build the Graph.
     */
    entryNode: PotatnoDocumentNode<TProject> | null;

    /**
     * The last node whose code was appended to the buffer in this scope.
     * Used by sub-walks to identify which flow output port of the branch
     * point initiated this branch.
     */
    lastEmittedNode: PotatnoDocumentNode<TProject> | null;
};

/**
 * Flow-input predecessor description used during the backward walk.
 * Holds the resolved upstream node (post-conjunction-skip) plus the
 * original connected source port (pre-skip) so the original mapping
 * can be reconstructed when needed.
 */
type PotatnoCodeGeneratorFlowPredecessor<TProject extends PotatnoProject> = {
    /**
     * The upstream node (with any flow-conjunctions traversed away).
     */
    node: PotatnoDocumentNode<TProject>;

    /**
     * The output port connected to the consumer node's flow input.
     */
    sourcePort: PotatnoDocumentPort<TProject>;
};
