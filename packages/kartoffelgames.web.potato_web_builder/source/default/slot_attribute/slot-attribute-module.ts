import { ElementCreator } from '../../component/element-creator';
import { PwbTemplateAttribute, PwbTemplateXmlNode } from '../../component/template/nodes/pwb-template-xml-node';
import { ModuleAttributeReference } from '../../injection_reference/module-attribute-reference';
import { ModuleTargetNode } from '../../injection_reference/module/module-target-node-reference';
import { PwbAttributeModule } from '../../decorator/pwb-attribute-module.decorator';
import { AccessMode } from '../../enum/module-access-mode.enum';

@PwbAttributeModule({
    selector: /^\$[\w]+$/,
    forbiddenInManipulatorScopes: false,
    access: AccessMode.Write
})
export class SlotAttributeModule {
    private readonly mAttributeReference: ModuleAttributeReference;
    private readonly mTargetReference: ModuleTargetNode;

    /**
     * Constructor.
     * @param pAttributeReference - Attribute of module.
     * @param pTargetReference - Target element.
     */
    public constructor(pAttributeReference: ModuleAttributeReference, pTargetReference: ModuleTargetNode) {
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