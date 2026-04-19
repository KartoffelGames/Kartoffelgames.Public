import { PwbComponent, PwbExport, PwbComponentEvent, ComponentEventEmitter, ComponentState } from '@kartoffelgames/web-potato-web-builder';
import templateCss from './potatno-function-list.css' with { type: 'text' };
import functionListTemplate from './potatno-function-list.html' with { type: 'text' };

/**
 * Function list component for the potatno-code visual editor.
 * Displays a list of functions with selection, add, and delete capabilities.
 */
@PwbComponent({
    selector: 'potatno-function-list',
    template: functionListTemplate,
    style: templateCss,
})
export class PotatnoFunctionList {
    /**
     * Array of function entries to display.
     */
    @PwbExport
    @ComponentState.state()
    public accessor functions: Array<FunctionListEntry> = [];

    /**
     * ID of the currently active (selected) function.
     */
    @PwbExport
    @ComponentState.state()
    public accessor activeFunctionId: string = '';

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

/**
 * Function entry displayed in the function list.
 */
interface FunctionListEntry {
    id: string;
    name: string;
    label: string;
    system: boolean;
}
