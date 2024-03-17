import { ElementCreator } from '../../component/element-creator';
import { PwbTemplateAttribute, PwbTemplateXmlNode } from '../../component/template/nodes/pwb-template-xml-node';
import { ModuleAttributeReference } from '../../injection_reference/module-attribute-reference';
import { ModuleTargetReference } from '../../injection_reference/module-target-reference';
import { PwbAttributeAttributeModule } from '../../module/decorator/pwb-static-attribute-module.decorator';
import { ModuleAccessType } from '../../module/enum/module-access-type';

@PwbAttributeAttributeModule({
    selector: /^\$[\w]+$/,
    forbiddenInManipulatorScopes: false,
    access: ModuleAccessType.Write
})
export class SlotAttributeModule {
    private readonly mAttributeReference: ModuleAttributeReference;
    private readonly mTargetReference: ModuleTargetReference;

    /**
     * Constructor.
     * @param pAttributeReference - Attribute of module.
     * @param pTargetReference - Target element.
     */
    public constructor(pAttributeReference: ModuleAttributeReference, pTargetReference: ModuleTargetReference) {
        this.mTargetReference = pTargetReference;
        this.mAttributeReference = pAttributeReference;

        // Get name of slot. Remove starting $.
        const lAttribute: PwbTemplateAttribute = this.mAttributeReference.value;
        const lSlotName: string = lAttribute.name.substring(1);

        // Create slot xml element.
        const lSlotXmlElement: PwbTemplateXmlNode = new PwbTemplateXmlNode();
        lSlotXmlElement.tagName = 'slot';

        // Create slot html element.
        const lSlotElement: Element = ElementCreator.createElement(lSlotXmlElement);

        // Set slot as default of name is $DEFAUKLT
        if (lSlotName !== 'DEFAULT') {
            lSlotElement.setAttribute('name', lSlotName);
        }

        // Add slot element to target. Gets append as first element.
        pTargetReference.value?.appendChild(lSlotElement);
    }
}