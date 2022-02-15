import { XmlAttribute, XmlElement } from '@kartoffelgames/core.xml';
import { LayerValues } from '../../../component/values/layer-values';
import { MultiplicatorAttributeModule } from '../../../decorator/module/multiplicator-attribute-module';
import { IPwbMultiplicatorModuleOnUpdate } from '../../../interface/module';
import { AttributeReference } from '../../base/injection/attribute-reference';
import { TargetReference } from '../../base/injection/target-reference';
import { TemplateReference } from '../../base/injection/template-reference';
import { MultiplicatorResult } from '../../base/result/multiplicator-result';
import { ComponentScopeExecutor } from '../../execution/component-scope-executor';

/**
 * If expression.
 * If the executed result of the attribute value is false, the element will not be append to view.
 */
@MultiplicatorAttributeModule({
    selector: /^\*pwbIf$/
})
export class IfManipulatorAttributeModule implements IPwbMultiplicatorModuleOnUpdate {
    private readonly mAttributeReference: AttributeReference;
    private readonly mTemplateReference: TemplateReference;
    private mLastBoolean: boolean;
    private readonly mValueHandler: LayerValues;

    /**
     * Constructor.
     * @param pTemplateReference - Target templat.
     * @param pValueHandler - Values of component.
     * @param pAttributeReference - Attribute of module.
     */
    public constructor(pTemplateReference: TemplateReference, pValueHandler: LayerValues, pAttributeReference: AttributeReference) {
        this.mTemplateReference = pTemplateReference;
        this.mValueHandler = pValueHandler;
        this.mAttributeReference = pAttributeReference;
    }

    /**
     * Decide if module / element should be updated.
     * @returns if element of module should be updated.
     */
    public onUpdate(): MultiplicatorResult {
        const lExecutionResult: any = ComponentScopeExecutor.executeSilent(this.mAttributeReference.value.value, this.mValueHandler);

        if (!!lExecutionResult !== this.mLastBoolean) {
            this.mLastBoolean = !!lExecutionResult;

            // If in any way the execution result is true, add template to result.
            const lModuleResult: MultiplicatorResult = new MultiplicatorResult();
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