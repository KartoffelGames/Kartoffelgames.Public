import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Component, ComponentState, PwbChild, PwbComponent, type IComponentOnConnect, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoPreviewDriverHandle } from '../../../preview/potatno-preview-driver.ts';
import type { PotatnoCodeUiManagerIntegrityError } from '../../manager/manager_component/potatno-ui-manager-integrity.ts';
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager } from '../../manager/potatno-ui-manager.ts';
import { PotatnoPreviewModule } from "../../module/potatno-preview.module.ts";
import type { PotatnoUiPreviewOutputOption } from '../../potatno-ui-preview-manager.ts';
import templateCss from './potatno-preview.css' with { type: 'text' };
import previewTemplate from './potatno-preview.html' with { type: 'text' };

/**
 * Lightweight descriptor handed to the preview panel for each driver it should host.
 *
 * The panel renders one tab per descriptor and swaps the visible element when the user picks a tab.
 * Both `id` and `label` are plain strings so the component stays decoupled from the preview
 * manager's generic-heavy descriptor shape.
 */
export type PotatnoPreviewTabDescriptor = {
    /**
     * Stable id matching the underlying display id. Used to preserve the selected tab across
     * rebuilds and to identify the active tab in click handlers.
     */
    readonly id: string;

    /**
     * Human-readable label shown on the tab button.
     */
    readonly label: string;

    /**
     * The preview driver backing this tab. The {@link PotatnoPreviewModule} binds to it and mounts
     * its element into the content area, re-appending after every template update so PWB's $if
     * re-renders cannot orphan it.
     */
    readonly driver: PotatnoPreviewDriverHandle;
};

/**
 * Tabbed preview panel hosting one or more `PotatnoPreviewDriver` elements.
 *
 * Reads its tab descriptors, validation errors and selector state from the shared
 * {@link PotatnoUiManager} and relays selector changes back through it. Validation errors take
 * priority — while the manager reports any, the error list replaces the preview content. Only the
 * active tab id is local state.
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
    private mUnsubscribe: (() => void) | null;

    /**
     * Active preview tab id. State-tracked so a click re-renders the visible element.
     */
    @ComponentState.state()
    private accessor mActiveTabId: string | null = null;

    /**
     * Reference to the preview container for resize operations.
     */
    @PwbChild('PreviewContainer')
    public accessor containerElement!: HTMLDivElement;

    /**
     * Driver backing the active tab, bound by the template's `potatno-preview` module to mount the
     * preview element. `null` when no tab is active so the module clears the content area.
     */
    public get activeTabDriver(): PotatnoPreviewDriverHandle | null {
        return this.tabs.find((pDescriptor) => pDescriptor.id === this.mActiveTabId)?.driver ?? null;
    }

    /**
     * Display ("style") id options for the display selector.
     */
    public get displayOptions(): ReadonlyArray<string> {
        return this.mManager.previewManager?.getActivePreviewDisplays() ?? [];
    }

    /**
     * Validation errors to display instead of the preview.
     */
    public get errors(): ReadonlyArray<PotatnoCodeUiManagerIntegrityError> {
        return this.mManager.integrity.errors;
    }

    /**
     * Whether the panel currently has any descriptors to render.
     */
    public get hasDescriptors(): boolean {
        return this.mManager.previewTabs.length > 0;
    }

    /**
     * Whether there are any validation errors to display.
     */
    public get hasErrors(): boolean {
        return !this.mManager.integrity.isValid;
    }

    /**
     * Output port options for the output selector.
     */
    public get outputOptions(): ReadonlyArray<PotatnoUiPreviewOutputOption> {
        return this.mManager.previewManager?.getActivePreviewOutputs() ?? [];
    }

    /**
     * Currently selected display id.
     */
    public get selectedDisplayId(): string {
        return this.mManager.previewManager?.activePreviewDisplayId ?? '';
    }

    /**
     * Currently selected output port id.
     */
    public get selectedOutputId(): string {
        return this.mManager.previewManager?.activePreviewOutputId ?? '';
    }

    /**
     * Whether to show the display + output selectors (user functions only).
     */
    public get showSelectors(): boolean {
        return this.mManager.previewManager?.activePreviewIsUserFunction ?? false;
    }

    /**
     * Tab descriptors driving the tab strip and content area.
     */
    public get tabs(): ReadonlyArray<PotatnoPreviewTabDescriptor> {
        return this.mManager.previewTabs;
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
        this.mUnsubscribe = null;
    }

    /**
     * Subscribe to manager events affecting the preview content and validation list.
     */
    public onConnect(): void {
        this.mUnsubscribe = this.mManager.subscribe(
            PotatnoCodeUiManagerChangeType.Document | PotatnoCodeUiManagerChangeType.Function | PotatnoCodeUiManagerChangeType.ActiveFunction | PotatnoCodeUiManagerChangeType.Node | PotatnoCodeUiManagerChangeType.Connection | PotatnoCodeUiManagerChangeType.Preview,
            null,
            () => {
                this.reconcileActiveTab();
                this.mComponent.updater.update();
            });

        // Pick an initial active tab when the panel mounts with descriptors already built.
        this.reconcileActiveTab();
    }

    /**
     * Detach the manager subscription.
     */
    public onDeconstruct(): void {
        this.mUnsubscribe?.();
        this.mUnsubscribe = null;
    }

    /**
     * Relay a display-selector ("style") change to the manager.
     *
     * @param pEvent - Change event from the display `<select>`.
     */
    public onDisplaySelect(pEvent: Event): void {
        this.mManager.setPreviewDisplay((pEvent.target as HTMLSelectElement).value);
    }

    /**
     * Relay an output-selector change to the manager.
     *
     * @param pEvent - Change event from the output `<select>`.
     */
    public onOutputSelect(pEvent: Event): void {
        this.mManager.setPreviewOutput((pEvent.target as HTMLSelectElement).value);
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
     * Tab click handler — selects the clicked descriptor.
     *
     * @param pTabId - Id of the tab the user clicked.
     */
    public onTabSelect(pTabId: string): void {
        if (this.mActiveTabId === pTabId) {
            return;
        }

        this.mActiveTabId = pTabId;
    }

    /**
     * Resolve the CSS class for a tab button (selected/unselected).
     *
     * @param pTab - The descriptor whose class to resolve.
     *
     * @returns A space-separated class list ready for the template.
     */
    public tabClass(pTab: PotatnoPreviewTabDescriptor): string {
        return pTab.id === this.mActiveTabId ? 'preview-tab selected' : 'preview-tab';
    }

    /**
     * Keep the active tab selection valid as the descriptor list changes shape, falling back to
     * the first descriptor (or none) when the previous selection disappears.
     */
    private reconcileActiveTab(): void {
        const lTabs: ReadonlyArray<PotatnoPreviewTabDescriptor> = this.tabs;
        const lActiveStillExists: boolean = this.mActiveTabId !== null && lTabs.some((pDescriptor) => pDescriptor.id === this.mActiveTabId);
        if (!lActiveStillExists) {
            this.mActiveTabId = lTabs[0]?.id ?? null;
        }
    }
}
