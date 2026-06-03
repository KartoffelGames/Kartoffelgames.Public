import { ComponentEventEmitter, ComponentState, type IComponentOnUpdate, PwbChild, PwbComponent, PwbComponentEvent, PwbExport } from '@kartoffelgames/web-potato-web-builder';
import templateCss from './potatno-preview.css' with { type: 'text' };
import previewTemplate from './potatno-preview.html' with { type: 'text' };

/**
 * Lightweight descriptor handed to the preview panel for each driver it should host.
 *
 * The panel renders one tab per descriptor and swaps the visible element when the user
 * picks a tab. Both `id` and `label` are plain strings so the component stays decoupled
 * from the preview manager's generic-heavy `PotatnoUiPreviewDescriptor` shape; the editor
 * is responsible for mapping descriptors into this minimal contract.
 */
export type PotatnoPreviewTabDescriptor = {
    /**
     * Stable id matching the underlying display id. Used to preserve the selected tab
     * across rebuilds and to identify the active tab in click handlers.
     */
    readonly id: string;

    /**
     * Human-readable label shown on the tab button.
     */
    readonly label: string;

    /**
     * The DOM element produced by the display's `generate()`. Re-appended after every
     * template update so PWB's $if re-renders cannot orphan it.
     */
    readonly element: HTMLElement;
};

/**
 * Tabbed preview panel hosting one or more `PotatnoPreviewDriver` elements.
 *
 * The editor's preview manager hands the panel a list of tab descriptors; the panel renders
 * a tab strip and shows the active descriptor's element in the content area. Validation
 * errors take priority — when the editor supplies any, the error list replaces the preview
 * content entirely until errors clear.
 */
@PwbComponent({
    selector: 'potatno-preview',
    template: previewTemplate,
    style: templateCss,
})
export class PotatnoPreview implements IComponentOnUpdate {
    /**
     * Active preview tab id. State-tracked so a click re-renders the visible element.
     */
    @ComponentState.state()
    private accessor mActiveTabId: string | null = null;

    /**
     * Tab descriptors driving the tab strip and content area.
     */
    @ComponentState.state({ complexValue: true })
    private accessor mDescriptors: ReadonlyArray<PotatnoPreviewTabDescriptor> = [];

    /**
     * Reference to the content container element. The active descriptor's element is
     * appended here on every update cycle.
     */
    @PwbChild('PreviewContent')
    public accessor contentElement!: HTMLDivElement;

    /**
     * Reference to the preview container for resize operations.
     */
    @PwbChild('PreviewContainer')
    public accessor containerElement!: HTMLDivElement;

    /**
     * List of validation errors to display instead of the code preview.
     */
    @PwbExport
    @ComponentState.state()
    public accessor errors: Array<{ message: string; location: string }> = [];

    /**
     * Whether to show the display + output selectors (set by the editor for user functions; the
     * entry/main function always shows its full output, so it stays `false`).
     */
    @PwbExport
    @ComponentState.state()
    public accessor showSelectors: boolean = false;

    /**
     * Output port options for the output selector (id + label).
     */
    @PwbExport
    @ComponentState.state({ complexValue: true })
    public accessor outputOptions: ReadonlyArray<{ id: string; label: string }> = [];

    /**
     * Display ("style") id options for the display selector.
     */
    @PwbExport
    @ComponentState.state({ complexValue: true })
    public accessor displayOptions: ReadonlyArray<string> = [];

    /**
     * Currently selected output port id.
     */
    @PwbExport
    @ComponentState.state()
    public accessor selectedOutputId: string = '';

    /**
     * Currently selected display id.
     */
    @PwbExport
    @ComponentState.state()
    public accessor selectedDisplayId: string = '';

    /**
     * Emitted when the user picks a different output port to preview.
     */
    @PwbComponentEvent('output-change')
    private accessor mOutputChange!: ComponentEventEmitter<string>;

    /**
     * Emitted when the user picks a different display ("style").
     */
    @PwbComponentEvent('display-change')
    private accessor mDisplayChange!: ComponentEventEmitter<string>;

    /**
     * Whether the panel currently has no descriptors to render. Drives the empty-state
     * placeholder in the template.
     */
    public get hasDescriptors(): boolean {
        return this.mDescriptors.length > 0;
    }

    /**
     * Whether there are any validation errors to display.
     */
    public get hasErrors(): boolean {
        return this.errors.length > 0;
    }

    /**
     * Public descriptors view used by the template's tab strip.
     */
    public get tabs(): ReadonlyArray<PotatnoPreviewTabDescriptor> {
        return this.mDescriptors;
    }

    private mDragging: boolean;
    private mStartX: number;
    private mStartY: number;
    private mStartWidth: number;
    private mStartHeight: number;

    /**
     * Constructor.
     */
    public constructor() {
        this.mDragging = false;
        this.mStartX = 0;
        this.mStartY = 0;
        this.mStartWidth = 0;
        this.mStartHeight = 0;
    }

    /**
     * Update the tab descriptor list. Re-selects the active tab when the previous selection
     * disappears (descriptor list changed shape).
     *
     * @param pValue - The new list of descriptors. Empty array clears the panel.
     */
    @PwbExport
    public set descriptors(pValue: ReadonlyArray<PotatnoPreviewTabDescriptor>) {
        // Store the new descriptor list.
        this.mDescriptors = pValue;

        // Keep the active selection stable when the same id still exists; otherwise fall
        // back to the first descriptor (or null when there are none).
        const lActiveStillExists: boolean = this.mActiveTabId !== null && pValue.some((pDescriptor) => pDescriptor.id === this.mActiveTabId);
        if (!lActiveStillExists) {
            this.mActiveTabId = pValue[0]?.id ?? null;
        }

        // Re-attach the active element directly. When a descriptor's element changes without the
        // tab list changing shape (e.g. the document is replaced on load/undo, so the manager
        // builds a fresh driver and element while the tab keeps the same id and label), the
        // rendered template is unchanged and the component's onUpdate hook never fires — so it
        // cannot swap in the new element on its own. Attaching here covers that case and is a
        // cheap no-op (guarded) when the element is unchanged. onUpdate still covers structural
        // changes (initial mount, errors toggling) where the content container is (re)created only
        // after this setter has already run.
        this.attachActiveElement();
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
     * Re-append the active descriptor's element after every template update cycle.
     */
    public onUpdate(): void {
        this.attachActiveElement();
    }

    /**
     * Tab click handler — selects the clicked descriptor and forces re-attachment.
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
     * Relay an output-selector change to the editor.
     *
     * @param pEvent - Change event from the output `<select>`.
     */
    public onOutputSelect(pEvent: Event): void {
        this.mOutputChange.dispatchEvent((pEvent.target as HTMLSelectElement).value);
    }

    /**
     * Relay a display-selector ("style") change to the editor.
     *
     * @param pEvent - Change event from the display `<select>`.
     */
    public onDisplaySelect(pEvent: Event): void {
        this.mDisplayChange.dispatchEvent((pEvent.target as HTMLSelectElement).value);
    }

    /**
     * Append the currently active descriptor's element into `#PreviewContent`, replacing
     * any previous occupant. Silently does nothing when no descriptor is active or when the
     * content container is hidden because errors are shown instead.
     */
    private attachActiveElement(): void {
        // Bail when errors are showing — the template hides #PreviewContent in that branch.
        if (this.hasErrors) {
            return;
        }

        // Find the active descriptor.
        const lActive: PotatnoPreviewTabDescriptor | undefined = this.mDescriptors.find((pDescriptor) => pDescriptor.id === this.mActiveTabId);
        if (!lActive) {
            return;
        }

        let lContainer: HTMLDivElement;
        try {
            lContainer = this.contentElement;
        } catch {
            return;
        }

        // Replace the container's content with the active descriptor's element. The
        // comparison guards against detaching the same element only to immediately
        // re-append it on every update cycle.
        if (lContainer.firstChild === lActive.element && lContainer.childNodes.length === 1) {
            return;
        }

        while (lContainer.firstChild) {
            lContainer.removeChild(lContainer.firstChild);
        }
        lContainer.appendChild(lActive.element);
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

        // Capture the pointer for reliable tracking.
        (pEvent.target as HTMLElement).setPointerCapture(pEvent.pointerId);

        const lOnPointerMove = (pMoveEvent: PointerEvent): void => {
            if (!this.mDragging) {
                return;
            }

            // Resize from top-left corner: moving left/up increases size.
            const lDeltaX: number = this.mStartX - pMoveEvent.clientX;
            const lDeltaY: number = this.mStartY - pMoveEvent.clientY;

            const lNewWidth: number = Math.max(200, this.mStartWidth + lDeltaX);
            const lNewHeight: number = Math.max(150, this.mStartHeight + lDeltaY);

            lContainer.style.width = lNewWidth + 'px';
            lContainer.style.height = lNewHeight + 'px';
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
}
