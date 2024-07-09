import { Dictionary, Exception } from '@kartoffelgames/core';
import { ScopedValues } from './scoped-values';

// TODO: Layer value more so all parents can be replaced with a new value.

export class ModuleValueProcedure<T> { // TODO: Rename to somthing more generic not Module... 
    private readonly mExpression: ProcedureExpression;
    private readonly mTemporaryValues: Dictionary<string, any>;

    /**
     * Constructor.
     * 
     * @param pExpression - Procedure expression. 
     * @param pValues - Values.
     * @param pExtendedValueNames - Names of possible extended value. Values only used for this procedure. 
     */
    public constructor(pExpression: string, pValues: ScopedValues, pExtendedValueNames: Array<string>) {
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
     * @param _pExpression - Expression to execute.
     * @param _pReferenceNameList - Names of variables that are not properties from user class object.
     * @param _pReferencedValues - Current component values.
     * @param _pExtenedValue - Extended data that are only exist for this execution.
     * @returns 
     */
    private createEvaluationFunktion(_pExpression: string, _pExtenedValue: Dictionary<string, any>): () => any {
        let lString: string;

        // Starting function
        lString = '(function() {return function () {';

        // Add all extending value variables.
        if (_pExtenedValue.size > 0) {
            for (const lReferenceName of _pExtenedValue.keys()) {
                lString += `const ${lReferenceName} = _pExtenedValue.get('${lReferenceName}');`;
            }
        }

        // Add result from path.
        lString += `return ${_pExpression};`;

        // Ending function
        lString += '}})();';

        // Return evaluated function.
        return eval(lString);
    }
}

type ProcedureExpression = () => any;