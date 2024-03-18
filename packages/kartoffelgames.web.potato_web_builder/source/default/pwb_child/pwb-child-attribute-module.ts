import { ComponentManagerReference } from '../../injection_reference/general/component-manager-reference';
import { ModuleAttributeReference } from '../../injection_reference/module-attribute-reference';
import { ModuleLayerValuesReference } from '../../injection_reference/module/module-layer-values-reference';
import { ModuleTargetNode } from '../../injection_reference/module-target-node-reference';
import { PwbAttributeModule } from '../../decorator/pwb-attribute-module.decorator';
import { ModuleAccessMode } from '../../enum/module-access-mode.enum';

/**
 * Used with "#IdChildName" like - #PasswordInput.
 */
@PwbAttributeModule({
    selector: /^#[[\w$]+$/,
    access: ModuleAccessMode.Write,
    forbiddenInManipulatorScopes: true
})
export class PwbChildAttributeModule {
    /**
     * Constructor.
     * @param pTargetReference - Target element.
     * @param pLayerValues - Values of component.
     * @param pAttributeReference - Attribute of module.
     */
    public constructor(pTargetReference: ModuleTargetNode, pValueReference: ModuleLayerValuesReference, pAttributeReference: ModuleAttributeReference, pComponentManager: ComponentManagerReference) {
        const lTarget: Node = <Node>pTargetReference.value;
        const lRegistedElement: Node = pComponentManager.value.updateHandler.registerObject(lTarget);

        // Add current html element to temporary root values. Delete starting #.
        pValueReference.value.setRootValue(pAttributeReference.value.name.substring(1), lRegistedElement);
    }
}