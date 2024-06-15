import { Exception } from '@kartoffelgames/core.data';
import { UpdateHandler } from '../../component/handler/update-handler';
import { PwbTemplate } from '../../component/template/nodes/pwb-template';
import { LayerValues } from '../../component/values/layer-values';
import { PwbInstructionModule } from '../../decorator/pwb-instruction-module.decorator';
import { ComponentUpdateHandlerReference } from '../../injection/references/component/component-update-handler-reference';
import { ModuleLayerValuesReference } from '../../injection/references/module/module-layer-values-reference';
import { ModuleValueReference } from '../../injection/references/module/module-value-reference';
import { IPwbInstructionModuleOnUpdate } from '../../interface/module.interface';
import { ComponentScopeExecutor } from '../../module/execution/component-scope-executor';
import { InstructionResult } from '../../module/result/instruction-result';
import { UpdateTrigger } from '../../enum/update-trigger.enum';

/**
 * Dynamic content instruction.
 * Add {@link PwbTemplate} returned by the provided template callback to current location.
 */
@PwbInstructionModule({
    instructionType: 'dynamic-content',
    trigger: UpdateTrigger.Default
})
export class DynamicContentInstructionModule implements IPwbInstructionModuleOnUpdate {
    private readonly mExpression: string;
    private mLastTemplate: PwbTemplate | null;
    private readonly mLayerValues: LayerValues;
    private readonly mUpdateHandler: UpdateHandler;

    /**
     * Constructor.
     * @param pTemplate - Target templat.
     * @param pLayerValues - Values of component.
     * @param pAttributeReference - Attribute of module.
     */
    public constructor(pAttributeValue: ModuleValueReference, pLayerValues: ModuleLayerValuesReference, pUpdateHandler: ComponentUpdateHandlerReference) {
        this.mLayerValues = pLayerValues;
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
        const lTemplateResult: PwbTemplate = ComponentScopeExecutor.executeSilent(this.mExpression, this.mLayerValues);

        // Validate correct result.
        if (!lTemplateResult! || !(lTemplateResult instanceof PwbTemplate)) {
            throw new Exception(`Dynamic content method has a wrong result type.`, this);
        }

        // Check for changes.
        const lTemplateEqual: boolean = this.mUpdateHandler.disableInteractionTrigger(() => {
            return this.mLastTemplate !== null && this.mLastTemplate.equals(lTemplateResult);
        });

        if (lTemplateEqual) {
            // No update needed.
            return null;
        }

        this.mLastTemplate = lTemplateResult;

        // Add custom template to output.
        const lModuleResult: InstructionResult = new InstructionResult();
        lModuleResult.addElement(lTemplateResult, new LayerValues(this.mLayerValues));

        return lModuleResult;

    }
}