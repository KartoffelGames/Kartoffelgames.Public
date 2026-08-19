import { ComponentState, PwbComponent, PwbExport } from '@kartoffelgames/web-potato-web-builder';
import styles from './kg-button-component.css' with { type: 'text' };
import template from './kg-button-component.html' with { type: 'text' };

/**
 * Button component. Combines multiple button styles selected through the "type" attribute.
 *
 * Configurable attributes:
 *  - "type": "primary" or "secondary". Both types react to the "selected" state.
 *  - "selected": "true" or "false". Highlights the button as selected. Controlled from the outside.
 *
 * CSS variables:
 *  - "--button-accent-color"
 *  - "--button-accent-text-color"
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
     * Current selection state. Controlled from the outside through the "selected" property.
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
    @PwbExport()
    public get selected(): boolean {
        return this.mSelected;
    } set selected(pSelected: unknown) {
        this.mSelected = this.parseBoolean(pSelected);
    }

    /**
     * Button type. One of "primary" or "secondary".
     */
    @PwbExport()
    public get type(): KgButtonComponentType {
        return this.mType;
    } set type(pType: string) {
        // Only allow the known button types.
        if (pType !== 'primary' && pType !== 'secondary') {
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
     * Parse an unknown (possibly string attribute) value into a boolean.
     *
     * @param pValue - Value to parse.
     *
     * @returns a boolean.
     */
    private parseBoolean(pValue: unknown): boolean {
        // A string attribute might be the literal "true" or "false".
        if (typeof pValue === 'string') {
            // Empty strings are considered as true also. Because setting a empty attribute also is "true".
            if (pValue === '') {
                return true;
            }

            // Check for a string with the literal true or false string.
            const lValue: string = pValue.toLowerCase();
            if (lValue === 'true' || lValue === 'false') {
                return lValue === 'true';
            }
        }

        return Boolean(pValue);
    }
}

export type KgButtonComponentType = 'primary' | 'secondary';
