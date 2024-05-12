import { PwbAttributeModule } from '../../decorator/pwb-attribute-module.decorator';
import { AccessMode } from '../../enum/access-mode.enum';
import { ComponentLayerValuesReference } from '../../injection/references/component/component-layer-values-reference';
import { ComponentUpdateHandlerReference } from '../../injection/references/component/component-update-handler-reference';
import { ModuleKeyReference } from '../../injection/references/module/module-key-reference';
import { ModuleTargetNodeReference } from '../../injection/references/module/module-target-node-reference';

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
        pComponentLayerValue.setLayerValue(pAttributeKey.substring(1), lRegistedElement);
    }
}