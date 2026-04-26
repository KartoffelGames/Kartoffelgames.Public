import { PwbComponent, PwbExport, PwbChild, ComponentState, type IComponentOnUpdate } from '@kartoffelgames/web-potato-web-builder';
import templateCss from './potatno-preview.css' with { type: 'text' };
import previewTemplate from './potatno-preview.html' with { type: 'text' };

/**
 * Preview component for the potatno-code visual editor.
 * Displays a live preview of the generated code output or validation errors.
 */
@PwbComponent({
    selector: 'potatno-preview',
    template: previewTemplate,
    style: templateCss,
})
export class PotatnoPreview implements IComponentOnUpdate {
    /**
     * Reference to the content container element.
     */
    @PwbExport
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
     * Whether there are any validation errors to display.
     */
    public get hasErrors(): boolean {
        return this.errors.length > 0;
    }

    private mDragging: boolean = false;
    private mStartX: number = 0;
    private mStartY: number = 0;
    private mStartWidth: number = 0;
    private mStartHeight: number = 0;
    private mStoredElement: Element | null = null;

    /**
     * Set the element to display in the preview area.
     * Stored and re-appended after every component update via onUpdate().
     */
    @PwbExport
    public set previewContent(pElement: Element | null) {
        console.log('[Preview] previewContent setter called with:', pElement);
        this.mStoredElement = pElement;
        this.tryAppendStoredElement();
    }

    /**
     * After each template update cycle, re-append the stored preview element
     * in case the #PreviewContent div was recreated by a $if re-render.
     */
    public onUpdate(): void {
        this.tryAppendStoredElement();
    }

    /**
     * Append mStoredElement into #PreviewContent if it isn't already there.
     * Silently does nothing when #PreviewContent is not in the DOM (hasErrors is true).
     */
    private tryAppendStoredElement(): void {
        if (!this.mStoredElement) {
            return;
        }
        let lContainer: HTMLDivElement;
        try {
            lContainer = this.contentElement;
        } catch (pError) {
            console.error('[Preview] contentElement not accessible:', pError);
            return;
        }
        console.log('[Preview] tryAppendStoredElement - container:', lContainer, 'element:', this.mStoredElement, 'contains:', lContainer.contains(this.mStoredElement));
        if (!lContainer.contains(this.mStoredElement)) {
            while (lContainer.firstChild) {
                lContainer.removeChild(lContainer.firstChild);
            }
            lContainer.appendChild(this.mStoredElement);
            console.log('[Preview] element appended to container');
        }
    }

    /**
     * Get the content container element for external preview initialization.
     *
     * @returns The content container div element.
     */
    @PwbExport
    public getContainer(): HTMLDivElement {
        return this.contentElement;
    }

    /**
     * Set content of the preview window by replacing the current content with a DocumentFragment.
     *
     * @param pFragment - The document fragment to display.
     */
    @PwbExport
    public setContent(pFragment: DocumentFragment): void {
        const lContentEl: HTMLDivElement = this.contentElement;
        // Clear existing content.
        while (lContentEl.firstChild) {
            lContentEl.removeChild(lContentEl.firstChild);
        }
        lContentEl.appendChild(pFragment);
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
