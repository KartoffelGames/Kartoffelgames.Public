import type { EnumDeclarationCst, EnumDeclarationValueCst } from '../../concrete_syntax_tree/declaration.type.ts';
import type { StringValueExpressionCst } from '../../concrete_syntax_tree/expression.type.ts';

export class PgslInterpolateSamplingEnum {    
    /**
     * Enum values.
     */
    public static readonly VALUES = {
        Center: 'center',
        Centroid: 'centroid',
        Sample: 'sample',
        First: 'first',
        Either: 'either'
    } as const;

    /**
     * Concrete syntax tree representation.
     * MUST BE kept under VALUES declaration to avoid initialization order issues.
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering
    public static readonly CST: EnumDeclarationCst = (() => {
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
            values: Object.entries(PgslInterpolateSamplingEnum.VALUES).map<EnumDeclarationValueCst>(([pName, pValue]) => {
                return {
                    type: 'EnumDeclarationValue',
                    buildIn: true,
                    range: [0, 0, 0, 0],
                    name: pName,
                    value: {
                        type: 'StringValueExpression',
                        range: [0, 0, 0, 0],
                        textValue: pValue
                    } satisfies StringValueExpressionCst
                };
            })
        };
    })();

    private static mValidValues: Set<string> | null = null;

    /**
     * Valid values set.
     */
    private static get validValues(): Set<string> {
        if (!PgslInterpolateSamplingEnum.mValidValues) {
            const lSet = new Set<string>();
            for (const lKey in PgslInterpolateSamplingEnum.VALUES) {
                lSet.add(PgslInterpolateSamplingEnum.VALUES[lKey as keyof typeof PgslInterpolateSamplingEnum.VALUES]);
            }
            PgslInterpolateSamplingEnum.mValidValues = lSet;
        }

        return PgslInterpolateSamplingEnum.mValidValues;
    }

    /**
     * Check if the given value is a valid access mode.
     * 
     * @param pValue - Value to check.
     * 
     * @returns True if the value is valid, false otherwise.
     */
    public static containsValue(pValue: string): pValue is PgslInterpolateSampling {
        return PgslInterpolateSamplingEnum.validValues.has(pValue);
    }
}

export type PgslInterpolateSampling = (typeof PgslInterpolateSamplingEnum.VALUES)[keyof typeof PgslInterpolateSamplingEnum.VALUES];