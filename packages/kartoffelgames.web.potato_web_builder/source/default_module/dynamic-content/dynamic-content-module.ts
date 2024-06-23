import { Exception } from '@kartoffelgames/core.data';
import { UpdateHandler } from '../../core/component/handler/update-handler';
import { PwbTemplate } from '../../core/component/template/nodes/pwb-template';
import { LayerValues } from '../../core/component/values/layer-values';
import { ComponentUpdateHandlerReference } from '../../core/injection-reference/component/component-update-handler-reference';
import { ModuleValueReference } from '../../core/injection-reference/module/module-value-reference';
import { ModuleValues } from '../../core/module/module-values';
import { IInstructionOnUpdate } from '../../core/module/instruction_module/instruction-module';
import { PwbInstructionModule } from '../../core/module/instruction_module/pwb-instruction-module.decorator';
import { InstructionResult } from '../../core/module/instruction_module/result/instruction-result';
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
    private readonly mExpressionExecutor: ModuleValues;
    private mLastTemplate: PwbTemplate | null;
    private readonly mUpdateHandler: UpdateHandler;

    /**
     * Constructor.
     * @param pTemplate - Target templat.
     * @param pLayerValues - Values of component.
     * @param pAttributeReference - Attribute of module.
     */
    public constructor(pAttributeValue: ModuleValueReference, pExpressionExecutor: ModuleValues, pUpdateHandler: ComponentUpdateHandlerReference) {
        this.mExpressionExecutor = pExpressionExecutor;
        this.mUpdateHandler = pUpdateHandler;
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
        const lTemplateResult: PwbTemplate = this.mExpressionExecutor.executeExpression(this.mExpression);

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
        lModuleResult.addElement(lTemplateResult, new LayerValues(this.mExpressionExecutor.layerValues));

        return lModuleResult;
    }
}