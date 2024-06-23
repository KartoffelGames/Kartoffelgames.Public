import { CoreEntityUpdateZone } from '../../core/core_entity/core-entity-update-zone';
import { ComponentScopedValues } from '../../core/component/injection_reference/component-scoped-values';
import { ModuleKeyReference } from '../../core/injection-reference/module/module-key-reference';
import { ModuleTargetNode } from '../../core/module/injection_reference/module-target-node';
import { PwbAttributeModule } from '../../core/module/attribute_module/pwb-attribute-module.decorator';
import { AccessMode } from '../../enum/access-mode.enum';
import { UpdateTrigger } from '../../enum/update-trigger.enum';

/**
 * Used with "#IdChildName" like - #PasswordInput.
 */
@PwbAttributeModule({
    access: AccessMode.Write,
    selector: /^#[[\w$]+$/,
    trigger: UpdateTrigger.Default
})
export class PwbChildAttributeModule {
    /**
     * Constructor.
     * @param pTargetNode - Target element.
     * @param pUpdateZone - Component update zone.
     * @param pAttributeKey - Attribute key.
     * @param pComponentScopeValue - Root values of component.
     */
    public constructor(pTargetNode: ModuleTargetNode, pUpdateZone: CoreEntityUpdateZone, pAttributeKey: ModuleKeyReference, pComponentScopeValue: ComponentScopedValues) {
        const lTarget: Node = pTargetNode;
        const lRegistedElement: Node = pUpdateZone.registerObject(lTarget);

        // Add current html element to temporary root values. Delete starting #.
        pComponentScopeValue.setTemporaryValue(pAttributeKey.substring(1), lRegistedElement);
    }
}