import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Component, ComponentState, PwbComponent, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import { PotatnoFunctionDefinitionStatics } from '../../../project/potatno-function-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager, type PotatnoCodeUiManagerPortView, type PotatnoCodeUiManagerUnsubscribe } from '../../manager/potatno-ui-manager.ts';
import templateCss from './potatno-function-properties-component.css' with { type: 'text' };
import propertiesTemplate from './potatno-function-properties-component.html' with { type: 'text' };

/**
 * Properties panel component for the potatno-code visual editor.
 *
 * Reads the active function's name, ports and imports from the shared {@link PotatnoUiManager}
 * and applies every edit back through it; the manager re-validates and notifies listeners. Only the
 * pending import-dropdown selection is local. Name/identifier validation stays here as a UI concern.
 */
@PwbComponent({
    selector: 'potatno-function-properties',
    template: propertiesTemplate,
    style: templateCss,
})
export class PotatnoFunctionPropertiesComponent implements IComponentOnDeconstruct {
    private readonly mComponent: Component;
    private readonly mManager: PotatnoUiManager;
    private mSelectedImportId: string;
    private readonly mUnsubscribe: PotatnoCodeUiManagerUnsubscribe;
    private readonly mProjectTypes: Set<string>;

    /**
     * Function properties.
     */
    @ComponentState.state({ complexValue: true })
    public accessor functionProperties: PotatnoPanelPropertiesProperties;

    /**
     * Available import ids registered by the project.
     */
    public get availableImports(): Array<ImportEntry> {
        return this.mManager.project?.imports.map((pImportDefinition) => ({
            id: pImportDefinition.id,
            label: pImportDefinition.label
        })) ?? [];
    }

    /**
     * Available port types that can be selected.
     */
    public get projectTypes(): Set<string> {
        return this.mProjectTypes;
    }

    /**
     * Import ids used by the active function.
     */
    public get functionImportIds(): Array<string> {
        return [...(this.mManager.activeFunction?.imports ?? [])];
    }

    /**
     * Imports used by the active function.
     */
    public get functionImports(): Array<ImportEntry> {
        const lAvailableImports: Map<string, ImportEntry> = new Map<string, ImportEntry>(this.availableImports.map((pImportEntry) => [pImportEntry.id, pImportEntry]));
        return this.functionImportIds.map((pImportId) => lAvailableImports.get(pImportId) ?? { id: pImportId, label: pImportId });
    }

    /**
     * Input port descriptors of the active function.
     */
    public get functionInputs(): Array<PortEntry> {
        return (this.mManager.activeFunction?.inputs ?? []).map((pPort) => ({ name: pPort.label, type: pPort.dataType }));
    }

    /**
     * Name of the active function.
     */
    public get functionName(): string {
        return this.mManager.activeFunction?.label ?? '';
    }

    /**
     * Output port descriptors of the active function.
     */
    public get functionOutputs(): Array<PortEntry> {
        return (this.mManager.activeFunction?.outputs ?? []).map((pPort) => ({ name: pPort.label, type: pPort.dataType }));
    }

    /**
     * Whether the function name input should be disabled.
     */
    public get nameDisabled(): boolean {
        return this.mManager.activeFunction?.isSystem ?? false;
    }

    /**
     * Import ids available to add (registered but not yet used).
     */
    public get unusedImports(): Array<ImportEntry> {
        const lUsed: Set<string> = new Set<string>(this.functionImportIds);
        return this.availableImports.filter((pImportEntry) => !lUsed.has(pImportEntry.id));
    }

    /**
     * Create the properties panel.
     *
     * @param pComponent - Injected component reference, used to trigger self-updates.
     * @param pManager - Injected shared UI manager singleton.
     */
    public constructor(pComponent: Component = Injection.use(Component), pManager: PotatnoUiManager = Injection.use(PotatnoUiManager)) {
        this.mComponent = pComponent;
        this.mManager = pManager;
        this.mSelectedImportId = '';
        this.mProjectTypes = new Set<string>();

        // Create a feedback loop. This component triggers function changes, what triggers a data reload, what triggers a UI update.
        this.functionProperties = this.convertFunctionProperties();
        this.mUnsubscribe = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.Document | PotatnoCodeUiManagerChangeType.Function | PotatnoCodeUiManagerChangeType.SpecialActiveFunction, () => {
            // Update functions properties.
            this.functionProperties = this.convertFunctionProperties();

            // Load all types. Usually types dont change.
            this.mProjectTypes.clear();
            for (const [lTypeName] of this.mManager.project!.types.types) {
                this.mProjectTypes.add(lTypeName);
            }

            // And then update the ui.
            this.mComponent.updater.updateAsync();
        });
    }

    /**
     * Update saved function properties UI.
     * 
     * @returns the converted function properties.
     */
    public convertFunctionProperties(): PotatnoPanelPropertiesProperties {
        // Create empty function property list. 
        const lFunctionProperties: PotatnoPanelPropertiesProperties = {
            inputs: new Array<PotatnoPanelPropertiesPropertiesPort>(),
            outputs: new Array<PotatnoPanelPropertiesPropertiesPort>(),
            imports: new Array<PotatnoPanelPropertiesPropertiesImport>(),
            statics: {
                label: true,
                imports: true,
                inputs: true,
                outputs: true
            }
        };

        // Read current function.
        const lFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> | null = this.mManager.activeFunction;
        if (!lFunction) {
            return lFunctionProperties;
        }

        // Set statics.
        const lFunctionDefinition = lFunction.project.getFunction(lFunction.definitionId);
        if (lFunctionDefinition) {
            lFunctionProperties.statics.label = lFunction.isSystem;
            lFunctionProperties.statics.imports = (lFunctionDefinition.statics & PotatnoFunctionDefinitionStatics.imports) !== 0;
            lFunctionProperties.statics.inputs = (lFunctionDefinition.statics & PotatnoFunctionDefinitionStatics.inputs) !== 0;
            lFunctionProperties.statics.outputs = (lFunctionDefinition.statics & PotatnoFunctionDefinitionStatics.outputs) !== 0;
        }

        // Insert imports.
        for (const lImport of lFunction.project.imports) {
            // Only add label if it is contained in the current function.
            if (!lFunction.imports.has(lImport.id)) {
                continue;
            }

            lFunctionProperties.imports.push({
                id: lImport.id,
                label: lImport.label
            });
        }

        // Insert inputs.
        const lInputDublicateList: Set<string> = new Set<string>();
        for (const lInput of lFunction.inputs) {
            lFunctionProperties.inputs.push({
                label: lInput.label,
                dataType: lInput.dataType,
                hasError: lInputDublicateList.has(lInput.label)
            });

            lInputDublicateList.add(lInput.label);
        }

        // Insert outputs.
        const lOutputDublicateList: Set<string> = new Set<string>();
        for (const lInput of lFunction.outputs) {
            lFunctionProperties.outputs.push({
                label: lInput.label,
                dataType: lInput.dataType,
                hasError: lOutputDublicateList.has(lInput.label)
            });

            lOutputDublicateList.add(lInput.label);
        }

        return lFunctionProperties;
    }

    /**
     * Detach the manager subscription.
     */
    public onDeconstruct(): void {
        this.mUnsubscribe();
    }

    /**
     * Add the currently selected import from the dropdown.
     */
    public onAddSelectedImport(): void {
        const lUnused: Array<ImportEntry> = this.unusedImports;
        const lImportId: string = this.mSelectedImportId || (lUnused.length > 0 ? lUnused[0].id : '');
        if (!lImportId) {
            return;
        }

        this.mManager.updateFunctionProperties({ imports: [...this.functionImportIds, lImportId] });
        this.mSelectedImportId = '';
    }

    /**
     * Add a new empty input port.
     * 
     * @param pTargetPortList - Target port list reference.
     */
    public addPort(pTargetPortList: Array<PotatnoPanelPropertiesPropertiesPort>): void {
        // Read the first (default) datatype.
        const lDataType: string | undefined = this.projectTypes.values().next().value;
        if (!lDataType) {
            return;
        }

        // Create a port name by checking the target lists referrence to be the input or output list. 
        const lPortName: string = (() => {
            if (pTargetPortList === this.functionProperties.inputs) {
                return 'Input';
            }

            return 'Output';
        })();

        // Add new "empty" port
        pTargetPortList.push({
            label: lPortName,
            dataType: lDataType,
            hasError: false // Error is set after submiting and resync.
        });

        this.submitChange();
    }

    /**
     * Add a new empty output port.
     */
    public onAddOutput(): void {
        const lDefaultType: string = this.projectTypes.length > 0 ? this.projectTypes[0] : 'number';
        this.mManager.updateFunctionProperties({ outputs: [...this.functionOutputs, { name: this.uniquePortName('new_output'), type: lDefaultType }] });
    }

    /**
     * Delete an import by index.
     *
     * @param pIndex - Index of the import to remove.
     */
    public onDeleteImport(pIndex: number): void {
        const lImportIds: Array<string> = [...this.functionImportIds];
        lImportIds.splice(pIndex, 1);
        this.mManager.updateFunctionProperties({ imports: lImportIds });
    }

    /**
     * Delete an input port by index.
     *
     * @param pIndex - Index of the input to remove.
     */
    public deletePort(pPort: PotatnoPanelPropertiesPropertiesPort, pTargetPortList: Array<PotatnoPanelPropertiesPropertiesPort>): void {
        // Find index of port.
        const lInputIndex: number = pTargetPortList.indexOf(pPort);
        if (lInputIndex === -1) {
            return;
        }

        // Remove input from function properties.
        pTargetPortList.splice(lInputIndex, 1);

        // And submit the change.
        this.submitChange();
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
        this.mSelectedImportId = (pEvent.target as HTMLSelectElement).value;
    }

    /**
     * Submit changes to the underlying function.
     * Any changes that where made to the function properties are synced to the actual function.
     */
    public submitChange(): void {
        // Update function by removing and adding all new inputs. 
        this.mManager.graph.updateFunction(this.mManager.activeFunction, (pFunction) => {
            // Remove and add all inputs. Ensures correct port order on functions definitions.
            if (!this.functionProperties.statics.inputs) {
                for (const lPort of pFunction.inputs) {
                    pFunction.removeInput(lPort);
                }
                for (const lPortData of this.functionProperties.inputs) {
                    pFunction.addInput({ dataType: lPortData.dataType, label: lPortData.label });
                }
            }

            // Remove and add all outputs. Ensures correct port order on functions definitions.
            if (!this.functionProperties.statics.outputs) {
                for (const lPort of pFunction.outputs) {
                    pFunction.removeOutput(lPort);
                }
                for (const lPortData of this.functionProperties.outputs) {
                    pFunction.addOutput({ dataType: lPortData.dataType, label: lPortData.label });
                }
            }

            // Remove and add all imports. Easier to code and run than trying to merge.
            if (!this.functionProperties.statics.imports) {
                for (const lImportId of pFunction.imports) {
                    pFunction.removeImport(lImportId);
                }
                for (const lImport of this.functionProperties.imports) {
                    pFunction.addImport(lImport.id);
                }
            }
        });
    }

    /**
     * Handle function name change.
     *
     * @param pEvent - Change event from the name input.
     */
    public onNameChange(pEvent: Event): void {
        const lInput: HTMLInputElement = pEvent.target as HTMLInputElement;
        const lNewName: string = lInput.value;
        const lIsInvalid: boolean = this.isNameDuplicate(lNewName, 'function');
        lInput.style.borderColor = lIsInvalid ? 'var(--potatno-color-error)' : '';
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
        const lIsInvalid: boolean = this.isNameDuplicate(lNewName, 'output', pIndex);
        lInput.style.borderColor = lIsInvalid ? 'var(--potatno-color-error)' : '';
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
}

export type PotatnoPanelPropertiesProperties = {
    inputs: Array<PotatnoPanelPropertiesPropertiesPort>;
    outputs: Array<PotatnoPanelPropertiesPropertiesPort>;
    imports: Array<PotatnoPanelPropertiesPropertiesImport>;
    statics: {
        label: boolean;
        imports: boolean;
        inputs: boolean;
        outputs: boolean;
    };
};

export type PotatnoPanelPropertiesPropertiesPort = {
    label: string;
    dataType: string;
    hasError: boolean;
};

export type PotatnoPanelPropertiesPropertiesImport = {
    id: string;
    label: string;
};

/**
 * Port definition for function inputs and outputs.
 */
type PortEntry = PotatnoCodeUiManagerPortView;

/**
 * Import option shown by the properties panel.
 */
type ImportEntry = {
    id: string;
    label: string;
};
