import { LayerValues } from '../../component/values/layer-values';
import { PwbExpressionModule } from '../../decorator/pwb-expression-module.decorator';
import { ComponentLayerValuesReference } from '../../injection_reference/component/component-layer-values-reference';
import { ModuleValueReference } from '../../injection_reference/module/module-value-reference';
import { IPwbExpressionModuleOnUpdate } from '../../interface/module.interface';
import { ComponentScopeExecutor } from '../../module/execution/component-scope-executor';

/**
 * Wannabe Mustache expression executor.
 * Executes readonly expressions inside double brackets.
 */
@PwbExpressionModule()
export class MustacheExpressionModule implements IPwbExpressionModuleOnUpdate {
    private readonly mExpressionValue: string;
    private readonly mValueHandler: LayerValues;

    /**
     * Constructor.
     * 
     * @param pValueReference - Values of component.
     * @param pExpressionReference - Expression value.
     */
    public constructor(pValueReference: ComponentLayerValuesReference, pExpressionReference: ModuleValueReference) {
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