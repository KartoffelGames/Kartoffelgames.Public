import { PwbTemplate } from '../../core/component/template/nodes/pwb-template.ts';
import { PwbTemplateXmlNode } from '../../core/component/template/nodes/pwb-template-xml-node.ts';
import type { ModuleExpression } from '../../core/module/injection_reference/module-expression.ts';
import type { IInstructionOnUpdate } from '../../core/module/instruction_module/instruction-module.ts';
import { PwbInstructionModule } from '../../core/module/instruction_module/pwb-instruction-module.decorator.ts';
import { InstructionResult } from '../../core/module/instruction_module/instruction-result.ts';
import type { ModuleDataLevel } from '../../core/data/module-data-level.ts';
import { UpdateTrigger } from '../../core/enum/update-trigger.enum.ts';
import { Processor } from '../../core/core_entity/processor.ts';

@PwbInstructionModule({
    instructionType: 'slot',
    trigger: UpdateTrigger.None,
})
export class SlotInstructionModule extends Processor implements IInstructionOnUpdate {
    private mIsSetup: boolean;
    private readonly mModuleValues: ModuleDataLevel;
    private readonly mSlotName: string;

    /**
     * Constructor.
     * @param pTemplate - Target templat.
     * @param pModuleValues - Values of modules.
     * @param pModuleExpression - Expression of module.
     */
    public constructor(pModuleValues: ModuleDataLevel, pModuleExpression: ModuleExpression) {
        super();

        this.mModuleValues = pModuleValues;
        this.mSlotName = pModuleExpression.value;
        this.mIsSetup = false;
    }

    /**
     * Decide if module / element should be updated.
     * @returns if element of module should be updated.
     */
    public onUpdate(): InstructionResult | null {
        // Nothing can change in slots after initial update.
        if (this.mIsSetup) {
            return null;
        }

        // Lock any "updates".
        this.mIsSetup = true;

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
        lModuleResult.addElement(lTemplate, this.mModuleValues.data);

        return lModuleResult;
    }
}