import { PgslEnumDeclaration } from '../declaration/pgsl-enum-declaration.ts';
import { PgslStringValueExpression } from '../expression/single_value/pgsl-string-value-expression.ts';
import { PgslAttributeList } from '../general/pgsl-attribute-list.ts';
import { PgslInterpolateType } from './pgsl-interpolate-type.enum.ts';

export class PgslInterpolateTypeEnumDeclaration extends PgslEnumDeclaration {
    /**
     * Valid values set.
     */
    private static readonly mValidValues: Set<string> = (() => {
        const lSet = new Set<string>();
        for (const lKey in PgslInterpolateType) {
            lSet.add(PgslInterpolateType[lKey as keyof typeof PgslInterpolateType]);
        }
        return lSet;
    })();

    /**
     * Check if the given value is a valid interpolate type.
     * 
     * @param pValue - Value to check.
     * 
     * @returns True if the value is valid, false otherwise.
     */
    public static containsValue(pValue: string): pValue is PgslInterpolateType {
        return PgslInterpolateTypeEnumDeclaration.mValidValues.has(pValue);
    }

    /**
     * Constructor.
     */
    public constructor() {
        // Convert enum values into declaration values.
        const lValues: Array<{ name: string; value: PgslStringValueExpression; }> = new Array<{ name: string; value: PgslStringValueExpression; }>();
        for (const lKey in PgslInterpolateType) {
            // Create enum name and values.
            const lEnumPropertyName = lKey;
            const lEnumPropertyValue = PgslInterpolateType[lKey as keyof typeof PgslInterpolateType];

            lValues.push({ name: lEnumPropertyName, value: new PgslStringValueExpression(lEnumPropertyValue) });
        }

        super('InterpolateType', lValues, new PgslAttributeList([]));
    }
}
