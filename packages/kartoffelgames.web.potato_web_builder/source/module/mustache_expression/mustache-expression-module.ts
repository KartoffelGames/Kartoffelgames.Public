import { ModuleValues } from '../../core/module/module-values';
import { IExpressionOnUpdate } from '../../core/module/expression_module/expression-module';
import { PwbExpressionModule } from '../../core/module/expression_module/pwb-expression-module.decorator';
import { UpdateTrigger } from '../../core/enum/update-trigger.enum';
import { ModuleExpression } from '../../core/module/injection_reference/module-expression';

/**
 * Wannabe Mustache expression executor.
 * Executes readonly expressions inside double brackets.
 */
@PwbExpressionModule({
    trigger: UpdateTrigger.Any & ~UpdateTrigger.UntrackableFunctionCall
})
export class MustacheExpressionModule implements IExpressionOnUpdate {
    private readonly mExpressionValue: string;
    private readonly mModuleValues: ModuleValues;

    /**
     * Constructor.
     * 
     * @param pValueReference - Values of module scope.
     * @param pModuleExpression - Expression value.
     */
    public constructor(pModuleValues: ModuleValues, pModuleExpression: ModuleExpression) {
        this.mModuleValues = pModuleValues;
        this.mExpressionValue = pModuleExpression.value;
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
        const lExecutionResult: any = this.mModuleValues.executeExpression(lExpression);

        return lExecutionResult?.toString();
    }
}