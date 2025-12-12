import { Exception } from '@kartoffelgames/core';
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import { PgslExpressionTrace } from '../../../trace/pgsl-expression-trace.ts';
import type { PgslTrace } from '../../../trace/pgsl-trace.ts';
import { PgslBooleanType } from '../../../type/pgsl-boolean-type.ts';
import { PgslNumericType, type PgslNumericTypeName } from '../../../type/pgsl-numeric-type.ts';
import type { PgslType } from '../../../type/pgsl-type.ts';
import type { BasePgslSyntaxTreeMeta } from '../../abstract-syntax-tree.ts';
import { ExpressionAst } from '../pgsl-expression.ts';

/**
 * PGSL syntax tree for a single literal value of boolean, float, integer or uinteger.
 */
export class PgslLiteralValueExpression extends ExpressionAst {
    private readonly mTextValue: string;

    /**
     * Value of literal.
     */
    public get value(): string {
        return this.mTextValue;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pTextValue: string, pMeta?: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mTextValue = pTextValue;
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     */
    protected override onExpressionTrace(pTrace: PgslTrace): PgslExpressionTrace {
        // Convert value.
        const [lResolveType, lValue] = this.convertData(pTrace, this.mTextValue);

        return new PgslExpressionTrace({
            fixedState: PgslValueFixedState.Constant,
            isStorage: false,
            resolveType: lResolveType,
            constantValue: lValue,
            storageAddressSpace: PgslValueAddressSpace.Inherit
        });
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
    private convertData(pTrace: PgslTrace, pTextValue: string): [PgslType, number] {
        // Might be a boolean
        if (pTextValue === 'true') {
            return [new PgslBooleanType(pTrace), 1];
        }
        if (pTextValue === 'false') {
            return [new PgslBooleanType(pTrace), 0];
        }

        // Might be a integer.
        const lIntegerMatch: RegExpExecArray | null = /^(?<number>(0)|(?:[1-9][0-9]*)|(?:0[xX][0-9a-fA-F]+))(?<suffix>[iu]?)$/.exec(pTextValue);
        if (lIntegerMatch) {
            // Convert number value.
            const lNumber: number = parseInt(lIntegerMatch.groups!['number']);

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

            return [new PgslNumericType(pTrace, lSuffixType), lNumber];
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

            return [new PgslNumericType(pTrace, lSuffixType), lNumber];
        }

        throw new Exception(`Type not valid for literal "${pTextValue}".`, this);
    }
}