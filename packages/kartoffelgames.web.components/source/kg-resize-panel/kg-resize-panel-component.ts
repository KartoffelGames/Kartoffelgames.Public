import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Component, type ComponentEventEmitter, ComponentState, PwbComponent, PwbComponentEvent, PwbExport } from '@kartoffelgames/web-potato-web-builder';
import styles from './kg-resize-panel-component.css' with { type: 'text' };
import template from './kg-resize-panel-component.html' with { type: 'text' };

/**
 * User resizeable panel.
 *
 * Configurable attributes:
 *  - "top", "right", "bottom" and "left" attributes by setting them "true"
 *  - "width" and "height" to manually set the size.
 *
 * Events:
 *  - "resize"
 *  - "resize-end"
 *
 * CSS variables:
 *  - "--resize-panel-handle-size"
 *  - "--resize-panel-handle-color"
 *  - "--resize-panel-handle-hover-color"
 */
@PwbComponent({
    selector: 'kg-resize-panel',
    template: template,
    style: styles
})
export class KgResizePanelComponent {
    private readonly mComponentElement: HTMLElement;

    /**
     * Enabled directions. Used only in template references.
     */
    @ComponentState.state({ proxy: true })
    private accessor mConfiguration: KgResizePanelComponentConfiguration;

    /**
     * Emitted when the user resizes with a handle.
     */
    @PwbComponentEvent('resize')
    private accessor mResize!: ComponentEventEmitter<KgResizePanelComponentResize>;

    /**
     * Emitted when the user ends a resize.
     */
    @PwbComponentEvent('resize-end')
    private accessor mResizeEnd!: ComponentEventEmitter<KgResizePanelComponentResize>;

    /**
     * If bottom resize handle is enabled.
     */
    @PwbExport()
    public get bottom(): boolean {
        return this.mConfiguration.enabledDirections.bottom;
    } set bottom(pEnabled: unknown) {
        this.mConfiguration.enabledDirections.bottom = this.parseBoolean(pEnabled);
    }

    /**
     * Current height of resize panel.
     */
    @PwbExport()
    public get height(): number {
        return this.mComponentElement.clientHeight;
    } set height(pHeight: number) {
        this.updateComponentHeight(pHeight);
    }

    /**
     * If left resize handle is enabled.
     */
    @PwbExport()
    public get left(): boolean {
        return this.mConfiguration.enabledDirections.left;
    } set left(pEnabled: unknown) {
        this.mConfiguration.enabledDirections.left = this.parseBoolean(pEnabled);
    }

    /**
     * If right resize handle is enabled.
     */
    @PwbExport()
    public get right(): boolean {
        return this.mConfiguration.enabledDirections.right;
    } set right(pEnabled: unknown) {
        this.mConfiguration.enabledDirections.right = this.parseBoolean(pEnabled);
    }

    /**
     * If top resize handle is enabled.
     */
    @PwbExport()
    public get top(): boolean {
        return this.mConfiguration.enabledDirections.top;
    } set top(pEnabled: unknown) {
        this.mConfiguration.enabledDirections.top = this.parseBoolean(pEnabled);
    }

    /**
     * Current width of resize panel.
     */
    @PwbExport()
    public get width(): number {
        return this.mComponentElement.clientWidth;
    } set width(pWidth: number) {
        this.updateComponentWidth(pWidth);
    }

    /**
     * Create the resize panel.
     *
     * @param pComponent - Injected component reference, used to trigger self-updates.
     */
    public constructor(pComponent: Component = Injection.use(Component)) {
        this.mComponentElement = pComponent.element;

        // Disabled all direction as default.
        this.mConfiguration = {
            enabledDirections: {
                top: false,
                right: false,
                bottom: false,
                left: false
            }
        };
    }

    /**
     * Handle pointer down on the horizontal handles (top/bottom).
     * These handles resize the height, so the width is locked.
     *
     * @param pEvent - Pointer event from the resize handle.
     */
    public resizeHorizontal(pEvent: PointerEvent): void {
        this.handleResize(pEvent, 'horizontal');
    }

    /**
     * Handle pointer down on the vertical handles (left/right).
     * These handles resize the width, so the height is locked.
     *
     * @param pEvent - Pointer event from the resize handle.
     */
    public resizeVertical(pEvent: PointerEvent): void {
        this.handleResize(pEvent, 'vertical');
    }

    /**
     * Apply the parent component size.
     * When set to virtual, only the events are fired.
     *
     * @param pUsedHandle - All used handle for the resize.
     * @param pWidth - Width in pixel.
     * @param pHeight - Height in pixel.
     */
    private applyComponentSize(pUsedHandle: number, pWidth: number, pHeight: number) {
        // Resize with the respected limitations.
        const lResizedWidth: number = this.updateComponentWidth(pWidth);
        const lResizedHeight: number = this.updateComponentHeight(pHeight);

        // Dispatch event after the width has changed.
        if (lResizedWidth !== this.width || lResizedHeight !== this.height) {
            this.mResize.dispatchEvent(this.createResizeEvent(pUsedHandle, lResizedWidth, lResizedHeight, this.width, this.height));
        }

        // Return back the actual resized values.
        return [lResizedWidth, lResizedHeight];
    }

    /**
     * Create the resize event object.
     * Fills in the correct used handle based on the staring and current size.
     *
     * @param pUsedHandle - All used handle for the resize.
     * @param pWidth - Current width.
     * @param pHeight - Current height-
     * @param pStartingWidth - Staring width.
     * @param pStartingHeight - Starting height.
     *
     * @returns fully configurated ResizePanelComponentResize object.
     */
    private createResizeEvent(pUsedHandle: number, pWidth: number, pHeight: number, pStartingWidth: number, pStartingHeight: number) {
        let lResizedHandle: number = pUsedHandle;
        if (pWidth === pStartingWidth) {
            lResizedHandle &= ~(KgResizePanelComponentResizeDirection.right | KgResizePanelComponentResizeDirection.left);
        }
        if (pHeight === pStartingHeight) {
            lResizedHandle &= ~(KgResizePanelComponentResizeDirection.top | KgResizePanelComponentResizeDirection.bottom);
        }

        return new KgResizePanelComponentResize(pWidth, pHeight, lResizedHandle);
    }

    /**
     * Handle the resize logic with a set movement restriction.
     * Applies temporary pointer events to read resizing movements.
     *
     * @param pEvent - The starting pointer down event.
     * @param pAllowedMovement - Allowed movement.
     */
    private handleResize(pEvent: PointerEvent, pAllowedMovement: KgResizePanelComponentMovement): void {
        pEvent.preventDefault();
        pEvent.stopPropagation();

        // Save current size so the current pointer position determinates exactly this size.
        const lComponentSize: DOMRect = this.mComponentElement.getBoundingClientRect();

        // Scale of any transformed parent: ratio of rendered (rect) to layout (offset) size.
        const lScaleX: number = this.mComponentElement.offsetWidth ? lComponentSize.width / this.mComponentElement.offsetWidth : 1;
        const lScaleY: number = this.mComponentElement.offsetHeight ? lComponentSize.height / this.mComponentElement.offsetHeight : 1;

        // Start from the layout size, as thats what gets used as width and height.
        const lStartingWidth: number = lComponentSize.width / lScaleX;
        const lStartingHeight: number = lComponentSize.height / lScaleY;

        // Save the starting pointer coordinates to only resize be the actual movement.
        const lStartX = pEvent.clientX;
        const lStartY = pEvent.clientY;

        // Find if movement should be inverted based on clicked handle.
        let lVerticalInvertion: number = 1; // Right handle
        if (Math.abs(lStartX - lComponentSize.left) < Math.abs(lStartX - lComponentSize.right)) {
            lVerticalInvertion = -1; // Left handle
        }
        let lHorizontalInvertion: number = 1; // Bottom handle
        if (Math.abs(lStartY - lComponentSize.top) < Math.abs(lStartY - lComponentSize.bottom)) {
            lHorizontalInvertion = -1; // Top handle
        }

        // Determinate handles used.
        let lUsedHandles: number = 0;
        lUsedHandles += (lVerticalInvertion === 1) ? KgResizePanelComponentResizeDirection.right : KgResizePanelComponentResizeDirection.left;
        lUsedHandles += (lHorizontalInvertion === 1) ? KgResizePanelComponentResizeDirection.bottom : KgResizePanelComponentResizeDirection.top;

        // Save the current size while resizing to check if the size has actually changed.
        let lCurrentWidth: number = lStartingWidth;
        let lCurrentHeight: number = lStartingHeight;

        // Resize magic listener (●'◡'●)つ━☆・*。
        const lPointerMoveListener = (pMoveEvent: PointerEvent): void => {
            // Resize from top-left corner: moving left/up increases size. Divide by scale to convert screen movement into layout pixels.
            const lMovementChangeX: number = ((pMoveEvent.clientX - lStartX) / lScaleX) * lVerticalInvertion;
            const lMovementChangeY: number = ((pMoveEvent.clientY - lStartY) / lScaleY) * lHorizontalInvertion;

            // Change window size but clamp it down to a minimum size.
            let lWidth: number = lStartingWidth + lMovementChangeX;
            let lHeight: number = lStartingHeight + lMovementChangeY;

            // Reset not allowed movement.
            if (pAllowedMovement === 'horizontal') {
                lWidth = lStartingWidth;
            }
            if (pAllowedMovement === 'vertical') {
                lHeight = lStartingHeight;
            }

            // And then update component size.
            [lCurrentWidth, lCurrentHeight] = this.applyComponentSize(lUsedHandles, lWidth, lHeight);
        };

        // Pointer up listener, cleaning up temporary listener.
        const lPointerUpListener = (): void => {
            // Remove temporary mouse move listener.
            document.removeEventListener('pointermove', lPointerMoveListener);
            document.removeEventListener('pointerup', lPointerUpListener);

            // Dispatch end event on pointer up, only if any size has actually changed.
            if (lCurrentWidth !== lStartingWidth || lCurrentHeight !== lStartingHeight) {
                this.mResizeEnd.dispatchEvent(this.createResizeEvent(lUsedHandles, lCurrentWidth, lCurrentHeight, lStartingWidth, lStartingHeight));
            }
        };

        // Add temporary mouse move listener.
        document.addEventListener('pointermove', lPointerMoveListener);
        document.addEventListener('pointerup', lPointerUpListener);
    }

    /**
     * Parse a value into a boolean.
     *
     * @param pValue - Value.
     *
     * @returns a boolean.
     */
    private parseBoolean(pValue: unknown): boolean {
        // Try to parse the value to a boolean parseable state.
        const lParsedValue = (() => {
            // When value is a string, it might be "true" or "false".
            if (typeof pValue === 'string') {
                // Empty strings are considered as true also. Because setting a empty attribute also is "true".
                if (pValue === '') {
                    return true;
                }

                // Check for a string with the literal true or false string.
                const lEnabledStateString: string = pValue.toLowerCase();
                if (['true', 'false'].includes(lEnabledStateString)) {
                    return lEnabledStateString === 'true';
                }
            }
            return pValue;
        })();

        // Whatever the parsed value is now, parse it to boolean.
        return Boolean(lParsedValue);
    }

    /**
     * Set component height.
     *
     * @param pHeight - Height in pixel.
     *
     * @returns resized height.
     */
    private updateComponentHeight(pHeight: number): number {
        // Skip resize if not setup to be resized.
        if (!this.mConfiguration.enabledDirections.top && !this.mConfiguration.enabledDirections.bottom) {
            return this.height;
        }

        // Size should not be divided by zero. Limit that.
        const lResizedHeight: number = Math.max(1, pHeight);

        this.mComponentElement.style.setProperty('height', `${lResizedHeight}px`);

        return lResizedHeight;
    }

    /**
     * Set component width.
     *
     * @param pWidth - Width in pixel.
     *
     * @returns resized width.
     */
    private updateComponentWidth(pWidth: number): number {
        // Skip resize if not setup to be resized.
        if (!this.mConfiguration.enabledDirections.left && !this.mConfiguration.enabledDirections.right) {
            return this.width;
        }

        // Size should not be divided by zero. Limit that.
        const lResizedWidth: number = Math.max(1, pWidth);

        this.mComponentElement.style.setProperty('width', `${lResizedWidth}px`);

        return lResizedWidth;
    }
}

export class KgResizePanelComponentResize {
    private readonly mHeight: number;
    private readonly mResizeHandle: number;
    private readonly mWidth: number;

    /**
     * New resized height.
     */
    public get height(): number {
        return this.mHeight;
    }

    /**
     * Resize handle where the resize happened.
     */
    public get resizeHandle(): number {
        return this.mResizeHandle;
    }

    /**
     * New resized width.
     */
    public get width(): number {
        return this.mWidth;
    }

    /**
     * Constructor.
     *
     * @param pWidth - New resized width.
     * @param pHeight - New resized height.
     * @param pResizeHandle - Resize handle where the resize happened.
     */
    public constructor(pWidth: number, pHeight: number, pResizeHandle: number) {
        this.mHeight = pHeight;
        this.mResizeHandle = pResizeHandle;
        this.mWidth = pWidth;
    }
}

export const KgResizePanelComponentResizeDirection = {
    top: 1,
    right: 2,
    bottom: 4,
    left: 8,
} as const;
export type KgResizePanelComponentResizeDirection = typeof KgResizePanelComponentResizeDirection[keyof typeof KgResizePanelComponentResizeDirection];

type KgResizePanelComponentMovement = 'horizontal' | 'vertical';

type KgResizePanelComponentConfiguration = {
    enabledDirections: {
        top: boolean;
        right: boolean;
        bottom: boolean;
        left: boolean;
    };
};
