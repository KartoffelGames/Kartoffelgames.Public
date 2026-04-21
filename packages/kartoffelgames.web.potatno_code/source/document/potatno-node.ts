import { PortDirection } from '../node/port-direction.enum.ts';
import type { PotatnoNodeDefinition, PotatnoNodeDefinitionPort } from "../project/potatno-node-definition.ts";
import { PotatnoFlowPort } from './potatno-flow-port.ts';
import { PotatnoDocumentPort } from './potatno-document-port.ts';

/**
 * A node instance in the graph.
 */
export class PotatnoNode {
    private readonly mDefinition: PotatnoNodeDefinition;
    private readonly mFlowInputs: Map<string, PotatnoFlowPort>;
    private readonly mFlowOutputs: Map<string, PotatnoFlowPort>;
    private readonly mId: string;
    private readonly mInputs: Map<string, PotatnoDocumentPort>;
    private readonly mOutputs: Map<string, PotatnoDocumentPort>;
    private readonly mProperties: Map<string, string>;
    private readonly mSystem: boolean;

    private mPosition: { x: number; y: number };
    private mSize: { w: number; h: number };

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
     * Get the flow input ports of the node.
     */
    public get flowInputs(): Map<string, PotatnoFlowPort> {
        return this.mFlowInputs;
    }

    /**
     * Get the flow output ports of the node.
     */
    public get flowOutputs(): Map<string, PotatnoFlowPort> {
        return this.mFlowOutputs;
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
     * Get the grid position of the node.
     */
    public get position(): { x: number; y: number } {
        return this.mPosition;
    }

    /**
     * Get the properties map of the node.
     */
    public get properties(): Map<string, string> {
        return this.mProperties;
    }

    /**
     * Get the grid size of the node.
     */
    public get size(): { w: number; h: number } {
        return this.mSize;
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
     * @param pPosition - Initial grid position of the node.
     * @param pSystem - Whether this is a system node that cannot be removed.
     */
    public constructor(pId: string, pDefinition: PotatnoNodeDefinition, pPosition: { x: number; y: number }, pSystem: boolean) {
        this.mId = pId;
        this.mDefinition = pDefinition;
        this.mSystem = pSystem;
        this.mPosition = { x: pPosition.x, y: pPosition.y };
        this.mSize = { w: 8, h: 4 };
        this.mProperties = new Map<string, string>();

        // Create ports from input definitions, splitting by nodeType.
        this.mInputs = new Map<string, PotatnoDocumentPort>();
        this.mFlowInputs = new Map<string, PotatnoFlowPort>();
        for (const [lName, lPortDef] of Object.entries<PotatnoNodeDefinitionPort>(pDefinition.inputs)) {
            if (lPortDef.nodeType === 'flow') {
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
        this.mFlowOutputs = new Map<string, PotatnoFlowPort>();
        for (const [lName, lPortDef] of Object.entries<PotatnoNodeDefinitionPort>(pDefinition.outputs)) {
            if (lPortDef.nodeType === 'flow') {
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
        this.mPosition = { x: pX, y: pY };
    }

    /**
     * Resize the node (comment nodes).
     */
    public resizeTo(pW: number, pH: number): void {
        this.mSize = { w: Math.max(4, pW), h: Math.max(2, pH) };
    }

    /**
     * Generate a unique port ID.
     */
    private static generatePortId(): string {
        return crypto.randomUUID().substring(0, 8);
    }

    /**
     * Generate a value ID from category + hex.
     */
    private static generateValueId(pCategory: string): string {
        const lHex: string = crypto.randomUUID().replace(/-/g, '').substring(0, 12);
        const lSanitized: string = String(pCategory).replace(/[^a-zA-Z0-9]/g, '');
        return `${lSanitized}_${lHex}`;
    }
}
