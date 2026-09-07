import { Injection } from '@kartoffelgames/core-dependency-injection';
import { KgButtonComponent, KgInputComponent, KgResizeBoxComponent } from '@kartoffelgames/web-components';
import { ComponentState, PwbComponent, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import { PotatnoFunctionDefinitionStatics } from '../../../project/potatno-function-definition.ts';
import type { PotatnoImportDefinition } from '../../../project/potatno-import-definition.ts';
import type { PotatnoProjectTypeDefinition, PotatnoProjectTypeMapping, PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager, type PotatnoCodeUiManagerUnsubscribe } from '../../manager/potatno-ui-manager.ts';
import templateCss from './potatno-function-properties-component.css' with { type: 'text' };
import propertiesTemplate from './potatno-function-properties-component.html' with { type: 'text' };

/**
 * Properties panel component for the potatno-code visual editor.
 */
@PwbComponent({
    selector: 'potatno-function-properties',
    template: propertiesTemplate,
    style: templateCss,
    components: [KgResizeBoxComponent, KgButtonComponent, KgInputComponent]
})
export class PotatnoFunctionPropertiesComponent implements IComponentOnDeconstruct {
    private readonly mManager: PotatnoUiManager;
    private readonly mProjectTypes: Array<PotatnoFunctionPropertiesComponentProjectType>;
    private mSelectedImportId: string;
    private readonly mUnsubscribeFunctionSwitch: PotatnoCodeUiManagerUnsubscribe;
    private readonly mUnsubscribeFunctionUpdate: PotatnoCodeUiManagerUnsubscribe;

    /**
     * Function properties.
     */
    @ComponentState.state({ complexValue: true })
    public accessor functionProperties: PotatnoFunctionPropertiesComponentProperties;

    /**
     * Available port types that can be selected.
     */
    public get projectTypes(): Array<PotatnoFunctionPropertiesComponentProjectType> {
        return this.mProjectTypes;
    }

    /**
     * Current selected import id.
     */
    public get selectedImportId(): string {
        return this.mSelectedImportId;
    } set selectedImportId(pImportId: string) {
        this.mSelectedImportId = pImportId;
    }

    /**
     * Import ids available to add (registered but not yet used).
     */
    public get unusedImports(): Array<PotatnoImportDefinition<PotatnoProjectTypesDefinition>> {
        // Filter all imports with the already selected imports of the function.
        return this.mManager.activeFunction.project.imports.filter((pAvailableImport) => {
            return !this.functionProperties.imports.find((pUsedImport) => {
                return pAvailableImport.id === pUsedImport.id;
            });
        });
    }

    /**
     * Create the function properties panel.
     *
     * @param pComponent - Injected component reference, used to trigger self-updates.
     * @param pManager - Injected shared UI manager singleton.
     */
    public constructor(pManager: PotatnoUiManager = Injection.use(PotatnoUiManager)) {
        this.mManager = pManager;
        this.mSelectedImportId = '';
        this.mProjectTypes = new Array<PotatnoFunctionPropertiesComponentProjectType>();

        // Create a feedback loop. This component triggers function changes, what triggers a data reload, what triggers a UI update.
        this.functionProperties = this.convertFunctionProperties(null);

        this.mUnsubscribeFunctionUpdate = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.Function, () => {
            // Update functions properties. Also triggers update.
            this.functionProperties = this.convertFunctionProperties(this.functionProperties);
        });

        this.mUnsubscribeFunctionSwitch = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.Document | PotatnoCodeUiManagerChangeType.SpecialActiveFunction, () => {
            // Load all types. Usually types dont change.
            this.mProjectTypes.splice(0, this.mProjectTypes.length);
            for (const [lTypeName, lTypeDefinition] of this.mManager.project.types.types) {
                this.mProjectTypes.push({
                    name: lTypeName,
                    definition: lTypeDefinition
                });
            }

            // Set new functions properties. Also triggers update.
            this.functionProperties = this.convertFunctionProperties(null);
        });
    }

    /**
     * Add a new empty input port.
     * 
     * @param pTargetPortList - Target port list reference.
     */
    public addPort(pTargetPortList: Array<PotatnoFunctionPropertiesComponentPort>): void {
        // Read the first (default) datatype.
        const lDataType: string | undefined = this.projectTypes[0]?.name;
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

        // Reset new state before appending a new new state.
        this.resetNewState();

        // Add new "empty" port
        pTargetPortList.push({
            new: true,
            label: lPortName,
            dataType: lDataType,
            hasError: false // Error is set after submiting and resync.
        });

        this.submitChange();
    }

    /**
     * Add the currently selected import from the dropdown.
     */
    public addSelectedImport(): void {
        // Read all available imports.
        const lUnusedImports: Array<PotatnoImportDefinition<PotatnoProjectTypesDefinition>> = this.unusedImports;
        if (lUnusedImports.length === 0) {
            return;
        }

        // Find the selected import.
        let lSelectedImport: PotatnoImportDefinition<PotatnoProjectTypesDefinition> | undefined = lUnusedImports.find((pUnusedImport) => {
            return pUnusedImport.id === this.mSelectedImportId;
        });

        // When nothing was found, just add the first.
        if (!lSelectedImport) {
            lSelectedImport = lUnusedImports.at(0)!;
        }

        // Reset new state before appending a new new state.
        this.resetNewState();

        // Add import and submit changes.
        this.functionProperties.imports.push({
            new: true,
            id: lSelectedImport.id,
            label: lSelectedImport.label
        });
        this.submitChange();
    }

    /**
     * Delete an import by index.
     *
     * @param pIndex - Index of the import to remove.
     */
    public deleteImport(pImport: PotatnoFunctionPropertiesComponentImport): void {
        const lImportIndex: number = this.functionProperties.imports.indexOf(pImport);
        if (lImportIndex === -1) {
            return;
        }

        // Remove input from function properties.
        this.functionProperties.imports.splice(lImportIndex, 1);

        // Reset state of all new items as after a delete, none can be new.
        this.resetNewState();

        // And submit the change.
        this.submitChange();
    }

    /**
     * Delete an input port by index.
     *
     * @param pIndex - Index of the input to remove.
     */
    public deletePort(pPort: PotatnoFunctionPropertiesComponentPort, pTargetPortList: Array<PotatnoFunctionPropertiesComponentPort>): void {
        // Find index of port.
        const lInputIndex: number = pTargetPortList.indexOf(pPort);
        if (lInputIndex === -1) {
            return;
        }

        // Remove input from function properties.
        pTargetPortList.splice(lInputIndex, 1);

        // Reset state of all new items as after a delete, none can be new.
        this.resetNewState();

        // And submit the change.
        this.submitChange();
    }

    /**
     * Detach the manager subscription.
     */
    public onDeconstruct(): void {
        this.mUnsubscribeFunctionUpdate();
        this.mUnsubscribeFunctionSwitch();
    }

    /**
     * Submit changes to the underlying function.
     * Any changes that where made to the function properties are synced to the actual function.
     */
    public async submitChange(): Promise<void> {
        let lHasError: boolean = false;

        // Insert inputs.
        const lInputDublicateList: Set<string> = new Set<string>();
        for (const lInput of this.functionProperties.inputs) {
            // Set error when the name already exists. Save the global error state.
            lInput.hasError = lInputDublicateList.has(lInput.label);
            lHasError ||= lInput.hasError;

            lInputDublicateList.add(lInput.label);
        }

        // Insert outputs.
        const lOutputDublicateList: Set<string> = new Set<string>();
        for (const lInput of this.functionProperties.outputs) {
            // Set error when the name already exists. Save the global error state.
            lInput.hasError = lOutputDublicateList.has(lInput.label);
            lHasError ||= lInput.hasError;

            lOutputDublicateList.add(lInput.label);
        }

        // On error. Just trigger the rebuild without syncing the data.
        if (lHasError) {
            this.functionProperties = this.functionProperties;
            return;
        }

        // Save the current edited function before shedule, so even after a change, the correct function will be updated.
        const lFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> = this.mManager.activeFunction;
        const lFunctionProperties: PotatnoFunctionPropertiesComponentProperties = this.functionProperties;

        // Queue a macro task, so all event are executed before syncing.
        await new Promise((pResolve) => {
            globalThis.setTimeout(pResolve, 10);
        });

        // Update function by removing and adding all new inputs. 
        this.mManager.graph.updateFunction(lFunction, (pFunction) => {
            // Update the name.
            pFunction.label = lFunctionProperties.label;

            // Remove and add all inputs. Ensures correct port order on functions definitions.
            if (!lFunctionProperties.statics.inputs) {
                while (pFunction.inputs.length > 0) {
                    pFunction.removeInput(pFunction.inputs.at(0)!);
                }
                for (const lPortData of lFunctionProperties.inputs) {
                    pFunction.addInput({ dataType: lPortData.dataType, label: lPortData.label });
                }
            }

            // Remove and add all outputs. Ensures correct port order on functions definitions.
            if (!lFunctionProperties.statics.outputs) {
                while (pFunction.outputs.length > 0) {
                    pFunction.removeOutput(pFunction.outputs.at(0)!);
                }
                for (const lPortData of lFunctionProperties.outputs) {
                    pFunction.addOutput({ dataType: lPortData.dataType, label: lPortData.label });
                }
            }

            // Remove and add all imports. Easier to code and run than trying to merge.
            if (!lFunctionProperties.statics.imports) {
                for (const lImportId of pFunction.imports) {
                    pFunction.removeImport(lImportId);
                }
                for (const lImport of lFunctionProperties.imports) {
                    pFunction.addImport(lImport.id);
                }
            }
        });
    }

    /**
     * Update saved function properties UI.
     * 
     * @returns the converted function properties.
     */
    private convertFunctionProperties(pOldProperties: PotatnoFunctionPropertiesComponentProperties | null): PotatnoFunctionPropertiesComponentProperties {
        // Create empty function property list. 
        const lFunctionProperties: PotatnoFunctionPropertiesComponentProperties = {
            label: '',
            inputs: new Array<PotatnoFunctionPropertiesComponentPort>(),
            outputs: new Array<PotatnoFunctionPropertiesComponentPort>(),
            imports: new Array<PotatnoFunctionPropertiesComponentImport>(),
            statics: {
                label: true,
                imports: true,
                inputs: true,
                outputs: true
            }
        };

        // Read current function.
        const lFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> = this.mManager.activeFunction;

        // Set statics.
        const lFunctionDefinition = lFunction.project.getFunction(lFunction.definitionId);
        if (lFunctionDefinition) {
            lFunctionProperties.statics.label = lFunction.isSystem;
            lFunctionProperties.statics.imports = (lFunctionDefinition.statics & PotatnoFunctionDefinitionStatics.imports) !== 0;
            lFunctionProperties.statics.inputs = (lFunctionDefinition.statics & PotatnoFunctionDefinitionStatics.inputs) !== 0;
            lFunctionProperties.statics.outputs = (lFunctionDefinition.statics & PotatnoFunctionDefinitionStatics.outputs) !== 0;
        }

        // Insert function label
        lFunctionProperties.label = lFunction.label;

        // Insert imports.
        for (const lImport of lFunction.project.imports) {
            // Only add label if it is contained in the current function.
            if (!lFunction.imports.has(lImport.id)) {
                continue;
            }

            const lIsNew: boolean = (() => {
                if (!pOldProperties) {
                    return false;
                }

                const lExistingImport: PotatnoFunctionPropertiesComponentImport | undefined = pOldProperties.imports.find((pExistingPort) => {
                    return pExistingPort.id === lImport.id;
                });

                return lExistingImport?.new ?? false;
            })();

            lFunctionProperties.imports.push({
                new: lIsNew,
                id: lImport.id,
                label: lImport.label
            });
        }

        // Insert inputs.
        for (const lPort of lFunction.inputs) {
            const lIsNew: boolean = (() => {
                if (!pOldProperties) {
                    return false;
                }

                const lExistingPort: PotatnoFunctionPropertiesComponentPort | undefined = pOldProperties.inputs.find((pExistingPort) => {
                    return pExistingPort.label === lPort.label;
                });

                return lExistingPort?.new ?? false;
            })();

            lFunctionProperties.inputs.push({
                new: lIsNew,
                label: lPort.label,
                dataType: lPort.dataType,
                hasError: false // Cant be dublicate
            });
        }

        // Insert outputs.
        for (const lPort of lFunction.outputs) {
            const lIsNew: boolean = (() => {
                if (!pOldProperties) {
                    return false;
                }

                const lExistingPort: PotatnoFunctionPropertiesComponentPort | undefined = pOldProperties.outputs.find((pExistingPort) => {
                    return pExistingPort.label === lPort.label;
                });

                return lExistingPort?.new ?? false;
            })();

            lFunctionProperties.outputs.push({
                new: lIsNew,
                label: lPort.label,
                dataType: lPort.dataType,
                hasError: false // Cant be dublicate
            });
        }

        return lFunctionProperties;
    }

    /**
     * Reset all "new" states of ports and imports to avoid double animations.
     */
    private resetNewState(): void {
        for (const lPort of this.functionProperties.inputs) {
            lPort.new = false;
        }

        for (const lPort of this.functionProperties.outputs) {
            lPort.new = false;
        }

        for (const lImport of this.functionProperties.imports) {
            lImport.new = false;
        }
    }
}

type PotatnoFunctionPropertiesComponentProjectType = {
    name: string;
    definition: PotatnoProjectTypeDefinition<PotatnoProjectTypeMapping>;
};

export type PotatnoFunctionPropertiesComponentProperties = {
    label: string;
    inputs: Array<PotatnoFunctionPropertiesComponentPort>;
    outputs: Array<PotatnoFunctionPropertiesComponentPort>;
    imports: Array<PotatnoFunctionPropertiesComponentImport>;
    statics: {
        label: boolean;
        imports: boolean;
        inputs: boolean;
        outputs: boolean;
    };
};

export type PotatnoFunctionPropertiesComponentPort = {
    new: boolean;
    label: string;
    dataType: string;
    hasError: boolean;
};

export type PotatnoFunctionPropertiesComponentImport = {
    new: boolean;
    id: string;
    label: string;
};