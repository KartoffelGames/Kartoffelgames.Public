import { PgslEnumDeclaration } from '../declaration/pgsl-enum-declaration.ts';
import { PgslStringValueExpression } from '../expression/single_value/pgsl-string-value-expression.ts';
import { PgslAttributeList } from '../general/pgsl-attribute-list.ts';
import { PgslInterpolateSampling } from './pgsl-interpolate-sampling.enum.ts';

export class PgslInterpolateSamplingEnumDeclaration extends PgslEnumDeclaration {
    /**
     * Valid values set.
     */
    private static readonly mValidValues: Set<string> = (() => {
        const lSet = new Set<string>();
        for (const lKey in PgslInterpolateSampling) {
            lSet.add(PgslInterpolateSampling[lKey as keyof typeof PgslInterpolateSampling]);
        }
        return lSet;
    })();

    /**
     * Check if the given value is a valid interpolate sampling.
     * 
     * @param pValue - Value to check.
     * 
     * @returns True if the value is valid, false otherwise.
     */
    public static containsValue(pValue: string): pValue is PgslInterpolateSampling {
        return PgslInterpolateSamplingEnumDeclaration.mValidValues.has(pValue);
    }

    /**
     * Constructor.
     */
    public constructor() {
        // Convert enum values into declaration values.
        const lValues: Array<{ name: string; value: PgslStringValueExpression; }> = new Array<{ name: string; value: PgslStringValueExpression; }>();
        for (const lKey in PgslInterpolateSampling) {
            // Create enum name and values.
            const lEnumPropertyName = lKey;
            const lEnumPropertyValue = PgslInterpolateSampling[lKey as keyof typeof PgslInterpolateSampling];

            lValues.push({ name: lEnumPropertyName, value: new PgslStringValueExpression(lEnumPropertyValue) });
        }

        super('InterpolateSampling', lValues, new PgslAttributeList([]));
    }
}
