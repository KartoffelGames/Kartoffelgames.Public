import { Exception } from "@kartoffelgames/core";
import type { PotatnoNodeDefinition } from "../project/node_definition/potatno-node-definition.ts";
import { PotatnoFunctionDefinition, PotatnoFunctionDefinitionNodes } from "../project/potatno-function-definition.ts";
import { PotatnoPortDefinition } from "../project/potatno-port-definition.ts";
import { PotatnoProjectGenericType, PotatnoProjectType } from "../project/potatno-project-types-definition.ts";
import type { PotatnoProject } from '../project/potatno-project.ts';
import type { IPotatnoDocumentItem } from './i-potatno-document-item.interface.ts';
import { PotatnoDocumentNode, PotatnoDocumentNodePortConfiguration, PotatnoDocumentNodeTransformation } from "./potatno-document-node.ts";
import { PotatnoDocument, PotatnoDocumentPortValidationError } from "./potatno-document.ts";

/**
 * Represents a user-editable function containing a sub-graph.
 */
export class PotatnoDocumentFunction<TProject extends PotatnoProject> implements IPotatnoDocumentItem<TProject> {
    private mLabel: string;
    private readonly mDefinitionId: string;
    private readonly mDocument: PotatnoDocument<TProject>;
    private readonly mId: string;
    private readonly mImports: Array<string>;
    private readonly mInputs: Array<PotatnoDocumentFunctionPort<TProject>>;
    private readonly mIsSystem: boolean;
    private readonly mNodes: Set<PotatnoDocumentNode<TProject>>;
    private readonly mOutputs: Array<PotatnoDocumentFunctionPort<TProject>>;
    private readonly mProject: TProject;

    /**
     * Unique identifier for this function instance. Stable across sessions so it can be referenced as a node in other graphs.
     */
    public get id(): string {
        return this.mId;
    }

    /**
     * The stable id of the function definition this function was created from.
     */
    public get definitionId(): string {
        return this.mDefinitionId;
    }

    /**
     * The document this function belongs to.
     */
    public get document(): PotatnoDocument<TProject> {
        return this.mDocument;
    }

    /**
     * Read-only set of all nodes in the graph.
     */
    public get nodes(): ReadonlySet<PotatnoDocumentNode<TProject>> {
        return this.mNodes;
    }

    /**
     * Get all available node definitions for this function.
     *
     * Concatenates the document's project-wide definitions with the function definition's
     * own entry, exit, and dynamic node definitions. Entry/exit definitions belong here
     * because they are the only sources for the system-placed nodes (e.g. `OnPixel`,
     * `PixelResult`) — the code generator looks every node up via this list and previously
     * threw on those entries because only `dynamic` was included.
     */
    public get nodeDefinitions(): ReadonlyArray<PotatnoNodeDefinition<TProject>> {
        // Read the function definition from project.
        const lFunctionDefinition: PotatnoFunctionDefinition<TProject> | undefined = this.mProject.getFunction(this.definitionId);
        if (!lFunctionDefinition) {
            return [...this.mDocument.nodeDefinitions];
        }

        // TODO: Must be a better solution. There must be a diff access between public and internal nodes.

        const lFunctionNodes = lFunctionDefinition.getNodeDefinitions(this);
        return [
            ...this.mDocument.nodeDefinitions,
            ...lFunctionNodes.entry,
            ...lFunctionNodes.exit,
            ...lFunctionNodes.dynamic
        ];
    }

    /**
     * Get the list of imports for this function.
     */
    public get imports(): ReadonlyArray<string> {
        return this.mImports;
    }

    /**
     * Get the input port definitions for this function.
     */
    public get inputs(): ReadonlyArray<PotatnoDocumentFunctionPort<TProject>> {
        return this.mInputs;
    }

    /**
     * Get the label of this function.
     */
    public get label(): string {
        return this.mLabel;
    } set label(pLabel: string) {
        this.mLabel = pLabel;
    }

    /**
     * Get the output port definitions for this function.
     */
    public get outputs(): ReadonlyArray<PotatnoDocumentFunctionPort<TProject>> {
        return this.mOutputs;
    }

    /**
     * Get whether the function is a system-defined function.
     */
    public get isSystem(): boolean {
        return this.mIsSystem;
    }

    /**
     * Get the project this function belongs to.
     */
    public get project(): TProject {
        return this.mProject;
    }

    /**
     * Create a new function instance.
     *
     * @param pProject - The project this function belongs to.
     * @param pDefinitionId - The stable id of the function definition this function was created from.
     * @param pId - The unique identifier of the function.
     * @param pLabel - Label of the function.
     * @param pIsSystem - Whether the function is a system-defined function.
     */
    public constructor(pProject: TProject, pDocument: PotatnoDocument<TProject>, pParameter: PotatnoDocumentFunctionConstructorParameter) {
        this.mProject = pProject;
        this.mDocument = pDocument;
        this.mLabel = pParameter.label;
        this.mIsSystem = pParameter.isSystem;
        this.mDefinitionId = pParameter.definitionId;
        this.mId = pParameter.id;
        this.mNodes = new Set<PotatnoDocumentNode<TProject>>();
        this.mInputs = new Array<PotatnoDocumentFunctionPort<TProject>>();
        this.mOutputs = new Array<PotatnoDocumentFunctionPort<TProject>>();
        this.mImports = new Array<string>();
    }

    /**
     * Add an import to the function if it does not already exist.
     *
     * @param pImport - The import string to add.
     */
    public addImport(pImport: string): void {
        if (!this.mImports.includes(pImport)) {
            this.mImports.push(pImport);
        }
    }

    /**
     * Add an input port definition to the function.
     *
     * @param pPort - The port definition.
     */
    public addInput(pPort: PotatnoDocumentFunctionPort<TProject>): void {
        // Skip if port label already exists.
        if (this.mInputs.some((existingPort) => existingPort.label === pPort.label)) {
            return;
        }

        this.mInputs.push(pPort);
    }

    /**
     * Add an output port definition to the function.
     *
     * @param pPort - The port definition.
     */
    public addOutput(pPort: PotatnoDocumentFunctionPort<TProject>): void {
        // Skip if port label already exists.
        if (this.mOutputs.some((existingPort) => existingPort.label === pPort.label)) {
            return;
        }

        this.mOutputs.push(pPort);
    }

    /**
     * Add a pre-constructed node directly.
     *
     * @param pNode - The node to add.
     */
    public addNode(pNode: PotatnoDocumentNode<TProject>): void {
        this.mNodes.add(pNode);
    }

    /**
     * Create a new node from a definition instance. Used by the editor when the user places a node.
     * The definition's ports and metadata are used to populate the node.
     *
     * @param pDefinition - The node definition to create the node from.
     * @param pTransformation - Initial grid position of the node.
     */
    public addNodeByDefinition(pDefinition: PotatnoNodeDefinition<TProject>, pTransformation: PotatnoDocumentNodeTransformation): PotatnoDocumentNode<TProject> {
        // Node definition to configuration converter.
        const lNodeConverter = (pPort: PotatnoPortDefinition<TProject>): PotatnoDocumentNodePortConfiguration<TProject> => {
            return {
                definitionId: pPort.id,
                label: pPort.label,
                portType: pPort.portType,
                dataType: pPort.dataType
            };
        };

        const lNode = new PotatnoDocumentNode<TProject>(this.mProject, this.mDocument, this, {
            category: pDefinition.category,
            definitionId: pDefinition.id,
            ports: {
                input: pDefinition.inputs.map(lNodeConverter),
                output: pDefinition.outputs.map(lNodeConverter)
            },
            label: pDefinition.label,
            transformation: pTransformation
        });

        this.mNodes.add(lNode);

        return lNode;
    }

    /**
     * Get document functions exit nodes.
     * Exit nodes are the starting point for every code generation.
     * 
     * @returns all defined nodes that are defined as the functions exit nodes.
     */
    public getExitNodes(): Array<PotatnoDocumentNode<TProject>> {
        const lFunctionDefinition = this.mProject.getFunction(this.mDefinitionId);
        if (!lFunctionDefinition) {
            throw new Exception(`Function definition not found for function "${this.mLabel}".`, this);
        }

        // Resolve every exit-node definition id declared by the function definition.
        const lExitDefinitionIds: Set<string> = new Set<string>(lFunctionDefinition.getNodeDefinitions(this).exit.map((pDef) => {
            return pDef.id;
        }));

        // Filter the function's nodes to those whose definitionId matches one of the exit-node definition ids.
        return [...this.mNodes].filter((pNode) => {
            return lExitDefinitionIds.has(pNode.definitionId);
        });
    }

    /**
     * Remove a node and disconnect all its ports from the graph.
     */
    public removeNode(pNode: PotatnoDocumentNode<TProject>): void {
        // Disconnect all ports of the node.
        for (const lPort of [...pNode.inputs.list, ...pNode.outputs.list]) {
            for (const lConnectedPort of Array.from(lPort.connectedPorts)) {
                lPort.disconnect(lConnectedPort);
            }
        }

        this.mNodes.delete(pNode);
    }

    /**
     * Remove an import from the function.
     *
     * @param pImport - The import string to remove.
     */
    public removeImport(pImport: string): void {
        const index = this.mImports.indexOf(pImport);
        if (index !== -1) {
            this.mImports.splice(index, 1);
        }
    }

    /**
     * Remove an input port definition from the function.
     *
     * @param pPort - The port definition to remove.
     */
    public removeInput(pPort: PotatnoDocumentFunctionPort<TProject>): void {
        const index = this.mInputs.findIndex((existingPort) => existingPort.label === pPort.label);
        if (index !== -1) {
            this.mInputs.splice(index, 1);
        }
    }

    /**
     * Remove an output port definition from the function.
     *
     * @param pPort - The port definition to remove.
     */
    public removeOutput(pPort: PotatnoDocumentFunctionPort<TProject>): void {
        const index = this.mOutputs.findIndex((existingPort) => existingPort.label === pPort.label);
        if (index !== -1) {
            this.mOutputs.splice(index, 1);
        }
    }

    /**
     * Validate all nodes in this function and return any errors found.
     * Also checks whether this function's own definition can still be found in the project.
     *
     * Region validation uses a two-pass approach:
     * 1. Fill a region map for every node via memoized backward recursion over all incoming connections.
     * 2. Validate each node with its computed incoming region set.
     */
    public validate(): Array<PotatnoDocumentPortValidationError<TProject>> {
        const lErrors: Array<PotatnoDocumentPortValidationError<TProject>> = [];

        // Check if this function's definition can still be found.
        const lDefinition: PotatnoFunctionDefinition<TProject> | undefined = this.mProject.getFunction(this.mDefinitionId);
        if (!lDefinition) {
            lErrors.push(new PotatnoDocumentPortValidationError(`Function "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`, this));
        }

        // Read node definitions once.
        const lNodeDefinitions: PotatnoFunctionDefinitionNodes<TProject> | undefined = lDefinition?.getNodeDefinitions(this);

        // Resync function nodes.
        if (lNodeDefinitions) {
            this.resyncFunction(lNodeDefinitions);
        }

        // First pass: compute incoming region set for every node via memoized backward recursion.
        // Each top-level call receives a fresh visited set so cycle detection tracks only the current path.
        const lNodeRegionBuffer: Map<PotatnoDocumentNode<TProject>, Set<string>> = new Map<PotatnoDocumentNode<TProject>, Set<string>>();
        const lNodeRegions: Map<PotatnoDocumentNode<TProject>, Set<string>> = new Map<PotatnoDocumentNode<TProject>, Set<string>>();
        for (const lNode of this.mNodes) {
            lNodeRegions.set(lNode, this.accumulateRegions(lNode, lNodeRegionBuffer, new Set<PotatnoDocumentNode<TProject>>(), lErrors));
        }

        // Get all definition ids of entry nodes defined by the function definition.
        const lEntryNodeDefinitionIds = new Set(lNodeDefinitions?.entry.map((pNodeDefinition) => {
            return pNodeDefinition.id;
        }) ?? new Array<string>());

        // Second pass: validate every node with its computed incoming regions and entry domains.
        const lEntryNodeDomainBuffer: Map<PotatnoDocumentNode<TProject>, Set<PotatnoDocumentNode<TProject>>> = new Map<PotatnoDocumentNode<TProject>, Set<PotatnoDocumentNode<TProject>>>();
        for (const lNode of this.mNodes) {
            lErrors.push(...lNode.validate(lNodeRegions.get(lNode)!));

            if (this.accumulateEntryDomains(lNode, lEntryNodeDefinitionIds, lEntryNodeDomainBuffer).size > 1) {
                lErrors.push(new PotatnoDocumentPortValidationError(`Node "${lNode.label}" is reachable from multiple entry nodes.`, lNode));
            }
        }

        return lErrors;
    }

    /**
     * Recursively accumulate the incoming region set for a node by walking backwards
     * through all incoming connections (both flow and value inputs).
     *
     * A node's incoming regions are the union of every predecessor's accumulated regions
     * plus the regions each predecessor adds. Results are memoized in pBuffer so each
     * node is resolved at most once regardless of how many downstream nodes reference it.
     *
     * pVisitedNodes tracks the current recursion path (DFS stack). When a node is encountered
     * that is already on the current path, a cycle is detected, an error is reported, and
     * recursion stops for that branch. The node is added before recursing and removed on
     * the way back up so sibling branches are not falsely flagged.
     *
     * @param pNode - The node whose incoming regions should be computed.
     * @param pBuffer - Memoization map shared across the entire validation pass.
     * @param pVisitedNodes - Current DFS path, used for cycle detection.
     * @param pErrors - Error list to append cycle validation errors to.
     *
     * @returns The accumulated incoming region set for pNode.
     */
    private accumulateRegions(pNode: PotatnoDocumentNode<TProject>, pBuffer: Map<PotatnoDocumentNode<TProject>, Set<string>>, pVisitedNodes: Set<PotatnoDocumentNode<TProject>>, pErrors: Array<PotatnoDocumentPortValidationError<TProject>>): Set<string> {
        // TODO: That seems like it can be rewriten to a recursive function to eliminate the stupid node loop and buffer handling.

        // Return cached result if this node was already resolved.
        if (pBuffer.has(pNode)) {
            return pBuffer.get(pNode)!;
        }

        // Cycle detected: this node is already on the current recursion path.
        if (pVisitedNodes.has(pNode)) {
            pErrors.push(new PotatnoDocumentPortValidationError(`Node "${pNode.label}" is part of a connection cycle.`, pNode));
            return new Set<string>();
        }

        // Mark this node as part of the current path before recursing.
        pVisitedNodes.add(pNode);

        const lNodeRegions = new Set<string>();

        // Walk all incoming connections (flow inputs and value inputs).
        for (const lInputPort of pNode.inputs.list) {
            for (const lConnectedPort of lInputPort.connectedPorts) {
                const lPredecessor = lConnectedPort.node;

                // Resolve the predecessor first, then inherit its accumulated regions.
                const lPredecessorRegions = this.accumulateRegions(lPredecessor, pBuffer, pVisitedNodes, pErrors);
                for (const lRegion of lPredecessorRegions) {
                    lNodeRegions.add(lRegion);
                }

                // Also apply the regions the predecessor itself adds.
                const lPredecessorDefinition = this.nodeDefinitions.find((pDef) => pDef.id === lPredecessor.definitionId);
                if (lPredecessorDefinition) {
                    for (const lRegion of lPredecessorDefinition.regions.add) {
                        lNodeRegions.add(lRegion);
                    }

                    // Also apply the regions the connected output port adds.
                    const lOutputPortDefinition = lPredecessorDefinition.getPort(lConnectedPort.definitionId);
                    if (lOutputPortDefinition) {
                        for (const lRegion of lOutputPortDefinition.regions.add) {
                            lNodeRegions.add(lRegion);
                        }
                    }
                }
            }
        }

        // Save the computed regions in the buffer after anything is resolved to future iterations only take valid computed results.
        pBuffer.set(pNode, lNodeRegions);

        return lNodeRegions;
    }

    /**
     * Recursively accumulate the set of entry node ids that can reach pNode by walking backwards
     * through all incoming connections. Memoized; cycles are silently skipped (already caught by accumulateRegions).
     * 
     * @param pNode - The node whose entry domains should be computed.
     * @param pEntryNodesDefinitionIds - Set of definition ids that are considered entry nodes.
     * @param pBuffer - Memoization map shared across the entire validation pass.
     */
    private accumulateEntryDomains(pNode: PotatnoDocumentNode<TProject>, pEntryNodesDefinitionIds: Set<string>, pBuffer: Map<PotatnoDocumentNode<TProject>, Set<PotatnoDocumentNode<TProject>>>): Set<PotatnoDocumentNode<TProject>> {
        // Return cached result if this node was already resolved.
        // This also serves for terminating before recursion check, as buffered nodes are added after recursion has finished.
        if (pBuffer.has(pNode)) {
            return pBuffer.get(pNode)!;
        }

        const lDomains = new Set<PotatnoDocumentNode<TProject>>();

        // Set the node into buffer before recursing so that that cycles are exited and dont run endlessly.
        pBuffer.set(pNode, lDomains);

        // Walk all incoming connections (flow inputs and value inputs).
        for (const lInputPort of pNode.inputs.list) {
            for (const lConnectedPort of lInputPort.connectedPorts) {
                const lPredecessor = lConnectedPort.node;

                // If the predecessor is an entry node, register its domain.
                if (pEntryNodesDefinitionIds.has(lPredecessor.definitionId)) {
                    lDomains.add(lPredecessor);
                }

                // Inherit all entry node domains accumulated by the predecessor.
                for (const lEntryDomainNode of this.accumulateEntryDomains(lPredecessor, pEntryNodesDefinitionIds, pBuffer,)) {
                    lDomains.add(lEntryDomainNode);
                }
            }
        }

        return lDomains;
    }

    /**
     * Resync system nodes.
     * Ensures all system nodes are present at any time during validation. 
     * 
     * @param pNodeDefinitions - node definitions of this function. 
     */
    private resyncFunction(pNodeDefinitions: PotatnoFunctionDefinitionNodes<TProject>): void {
        // Find all entry and output node definitions.
        const lSystemNodes = [...pNodeDefinitions.entry, ...pNodeDefinitions.exit];

        // Convert document nodes into a O(n) searchable set.
        const lCurrentNodes: Set<string> = new Set(this.mNodes.values().map((pNode) => {
            return pNode.definitionId;
        }));

        // Node counter to space addded nodes.
        let lNodeCounter = 0;

        const lItemSpacing: number = 20;

        // Validate that every entry and exit node exists.
        for (const lSystemNodeDefinition of lSystemNodes) {

            // System node exists, all fine continue. Nothing to see here.
            if (lCurrentNodes.has(lSystemNodeDefinition.id)) {
                continue;
            }

            this.addNodeByDefinition(lSystemNodeDefinition, {
                // First half left (x:2) second half right (x: 20).
                x: (Math.floor(lNodeCounter / (lSystemNodes.length / 2)) * lItemSpacing) + 2,
                
                // First half and second half both start at (y: 2)
                y: (lNodeCounter * lItemSpacing) + 2 - (Math.floor(lNodeCounter / (lSystemNodes.length / 2)) * ((lSystemNodes.length / 2) * lItemSpacing)),

                width: 0, height: 0
            });

            lNodeCounter++;
        }
    }
}

export type PotatnoDocumentFunctionConstructorParameter = {
    definitionId: string;
    id: string;
    label: string;
    isSystem: boolean;
};

export type PotatnoDocumentFunctionPort<TProject extends PotatnoProject> = {
    label: string;
    dataType: PotatnoProjectType<TProject> | PotatnoProjectGenericType;
};