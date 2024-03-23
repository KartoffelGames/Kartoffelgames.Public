import { ComponentLayerValuesReference } from '../../injection_reference/component/component-layer-values-reference';
import { ModuleTargetNodeReference } from '../../injection_reference/module/module-target-node-reference';
import { PwbAttributeModule } from '../../decorator/pwb-attribute-module.decorator';
import { AccessMode } from '../../enum/access-mode.enum';
import { ModuleKeyReference } from '../../injection_reference/module/module-key-reference';
import { ComponentUpdateHandlerReference } from '../../injection_reference/component/component-update-handler-reference';

/**
 * Used with "#IdChildName" like - #PasswordInput.
 */
@PwbAttributeModule({
    selector: /^#[[\w$]+$/,
    access: AccessMode.Write
})
export class PwbChildAttributeModule {
    /**
     * Constructor.
     * @param pTargetReference - Target element.
     * @param pUpdateHandler - Component update handler.
     * @param pAttributeKey - Attribute key.
     * @param pComponentLayerValue - Root values of component.
     */
    public constructor(pTargetReference: ModuleTargetNodeReference, pUpdateHandler: ComponentUpdateHandlerReference, pAttributeKey: ModuleKeyReference, pComponentLayerValue: ComponentLayerValuesReference) {
        const lTarget: Node = pTargetReference;
        const lRegistedElement: Node = pUpdateHandler.registerObject(lTarget);

        // Add current html element to temporary root values. Delete starting #.
        pComponentLayerValue.setRootValue(pAttributeKey.substring(1), lRegistedElement);
    }
}