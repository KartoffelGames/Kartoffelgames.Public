import { ComponentState, PwbComponent, PwbComponentEvent, PwbExport, type ComponentEventEmitter } from '@kartoffelgames/web-potato-web-builder';
import styles from './kg-button-component.css' with { type: 'text' };
import template from './kg-button-component.html' with { type: 'text' };

/**
 * Button component. Combines multiple button styles selected through the "type" attribute.
 *
 * Configurable attributes:
 *  - "type": "primary", "secondary" or "selectable".
 *  - "selected": "true" or "false". Only handled internally for the "selectable" type.
 *
 * Events:
 *  - "select"
 *
 * CSS variables:
 *  - "--button-accent-color"
 *  - "--button-text-color"
 *  - "--button-border-color"
 *  - "--button-background-color"
 */
@PwbComponent({
    selector: 'kg-button',
    template: template,
    style: styles
})
export class KgButtonComponent {
    /**
     * Emitted when a "selectable" button gets selected.
     */
    @PwbComponentEvent('select')
    private accessor mSelect!: ComponentEventEmitter<boolean>;

    /**
     * Current selection state. Only ever set internally for the "selectable" type.
     */
    @ComponentState.state()
    private accessor mSelected: boolean;

    /**
     * Configured button type. Drives both styling and behaviour.
     */
    @ComponentState.state()
    private accessor mType: KgButtonComponentType;

    /**
     * Selection state of the button.
     * Reading returns the current state, writing overrides it.
     */
    @PwbExport
    public get selected(): boolean {
        return this.mSelected;
    } set selected(pSelected: unknown) {
        this.mSelected = this.parseBoolean(pSelected);
    }

    /**
     * Button type. One of "primary", "secondary" or "selectable".
     */
    @PwbExport
    public get type(): KgButtonComponentType {
        return this.mType;
    } set type(pType: string) {
        // Only allow the known button types.
        if (pType !== 'primary' && pType !== 'secondary' && pType !== 'selectable') {
            this.mType = 'secondary';
            return;
        }

        this.mType = pType;
    }

    /**
     * Create the button with its default configuration.
     */
    public constructor() {
        this.mType = 'primary';
        this.mSelected = false;
    }

    /**
     * Handle a click on the button.
     * Only "selectable" buttons update their selection state and dispatch the "select" event.
     */
    public onClick(): void {
        // Selection and its event are exclusive to the selectable type.
        if (this.mType !== 'selectable') {
            return;
        }

        // A selectable button can only be selected, never unselected by itself.
        this.mSelected = true;

        // Notify the outside about the selection.
        this.mSelect.dispatchEvent(this.mSelected);
    }

    /**
     * Parse an unknown (possibly string attribute) value into a boolean.
     *
     * @param pValue - Value to parse.
     *
     * @returns a boolean.
     */
    private parseBoolean(pValue: unknown): boolean {
        // A string attribute might be the literal "true" or "false".
        if (typeof pValue === 'string') {
            const lValue: string = pValue.toLowerCase();
            if (lValue === 'true' || lValue === 'false') {
                return lValue === 'true';
            }
        }

        return Boolean(pValue);
    }
}

export type KgButtonComponentType = 'primary' | 'secondary' | 'selectable';
