import { CoreEntityUpdateZone } from '../../core/core_entity/core-entity-update-zone';
import { ComponentScopedValues } from '../../core/component/injection_reference/component-scoped-values';
import { ModuleTargetNode } from '../../core/module/injection_reference/module-target-node';
import { PwbAttributeModule } from '../../core/module/attribute_module/pwb-attribute-module.decorator';
import { AccessMode } from '../../core/enum/access-mode.enum';
import { ModuleAttribute } from '../../core/module/injection_reference/module-attribute';
import { ComponentInteractionType } from '../../core/component/interaction-tracker/component-processor-proxy';

/**
 * Used with "#IdChildName" like - #PasswordInput.
 */
@PwbAttributeModule({
    access: AccessMode.Write,
    selector: /^#[[\w$]+$/,
    trigger: ComponentInteractionType.Any
})
export class PwbChildAttributeModule {
    /**
     * Constructor.
     * @param pTargetNode - Target element.
     * @param pUpdateZone - Component update zone.
     * @param pModuleAttribute - Module attribute.
     * @param pComponentScopeValue - Root values of component.
     */
    public constructor(pTargetNode: ModuleTargetNode, pUpdateZone: CoreEntityUpdateZone, pModuleAttribute: ModuleAttribute, pComponentScopeValue: ComponentScopedValues) {
        const lTarget: Node = pTargetNode;
        const lRegistedElement: Node = pUpdateZone.registerObject(lTarget);

        // Add current html element to temporary root values. Delete starting #.
        pComponentScopeValue.setTemporaryValue(pModuleAttribute.name.substring(1), lRegistedElement);
    }
}