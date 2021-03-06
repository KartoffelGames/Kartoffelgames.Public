import { XmlAttribute, XmlElement } from '@kartoffelgames/core.xml';
import { LayerValues } from '../../component/values/layer-values';
import { PwbMultiplicatorAttributeModule } from '../../module/decorator/pwb-multiplicator-attribute-module.decorator';
import { IPwbMultiplicatorModuleOnUpdate } from '../../module/interface/module';
import { ModuleAttributeReference } from '../../injection_reference/module-attribute-reference';
import { ModuleLayerValuesReference } from '../../injection_reference/module-layer-values-reference';
import { ModuleTemplateReference } from '../../injection_reference/module-template-reference';
import { MultiplicatorResult } from '../../module/result/multiplicator-result';

@PwbMultiplicatorAttributeModule({
    selector: /^\$[\w]+$/
})
export class SlotAttributeModule implements IPwbMultiplicatorModuleOnUpdate {
    private readonly mAttributeReference: ModuleAttributeReference;
    private mCalled: boolean;
    private readonly mTemplateReference: ModuleTemplateReference;
    private readonly mValueHandler: LayerValues;

    /**
     * Constructor.
     * @param pTargetTemplate - Target templat.
     * @param pValueHandler - Values of component.
     * @param pAttribute - Attribute of module.
     */
    public constructor(pValueReference: ModuleLayerValuesReference, pAttributeReference: ModuleAttributeReference, pTemplateReference: ModuleTemplateReference) {
        this.mTemplateReference = pTemplateReference;
        this.mValueHandler = pValueReference.value;
        this.mAttributeReference = pAttributeReference;
        this.mCalled = false;
    }

    /**
     * Process module.
     */
    public onUpdate(): MultiplicatorResult | null {
        // Skip update if slot is already set.
        if (!this.mCalled) {
            this.mCalled = true;
            return null;
        }

        // Get name of slot. Remove starting $.
        const lAttribute: XmlAttribute = <XmlAttribute>this.mAttributeReference.value;
        const lSlotName: string = lAttribute.name.substring(1);

        // Clone currrent template element.
        const lClone: XmlElement = <XmlElement>this.mTemplateReference.value.clone();

        // Create slot element
        const lSlotElement: XmlElement = new XmlElement();
        lSlotElement.tagName = 'slot';

        // Set slot as default of name is $DEFAUKLT
        if (lSlotName !== 'DEFAULT') {
            lSlotElement.setAttribute('name', lSlotName);
        }

        // Add slot to element.
        lClone.appendChild(lSlotElement);

        // Create result.
        const lResult: MultiplicatorResult = new MultiplicatorResult();
        lResult.addElement(lClone, new LayerValues(this.mValueHandler));

        return lResult;
    }
}