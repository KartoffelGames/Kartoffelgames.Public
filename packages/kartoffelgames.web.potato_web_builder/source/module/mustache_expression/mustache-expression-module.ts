import { ModuleValues } from '../../core/module/module-values';
import { IExpressionOnUpdate } from '../../core/module/expression_module/expression-module';
import { PwbExpressionModule } from '../../core/module/expression_module/pwb-expression-module.decorator';
import { UpdateTrigger } from '../../core/enum/update-trigger.enum';
import { ModuleExpression } from '../../core/module/injection_reference/module-expression';
import { ModuleValueProcedure } from '../../core/module/module-value-procedure';

/**
 * Wannabe Mustache expression executor.
 * Executes readonly expressions inside double brackets.
 */
@PwbExpressionModule({
    trigger: UpdateTrigger.Any & ~UpdateTrigger.UntrackableFunctionCall
})
export class MustacheExpressionModule implements IExpressionOnUpdate {
    private readonly mProcedure: ModuleValueProcedure<any>;

    /**
     * Constructor.
     * 
     * @param pModuleValues - Values of module scope.
     * @param pModuleExpression - Expression value.
     */
    public constructor(pModuleValues: ModuleValues, pModuleExpression: ModuleExpression) {
        this.mProcedure = pModuleValues.createExpressionProcedure(pModuleExpression.value);
    }

    /**
     * Execute expression procedure.
     * 
     * @returns expression result.
     */
    public onUpdate(): string {
        // Execute string
        const lExecutionResult: any = this.mProcedure.execute();

        return lExecutionResult?.toString();
    }
}