import { Exception } from '@kartoffelgames/core';
import type { PotatnoPortDefinition, PotatnoPortDefinitionDirection, PotatnoPortDefinitionType } from '../project/potatno-port-definition.ts';
import type { PotatnoProjectGenericType, PotatnoProjectTypeNames, PotatnoProjectTypesDefinition } from '../project/potatno-project-types-definition.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';
import type { IPotatnoDocumentItem } from './i-potatno-document-item.interface.ts';
import type { PotatnoDocumentFunction } from './potatno-document-function.ts';
import { PotatnoDocumentPort } from './potatno-document-port.ts';
import { type PotatnoDocument, PotatnoDocumentPortValidationError } from './potatno-document.ts';

/**
 * A node instance in the graph.
 */
export class PotatnoDocumentNode<TProjectTypes extends PotatnoProjectTypesDefinition> implements IPotatnoDocumentItem<TProjectTypes> {
    private readonly mCategory: string;
    private readonly mDefinitionId: string;
    private readonly mDocument: PotatnoDocument<TProjectTypes>;
    private readonly mFunction: PotatnoDocumentFunction<TProjectTypes>;
    private readonly mInputs: PotatnoDocumentNodePortsInternal<TProjectTypes>;
    private mLabel: string;
    private readonly mOutputs: PotatnoDocumentNodePortsInternal<TProjectTypes>;
    private mPreview: PotatnoDocumentNodePreviewBinding | null;
    private readonly mProject: PotatnoProject<TProjectTypes>;
    private readonly mTransformation: PotatnoDocumentNodeTransformation;

    /**
     * Get the category of the node's definition. Uses the snapshot set at creation time.
     */
    public get category(): string {
        return this.mCategory;
    }

    /**
     * Get the stable id of the definition this node was created from.
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
     * The function this node belongs to.
     */
    public get function(): PotatnoDocumentFunction<TProjectTypes> {
        return this.mFunction;
    }

    /**
     * If node has any flow ports.
     */
    public get hasFlowPorts(): boolean {
        return this.mOutputs.flow.length > 0 || this.mInputs.flow.length > 0;
    }

    /**
     * If node has any flow ports.
     */
    public get hasValuePorts(): boolean {
        return this.mOutputs.value.length > 0 || this.mInputs.value.length > 0;
    }

    /**
     * Get the data input ports of the node.
     */
    public get inputs(): PotatnoDocumentNodePorts<TProjectTypes> {
        return this.mInputs;
    }

    /**
     * Get or set the user-overridable display label of the node.
     */
    public get label(): string {
        return this.mLabel;
    } set label(pLabel: string) {
        this.mLabel = pLabel;
    }

    /**
     * Get the data output ports of the node.
     */
    public get outputs(): PotatnoDocumentNodePorts<TProjectTypes> {
        return this.mOutputs;
    }

    /**
     * Per-node preview opt-in. `null` when the node has no preview displayed; otherwise the
     * pairing of which output port to expose and which registered display id should render it.
     * The framework picks up changes here on the next preview rebuild.
     */
    public get preview(): PotatnoDocumentNodePreviewBinding | null {
        return this.mPreview;
    } set preview(pValue: PotatnoDocumentNodePreviewBinding | null) {
        this.mPreview = pValue;
    }

    /**
     * Get the project this node belongs to.
     */
    public get project(): PotatnoProject<TProjectTypes> {
        return this.mProject;
    }

    /**
     * Get the grid position and size of the node.
     */
    public get transformation(): Readonly<PotatnoDocumentNodeTransformation> {
        return this.mTransformation;
    }

    /**
     * Create a new node from explicit port data. Used by the deserializer to reconstruct
     * nodes without requiring a live definition instance, enabling loading of documents
     * with changed or removed definitions.
     *
     * @param pProject - The project this node belongs to.
     * @param pDocument - The document this node belongs to.
     * @param pParameter - Constructor parameters.
     */
    public constructor(pProject: PotatnoProject<TProjectTypes>, pDocument: PotatnoDocument<TProjectTypes>, pFunction: PotatnoDocumentFunction<TProjectTypes>, pParameter: PotatnoDocumentNodeConstructorParameter<TProjectTypes>) {
        this.mCategory = pParameter.category;
        this.mDocument = pDocument;
        this.mDefinitionId = pParameter.definitionId;
        this.mFunction = pFunction;
        this.mLabel = pParameter.label;
        this.mPreview = pParameter.preview ?? null;
        this.mProject = pProject;
        this.mTransformation = pParameter.transformation;

        const lCreatePortMapping = (pPorts: Array<PotatnoDocumentNodePortConfiguration<TProjectTypes>>, pDirection: PotatnoPortDefinitionDirection): PotatnoDocumentNodePortsInternal<TProjectTypes> => {
            const lNodePorts: PotatnoDocumentNodePortsInternal<TProjectTypes> = {
                direction: pDirection,
                list: new Array<PotatnoDocumentPort<TProjectTypes>>(),
                map: new Map<string, PotatnoDocumentPort<TProjectTypes>>(),
                flow: new Array<PotatnoDocumentPort<TProjectTypes>>(),
                value: new Array<PotatnoDocumentPort<TProjectTypes>>()
            };

            // Single loop to fill in.
            for (const lPort of pPorts) {
                // Create new port.
                const lDocumentPort: PotatnoDocumentPort<TProjectTypes> = new PotatnoDocumentPort(this.mProject, this.mDocument, {
                    definitionId: lPort.definitionId,
                    direction: pDirection,
                    label: lPort.label,
                    node: this,
                    portType: lPort.portType,
                    dataType: lPort.dataType
                });

                lNodePorts.list.push(lDocumentPort);
                lNodePorts.map.set(lDocumentPort.definitionId, lDocumentPort);

                // Assign port to its typed list.
                const lTypedList: Array<PotatnoDocumentPort<TProjectTypes>> = lDocumentPort.portType === 'flow' ? lNodePorts.flow : lNodePorts.value;
                lTypedList.push(lDocumentPort);
            }

            return lNodePorts;
        };

        // Create ports from input configurations.
        this.mInputs = lCreatePortMapping(pParameter.ports.input, 'input');
        this.mOutputs = lCreatePortMapping(pParameter.ports.output, 'output');
    }

    /**
     * Move the node to a new grid position.
     */
    public moveTo(pX: number, pY: number): void {
        this.mTransformation.x = pX;
        this.mTransformation.y = pY;
    }

    /**
     * Resize the node (comment nodes).
     */
    public resizeTo(pWidth: number, pHeight: number): void {
        // Min size to [4, 4] so the UI cant break for [0, 0] sized nodes.
        this.mTransformation.width = Math.max(4, pWidth);
        this.mTransformation.height = Math.max(4, pHeight);
    }

    /**
     * Validate all ports of this node and return any errors found.
     * Also resyncs ports against the current definition: adds new ports, removes obsolete
     * unconnected ports, and replaces changed ports when safe to do so.
     *
     * Region validation is performed against the provided incoming region set.
     * Regions in `requires` must all be present; regions not in `requires` or `allows` are rejected.
     *
     * @param pIncomingRegions - The set of regions active at this node's position in the flow graph.
     *
     * @return An array of validation errors found on this node's ports.
     */
    public validate(pIncomingRegions: ReadonlySet<string>): Array<PotatnoDocumentPortValidationError<TProjectTypes>> {
        const lErrors: Array<PotatnoDocumentPortValidationError<TProjectTypes>> = new Array<PotatnoDocumentPortValidationError<TProjectTypes>>();

        // Find the definition in the function's available node definitions.
        const lNodeDefinition = this.mFunction.nodeDefinitions.find((pDef) => pDef.id === this.mDefinitionId);
        if (!lNodeDefinition) {
            lErrors.push(new PotatnoDocumentPortValidationError(`Node "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`, this));
        } else {
            // Resync inputs and outputs against the current definition.
            lErrors.push(...this.resyncPorts(this.mInputs, lNodeDefinition.inputs));
            lErrors.push(...this.resyncPorts(this.mOutputs, lNodeDefinition.outputs));

            // Validate region constraints.
            const lAllowedRegions = new Set<string>([...lNodeDefinition.regions.requires, ...lNodeDefinition.regions.allows]);

            // Every region that is active but not allowed by this node is an error.
            if (lAllowedRegions.size > 0) {
                for (const lRegion of pIncomingRegions) {
                    if (!lAllowedRegions.has(lRegion)) {
                        lErrors.push(new PotatnoDocumentPortValidationError(`Node "${this.mLabel}" does not allow region "${lRegion}".`, this));
                    }
                }
            }

            // Every required region must be present in the incoming set.
            if (lNodeDefinition.regions.requires.length > 0) {
                for (const lRequiredRegion of lNodeDefinition.regions.requires) {
                    if (!pIncomingRegions.has(lRequiredRegion)) {
                        lErrors.push(new PotatnoDocumentPortValidationError(`Node "${this.mLabel}" requires region "${lRequiredRegion}" but it is not active.`, this));
                    }
                }
            }
        }

        // Run port-level validation.
        for (const lPort of [...this.mInputs.list, ...this.mOutputs.list]) {
            lErrors.push(...lPort.validate());
        }

        return lErrors;
    }

    /**
     * Add a new port. Hopefully in the correct order.
     *
     * @param pPortMapping - Port mapping of node. 
     * @param pPortDefinition - Port definition of new node.
     *
     * @returns the created document port.
     */
    private addPort(pPortMapping: PotatnoDocumentNodePortsInternal<TProjectTypes>, pPortDefinition: PotatnoPortDefinition<TProjectTypes>, pOrderIndex: number): PotatnoDocumentPort<TProjectTypes> {
        // Create new port.
        const lDocumentPort: PotatnoDocumentPort<TProjectTypes> = new PotatnoDocumentPort(this.mProject, this.mDocument, {
            definitionId: pPortDefinition.id,
            direction: pPortMapping.direction,
            label: pPortDefinition.label,
            node: this,
            portType: pPortDefinition.portType,
            dataType: pPortDefinition.dataType
        });

        // Assign it to correct lists.
        pPortMapping.list.splice(pOrderIndex, 0, lDocumentPort);
        pPortMapping.map.set(lDocumentPort.definitionId, lDocumentPort);

        // Assign port to its typed list.
        const lTypedList: Array<PotatnoDocumentPort<TProjectTypes>> = lDocumentPort.portType === 'flow' ? pPortMapping.flow : pPortMapping.value;
        lTypedList.push(lDocumentPort);

        return lDocumentPort;
    }

    /**
     * Remove port and return the order index of the removed port.
     * 
     * @param pPortMap - The port map to operate on (inputs or outputs).
     * @param pPort - The port that should be deleted.
     */
    private removePort(pPortMap: PotatnoDocumentNodePortsInternal<TProjectTypes>, pPort: PotatnoDocumentPort<TProjectTypes>): number {
        // Read index of port in ordered list.
        const lIndex: number = pPortMap.list.indexOf(pPort);
        if (lIndex === -1) {
            throw new Exception(`Port "${pPort.label}" was not found and can not be removed.`, this);
        }

        // Remove from mapping and ordered list.
        pPortMap.list.splice(lIndex, 1);
        pPortMap.map.delete(pPort.definitionId);

        // Find the index of the port in the typed port list.
        const lTypedList: Array<PotatnoDocumentPort<TProjectTypes>> = pPort.portType === 'flow' ? pPortMap.flow : pPortMap.value;
        const lTypedIndex: number = lTypedList.indexOf(pPort);
        if (lIndex === -1) {
            throw new Exception(`Port "${pPort.label}" was not found in typed list and can not be removed.`, this);
        }

        // Remove port from typed list.
        lTypedList.splice(lTypedIndex, 1);

        return lIndex;
    }

    /**
     * Disconnect and remove an existing port from the map, then create and insert a replacement
     * built from the given definition port.
     * 
     * @param pPortMap - The port map to operate on (inputs or outputs).
     * @param pOldPort - The existing port to replace. All connections will be disconnected.
     * @param pPortDefinition - The new port definition to create the replacement from.
     * @param pDirection - The direction of the port (input or output).
     * 
     * @returns The newly created port instance.
     */
    private replacePort(pPortMap: PotatnoDocumentNodePortsInternal<TProjectTypes>, pOldPort: PotatnoDocumentPort<TProjectTypes>, pPortDefinition: PotatnoPortDefinition<TProjectTypes>): PotatnoDocumentPort<TProjectTypes> {
        // Copy connected ports before replacing to avoid concurrent modification issues.
        const lOldConnections: Array<PotatnoDocumentPort<TProjectTypes>> = Array.from(pOldPort.connectedPorts);

        // Disconnect all connections from the old port.
        // Copy ports before disconnecting to avoid concurrent modification issues.
        for (const lConnection of Array.from(pOldPort.connectedPorts)) {
            pOldPort.disconnect(lConnection);
        }

        // Add port to eighter inputs or outputs map depending on its direction.
        const lOrderIndex: number = this.removePort(pPortMap, pOldPort);
        const lNewPort: PotatnoDocumentPort<TProjectTypes> = this.addPort(pPortMap, pPortDefinition, lOrderIndex);

        // Create a new port and replace the connections.
        for (const lConnection of lOldConnections) {
            lNewPort.connect(lConnection);
        }

        return lNewPort;
    }

    /**
     * Synchronise a port map (inputs or outputs) against the current definition ports.
     * - New definition ports are added silently.
     * - Changed ports (portType or dataType differs) are replaced when safe; a validation error is added when a type-changed port still has connections.
     * - Ports absent from the definition are removed silently when unconnected, or kept with a validation error when connected.
     *
     * @param pPortMap - The port map to resync (inputs or outputs).
     * @param pPortDefinitions - The current definition ports to sync against.
     * @param pDirection - The direction of the ports (input or output).
     *
     * @returns An array of validation errors found during resync.
     */
    private resyncPorts(pCurrentPorts: PotatnoDocumentNodePortsInternal<TProjectTypes>, pPortDefinitions: ReadonlyArray<PotatnoPortDefinition<TProjectTypes>>): Array<PotatnoDocumentPortValidationError<TProjectTypes>> {
        const lErrors: Array<PotatnoDocumentPortValidationError<TProjectTypes>> = new Array<PotatnoDocumentPortValidationError<TProjectTypes>>();

        // Create a set of existing port definition ids.
        const lExistingPortDefinitionIds = new Set(pPortDefinitions.map((pPort) => pPort.id));

        // Process ports present in the definition (new or potentially changed).
        for (let lPortDefinitionIndex: number = 0; lPortDefinitionIndex < pPortDefinitions.length; lPortDefinitionIndex++) {
            const lPortDefinition: PotatnoPortDefinition<TProjectTypes> = pPortDefinitions[lPortDefinitionIndex];

            // Port is new,add silently.
            if (!pCurrentPorts.map.has(lPortDefinition.id)) {
                this.addPort(pCurrentPorts, lPortDefinition, lPortDefinitionIndex);
                continue;
            }

            const lExistingPort: PotatnoDocumentPort<TProjectTypes> = pCurrentPorts.map.get(lPortDefinition.id)!;

            // Compare portType and dataType. dataType is '' for flow ports on the document port side.
            const lPortTypeChanged: boolean = lExistingPort.portType !== lPortDefinition.portType;
            const lDataTypeChanged: boolean = lExistingPort.dataType !== lPortDefinition.dataType;

            // Port is unchanged.
            if (!lPortTypeChanged && !lDataTypeChanged) {
                continue;
            }

            // Connected and portType changed and cannot safely replace. Add validation error and keep as-is.
            if (lExistingPort.connectedPorts.size > 0 && lPortTypeChanged) {
                lErrors.push(new PotatnoDocumentPortValidationError(`Port "${lExistingPort.label}" on node "${this.mLabel}" has a changed type.`, lExistingPort));
                continue;
            }

            // Port config has changed but can be safely replaced without risking broken connections.
            this.replacePort(pCurrentPorts, lExistingPort, lPortDefinition);
        }

        // Process ports on the node that are no longer in the definition.
        for (const lPort of pCurrentPorts.list) {
            // Skip ports that are still present in the definition.
            if (lExistingPortDefinitionIds.has(lPort.definitionId)) {
                continue;
            }

            // Silently remove unconnected ports that are no longer in the definition.
            if (lPort.connectedPorts.size === 0) {
                this.removePort(pCurrentPorts, lPort);
                continue;
            }

            // The ports are connected. Add validation error and keep as-is.
            lErrors.push(new PotatnoDocumentPortValidationError(`Port "${lPort.label}" on node "${this.mLabel}" no longer exists in its definition.`, lPort));
        }

        return lErrors;
    }

}

/**
 * Ordered mapping of node ports but internal.
 */
type PotatnoDocumentNodePortsInternal<TProjectTypes extends PotatnoProjectTypesDefinition> = {
    /**
     * Direction of ports.
     */
    direction: PotatnoPortDefinitionDirection;

    /**
     * All ports in order.
     */
    list: Array<PotatnoDocumentPort<TProjectTypes>>;

    /**
     * Map of port definition id and port.
     */
    map: Map<string, PotatnoDocumentPort<TProjectTypes>>;

    /**
     * Flow ports.
     */
    flow: Array<PotatnoDocumentPort<TProjectTypes>>;

    /**
     * Flow ports.
     */
    value: Array<PotatnoDocumentPort<TProjectTypes>>;
};

/**
 * Ordered mapping of node ports.
 */
export type PotatnoDocumentNodePorts<TProjectTypes extends PotatnoProjectTypesDefinition> = {
    /**
     * All ports in order.
     */
    list: ReadonlyArray<PotatnoDocumentPort<TProjectTypes>>;

    /**
     * Map of port definition id and port.
     */
    map: ReadonlyMap<string, PotatnoDocumentPort<TProjectTypes>>;

    /**
     * Flow ports.
     */
    flow: ReadonlyArray<PotatnoDocumentPort<TProjectTypes>>;

    /**
     * Flow ports.
     */
    value: ReadonlyArray<PotatnoDocumentPort<TProjectTypes>>;
};

export type PotatnoDocumentNodeConstructorParameter<TProjectTypes extends PotatnoProjectTypesDefinition> = {
    category: string,
    definitionId: string,
    label: string,
    ports: {
        input: Array<PotatnoDocumentNodePortConfiguration<TProjectTypes>>,
        output: Array<PotatnoDocumentNodePortConfiguration<TProjectTypes>>;
    };
    preview?: PotatnoDocumentNodePreviewBinding | null,
    transformation: PotatnoDocumentNodeTransformation,
};

/**
 * Per-node preview opt-in payload. Identifies which value output port to evaluate and which
 * registered display should host the rendering. Stored alongside the node and persisted by
 * the serializer so the choice survives a save/load roundtrip.
 */
export type PotatnoDocumentNodePreviewBinding = {
    /**
     * Definition id of the value output port to preview.
     */
    portId: string;

    /**
     * Id of the registered display the framework should pair with the node's bound executor.
     */
    displayId: string;
};

export type PotatnoDocumentNodePortConfiguration<TProjectTypes extends PotatnoProjectTypesDefinition> = {
    dataType: PotatnoProjectTypeNames<TProjectTypes> | PotatnoProjectGenericType | null;
    definitionId: string;
    label: string;
    portType: PotatnoPortDefinitionType;
};

export type PotatnoDocumentNodeTransformation = {
    x: number;
    y: number;
    width: number;
    height: number;
};
