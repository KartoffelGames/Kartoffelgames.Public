import { PgslEnumDeclaration } from "../syntax_tree/declaration/pgsl-enum-declaration.ts";
import { PgslStringValueExpression } from "../syntax_tree/expression/single_value/pgsl-string-value-expression.ts";
import { PgslAttributeList } from "../syntax_tree/general/pgsl-attribute-list.ts";
import { PgslAccessMode } from "./pgsl-access-mode.enum.ts";


export class PgslAccessModeEnumDeclaration extends PgslEnumDeclaration {
    /**
     * Valid values set.
     */
    private static mValidValues: Set<string> = (() => {
        const lSet = new Set<string>();
        for (const lKey in PgslAccessMode) {
            lSet.add(PgslAccessMode[lKey as keyof typeof PgslAccessMode]);
        }
        return lSet;
    })();

    /**
     * Check if the given value is a valid access mode.
     * 
     * @param pValue - Value to check.
     * 
     * @returns True if the value is valid, false otherwise.
     */
    public static containsValue(pValue: string): pValue is PgslAccessMode {
        return PgslAccessModeEnumDeclaration.mValidValues.has(pValue);
    }

    /**
     * Constructor.
     */
    public constructor() {
        // Create empty meta and set as built-in.
        const lEmptyMeta = PgslAccessModeEnumDeclaration.emptyMeta();
        lEmptyMeta.buildIn = true;

        // Convert enum values into declaration values.
        const lValues: Array<{ name: string; value: PgslStringValueExpression; }> = new Array<{ name: string; value: PgslStringValueExpression; }>();
        for (const lKey in PgslAccessMode) {
            // Create enum name and values.
            const lEnumPropertyName = lKey;
            const lEnumPropertyValue = PgslAccessMode[lKey as keyof typeof PgslAccessMode];

            lValues.push({ name: lEnumPropertyName, value: new PgslStringValueExpression(lEnumPropertyValue, lEmptyMeta) });
        }

        super('AccessMode', lValues, new PgslAttributeList(lEmptyMeta, []), lEmptyMeta);
    }
}