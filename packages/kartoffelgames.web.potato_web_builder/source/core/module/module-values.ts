import { Dictionary } from '@kartoffelgames/core.data';
import { ScopedValues } from '../scoped-values';

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
     * Execute string expression in component processor context.
     * 
     * @param pExpression - Expression to execute.
     * @param pValues - Current component values.
     * @param pExtenedData - Extended data that are only exist for this execution.
     */
    public executeExpression(pExpression: string, pExtenedData?: Dictionary<string, any>): any {
        const lExtendedData: Dictionary<string, any> = pExtenedData ?? new Dictionary<string, any>();

        const lEvaluatedFunction: () => any = this.createEvaluationFunktion(pExpression, lExtendedData);
        return lEvaluatedFunction.call(this.mScopedValues.store);
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
        for (const lReferenceName of _pExtenedValue.keys()) {
            lString += `const ${lReferenceName} = _pExtenedValue.get('${lReferenceName}');`;
        }

        // Add result from path.
        lString += `return ${_pExpression};`;

        // Ending function
        lString += '}})();';

        // Return evaluated function.
        return eval(lString);
    }
}
