import { Exception } from '@kartoffelgames/core';
import { PwbTemplate } from '../../core/component/template/nodes/pwb-template.ts';
import { DataLevel } from '../../core/data/data-level.ts';
import { IInstructionOnUpdate } from '../../core/module/instruction_module/instruction-module.ts';
import { PwbInstructionModule } from '../../core/module/instruction_module/pwb-instruction-module.decorator.ts';
import { InstructionResult } from '../../core/module/instruction_module/instruction-result.ts';
import { ModuleDataLevel } from '../../core/data/module-data-level.ts';
import { UpdateTrigger } from '../../core/enum/update-trigger.enum.ts';
import { ModuleExpression } from '../../core/module/injection_reference/module-expression.ts';
import { LevelProcedure } from '../../core/data/level-procedure.ts';
import { Processor } from '../../core/core_entity/processor.ts';

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
    private readonly mModuleValues: ModuleDataLevel;
    private readonly mProcedure: LevelProcedure<PwbTemplate>;

    /**
     * Constructor.
     * @param pExpressionValue - Values of attribute template.
     * @param pModuleData - Data of module.
     */
    public constructor(pExpressionValue: ModuleExpression, pModuleData: ModuleDataLevel) {
        super();

        this.mModuleValues = pModuleData;
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

        // Dont save and return the same instance, as the component updates the reference and no update will befound.
        const lTemplateClone: PwbTemplate = lTemplateResult.clone();

        // Dont save the same instance.
        this.mLastTemplate = lTemplateClone;

        // Add custom template to output.
        const lModuleResult: InstructionResult = new InstructionResult();
        lModuleResult.addElement(lTemplateClone, new DataLevel(this.mModuleValues.data));

        return lModuleResult;
    }
}