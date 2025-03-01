import type { ModuleDataLevel } from '../../core/data/module-data-level.ts';
import type { IExpressionOnUpdate } from '../../core/module/expression_module/expression-module.ts';
import { PwbExpressionModule } from '../../core/module/expression_module/pwb-expression-module.decorator.ts';
import { UpdateTrigger } from '../../core/enum/update-trigger.enum.ts';
import type { ModuleExpression } from '../../core/module/injection_reference/module-expression.ts';
import type { LevelProcedure } from '../../core/data/level-procedure.ts';
import { Processor } from '../../core/core_entity/processor.ts';

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