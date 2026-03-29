import { PotatnoNodeDefinitionPort, PotatnoNodeDefinitionPorts } from "../project/potatno-node-definition.ts";
import { PotatnoGraph } from './potatno-graph.ts';

/**
 * Represents a user-editable function containing a sub-graph.
 */
export class PotatnoFunction {
    public readonly editableByUser: boolean;
    public readonly graph: PotatnoGraph;
    public readonly id: string;
    public readonly system: boolean;

    private mImports: Array<string>;
    private mInputs: PotatnoNodeDefinitionPorts;
    private mLabel: string;
    private mLocalVariables: Array<{ name: string; type: string }>;
    private mName: string;
    private mOutputs: PotatnoNodeDefinitionPorts;

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
     * Get the list of local variables for this function.
     */
    public get localVariables(): ReadonlyArray<{ name: string; type: string }> {
        return this.mLocalVariables;
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
     * Create a new function instance.
     *
     * @param pId - Unique identifier for the function.
     * @param pName - Internal name of the function.
     * @param pLabel - Display label of the function.
     * @param pSystem - Whether the function is a system-defined function.
     * @param pEditableByUser - Whether the user can edit the function definition.
     */
    public constructor(pId: string, pName: string, pLabel: string, pSystem: boolean, pEditableByUser: boolean = false) {
        this.id = pId;
        this.mName = pName;
        this.mLabel = pLabel;
        this.system = pSystem;
        this.editableByUser = pEditableByUser;
        this.graph = new PotatnoGraph();
        this.mInputs = {};
        this.mOutputs = {};
        this.mImports = new Array<string>();
        this.mLocalVariables = new Array<{ name: string; type: string }>();
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
     * Set the display label of the function.
     *
     * @param pLabel - The new label.
     */
    public setLabel(pLabel: string): void {
        this.mLabel = pLabel;
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
     * Replace all output port definitions.
     *
     * @param pOutputs - The new output port definitions.
     */
    public setOutputs(pOutputs: PotatnoNodeDefinitionPorts): void {
        this.mOutputs = { ...pOutputs };
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
     * Remove an import from the function.
     *
     * @param pImport - The import string to remove.
     */
    public removeImport(pImport: string): void {
        const lIndex: number = this.mImports.indexOf(pImport);
        if (lIndex !== -1) {
            this.mImports.splice(lIndex, 1);
        }
    }

    /**
     * Add an input port definition to the function.
     *
     * @param pName - The port name.
     * @param pPort - The port definition.
     */
    public addInput(pName: string, pPort: PotatnoNodeDefinitionPort): void {
        this.mInputs[pName] = pPort;
    }

    /**
     * Remove an input port definition by name.
     *
     * @param pName - The name of the input to remove.
     */
    public removeInput(pName: string): void {
        delete this.mInputs[pName];
    }

    /**
     * Add an output port definition to the function.
     *
     * @param pName - The port name.
     * @param pPort - The port definition.
     */
    public addOutput(pName: string, pPort: PotatnoNodeDefinitionPort): void {
        this.mOutputs[pName] = pPort;
    }

    /**
     * Remove an output port definition by name.
     *
     * @param pName - The name of the output to remove.
     */
    public removeOutput(pName: string): void {
        delete this.mOutputs[pName];
    }

    /**
     * Add a local variable to the function.
     *
     * @param pName - The variable name.
     * @param pType - The variable type.
     */
    public addLocalVariable(pName: string, pType: string): void {
        this.mLocalVariables.push({ name: pName, type: pType });
    }

    /**
     * Remove a local variable by index.
     *
     * @param pIndex - The index of the local variable to remove.
     */
    public removeLocalVariable(pIndex: number): void {
        this.mLocalVariables.splice(pIndex, 1);
    }

    /**
     * Replace all local variables.
     *
     * @param pVars - The new list of local variables.
     */
    public setLocalVariables(pVars: Array<{ name: string; type: string }>): void {
        this.mLocalVariables = [...pVars];
    }
}
