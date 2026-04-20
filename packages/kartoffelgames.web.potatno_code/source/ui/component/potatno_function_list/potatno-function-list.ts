import { PwbComponent, PwbExport, PwbComponentEvent, ComponentEventEmitter, ComponentState } from '@kartoffelgames/web-potato-web-builder';
import templateCss from './potatno-function-list.css' with { type: 'text' };
import functionListTemplate from './potatno-function-list.html' with { type: 'text' };

/**
 * Function list component for the potatno-code visual editor.
 * Displays a list of functions with selection, add, and delete capabilities.
 * Shows a selection popup when adding a function, listing available user function definitions.
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
     * User function definitions available for creation.
     * When empty, the "Add Function" button is hidden.
     */
    @PwbExport
    @ComponentState.state()
    public accessor userFunctionDefinitions: Array<UserFunctionDefinitionEntry> = [];

    /**
     * Whether the function type selection popup is currently visible.
     */
    @ComponentState.state()
    private accessor mShowPopup: boolean = false;

    /**
     * Event emitted when a function is selected.
     */
    @PwbComponentEvent('function-select')
    private accessor mFunctionSelect!: ComponentEventEmitter<string>;

    /**
     * Event emitted when a function type is selected from the popup.
     */
    @PwbComponentEvent('function-add')
    private accessor mFunctionAdd!: ComponentEventEmitter<string>;

    /**
     * Event emitted when a function delete button is clicked.
     */
    @PwbComponentEvent('function-delete')
    private accessor mFunctionDelete!: ComponentEventEmitter<string>;

    /**
     * Whether user function definitions are available for creation.
     */
    public get hasUserFunctionDefinitions(): boolean {
        return this.userFunctionDefinitions.length > 0;
    }

    /**
     * Whether the selection popup is visible.
     */
    public get showPopup(): boolean {
        return this.mShowPopup;
    }

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
     * Handle add function button click. Opens the selection popup.
     */
    public onAddButtonClick(): void {
        if (this.userFunctionDefinitions.length === 1) {
            // If only one definition, skip the popup and add directly.
            this.mFunctionAdd.dispatchEvent(this.userFunctionDefinitions[0].id);
        } else {
            this.mShowPopup = !this.mShowPopup;
        }
    }

    /**
     * Handle selecting a function definition from the popup.
     *
     * @param pDefinitionId - The selected definition ID.
     */
    public onDefinitionSelect(pDefinitionId: string): void {
        this.mShowPopup = false;
        this.mFunctionAdd.dispatchEvent(pDefinitionId);
    }

    /**
     * Close the popup.
     */
    public closePopup(): void {
        this.mShowPopup = false;
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

/**
 * User function definition entry for the selection popup.
 */
interface UserFunctionDefinitionEntry {
    id: string;
}
