import { ComponentEvent, ComponentEventEmitter, ComponentState, PwbComponent, PwbComponentEvent, PwbExport } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import type { PotatnoUiProject } from '../../potatno-node-definition-list.ts';
import templateCss from './potatno-panel-left.css' with { type: 'text' };
import panelLeftTemplate from './potatno-panel-left.html' with { type: 'text' };

// Import child components to ensure they are registered.
import '../potatno_function_list/potatno-function-list.ts';
import '../potatno_node_library/potatno-node-library.ts';

/**
 * Left panel component for the potatno-code visual editor.
 */
@PwbComponent({
    selector: 'potatno-panel-left',
    template: panelLeftTemplate,
    style: templateCss,
})
export class PotatnoPanelLeft {
    private mActiveFunction: PotatnoDocumentFunction<PotatnoUiProject> | null = null;

    /**
     * Function entries to display in the Functions tab.
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
     * Explicit refresh token for the node library.
     */
    @PwbExport
    @ComponentState.state()
    public accessor nodeLibraryRefreshVersion: number = 0;

    /**
     * Active tab index rendered by the panel.
     */
    @ComponentState.state()
    private accessor mActiveTabIndex: number = 0;

    /**
     * Refresh token incremented whenever the library tab is shown again.
     */
    @ComponentState.state()
    private accessor mLibraryShownRefreshVersion: number = 0;

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
     * Active function passed to the node library.
     */
    @PwbExport
    public set activeFunction(pValue: PotatnoDocumentFunction<PotatnoUiProject> | null) {
        if (this.mActiveFunction === pValue) {
            return;
        }

        this.mActiveFunction = pValue;
        this.mLibraryShownRefreshVersion++;
    }

    /**
     * Get the active function passed to the node library.
     */
    public get activeFunction(): PotatnoDocumentFunction<PotatnoUiProject> | null {
        return this.mActiveFunction;
    }

    /**
     * Get the active tab index.
     */
    public get activeTabIndex(): number {
        return this.mActiveTabIndex;
    }

    /**
     * Combined refresh token for the node library.
     */
    public get libraryRefreshVersion(): number {
        return this.nodeLibraryRefreshVersion + this.mLibraryShownRefreshVersion;
    }

    /**
     * Get the CSS class for a tab button based on active state.
     *
     * @param pIndex - Tab index.
     *
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
        const lWasLibraryHidden: boolean = this.mActiveTabIndex !== 0;
        this.mActiveTabIndex = pIndex;

        if (pIndex === 0 && lWasLibraryHidden) {
            this.mLibraryShownRefreshVersion++;
        }
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
