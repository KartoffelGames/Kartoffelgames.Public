import { Injection } from '@kartoffelgames/core-dependency-injection';
import { KgPopupComponent, KgResizeBoxComponent } from '@kartoffelgames/web-components';
import { ComponentState, PwbComponent, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import type { PotatnoFunctionDefinition } from '../../../project/potatno-function-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager, type PotatnoCodeUiManagerUnsubscribe } from '../../manager/potatno-ui-manager.ts';
import templateCss from './potatno-function-list-component.css' with { type: 'text' };
import functionListTemplate from './potatno-function-list-component.html' with { type: 'text' };

/**
 * Function list component for the potatno-code visual editor.
 */
@PwbComponent({
    selector: 'potatno-function-list',
    template: functionListTemplate,
    style: templateCss,
    components: [KgResizeBoxComponent, KgPopupComponent]
})
export class PotatnoFunctionListComponent implements IComponentOnDeconstruct {
    private readonly mManager: PotatnoUiManager;
    private readonly mUnsubscribe: PotatnoCodeUiManagerUnsubscribe;

    /**
     * Function entries to display.
     */
    @ComponentState.state({ complexValue: true })
    public accessor documentFunctions: Array<PotatnoFunctionListComponentEntry>;

    /**
     * Whether the function type selection popup is currently visible.
     */
    @ComponentState.state()
    public accessor showPopup: boolean;

    /**
     * Id of the currently active function.
     */
    public get activeFunctionId(): string {
        return this.mManager.activeFunction.id;
    }

    /**
     * User function definitions available for creation.
     */
    public get userFunctionDefinitions(): Array<PotatnoFunctionDefinition<PotatnoProjectTypesDefinition>> {
        return [...this.mManager.project.userFunctions.values()];
    }

    /**
     * Create the function list component.
     *
     * @param pManager - Injected shared UI manager singleton.
     */
    public constructor(pManager: PotatnoUiManager = Injection.use(PotatnoUiManager)) {
        this.mManager = pManager;

        // Define empty default values for states.
        this.documentFunctions = new Array<PotatnoFunctionListComponentEntry>();
        this.showPopup = false;

        // subscribe to any document or function changes to renew the current document function list.
        this.mUnsubscribe = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.Document | PotatnoCodeUiManagerChangeType.Function | PotatnoCodeUiManagerChangeType.SpecialActiveFunction, () => {
            this.documentFunctions = this.mManager.graph.document.functions.map((pFunction) => {
                return {
                    id: pFunction.id,
                    label: pFunction.label,
                    isSystem: pFunction.isSystem,
                    function: pFunction
                };
            });
        });
    }

    /**
     * Create a function by its definition id.
     *
     * @param pDefinition - The selected function definition.
     */
    public createFunction(pDefinition: PotatnoFunctionDefinition<PotatnoProjectTypesDefinition>): void {
        // Close popup.
        this.showPopup = false;

        // Add function.
        this.mManager.graph.addFunction(pDefinition.id);
    }

    /**
     * Globaly delete a user function.
     *
     * @param pFunctionListItem - The function to delete.
     */
    public deleteFunction(pFunctionListItem: PotatnoFunctionListComponentEntry): void {
        this.mManager.graph.removeFunction(pFunctionListItem.id);
    }

    /**
     * Detach the manager subscription.
     */
    public onDeconstruct(): void {
        this.mUnsubscribe();
    }

    /**
     * Globaly select a function.
     *
     * @param pFunctionListItem - The function to select.
     */
    public selectFunction(pFunctionListItem: PotatnoFunctionListComponentEntry): void {
        this.mManager.setActiveFunction(pFunctionListItem.function);
    }
}

/**
 * A function entry for the function list.
 */
type PotatnoFunctionListComponentEntry = {
    id: string;
    label: string;
    isSystem: boolean;
    function: PotatnoDocumentFunction<PotatnoProjectTypesDefinition>;
};