import { Exception } from '@kartoffelgames/core';
import { PgslValueFixedState } from "../../../enum/pgsl-value-fixed-state.ts";
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslSyntaxTreeValidationTrace } from "../../pgsl-syntax-tree-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTree } from "../../type/base-pgsl-type-definition-syntax-tree.ts";
import { PgslBaseTypeName } from '../../type/enum/pgsl-base-type-name.enum.ts';
import { PgslNumericTypeName } from '../../type/enum/pgsl-numeric-type-name.enum.ts';
import { PgslBooleanTypeDefinitionSyntaxTree } from "../../type/pgsl-boolean-type-definition-syntax-tree.ts";
import { PgslNumericTypeDefinitionSyntaxTree } from "../../type/pgsl-numeric-type-definition-syntax-tree.ts";
import { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeValidationAttachment } from '../base-pgsl-expression-syntax-tree.ts';

/**
 * PGSL syntax tree for a single literal value of boolean, float, integer or uinteger.
 */
export class PgslLiteralValueExpressionSyntaxTree extends BasePgslExpressionSyntaxTree {
    private readonly mTextValue: string;

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pTextValue: string, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mTextValue = pTextValue;
    }

    /**
     * Transpile current expression to WGSL code.
     * 
     * @returns WGSL code.
     */
    protected override onTranspile(): string {
        // Basically does nothing to the value.
        return this.mTextValue;
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     */
    protected override onValidateIntegrity(pTrace: PgslSyntaxTreeValidationTrace): PgslExpressionSyntaxTreeValidationAttachment {
        // Convert value.
        const [lBaseType, lScalarType, lValue] = this.convertData(this.mTextValue);

        const lResolveType: BasePgslTypeDefinitionSyntaxTree = (() => {
            // Literal is a boolean value.
            if (lBaseType === PgslBaseTypeName.Boolean) {
                return new PgslBooleanTypeDefinitionSyntaxTree({
                    range: [
                        this.meta.position.start.line,
                        this.meta.position.start.column,
                        this.meta.position.end.line,
                        this.meta.position.end.column,
                    ]
                });
            }

            // Create numeric type declaration.
            return new PgslNumericTypeDefinitionSyntaxTree(lScalarType, {
                range: [
                    this.meta.position.start.line,
                    this.meta.position.start.column,
                    this.meta.position.end.line,
                    this.meta.position.end.column,
                ]
            });
        })();

        // Add resolve type as child tree.
        this.appendChild(lResolveType);

        // Validate child type.
        lResolveType.validate(pTrace);

        return {
            fixedState: PgslValueFixedState.Constant,
            isStorage: false,
            resolveType: lResolveType
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
    private convertData(pTextValue: string): [PgslBaseTypeName, PgslNumericTypeName, number] {
        // Might be a boolean
        if (pTextValue === 'true') {
            return [PgslBaseTypeName.Boolean, PgslNumericTypeName.Integer, 1];
        }
        if (pTextValue === 'false') {
            return [PgslBaseTypeName.Boolean, PgslNumericTypeName.Integer, 0];
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
                    lSuffixType = PgslNumericTypeName.UnsignedInteger;
                    break;
                }
                case 'i': {
                    lSuffixType = PgslNumericTypeName.Integer;
                    break;
                }
                default: {
                    lSuffixType = PgslNumericTypeName.AbstractInteger;
                    break;
                }
            }

            return [PgslBaseTypeName.Numeric, lSuffixType, lNumber];
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
                    lSuffixType = PgslNumericTypeName.Float;
                    break;
                }
                case 'h': {
                    lSuffixType = PgslNumericTypeName.Float16;
                    break;
                }
                default: {
                    lSuffixType = PgslNumericTypeName.AbstractFloat;
                    break;
                }
            }

            return [PgslBaseTypeName.Numeric, lSuffixType, lNumber];
        }

        throw new Exception(`Type not valid for literal "${pTextValue}".`, this);
    }
}

type PgslLiteralValueExpressionSyntaxTreeSetupData = {
    value: number;
};