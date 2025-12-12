import type { EnumDeclarationCst, EnumDeclarationValueCst } from "../concrete_syntax_tree/declaration.type.ts";
import { StringValueExpressionCst } from "../concrete_syntax_tree/expression.type.ts";

export class PgslInterpolateTypeEnum {
    /**
     * Valid values set.
     */
    private static readonly mValidValues: Set<string> = (() => {
        const lSet = new Set<string>();
        for (const lKey in PgslInterpolateTypeEnum.values) {
            lSet.add(PgslInterpolateTypeEnum.values[lKey as keyof typeof PgslInterpolateTypeEnum.values]);
        }
        return lSet;
    })();

    /**
     * Enum values.
     */
    public static readonly values = {
        Perspective: 'perspective',
        Linear: 'linear',
        Flat: 'flat'
    } as const;

    /**
     * Concrete syntax tree representation.
     */
    public static readonly cst: EnumDeclarationCst = (() => {
        return {
            type: 'EnumDeclaration',
            buildIn: true,
            range: [0, 0, 0, 0],
            name: 'InterpolateType',
            attributeList: {
                type: 'AttributeList',
                range: [0, 0, 0, 0],
                attributes: []
            },
            values: Object.entries(PgslInterpolateTypeEnum.values).map<EnumDeclarationValueCst>(([name, value]) => {
                return {
                    type: 'EnumDeclarationValue',
                    buildIn: true,
                    range: [0, 0, 0, 0],
                    name: name,
                    value: {
                        type: 'StringValueExpression',
                        range: [0, 0, 0, 0],
                        textValue: value
                    } satisfies StringValueExpressionCst
                };
            })
        };
    })();

    /**
     * Check if the given value is a valid access mode.
     * 
     * @param pValue - Value to check.
     * 
     * @returns True if the value is valid, false otherwise.
     */
    public static containsValue(pValue: string): pValue is PgslInterpolateType {
        return PgslInterpolateTypeEnum.mValidValues.has(pValue);
    }
}

export type PgslInterpolateType = (typeof PgslInterpolateTypeEnum.values)[keyof typeof PgslInterpolateTypeEnum.values];
