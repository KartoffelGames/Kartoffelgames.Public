import { PwbComponent, Processor, PwbExport, PwbComponentEvent, ComponentEventEmitter } from '@kartoffelgames/web-potato-web-builder';
import templateCss from './potatno-search-input.css';
import searchInputTemplate from './potatno-search-input.html';

/**
 * Search input component for the potatno-code visual editor.
 * Provides a text input with search-change event dispatching.
 */
@PwbComponent({
    selector: 'potatno-search-input',
    template: searchInputTemplate,
    style: templateCss,
})
export class PotatnoSearchInput extends Processor {
    /**
     * Placeholder text displayed when the input is empty.
     */
    @PwbExport
    public placeholder: string = 'Search...';

    /**
     * Current value of the search input.
     */
    @PwbExport
    public value: string = '';

    @PwbComponentEvent('search-change')
    private accessor mSearchChange!: ComponentEventEmitter<string>;

    /**
     * Handle input events from the search field. Updates the value and dispatches
     * a search-change event with the current input text.
     *
     * @param pEvent - Input event from the text field.
     */
    public onInput(pEvent: Event): void {
        const lTarget: HTMLInputElement = pEvent.target as HTMLInputElement;
        this.value = lTarget.value;
        this.mSearchChange.dispatchEvent(this.value);
    }
}
