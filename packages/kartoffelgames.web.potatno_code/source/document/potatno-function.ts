import { PotatnoNodeDefinitionPortDefinition, PotatnoNodeDefinitionPorts } from "../project/potatno-node-definition.ts";
import type { PotatnoFunctionDefinition } from '../project/potatno-function-definition.ts';
import { PotatnoGraph } from './potatno-graph.ts';

/**
 * Represents a user-editable function containing a sub-graph.
 */
export class PotatnoFunction {
    private readonly mDefinition: PotatnoFunctionDefinition;
    private readonly mEditableByUser: boolean;
    private readonly mGraph: PotatnoGraph;
    private readonly mId: string;
    private readonly mSystem: boolean;

    private mImports: Array<string>;
    private mInputs: PotatnoNodeDefinitionPorts;
    private mLabel: string;
    private mName: string;
    private mOutputs: PotatnoNodeDefinitionPorts;

    /**
     * Get the function definition this function was created from.
     */
    public get definition(): PotatnoFunctionDefinition {
        return this.mDefinition;
    }

    /**
     * Get whether the user can edit the function definition.
     */
    public get editableByUser(): boolean {
        return this.mEditableByUser;
    }

    /**
     * Get the graph of this function.
     */
    public get graph(): PotatnoGraph {
        return this.mGraph;
    }

    /**
     * Get the unique identifier for the function.
     */
    public get id(): string {
        return this.mId;
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
    public get inputs(): Readonly<PotatnoNodeDefinitionPorts> {
        return this.mInputs;
    }

    /**
     * Get the display label of this function.
     */
    public get label(): string {
        return this.mLabel;
    }

    /**
     * Get the name of this function.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Get the output port definitions for this function.
     */
    public get outputs(): Readonly<PotatnoNodeDefinitionPorts> {
        return this.mOutputs;
    }

    /**
     * Get whether the function is a system-defined function.
     */
    public get system(): boolean {
        return this.mSystem;
    }

    /**
     * Create a new function instance.
     *
     * @param pId - Unique identifier for the function.
     * @param pName - Internal name of the function.
     * @param pLabel - Display label of the function.
     * @param pSystem - Whether the function is a system-defined function.
     * @param pEditableByUser - Whether the user can edit the function definition.
     * @param pDefinition - The function definition this function was created from.
     */
    public constructor(pId: string, pName: string, pLabel: string, pSystem: boolean, pEditableByUser: boolean, pDefinition: PotatnoFunctionDefinition) {
        this.mId = pId;
        this.mName = pName;
        this.mLabel = pLabel;
        this.mSystem = pSystem;
        this.mEditableByUser = pEditableByUser;
        this.mDefinition = pDefinition;
        this.mGraph = new PotatnoGraph();
        this.mInputs = {};
        this.mOutputs = {};
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
     * @param pName - The port name.
     * @param pPort - The port definition.
     */
    public addInput(pName: string, pPort: PotatnoNodeDefinitionPortDefinition): void {
        this.mInputs[pName] = pPort;
    }

    /**
     * Add an output port definition to the function.
     *
     * @param pName - The port name.
     * @param pPort - The port definition.
     */
    public addOutput(pName: string, pPort: PotatnoNodeDefinitionPortDefinition): void {
        this.mOutputs[pName] = pPort;
    }

    /**
     * Replace all imports for this function.
     *
     * @param pImports - The new list of import strings.
     */
    public setImports(pImports: Array<string>): void {
        this.mImports = [...pImports];
    }

    /**
     * Replace all input port definitions.
     *
     * @param pInputs - The new input port definitions.
     */
    public setInputs(pInputs: PotatnoNodeDefinitionPorts): void {
        this.mInputs = { ...pInputs };
    }

    /**
     * Set the display label of the function.
     *
     * @param pLabel - The new label.
     */
    public setLabel(pLabel: string): void {
        this.mLabel = pLabel;
    }

    /**
     * Set the internal name of the function.
     *
     * @param pName - The new name.
     */
    public setName(pName: string): void {
        this.mName = pName;
    }

    /**
     * Replace all output port definitions.
     *
     * @param pOutputs - The new output port definitions.
     */
    public setOutputs(pOutputs: PotatnoNodeDefinitionPorts): void {
        this.mOutputs = { ...pOutputs };
    }
}
