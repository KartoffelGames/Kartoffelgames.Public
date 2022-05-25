import { XmlAttribute, XmlElement } from '@kartoffelgames/core.xml';
import { ElementCreator } from '../../component/content/element-creator';
import { ModuleAttributeReference } from '../../injection_reference/module-attribute-reference';
import { ModuleTargetReference } from '../../injection_reference/module-target-reference';
import { PwbStaticAttributeModule } from '../../module/decorator/pwb-static-attribute-module.decorator';
import { ModuleAccessType } from '../../module/enum/module-access-type';

@PwbStaticAttributeModule({
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
        const lAttribute: XmlAttribute = <XmlAttribute>this.mAttributeReference.value;
        const lSlotName: string = lAttribute.name.substring(1);

        // Create slot xml element.
        const lSlotXmlElement: XmlElement = new XmlElement();
        lSlotXmlElement.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
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