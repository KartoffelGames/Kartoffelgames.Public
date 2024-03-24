import { PwbTemplate } from '../../component/template/nodes/pwb-template';
import { PwbTemplateXmlNode } from '../../component/template/nodes/pwb-template-xml-node';
import { LayerValues } from '../../component/values/layer-values';
import { PwbInstructionModule } from '../../decorator/pwb-instruction-module.decorator';
import { ComponentLayerValuesReference } from '../../injection_reference/component/component-layer-values-reference';
import { ModuleValueReference } from '../../injection_reference/module/module-value-reference';
import { InstructionResult } from '../../module/result/instruction-result';

@PwbInstructionModule({
    instructionType: 'slot'
})
export class SlotAttributeModule {
    private readonly mLayerValues: LayerValues;
    private readonly mSlotName: string;

    /**
     * Constructor.
     * @param pTemplate - Target templat.
     * @param pLayerValues - Values of component.
     * @param pAttributeReference - Attribute of module.
     */
    public constructor(pLayerValues: ComponentLayerValuesReference, pAttributeValue: ModuleValueReference) {
        this.mLayerValues = pLayerValues;
        this.mSlotName = pAttributeValue.toString();
    }

    /**
     * Decide if module / element should be updated.
     * @returns if element of module should be updated.
     */
    public onUpdate(): InstructionResult | null {
        // Create slot xml element.
        const lSlotXmlElement: PwbTemplateXmlNode = new PwbTemplateXmlNode();
        lSlotXmlElement.tagName = 'slot';

        // Set slot as default of name is $DEFAUKLT
        if (this.mSlotName !== 'DEFAULT') {
            lSlotXmlElement.setAttribute('name').addValue(this.mSlotName);
        }

        // Create template.
        const lTemplate: PwbTemplate = new PwbTemplate();
        lTemplate.appendChild(lSlotXmlElement);

        // Create result and add slot template.
        const lModuleResult: InstructionResult = new InstructionResult();
        lModuleResult.addElement(lTemplate, this.mLayerValues);

        return lModuleResult;
    }
}