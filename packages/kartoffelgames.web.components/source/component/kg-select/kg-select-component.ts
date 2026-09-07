import { type ComponentEventEmitter, ComponentState, PwbComponent, PwbComponentEvent, PwbExport } from '@kartoffelgames/web-potato-web-builder';
import styles from './kg-select-component.css' with { type: 'text' };
import template from './kg-select-component.html' with { type: 'text' };

/**
 * Select component. Shares the button styling, border animation, padding and sizing.
 * Renders a native "select" element from a data driven "options" list, as slotted
 * options can not be projected into a native select inside shadow dom.
 *
 * Configurable attributes:
 *  - "placeholder": Text shown as a disabled option while no value is selected.
 *  - "options": Selectable options. Each with a "value" and a "label".
 *  - "value": Currently selected option value. Reading returns it, writing overrides it.
 *
 * Events:
 *  - "change": Dispatched with the newly selected value when the user changes the selection.
 *
 * CSS variables:
 *  - "--select-accent-color"
 *  - "--select-text-color"
 *  - "--select-background-color"
 */
@PwbComponent({
    selector: 'kg-select',
    template: template,
    style: styles
})
export class KgSelectComponent {
    private readonly mValueMapping: KgSelectValueMapping;

    /**
     * Available options rendered inside the native select.
     */
    @ComponentState.state({ complexValue: true })
    private accessor mOptions: Array<KgSelectComponentOption>;

    /**
     * Placeholder text. Shown as a disabled option while nothing is selected.
     */
    @ComponentState.state()
    private accessor mPlaceholder: string;

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
     * Label mapping of option.
     */
    @PwbExport()
    public get labelKey(): string {
        return this.mValueMapping.labelKey;
    } set labelKey(pValue: unknown) {
        this.mValueMapping.labelKey = (pValue ?? '').toString();
    }

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
     * Value mapping of option.
     */
    @PwbExport()
    public get valueKey(): string {
        return this.mValueMapping.valueKey;
    } set valueKey(pValue: unknown) {
        this.mValueMapping.valueKey = (pValue ?? '').toString();
    }

    /**
     * Create the select with its default configuration.
     */
    public constructor() {
        this.mValue = '';
        this.mOptions = new Array<KgSelectComponentOption>();
        this.mPlaceholder = '';

        this.mValueMapping = {
            valueKey: 'value',
            labelKey: 'label'
        };
    }

    /**
     * Get label property of item.
     * 
     * @param pItem - Item object.
     * 
     * @returns label of item. 
     */
    public itemLabel(pItem: unknown): string {
        return (<Record<string, string>>pItem)[this.mValueMapping.labelKey];
    }

    /**
     * Get value property of item.
     * 
     * @param pItem - Item object.
     * 
     * @returns value of item. 
     */
    public itemValue(pItem: unknown): unknown {
        return (<Record<string, unknown>>pItem)[this.mValueMapping.valueKey];
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

type KgSelectValueMapping = {
    valueKey: string;
    labelKey: string;
};

export type KgSelectComponentOption = {
    value: string;
    label: string;
};
