import { PwbComponent, Processor, PwbExport, PwbComponentEvent, ComponentEventEmitter } from '@kartoffelgames/web-potato-web-builder';
import templateCss from './potatno-panel-properties.css';
import propertiesTemplate from './potatno-panel-properties.html';

/**
 * Port definition for function inputs and outputs.
 */
interface PortEntry {
    name: string;
    type: string;
}

/**
 * Change payload dispatched when any property is modified.
 */
interface PropertiesChangePayload {
    name?: string;
    inputs?: Array<PortEntry>;
    outputs?: Array<PortEntry>;
    imports?: Array<string>;
}

@PwbComponent({
    selector: 'potatno-panel-properties',
    template: propertiesTemplate,
    style: templateCss,
})
export class PotatnoPanelProperties extends Processor {
    /**
     * The name of the function being edited.
     */
    @PwbExport
    public functionName: string = '';

    /**
     * Input port definitions for the function.
     */
    @PwbExport
    public functionInputs: Array<PortEntry> = [];

    /**
     * Output port definitions for the function.
     */
    @PwbExport
    public functionOutputs: Array<PortEntry> = [];

    /**
     * Import names used by the function.
     */
    private mFunctionImports: Array<string> = [];

    @PwbExport
    public set functionImports(pValue: Array<string>) {
        this.mFunctionImports = pValue;
        this.rebuildUnusedImports();
    }
    public get functionImports(): Array<string> {
        return this.mFunctionImports;
    }

    /**
     * Whether the function is a system function (non-editable).
     */
    @PwbExport
    public isSystem: boolean = false;

    /**
     * Whether the system function allows user editing of ports/imports.
     */
    @PwbExport
    public editableByUser: boolean = false;

    /**
     * Whether the function name input should be disabled.
     * System functions always have their name locked.
     */
    public get nameDisabled(): boolean {
        return this.isSystem;
    }

    /**
     * Whether port/import editing is disabled.
     * System functions are locked unless editableByUser is true.
     */
    public get portsDisabled(): boolean {
        return this.isSystem && !this.editableByUser;
    }

    /**
     * Available import names that can be added.
     */
    private mAvailableImports: Array<string> = [];

    @PwbExport
    public set availableImports(pValue: Array<string>) {
        this.mAvailableImports = pValue;
        this.rebuildUnusedImports();
    }
    public get availableImports(): Array<string> {
        return this.mAvailableImports;
    }

    /**
     * Available port types that can be selected.
     */
    private mAvailableTypes: Array<string> = [];

    @PwbExport
    public set availableTypes(pValue: Array<string>) {
        this.mAvailableTypes = pValue;
    }
    public get availableTypes(): Array<string> {
        return this.mAvailableTypes;
    }

    /**
     * Cached list of unused imports available for selection.
     */
    private mCachedUnusedImports: Array<string> = [];

    /**
     * Currently selected import name in the dropdown.
     */
    private mSelectedImport: string = '';

    /**
     * Event emitted when any property changes.
     */
    @PwbComponentEvent('properties-change')
    private accessor mPropertiesChange!: ComponentEventEmitter<PropertiesChangePayload>;

    /**
     * Validate that a name matches the required identifier pattern.
     * Must start with a letter, followed by letters, digits, or underscores.
     *
     * @param pName - The name to validate.
     */
    private validateName(pName: string): boolean {
        return /^[a-zA-Z][a-zA-Z0-9_]*$/.test(pName);
    }

    /**
     * Check whether a name is duplicated across inputs, outputs, and function name.
     *
     * @param pName - The name to check.
     * @param pExcludeList - Which list the name belongs to (so it can skip its own entry).
     * @param pIndex - Index within the list to skip (the entry being edited).
     */
    private isNameDuplicate(pName: string, pExcludeList: 'input' | 'output' | 'function', pIndex?: number): boolean {
        // Check against function name.
        if (pExcludeList !== 'function' && pName === this.functionName) {
            return true;
        }

        // Check against inputs.
        for (let lIdx: number = 0; lIdx < this.functionInputs.length; lIdx++) {
            if (pExcludeList === 'input' && lIdx === pIndex) {
                continue;
            }
            if (this.functionInputs[lIdx].name === pName) {
                return true;
            }
        }

        // Check against outputs.
        for (let lIdx: number = 0; lIdx < this.functionOutputs.length; lIdx++) {
            if (pExcludeList === 'output' && lIdx === pIndex) {
                continue;
            }
            if (this.functionOutputs[lIdx].name === pName) {
                return true;
            }
        }

        return false;
    }

    /**
     * Handle function name change.
     *
     * @param pEvent - Change event from the name input.
     */
    public onNameChange(pEvent: Event): void {
        const lInput: HTMLInputElement = pEvent.target as HTMLInputElement;
        const lNewName: string = lInput.value;
        const lIsInvalid: boolean = !this.validateName(lNewName) || this.isNameDuplicate(lNewName, 'function');
        lInput.style.borderColor = lIsInvalid ? 'var(--pn-accent-danger)' : '';
        // Always dispatch so the editor can run validation and show errors in the preview.
        this.functionName = lNewName;
        this.mPropertiesChange.dispatchEvent({ name: lNewName });
    }

    /**
     * Handle input port name change.
     *
     * @param pIndex - Index of the input.
     * @param pEvent - Change event.
     */
    public onInputNameChange(pIndex: number, pEvent: Event): void {
        const lInput: HTMLInputElement = pEvent.target as HTMLInputElement;
        const lNewName: string = lInput.value;
        const lIsInvalid: boolean = !this.validateName(lNewName) || this.isNameDuplicate(lNewName, 'input', pIndex);
        lInput.style.borderColor = lIsInvalid ? 'var(--pn-accent-danger)' : '';
        // Always dispatch so the editor can run validation and show errors.
        const lInputs: Array<PortEntry> = [...this.functionInputs];
        lInputs[pIndex] = { ...lInputs[pIndex], name: lNewName };
        this.functionInputs = lInputs;
        this.mPropertiesChange.dispatchEvent({ inputs: lInputs });
    }

    /**
     * Handle input port type change.
     *
     * @param pIndex - Index of the input.
     * @param pEvent - Change event.
     */
    public onInputTypeChange(pIndex: number, pEvent: Event): void {
        const lNewType: string = (pEvent.target as HTMLSelectElement).value;
        const lInputs: Array<PortEntry> = [...this.functionInputs];
        lInputs[pIndex] = { ...lInputs[pIndex], type: lNewType };
        this.functionInputs = lInputs;
        this.mPropertiesChange.dispatchEvent({ inputs: lInputs });
    }

    /**
     * Handle output port name change.
     *
     * @param pIndex - Index of the output.
     * @param pEvent - Change event.
     */
    public onOutputNameChange(pIndex: number, pEvent: Event): void {
        const lInput: HTMLInputElement = pEvent.target as HTMLInputElement;
        const lNewName: string = lInput.value;
        const lIsInvalid: boolean = !this.validateName(lNewName) || this.isNameDuplicate(lNewName, 'output', pIndex);
        lInput.style.borderColor = lIsInvalid ? 'var(--pn-accent-danger)' : '';
        // Always dispatch so the editor can run validation and show errors.
        const lOutputs: Array<PortEntry> = [...this.functionOutputs];
        lOutputs[pIndex] = { ...lOutputs[pIndex], name: lNewName };
        this.functionOutputs = lOutputs;
        this.mPropertiesChange.dispatchEvent({ outputs: lOutputs });
    }

    /**
     * Handle output port type change.
     *
     * @param pIndex - Index of the output.
     * @param pEvent - Change event.
     */
    public onOutputTypeChange(pIndex: number, pEvent: Event): void {
        const lNewType: string = (pEvent.target as HTMLSelectElement).value;
        const lOutputs: Array<PortEntry> = [...this.functionOutputs];
        lOutputs[pIndex] = { ...lOutputs[pIndex], type: lNewType };
        this.functionOutputs = lOutputs;
        this.mPropertiesChange.dispatchEvent({ outputs: lOutputs });
    }

    /**
     * Add a new empty input port.
     */
    public onAddInput(): void {
        const lDefaultType: string = this.mAvailableTypes.length > 0 ? this.mAvailableTypes[0] : 'number';
        const lInputs: Array<PortEntry> = [...this.functionInputs, { name: 'new_input', type: lDefaultType }];
        this.functionInputs = lInputs;
        this.mPropertiesChange.dispatchEvent({ inputs: lInputs });
    }

    /**
     * Delete an input port by index.
     *
     * @param pIndex - Index of the input to remove.
     */
    public onDeleteInput(pIndex: number): void {
        const lInputs: Array<PortEntry> = [...this.functionInputs];
        lInputs.splice(pIndex, 1);
        this.functionInputs = lInputs;
        this.mPropertiesChange.dispatchEvent({ inputs: lInputs });
    }

    /**
     * Add a new empty output port.
     */
    public onAddOutput(): void {
        const lDefaultType: string = this.mAvailableTypes.length > 0 ? this.mAvailableTypes[0] : 'number';
        const lOutputs: Array<PortEntry> = [...this.functionOutputs, { name: 'new_output', type: lDefaultType }];
        this.functionOutputs = lOutputs;
        this.mPropertiesChange.dispatchEvent({ outputs: lOutputs });
    }

    /**
     * Delete an output port by index.
     *
     * @param pIndex - Index of the output to remove.
     */
    public onDeleteOutput(pIndex: number): void {
        const lOutputs: Array<PortEntry> = [...this.functionOutputs];
        lOutputs.splice(pIndex, 1);
        this.functionOutputs = lOutputs;
        this.mPropertiesChange.dispatchEvent({ outputs: lOutputs });
    }

    /**
     * Get the list of unused imports available for selection.
     */
    public get unusedImports(): Array<string> {
        return this.mCachedUnusedImports;
    }

    /**
     * Handle import dropdown selection change.
     *
     * @param pEvent - Change event from the select element.
     */
    public onImportSelectChange(pEvent: Event): void {
        this.mSelectedImport = (pEvent.target as HTMLSelectElement).value;
    }

    /**
     * Add the currently selected import from the dropdown.
     */
    public onAddSelectedImport(): void {
        const lImportName: string = this.mSelectedImport || (this.mCachedUnusedImports.length > 0 ? this.mCachedUnusedImports[0] : '');
        if (!lImportName) {
            return;
        }

        const lImports: Array<string> = [...this.mFunctionImports, lImportName];
        this.functionImports = lImports;
        this.mSelectedImport = '';
        this.mPropertiesChange.dispatchEvent({ imports: lImports });
    }

    /**
     * Delete an import by index.
     *
     * @param pIndex - Index of the import to remove.
     */
    public onDeleteImport(pIndex: number): void {
        const lImports: Array<string> = [...this.mFunctionImports];
        lImports.splice(pIndex, 1);
        this.functionImports = lImports;
        this.mPropertiesChange.dispatchEvent({ imports: lImports });
    }

    /**
     * Rebuild the cached list of unused imports.
     */
    private rebuildUnusedImports(): void {
        const lUsed: Set<string> = new Set(this.mFunctionImports);
        this.mCachedUnusedImports = this.mAvailableImports.filter(i => !lUsed.has(i));
    }
}
