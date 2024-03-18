import { LayerValues } from '../../component/values/layer-values';
import { PwbInstructionModule } from '../../decorator/pwb-instruction-module.decorator';
import { IPwbInstructionModuleOnUpdate } from '../../interface/module.interface';
import { ModuleAttributeReference } from '../../injection_reference/module-attribute-reference';
import { ModuleLayerValuesReference } from '../../injection_reference/module/module-layer-values-reference';
import { ModuleTemplateReference } from '../../injection_reference/module/module-template-reference';
import { InstructionResult } from '../../module/result/instruction-result';
import { ComponentScopeExecutor } from '../../module/execution/component-scope-executor';

/**
 * If expression.
 * If the executed result of the attribute value is false, the element will not be append to view.
 */
@PwbInstructionModule({
    selector: /^\*pwbIf$/
})
export class IfManipulatorAttributeModule implements IPwbInstructionModuleOnUpdate {
    private readonly mAttributeReference: ModuleAttributeReference;
    private mFirstCompare: boolean;
    private mLastBoolean: boolean;
    private readonly mTemplateReference: ModuleTemplateReference;
    private readonly mValueHandler: LayerValues;

    /**
     * Constructor.
     * @param pTemplateReference - Target templat.
     * @param pValueReference - Values of component.
     * @param pAttributeReference - Attribute of module.
     */
    public constructor(pTemplateReference: ModuleTemplateReference, pValueReference: ModuleLayerValuesReference, pAttributeReference: ModuleAttributeReference) {
        this.mTemplateReference = pTemplateReference;
        this.mValueHandler = pValueReference.value;
        this.mAttributeReference = pAttributeReference;
        this.mLastBoolean = false;
        this.mFirstCompare = true;
    }

    /**
     * Decide if module / element should be updated.
     * @returns if element of module should be updated.
     */
    public onUpdate(): InstructionResult | null {
        const lExecutionResult: any = ComponentScopeExecutor.executeSilent(this.mAttributeReference.value.asText, this.mValueHandler);

        if (this.mFirstCompare || !!lExecutionResult !== this.mLastBoolean) {
            this.mLastBoolean = !!lExecutionResult;
            this.mFirstCompare = false;

            // If in any way the execution result is true, add template to result.
            const lModuleResult: InstructionResult = new InstructionResult();
            if (lExecutionResult) {
                lModuleResult.addElement(this.mTemplateReference.value.clone(), new LayerValues(this.mValueHandler));
            }

            return lModuleResult;
        } else {
            // No update needed.
            return null;
        }
    }
}