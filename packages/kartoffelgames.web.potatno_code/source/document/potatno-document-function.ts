import type { PotatnoNodeDefinition } from "../project/node_definition/potatno-node-definition.ts";
import { PotatnoFunctionDefinition } from "../project/potatno-function-definition.ts";
import { PotatnoPortDefinition } from "../project/potatno-port-definition.ts";
import type { PotatnoProject } from '../project/potatno-project.ts';
import type { IPotatnoDocumentItem } from './i-potatno-document-item.ts';
import { PotatnoDocumentNode, PotatnoDocumentNodeConstructorParameter, PotatnoDocumentNodePortConfiguration, PotatnoDocumentNodeTransformation } from "./potatno-document-node.ts";
import { PotatnoDocument, PotatnoDocumentPortValidationError } from "./potatno-document.ts";

/**
 * Represents a user-editable function containing a sub-graph.
 */
export class PotatnoDocumentFunction<TProject extends PotatnoProject<any>> implements IPotatnoDocumentItem<TProject> {
    private mLabel: string;
    private readonly mDefinitionId: string;
    private readonly mDocument: PotatnoDocument<TProject>;
    private readonly mId: string;
    private readonly mImports: Array<string>;
    private readonly mInputs: Array<PotatnoDocumentFunctionPort>;
    private readonly mIsSystem: boolean;
    private readonly mNodes: Set<PotatnoDocumentNode<TProject>>;
    private readonly mOutputs: Array<PotatnoDocumentFunctionPort>;
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
     * Get all available node definitions for this document, including both project-level and function node definitions.
     */
    public get nodeDefinitions(): ReadonlyArray<PotatnoNodeDefinition<TProject>> {
        // Read the function definition from project.
        const lFunctionDefinition: PotatnoFunctionDefinition<TProject> | undefined = this.mProject.getFunction(this.definitionId);

        return [
            ...this.mDocument.nodeDefinitions,

            // When no definition is set, the result is empty.
            ...lFunctionDefinition?.getNodeDefinitions(this) ?? new Array<PotatnoNodeDefinition<TProject>>()
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
    public get inputs(): ReadonlyArray<PotatnoDocumentFunctionPort> {
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
    public get outputs(): ReadonlyArray<PotatnoDocumentFunctionPort> {
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
        this.mInputs = new Array<PotatnoDocumentFunctionPort>();
        this.mOutputs = new Array<PotatnoDocumentFunctionPort>();
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
    public addInput(pPort: PotatnoDocumentFunctionPort): void {
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
    public addOutput(pPort: PotatnoDocumentFunctionPort): void {
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
     * @param pSystem - Whether this is a system node.
     */
    public newNode(pDefinition: PotatnoNodeDefinition<TProject>, pTransformation: PotatnoDocumentNodeTransformation, pSystem: boolean = false): PotatnoDocumentNode<TProject> {
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
            isSystem: pSystem,
            label: pDefinition.label,
            transformation: pTransformation
        });

        this.mNodes.add(lNode);

        return lNode;
    }

    /**
     * Remove a node and disconnect all its ports from the graph.
     */
    public removeNode(pNode: PotatnoDocumentNode<TProject>): void {
        // Disconnect all ports of the node.
        for (const lPort of [...pNode.inputs.values(), ...pNode.outputs.values()]) {
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
    public removeInput(pPort: PotatnoDocumentFunctionPort): void {
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
    public removeOutput(pPort: PotatnoDocumentFunctionPort): void {
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
        const lDefinition = this.mProject.getFunction(this.mDefinitionId);
        if (!lDefinition) {
            lErrors.push(new PotatnoDocumentPortValidationError(`Function "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`, this));
        }

        // First pass: compute incoming region set for every node via memoized backward recursion.
        // Each top-level call receives a fresh visited set so cycle detection tracks only the current path.
        const lNodeRegionBuffer: Map<PotatnoDocumentNode<TProject>, Set<string>> = new Map<PotatnoDocumentNode<TProject>, Set<string>>();
        const lNodeRegions: Map<PotatnoDocumentNode<TProject>, Set<string>> = new Map<PotatnoDocumentNode<TProject>, Set<string>>();
        for (const lNode of this.mNodes) {
            lNodeRegions.set(lNode, this.accumulateRegions(lNode, lNodeRegionBuffer, new Set<PotatnoDocumentNode<TProject>>(), lErrors));
        }

        // Second pass: validate every node with its computed incoming regions.
        for (const lNode of this.mNodes) {
            lErrors.push(...lNode.validate(lNodeRegions.get(lNode)!));
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
        // Return cached result if this node was already resolved.
        // This also serves for terminating before recursion check, as buffered nodes are added after recursion has finished.
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
        for (const lInputPort of pNode.inputs.values()) {
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
                }
            }
        }

        // Save the computed regions in the buffer after anything is resolved to future iterations only take valid computed results.
        pBuffer.set(pNode, lNodeRegions);

        return lNodeRegions;
    }
}

export type PotatnoDocumentFunctionConstructorParameter = {
    definitionId: string;
    id: string;
    label: string;
    isSystem: boolean;
};

export type PotatnoDocumentFunctionPort = {
    label: string;
    dataType: string;
};