
import { PgslEnumDeclaration } from '../declaration/pgsl-enum-declaration.ts';
import { PgslStringValueExpression } from '../expression/single_value/pgsl-string-value-expression.ts';
import { PgslAttributeList } from '../general/pgsl-attribute-list.ts';
import { PgslTexelFormat } from './pgsl-texel-format.enum.ts';

export class PgslTexelFormatEnumDeclaration extends PgslEnumDeclaration {
    /**
     * Valid values set.
     */
    private static readonly mValidValues: Set<string> = (() => {
        const lSet = new Set<string>();
        for (const lKey in PgslTexelFormat) {
            lSet.add(PgslTexelFormat[lKey as keyof typeof PgslTexelFormat]);
        }
        return lSet;
    })();

    /**
     * Check if the given value is a valid texel format.
     * 
     * @param pValue - Value to check.
     * 
     * @returns True if the value is valid, false otherwise.
     */
    public static containsValue(pValue: string): pValue is PgslTexelFormat {
        return PgslTexelFormatEnumDeclaration.mValidValues.has(pValue);
    }

    /**
     * Constructor.
     */
    public constructor() {
        // Convert enum values into declaration values.
        const lValues: Array<{ name: string; value: PgslStringValueExpression; }> = new Array<{ name: string; value: PgslStringValueExpression; }>();
        for (const lKey in PgslTexelFormat) {
            // Create enum name and values.
            const lEnumPropertyName = lKey;
            const lEnumPropertyValue = PgslTexelFormat[lKey as keyof typeof PgslTexelFormat];

            lValues.push({ name: lEnumPropertyName, value: new PgslStringValueExpression(lEnumPropertyValue) });
        }

        super('TexelFormat', lValues, new PgslAttributeList([]));
    }
}