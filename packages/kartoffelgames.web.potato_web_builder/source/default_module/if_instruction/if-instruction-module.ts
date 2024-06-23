import { PwbTemplate } from '../../core/component/template/nodes/pwb-template';
import { PwbTemplateInstructionNode } from '../../core/component/template/nodes/pwb-template-instruction-node';
import { LayerValues } from '../../core/component/values/layer-values';
import { ModuleTemplateReference } from '../../core/injection-reference/module/module-template-reference';
import { ModuleValueReference } from '../../core/injection-reference/module/module-value-reference';
import { ModuleValues } from '../../core/module/module-values';
import { IInstructionOnUpdate } from '../../core/module/instruction_module/instruction-module';
import { PwbInstructionModule } from '../../core/module/instruction_module/pwb-instruction-module.decorator';
import { InstructionResult } from '../../core/module/instruction_module/result/instruction-result';
import { UpdateTrigger } from '../../enum/update-trigger.enum';

/**
 * If expression.
 * If the executed result of the attribute value is false, the element will not be append to view.
 */
@PwbInstructionModule({
    instructionType: 'if',
    trigger: UpdateTrigger.None
})
export class IfInstructionModule implements IInstructionOnUpdate {
    private readonly mExpression: string;
    private readonly mExpressionExecutor: ModuleValues;
    private mLastBoolean: boolean;
    private readonly mTemplateReference: PwbTemplateInstructionNode;

    /**
     * Constructor.
     * @param pTemplate - Target templat.
     * @param pLayerValues - Values of component.
     * @param pAttributeReference - Attribute of module.
     */
    public constructor(pTemplate: ModuleTemplateReference, pExpressionExecutor: ModuleValues, pAttributeValue: ModuleValueReference) {
        this.mTemplateReference = <PwbTemplateInstructionNode>pTemplate;
        this.mExpressionExecutor = pExpressionExecutor;
        this.mExpression = pAttributeValue.toString();
        this.mLastBoolean = false;
    }

    /**
     * Decide if module / element should be updated.
     * @returns if element of module should be updated.
     */
    public onUpdate(): InstructionResult | null {
        const lExecutionResult: any = this.mExpressionExecutor.execute(this.mExpression);

        if (!!lExecutionResult !== this.mLastBoolean) {
            this.mLastBoolean = !!lExecutionResult;

            // If in any way the execution result is true, add template to result.
            const lModuleResult: InstructionResult = new InstructionResult();
            if (lExecutionResult) {
                const lTemplate: PwbTemplate = new PwbTemplate();
                lTemplate.appendChild(...this.mTemplateReference.childList);

                lModuleResult.addElement(lTemplate, new LayerValues(this.mExpressionExecutor.layerValues));
            }

            return lModuleResult;
        } else {
            // No update needed.
            return null;
        }
    }
}