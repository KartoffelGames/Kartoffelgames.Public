import { Exception } from "@kartoffelgames/core";
import { PgslNumericType, PgslNumericTypeName } from "../../abstract_syntax_tree/type/pgsl-numeric-type.ts";
import type { EnumDeclarationCst, EnumDeclarationValueCst } from '../../concrete_syntax_tree/declaration.type.ts';
import type { StringValueExpressionCst } from '../../concrete_syntax_tree/expression.type.ts';

export class PgslTexelFormatEnum {
    /**
     * Enum values.
     */
    public static readonly VALUES = {
        Rgba8unorm: 'rgba8unorm',
        Rgba8snorm: 'rgba8snorm',
        Rgba8uint: 'rgba8uint',
        Rgba8sint: 'rgba8sint',
        Rgba16unorm: 'rgba16unorm',
        Rgba16snorm: 'rgba16snorm',
        Rgba16uint: 'rgba16uint',
        Rgba16sint: 'rgba16sint',
        Rgba16float: 'rgba16float',
        Rg8unorm: 'rg8unorm',
        Rg8snorm: 'rg8snorm',
        Rg8uint: 'rg8uint',
        Rg8sint: 'rg8sint',
        Rg16unorm: 'rg16unorm',
        Rg16snorm: 'rg16snorm',
        Rg16uint: 'rg16uint',
        Rg16sint: 'rg16sint',
        Rg16float: 'rg16float',
        R32uint: 'r32uint',
        R32sint: 'r32sint',
        R32float: 'r32float',
        Rg32uint: 'rg32uint',
        Rg32sint: 'rg32sint',
        Rg32float: 'rg32float',
        Rgba32uint: 'rgba32uint',
        Rgba32sint: 'rgba32sint',
        Rgba32float: 'rgba32float',
        Bgra8unorm: 'bgra8unorm',
        R8unorm: 'r8unorm',
        R8snorm: 'r8snorm',
        R8uint: 'r8uint',
        R8sint: 'r8sint',
        R16unorm: 'r16unorm',
        R16snorm: 'r16snorm',
        R16uint: 'r16uint',
        R16sint: 'r16sint',
        R16float: 'r16float',
        Rgb10a2unorm: 'rgb10a2unorm',
        Rgb10a2uint: 'rgb10a2uint',
        Rg11b10ufloat: 'rg11b10ufloat'
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

    /**
     * Get the numeric type associated with a texel format.
     * 
     * @param pTexelFormat - Texel format to get the numeric type for.
     *  
     * @returns Numeric type name associated with the given texel format.
     */
    public static formatByType(pType: PgslNumericTypeName): Array<PgslTexelFormat> {
        switch (pType) {
            case 'float':
                return [PgslTexelFormatEnum.VALUES.Rgba8unorm,
                PgslTexelFormatEnum.VALUES.Rgba8snorm,
                PgslTexelFormatEnum.VALUES.Rgba16unorm,
                PgslTexelFormatEnum.VALUES.Rgba16snorm,
                PgslTexelFormatEnum.VALUES.Rgba16float,
                PgslTexelFormatEnum.VALUES.Rg8unorm,
                PgslTexelFormatEnum.VALUES.Rg8snorm,
                PgslTexelFormatEnum.VALUES.Rg16unorm,
                PgslTexelFormatEnum.VALUES.Rg16snorm,
                PgslTexelFormatEnum.VALUES.Rg16float,
                PgslTexelFormatEnum.VALUES.R32float,
                PgslTexelFormatEnum.VALUES.Rg32float,
                PgslTexelFormatEnum.VALUES.Rgba32float,
                PgslTexelFormatEnum.VALUES.Bgra8unorm,
                PgslTexelFormatEnum.VALUES.R8unorm,
                PgslTexelFormatEnum.VALUES.R8snorm,
                PgslTexelFormatEnum.VALUES.R16unorm,
                PgslTexelFormatEnum.VALUES.R16snorm,
                PgslTexelFormatEnum.VALUES.R16float,
                PgslTexelFormatEnum.VALUES.Rgb10a2unorm,
                PgslTexelFormatEnum.VALUES.Rg11b10ufloat];

            case 'uint':
                return [PgslTexelFormatEnum.VALUES.Rgba8uint,
                PgslTexelFormatEnum.VALUES.Rgba16uint,
                PgslTexelFormatEnum.VALUES.Rg8uint,
                PgslTexelFormatEnum.VALUES.Rg16uint,
                PgslTexelFormatEnum.VALUES.R32uint,
                PgslTexelFormatEnum.VALUES.Rg32uint,
                PgslTexelFormatEnum.VALUES.Rgba32uint,
                PgslTexelFormatEnum.VALUES.R8uint,
                PgslTexelFormatEnum.VALUES.R16uint,
                PgslTexelFormatEnum.VALUES.Rgb10a2uint];

            case 'int':
                return [PgslTexelFormatEnum.VALUES.Rgba8sint,
                PgslTexelFormatEnum.VALUES.Rgba16sint,
                PgslTexelFormatEnum.VALUES.Rg8sint,
                PgslTexelFormatEnum.VALUES.Rg16sint,
                PgslTexelFormatEnum.VALUES.R32sint,
                PgslTexelFormatEnum.VALUES.Rg32sint,
                PgslTexelFormatEnum.VALUES.Rgba32sint,
                PgslTexelFormatEnum.VALUES.R8sint,
                PgslTexelFormatEnum.VALUES.R16sint];
        }

        throw new Exception(`Unsupported numeric type '${pType}' for texel format retrieval.`, this);
    }

    /**
     * Get the numeric type associated with a texel format.
     * 
     * @param pTexelFormat - Texel format to get the numeric type for.
     *  
     * @returns Numeric type name associated with the given texel format.
     */
    public static texelNumericType(pTexelFormat: PgslTexelFormat): PgslNumericTypeName {
        switch (pTexelFormat) {
            case PgslTexelFormatEnum.VALUES.Rgba8unorm:
            case PgslTexelFormatEnum.VALUES.Rgba8snorm:
            case PgslTexelFormatEnum.VALUES.Rgba16unorm:
            case PgslTexelFormatEnum.VALUES.Rgba16snorm:
            case PgslTexelFormatEnum.VALUES.Rgba16float:
            case PgslTexelFormatEnum.VALUES.Rg8unorm:
            case PgslTexelFormatEnum.VALUES.Rg8snorm:
            case PgslTexelFormatEnum.VALUES.Rg16unorm:
            case PgslTexelFormatEnum.VALUES.Rg16snorm:
            case PgslTexelFormatEnum.VALUES.Rg16float:
            case PgslTexelFormatEnum.VALUES.R32float:
            case PgslTexelFormatEnum.VALUES.Rg32float:
            case PgslTexelFormatEnum.VALUES.Rgba32float:
            case PgslTexelFormatEnum.VALUES.Bgra8unorm:
            case PgslTexelFormatEnum.VALUES.R8unorm:
            case PgslTexelFormatEnum.VALUES.R8snorm:
            case PgslTexelFormatEnum.VALUES.R16unorm:
            case PgslTexelFormatEnum.VALUES.R16snorm:
            case PgslTexelFormatEnum.VALUES.R16float:
            case PgslTexelFormatEnum.VALUES.Rgb10a2unorm:
            case PgslTexelFormatEnum.VALUES.Rg11b10ufloat:
                return 'float';

            case PgslTexelFormatEnum.VALUES.Rgba8uint:
            case PgslTexelFormatEnum.VALUES.Rgba16uint:
            case PgslTexelFormatEnum.VALUES.Rg8uint:
            case PgslTexelFormatEnum.VALUES.Rg16uint:
            case PgslTexelFormatEnum.VALUES.R32uint:
            case PgslTexelFormatEnum.VALUES.Rg32uint:
            case PgslTexelFormatEnum.VALUES.Rgba32uint:
            case PgslTexelFormatEnum.VALUES.R8uint:
            case PgslTexelFormatEnum.VALUES.R16uint:
            case PgslTexelFormatEnum.VALUES.Rgb10a2uint:
                return 'uint';

            case PgslTexelFormatEnum.VALUES.Rgba8sint:
            case PgslTexelFormatEnum.VALUES.Rgba16sint:
            case PgslTexelFormatEnum.VALUES.Rg8sint:
            case PgslTexelFormatEnum.VALUES.Rg16sint:
            case PgslTexelFormatEnum.VALUES.R32sint:
            case PgslTexelFormatEnum.VALUES.Rg32sint:
            case PgslTexelFormatEnum.VALUES.Rgba32sint:
            case PgslTexelFormatEnum.VALUES.R8sint:
            case PgslTexelFormatEnum.VALUES.R16sint:
                return 'int';
        }
    }
}

export type PgslTexelFormat = (typeof PgslTexelFormatEnum.VALUES)[keyof typeof PgslTexelFormatEnum.VALUES];