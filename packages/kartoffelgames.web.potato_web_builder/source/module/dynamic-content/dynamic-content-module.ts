import { Exception } from '@kartoffelgames/core';
import { PwbTemplate } from '../../core/component/template/nodes/pwb-template';
import { ScopedValues } from '../../core/scoped-values';
import { IInstructionOnUpdate } from '../../core/module/instruction_module/instruction-module';
import { PwbInstructionModule } from '../../core/module/instruction_module/pwb-instruction-module.decorator';
import { InstructionResult } from '../../core/module/instruction_module/instruction-result';
import { ModuleValues } from '../../core/module/module-values';
import { UpdateTrigger } from '../../core/enum/update-trigger.enum';
import { ModuleExpression } from '../../core/module/injection_reference/module-expression';
import { ModuleValueProcedure } from '../../core/module/module-value-procedure';
import { Processor } from '../../core/core_entity/processor';

/**
 * Dynamic content instruction.
 * Add {@link PwbTemplate} returned by the provided template callback to current location.
 */
@PwbInstructionModule({
    instructionType: 'dynamic-content',
    trigger: UpdateTrigger.Any & ~UpdateTrigger.UntrackableFunctionCall
})
export class DynamicContentInstructionModule extends Processor implements IInstructionOnUpdate {
    private mLastTemplate: PwbTemplate | null;
    private readonly mModuleValues: ModuleValues;
    private readonly mProcedure: ModuleValueProcedure<PwbTemplate>;

    /**
     * Constructor.
     * @param pExpressionValue - Values of attribute template.
     * @param pModuleValues - Scoped values of module.
     */
    public constructor(pExpressionValue: ModuleExpression, pModuleValues: ModuleValues) {
        super();
        
        this.mModuleValues = pModuleValues;
        this.mLastTemplate = null;

        // Callback expression.
        this.mProcedure = this.mModuleValues.createExpressionProcedure(pExpressionValue.value);
    }

    /**
     * Decide if module / element should be updated.
     * @returns if element of module should be updated.
     */
    public onUpdate(): InstructionResult | null {
        // Execute content callback silent.
        const lTemplateResult: PwbTemplate = this.mProcedure.execute();

        // Validate correct result.
        if (!lTemplateResult! || !(lTemplateResult instanceof PwbTemplate)) {
            throw new Exception(`Dynamic content method has a wrong result type.`, this);
        }

        // Check for changes.
        if (this.mLastTemplate !== null && this.mLastTemplate.equals(lTemplateResult)) {
            // No update needed.
            return null;
        }

        // Dont save the same instance.
        this.mLastTemplate = lTemplateResult.clone();

        // Add custom template to output.
        const lModuleResult: InstructionResult = new InstructionResult();
        lModuleResult.addElement(lTemplateResult, new ScopedValues(this.mModuleValues.scopedValues));

        return lModuleResult;
    }
}