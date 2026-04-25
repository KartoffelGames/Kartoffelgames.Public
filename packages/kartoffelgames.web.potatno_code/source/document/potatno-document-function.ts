import type { PotatnoFunctionDefinition } from '../project/potatno-function-definition.ts';
import { PotatnoNodeDefinition } from "../project/potatno-node-definition.ts";
import { PotatnoDocumentNode, PotatnoDocumentNodeTransformation } from "./potatno-document-node.ts";

/**
 * Represents a user-editable function containing a sub-graph.
 */
export class PotatnoDocumentFunction {
    private readonly mDefinition: PotatnoFunctionDefinition;
    private readonly mId: string;
    private readonly mIsSystem: boolean;
    private readonly mImports: Array<string>;
    private readonly mInputs: Array<PotatnoDocumentFunctionPort>;
    private mLabel: string;
    private readonly mOutputs: Array<PotatnoDocumentFunctionPort>;
    private readonly mNodes: Set<PotatnoDocumentNode>;

    /**
     * Unique identifier for this function instance. Stable across sessions so it can be referenced as a node in other graphs.
     */
    public get id(): string {
        return this.mId;
    }

    /**
     * Read-only set of all nodes in the graph.
     */
    public get nodes(): ReadonlySet<PotatnoDocumentNode> {
        return this.mNodes;
    }

    /**
     * Get the function definition this function was created from.
     */
    public get definition(): PotatnoFunctionDefinition {
        return this.mDefinition;
    }

    /**
     * Get the list of imports for this function.
     */
    public get imports(): ReadonlyArray<string> {
        return this.mImports;
    }

    /**
     * Get the input port definitions for this function.
     */
    public get inputs(): ReadonlyArray<PotatnoDocumentFunctionPort> {
        return this.mInputs;
    }

    /**
     * Get the display label of this function.
     */
    public get label(): string {
        return this.mLabel;
    } set label(pLabel: string) {
        this.mLabel = pLabel;
    }

    /**
     * Get the output port definitions for this function.
     */
    public get outputs(): ReadonlyArray<PotatnoDocumentFunctionPort> {
        return this.mOutputs;
    }

    /**
     * Get whether the function is a system-defined function.
     */
    public get isSystem(): boolean {
        return this.mIsSystem;
    }

    /**
     * Create a new function instance.
     *
     * @param pDefinition - The function definition this function was created from.
     * @param pId - The unique identifier of the function.
     * @param pLabel - Display label of the function.
     * @param pIsSystem - Whether the function is a system-defined function.
     */
    public constructor(pDefinition: PotatnoFunctionDefinition, pId: string, pLabel: string, pIsSystem: boolean) {
        this.mLabel = pLabel;
        this.mIsSystem = pIsSystem;
        this.mDefinition = pDefinition;
        this.mId = pId;
        this.mNodes = new Set<PotatnoDocumentNode>();
        this.mInputs = new Array<PotatnoDocumentFunctionPort>();
        this.mOutputs = new Array<PotatnoDocumentFunctionPort>();
        this.mImports = new Array<string>();
    }

    /**
     * Add an import to the function if it does not already exist.
     *
     * @param pImport - The import string to add.
     */
    public addImport(pImport: string): void {
        if (!this.mImports.includes(pImport)) {
            this.mImports.push(pImport);
        }
    }

    /**
     * Add an input port definition to the function.
     *
     * @param pPort - The port definition.
     */
    public addInput(pPort: PotatnoDocumentFunctionPort): void {
        // Skip if port name already exists.
        if (this.mInputs.some((existingPort) => existingPort.name === pPort.name)) {
            return;
        }

        this.mInputs.push(pPort);
    }

    /**
     * Add an output port definition to the function.
     *
     * @param pPort - The port definition.
     */
    public addOutput(pPort: PotatnoDocumentFunctionPort): void {
        // Skip if port name already exists.
        if (this.mOutputs.some((existingPort) => existingPort.name === pPort.name)) {
            return;
        }

        this.mOutputs.push(pPort);
    }

    /**
     * Add a pre-constructed node directly.
     * 
     * @param pNode - The node to add.
     */
    public addNode(pNode: PotatnoDocumentNode): void {
        this.mNodes.add(pNode);
    }

    /**
     * Add a new node to the graph.
     */
    public newNode(pDefinition: PotatnoNodeDefinition, pTransformation: PotatnoDocumentNodeTransformation, pSystem: boolean = false): PotatnoDocumentNode {
        const lNode: PotatnoDocumentNode = new PotatnoDocumentNode(pDefinition, pTransformation, pSystem);
        this.mNodes.add(lNode);
        return lNode;
    }

    /**
     * Remove a node and disconnect all its ports from the graph.
     */
    public removeNode(pNode: PotatnoDocumentNode): void {
        // Disconnect all ports of the node.
        for (const lPort of [...pNode.inputs.values(), ...pNode.outputs.values()]) {
            for (const lConnectedPort of Array.from(lPort.connectedPorts)) {
                lPort.disconnect(lConnectedPort);
            }
        }

        this.mNodes.delete(pNode);
    }

    /**
     * Remove an import from the function.
     * 
     * @param pImport - The import string to remove.
     */
    public removeImport(pImport: string): void {
        const index = this.mImports.indexOf(pImport);
        if (index !== -1) {
            this.mImports.splice(index, 1);
        }
    }

    /**
     * Remove an input port definition from the function.
     * 
     * @param pPort - The port definition to remove.
     */
    public removeInput(pPort: PotatnoDocumentFunctionPort): void {
        const index = this.mInputs.findIndex((existingPort) => existingPort.name === pPort.name);
        if (index !== -1) {
            this.mInputs.splice(index, 1);
        }
    }

    /**
     * Remove an output port definition from the function.
     * 
     * @param pPort - The port definition to remove.
     */
    public removeOutput(pPort: PotatnoDocumentFunctionPort): void {
        const index = this.mOutputs.findIndex((existingPort) => existingPort.name === pPort.name);
        if (index !== -1) {
            this.mOutputs.splice(index, 1);
        }
    }
}

export type PotatnoDocumentFunctionPort = {
    name: string;
    dataType: string;
};