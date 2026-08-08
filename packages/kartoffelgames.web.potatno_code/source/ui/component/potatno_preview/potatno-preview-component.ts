import { Injection } from '@kartoffelgames/core-dependency-injection';
import { ResizeBoxComponent } from '@kartoffelgames/web-components';
import { Component, ComponentState, PwbComponent, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import { PotatnoCodeGenerator } from '../../../parser/potatno-code-generator.ts';
import type { PotatnoPreviewDriver } from '../../../preview/potatno-preview-driver.ts';
import { PotatnoPreviewFunctionExecutor } from '../../../preview/potatno-preview-function-executor.ts';
import type { PotatnoFunctionDefinition } from '../../../project/potatno-function-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import type { PotatnoCodeUiManagerIntegrityError } from '../../manager/manager_component/potatno-ui-manager-integrity.ts';
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager, type PotatnoCodeUiManagerUnsubscribe } from '../../manager/potatno-ui-manager.ts';
import { PotatnoPreviewModule } from '../../module/potatno-preview.module.ts';
import styles from './potatno-preview-component.css' with { type: 'text' };
import template from './potatno-preview-component.html' with { type: 'text' };
import type { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';

/**
 * Preview main panel for the active function preview.
 */
@PwbComponent({
    selector: 'potatno-preview',
    template: template,
    style: styles,
    modules: [PotatnoPreviewModule],
    components: [ResizeBoxComponent]
})
export class PotatnoPreviewComponent implements IComponentOnDeconstruct {
    private readonly mComponent: Component;
    private readonly mManager: PotatnoUiManager;
    private mPreviewTargets: Map<string, PotatnoPreviewComponentTarget>;
    private readonly mUnsubscribeErrorResolve: PotatnoCodeUiManagerUnsubscribe;
    private readonly mUnsubscribeOutputFetch: PotatnoCodeUiManagerUnsubscribe;

    @ComponentState.state()
    private accessor mSelectedDisplayId: string;

    @ComponentState.state()
    private accessor mSelectedOutputId: string;

    /**
     * Selected tab. Ignored on errors.
     */
    @ComponentState.state()
    public accessor selectedTab: PotatnoPreviewComponentTab;

    /**
     * Generated preview code.
     */
    @ComponentState.state()
    public accessor previewCode: string;

    /**
     * Preview display id options for the display selector.
     */
    public get displayOptions(): ReadonlyMap<string, string> {
        // Read function definition of target function.
        const lPreviewPort: PotatnoPreviewComponentTarget | undefined = this.mPreviewTargets.get(this.selectedOutputId);
        if (!lPreviewPort) {
            return new Map<string, string>();
        }

        // Map display ids with its label.
        return lPreviewPort.displays;
    }

    /**
     * Validation errors to display instead of the preview.
     */
    public get errors(): ReadonlyArray<PotatnoCodeUiManagerIntegrityError> {
        return this.mManager.integrity.errors;
    }

    /**
     * Output options for the output selector (user functions only).
     */
    public get outputOptions(): ReadonlyMap<string, PotatnoPreviewComponentTarget> {
        return this.mPreviewTargets;
    }

    /**
     * The driver for the active function's main preview.
     */
    public get previewDriver(): PotatnoPreviewDriver<PotatnoProjectTypesDefinition> | null {
        // Read the available preview port by output id. Skip if the output has no preview.
        const lPreviewTarget: PotatnoPreviewComponentTarget | undefined = this.mPreviewTargets.get(this.selectedOutputId);
        if (!lPreviewTarget) {
            return null;
        }

        // Get driver of target.
        return this.mManager.preview.requestDriver(lPreviewTarget.target, this.selectedDisplayId);
    }

    /**
     * Currently selected display id, falling back to the first available.
     */
    public get selectedDisplayId(): string {
        const lOptions: ReadonlyMap<string, string> = this.displayOptions;

        // Check current selected if its a valid selection and reset it when its not.
        if (!lOptions.has(this.mSelectedDisplayId)) {
            // Try to get first value.
            const lFirstValue: string | undefined = lOptions.keys().next().value;
            if (typeof lFirstValue !== 'undefined') {
                this.mSelectedDisplayId = lFirstValue;
            }
        }

        return this.mSelectedDisplayId;
    } set selectedDisplayId(pValue: string) {
        this.mSelectedDisplayId = pValue;
    }

    /**
     * Currently selected output id, falling back to the first available.
     */
    public get selectedOutputId(): string {
        const lOptions: ReadonlyMap<string, PotatnoPreviewComponentTarget> = this.outputOptions;

        // Check current selected if its a valid selection and reset it when its not.
        if (!lOptions.has(this.mSelectedOutputId)) {
            // Try to get first value.
            const lFirstValue: string | undefined = lOptions.keys().next().value;
            if (typeof lFirstValue !== 'undefined') {
                this.mSelectedOutputId = lFirstValue;
            }
        }

        return this.mSelectedOutputId;
    } set selectedOutputId(pValue: string) {
        this.mSelectedOutputId = pValue;
    }

    /**
     * Create the preview panel.
     *
     * @param pComponent - Injected component reference, used to trigger self-updates.
     * @param pManager - Injected shared UI manager singleton.
     */
    public constructor(pComponent: Component = Injection.use(Component), pManager: PotatnoUiManager = Injection.use(PotatnoUiManager)) {
        this.mComponent = pComponent;
        this.mManager = pManager;

        this.mSelectedDisplayId = '';
        this.mSelectedOutputId = '';
        this.selectedTab = 'preview';
        this.previewCode = '';

        const lNodeChangeTypes: number = PotatnoCodeUiManagerChangeType.NodeUpdate | PotatnoCodeUiManagerChangeType.NodeAdd | PotatnoCodeUiManagerChangeType.NodeDelete;

        // Update the preview port ONCE when the output ports can change.
        this.mPreviewTargets = this.findFunctionPreviewTargets();
        this.mUnsubscribeOutputFetch = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.SpecialActiveFunction | lNodeChangeTypes, () => {
            this.mPreviewTargets = this.findFunctionPreviewTargets();
        });

        // Listen for document, function, node and connection changes. Mainly for resolving the error lists.
        this.mUnsubscribeErrorResolve = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.SpecialActiveFunction | lNodeChangeTypes | PotatnoCodeUiManagerChangeType.Connection, () => {
            this.mComponent.updater.updateAsync();
        });

        // Register "all"-Listener to update generated code for the current function.
        let lDebounce: number = 0;
        this.mManager.subscribe(PotatnoCodeUiManagerChangeType.Any, () => {
            // Debounce: Clear and set a new timeout before pushing new history.
            globalThis.clearTimeout(lDebounce);
            lDebounce = globalThis.setTimeout(() => {
                this.previewCode = this.generateFunctionCode();
            }, 1000) as unknown as number;
        });
    }

    /**
     * Detach the manager subscription.
     */
    public onDeconstruct(): void {
        this.mUnsubscribeErrorResolve();
        this.mUnsubscribeOutputFetch();
    }

    /**
     * Open function and select node.
     * 
     * @param pNode - Node to select.
     */
    public openNode(pNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition>): void {
        this.mManager.grid.selectNodes([pNode], true);
    }

    /**
     * Searches for all available preview targets of current active function.
     * Skips any available target that has no preview displays.
     * 
     * @returns all available preview targets of current active function.
     */
    private findFunctionPreviewTargets(): Map<string, PotatnoPreviewComponentTarget> {
        const lOutputPorts: Map<string, PotatnoPreviewComponentTarget> = new Map<string, PotatnoPreviewComponentTarget>();

        // Get the current active functions definition.
        const lActiveFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> = this.mManager.activeFunction;
        const lActiveFunctionDefinition: PotatnoFunctionDefinition<PotatnoProjectTypesDefinition> | undefined = lActiveFunction.project.getFunction(lActiveFunction.definitionId);
        if (!lActiveFunctionDefinition) {
            return lOutputPorts;
        }

        // Map displays id to id and label. 
        const lMapDisplays = (pDisplayIds: Array<string>): Map<string, string> => {
            const lDisplayMap: Map<string, string> = new Map<string, string>();
            for (const lDisplayId of pDisplayIds) {
                lDisplayMap.set(lDisplayId, lActiveFunction.project.preview.getDisplay(lDisplayId)!.name);
            }
            return lDisplayMap;
        };

        // First we check if the MAIN output has available displays.
        const lAvailableMainDisplays: Array<string> = lActiveFunction.project.preview.availableDisplays(lActiveFunctionDefinition, PotatnoPreviewFunctionExecutor.MAIN);
        if (lAvailableMainDisplays.length > 0) {
            lOutputPorts.set(PotatnoPreviewFunctionExecutor.MAIN, {
                label: PotatnoPreviewFunctionExecutor.MAIN,
                target: lActiveFunction,
                displays: lMapDisplays(lAvailableMainDisplays)
            });
        }

        // Create a buffer for the available display lookup. Because that lookup is expensive.
        const lTypeToDisplaysLookup: Map<string, Array<string>> = new Map<string, Array<string>>();

        // Get exit nodes of the function. Can be multiple.
        for (const lExitNode of lActiveFunction.getExitNodes()) {
            // From there, iterate all value ports.
            for (const lPort of lExitNode.inputs.value) {
                // Read the port type.
                const lPortType: string = lPort.resolvedDataType;

                // Create type to display lookup when not there.
                if (!lTypeToDisplaysLookup.has(lPortType)) {
                    lTypeToDisplaysLookup.set(lPortType, lPort.project.preview.availableDisplays(lActiveFunctionDefinition, lPortType));
                }

                // Get types display ids.
                const lDisplayIds: Array<string> = lTypeToDisplaysLookup.get(lPortType)!;
                if (lDisplayIds.length === 0) {
                    continue;
                }

                // When the port type as available displays, its a valid preview port.
                lOutputPorts.set(lPort.definitionId, {
                    label: lPort.label,
                    target: lPort,
                    displays: lMapDisplays(lDisplayIds)
                });
            }
        }

        return lOutputPorts;
    }

    /**
     * Generate function code for the current active function without debug information.
     * 
     * @returns the generated function code.
     */
    private generateFunctionCode(): string {
        // Only refresh when the build has the probability to succeed.
        if (!this.mManager.integrity.isValid) {
            return '';
        }

        // Get the current active functions definition.
        const lActiveFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> = this.mManager.activeFunction;
        return new PotatnoCodeGenerator(lActiveFunction.project).generateFunction(lActiveFunction, false).code;
    }
}

type PotatnoPreviewComponentTarget = {
    /**
     * Label for preview target.
     */
    label: string;

    /**
     * Port reference, when null is means the MAIN output.
     */
    target: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | PotatnoDocumentFunction<PotatnoProjectTypesDefinition>;

    /**
     * Preview display options mapped by display id:  Map<id, label>.
     */
    displays: Map<string, string>;
};

type PotatnoPreviewComponentTab = 'preview' | 'code';