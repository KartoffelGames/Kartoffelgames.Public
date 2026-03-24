import { PwbComponent, Processor, PwbExport, PwbComponentEvent, ComponentEventEmitter } from '@kartoffelgames/web-potato-web-builder';
import templateCss from './potatno-function-list.css';
import functionListTemplate from './potatno-function-list.html';

/**
 * Function entry displayed in the function list.
 */
interface FunctionListEntry {
    id: string;
    name: string;
    label: string;
    system: boolean;
}

/**
 * Function list component for the potatno-code visual editor.
 * Displays a list of functions with selection, add, and delete capabilities.
 */
@PwbComponent({
    selector: 'potatno-function-list',
    template: functionListTemplate,
    style: templateCss,
})
export class PotatnoFunctionList extends Processor {
    /**
     * Array of function entries to display.
     */
    @PwbExport
    public functions: Array<FunctionListEntry> = [];

    /**
     * ID of the currently active (selected) function.
     */
    @PwbExport
    public activeFunctionId: string = '';

    /**
     * Event emitted when a function is selected.
     */
    @PwbComponentEvent('function-select')
    private accessor mFunctionSelect!: ComponentEventEmitter<string>;

    /**
     * Event emitted when the add function button is clicked.
     */
    @PwbComponentEvent('function-add')
    private accessor mFunctionAdd!: ComponentEventEmitter<void>;

    /**
     * Event emitted when a function delete button is clicked.
     */
    @PwbComponentEvent('function-delete')
    private accessor mFunctionDelete!: ComponentEventEmitter<string>;

    /**
     * Get the CSS class for a function entry based on active state.
     *
     * @param pId - Function ID.
     * @returns CSS class string.
     */
    public getEntryClass(pId: string): string {
        return pId === this.activeFunctionId ? 'function-entry active' : 'function-entry';
    }

    /**
     * Handle function entry click to select it.
     *
     * @param pId - The function ID to select.
     */
    public onFunctionSelect(pId: string): void {
        this.mFunctionSelect.dispatchEvent(pId);
    }

    /**
     * Handle add function button click.
     */
    public onFunctionAdd(): void {
        this.mFunctionAdd.dispatchEvent(undefined as void);
    }

    /**
     * Handle delete button click on a function entry.
     * Stops propagation to prevent triggering the select event.
     *
     * @param pEvent - The click event.
     * @param pId - The function ID to delete.
     */
    public onFunctionDelete(pEvent: MouseEvent, pId: string): void {
        pEvent.stopPropagation();
        this.mFunctionDelete.dispatchEvent(pId);
    }
}
