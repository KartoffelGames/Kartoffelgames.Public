import { PotatnoPortDefinition, PotatnoPortDefinitionDirection, PotatnoPortDefinitionType } from "../project/potatno-port-definition.ts";
import { PotatnoProjectGenericType, PotatnoProjectType } from "../project/potatno-project-types-definition.ts";
import type { PotatnoProject } from '../project/potatno-project.ts';
import type { IPotatnoDocumentItem } from './i-potatno-document-item.ts';
import type { PotatnoDocumentFunction } from './potatno-document-function.ts';
import { PotatnoDocumentPort } from './potatno-document-port.ts';
import { PotatnoDocument, PotatnoDocumentPortValidationError } from "./potatno-document.ts";

/**
 * A node instance in the graph.
 */
export class PotatnoDocumentNode<TProject extends PotatnoProject<any>> implements IPotatnoDocumentItem<TProject> {
    private readonly mCategory: string;
    private readonly mDefinitionId: string;
    private readonly mDocument: PotatnoDocument<TProject>;
    private readonly mFunction: PotatnoDocumentFunction<TProject>;
    private readonly mInputs: Map<string, PotatnoDocumentPort<TProject>>;
    private mLabel: string;
    private readonly mOutputs: Map<string, PotatnoDocumentPort<TProject>>;
    private readonly mIsSystem: boolean;
    private readonly mTransformation: PotatnoDocumentNodeTransformation;
    private readonly mProject: TProject;

    /**
     * Get the stable id of the definition this node was created from.
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
     * The function this node belongs to.
     */
    public get function(): PotatnoDocumentFunction<TProject> {
        return this.mFunction;
    }

    /**
     * Get the data input ports of the node.
     */
    public get inputs(): Map<string, PotatnoDocumentPort<TProject>> {
        return this.mInputs;
    }

    /**
     * Get the data output ports of the node.
     */
    public get outputs(): Map<string, PotatnoDocumentPort<TProject>> {
        return this.mOutputs;
    }

    /**
     * Get the project this node belongs to.
     */
    public get project(): TProject {
        return this.mProject;
    }

    /**
     * Get the grid position and size of the node.
     */
    public get transformation(): PotatnoDocumentNodeTransformation {
        return this.mTransformation;
    }

    /**
     * Get the category of the node's definition. Uses the snapshot set at creation time.
     */
    public get category(): string {
        return this.mCategory;
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
     * Get whether this is a system node that cannot be removed.
     */
    public get isSystem(): boolean {
        return this.mIsSystem;
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
    public constructor(pProject: TProject, pDocument: PotatnoDocument<TProject>, pFunction: PotatnoDocumentFunction<TProject>, pParameter: PotatnoDocumentNodeConstructorParameter<TProject>) {
        this.mCategory = pParameter.category;
        this.mDocument = pDocument;
        this.mDefinitionId = pParameter.definitionId;
        this.mFunction = pFunction;
        this.mIsSystem = pParameter.isSystem;
        this.mLabel = pParameter.label;
        this.mProject = pProject;
        this.mTransformation = pParameter.transformation;

        // Create ports from input configurations.
        this.mInputs = new Map<string, PotatnoDocumentPort<TProject>>();
        for (const lPort of pParameter.ports.input) {
            this.mInputs.set(lPort.definitionId, new PotatnoDocumentPort(this.mProject, this.mDocument, {
                definitionId: lPort.definitionId,
                direction: 'input',
                label: lPort.label,
                node: this,
                portType: lPort.portType,
                dataType: lPort.dataType
            }));
        }

        // Create ports from output configurations.
        this.mOutputs = new Map<string, PotatnoDocumentPort<TProject>>();
        for (const lPort of pParameter.ports.output) {
            this.mOutputs.set(lPort.definitionId, new PotatnoDocumentPort(this.mProject, this.mDocument, {
                definitionId: lPort.definitionId,
                direction: 'output',
                label: lPort.label,
                node: this,
                portType: lPort.portType,
                dataType: lPort.dataType
            }));
        }
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
    public resizeTo(pW: number, pH: number): void {
        this.mTransformation.width = Math.max(4, pW);
        this.mTransformation.height = Math.max(2, pH);
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
    public validate(pIncomingRegions: ReadonlySet<string>): Array<PotatnoDocumentPortValidationError<TProject>> {
        const lErrors: Array<PotatnoDocumentPortValidationError<TProject>> = new Array<PotatnoDocumentPortValidationError<TProject>>();

        // Find the definition in the function's available node definitions.
        const lNodeDefinition = this.mFunction.nodeDefinitions.find((pDef) => pDef.id === this.mDefinitionId);
        if (!lNodeDefinition) {
            lErrors.push(new PotatnoDocumentPortValidationError(`Node "${this.mLabel}" definition "${this.mDefinitionId}" could not be found.`, this));
        } else {
            // Resync inputs and outputs against the current definition.
            lErrors.push(...this.resyncPorts(this.mInputs, lNodeDefinition.inputs, 'input'));
            lErrors.push(...this.resyncPorts(this.mOutputs, lNodeDefinition.outputs, 'output'));

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
        for (const lPort of [...this.mInputs.values(), ...this.mOutputs.values()]) {
            lErrors.push(...lPort.validate());
        }

        return lErrors;
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
    private resyncPorts(pPortMap: Map<string, PotatnoDocumentPort<TProject>>, pPortDefinitions: ReadonlyArray<PotatnoPortDefinition<TProject>>, pDirection: PotatnoPortDefinitionDirection): Array<PotatnoDocumentPortValidationError<TProject>> {
        const lErrors: Array<PotatnoDocumentPortValidationError<TProject>> = new Array<PotatnoDocumentPortValidationError<TProject>>();

        // Create a set of existing port definition ids.
        const lExistingPortDefinitionIds = new Set(pPortDefinitions.map((pPort) => pPort.id));

        // Process ports present in the definition (new or potentially changed).
        for (const lDefPort of pPortDefinitions) {
            // Port is new — add silently.
            if (!pPortMap.has(lDefPort.id)) {
                pPortMap.set(lDefPort.id, new PotatnoDocumentPort<TProject>(this.mProject, this.mDocument, {
                    definitionId: lDefPort.id,
                    direction: pDirection,
                    label: lDefPort.label,
                    node: this,
                    portType: lDefPort.portType,
                    dataType: lDefPort.dataType
                }));

                continue;
            }

            const lExistingPort: PotatnoDocumentPort<TProject> = pPortMap.get(lDefPort.id)!;

            // Compare portType and dataType. dataType is '' for flow ports on the document port side.
            const lPortTypeChanged: boolean = lExistingPort.portType !== lDefPort.portType;
            const lDataTypeChanged: boolean = lExistingPort.dataType !== lDefPort.dataType;

            // Port is unchanged.
            if (!lPortTypeChanged && !lDataTypeChanged) {
                continue;
            }

            // Connected and portType changed — cannot safely replace; add validation error and keep as-is.
            if (lExistingPort.connectedPorts.size > 0 || lPortTypeChanged) {
                lErrors.push(new PotatnoDocumentPortValidationError(`Port "${lExistingPort.label}" on node "${this.mLabel}" has a changed type.`, lExistingPort));
                continue;
            }

            // Port config has changed but can be safely replaced without risking broken connections.
            this.replacePort(pPortMap, lExistingPort, lDefPort, pDirection);
        }

        // Process ports on the node that are no longer in the definition.
        for (const [lId, lPort] of pPortMap.entries()) {
            // Skip ports that are still present in the definition.
            if (lExistingPortDefinitionIds.has(lId)) {
                continue;
            }

            // Silently remove unconnected ports that are no longer in the definition.
            if (lPort.connectedPorts.size === 0) {
                pPortMap.delete(lId);
                continue;
            }

            // Connected — add validation error and keep as-is.
            lErrors.push(new PotatnoDocumentPortValidationError(`Port "${lPort.label}" on node "${this.mLabel}" no longer exists in its definition.`, lPort));
        }

        return lErrors;
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
    private replacePort(pPortMap: Map<string, PotatnoDocumentPort<TProject>>, pOldPort: PotatnoDocumentPort<TProject>, pPortDefinition: PotatnoPortDefinition<TProject>, pDirection: PotatnoPortDefinitionDirection): PotatnoDocumentPort<TProject> {
        // Copy connected ports before replacing to avoid concurrent modification issues.
        const lOldConnections: Array<PotatnoDocumentPort<TProject>> = Array.from(pOldPort.connectedPorts);

        // Disconnect all connections from the old port.
        // Copy ports before disconnecting to avoid concurrent modification issues.
        for (const lConn of Array.from(pOldPort.connectedPorts)) {
            pOldPort.disconnect(lConn);
        }

        // Create new port from definition.
        const lNewPort: PotatnoDocumentPort<TProject> = new PotatnoDocumentPort<TProject>(this.mProject, this.mDocument, {
            definitionId: pPortDefinition.id,
            direction: pDirection,
            label: pPortDefinition.label,
            node: this,
            portType: pPortDefinition.portType,
            dataType: pPortDefinition.dataType
        });

        // Add port to eighter inputs or outputs map depending on its direction.
        pPortMap.set(pPortDefinition.id, lNewPort);

        // Create a new port and replace the connections.
        for (const lConnection of lOldConnections) {
            lNewPort.connect(lConnection);
        }

        return lNewPort;
    }
}

export type PotatnoDocumentNodeConstructorParameter<TProject extends PotatnoProject<any>> = {
    category: string,
    definitionId: string,
    isSystem: boolean,
    label: string,
    ports: {
        input: Array<PotatnoDocumentNodePortConfiguration<TProject>>,
        output: Array<PotatnoDocumentNodePortConfiguration<TProject>>;
    };
    transformation: PotatnoDocumentNodeTransformation,
};

export type PotatnoDocumentNodePortConfiguration<TProject extends PotatnoProject<any>> = {
    dataType: PotatnoProjectType<TProject> | PotatnoProjectGenericType | null;
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
