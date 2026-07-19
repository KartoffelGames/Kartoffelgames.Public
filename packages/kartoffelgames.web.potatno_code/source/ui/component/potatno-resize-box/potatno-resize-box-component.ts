import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Component, ComponentState, PwbComponent } from '@kartoffelgames/web-potato-web-builder';
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
    private accessor enabledDirections: PotatnoResizeBoxComponentDirections;

    /**
     * If bottom resize handle is enabled.
     */
    @PwbExport
    public get bottom(): boolean {
        return this.enabledDirections.enabled.bottom;
    } set bottom(pEnabled: unknown) {
        this.enabledDirections.enabled.bottom = this.parseBoolean(pEnabled);
    }

    /**
     * If left resize handle is enabled.
     */
    @PwbExport
    public get left(): boolean {
        return this.enabledDirections.enabled.left;
    } set left(pEnabled: unknown) {
        this.enabledDirections.enabled.left = this.parseBoolean(pEnabled);
    }

    /**
     * If right resize handle is enabled.
     */
    @PwbExport
    public get right(): boolean {
        return this.enabledDirections.enabled.right;
    } set right(pEnabled: unknown) {
        this.enabledDirections.enabled.right = this.parseBoolean(pEnabled);
    }

    /**
     * If top resize handle is enabled.
     */
    @PwbExport
    public get snap(): number {
        return this.enabledDirections.snap;
    } set snap(pPixel: number) {
        this.enabledDirections.snap = parseInt(pPixel.toString());
    }

    /**
     * If top resize handle is enabled.
     */
    @PwbExport
    public get top(): boolean {
        return this.enabledDirections.enabled.top;
    } set top(pEnabled: unknown) {
        this.enabledDirections.enabled.top = this.parseBoolean(pEnabled);
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
        this.enabledDirections = {
            snap: 1,
            enabled: {
                top: false,
                right: false,
                bottom: false,
                left: false
            }
        };
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
        const lStartingWidth: number = lComponentSize.width;
        const lStartingHeight: number = lComponentSize.height;

        // Save the starting pointer coordinates to only resize be the actual movement.
        const lStartX = pEvent.clientX;
        const lStartY = pEvent.clientY;

        // Find if movement should be inverted based on clicked handle.
        let lVerticalInvertion: number = 1;
        if (Math.abs(lStartX - lComponentSize.left) < Math.abs(lStartX - lComponentSize.right)) {
            lVerticalInvertion = -1;
        }
        let lHorizontalInvertion: number = 1;
        if (Math.abs(lStartY - lComponentSize.top) < Math.abs(lStartY - lComponentSize.bottom)) {
            lHorizontalInvertion = -1;
        }

        // Resize magic listener (●'◡'●)つ━☆・*。
        const lPointerMoveListener = (pMoveEvent: PointerEvent): void => {
            // Resize from top-left corner: moving left/up increases size.
            const lMovementChangeX: number = (pMoveEvent.clientX - lStartX) * lVerticalInvertion;
            const lMovementChangeY: number = (pMoveEvent.clientY - lStartY) * lHorizontalInvertion;

            // Change window size but clamp it doen to a minimum size.
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
            this.updateComponentSize(lWidth, lHeight);
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
    private updateComponentSize(pWidth: number, pHeight: number) {
        // Only set width when eighter left or right is enabled
        if (this.enabledDirections.enabled.left || this.enabledDirections.enabled.right) {
            const lSnappedWidth: number = Math.floor(Math.abs(pWidth) / this.enabledDirections.snap) * this.enabledDirections.snap * (pWidth / Math.abs(pWidth));
            this.mComponentElement.style.setProperty('width', `${lSnappedWidth}px`);
        }

        // Only set width when eighter top or bottom is enabled
        if (this.enabledDirections.enabled.top || this.enabledDirections.enabled.bottom) {
            const lSnappedHeight: number = Math.floor(Math.abs(pHeight) / this.enabledDirections.snap) * this.enabledDirections.snap * (pHeight / Math.abs(pHeight));
            this.mComponentElement.style.setProperty('height', `${lSnappedHeight}px`);
        }
    }
}

type PotatnoResizeBoxComponentMovement = 'horizontal' | 'vertical' | 'both';

type PotatnoResizeBoxComponentDirections = {
    snap: number;
    enabled: {
        top: boolean;
        right: boolean;
        bottom: boolean;
        left: boolean;
    };
};