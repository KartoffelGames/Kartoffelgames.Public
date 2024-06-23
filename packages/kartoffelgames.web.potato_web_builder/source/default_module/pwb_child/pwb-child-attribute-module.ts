import { ComponentUpdateHandlerReference } from '../../core/injection-reference/component/component-update-handler-reference';
import { ComponentValuesReference } from '../../core/injection-reference/component/component-values-reference';
import { ModuleKeyReference } from '../../core/injection-reference/module/module-key-reference';
import { ModuleTargetNodeReference } from '../../core/injection-reference/module/module-target-node-reference';
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
     * @param pTargetReference - Target element.
     * @param pUpdateHandler - Component update handler.
     * @param pAttributeKey - Attribute key.
     * @param pComponentScopeValue - Root values of component.
     */
    public constructor(pTargetReference: ModuleTargetNodeReference, pUpdateHandler: ComponentUpdateHandlerReference, pAttributeKey: ModuleKeyReference, pComponentScopeValue: ComponentValuesReference) {
        const lTarget: Node = pTargetReference;
        const lRegistedElement: Node = pUpdateHandler.registerObject(lTarget);

        // Add current html element to temporary root values. Delete starting #.
        pComponentScopeValue.setTemporaryValue(pAttributeKey.substring(1), lRegistedElement);
    }
}