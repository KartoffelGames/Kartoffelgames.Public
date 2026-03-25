import type { NodeCategory } from '../node/node-category.enum.ts';
import { PortDirection } from '../node/port-direction.enum.ts';
import { PotatnoProjectNodeDefinition } from "../project/potatno-node-definition.ts";
import { PotatnoFlowPort } from './potatno-flow-port.ts';
import { PotatnoPort } from './potatno-port.ts';

/**
 * A node instance in the graph.
 */
export class PotatnoNode {
    public readonly category: NodeCategory;
    public readonly definitionName: string;
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
    public constructor(pId: string, pDefinition: PotatnoProjectNodeDefinition<string, string>, pPosition: { x: number; y: number }, pSystem: boolean) {
        this.id = pId;
        this.definitionName = pDefinition.name;
        this.category = pDefinition.category;
        this.system = pSystem;
        this.mPosition = { x: pPosition.x, y: pPosition.y };
        this.mSize = { w: 8, h: 4 };
        this.properties = new Map<string, string>();

        // Create data input ports.
        this.inputs = new Map<string, PotatnoPort>();
        for (const lPortDef of pDefinition.inputs) {
            const lPortId: string = PotatnoNode.generatePortId();
            const lValueId: string = PotatnoNode.generateValueId(pDefinition.category);
            this.inputs.set(lPortDef.name, new PotatnoPort(lPortId, lPortDef.name, lPortDef.type, PortDirection.Input, lValueId));
        }

        // Create data output ports.
        this.outputs = new Map<string, PotatnoPort>();
        for (const lPortDef of pDefinition.outputs) {
            const lPortId: string = PotatnoNode.generatePortId();
            const lValueId: string = PotatnoNode.generateValueId(pDefinition.category);
            this.outputs.set(lPortDef.name, new PotatnoPort(lPortId, lPortDef.name, lPortDef.type, PortDirection.Output, lValueId));
        }

        // Determine flow ports. Function nodes get automatic exec pins if none are defined.
        // Event nodes get an automatic exec output.
        const lFlowInputNames: Array<string> = pDefinition.flowInputs ?? PotatnoNode.getAutoFlowInputs(pDefinition.category);
        const lFlowOutputNames: Array<string> = pDefinition.flowOutputs ?? PotatnoNode.getAutoFlowOutputs(pDefinition.category);

        // Create flow input ports.
        this.flowInputs = new Map<string, PotatnoFlowPort>();
        for (const lFlowName of lFlowInputNames) {
            const lPortId: string = PotatnoNode.generatePortId();
            this.flowInputs.set(lFlowName, new PotatnoFlowPort(lPortId, lFlowName, PortDirection.Input));
        }

        // Create flow output ports.
        this.flowOutputs = new Map<string, PotatnoFlowPort>();
        for (const lFlowName of lFlowOutputNames) {
            const lPortId: string = PotatnoNode.generatePortId();
            this.flowOutputs.set(lFlowName, new PotatnoFlowPort(lPortId, lFlowName, PortDirection.Output));
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
     * Get automatic flow input port names based on node category.
     * Function nodes get an 'exec' input. Event nodes get none.
     */
    private static getAutoFlowInputs(pCategory: NodeCategory | string): Array<string> {
        if (pCategory === 'function') {
            return ['exec'];
        }
        return [];
    }

    /**
     * Get automatic flow output port names based on node category.
     * Function and Event nodes get an 'exec' output.
     */
    private static getAutoFlowOutputs(pCategory: NodeCategory | string): Array<string> {
        if (pCategory === 'function' || pCategory === 'event') {
            return ['exec'];
        }
        return [];
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
    private static generateValueId(pCategory: NodeCategory | string): string {
        const lHex: string = crypto.randomUUID().replace(/-/g, '').substring(0, 12);
        const lSanitized: string = String(pCategory).replace(/[^a-zA-Z0-9]/g, '');
        return `${lSanitized}_${lHex}`;
    }
}
