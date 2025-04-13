import { Dictionary, Exception } from '@kartoffelgames/core';
import type { DataLevel } from './data-level.ts';

/**
 * Procedure/Expression that is executed on a data 
 */
export class LevelProcedure<T> {
    private readonly mExpression: ProcedureExpression;
    private readonly mTemporaryValues: Dictionary<string, any>;

    /**
     * Constructor.
     * 
     * @param pExpression - Procedure expression. 
     * @param pValues - Values.
     * @param pExtendedValueNames - Names of possible extended value. Values only used for this procedure. 
     */
    public constructor(pExpression: string, pValues: DataLevel, pExtendedValueNames: Array<string>) {
        this.mTemporaryValues = new Dictionary<string, any>();

        // Prefill extended values to init keys.
        if (pExtendedValueNames.length > 0) { // Optimize iterator.
            for (const lKey of pExtendedValueNames) {
                this.mTemporaryValues.set(lKey, undefined);
            }
        }

        // Create expression.
        this.mExpression = this.createEvaluationFunktion(pExpression, this.mTemporaryValues).bind(pValues.store);
    }

    /**
     * Execute expression.
     * 
     * @returns Expression result.
     */
    public execute(): T {
        return this.mExpression();
    }

    /**
     * Set or override temporary value.
     * 
     * @param pName - Value name.
     * @param pValue - Value.
     */
    public setTemporaryValue(pName: string, pValue: any): void {
        if (!this.mTemporaryValues.has(pName)) {
            throw new Exception(`Temporary value "${pName}" does not exist for this procedure.`, this);
        }

        this.mTemporaryValues.set(pName, pValue);
    }

    /**
     * Creates a function that returns the expression result value.
     * @param pExpression - Expression to execute.
     * @param pExtenedValue - Extended data that are only exist for this execution.
     * @returns 
     */
    private createEvaluationFunktion(pExpression: string, pExtenedValue: Dictionary<string, any>): () => any {
        let lString: string;

        // Generate random name for internal extended value variable name.
        const lExtendedValuesVariableName: string = `__${Math.random().toString(36).substring(2)}`;

        // Starting function. Must be a function to be able to bind a different "this" context.
        lString = 'return function () {';

        // Add all extending value variables.
        if (pExtenedValue.size > 0) {
            for (const lReferenceName of pExtenedValue.keys()) {
                lString += `const ${lReferenceName} = ${lExtendedValuesVariableName}.get('${lReferenceName}');`;
            }
        }

        // Add result from path.
        lString += `return ${pExpression};`;

        // Ending function
        lString += '};';

        // Return evaluated function.
        return (new Function(lExtendedValuesVariableName, lString))(pExtenedValue);
    }
}

type ProcedureExpression = () => any;