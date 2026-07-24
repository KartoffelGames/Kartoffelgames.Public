import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Component, type ComponentEventEmitter, ComponentState, PwbComponent, PwbComponentEvent } from '@kartoffelgames/web-potato-web-builder';
import { PwbExport } from '../../../../../kartoffelgames.web.potato_web_builder/source/module/export/pwb-export.decorator.ts';
import styles from './potatno-resize-box-component.css' with { type: 'text' };
import template from './potatno-resize-box-component.html' with { type: 'text' };

/**
 * user resizeable panel.
 * Configurable with "top", "right", "bottom" and "left" attributes by setting them "true"
 */
@PwbComponent({
    selector: 'potatno-resize-box',
    template: template,
    style: styles
})
export class PotatnoResizeBoxComponent {
    private readonly mComponentElement: HTMLElement;

    /**
     * Enabled directions. Used only in template references.
     */
    @ComponentState.state({ proxy: true })
    private accessor mConfiguration: PotatnoResizeBoxComponentConfiguration;

    /**
     * Emitted with the definition the user picked, for the host to insert.
     */
    @PwbComponentEvent('resize')
    private accessor mResize!: ComponentEventEmitter<PotatnoResizeBoxComponentResize>;

    /**
     * Emitted with the definition the user picked, for the host to insert.
     */
    @PwbComponentEvent('resize-end')
    private accessor mResizeEnd!: ComponentEventEmitter<PotatnoResizeBoxComponentResize>;

    /**
     * If bottom resize handle is enabled.
     */
    @PwbExport
    public get bottom(): boolean {
        return this.mConfiguration.enabledDirections.bottom;
    } set bottom(pEnabled: unknown) {
        this.mConfiguration.enabledDirections.bottom = this.parseBoolean(pEnabled);
    }

    /**
     * If left resize handle is enabled.
     */
    @PwbExport
    public get left(): boolean {
        return this.mConfiguration.enabledDirections.left;
    } set left(pEnabled: unknown) {
        this.mConfiguration.enabledDirections.left = this.parseBoolean(pEnabled);
    }

    /**
     * If right resize handle is enabled.
     */
    @PwbExport
    public get right(): boolean {
        return this.mConfiguration.enabledDirections.right;
    } set right(pEnabled: unknown) {
        this.mConfiguration.enabledDirections.right = this.parseBoolean(pEnabled);
    }

    /**
     * If top resize handle is enabled.
     */
    @PwbExport
    public get snap(): number {
        return this.mConfiguration.snap;
    } set snap(pPixel: number) {
        this.mConfiguration.snap = parseInt(pPixel.toString());
    }

    /**
     * If top resize handle is enabled.
     */
    @PwbExport
    public get top(): boolean {
        return this.mConfiguration.enabledDirections.top;
    } set top(pEnabled: unknown) {
        this.mConfiguration.enabledDirections.top = this.parseBoolean(pEnabled);
    }

    /**
     * If resize is only virtual and does not actually resize.
     * Still triggers events and can be resized with the exposed resize method.
     */
    @PwbExport
    public get virtual(): boolean {
        return this.mConfiguration.isVirtual;
    } set virtual(pEnabled: boolean) {
        this.mConfiguration.isVirtual = this.parseBoolean(pEnabled);
    }

    /**
     * Create the preview panel.
     *
     * @param pComponent - Injected component reference, used to trigger self-updates.
     * @param pManager - Injected shared UI manager singleton.
     */
    public constructor(pComponent: Component = Injection.use(Component)) {
        this.mComponentElement = pComponent.element;

        // Disabled all direction as default.
        this.mConfiguration = {
            snap: 1,
            isVirtual: false,
            enabledDirections: {
                top: false,
                right: false,
                bottom: false,
                left: false
            }
        };
    }

    /**
     * Exposed resize function of resize box.
     * Does not trigger any events.
     * 
     * @param pWidth - new width.
     * @param pHeight - new height.
     * 
     * @returns true if the size has changed.
     */
    @PwbExport
    public resize(pWidth: number, pHeight: number): boolean {
        // Save current size so the current pointer position determinates exactly this size.
        const lComponentSize: DOMRect = this.mComponentElement.getBoundingClientRect();
        const lStartingWidth: number = lComponentSize.width;
        const lStartingHeight: number = lComponentSize.height;

        // Resize component without a triggered handle.
        this.mComponentElement.style.setProperty('width', `${pWidth}px`);
        this.mComponentElement.style.setProperty('height', `${pHeight}px`);

        // Dispatch end event after resize, only if any size has actually changed.
        return pWidth !== lStartingWidth || pHeight !== lStartingHeight;
    }

    /**
     * Handle pointer down on the resize corners handle.
     *
     * @param pEvent - Pointer event from the resize handle.
     */
    public resizeCorner(pEvent: PointerEvent): void {
        this.handleResize(pEvent, 'both');
    }

    /**
     * Handle pointer down on the resize horizontal handles.
     *
     * @param pEvent - Pointer event from the resize handle.
     */
    public resizeHorizontal(pEvent: PointerEvent): void {
        this.handleResize(pEvent, 'horizontal');
    }

    /**
     * Handle pointer down on the resize vertical handles.
     *
     * @param pEvent - Pointer event from the resize handle.
     */
    public resizeVertical(pEvent: PointerEvent): void {
        this.handleResize(pEvent, 'vertical');
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
     * @returns fully configurated PotatnoResizeBoxComponentResize object.
     */
    private createResizeEvent(pUsedHandle: number, pWidth: number, pHeight: number, pStartingWidth: number, pStartingHeight: number) {
        let lResizedHandle: number = pUsedHandle;
        if (pWidth === pStartingWidth) {
            lResizedHandle &= ~(PotatnoResizeBoxComponentResizeDirection.right | PotatnoResizeBoxComponentResizeDirection.left);
        }
        if (pHeight === pStartingHeight) {
            lResizedHandle &= ~(PotatnoResizeBoxComponentResizeDirection.top | PotatnoResizeBoxComponentResizeDirection.bottom);
        }

        return new PotatnoResizeBoxComponentResize(pWidth, pHeight, lResizedHandle);
    }

    /**
     * Handle the resize logic with a set movement restriction.
     * Applies temporary pointer events to read resizing movements.
     * 
     * @param pEvent - The starting pointer down event.
     * @param pAllowedMovement - Allowed movement.
     */
    private handleResize(pEvent: PointerEvent, pAllowedMovement: PotatnoResizeBoxComponentMovement): void {
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
        lUsedHandles += (lVerticalInvertion === 1) ? PotatnoResizeBoxComponentResizeDirection.right : PotatnoResizeBoxComponentResizeDirection.left;
        lUsedHandles += (lHorizontalInvertion === 1) ? PotatnoResizeBoxComponentResizeDirection.bottom : PotatnoResizeBoxComponentResizeDirection.top;

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
            [lCurrentWidth, lCurrentHeight] = this.updateComponentSize(lUsedHandles, lWidth, lHeight, lCurrentWidth, lCurrentHeight);
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
     * Update the parent component size.
     * 
     * @param pWidth - Width in pixel.
     * @param pHeight - Height in pixel.
     */
    private updateComponentSize(pUsedHandle: number, pWidth: number, pHeight: number, pStartingWidth: number, pStartingHeight: number) {
        // Only set width when eighter left or right is enabled
        let lResizedWidth: number = pStartingWidth;
        if (this.mConfiguration.enabledDirections.left || this.mConfiguration.enabledDirections.right) {
            // Snap the resized value.
            lResizedWidth = Math.floor(Math.abs(pWidth) / this.mConfiguration.snap) * this.mConfiguration.snap * (pWidth / Math.abs(pWidth));

            // Resize if the resize should not be virtual.
            if (!this.mConfiguration.isVirtual) {
                this.mComponentElement.style.setProperty('width', `${lResizedWidth}px`);
            }
        }

        // Only set width when eighter top or bottom is enabled
        let lResizedHeight: number = pStartingHeight;
        if (this.mConfiguration.enabledDirections.top || this.mConfiguration.enabledDirections.bottom) {
            // Snap the resized value.
            lResizedHeight = Math.floor(Math.abs(pHeight) / this.mConfiguration.snap) * this.mConfiguration.snap * (pHeight / Math.abs(pHeight));

            // Resize if the resize should not be virtual.
            if (!this.mConfiguration.isVirtual) {
                this.mComponentElement.style.setProperty('height', `${lResizedHeight}px`);
            }
        }

        // Dispatch event after the width has changed.
        if (lResizedWidth !== pStartingWidth || lResizedHeight !== pStartingHeight) {
            this.mResize.dispatchEvent(this.createResizeEvent(pUsedHandle, lResizedWidth, lResizedHeight, pStartingWidth, pStartingHeight));
        }

        // Return back the actual resized values.
        return [lResizedWidth, lResizedHeight];
    }
}

export class PotatnoResizeBoxComponentResize {
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

export const PotatnoResizeBoxComponentResizeDirection = {
    top: 1,
    right: 2,
    bottom: 4,
    left: 8,
} as const;
export type PotatnoResizeBoxComponentResizeDirection = typeof PotatnoResizeBoxComponentResizeDirection[keyof typeof PotatnoResizeBoxComponentResizeDirection];

type PotatnoResizeBoxComponentMovement = 'horizontal' | 'vertical' | 'both';

type PotatnoResizeBoxComponentConfiguration = {
    snap: number;
    isVirtual: boolean;
    enabledDirections: {
        top: boolean;
        right: boolean;
        bottom: boolean;
        left: boolean;
    };
};