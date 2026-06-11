import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Component, ComponentState, PwbComponent, type IComponentOnConnect, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocument } from '../../../document/potatno-document.ts';
import { PotatnoUiManager, PotatnoCodeUiManagerChangeType, PotatnoProjectTypesDefinition } from '../../manager/potatno-ui-manager.ts';
import templateCss from './potatno-function-list.css' with { type: 'text' };
import functionListTemplate from './potatno-function-list.html' with { type: 'text' };

/**
 * Function list component for the potatno-code visual editor.
 *
 * Reads the function set and active selection straight from the shared {@link PotatnoUiManager}
 * and routes selection, creation and deletion back through it. Only the type-selection popup is local
 * state. The component self-updates on the manager's function events.
 */
@PwbComponent({
    selector: 'potatno-function-list',
    template: functionListTemplate,
    style: templateCss,
})
export class PotatnoFunctionList implements IComponentOnConnect, IComponentOnDeconstruct {
    private readonly mComponent: Component;
    private readonly mManager: PotatnoUiManager;
    private mUnsubscribe: (() => void) | null;

    /**
     * Whether the function type selection popup is currently visible.
     */
    @ComponentState.state()
    private accessor mShowPopup: boolean = false;

    /**
     * Id of the currently active function.
     */
    public get activeFunctionId(): string {
        return this.mManager.activeFunctionId;
    }

    /**
     * Function entries to display.
     */
    public get functions(): Array<PotatnoFunctionListEntry> {
        const lDocument: PotatnoDocument<PotatnoProjectTypesDefinition> | null = this.mManager.graph.document;
        if (!lDocument) {
            return [];
        }

        const lFunctionList: Array<PotatnoFunctionListEntry> = [];
        for (const lFunction of lDocument.functions) {
            lFunctionList.push({ id: lFunction.id, label: lFunction.label, name: lFunction.label, system: lFunction.isSystem });
        }

        return lFunctionList;
    }

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
     * User function definitions available for creation.
     */
    public get userFunctionDefinitions(): Array<PotatnoFunctionListUserFunctionEntry> {
        const lProject: PotatnoProjectTypesDefinition | null = this.mManager.project;
        if (!lProject) {
            return [];
        }

        return [...lProject.userFunctions.values()].map((pDefinition) => ({ id: pDefinition.id }));
    }

    /**
     * Create the function list component.
     *
     * @param pComponent - Injected component reference, used to trigger self-updates.
     * @param pManager - Injected shared UI manager singleton.
     */
    public constructor(pComponent: Component = Injection.use(Component), pManager: PotatnoUiManager = Injection.use(PotatnoUiManager)) {
        this.mComponent = pComponent;
        this.mManager = pManager;
        this.mUnsubscribe = null;
    }

    /**
     * Close the popup.
     */
    public closePopup(): void {
        this.mShowPopup = false;
    }

    /**
     * Get the CSS class for a function entry based on active state.
     *
     * @param pId - Function id.
     *
     * @returns CSS class string.
     */
    public getEntryClass(pId: string): string {
        return pId === this.activeFunctionId ? 'function-entry active' : 'function-entry';
    }

    /**
     * Subscribe to manager function events.
     */
    public onConnect(): void {
        this.mUnsubscribe = this.mManager.subscribe(
            PotatnoCodeUiManagerChangeType.Document | PotatnoCodeUiManagerChangeType.Function | PotatnoCodeUiManagerChangeType.ActiveFunction,
            null,
            () => {
                this.mComponent.updater.update();
            });
    }

    /**
     * Detach the manager subscription.
     */
    public onDeconstruct(): void {
        this.mUnsubscribe?.();
        this.mUnsubscribe = null;
    }

    /**
     * Handle add function button click. Adds directly when only one definition exists, otherwise
     * opens the selection popup.
     */
    public onAddButtonClick(): void {
        const lDefinitions: Array<PotatnoFunctionListUserFunctionEntry> = this.userFunctionDefinitions;
        if (lDefinitions.length === 1) {
            this.mManager.graph.addFunction(lDefinitions[0].id);
        } else {
            this.mShowPopup = !this.mShowPopup;
        }
    }

    /**
     * Handle selecting a function definition from the popup.
     *
     * @param pDefinitionId - The selected definition id.
     */
    public onDefinitionSelect(pDefinitionId: string): void {
        this.mShowPopup = false;
        this.mManager.graph.addFunction(pDefinitionId);
    }

    /**
     * Handle delete button click on a function entry.
     *
     * @param pEvent - The click event.
     * @param pId - The function id to delete.
     */
    public onFunctionDelete(pEvent: MouseEvent, pId: string): void {
        pEvent.stopPropagation();
        this.mManager.graph.removeFunction(pId);
    }

    /**
     * Handle function entry click to select it.
     *
     * @param pId - The function id to select.
     */
    public onFunctionSelect(pId: string): void {
        this.mManager.setActiveFunction(pId);
    }
}

/**
 * A function entry for the function list.
 */
type PotatnoFunctionListEntry = {
    id: string;
    label: string;
    name: string;
    system: boolean;
};

/**
 * A user function definition entry for the function-add popup.
 */
type PotatnoFunctionListUserFunctionEntry = {
    id: string;
};
