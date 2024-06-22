import { LayerValues } from '../../core/component/values/layer-values';
import { ModuleLayerValuesReference } from '../../core/injection-reference/module/module-layer-values-reference';
import { ModuleValueReference } from '../../core/injection-reference/module/module-value-reference';
import { ComponentScopeExecutor } from '../../core/module/execution/component-scope-executor';
import { IExpressionOnUpdate } from '../../core/module/expression_module/expression-module';
import { PwbExpressionModule } from '../../core/module/expression_module/pwb-expression-module.decorator';
import { UpdateTrigger } from '../../enum/update-trigger.enum';

/**
 * Wannabe Mustache expression executor.
 * Executes readonly expressions inside double brackets.
 */
@PwbExpressionModule({
    trigger: UpdateTrigger.None
})
export class MustacheExpressionModule implements IExpressionOnUpdate {
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
        const lExecutionResult: any = ComponentScopeExecutor.execute(lExpression, this.mValueHandler);

        return lExecutionResult?.toString();
    }
}