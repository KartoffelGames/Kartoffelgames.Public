import { Exception } from '@kartoffelgames/core';
import type { PotatnoNodeDefinition } from '../project/node_definition/potatno-node-definition.ts';
import type { PotatnoFunctionDefinition, PotatnoFunctionDefinitionNodes } from '../project/potatno-function-definition.ts';
import type { PotatnoPortDefinition } from '../project/potatno-port-definition.ts';
import type { PotatnoProjectTypeNames, PotatnoProjectTypesDefinition } from '../project/potatno-project-types-definition.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';
import type { IPotatnoDocumentItem } from './i-potatno-document-item.interface.ts';
import { PotatnoDocumentNode, type PotatnoDocumentNodePortConfiguration, type PotatnoDocumentNodeTransformation } from './potatno-document-node.ts';
import { PotatnoDocumentPortValidationError, PotatnoDocumentValidationResult } from "./potatno-document-validation-result.ts";
import { type PotatnoDocument } from './potatno-document.ts';

/**
 * Represents a user-editable function containing a sub-graph.
 */
export class PotatnoDocumentFunction<TProjectTypes extends PotatnoProjectTypesDefinition> implements IPotatnoDocumentItem<TProjectTypes> {
    private readonly mDefinitionId: string;
    private readonly mDocument: PotatnoDocument<TProjectTypes>;
    private readonly mId: string;
    private readonly mImportIds: Set<string>;
    private readonly mInputs: Array<PotatnoDocumentFunctionPort<TProjectTypes>>;
    private readonly mIsSystem: boolean;
    private mLabel: string;
    private readonly mNodes: Set<PotatnoDocumentNode<TProjectTypes>>;
    private readonly mOutputs: Array<PotatnoDocumentFunctionPort<TProjectTypes>>;
    private readonly mProject: PotatnoProject<TProjectTypes>;

    /**
     * The stable id of the function definition this function was created from.
     */
    public get definitionId(): string {
        return this.mDefinitionId;
    }

    /**
     * The document this function belongs to.
     */
    public get document(): PotatnoDocument<TProjectTypes> {
        return this.mDocument;
    }

    /**
     * Get all node definitions that can be dynamicly added or deleted by the user into this function.
     */
    public get dynamicNodeDefinitions(): ReadonlyArray<PotatnoNodeDefinition<TProjectTypes>> {
        // Read the function definition from project.
        const lFunctionDefinition: PotatnoFunctionDefinition<TProjectTypes> | undefined = this.mProject.getFunction(this.definitionId);
        if (!lFunctionDefinition) {
            return [...this.mDocument.nodeDefinitions];
        }

        const lFunctionNodes = lFunctionDefinition.getNodeDefinitions(this);
        const lImportedNodeDefinitions: Array<PotatnoNodeDefinition<TProjectTypes>> = this.mProject.imports
            .filter((pImportDefinition) => this.mImportIds.has(pImportDefinition.id))
            .flatMap((pImportDefinition) => pImportDefinition.nodes);

        return [
            ...this.mDocument.nodeDefinitions,
            ...lImportedNodeDefinitions,
            ...lFunctionNodes.dynamic
        ];
    }

    /**
     * Unique identifier for this function instance. Stable across sessions so it can be referenced as a node in other graphs.
     */
    public get id(): string {
        return this.mId;
    }

    /**
     * Get the list of import ids for this function.
     */
    public get imports(): ReadonlySet<string> {
        return this.mImportIds;
    }

    /**
     * Get the input port definitions for this function.
     */
    public get inputs(): ReadonlyArray<PotatnoDocumentFunctionPort<TProjectTypes>> {
        return this.mInputs;
    }

    /**
     * Get whether the function is a system-defined function.
     */
    public get isSystem(): boolean {
        return this.mIsSystem;
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
     * Get all available node definitions for this function.
     */
    public get nodeDefinitions(): ReadonlyArray<PotatnoNodeDefinition<TProjectTypes>> {
        // Read the function definition from project.
        const lFunctionDefinition: PotatnoFunctionDefinition<TProjectTypes> | undefined = this.mProject.getFunction(this.definitionId);
        if (!lFunctionDefinition) {
            return this.dynamicNodeDefinitions;
        }

        // Read all function nodes from definition.
        const lFunctionNodes = lFunctionDefinition.getNodeDefinitions(this);

        return [
            ...this.dynamicNodeDefinitions,
            ...lFunctionNodes.entry,
            ...lFunctionNodes.exit,
        ];
    }

    /**
     * Read-only set of all nodes in the graph.
     */
    public get nodes(): ReadonlySet<PotatnoDocumentNode<TProjectTypes>> {
        return this.mNodes;
    }

    /**
     * Get the output port definitions for this function.
     */
    public get outputs(): ReadonlyArray<PotatnoDocumentFunctionPort<TProjectTypes>> {
        return this.mOutputs;
    }

    /**
     * Get the project this function belongs to.
     */
    public get project(): PotatnoProject<TProjectTypes> {
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
    public constructor(pProject: PotatnoProject<TProjectTypes>, pDocument: PotatnoDocument<TProjectTypes>, pParameter: PotatnoDocumentFunctionConstructorParameter) {
        this.mProject = pProject;
        this.mDocument = pDocument;
        this.mLabel = pParameter.label;
        this.mIsSystem = pParameter.isSystem;
        this.mDefinitionId = pParameter.definitionId;
        this.mId = pParameter.id;
        this.mNodes = new Set<PotatnoDocumentNode<TProjectTypes>>();
        this.mInputs = new Array<PotatnoDocumentFunctionPort<TProjectTypes>>();
        this.mOutputs = new Array<PotatnoDocumentFunctionPort<TProjectTypes>>();
        this.mImportIds = new Set<string>();
    }

    /**
     * Add an import id to the function if it does not already exist.
     *
     * @param pImportId - The import id to add.
     */
    public addImport(pImportId: string): void {
        // Check if project has available import.
        const lContainsImport: boolean = this.project.imports.some((pImport) => {
            return pImport.id === pImportId;
        });

        // Throw if not.
        if (!lContainsImport) {
            throw new Exception(`Project does not contain import ${pImportId}`, this);
        }

        this.mImportIds.add(pImportId);
    }

    /**
     * Add an input port definition to the function.
     *
     * @param pPort - The port definition.
     */
    public addInput(pPort: PotatnoDocumentFunctionPort<TProjectTypes>): void {
        // Skip if port label already exists.
        if (this.mInputs.some((pExistingPort) => pExistingPort.label === pPort.label)) {
            return;
        }

        this.mInputs.push(pPort);
    }

    /**
     * Add a pre-constructed node directly.
     *
     * @param pNode - The node to add.
     */
    public addNode(pNode: PotatnoDocumentNode<TProjectTypes>): void {
        this.mNodes.add(pNode);
    }

    /**
     * Create a new node from a definition instance. Used by the editor when the user places a node.
     * The definition's ports and metadata are used to populate the node.
     *
     * @param pDefinition - The node definition to create the node from.
     * @param pTransformation - Initial grid position of the node.
     */
    public addNodeByDefinition(pDefinition: PotatnoNodeDefinition<TProjectTypes>, pTransformation: PotatnoDocumentNodeTransformation): PotatnoDocumentNode<TProjectTypes> {
        // Node definition to configuration converter.
        const lNodeConverter = (pPort: PotatnoPortDefinition<TProjectTypes>): PotatnoDocumentNodePortConfiguration<TProjectTypes> => {
            return {
                definitionId: pPort.id,
                label: pPort.label,
                portType: pPort.portType,
                dataType: pPort.dataType
            };
        };

        const lNode = new PotatnoDocumentNode<TProjectTypes>(this.mProject, this.mDocument, this, {
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
     * Add an output port definition to the function.
     *
     * @param pPort - The port definition.
     */
    public addOutput(pPort: PotatnoDocumentFunctionPort<TProjectTypes>): void {
        // Skip if port label already exists.
        if (this.mOutputs.some((pExistingPort) => pExistingPort.label === pPort.label)) {
            return;
        }

        this.mOutputs.push(pPort);
    }

    /**
     * Get document functions exit nodes.
     * Exit nodes are the starting point for every code generation.
     * 
     * @returns all defined nodes that are defined as the functions exit nodes.
     */
    public getExitNodes(): Array<PotatnoDocumentNode<TProjectTypes>> {
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
     * Remove an import id from the function.
     *
     * @param pImportId - The import id to remove.
     */
    public removeImport(pImportId: string): void {
        this.mImportIds.delete(pImportId);
    }

    /**
     * Remove an input port definition from the function.
     *
     * @param pPort - The port definition to remove.
     */
    public removeInput(pPort: PotatnoDocumentFunctionPort<TProjectTypes>): void {
        const lIndex = this.mInputs.findIndex((pExistingPort) => pExistingPort.label === pPort.label);
        if (lIndex !== -1) {
            this.mInputs.splice(lIndex, 1);
        }
    }

    /**
     * Remove a node and disconnect all its ports from the graph.
     */
    public removeNode(pNode: PotatnoDocumentNode<TProjectTypes>): void {
        // Disconnect all ports of the node.
        for (const lPort of [...pNode.inputs.list, ...pNode.outputs.list]) {
            for (const lConnectedPort of Array.from(lPort.connectedPorts)) {
                lPort.disconnect(lConnectedPort);
            }
        }

        this.mNodes.delete(pNode);
    }

    /**
     * Remove an output port definition from the function.
     *
     * @param pPort - The port definition to remove.
     */
    public removeOutput(pPort: PotatnoDocumentFunctionPort<TProjectTypes>): void {
        const lIndex = this.mOutputs.findIndex((pExistingPort) => pExistingPort.label === pPort.label);
        if (lIndex !== -1) {
            this.mOutputs.splice(lIndex, 1);
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
    public validate(): PotatnoDocumentValidationResult<TProjectTypes> {
        const lValidationResult: PotatnoDocumentValidationResult<TProjectTypes> = new PotatnoDocumentValidationResult<TProjectTypes>();

        // Check if this function's definition can still be found.
        const lDefinition: PotatnoFunctionDefinition<TProjectTypes> | undefined = this.mProject.getFunction(this.mDefinitionId);
        if (!lDefinition) {
            lValidationResult.pushError(new PotatnoDocumentPortValidationError(`Function "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`, this));
        }

        // Read node definitions once.
        const lNodeDefinitions: PotatnoFunctionDefinitionNodes<TProjectTypes> | undefined = lDefinition?.getNodeDefinitions(this);

        // Resync function nodes.
        if (lNodeDefinitions) {
            this.resyncFunction(lNodeDefinitions, lValidationResult);
        }

        // Compute incoming region set for every node.
        const lNodeRegions: Map<PotatnoDocumentNode<TProjectTypes>, Set<string>> = this.collectRegions(this.mNodes, lValidationResult);

        // Get all definition ids of entry nodes defined by the function definition.
        const lEntryNodeDefinitionIds = new Set(lNodeDefinitions?.entry.map((pNodeDefinition) => {
            return pNodeDefinition.id;
        }) ?? new Array<string>());

        // Second pass: validate every node with its computed incoming regions and entry domains.
        const lEntryNodeDomainBuffer: Map<PotatnoDocumentNode<TProjectTypes>, Set<PotatnoDocumentNode<TProjectTypes>>> = new Map<PotatnoDocumentNode<TProjectTypes>, Set<PotatnoDocumentNode<TProjectTypes>>>();
        for (const lNode of this.mNodes) {
            lValidationResult.merge(lNode.validate(lNodeRegions.get(lNode)!));

            if (this.collectEntryDomains(lNode, lEntryNodeDefinitionIds, lEntryNodeDomainBuffer).size > 1) {
                lValidationResult.pushError(new PotatnoDocumentPortValidationError(`Node "${lNode.label}" is reachable from multiple entry nodes.`, lNode));
            }
        }

        return lValidationResult;
    }

    /**
     * Recursively accumulate the set of entry node ids that can reach pNode by walking backwards
     * through all incoming connections. Memoized; cycles are silently skipped (already caught by accumulateRegions).
     *
     * @param pNode - The node whose entry domains should be computed.
     * @param pEntryNodesDefinitionIds - Set of definition ids that are considered entry nodes.
     * @param pBuffer - Memoization map shared across the entire validation pass.
     */
    private collectEntryDomains(pNode: PotatnoDocumentNode<TProjectTypes>, pEntryNodesDefinitionIds: Set<string>, pBuffer: Map<PotatnoDocumentNode<TProjectTypes>, Set<PotatnoDocumentNode<TProjectTypes>>>): Set<PotatnoDocumentNode<TProjectTypes>> {
        // Return cached result if this node was already resolved.
        // This also serves for terminating before recursion check, as buffered nodes are added after recursion has finished.
        if (pBuffer.has(pNode)) {
            return pBuffer.get(pNode)!;
        }

        const lDomains = new Set<PotatnoDocumentNode<TProjectTypes>>();

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
                for (const lEntryDomainNode of this.collectEntryDomains(lPredecessor, pEntryNodesDefinitionIds, pBuffer)) {
                    lDomains.add(lEntryDomainNode);
                }
            }
        }

        return lDomains;
    }

    /**
     * Recursively accumulate the incoming region set for every node by walking backwards through all incoming connections.
     *
     * A node's incoming regions are the union of every predecessor's accumulated regions plus the regions each predecessor adds.
     *
     * The current recursion path is tracked for cycle detection. 
     * When a node is encountered that is already on the current path, an error is reported and recursion stops for that branch.
     *
     * @param pNodes - Nodes for region collection.
     * @param pErrors - Error list to append cycle validation errors to.
     *
     * @returns The accumulated incoming region set for every node.
     */
    private collectRegions(pNodes: Iterable<PotatnoDocumentNode<TProjectTypes>>, pValidationResult: PotatnoDocumentValidationResult<TProjectTypes>): Map<PotatnoDocumentNode<TProjectTypes>, Set<string>> {
        // Cache node and port definitions for fast connection traversal.
        const lNodeDefinitions: Map<string, PotatnoNodeDefinition<TProjectTypes>> = new Map<string, PotatnoNodeDefinition<TProjectTypes>>();
        for (const lNodeDefinition of this.nodeDefinitions) {
            lNodeDefinitions.set(lNodeDefinition.id, lNodeDefinition);
        }

        // Get regions for a output port, caches the port region result.
        const lGetPortRegions = (() => {
            // Define functions port definition cache.
            const lOutputPortRegionsByDefinitionId: Map<string, Map<string, ReadonlyArray<string>>> = new Map<string, Map<string, ReadonlyArray<string>>>();

            return (pNodeDefinition: PotatnoNodeDefinition<TProjectTypes>, pPortDefinitionId: string): ReadonlyArray<string> => {
                // Read cached output port regions.
                if (!lOutputPortRegionsByDefinitionId.has(pNodeDefinition.id)) {
                    // Fill in regions for all ports.
                    const lOutputPortRegions: Map<string, ReadonlyArray<string>> = new Map<string, ReadonlyArray<string>>();
                    for (const lOutputPortDefinition of pNodeDefinition.outputs) {
                        lOutputPortRegions.set(lOutputPortDefinition.id, lOutputPortDefinition.regions.add);
                    }

                    lOutputPortRegionsByDefinitionId.set(pNodeDefinition.id, lOutputPortRegions);
                }

                // Read potential port definition regions.
                return [
                    ...lOutputPortRegionsByDefinitionId.get(pNodeDefinition.id)!.get(pPortDefinitionId) ?? new Array<string>(),
                    ...pNodeDefinition.regions.add
                ];
            };
        })();

        // Recursive backwards collection of nodes. Also fills lGlobalNodeRegionBuffer.
        const lResolveNodeRegions = (() => {
            const lNodeRegionBuffer: Map<PotatnoDocumentNode<TProjectTypes>, Set<string>> = new Map<PotatnoDocumentNode<TProjectTypes>, Set<string>>();

            return (pNode: PotatnoDocumentNode<TProjectTypes>, pVisitedNodes: Set<PotatnoDocumentNode<TProjectTypes>>): Set<string> => {
                // Return cached result if this node was already resolved.
                if (lNodeRegionBuffer.has(pNode)) {
                    return lNodeRegionBuffer.get(pNode)!;
                }

                // Cycle detected: this node is already on the current recursion path.
                if (pVisitedNodes.has(pNode)) {
                    pValidationResult.pushError(new PotatnoDocumentPortValidationError(`Node "${pNode.label}" is part of a connection cycle.`, pNode));
                    return new Set<string>();
                }

                pVisitedNodes.add(pNode);

                const lCurrentNodeRegions: Set<string> = new Set<string>();

                // Walk all incoming connections.
                for (const lInputPort of pNode.inputs.list) {
                    for (const lConnectedPort of lInputPort.connectedPorts) {
                        // Read predecessor node from port.
                        const lPortNode: PotatnoDocumentNode<TProjectTypes> = lConnectedPort.node;

                        // Recursive merge regions from previous nodes.
                        for (const lRegion of lResolveNodeRegions(lPortNode, pVisitedNodes)) {
                            lCurrentNodeRegions.add(lRegion);
                        }

                        // Skip processing when node has no definition.
                        if (!lNodeDefinitions.has(lPortNode.definitionId)) {
                            continue;
                        }

                        // Merge all regions from node and port.
                        for (const lRegion of lGetPortRegions(lNodeDefinitions.get(lPortNode.definitionId)!, lConnectedPort.definitionId)) {
                            lCurrentNodeRegions.add(lRegion);
                        }
                    }
                }

                lNodeRegionBuffer.set(pNode, lCurrentNodeRegions);

                return lCurrentNodeRegions;
            };
        })();

        // Resolve every node once through recursive traversal.
        const lNodeRegions: Map<PotatnoDocumentNode<TProjectTypes>, Set<string>> = new Map<PotatnoDocumentNode<TProjectTypes>, Set<string>>();
        for (const lNode of pNodes) {
            lNodeRegions.set(lNode, lResolveNodeRegions(lNode, new Set<PotatnoDocumentNode<TProjectTypes>>()));
        }

        return lNodeRegions;
    }

    /**
     * Resync system nodes.
     * Ensures all system nodes are present at any time during validation. 
     * 
     * @param pNodeDefinitions - node definitions of this function. 
     */
    private resyncFunction(pNodeDefinitions: PotatnoFunctionDefinitionNodes<TProjectTypes>, pValidationResult: PotatnoDocumentValidationResult<TProjectTypes>): void {
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

            // Generate a new node.
            const lNewNode = this.addNodeByDefinition(lSystemNodeDefinition, {
                // First half left (x:2) second half right (x: 20).
                x: (Math.floor(lNodeCounter / (lSystemNodes.length / 2)) * lItemSpacing) + 2,

                // First half and second half both start at (y: 2)
                y: (lNodeCounter * lItemSpacing) + 2 - (Math.floor(lNodeCounter / (lSystemNodes.length / 2)) * ((lSystemNodes.length / 2) * lItemSpacing)),

                width: 0, height: 0
            });

            // Add new node as affected item.
            pValidationResult.addAffectedItem(lNewNode);

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

export type PotatnoDocumentFunctionPort<TProjectTypes extends PotatnoProjectTypesDefinition> = {
    label: string;
    dataType: PotatnoProjectTypeNames<TProjectTypes>;
};
