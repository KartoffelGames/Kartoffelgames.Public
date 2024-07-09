import { ScopedValues } from './scoped-values';
import { ModuleValueProcedure } from './module-value-procedure';

/**
 * Executes string in set component values scope.
 */
export class ModuleValues {
    private readonly mScopedValues: ScopedValues;

    /**
     * Scoped values of module.
     */
    public get scopedValues(): ScopedValues {
        return this.mScopedValues;
    }

    /**
     * Constructor. 
     * Create expression executor with embedded values.
     * 
     * @param pScopedValues - Scoped values. 
     */
    public constructor(pScopedValues: ScopedValues) {
        this.mScopedValues = pScopedValues;
    }

    /**
     * Create expression procedure in component processor context.
     * Extended values are used only for this procedure.
     * 
     * @param pExpression - Expression to execute.
     * @param pExtendedValues - Names of extended values.
     */
    public createExpressionProcedure<TResult = any>(pExpression: string, pExtendedValues?: Array<string>): ModuleValueProcedure<TResult> {
        return new ModuleValueProcedure(pExpression, this.scopedValues, pExtendedValues ?? []);
    }
}
