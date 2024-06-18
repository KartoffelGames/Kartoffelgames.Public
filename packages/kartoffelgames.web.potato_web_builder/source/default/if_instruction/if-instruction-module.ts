import { PwbTemplate } from '../../core/component/template/nodes/pwb-template';
import { PwbTemplateInstructionNode } from '../../core/component/template/nodes/pwb-template-instruction-node';
import { LayerValues } from '../../core/component/values/layer-values';
import { ModuleLayerValuesReference } from '../../core/injection-reference/module/module-layer-values-reference';
import { ModuleTemplateReference } from '../../core/injection-reference/module/module-template-reference';
import { ModuleValueReference } from '../../core/injection-reference/module/module-value-reference';
import { ComponentScopeExecutor } from '../../core/module/execution/component-scope-executor';
import { IPwbInstructionModuleOnUpdate } from '../../core/module/instruction_module/instruction-module';
import { PwbInstructionModule } from '../../core/module/instruction_module/pwb-instruction-module.decorator';
import { InstructionResult } from '../../core/module/instruction_module/result/instruction-result';
import { UpdateTrigger } from '../../enum/update-trigger.enum';

/**
 * If expression.
 * If the executed result of the attribute value is false, the element will not be append to view.
 */
@PwbInstructionModule({
    instructionType: 'if',
    trigger: UpdateTrigger.Default
})
export class IfInstructionModule implements IPwbInstructionModuleOnUpdate {
    private readonly mExpression: string;
    private mLastBoolean: boolean;
    private readonly mTemplateReference: PwbTemplateInstructionNode;
    private readonly mValueHandler: LayerValues;

    /**
     * Constructor.
     * @param pTemplate - Target templat.
     * @param pLayerValues - Values of component.
     * @param pAttributeReference - Attribute of module.
     */
    public constructor(pTemplate: ModuleTemplateReference, pLayerValues: ModuleLayerValuesReference, pAttributeValue: ModuleValueReference) {
        this.mTemplateReference = <PwbTemplateInstructionNode>pTemplate;
        this.mValueHandler = pLayerValues;
        this.mExpression = pAttributeValue.toString();
        this.mLastBoolean = false;
    }

    /**
     * Decide if module / element should be updated.
     * @returns if element of module should be updated.
     */
    public onUpdate(): InstructionResult | null {
        const lExecutionResult: any = ComponentScopeExecutor.executeSilent(this.mExpression, this.mValueHandler);

        if (!!lExecutionResult !== this.mLastBoolean) {
            this.mLastBoolean = !!lExecutionResult;

            // If in any way the execution result is true, add template to result.
            const lModuleResult: InstructionResult = new InstructionResult();
            if (lExecutionResult) {
                const lTemplate: PwbTemplate = new PwbTemplate();
                lTemplate.appendChild(...this.mTemplateReference.childList);

                lModuleResult.addElement(lTemplate, new LayerValues(this.mValueHandler));
            }

            return lModuleResult;
        } else {
            // No update needed.
            return null;
        }
    }
}