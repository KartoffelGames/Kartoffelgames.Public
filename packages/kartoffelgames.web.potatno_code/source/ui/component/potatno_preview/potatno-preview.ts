import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Component, ComponentState, PwbChild, PwbComponent, type IComponentOnConnect, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import { PotatnoPreviewDriver } from '../../../preview/potatno-preview-driver.ts';
import { PotatnoPreviewFunctionExecutor } from '../../../preview/potatno-preview-function-executor.ts';
import type { PotatnoCodeUiManagerIntegrityError } from '../../manager/manager_component/potatno-ui-manager-integrity.ts';
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager } from '../../manager/potatno-ui-manager.ts';
import { PotatnoPreviewModule } from '../../module/potatno-preview.module.ts';
import templateCss from './potatno-preview.css' with { type: 'text' };
import previewTemplate from './potatno-preview.html' with { type: 'text' };
import { PotatnoProjectTypesDefinition } from "../../../project/potatno-project-types-definition.ts";
import { PotatnoProject } from "../../../project/potatno-project.ts";

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
export class PotatnoPreview implements IComponentOnConnect, IComponentOnDeconstruct {
    private readonly mComponent: Component;
    private mDragging: boolean;
    private readonly mManager: PotatnoUiManager;
    private mStartHeight: number;
    private mStartWidth: number;
    private mStartX: number;
    private mStartY: number;
    private mTrackedFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> | null;
    private mUnsubscribe: (() => void) | null;

    /**
     * Display id chosen in the display selector. Empty falls back to the first available display.
     */
    @ComponentState.state()
    private accessor mSelectedDisplayId: string = '';

    /**
     * Output label chosen in the output selector. Empty falls back to the first available output.
     */
    @ComponentState.state()
    private accessor mSelectedOutputId: string = '';

    /**
     * Reference to the preview container for resize operations.
     */
    @PwbChild('PreviewContainer')
    public accessor containerElement!: HTMLDivElement;

    /**
     * Display ("style") id options for the display selector, from the project's preview registry.
     */
    public get displayOptions(): Array<string> {
        const lFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> | null = this.mManager.activeFunction;
        const lProject: PotatnoProject<PotatnoProjectTypesDefinition> | null = this.mManager.project;
        const lFunctionDefinition = lFunction && lProject ? lProject.getFunction(lFunction.definitionId) : undefined;
        if (!lFunction || !lProject || !lFunctionDefinition) {
            return new Array<string>();
        }

        if (this.selectedOutputId === PotatnoPreviewFunctionExecutor.MAIN) {
            return lProject.preview.availableDisplays(lFunctionDefinition, PotatnoPreviewFunctionExecutor.MAIN);
        }

        const lPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | null = this.findFunctionOutputPort(lFunction, this.selectedOutputId);
        if (lPort) {
            return lProject.preview.availableDisplays(lFunctionDefinition, lPort.resolvedDataType);
        }

        return lProject.preview.availableDisplays(lFunctionDefinition);
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

        return this.mManager.preview.functionDriver(lFunction, this.selectedDisplayId, this.selectedOutputId);
    }

    /**
     * Currently selected display id, falling back to the first available.
     */
    public get selectedDisplayId(): string {
        const lOptions: Array<string> = this.displayOptions;
        if (this.mSelectedDisplayId !== '' && lOptions.includes(this.mSelectedDisplayId)) {
            return this.mSelectedDisplayId;
        }
        return lOptions.at(0) ?? '';
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

        return this.outputOptions.length > 1;
    }

    /**
     * Create the preview panel.
     *
     * @param pComponent - Injected component reference, used to trigger self-updates.
     * @param pManager - Injected shared UI manager singleton.
     */
    public constructor(pComponent: Component = Injection.use(Component), pManager: PotatnoUiManager = Injection.use(PotatnoUiManager)) {
        this.mComponent = pComponent;
        this.mDragging = false;
        this.mManager = pManager;
        this.mStartHeight = 0;
        this.mStartWidth = 0;
        this.mStartX = 0;
        this.mStartY = 0;
        this.mTrackedFunction = null;
        this.mUnsubscribe = null;
    }

    /**
     * Subscribe to manager events affecting the preview content and validation list.
     */
    public onConnect(): void {
        this.mUnsubscribe = this.mManager.subscribe(
            PotatnoCodeUiManagerChangeType.Document | PotatnoCodeUiManagerChangeType.Function | PotatnoCodeUiManagerChangeType.ActiveFunction | PotatnoCodeUiManagerChangeType.Node | PotatnoCodeUiManagerChangeType.Connection,
            null,
            () => {
                this.releaseSupersededDriver();
                this.mComponent.updater.update();
            });

        this.releaseSupersededDriver();
    }

    /**
     * Detach the manager subscription.
     */
    public onDeconstruct(): void {
        this.mUnsubscribe?.();
        this.mUnsubscribe = null;
    }

    /**
     * Relay a display-selector ("style") change to the panel state.
     *
     * @param pEvent - Change event from the display `<select>`.
     */
    public onDisplaySelect(pEvent: Event): void {
        this.mSelectedDisplayId = (pEvent.target as HTMLSelectElement).value;
    }

    /**
     * Relay an output-selector change to the panel state.
     *
     * @param pEvent - Change event from the output `<select>`.
     */
    public onOutputSelect(pEvent: Event): void {
        this.mSelectedOutputId = (pEvent.target as HTMLSelectElement).value;
    }

    /**
     * Handle pointer down on the resize handle to begin resizing.
     *
     * @param pEvent - Pointer event from the resize handle.
     */
    public onResizePointerDown(pEvent: PointerEvent): void {
        pEvent.preventDefault();
        pEvent.stopPropagation();

        this.mDragging = true;
        this.mStartX = pEvent.clientX;
        this.mStartY = pEvent.clientY;

        const lContainer: HTMLElement = this.containerElement;
        if (!lContainer) {
            return;
        }

        this.mStartWidth = lContainer.offsetWidth;
        this.mStartHeight = lContainer.offsetHeight;

        (pEvent.target as HTMLElement).setPointerCapture(pEvent.pointerId);

        const lOnPointerMove = (pMoveEvent: PointerEvent): void => {
            if (!this.mDragging) {
                return;
            }

            // Resize from top-left corner: moving left/up increases size.
            const lDeltaX: number = this.mStartX - pMoveEvent.clientX;
            const lDeltaY: number = this.mStartY - pMoveEvent.clientY;

            lContainer.style.width = Math.max(200, this.mStartWidth + lDeltaX) + 'px';
            lContainer.style.height = Math.max(150, this.mStartHeight + lDeltaY) + 'px';
        };

        const lOnPointerUp = (pUpEvent: PointerEvent): void => {
            this.mDragging = false;
            (pUpEvent.target as HTMLElement).releasePointerCapture(pUpEvent.pointerId);
            document.removeEventListener('pointermove', lOnPointerMove);
            document.removeEventListener('pointerup', lOnPointerUp);
        };

        document.addEventListener('pointermove', lOnPointerMove);
        document.addEventListener('pointerup', lOnPointerUp);
    }

    /**
     * When the active function changed, drop the previous function's driver (only one main preview
     * is active at a time) and reset the local selection so the new function picks its defaults.
     */
    private releaseSupersededDriver(): void {
        const lFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> | null = this.mManager.activeFunction;
        if (lFunction === this.mTrackedFunction) {
            return;
        }

        if (this.mTrackedFunction) {
            this.mManager.preview.release(this.mTrackedFunction);
        }

        this.mTrackedFunction = lFunction;
        this.mSelectedDisplayId = '';
        this.mSelectedOutputId = '';
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
 * One selectable output for a user function's main preview.
 */
type PotatnoPreviewOutputOption = {
    readonly id: string;
    readonly label: string;
};
