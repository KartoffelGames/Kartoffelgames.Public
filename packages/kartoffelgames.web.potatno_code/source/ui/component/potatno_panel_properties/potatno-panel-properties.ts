import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Component, PwbComponent, type IComponentOnConnect, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import { PotatnoCodeUiManager, PotatnoCodeUiManagerEventType, type PotatnoCodeUiManagerPortView } from '../../potatno-code-ui-manager.ts';
import templateCss from './potatno-panel-properties.css' with { type: 'text' };
import propertiesTemplate from './potatno-panel-properties.html' with { type: 'text' };

/**
 * Properties panel component for the potatno-code visual editor.
 *
 * Reads the active function's name, ports and imports from the shared {@link PotatnoCodeUiManager}
 * and applies every edit back through it; the manager re-validates and notifies listeners. Only the
 * pending import-dropdown selection is local. Name/identifier validation stays here as a UI concern.
 */
@PwbComponent({
    selector: 'potatno-panel-properties',
    template: propertiesTemplate,
    style: templateCss,
})
export class PotatnoPanelProperties implements IComponentOnConnect, IComponentOnDeconstruct {
    private readonly mComponent: Component;
    private readonly mManager: PotatnoCodeUiManager;
    private mSelectedImport: string;
    private mUnsubscribe: (() => void) | null;

    /**
     * Available import names registered by the project.
     */
    public get availableImports(): Array<string> {
        return this.mManager.availableImports;
    }

    /**
     * Available port types that can be selected.
     */
    public get availableTypes(): Array<string> {
        return this.mManager.availableTypes;
    }

    /**
     * Whether the system function allows user editing of ports/imports.
     */
    public get editableByUser(): boolean {
        return this.mManager.activeFunctionEditableByUser;
    }

    /**
     * Import names used by the active function.
     */
    public get functionImports(): Array<string> {
        return this.mManager.activeFunctionImports;
    }

    /**
     * Input port descriptors of the active function.
     */
    public get functionInputs(): Array<PortEntry> {
        return this.mManager.activeFunctionInputs;
    }

    /**
     * Name of the active function.
     */
    public get functionName(): string {
        return this.mManager.activeFunctionName;
    }

    /**
     * Output port descriptors of the active function.
     */
    public get functionOutputs(): Array<PortEntry> {
        return this.mManager.activeFunctionOutputs;
    }

    /**
     * Whether the active function is a system function (non-editable).
     */
    public get isSystem(): boolean {
        return this.mManager.activeFunctionIsSystem;
    }

    /**
     * Whether the function name input should be disabled.
     */
    public get nameDisabled(): boolean {
        return this.isSystem;
    }

    /**
     * Whether port/import editing is disabled.
     */
    public get portsDisabled(): boolean {
        return this.isSystem && !this.editableByUser;
    }

    /**
     * Import names available to add (registered but not yet used).
     */
    public get unusedImports(): Array<string> {
        const lUsed: Set<string> = new Set<string>(this.functionImports);
        return this.availableImports.filter((pImport) => !lUsed.has(pImport));
    }

    /**
     * Create the properties panel.
     *
     * @param pComponent - Injected component reference, used to trigger self-updates.
     * @param pManager - Injected shared UI manager singleton.
     */
    public constructor(pComponent: Component = Injection.use(Component), pManager: PotatnoCodeUiManager = Injection.use(PotatnoCodeUiManager)) {
        this.mComponent = pComponent;
        this.mManager = pManager;
        this.mSelectedImport = '';
        this.mUnsubscribe = null;
    }

    /**
     * Subscribe to manager events that change the displayed function.
     */
    public onConnect(): void {
        this.mUnsubscribe = this.mManager.listen([
            PotatnoCodeUiManagerEventType.DocumentChange,
            PotatnoCodeUiManagerEventType.FunctionActivate,
            PotatnoCodeUiManagerEventType.FunctionChange
        ], () => {
            this.mComponent.updater.update();
        });
    }

    /**
     * Detach the manager subscription.
     */
    public onDeconstruct(): void {
        this.mUnsubscribe?.();
        this.mUnsubscribe = null;
    }

    /**
     * Add the currently selected import from the dropdown.
     */
    public onAddSelectedImport(): void {
        const lUnused: Array<string> = this.unusedImports;
        const lImportName: string = this.mSelectedImport || (lUnused.length > 0 ? lUnused[0] : '');
        if (!lImportName) {
            return;
        }

        this.mManager.updateFunctionProperties({ imports: [...this.functionImports, lImportName] });
        this.mSelectedImport = '';
    }

    /**
     * Add a new empty input port.
     */
    public onAddInput(): void {
        const lDefaultType: string = this.availableTypes.length > 0 ? this.availableTypes[0] : 'number';
        this.mManager.updateFunctionProperties({ inputs: [...this.functionInputs, { name: this.uniquePortName('new_input'), type: lDefaultType }] });
    }

    /**
     * Add a new empty output port.
     */
    public onAddOutput(): void {
        const lDefaultType: string = this.availableTypes.length > 0 ? this.availableTypes[0] : 'number';
        this.mManager.updateFunctionProperties({ outputs: [...this.functionOutputs, { name: this.uniquePortName('new_output'), type: lDefaultType }] });
    }

    /**
     * Delete an import by index.
     *
     * @param pIndex - Index of the import to remove.
     */
    public onDeleteImport(pIndex: number): void {
        const lImports: Array<string> = [...this.functionImports];
        lImports.splice(pIndex, 1);
        this.mManager.updateFunctionProperties({ imports: lImports });
    }

    /**
     * Delete an input port by index.
     *
     * @param pIndex - Index of the input to remove.
     */
    public onDeleteInput(pIndex: number): void {
        const lInputs: Array<PortEntry> = [...this.functionInputs];
        lInputs.splice(pIndex, 1);
        this.mManager.updateFunctionProperties({ inputs: lInputs });
    }

    /**
     * Delete an output port by index.
     *
     * @param pIndex - Index of the output to remove.
     */
    public onDeleteOutput(pIndex: number): void {
        const lOutputs: Array<PortEntry> = [...this.functionOutputs];
        lOutputs.splice(pIndex, 1);
        this.mManager.updateFunctionProperties({ outputs: lOutputs });
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
        const lInputs: Array<PortEntry> = [...this.functionInputs];
        lInputs[pIndex] = { ...lInputs[pIndex], name: lNewName };
        this.mManager.updateFunctionProperties({ inputs: lInputs });
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
        this.mManager.updateFunctionProperties({ inputs: lInputs });
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
        this.mManager.updateFunctionProperties({ name: lNewName });
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
        const lOutputs: Array<PortEntry> = [...this.functionOutputs];
        lOutputs[pIndex] = { ...lOutputs[pIndex], name: lNewName };
        this.mManager.updateFunctionProperties({ outputs: lOutputs });
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
        this.mManager.updateFunctionProperties({ outputs: lOutputs });
    }

    /**
     * Check whether a name is duplicated across inputs, outputs, and function name.
     *
     * @param pName - The name to check.
     * @param pExcludeList - Which list the name belongs to.
     * @param pIndex - Index within the list to skip.
     *
     * @returns True if duplicated.
     */
    private isNameDuplicate(pName: string, pExcludeList: 'input' | 'output' | 'function', pIndex?: number): boolean {
        if (pExcludeList !== 'function' && pName === this.functionName) {
            return true;
        }

        const lInputs: Array<PortEntry> = this.functionInputs;
        for (let lIdx: number = 0; lIdx < lInputs.length; lIdx++) {
            if (pExcludeList === 'input' && lIdx === pIndex) {
                continue;
            }
            if (lInputs[lIdx].name === pName) {
                return true;
            }
        }

        const lOutputs: Array<PortEntry> = this.functionOutputs;
        for (let lIdx: number = 0; lIdx < lOutputs.length; lIdx++) {
            if (pExcludeList === 'output' && lIdx === pIndex) {
                continue;
            }
            if (lOutputs[lIdx].name === pName) {
                return true;
            }
        }

        return false;
    }

    /**
     * Produce a port name that does not collide with the function name or any existing port.
     *
     * @param pBase - The base name to start from.
     *
     * @returns A unique, identifier-safe port name.
     */
    private uniquePortName(pBase: string): string {
        if (!this.isNameDuplicate(pBase, 'function')) {
            return pBase;
        }

        let lCounter: number = 2;
        while (this.isNameDuplicate(`${pBase}_${lCounter}`, 'function')) {
            lCounter++;
        }

        return `${pBase}_${lCounter}`;
    }

    /**
     * Validate that a name matches the required identifier pattern.
     *
     * @param pName - The name to validate.
     *
     * @returns True if valid.
     */
    private validateName(pName: string): boolean {
        return /^[a-zA-Z][a-zA-Z0-9_]*$/.test(pName);
    }
}

/**
 * Port definition for function inputs and outputs.
 */
type PortEntry = PotatnoCodeUiManagerPortView;
