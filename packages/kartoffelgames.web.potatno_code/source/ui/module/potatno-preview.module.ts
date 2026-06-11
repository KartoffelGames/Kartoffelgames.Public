import { Injection } from "@kartoffelgames/core-dependency-injection";
import { AccessMode, IAttributeOnUpdate, LevelProcedure, ModuleAttribute, ModuleDataLevel, ModuleTargetNode, PwbAttributeModule } from "@kartoffelgames/web-potato-web-builder";
import type { PotatnoPreviewDriver } from '../../preview/potatno-preview-driver.ts';
import type { PotatnoProjectTypesDefinition } from '../manager/potatno-ui-manager.ts';

/**
 * Attribute module that automaticly displays the preview drivers preview element as the sole child element.
 */
@PwbAttributeModule({
    access: AccessMode.Read,
    selector: /^potatno-preview$/
})
export class PotatnoPreviewModule implements IAttributeOnUpdate {
    private readonly mProcedure: LevelProcedure<PotatnoPreviewDriver<PotatnoProjectTypesDefinition> | null>;
    private readonly mTarget: Element;

    /**
     * Constructor.
     * 
     * @param pTarget - Modules target element.
     * @param pModuleData - Current module data.
     * @param pAttribute - Target attribute.
     */
    public constructor(pTarget = Injection.use(ModuleTargetNode), pModuleData = Injection.use(ModuleDataLevel), pAttribute = Injection.use(ModuleAttribute)) {
        this.mTarget = pTarget as Element;
        this.mProcedure = pModuleData.createExpressionProcedure(pAttribute.value);
    }

    /**
     * On update check if the preview element is already append.
     * If it is not, append it.
     * 
     * @returns true when the preview element was updated/added, otherwise false.
     */
    public onUpdate(): boolean {
        const lPreviewDriver = this.mProcedure.execute();

        // No driver to display: clear any previously appended element.
        if (!lPreviewDriver) {
            // Check for existing elements before removing.
            const lContainsElement: boolean = this.mTarget.childNodes.length > 0;
            if(lContainsElement){
                this.mTarget.innerHTML = '';
            }

            return lContainsElement;
        }

        // Read the preview driver element.
        const lPreviewElement: Element = lPreviewDriver.element;

        // Preview element is already added.
        if (this.mTarget.contains(lPreviewElement)) {
            return false;
        }

        // Clear and append preview element.
        this.mTarget.innerHTML = '';
        this.mTarget.appendChild(lPreviewElement);

        return true;
    }
}