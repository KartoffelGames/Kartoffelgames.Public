import type { EnumDeclarationCst, EnumDeclarationValueCst } from '../../concrete_syntax_tree/declaration.type.ts';
import type { StringValueExpressionCst } from '../../concrete_syntax_tree/expression.type.ts';

export class PgslInterpolateTypeEnum {
    /**
     * Enum values.
     */
    public static readonly VALUES = {
        Perspective: 'perspective',
        Linear: 'linear',
        Flat: 'flat'
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
            name: 'InterpolateType',
            attributeList: {
                type: 'AttributeList',
                range: [0, 0, 0, 0],
                attributes: []
            },
            values: Object.entries(PgslInterpolateTypeEnum.VALUES).map<EnumDeclarationValueCst>(([pName, pValue]) => {
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
        if (!PgslInterpolateTypeEnum.mValidValues) {
            const lSet = new Set<string>();
            for (const lKey in PgslInterpolateTypeEnum.VALUES) {
                lSet.add(PgslInterpolateTypeEnum.VALUES[lKey as keyof typeof PgslInterpolateTypeEnum.VALUES]);
            }
            PgslInterpolateTypeEnum.mValidValues = lSet;
        }

        return PgslInterpolateTypeEnum.mValidValues;
    }

    /**
     * Check if the given value is a valid interpolate type.
     * 
     * @param pValue - Value to check.
     * 
     * @returns True if the value is valid, false otherwise.
     */
    public static containsValue(pValue: string): pValue is PgslInterpolateType {
        return PgslInterpolateTypeEnum.validValues.has(pValue);
    }
}

export type PgslInterpolateType = (typeof PgslInterpolateTypeEnum.VALUES)[keyof typeof PgslInterpolateTypeEnum.VALUES];
