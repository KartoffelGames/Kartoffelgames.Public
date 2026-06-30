import { Injection } from '@kartoffelgames/core-dependency-injection';
import { ComponentDataLevel } from '../../core/data/component-data-level.ts';
import { AccessMode } from '../../core/enum/access-mode.enum.ts';
import { PwbAttributeModule } from '../../core/module/attribute_module/pwb-attribute-module.decorator.ts';
import { ModuleAttribute } from '../../core/module/injection_reference/module-attribute.ts';
import { ModuleTargetNode } from '../../core/module/injection_reference/module-target-node.ts';
import type { IAttributeOnDeconstruct } from '../../core/module/attribute_module/attribute-module.ts';

/**
 * Used with "#IdChildName" like - #PasswordInput.
 */
@PwbAttributeModule({
    access: AccessMode.Write,
    selector: /^#[[\w$]+$/
})
export class PwbChildAttributeModule implements IAttributeOnDeconstruct {
    private readonly mChildName: string;
    private readonly mComponentScopeValue: ComponentDataLevel;
    private readonly mTargetNode: Node;

    /**
     * Constructor.
     *
     * @param pTargetNode - Target element.
     * @param pModuleAttribute - Module attribute.
     * @param pComponentScopeValue - Root values of component.
     */
    public constructor(pTargetNode: ModuleTargetNode = Injection.use(ModuleTargetNode), pModuleAttribute: ModuleAttribute = Injection.use(ModuleAttribute), pComponentScopeValue: ComponentDataLevel = Injection.use(ComponentDataLevel)) {
        this.mChildName = pModuleAttribute.name.substring(1);
        this.mComponentScopeValue = pComponentScopeValue;
        this.mTargetNode = pTargetNode;

        // Add current html element to temporary root values. Delete starting #.
        this.mComponentScopeValue.setTemporaryValue(this.mChildName, this.mTargetNode);
    }

    /**
     * Remove child reference from component values.
     */
    public onDeconstruct(): void {
        // Remove only the value owned by this module.
        if (this.mComponentScopeValue.data.store[this.mChildName] === this.mTargetNode) {
            this.mComponentScopeValue.data.deleteTemporaryValue(this.mChildName);
        }
    }
}
