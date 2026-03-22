import type { PotatnoPortDefinition } from '../configuration/potatno-port-definition.ts';
import { PotatnoGraph } from '../graph/potatno-graph.ts';

/**
 * Represents a user-editable function containing a sub-graph.
 */
export class PotatnoFunction {
    public readonly editableByUser: boolean;
    public readonly graph: PotatnoGraph;
    public readonly id: string;
    public readonly system: boolean;

    private mImports: Array<string>;
    private mInputs: Array<PotatnoPortDefinition>;
    private mLabel: string;
    private mName: string;
    private mOutputs: Array<PotatnoPortDefinition>;

    public get imports(): ReadonlyArray<string> {
        return this.mImports;
    }

    public get inputs(): ReadonlyArray<PotatnoPortDefinition> {
        return this.mInputs;
    }

    public get label(): string {
        return this.mLabel;
    }

    public get name(): string {
        return this.mName;
    }

    public get outputs(): ReadonlyArray<PotatnoPortDefinition> {
        return this.mOutputs;
    }

    public constructor(pId: string, pName: string, pLabel: string, pSystem: boolean, pEditableByUser: boolean = false) {
        this.id = pId;
        this.mName = pName;
        this.mLabel = pLabel;
        this.system = pSystem;
        this.editableByUser = pEditableByUser;
        this.graph = new PotatnoGraph();
        this.mInputs = new Array<PotatnoPortDefinition>();
        this.mOutputs = new Array<PotatnoPortDefinition>();
        this.mImports = new Array<string>();
    }

    public setName(pName: string): void {
        this.mName = pName;
    }

    public setLabel(pLabel: string): void {
        this.mLabel = pLabel;
    }

    public setInputs(pInputs: Array<PotatnoPortDefinition>): void {
        this.mInputs = [...pInputs];
    }

    public setOutputs(pOutputs: Array<PotatnoPortDefinition>): void {
        this.mOutputs = [...pOutputs];
    }

    public setImports(pImports: Array<string>): void {
        this.mImports = [...pImports];
    }

    public addImport(pImport: string): void {
        if (!this.mImports.includes(pImport)) {
            this.mImports.push(pImport);
        }
    }

    public removeImport(pImport: string): void {
        const lIndex: number = this.mImports.indexOf(pImport);
        if (lIndex !== -1) {
            this.mImports.splice(lIndex, 1);
        }
    }

    public addInput(pInput: PotatnoPortDefinition): void {
        this.mInputs.push(pInput);
    }

    public removeInput(pIndex: number): void {
        this.mInputs.splice(pIndex, 1);
    }

    public addOutput(pOutput: PotatnoPortDefinition): void {
        this.mOutputs.push(pOutput);
    }

    public removeOutput(pIndex: number): void {
        this.mOutputs.splice(pIndex, 1);
    }
}
