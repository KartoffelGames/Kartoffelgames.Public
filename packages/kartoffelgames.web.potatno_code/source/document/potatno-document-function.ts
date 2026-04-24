import type { PotatnoFunctionDefinition } from '../project/potatno-function-definition.ts';
import { PotatnoDocumentPort } from "./potatno-document-port.ts";
import { PotatnoGraph } from './potatno-graph.ts';

/**
 * Represents a user-editable function containing a sub-graph.
 */
export class PotatnoDocumentFunction {
    private readonly mDefinition: PotatnoFunctionDefinition;
    private readonly mGraph: PotatnoGraph;
    private readonly mSystem: boolean;
    private readonly mImports: Array<string>;
    private readonly mInputs: Array<PotatnoDocumentPort>;
    private mLabel: string;
    private readonly mOutputs: Array<PotatnoDocumentPort>;

    /**
     * Get the function definition this function was created from.
     */
    public get definition(): PotatnoFunctionDefinition {
        return this.mDefinition;
    }

    /**
     * Get the graph of this function.
     */
    public get graph(): PotatnoGraph {
        return this.mGraph;
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
    public get inputs(): ReadonlyArray<PotatnoDocumentPort> {
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
    public get outputs(): ReadonlyArray<PotatnoDocumentPort> {
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
     * @param pDefinition - The function definition this function was created from.
     * @param pLabel - Display label of the function.
     * @param pSystem - Whether the function is a system-defined function.
     */
    public constructor(pDefinition: PotatnoFunctionDefinition, pLabel: string, pSystem: boolean) {
        this.mLabel = pLabel;
        this.mSystem = pSystem;
        this.mDefinition = pDefinition;
        this.mGraph = new PotatnoGraph();
        this.mInputs = new Array<PotatnoDocumentPort>();
        this.mOutputs = new Array<PotatnoDocumentPort>();
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
    public addInput(pPort: PotatnoDocumentPort): void {
        // Skip if port name already exists.
        if (this.mInputs.some((existingPort) => existingPort.name === pPort.name)) {
            return;
        }

        this.mInputs.push(pPort);
    }

    /**
     * Add an output port definition to the function.
     *
     * @param pName - The port name.
     * @param pPort - The port definition.
     */
    public addOutput(pPort: PotatnoDocumentPort): void {
        // Skip if port name already exists.
        if (this.mOutputs.some((existingPort) => existingPort.name === pPort.name)) {
            return;
        }

        this.mOutputs.push(pPort);
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
    public removeInput(pPort: PotatnoDocumentPort): void {
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
    public removeOutput(pPort: PotatnoDocumentPort): void {
        const index = this.mOutputs.findIndex((existingPort) => existingPort.name === pPort.name);
        if (index !== -1) {
            this.mOutputs.splice(index, 1);
        }
    }
}
