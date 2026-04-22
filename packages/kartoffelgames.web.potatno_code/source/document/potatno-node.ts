import { PortDirection } from '../node/port-direction.enum.ts';
import type { PotatnoNodeDefinition } from "../project/potatno-node-definition.ts";
import { PotatnoDocumentPort } from './potatno-document-port.ts';

/**
 * A node instance in the graph.
 */
export class PotatnoNode {
    private readonly mDefinition: PotatnoNodeDefinition;
    private readonly mId: string;
    private readonly mInputs: Map<string, PotatnoDocumentPort>;
    private mName: string;
    private readonly mOutputs: Map<string, PotatnoDocumentPort>;
    private readonly mSystem: boolean;
    private readonly mTransformation: PotatnoDocumentNodeTransformation;

    /**
     * Get the category of the node, derived from the node definition.
     */
    public get category(): string {
        return this.mDefinition.category;
    }

    /**
     * Get the node definition this node was created from.
     */
    public get definition(): PotatnoNodeDefinition {
        return this.mDefinition;
    }

    /**
     * Get the unique identifier for the node.
     */
    public get id(): string {
        return this.mId;
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
     * @param pId - Unique identifier for the node.
     * @param pDefinition - Node definition describing ports and category.
     * @param pTransformation - Initial grid position of the node.
     * @param pSystem - Whether this is a system node that cannot be removed.
     */
    public constructor(pId: string, pDefinition: PotatnoNodeDefinition, pTransformation: PotatnoDocumentNodeTransformation, pSystem: boolean) {
        this.mId = pId;
        this.mDefinition = pDefinition;
        this.mSystem = pSystem;
        this.mTransformation = pTransformation;
        this.mName = pDefinition.label;

        // Create ports from input definitions, splitting by nodeType.
        this.mInputs = new Map<string, PotatnoDocumentPort>();
        for (const [lName, lPortDef] of Object.entries<PotatnoNodeDefinitionPortDefinition>(pDefinition.inputs)) {
            if (lPortDef.portType === 'flow') {
                const lPortId: string = PotatnoNode.generatePortId();
                this.mFlowInputs.set(lName, new PotatnoFlowPort(lPortId, lName, PortDirection.Input));
            } else {
                const lPortId: string = PotatnoNode.generatePortId();
                const lValueId: string = PotatnoNode.generateValueId(pDefinition.category);
                const lDataType: string = (lPortDef.nodeType === 'value' || lPortDef.nodeType === 'input') ? lPortDef.dataType : '';
                this.mInputs.set(lName, new PotatnoDocumentPort(lPortId, lName, lDataType, PortDirection.Input, lValueId));
            }
        }

        // Create ports from output definitions, splitting by nodeType.
        this.mOutputs = new Map<string, PotatnoDocumentPort>();
        for (const [lName, lPortDef] of Object.entries<PotatnoNodeDefinitionPortDefinition>(pDefinition.outputs)) {
            if (lPortDef.portType === 'flow') {
                const lPortId: string = PotatnoNode.generatePortId();
                this.mFlowOutputs.set(lName, new PotatnoFlowPort(lPortId, lName, PortDirection.Output));
            } else {
                const lPortId: string = PotatnoNode.generatePortId();
                const lValueId: string = PotatnoNode.generateValueId(pDefinition.category);
                const lDataType: string = (lPortDef.nodeType === 'value' || lPortDef.nodeType === 'input') ? lPortDef.dataType : '';
                this.mOutputs.set(lName, new PotatnoDocumentPort(lPortId, lName, lDataType, PortDirection.Output, lValueId));
            }
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
     * Generate a unique port ID.
     */
    private static generatePortId(): string {
        return crypto.randomUUID().substring(0, 8);
    }
}

export type PotatnoDocumentNodeTransformation = {
    x: number;
    y: number;
    width: number;
    height: number;
};