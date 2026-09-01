import { type ComponentEventEmitter, ComponentState, PwbComponent, PwbComponentEvent, PwbExport } from '@kartoffelgames/web-potato-web-builder';
import styles from './kg-input-component.css' with { type: 'text' };
import template from './kg-input-component.html' with { type: 'text' };

/**
 * Input component. Shares the select styling, border animation, padding and sizing.
 * Wraps a native input field and has no styling type.
 *
 * Configurable attributes:
 *  - "type": Native input type (e.g. "text", "number"). Defaults to "text".
 *  - "placeholder": Placeholder text shown while the field is empty.
 *  - "disabled": Disables the field. "true"/"false".
 *  - "value": Current field value. Reading returns it, writing overrides it.
 *
 * Events:
 *  - "change": Dispatched with the new value when the field changes.
 *
 * CSS variables:
 *  - "--input-accent-color"
 *  - "--input-text-color"
 *  - "--input-background-color"
 */
@PwbComponent({
    selector: 'kg-input',
    template: template,
    style: styles
})
export class KgInputComponent {
    /**
     * Placeholder text shown while the field is empty.
     */
    @PwbExport()
    @ComponentState.state()
    public accessor placeholder: string;

    /**
     * Native input type.
     */
    @PwbExport()
    @ComponentState.state()
    public accessor type: string;

    /**
     * Current field value.
     */
    @PwbExport()
    @ComponentState.state()
    public accessor value: string;

    /**
     * Disabled state of the field.
     */
    @ComponentState.state()
    private accessor mDisabled: boolean;

    /**
     * Whether the field is disabled.
     * Reading returns the current state, writing overrides it.
     */
    @PwbExport()
    public get disabled(): boolean {
        return this.mDisabled;
    } set disabled(pDisabled: unknown) {
        this.mDisabled = this.parseBoolean(pDisabled);
    }

    /**
     * Emitted when the field value changes.
     */
    @PwbComponentEvent('change')
    private accessor mChange!: ComponentEventEmitter<string>;

    /**
     * Create the input with its default configuration.
     */
    public constructor() {
        this.value = '';
        this.placeholder = '';
        this.type = 'text';
        this.mDisabled = false;
    }

    /**
     * Handle the native inputs change event.
     * Re-dispatches the new value as the components "change" event.
     *
     * @param pEvent - Change event from the inner input element.
     */
    public onChange(pEvent: Event): void {
        const lInputElement: HTMLInputElement = pEvent.target as HTMLInputElement;

        // Sync the value before dispatching so listeners read the committed value synchronously.
        this.value = lInputElement.value;
        this.mChange.dispatchEvent(this.value);
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
