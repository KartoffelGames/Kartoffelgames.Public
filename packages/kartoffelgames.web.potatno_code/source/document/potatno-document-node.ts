import type { PotatnoNodeDefinition } from "../project/potatno-node-definition.ts";
import { PotatnoDocumentPort, PotatnoDocumentPortValidationError } from './potatno-document-port.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';
import type { PotatnoProjectType } from '../project/potatno-project-types-definition.ts';

/**
 * A node instance in the graph.
 */
export class PotatnoDocumentNode {
    private readonly mDefinition: PotatnoNodeDefinition;
    private readonly mInputs: Map<string, PotatnoDocumentPort>;
    private mName: string;
    private readonly mOutputs: Map<string, PotatnoDocumentPort>;
    private readonly mIsSystem: boolean;
    private readonly mTransformation: PotatnoDocumentNodeTransformation;
    private readonly mProject: PotatnoProject<PotatnoProjectType>;

    /**
     * Get the node definition this node was created from.
     */
    public get definition(): PotatnoNodeDefinition {
        return this.mDefinition;
    }

    /**
     * Get the data input ports of the node.
     */
    public get inputs(): Map<string, PotatnoDocumentPort> {
        return this.mInputs;
    }

    /**
     * Get the data output ports of the node.
     */
    public get outputs(): Map<string, PotatnoDocumentPort> {
        return this.mOutputs;
    }

    /**
     * Get the project this node belongs to.
     */
    public get project(): PotatnoProject<PotatnoProjectType> {
        return this.mProject;
    }

    /**
     * Get the grid position and size of the node.
     */
    public get transformation(): PotatnoDocumentNodeTransformation {
        return this.mTransformation;
    }

    /**
     * Get or set the user set name of the node.
     */
    public get name(): string {
        return this.mName;
    } set name(pName: string) {
        this.mName = pName;
    }

    /**
     * Get whether this is a system node that cannot be removed.
     */
    public get isSystem(): boolean {
        return this.mIsSystem;
    }

    /**
     * Create a new node from a definition.
     *
     * @param pDefinition - Node definition describing ports and category.
     * @param pTransformation - Initial grid position of the node.
     * @param pIsSystem - Whether this is a system node that cannot be removed.
     */
    public constructor(pProject: PotatnoProject<PotatnoProjectType>, pDefinition: PotatnoNodeDefinition, pTransformation: PotatnoDocumentNodeTransformation, pIsSystem: boolean) {
        this.mProject = pProject;
        this.mDefinition = pDefinition;
        this.mIsSystem = pIsSystem;
        this.mTransformation = pTransformation;
        this.mName = pDefinition.label;

        // Create ports from input definitions, splitting by nodeType.
        this.mInputs = new Map<string, PotatnoDocumentPort>();
        for (const lPort of pDefinition.inputs) {
            this.mInputs.set(lPort.name, new PotatnoDocumentPort(pProject, this, lPort.name, 'input', lPort.portType, lPort.dataType));
        }

        // Create ports from output definitions, splitting by nodeType.
        this.mOutputs = new Map<string, PotatnoDocumentPort>();
        for (const lPort of pDefinition.outputs) {
            this.mOutputs.set(lPort.name, new PotatnoDocumentPort(pProject, this, lPort.name, 'output', lPort.portType, lPort.dataType));
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
    public validate(): Array<PotatnoDocumentPortValidationError> {
        const lErrors: Array<PotatnoDocumentPortValidationError> = [];

        for (const lPort of [...this.mInputs.values(), ...this.mOutputs.values()]) {
            lErrors.push(...lPort.validate());
        }

        return lErrors;
    }
}

export type PotatnoDocumentNodeTransformation = {
    x: number;
    y: number;
    width: number;
    height: number;
};