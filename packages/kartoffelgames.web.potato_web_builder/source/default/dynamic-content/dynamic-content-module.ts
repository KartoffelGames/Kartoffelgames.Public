import { Exception } from '@kartoffelgames/core.data';
import { PwbTemplate } from '../../component/template/nodes/pwb-template';
import { LayerValues } from '../../component/values/layer-values';
import { PwbInstructionModule } from '../../decorator/pwb-instruction-module.decorator';
import { ComponentReference } from '../../injection/references/component/component-reference';
import { ModuleValueReference } from '../../injection/references/module/module-value-reference';
import { ComponentProcessor } from '../../interface/component.interface';
import { IPwbInstructionModuleOnUpdate } from '../../interface/module.interface';
import { InstructionResult } from '../../module/result/instruction-result';
import { ModuleLayerValuesReference } from '../../injection/references/module/module-layer-values-reference';
import { ComponentScopeExecutor } from '../../module/execution/component-scope-executor';

/**
 * Dynamic content instruction.
 * Add {@link PwbTemplate} returned by the provided template callback to current location.
 */
@PwbInstructionModule({
    instructionType: 'dynamic-content'
})
export class DynamicContentInstructionModule implements IPwbInstructionModuleOnUpdate {
    private readonly mCallback: DynamicContentCallback;
    private readonly mComponentProcessor: ComponentProcessor;
    private mLastTemplate: PwbTemplate | null;
    private readonly mValueHandler: LayerValues;

    /**
     * Constructor.
     * @param pTemplate - Target templat.
     * @param pLayerValues - Values of component.
     * @param pAttributeReference - Attribute of module.
     */
    public constructor(pAttributeValue: ModuleValueReference, pComponent: ComponentReference, pLayerValues: ModuleLayerValuesReference) {
        this.mComponentProcessor = pComponent.processor;
        this.mValueHandler = pLayerValues;
        this.mLastTemplate = null;

        // Callback expression.
        const lCallbackExpression = pAttributeValue.toString();

        // Validate if it is a function.
        const lCallbackFunction: unknown = ComponentScopeExecutor.executeSilent(lCallbackExpression, this.mValueHandler);
        if (typeof lCallbackFunction !== 'function') {
            throw new Exception(`Method "${lCallbackExpression}" not a function.`, this);
        }

        // Save callback.
        this.mCallback = lCallbackFunction as DynamicContentCallback;
    }

    /**
     * Decide if module / element should be updated.
     * @returns if element of module should be updated.
     */
    public onUpdate(): InstructionResult | null {
        const lTemplateResult: PwbTemplate = this.mCallback.call(this.mComponentProcessor);
        if (!(lTemplateResult instanceof PwbTemplate)) {
            throw new Exception(`Dynamic content method has a wrong result type.`, this);
        }

        // Check for changes.
        if (!this.mLastTemplate || !lTemplateResult.equals(this.mLastTemplate)) {
            this.mLastTemplate = lTemplateResult;

            // Add custom template to output.
            const lModuleResult: InstructionResult = new InstructionResult();
            lModuleResult.addElement(lTemplateResult, new LayerValues(this.mValueHandler));

            return lModuleResult;
        } else {
            // No update needed.
            return null;
        }
    }
}

type DynamicContentCallback = () => PwbTemplate;