import { ModuleValueReference } from '../../core/injection-reference/module/module-value-reference';
import { ModuleValues } from '../../core/module/module-values';
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
    private readonly mExpressionExecutor: ModuleValues;
    private readonly mExpressionValue: string;

    /**
     * Constructor.
     * 
     * @param pValueReference - Values of component.
     * @param pExpressionReference - Expression value.
     */
    public constructor(pExpressionExecutor: ModuleValues, pExpressionReference: ModuleValueReference) {
        this.mExpressionExecutor = pExpressionExecutor;
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
        const lExecutionResult: any = this.mExpressionExecutor.execute(lExpression);

        return lExecutionResult?.toString();
    }
}