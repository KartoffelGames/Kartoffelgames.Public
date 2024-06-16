import { LayerValues } from '../../component_entity/component/values/layer-values';
import { ModuleLayerValuesReference } from '../../component_entity/injection-reference/module/module-layer-values-reference';
import { ModuleValueReference } from '../../component_entity/injection-reference/module/module-value-reference';
import { ComponentScopeExecutor } from '../../component_entity/module/execution/component-scope-executor';
import { IPwbExpressionModuleOnUpdate } from '../../component_entity/module/expression_module/expression-module';
import { PwbExpressionModule } from '../../component_entity/module/expression_module/pwb-expression-module.decorator';
import { UpdateTrigger } from '../../enum/update-trigger.enum';

/**
 * Wannabe Mustache expression executor.
 * Executes readonly expressions inside double brackets.
 */
@PwbExpressionModule({
    trigger: UpdateTrigger.None
})
export class MustacheExpressionModule implements IPwbExpressionModuleOnUpdate {
    private readonly mExpressionValue: string;
    private readonly mValueHandler: LayerValues;

    /**
     * Constructor.
     * 
     * @param pValueReference - Values of component.
     * @param pExpressionReference - Expression value.
     */
    public constructor(pValueReference: ModuleLayerValuesReference, pExpressionReference: ModuleValueReference) {
        this.mValueHandler = pValueReference;
        this.mExpressionValue = pExpressionReference.toString();
    }

    /**
     * Execute expression with ComponentScopeExecutor.
     * @param pExpression - Expression.
     * @param pValues - Component values.
     * @returns expression result.
     */
    public onUpdate(): string {
        // Cut out mustache.
        const lExpression = this.mExpressionValue;

        // Execute string
        const lExecutionResult: any = ComponentScopeExecutor.executeSilent(lExpression, this.mValueHandler);

        return lExecutionResult?.toString();
    }
}