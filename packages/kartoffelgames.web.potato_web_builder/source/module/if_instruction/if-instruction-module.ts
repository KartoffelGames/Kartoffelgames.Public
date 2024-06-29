import { PwbTemplate } from '../../core/component/template/nodes/pwb-template';
import { PwbTemplateInstructionNode } from '../../core/component/template/nodes/pwb-template-instruction-node';
import { UpdateTrigger } from '../../core/enum/update-trigger.enum';
import { ModuleExpression } from '../../core/module/injection_reference/module-expression';
import { ModuleTemplate } from '../../core/module/injection_reference/module-template';
import { IInstructionOnUpdate } from '../../core/module/instruction_module/instruction-module';
import { InstructionResult } from '../../core/module/instruction_module/instruction-result';
import { PwbInstructionModule } from '../../core/module/instruction_module/pwb-instruction-module.decorator';
import { ModuleValueProcedure } from '../../core/module/module-value-procedure';
import { ModuleValues } from '../../core/module/module-values';
import { ScopedValues } from '../../core/scoped-values';

/**
 * If expression.
 * If the executed result of the attribute value is false, the element will not be append to view.
 */
@PwbInstructionModule({
    instructionType: 'if',
    trigger: UpdateTrigger.Any & ~UpdateTrigger.UntrackableFunctionCall
})
export class IfInstructionModule implements IInstructionOnUpdate {
    private mLastBoolean: boolean;
    private readonly mModuleValues: ModuleValues;
    private readonly mProcedure: ModuleValueProcedure<any>;
    private readonly mTemplateReference: PwbTemplateInstructionNode;

    /**
     * Constructor.
     * @param pTemplate - Target templat.
     * @param pModuleValues - Scoped values of module.
     * @param pModuleExpression - Expression of instruction module.
     */
    public constructor(pTemplate: ModuleTemplate, pModuleValues: ModuleValues, pModuleExpression: ModuleExpression) {
        this.mTemplateReference = <PwbTemplateInstructionNode>pTemplate;
        this.mModuleValues = pModuleValues;
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

                lModuleResult.addElement(lTemplate, new ScopedValues(this.mModuleValues.scopedValues));
            }

            return lModuleResult;
        } else {
            // No update needed.
            return null;
        }
    }
}