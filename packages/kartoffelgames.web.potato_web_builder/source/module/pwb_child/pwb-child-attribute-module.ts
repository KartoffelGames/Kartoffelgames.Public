import { ComponentScopedValues } from '../../core/data/component-scoped-values';
import { Processor } from '../../core/core_entity/processor';
import { AccessMode } from '../../core/enum/access-mode.enum';
import { UpdateTrigger } from '../../core/enum/update-trigger.enum';
import { AttributeModule } from '../../core/module/attribute_module/attribute-module';
import { PwbAttributeModule } from '../../core/module/attribute_module/pwb-attribute-module.decorator';
import { ModuleAttribute } from '../../core/module/injection_reference/module-attribute';
import { ModuleTargetNode } from '../../core/module/injection_reference/module-target-node';

/**
 * Used with "#IdChildName" like - #PasswordInput.
 */
@PwbAttributeModule({
    access: AccessMode.Write,
    selector: /^#[[\w$]+$/,
    trigger: UpdateTrigger.Any
})
export class PwbChildAttributeModule extends Processor {
    /**
     * Constructor.
     * @param pTargetNode - Target element.
     * @param pAttributeModule - Attribute module.
     * @param pModuleAttribute - Module attribute.
     * @param pComponentScopeValue - Root values of component.
     */
    public constructor(pTargetNode: ModuleTargetNode, pAttributeModule: AttributeModule, pModuleAttribute: ModuleAttribute, pComponentScopeValue: ComponentScopedValues) {
        super();

        const lTarget: Node = pTargetNode;
        const lRegistedElement: Node = pAttributeModule.registerObject(lTarget);

        // Add current html element to temporary root values. Delete starting #.
        pComponentScopeValue.setTemporaryValue(pModuleAttribute.name.substring(1), lRegistedElement);
    }
}