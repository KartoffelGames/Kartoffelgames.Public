import { Dictionary } from '@kartoffelgames/core.data';
import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { LayerValues } from '../../component/values/layer-values';

/**
 * Executes string in set component values scope.
 */
export class ComponentScopeExecutor {
    /**
     * Execute string in component processor context.
     * 
     * @param pExpression - Expression to execute.
     * @param pValues - Current component values.
     * @param pExtenedData - Extended data that are only exist for this execution.
     */
    public static execute(pExpression: string, pValues: LayerValues, pExtenedData?: Dictionary<string, any>): any {
        const lExtendedData: Dictionary<string, any> = pExtenedData ?? new Dictionary<string, any>();

        const lEvaluatedFunction: () => any = ComponentScopeExecutor.createEvaluationFunktion(pExpression, lExtendedData);
        return lEvaluatedFunction.call(pValues.data);
    }

    /**
     * Execute string in component processor context.
     * Does not trigger change events.
     * 
     * @param pExpression - Expression to execute.
     * @param pValues - Current component values.
     * @param pExtenedData - Extended data that are only exist for this execution.
     */
    public static executeSilent(pExpression: string, pValues: LayerValues, pExtenedData?: Dictionary<string, any>): any {
        return ChangeDetection.current.silentExecution(() => {
            return ComponentScopeExecutor.execute(pExpression, pValues, pExtenedData);
        });
    }

    /**
     * Creates a function that returns the expression result value.
     * @param _pExpression - Expression to execute.
     * @param _pReferenceNameList - Names of variables that are not properties from user class object.
     * @param _pReferencedValues - Current component values.
     * @param _pExtenedValue - Extended data that are only exist for this execution.
     * @returns 
     */
    private static createEvaluationFunktion(_pExpression: string, _pExtenedValue: Dictionary<string, any>): () => any {
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
