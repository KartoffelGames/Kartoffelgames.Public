import { LayerValues } from '../../component/values/layer-values';
import { PwbInstructionModule } from '../../decorator/pwb-instruction-module.decorator';
import { IPwbInstructionModuleOnUpdate } from '../../interface/module.interface';
import { ComponentLayerValuesReference } from '../../injection_reference/component/component-layer-values-reference';
import { ModuleTemplateReference } from '../../injection_reference/module/module-template-reference';
import { InstructionResult } from '../../module/result/instruction-result';
import { ComponentScopeExecutor } from '../../module/execution/component-scope-executor';
import { ModuleValueReference } from '../../injection_reference/module/module-value-reference';
import { PwbTemplateInstructionNode } from '../../component/template/nodes/pwb-template-instruction-node';
import { PwbTemplate } from '../../component/template/nodes/pwb-template';

/**
 * If expression.
 * If the executed result of the attribute value is false, the element will not be append to view.
 */
@PwbInstructionModule({
    instructionType: 'if'
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
    public constructor(pTemplate: ModuleTemplateReference, pLayerValues: ComponentLayerValuesReference, pAttributeValue: ModuleValueReference) {
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
                lTemplate.appendChild(this.mTemplateReference);

                lModuleResult.addElement(lTemplate, new LayerValues(this.mValueHandler));
            }

            return lModuleResult;
        } else {
            // No update needed.
            return null;
        }
    }
}