import { PotatnoPortDefinitionType } from "../project/potatno-port-definition.ts";
import { PotatnoProjectType } from "../project/potatno-project-types-definition.ts";
import type { PotatnoProject } from '../project/potatno-project.ts';
import type { IPotatnoDocumentItem } from './i-potatno-document-item.ts';
import { PotatnoDocumentPort } from './potatno-document-port.ts';
import { PotatnoDocument, PotatnoDocumentPortValidationError } from "./potatno-document.ts";

/**
 * A node instance in the graph.
 */
export class PotatnoDocumentNode<TProject extends PotatnoProject<any>> implements IPotatnoDocumentItem<TProject> {
    private readonly mCategory: string;
    private readonly mDefinitionId: string;
    private readonly mDocument: PotatnoDocument<TProject>;
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
    public constructor(pProject: TProject, pDocument: PotatnoDocument<TProject>, pParameter: PotatnoDocumentNodeConstructorParameter<TProject>) {
        this.mCategory = pParameter.category;
        this.mDocument = pDocument;
        this.mDefinitionId = pParameter.definitionId;
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
     */
    public validate(): Array<PotatnoDocumentPortValidationError<TProject>> {
        const lErrors: Array<PotatnoDocumentPortValidationError<TProject>> = new Array<PotatnoDocumentPortValidationError<TProject>>();

        for (const lPort of [...this.mInputs.values(), ...this.mOutputs.values()]) {
            lErrors.push(...lPort.validate());
        }

        return lErrors;
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
    dataType: PotatnoProjectType<TProject> | null;
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