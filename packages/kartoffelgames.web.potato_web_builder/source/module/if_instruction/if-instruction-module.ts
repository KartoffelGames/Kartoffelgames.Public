import { PwbTemplate } from '../../core/component/template/nodes/pwb-template.ts';
import { PwbTemplateInstructionNode } from '../../core/component/template/nodes/pwb-template-instruction-node.ts';
import { Processor } from '../../core/core_entity/processor.ts';
import { UpdateTrigger } from '../../core/enum/update-trigger.enum.ts';
import { ModuleExpression } from '../../core/module/injection_reference/module-expression.ts';
import { ModuleTemplate } from '../../core/module/injection_reference/module-template.ts';
import { IInstructionOnUpdate } from '../../core/module/instruction_module/instruction-module.ts';
import { InstructionResult } from '../../core/module/instruction_module/instruction-result.ts';
import { PwbInstructionModule } from '../../core/module/instruction_module/pwb-instruction-module.decorator.ts';
import { LevelProcedure } from '../../core/data/level-procedure.ts';
import { ModuleDataLevel } from '../../core/data/module-data-level.ts';
import { DataLevel } from '../../core/data/data-level.ts';

/**
 * If expression.
 * If the executed result of the attribute value is false, the element will not be append to view.
 */
@PwbInstructionModule({
    instructionType: 'if',
    trigger: UpdateTrigger.Any & ~UpdateTrigger.UntrackableFunctionCall
})
export class IfInstructionModule extends Processor implements IInstructionOnUpdate {
    private mLastBoolean: boolean;
    private readonly mModuleValues: ModuleDataLevel;
    private readonly mProcedure: LevelProcedure<any>;
    private readonly mTemplateReference: PwbTemplateInstructionNode;

    /**
     * Constructor.
     * @param pTemplate - Target templat.
     * @param pModuleData - Data of module.
     * @param pModuleExpression - Expression of instruction module.
     */
    public constructor(pTemplate: ModuleTemplate, pModuleData: ModuleDataLevel, pModuleExpression: ModuleExpression) {
        super();
        
        this.mTemplateReference = <PwbTemplateInstructionNode>pTemplate;
        this.mModuleValues = pModuleData;
        this.mProcedure = this.mModuleValues.createExpressionProcedure(pModuleExpression.value);
        this.mLastBoolean = false;
    }

    /**
     * Decide if module / element should be updated.
     * @returns if element of module should be updated.
     */
    public onUpdate(): InstructionResult | null {
        const lExecutionResult: any = this.mProcedure.execute();

        if (!!lExecutionResult !== this.mLastBoolean) {
            this.mLastBoolean = !!lExecutionResult;

            // If in any way the execution result is true, add template to result.
            const lModuleResult: InstructionResult = new InstructionResult();
            if (lExecutionResult) {
                const lTemplate: PwbTemplate = new PwbTemplate();
                lTemplate.appendChild(...this.mTemplateReference.childList);

                lModuleResult.addElement(lTemplate, new DataLevel(this.mModuleValues.data));
            }

            return lModuleResult;
        } else {
            // No update needed.
            return null;
        }
    }
}