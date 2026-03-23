import { PwbComponent, Processor, PwbExport, PwbComponentEvent, ComponentEventEmitter } from '@kartoffelgames/web-potato-web-builder';
import templateCss from './potatno-resize-handle.css';
import resizeTemplate from './potatno-resize-handle.html';

/**
 * Resize handle component for the potatno-code visual editor.
 * Provides a draggable handle that emits delta values for resizing panels.
 */
@PwbComponent({
    selector: 'potatno-resize-handle',
    template: resizeTemplate,
    style: templateCss,
})
export class PotatnoResizeHandle extends Processor {
    /**
     * Orientation of the resize handle.
     * "vertical" renders a thin vertical bar (for horizontal resizing).
     * "horizontal" renders a thin horizontal bar (for vertical resizing).
     */
    @PwbExport
    public direction: 'vertical' | 'horizontal' = 'vertical';

    @PwbComponentEvent('resize')
    private accessor mResize!: ComponentEventEmitter<{ delta: number }>;

    private mDragging: boolean = false;
    private mStartPosition: number = 0;

    /**
     * Get the CSS class string for the handle element based on direction.
     *
     * @returns CSS class string.
     */
    public getHandleClass(): string {
        return `resize-handle ${this.direction}`;
    }

    /**
     * Handle pointer down to begin drag tracking.
     *
     * @param pEvent - Pointer event from the handle.
     */
    public onPointerDown(pEvent: PointerEvent): void {
        pEvent.preventDefault();
        this.mDragging = true;
        this.mStartPosition = this.direction === 'vertical' ? pEvent.clientX : pEvent.clientY;

        // Capture the pointer for reliable tracking outside the element.
        (pEvent.target as HTMLElement).setPointerCapture(pEvent.pointerId);

        const lOnPointerMove = (pMoveEvent: PointerEvent): void => {
            if (!this.mDragging) {
                return;
            }

            const lCurrentPosition: number = this.direction === 'vertical' ? pMoveEvent.clientX : pMoveEvent.clientY;
            const lDelta: number = lCurrentPosition - this.mStartPosition;
            this.mStartPosition = lCurrentPosition;

            this.mResize.dispatchEvent({ delta: lDelta });
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
