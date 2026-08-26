import { type ComponentEventEmitter, ComponentState, PwbComponent, PwbComponentEvent, PwbExport } from '@kartoffelgames/web-potato-web-builder';
import styles from './kg-select-component.css' with { type: 'text' };
import template from './kg-select-component.html' with { type: 'text' };

/**
 * Select component. Shares the button styling, border animation, padding and sizing.
 * Renders a native "select" element from a data driven "options" list, as slotted
 * options can not be projected into a native select inside shadow dom.
 *
 * Configurable attributes:
 *  - "type": "primary" or "secondary". Both mirror the button type styling.
 *  - "placeholder": Text shown as a disabled option while no value is selected.
 *
 * Properties:
 *  - "options": Selectable options. Each with a "value" and a "label".
 *  - "value": Currently selected option value. Reading returns it, writing overrides it.
 *
 * Events:
 *  - "change": Dispatched with the newly selected value when the user changes the selection.
 *
 * CSS variables:
 *  - "--select-accent-color"
 *  - "--select-accent-text-color"
 *  - "--select-text-color"
 *  - "--select-border-color"
 *  - "--select-background-color"
 */
@PwbComponent({
    selector: 'kg-select',
    template: template,
    style: styles
})
export class KgSelectComponent {
    /**
     * Available options rendered inside the native select.
     */
    @ComponentState.state({ proxy: true })
    private accessor mOptions: Array<KgSelectComponentOption>;

    /**
     * Placeholder text. Shown as a disabled option while nothing is selected.
     */
    @ComponentState.state()
    private accessor mPlaceholder: string;

    /**
     * Configured select type. Drives the styling, same as the button.
     */
    @ComponentState.state()
    private accessor mType: KgSelectComponentType;

    /**
     * Currently selected value.
     */
    @ComponentState.state()
    private accessor mValue: string;

    /**
     * Emitted when the user selects a different option.
     */
    @PwbComponentEvent('change')
    private accessor mChange!: ComponentEventEmitter<string>;

    /**
     * Selectable options. Each with a "value" and a "label".
     */
    @PwbExport()
    public get options(): Array<KgSelectComponentOption> {
        return this.mOptions;
    } set options(pOptions: Array<KgSelectComponentOption>) {
        // Guard against non array values.
        this.mOptions = Array.isArray(pOptions) ? pOptions : new Array<KgSelectComponentOption>();
    }

    /**
     * Placeholder text shown while no value is selected.
     */
    @PwbExport()
    public get placeholder(): string {
        return this.mPlaceholder;
    } set placeholder(pPlaceholder: unknown) {
        this.mPlaceholder = (pPlaceholder ?? '').toString();
    }

    /**
     * Select type. One of "primary" or "secondary".
     */
    @PwbExport()
    public get type(): KgSelectComponentType {
        return this.mType;
    } set type(pType: string) {
        // Only allow the known types.
        if (pType !== 'primary' && pType !== 'secondary') {
            this.mType = 'secondary';
            return;
        }

        this.mType = pType;
    }

    /**
     * Selected option value.
     * Reading returns the current value, writing overrides the selection.
     */
    @PwbExport()
    public get value(): string {
        return this.mValue;
    } set value(pValue: unknown) {
        this.mValue = (pValue ?? '').toString();
    }

    /**
     * Create the select with its default configuration.
     */
    public constructor() {
        this.mType = 'primary';
        this.mValue = '';
        this.mOptions = new Array<KgSelectComponentOption>();
        this.mPlaceholder = '';
    }

    /**
     * Handle the native selects change event.
     * Reads the new value and re-dispatches it as the components "change" event.
     *
     * @param pEvent - Change event from the inner select element.
     */
    public onChange(pEvent: Event): void {
        const lSelectElement: HTMLSelectElement = pEvent.target as HTMLSelectElement;

        // Store and re-emit the new selection.
        this.mValue = lSelectElement.value;
        this.mChange.dispatchEvent(this.mValue);
    }
}

export type KgSelectComponentType = 'primary' | 'secondary';

export type KgSelectComponentOption = {
    value: string;
    label: string;
};
