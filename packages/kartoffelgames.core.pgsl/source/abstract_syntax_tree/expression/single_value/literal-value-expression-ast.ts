import type { LiteralValueExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import type { BasePgslType } from '../../type/definition/base-pgsl-type.ts';
import { PgslBooleanType } from '../../type/definition/pgsl-boolean-type.ts';
import { PgslInvalidType } from '../../type/definition/pgsl-invalid-type.ts';
import { PgslNumericType, type PgslNumericTypeName } from '../../type/definition/pgsl-numeric-type.ts';
import type { ExpressionAstData, IExpressionAst } from '../i-expression-ast.interface.ts';

/**
 * PGSL syntax tree for a single literal value of boolean, float, integer or uinteger.
 */
export class LiteralValueExpressionAst extends AbstractSyntaxTree<LiteralValueExpressionCst, LiteralValueExpressionAstData> implements IExpressionAst {
    /**
     * Validate data of current structure.
     * 
     * @param _pContext - Validation context.
     * @param pCst - Cst data.
     */
    protected override onProcess(_pContext: AbstractSyntaxTreeContext, pCst: LiteralValueExpressionCst): LiteralValueExpressionAstData {
        // Convert value.
        const [lResolveType, lValue, lRepresentationType] = this.convertData(pCst.textValue);

        return {
            // Expression data.
            textValue: pCst.textValue,
            representationType: lRepresentationType,

            // Expression meta data.
            fixedState: PgslValueFixedState.Constant,
            isStorage: false,
            resolveType: lResolveType,
            constantValue: lValue,
            storageAddressSpace: PgslValueAddressSpace.Inherit
        };
    }

    /**
     * Apply data to current structure.
     * Any thrown error is converted into a parser error.
     * 
     * @param pTextValue - literal value as text.
     * 
     * @throws {@link Exception}
     * When a unsupported type should be set or the {@link pTextValue} value does not fit the {@link pType}.
     */
    private convertData(pTextValue: string): [BasePgslType, number, LiteralValueExpressionAstRepresentationType] {
        // Might be a boolean
        if (pTextValue === 'true') {
            return [new PgslBooleanType(), 1, LiteralValueExpressionAstRepresentationType.Boolean];
        }
        if (pTextValue === 'false') {
            return [new PgslBooleanType(), 0, LiteralValueExpressionAstRepresentationType.Boolean];
        }

        // Might be a integer.
        const lIntegerMatch: RegExpExecArray | null = /^(?:(?<number>(?:0)|(?:[1-9][0-9]*))|(?<hex>0[xX][0-9a-fA-F]+))(?<suffix>[iu]?)$/.exec(pTextValue);
        if (lIntegerMatch) {
            // Convert number value. Hexadecimal numbers are parsed by their 0x prefix.
            const lNumber: number = parseInt(lIntegerMatch.groups!['number'] ?? lIntegerMatch.groups!['hex']);

            // Convert suffix to concrete type.
            let lSuffixType: PgslNumericTypeName;
            switch (lIntegerMatch.groups!['suffix']) {
                case 'u': {
                    lSuffixType = PgslNumericType.typeName.unsignedInteger;
                    break;
                }
                case 'i': {
                    lSuffixType = PgslNumericType.typeName.signedInteger;
                    break;
                }
                default: {
                    lSuffixType = PgslNumericType.typeName.abstractInteger;
                    break;
                }
            }

            // Read representation from the matched number group.
            let lRepresentationType: LiteralValueExpressionAstRepresentationType = LiteralValueExpressionAstRepresentationType.Decimal;
            if (lIntegerMatch.groups!['hex']) {
                lRepresentationType = LiteralValueExpressionAstRepresentationType.Hexadecimal;
            }

            return [new PgslNumericType(lSuffixType), lNumber, lRepresentationType];
        }

        // Might be a float.
        const lFloatMatch: RegExpExecArray | null = /^(?:(?<number>(?:0)|(?:[1-9][0-9]*)|(?:[0-9]*\.[0-9]+(?:[eE][+-]?[0-9]+)?)|(?:[0-9]+\.[0-9]*(?:[eE][+-]?[0-9]+)?)|(?:[0-9]+[eE][+-]?[0-9]+))|(?<hex>(?:0[xX][0-9a-fA-F]*\.[0-9a-fA-F]+(?:[pP][+-]?[0-9]+)?)|(?:0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*(?:[pP][+-]?[0-9]+)?)|(?:0[xX][0-9a-fA-F]+[pP][+-]?[0-9]+)))(?<suffix>[fh]?)$/.exec(pTextValue);
        if (lFloatMatch) {
            // Parse float number.
            let lNumber: number;
            if (lFloatMatch.groups!['number']) {
                lNumber = parseFloat(lFloatMatch.groups!['number']);
            } else {
                // Remove staring 0x or 0X
                const lHexNumber = lFloatMatch.groups!['hex'].slice(2);

                // Split float part from exponential.
                const [lFloatPart, lExponential] = lHexNumber.split(/pP/g) as [string, string | undefined];

                // Integer part can be empty, decimal part can be undefined.
                const [lInteger, lFracture] = lFloatPart.split('.') as [string, string | undefined];

                // Parse text values to seperate parts as number.
                const lIntegerNumber = lInteger ? parseInt(lInteger, 16) : 0;
                const lFractureNumber = lFracture ? parseInt(lFracture, 16) * Math.pow(16, -lFracture.length) : 0;
                const lExponentialNumber = lExponential ? parseInt(lExponential, 10) : 0;

                // Construct and set float value.
                lNumber = (lIntegerNumber + lFractureNumber) * Math.pow(2, lExponentialNumber);
            }

            // Convert suffix to concrete type.
            let lSuffixType: PgslNumericTypeName;
            switch (lFloatMatch.groups!['suffix']) {
                case 'f': {
                    lSuffixType = PgslNumericType.typeName.float32;
                    break;
                }
                case 'h': {
                    lSuffixType = PgslNumericType.typeName.float16;
                    break;
                }
                default: {
                    lSuffixType = PgslNumericType.typeName.abstractFloat;
                    break;
                }
            }

            // Read representation from the matched number group.
            let lRepresentationType: LiteralValueExpressionAstRepresentationType = LiteralValueExpressionAstRepresentationType.Decimal;
            if (lFloatMatch.groups!['hex']) {
                lRepresentationType = LiteralValueExpressionAstRepresentationType.Hexadecimal;
            }

            return [new PgslNumericType(lSuffixType), lNumber, lRepresentationType];
        }

        // No literal type matched.
        return [new PgslInvalidType(), 0, LiteralValueExpressionAstRepresentationType.None];
    }
}

/**
 * Written representation of a literal value.
 */
export const LiteralValueExpressionAstRepresentationType = {
    None: 0,
    Boolean: 1,
    Decimal: 2,
    Hexadecimal: 3
} as const;
export type LiteralValueExpressionAstRepresentationType = typeof LiteralValueExpressionAstRepresentationType[keyof typeof LiteralValueExpressionAstRepresentationType];

export type LiteralValueExpressionAstData = {
    textValue: string;
    representationType: LiteralValueExpressionAstRepresentationType;
} & ExpressionAstData;