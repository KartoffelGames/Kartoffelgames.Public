import { AccessMode, IAttributeOnDeconstruct, IAttributeOnUpdate, LevelProcedure, ModuleAttribute, ModuleDataLevel, ModuleTargetNode, PwbAttributeModule } from "@kartoffelgames/web-potato-web-builder";
import { Injection } from "@kartoffelgames/core-dependency-injection";
import { PotatnoPreviewDriver } from "../../preview/potatno-preview-driver.ts";
import { PotatnoUiProject } from "../potatno-ui-project.ts";

/**
 * Attribute module that automaticly displays the preview drivers preview element as the sole child element.
 */
@PwbAttributeModule({
    access: AccessMode.Read,
    selector: /^potatno-preview$/
})
export class PotatnoPreviewModule implements IAttributeOnUpdate {
    private readonly mTarget: Element;
    private readonly mProcedure: LevelProcedure<PotatnoPreviewDriver<PotatnoUiProject, Element, Readonly<Record<string, unknown>>, unknown>>;

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

        // Read the previre driver element.
        const lPreviewElement: Element = lPreviewDriver.element;

        // Preview element is already added.
        if(this.mTarget.contains(lPreviewElement)){
            return false;
        }

        // Clear and append preview element.
        this.mTarget.innerHTML = '';
        this.mTarget.appendChild(lPreviewElement);

        return true;
    }
}