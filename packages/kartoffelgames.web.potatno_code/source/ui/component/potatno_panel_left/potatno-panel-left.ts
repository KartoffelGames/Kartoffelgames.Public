import { ComponentEvent, ComponentEventEmitter, ComponentState, PwbComponent, PwbComponentEvent, PwbExport } from '@kartoffelgames/web-potato-web-builder';
import templateCss from './potatno-panel-left.css' with { type: 'text' };
import panelLeftTemplate from './potatno-panel-left.html' with { type: 'text' };

// Import child components to ensure they are registered.
import '../potatno_function_list/potatno-function-list.ts';

/**
 * Left panel component for the potatno-code visual editor.
 * Hosts the function list; nodes are added through the graph's right-click overlay.
 */
@PwbComponent({
    selector: 'potatno-panel-left',
    template: panelLeftTemplate,
    style: templateCss,
})
export class PotatnoPanelLeft {
    /**
     * Function entries to display in the function list.
     */
    @PwbExport
    @ComponentState.state()
    public accessor functions: Array<FunctionEntry> = [];

    /**
     * ID of the currently active function.
     */
    @PwbExport
    @ComponentState.state()
    public accessor activeFunctionId: string = '';

    /**
     * User function definitions available for creation.
     */
    @PwbExport
    @ComponentState.state()
    public accessor userFunctionDefinitions: Array<UserFunctionDefinitionEntry> = [];

    /**
     * Event emitted when a function is selected.
     */
    @PwbComponentEvent('function-select')
    private accessor mFunctionSelect!: ComponentEventEmitter<string>;

    /**
     * Event emitted when a new function is requested with a definition ID.
     */
    @PwbComponentEvent('function-add')
    private accessor mFunctionAdd!: ComponentEventEmitter<string>;

    /**
     * Event emitted when a function deletion is requested.
     */
    @PwbComponentEvent('function-delete')
    private accessor mFunctionDelete!: ComponentEventEmitter<string>;

    /**
     * Bubble the function-select event from the function list.
     *
     * @param pEvent - Component event containing the function ID.
     */
    public onFunctionSelect(pEvent: ComponentEvent<string>): void {
        this.mFunctionSelect.dispatchEvent(pEvent.value);
    }

    /**
     * Bubble the function-add event from the function list.
     *
     * @param pEvent - Component event containing the selected definition ID.
     */
    public onFunctionAdd(pEvent: ComponentEvent<string>): void {
        this.mFunctionAdd.dispatchEvent(pEvent.value);
    }

    /**
     * Bubble the function-delete event from the function list.
     *
     * @param pEvent - Component event containing the function ID.
     */
    public onFunctionDelete(pEvent: ComponentEvent<string>): void {
        this.mFunctionDelete.dispatchEvent(pEvent.value);
    }
}

/**
 * Function entry passed through to the function list.
 */
interface FunctionEntry {
    id: string;
    label: string;
    name: string;
    system: boolean;
}

/**
 * User function definition entry passed through to the function list.
 */
interface UserFunctionDefinitionEntry {
    id: string;
}
