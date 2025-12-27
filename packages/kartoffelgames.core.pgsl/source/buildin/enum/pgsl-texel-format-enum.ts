import type { EnumDeclarationCst, EnumDeclarationValueCst } from '../../concrete_syntax_tree/declaration.type.ts';
import type { StringValueExpressionCst } from '../../concrete_syntax_tree/expression.type.ts';

export class PgslTexelFormatEnum {
    /**
     * Concrete syntax tree representation.
     */
    public static readonly CST: EnumDeclarationCst = (() => {
        return {
            type: 'EnumDeclaration',
            buildIn: true,
            range: [0, 0, 0, 0],
            name: 'TexelFormat',
            attributeList: {
                type: 'AttributeList',
                range: [0, 0, 0, 0],
                attributes: []
            },
            values: Object.entries(PgslTexelFormatEnum.VALUES).map<EnumDeclarationValueCst>(([pName, pValue]) => {
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

    /**
     * Enum values.
     */
    public static readonly VALUES = {
        Rgba8unorm: 'rgba8unorm',
        Rgba8snorm: 'rgba8snorm',
        Rgba8uint: 'rgba8uint',
        Rgba8sint: 'rgba8sint',
        Rgba16uint: 'rgba16uint',
        Rgba16sint: 'rgba16sint',
        Rgba16float: 'rgba16float',
        R32uint: 'r32uint',
        R32sint: 'r32sint',
        R32float: 'r32float',
        Rg32uint: 'rg32uint',
        Rg32sint: 'rg32sint',
        Rg32float: 'rg32float',
        Rgba32uint: 'rgba32uint',
        Rgba32sint: 'rgba32sint',
        Rgba32float: 'rgba32float',
        Bgra8unorm: 'bgra8unorm'
    } as const;

    private static mValidValues: Set<string> | null = null;

    /**
     * Valid values set.
     */
    private static get validValues(): Set<string> {
        if (!PgslTexelFormatEnum.mValidValues) {
            const lSet = new Set<string>();
            for (const lKey in PgslTexelFormatEnum.VALUES) {
                lSet.add(PgslTexelFormatEnum.VALUES[lKey as keyof typeof PgslTexelFormatEnum.VALUES]);
            }
            PgslTexelFormatEnum.mValidValues = lSet;
        }

        return PgslTexelFormatEnum.mValidValues;
    }

    /**
     * Check if the given value is a valid access mode.
     * 
     * @param pValue - Value to check.
     * 
     * @returns True if the value is valid, false otherwise.
     */
    public static containsValue(pValue: string): pValue is PgslTexelFormat {
        return PgslTexelFormatEnum.validValues.has(pValue);
    }
}

export type PgslTexelFormat = (typeof PgslTexelFormatEnum.VALUES)[keyof typeof PgslTexelFormatEnum.VALUES];