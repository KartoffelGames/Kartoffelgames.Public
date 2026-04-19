import { PortDirection } from '../node/port-direction.enum.ts';
import type { PotatnoNodeDefinition, PotatnoNodeDefinitionPort } from "../project/potatno-node-definition.ts";
import { PotatnoFlowPort } from './potatno-flow-port.ts';
import { PotatnoPort } from './potatno-port.ts';

/**
 * A node instance in the graph.
 */
export class PotatnoNode {
    public readonly category: string;
    public readonly definitionId: string;
    public readonly flowInputs: Map<string, PotatnoFlowPort>;
    public readonly flowOutputs: Map<string, PotatnoFlowPort>;
    public readonly id: string;
    public readonly inputs: Map<string, PotatnoPort>;
    public readonly outputs: Map<string, PotatnoPort>;
    public readonly properties: Map<string, string>;
    public readonly system: boolean;

    private mPosition: { x: number; y: number };
    private mSize: { w: number; h: number };

    /**
     * The grid position of the node.
     */
    public get position(): { x: number; y: number } {
        return this.mPosition;
    }

    /**
     * The grid size of the node.
     */
    public get size(): { w: number; h: number } {
        return this.mSize;
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
        this.id = pId;
        this.definitionId = pDefinition.id;
        this.category = pDefinition.category;
        this.system = pSystem;
        this.mPosition = { x: pPosition.x, y: pPosition.y };
        this.mSize = { w: 8, h: 4 };
        this.properties = new Map<string, string>();

        // Create ports from input definitions, splitting by nodeType.
        this.inputs = new Map<string, PotatnoPort>();
        this.flowInputs = new Map<string, PotatnoFlowPort>();
        for (const [lName, lPortDef] of Object.entries<PotatnoNodeDefinitionPort>(pDefinition.inputs)) {
            if (lPortDef.nodeType === 'flow') {
                const lPortId: string = PotatnoNode.generatePortId();
                this.flowInputs.set(lName, new PotatnoFlowPort(lPortId, lName, PortDirection.Input));
            } else {
                const lPortId: string = PotatnoNode.generatePortId();
                const lValueId: string = PotatnoNode.generateValueId(pDefinition.category);
                const lDataType: string = (lPortDef.nodeType === 'value' || lPortDef.nodeType === 'input') ? lPortDef.dataType : '';
                this.inputs.set(lName, new PotatnoPort(lPortId, lName, lDataType, PortDirection.Input, lValueId));
            }
        }

        // Create ports from output definitions, splitting by nodeType.
        this.outputs = new Map<string, PotatnoPort>();
        this.flowOutputs = new Map<string, PotatnoFlowPort>();
        for (const [lName, lPortDef] of Object.entries<PotatnoNodeDefinitionPort>(pDefinition.outputs)) {
            if (lPortDef.nodeType === 'flow') {
                const lPortId: string = PotatnoNode.generatePortId();
                this.flowOutputs.set(lName, new PotatnoFlowPort(lPortId, lName, PortDirection.Output));
            } else {
                const lPortId: string = PotatnoNode.generatePortId();
                const lValueId: string = PotatnoNode.generateValueId(pDefinition.category);
                const lDataType: string = (lPortDef.nodeType === 'value' || lPortDef.nodeType === 'input') ? lPortDef.dataType : '';
                this.outputs.set(lName, new PotatnoPort(lPortId, lName, lDataType, PortDirection.Output, lValueId));
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
