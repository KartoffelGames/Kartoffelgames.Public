import type { EnumDeclarationCst, EnumDeclarationValueCst } from "../concrete_syntax_tree/declaration.type.ts";
import { StringValueExpressionCst } from "../concrete_syntax_tree/expression.type.ts";

export class PgslInterpolateSamplingEnum {
    /**
     * Valid values set.
     */
    private static readonly mValidValues: Set<string> = (() => {
        const lSet = new Set<string>();
        for (const lKey in PgslInterpolateSamplingEnum.values) {
            lSet.add(PgslInterpolateSamplingEnum.values[lKey as keyof typeof PgslInterpolateSamplingEnum.values]);
        }
        return lSet;
    })();

    /**
     * Enum values.
     */
    public static readonly values = {
        Center: 'center',
        Centroid: 'centroid',
        Sample: 'sample',
        First: 'first',
        Either: 'either'
    } as const;

    /**
     * Concrete syntax tree representation.
     */
    public static readonly cst: EnumDeclarationCst = (() => {
        return {
            type: 'EnumDeclaration',
            buildIn: true,
            range: [0, 0, 0, 0],
            name: 'InterpolateSampling',
            attributeList: {
                type: 'AttributeList',
                range: [0, 0, 0, 0],
                attributes: []
            },
            values: Object.entries(PgslInterpolateSamplingEnum.values).map<EnumDeclarationValueCst>(([name, value]) => {
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
    public static containsValue(pValue: string): pValue is PgslInterpolateSampling {
        return PgslInterpolateSamplingEnum.mValidValues.has(pValue);
    }
}

export type PgslInterpolateSampling = (typeof PgslInterpolateSamplingEnum.values)[keyof typeof PgslInterpolateSamplingEnum.values];