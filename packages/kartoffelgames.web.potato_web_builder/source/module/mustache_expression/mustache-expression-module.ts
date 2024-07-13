import { ModuleDataLevel } from '../../core/data/module-data-level';
import { IExpressionOnUpdate } from '../../core/module/expression_module/expression-module';
import { PwbExpressionModule } from '../../core/module/expression_module/pwb-expression-module.decorator';
import { UpdateTrigger } from '../../core/enum/update-trigger.enum';
import { ModuleExpression } from '../../core/module/injection_reference/module-expression';
import { LevelProcedure } from '../../core/data/level-procedure';
import { Processor } from '../../core/core_entity/processor';

/**
 * Wannabe Mustache expression executor.
 * Executes readonly expressions inside double brackets.
 */
@PwbExpressionModule({
    trigger: UpdateTrigger.Any & ~UpdateTrigger.UntrackableFunctionCall
})
export class MustacheExpressionModule extends Processor implements IExpressionOnUpdate {
    private readonly mProcedure: LevelProcedure<any>;

    /**
     * Constructor.
     * 
     * @param pModuleValues - Values of module scope.
     * @param pModuleExpression - Expression value.
     */
    public constructor(pModuleValues: ModuleDataLevel, pModuleExpression: ModuleExpression) {
        super();

        this.mProcedure = pModuleValues.createExpressionProcedure(pModuleExpression.value);
    }

    /**
     * Execute expression procedure.
     * 
     * @returns expression result.
     */
    public onUpdate(): string | null {
        // Execute string
        const lExecutionResult: any = this.mProcedure.execute();

        // Undefined is allways an empty string.
        if (typeof lExecutionResult === 'undefined') {
            return null;
        }

        return lExecutionResult?.toString();
    }
}