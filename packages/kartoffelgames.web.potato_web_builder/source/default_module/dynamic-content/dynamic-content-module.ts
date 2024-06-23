import { Exception } from '@kartoffelgames/core.data';
import { PwbTemplate } from '../../core/component/template/nodes/pwb-template';
import { ScopedValues } from '../../core/component/values/scoped-values';
import { ModuleValueReference } from '../../core/injection-reference/module/module-value-reference';
import { IInstructionOnUpdate } from '../../core/module/instruction_module/instruction-module';
import { PwbInstructionModule } from '../../core/module/instruction_module/pwb-instruction-module.decorator';
import { InstructionResult } from '../../core/module/instruction_module/result/instruction-result';
import { ModuleValues } from '../../core/module/module-values';
import { UpdateTrigger } from '../../enum/update-trigger.enum';

/**
 * Dynamic content instruction.
 * Add {@link PwbTemplate} returned by the provided template callback to current location.
 */
@PwbInstructionModule({
    instructionType: 'dynamic-content',
    trigger: UpdateTrigger.None
})
export class DynamicContentInstructionModule implements IInstructionOnUpdate {
    private readonly mExpression: string;
    private mLastTemplate: PwbTemplate | null;
    private readonly mModuleValues: ModuleValues;

    /**
     * Constructor.
     * @param pAttributeValue - Values of attribute template.
     * @param pModuleValues - Scoped values of module.
     */
    public constructor(pAttributeValue: ModuleValueReference, pModuleValues: ModuleValues) {
        this.mModuleValues = pModuleValues;
        this.mLastTemplate = null;

        // Callback expression.
        this.mExpression = pAttributeValue.toString();
    }

    /**
     * Decide if module / element should be updated.
     * @returns if element of module should be updated.
     */
    public onUpdate(): InstructionResult | null {
        // Execute content callback silent.
        const lTemplateResult: PwbTemplate = this.mModuleValues.executeExpression(this.mExpression);

        // Validate correct result.
        if (!lTemplateResult! || !(lTemplateResult instanceof PwbTemplate)) {
            throw new Exception(`Dynamic content method has a wrong result type.`, this);
        }

        // Check for changes.
        if (this.mLastTemplate !== null && this.mLastTemplate.equals(lTemplateResult)) {
            // No update needed.
            return null;
        }

        this.mLastTemplate = lTemplateResult;

        // Add custom template to output.
        const lModuleResult: InstructionResult = new InstructionResult();
        lModuleResult.addElement(lTemplateResult, new ScopedValues(this.mModuleValues.scopedValues));

        return lModuleResult;
    }
}