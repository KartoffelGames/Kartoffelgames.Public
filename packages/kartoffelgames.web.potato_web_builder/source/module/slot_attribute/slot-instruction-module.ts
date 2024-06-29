import { PwbTemplate } from '../../core/component/template/nodes/pwb-template';
import { PwbTemplateXmlNode } from '../../core/component/template/nodes/pwb-template-xml-node';
import { ModuleExpression } from '../../core/module/injection_reference/module-expression';
import { IInstructionOnUpdate } from '../../core/module/instruction_module/instruction-module';
import { PwbInstructionModule } from '../../core/module/instruction_module/pwb-instruction-module.decorator';
import { InstructionResult } from '../../core/module/instruction_module/instruction-result';
import { ModuleValues } from '../../core/module/module-values';
import { UpdateTrigger } from '../../core/enum/update-trigger.enum';

@PwbInstructionModule({
    instructionType: 'slot',
    trigger: UpdateTrigger.Any,
})
export class SlotInstructionModule implements IInstructionOnUpdate {
    private readonly mModuleValues: ModuleValues;
    private readonly mSlotName: string;

    /**
     * Constructor.
     * @param pTemplate - Target templat.
     * @param pModuleValues - Values of modules.
     * @param pModuleExpression - Expression of module.
     */
    public constructor(pModuleValues: ModuleValues, pModuleExpression: ModuleExpression) {
        this.mModuleValues = pModuleValues;
        this.mSlotName = pModuleExpression.value;
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
        lModuleResult.addElement(lTemplate, this.mModuleValues.scopedValues);

        return lModuleResult;
    }
}