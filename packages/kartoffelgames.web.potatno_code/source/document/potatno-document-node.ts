import type { PotatnoNodeDefinition } from "../project/potatno-node-definition.ts";
import { PotatnoDocumentPort } from './potatno-document-port.ts';

/**
 * A node instance in the graph.
 */
export class PotatnoDocumentNode {
    private readonly mDefinition: PotatnoNodeDefinition;
    private readonly mInputs: Map<string, PotatnoDocumentPort>;
    private mName: string;
    private readonly mOutputs: Map<string, PotatnoDocumentPort>;
    private readonly mSystem: boolean;
    private readonly mTransformation: PotatnoDocumentNodeTransformation;

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
    public get system(): boolean {
        return this.mSystem;
    }

    /**
     * Create a new node from a definition.
     *
     * @param pDefinition - Node definition describing ports and category.
     * @param pTransformation - Initial grid position of the node.
     * @param pSystem - Whether this is a system node that cannot be removed.
     */
    public constructor(pDefinition: PotatnoNodeDefinition, pTransformation: PotatnoDocumentNodeTransformation, pSystem: boolean) {
        this.mDefinition = pDefinition;
        this.mSystem = pSystem;
        this.mTransformation = pTransformation;
        this.mName = pDefinition.label;

        // Create ports from input definitions, splitting by nodeType.
        this.mInputs = new Map<string, PotatnoDocumentPort>();
        for (const lPort of pDefinition.inputs) {
            this.mInputs.set(lPort.name, new PotatnoDocumentPort(lPort.name, 'input', lPort.portType, lPort.dataType));
        }

        // Create ports from output definitions, splitting by nodeType.
        this.mOutputs = new Map<string, PotatnoDocumentPort>();
        for (const lPort of pDefinition.outputs) {
            this.mOutputs.set(lPort.name, new PotatnoDocumentPort(lPort.name, 'output', lPort.portType, lPort.dataType));
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
}

export type PotatnoDocumentNodeTransformation = {
    x: number;
    y: number;
    width: number;
    height: number;
};