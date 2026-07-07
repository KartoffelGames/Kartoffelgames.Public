import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Component, ComponentState, PwbComponent, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import type { PotatnoPreviewDriver } from '../../../preview/potatno-preview-driver.ts';
import { PotatnoPreviewFunctionExecutor } from '../../../preview/potatno-preview-function-executor.ts';
import type { PotatnoFunctionDefinition } from '../../../project/potatno-function-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import type { PotatnoProject } from '../../../project/potatno-project.ts';
import type { PotatnoCodeUiManagerIntegrityError } from '../../manager/manager_component/potatno-ui-manager-integrity.ts';
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager } from '../../manager/potatno-ui-manager.ts';
import { PotatnoPreviewModule } from '../../module/potatno-preview.module.ts';
import templateCss from './potatno-preview.css' with { type: 'text' };
import previewTemplate from './potatno-preview.html' with { type: 'text' };

/**
 * Preview panel hosting the active function's main preview driver.
 *
 * Reads its validation errors and the available display/output options from the shared
 * {@link PotatnoUiManager}, owns the local display/output selection and requests the matching driver
 * from the preview component. Validation errors take priority — while the manager reports any, the
 * error list replaces the preview content.
 */
@PwbComponent({
    selector: 'potatno-preview',
    template: previewTemplate,
    style: templateCss,
    modules: [PotatnoPreviewModule]
})
export class PotatnoPreview implements IComponentOnDeconstruct {
    private readonly mComponent: Component;
    private readonly mManager: PotatnoUiManager;
    private mUnsubscribe: (() => void);

    private mSelectedDisplayId: string;
    private mSelectedOutputId: string;

    /**
     * Preview window size.
     */
    @ComponentState.state({ proxy: true })
    public accessor windowSize: PotatnoPreviewSize;

    /**
     * Display ("style") id options for the display selector, from the project's preview registry.
     */
    public get displayOptions(): Array<PotatnoPreviewDisplayOption> {
        const lFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> | null = this.mManager.activeFunction;
        const lProject: PotatnoProject<PotatnoProjectTypesDefinition> | null = this.mManager.project;
        const lFunctionDefinition = lFunction && lProject ? lProject.getFunction(lFunction.definitionId) : undefined;
        if (!lFunction || !lProject || !lFunctionDefinition) {
            return new Array<PotatnoPreviewDisplayOption>();
        }

        return this.createDisplayOptions(lProject, this.availableDisplayIds(lProject, lFunctionDefinition, lFunction, this.selectedOutputId));
    }

    /**
     * Validation errors to display instead of the preview.
     */
    public get errors(): ReadonlyArray<PotatnoCodeUiManagerIntegrityError> {
        return this.mManager.integrity.errors;
    }

    /**
     * Whether there are any validation errors to display.
     */
    public get hasErrors(): boolean {
        return !this.mManager.integrity.isValid;
    }

    /**
     * Output options for the output selector (user functions only).
     */
    public get outputOptions(): ReadonlyArray<PotatnoPreviewOutputOption> {
        const lFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> | null = this.mManager.activeFunction;
        const lProject: PotatnoProject<PotatnoProjectTypesDefinition> | null = this.mManager.project;
        const lFunctionDefinition = lFunction && lProject ? lProject.getFunction(lFunction.definitionId) : undefined;
        if (!lFunction || !lProject || !lFunctionDefinition) {
            return [];
        }

        const lOptions: Array<PotatnoPreviewOutputOption> = new Array<PotatnoPreviewOutputOption>();
        if (lProject.preview.availableDisplays(lFunctionDefinition, PotatnoPreviewFunctionExecutor.MAIN).length > 0) {
            lOptions.push({ id: PotatnoPreviewFunctionExecutor.MAIN, label: 'Main' });
        }

        const lOutputIds: Set<string> = new Set<string>();
        for (const lExitNode of lFunction.getExitNodes()) {
            for (const lPort of lExitNode.inputs.value) {
                if (lOutputIds.has(lPort.definitionId)) {
                    continue;
                }

                if (lProject.preview.availableDisplays(lFunctionDefinition, lPort.resolvedDataType).length === 0) {
                    continue;
                }

                lOutputIds.add(lPort.definitionId);
                lOptions.push({ id: lPort.definitionId, label: lPort.label });
            }
        }

        return lOptions;
    }

    /**
     * The driver for the active function's main preview, bound by the template's `potatno-preview`
     * module. `null` when no function is active or no matching preview is registered.
     */
    public get previewDriver(): PotatnoPreviewDriver<PotatnoProjectTypesDefinition> | null {
        const lFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> | null = this.mManager.activeFunction;
        if (!lFunction) {
            return null;
        }

        if (this.selectedOutputId === PotatnoPreviewFunctionExecutor.MAIN) {
            return this.mManager.preview.requestDriver(lFunction, this.selectedDisplayId);
        }

        const lPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | null = this.findFunctionOutputPort(lFunction, this.selectedOutputId);
        if (!lPort) {
            return null;
        }

        return this.mManager.preview.requestDriver(lPort, this.selectedDisplayId);
    }

    /**
     * Currently selected display id, falling back to the first available.
     */
    public get selectedDisplayId(): string {
        const lOptions: Array<PotatnoPreviewDisplayOption> = this.displayOptions;
        if (this.mSelectedDisplayId !== '' && lOptions.some((pOption) => pOption.id === this.mSelectedDisplayId)) {
            return this.mSelectedDisplayId;
        }
        return lOptions.at(0)?.id ?? '';
    }

    /**
     * Currently selected output id, falling back to the first available.
     */
    public get selectedOutputId(): string {
        const lOptions: ReadonlyArray<PotatnoPreviewOutputOption> = this.outputOptions;
        if (this.mSelectedOutputId !== '' && lOptions.some((pOption) => pOption.id === this.mSelectedOutputId)) {
            return this.mSelectedOutputId;
        }
        return lOptions[0]?.id ?? '';
    }

    /**
     * Whether to show the output selector — only for user (non-entry) functions.
     */
    public get showOutputSelector(): boolean {
        const lFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> | null = this.mManager.activeFunction;
        const lProject: PotatnoProject<PotatnoProjectTypesDefinition> | null = this.mManager.project;
        if (!lFunction || !lProject) {
            return false;
        }

        return this.outputOptions.length > 0;
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

        // Define the default window size.
        this.windowSize = {
            width: 320,
            height: 240
        };

        this.mUnsubscribe = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.Document | PotatnoCodeUiManagerChangeType.Function | PotatnoCodeUiManagerChangeType.SpecialActiveFunction | PotatnoCodeUiManagerChangeType.Node | PotatnoCodeUiManagerChangeType.Connection, null, () => {
            this.mComponent.updater.updateAsync();
        });
    }


    /**
     * Detach the manager subscription.
     */
    public onDeconstruct(): void {
        this.mUnsubscribe();
    }

    /**
     * Relay a display-selector ("style") change to the panel state.
     *
     * @param pEvent - Change event from the display `<select>`.
     */
    public onDisplaySelect(pEvent: Event): void {
        this.mSelectedDisplayId = (pEvent.target as HTMLSelectElement).value;
        this.mComponent.updater.updateAsync();
    }

    /**
     * Relay an output-selector change to the panel state.
     *
     * @param pEvent - Change event from the output `<select>`.
     */
    public onOutputSelect(pEvent: Event): void {
        this.mSelectedOutputId = (pEvent.target as HTMLSelectElement).value;
        this.mComponent.updater.updateAsync();
    }

    /**
     * Handle pointer down on the resize handle to begin resizing.
     *
     * @param pEvent - Pointer event from the resize handle.
     */
    public onResizePointerDown(pEvent: PointerEvent): void {
        pEvent.preventDefault();
        pEvent.stopPropagation();

        // Save current size so the current pointer position determinates exactly this size.
        const lStartingWidth: number = this.windowSize.width;
        const lStartingHeight: number = this.windowSize.height;
        const lStartX = pEvent.clientX;
        const lStartY = pEvent.clientY;

        // Resize magic listener (●'◡'●)つ━☆・*。
        const lPointerMoveListener = (pMoveEvent: PointerEvent): void => {
            // Resize from top-left corner: moving left/up increases size.
            const lMovementChangeX: number = lStartX - pMoveEvent.clientX;
            const lMovementChangeY: number = lStartY - pMoveEvent.clientY;

            // Change window size but clamp it doen to a minimum size.
            this.windowSize.width = Math.max(200, lStartingWidth + lMovementChangeX);
            this.windowSize.height = Math.max(150, lStartingHeight + lMovementChangeY);
        };

        // Pointer up listener, cleaning up temporary listener.
        const lPointerUpListener = (): void => {
            // Remove temporary mouse move listener.
            document.removeEventListener('pointermove', lPointerMoveListener);
            document.removeEventListener('pointerup', lPointerUpListener);
        };

        // Add temporary mouse move listener.
        document.addEventListener('pointermove', lPointerMoveListener);
        document.addEventListener('pointerup', lPointerUpListener);
    }

    /**
     * Get display ids that can render the selected output.
     *
     * @param pProject - Project owning the preview registry.
     * @param pFunctionDefinition - Active function definition.
     * @param pFunction - Active document function.
     * @param pOutputId - Selected output id.
     */
    private availableDisplayIds(pProject: PotatnoProject<PotatnoProjectTypesDefinition>, pFunctionDefinition: PotatnoFunctionDefinition<PotatnoProjectTypesDefinition>, pFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition>, pOutputId: string): Array<string> {
        if (pOutputId === PotatnoPreviewFunctionExecutor.MAIN) {
            return pProject.preview.availableDisplays(pFunctionDefinition, PotatnoPreviewFunctionExecutor.MAIN);
        }

        const lPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | null = this.findFunctionOutputPort(pFunction, pOutputId);
        if (lPort) {
            return pProject.preview.availableDisplays(pFunctionDefinition, lPort.resolvedDataType);
        }

        return pProject.preview.availableDisplays(pFunctionDefinition);
    }

    /**
     * Convert registry ids to selector options using display names.
     *
     * @param pProject - Project owning the preview registry.
     * @param pDisplayIds - Display ids to convert.
     */
    private createDisplayOptions(pProject: PotatnoProject<PotatnoProjectTypesDefinition>, pDisplayIds: Array<string>): Array<PotatnoPreviewDisplayOption> {
        return pDisplayIds.map((pDisplayId) => {
            return {
                id: pDisplayId,
                label: pProject.preview.getDisplay(pDisplayId)?.name ?? pDisplayId
            };
        });
    }

    /**
     * Find the exit-node value input matching a selectable output id.
     *
     * @param pFunction - Function whose exit nodes should be searched.
     * @param pOutputId - Selected output id.
     */
    private findFunctionOutputPort(pFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition>, pOutputId: string): PotatnoDocumentPort<PotatnoProjectTypesDefinition> | null {
        for (const lExitNode of pFunction.getExitNodes()) {
            const lPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | undefined = lExitNode.inputs.map.get(pOutputId);
            if (lPort && lPort.portType === 'value') {
                return lPort;
            }
        }

        return null;
    }
}

/**
 * Size of window.
 */
type PotatnoPreviewSize = {
    width: number;
    height: number;
};

/**
 * One selectable output for a user function's main preview.
 */
type PotatnoPreviewOutputOption = {
    readonly id: string;
    readonly label: string;
};

/**
 * One selectable display for a preview output.
 */
type PotatnoPreviewDisplayOption = {
    readonly id: string;
    readonly label: string;
};
