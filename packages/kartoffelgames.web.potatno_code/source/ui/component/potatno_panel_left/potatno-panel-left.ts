import { PwbComponent, PwbExport, PwbComponentEvent, ComponentEventEmitter, ComponentEvent, ComponentState } from '@kartoffelgames/web-potato-web-builder';
import templateCss from './potatno-panel-left.css' with { type: 'text' };
import panelLeftTemplate from './potatno-panel-left.html' with { type: 'text' };

// Import child components to ensure they are registered.
import '../potatno_node_library/potatno-node-library.ts';
import '../potatno_function_list/potatno-function-list.ts';

/**
 * Left panel component for the potatno-code visual editor.
 * Contains tabbed views for the node library and function list.
 */
@PwbComponent({
    selector: 'potatno-panel-left',
    template: panelLeftTemplate,
    style: templateCss,
})
export class PotatnoPanelLeft {
    /**
     * Node definitions to display in the Nodes tab.
     */
    @PwbExport
    @ComponentState.state()
    public accessor nodeDefinitions: Array<NodeDefinitionEntry> = [];

    /**
     * Function entries to display in the Functions tab.
     */
    @PwbExport
    @ComponentState.state()
    public accessor functions: Array<FunctionEntry> = [];

    /**
     * ID of the currently active function (passed to function list).
     */
    @PwbExport
    @ComponentState.state()
    public accessor activeFunctionId: string = '';

    /**
     * Event emitted when a node drag starts from the library.
     */
    @PwbComponentEvent('node-drag-start')
    private accessor mNodeDragStart!: ComponentEventEmitter<string>;

    /**
     * Event emitted when a function is selected.
     */
    @PwbComponentEvent('function-select')
    private accessor mFunctionSelect!: ComponentEventEmitter<string>;

    /**
     * Event emitted when a new function is requested.
     */
    @PwbComponentEvent('function-add')
    private accessor mFunctionAdd!: ComponentEventEmitter<void>;

    /**
     * Event emitted when a function deletion is requested.
     */
    @PwbComponentEvent('function-delete')
    private accessor mFunctionDelete!: ComponentEventEmitter<string>;

    @ComponentState.state()
    private accessor mActiveTabIndex: number = 0;

    /**
     * Get the active tab index.
     */
    public get activeTabIndex(): number {
        return this.mActiveTabIndex;
    }

    /**
     * Get the CSS class for a tab button based on active state.
     *
     * @param pIndex - Tab index.
     * @returns CSS class string.
     */
    public getTabClass(pIndex: number): string {
        return pIndex === this.mActiveTabIndex ? 'tab-button active' : 'tab-button';
    }

    /**
     * Handle tab button click.
     *
     * @param pIndex - Clicked tab index.
     */
    public onTabClick(pIndex: number): void {
        this.mActiveTabIndex = pIndex;
    }

    /**
     * Bubble the node-drag-start event from the node library.
     *
     * @param pEvent - Component event containing the node name.
     */
    public onNodeDragStart(pEvent: ComponentEvent<string>): void {
        this.mNodeDragStart.dispatchEvent(pEvent.value);
    }

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
     * @param _pEvent - Component event.
     */
    public onFunctionAdd(_pEvent: ComponentEvent<void>): void {
        this.mFunctionAdd.dispatchEvent(undefined as void);
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
 * Node definition entry passed through to the node library.
 */
interface NodeDefinitionEntry {
    name: string;
    category: string;
}

/**
 * Function entry passed through to the function list.
 */
interface FunctionEntry {
    id: string;
    name: string;
    label: string;
    system: boolean;
}
