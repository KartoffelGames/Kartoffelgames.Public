import { Exception } from '@kartoffelgames/core';
import { SyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from '../../type/definition/base-pgsl-type-definition-syntax-tree';
import { PgslBooleanTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-boolean-type-definition-syntax-tree';
import { PgslNumericTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-numeric-type-definition-syntax-tree';
import { PgslNumericTypeName } from '../../type/enum/pgsl-numeric-type-name.enum';
import { PgslTypeName } from '../../type/enum/pgsl-type-name.enum';
import { BasePgslExpressionSyntaxTree } from '../base-pgsl-expression-syntax-tree';

/**
 * PGSL syntax tree for a single literal value of boolean, float, integer or uinteger.
 */
export class PgslLiteralValueExpressionSyntaxTree extends BasePgslExpressionSyntaxTree<PgslLiteralValueExpressionSyntaxTreeStructureData> {
    private readonly mScalarType: PgslTypeName;
    private readonly mValue: number;

    /**
     * Type name of literal value.
     */
    public get type(): PgslTypeName {
        return this.mScalarType;
    }

    /**
     * Value of literal.
     * Booleans habe a one for true and 0 for false.
     */
    public get value(): number {
        return this.mValue;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslLiteralValueExpressionSyntaxTreeStructureData, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
        super(pData, pMeta, pBuildIn);

        // Set data.
        [this.mScalarType, this.mValue] = this.convertData(pData.textValue);
    }

    /**
     * On constant state request.
     */
    protected determinateIsConstant(): boolean {
        // Literals are allways constants.
        return true;
    }

    /**
     * On creation fixed state request.
     */
    protected override determinateIsCreationFixed(): boolean {
        // Literals are allways creation fixed.
        return true;
    }

    /**
     * On is storage set.
     */
    protected determinateIsStorage(): boolean {
        return false;
    }

    /**
     * On type resolve of expression
     */
    protected determinateResolveType(): BasePgslTypeDefinitionSyntaxTree {
        // Literal is a boolean value.
        if (this.mScalarType === PgslTypeName.Boolean) {
            return new PgslBooleanTypeDefinitionSyntaxTree({}, this.meta).setParent(this).validateIntegrity();
        }

        // Create numeric type declaration.
        return new PgslNumericTypeDefinitionSyntaxTree({
            typeName: this.mScalarType as any as PgslNumericTypeName
        }, this.meta).setParent(this).validateIntegrity();
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Nothing realy to validate.
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
    private convertData(pTextValue: string): [PgslTypeName, number] {
        // Might be a boolean
        if (pTextValue === 'true') {
            return [PgslTypeName.Boolean, 1];
        }
        if (pTextValue === 'false') {
            return [PgslTypeName.Boolean, 0];
        }

        // Might be a integer.
        const lIntegerMatch: RegExpExecArray | null = /^(?<number>(0)|(?:[1-9][0-9]*)|(?:0[xX][0-9a-fA-F]+))(?<suffix>[iu]?)$/.exec(pTextValue);
        if (lIntegerMatch) {
            // Convert number value.
            const lNumber: number = parseInt(lIntegerMatch.groups!['number']);

            // Convert suffix to concrete type.
            let lSuffixType: PgslTypeName;
            switch (lIntegerMatch.groups!['suffix']) {
                case 'u': {
                    lSuffixType = PgslTypeName.UnsignedInteger;
                    break;
                }
                case 'i': {
                    lSuffixType = PgslTypeName.Integer;
                    break;
                }
                default: {
                    lSuffixType = PgslTypeName.AbstractInteger;
                    break;
                }
            }

            return [lSuffixType, lNumber];
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
            let lSuffixType: PgslTypeName;
            switch (lFloatMatch.groups!['suffix']) {
                case 'f': {
                    lSuffixType = PgslTypeName.Float;
                    break;
                }
                case 'h': {
                    lSuffixType = PgslTypeName.Float16;
                    break;
                }
                default: {
                    lSuffixType = PgslTypeName.AbstractFloat;
                    break;
                }
            }

            return [lSuffixType, lNumber];
        }

        throw new Exception(`Type not valid for literal "${pTextValue}".`, this);
    }
}

export type PgslLiteralValueExpressionSyntaxTreeStructureData = {
    textValue: string,
};