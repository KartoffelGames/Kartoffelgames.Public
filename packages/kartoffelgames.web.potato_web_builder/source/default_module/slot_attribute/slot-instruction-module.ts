import { PwbTemplate } from '../../core/component/template/nodes/pwb-template';
import { PwbTemplateXmlNode } from '../../core/component/template/nodes/pwb-template-xml-node';
import { LayerValues } from '../../core/component/values/layer-values';
import { ModuleLayerValuesReference } from '../../core/injection-reference/module/module-layer-values-reference';
import { ModuleValueReference } from '../../core/injection-reference/module/module-value-reference';
import { IInstructionOnUpdate } from '../../core/module/instruction_module/instruction-module';
import { PwbInstructionModule } from '../../core/module/instruction_module/pwb-instruction-module.decorator';
import { InstructionResult } from '../../core/module/instruction_module/result/instruction-result';
import { UpdateTrigger } from '../../enum/update-trigger.enum';

@PwbInstructionModule({
    instructionType: 'slot',
    trigger: UpdateTrigger.Default,
})
export class SlotInstructionModule implements IInstructionOnUpdate {
    private readonly mLayerValues: LayerValues;
    private readonly mSlotName: string;

    /**
     * Constructor.
     * @param pTemplate - Target templat.
     * @param pLayerValues - Values of component.
     * @param pAttributeReference - Attribute of module.
     */
    public constructor(pLayerValues: ModuleLayerValuesReference, pAttributeValue: ModuleValueReference) {
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
        if (this.mSlotName !== '') {
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