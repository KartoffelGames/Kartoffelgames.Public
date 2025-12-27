import type { EnumDeclarationCst, EnumDeclarationValueCst } from '../../concrete_syntax_tree/declaration.type.ts';
import type { StringValueExpressionCst } from '../../concrete_syntax_tree/expression.type.ts';

export class PgslAccessModeEnum {
    private static mValidValues: Set<string> | null = null;

    /**
     * Valid values set.
     */
    private static get validValues(): Set<string> {
        if (!PgslAccessModeEnum.mValidValues) {
            const lSet = new Set<string>();
            for (const lKey in PgslAccessModeEnum.values) {
                lSet.add(PgslAccessModeEnum.values[lKey as keyof typeof PgslAccessModeEnum.values]);
            }
            PgslAccessModeEnum.mValidValues = lSet;
        }

        return PgslAccessModeEnum.mValidValues;
    }

    /**
     * Enum values.
     */
    public static readonly values = {
        Read: 'read',
        Write: 'write',
        ReadWrite: 'read_write'
    } as const;

    /**
     * Concrete syntax tree representation.
     */
    public static readonly cst: EnumDeclarationCst = (() => {
        return {
            type: 'EnumDeclaration',
            buildIn: true,
            range: [0, 0, 0, 0],
            name: 'AccessMode',
            attributeList: {
                type: 'AttributeList',
                range: [0, 0, 0, 0],
                attributes: []
            },
            values: Object.entries(PgslAccessModeEnum.values).map<EnumDeclarationValueCst>(([name, value]) => {
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
    public static containsValue(pValue: string): pValue is PgslAccessMode {
        return PgslAccessModeEnum.validValues.has(pValue);
    }
}

export type PgslAccessMode = (typeof PgslAccessModeEnum.values)[keyof typeof PgslAccessModeEnum.values];