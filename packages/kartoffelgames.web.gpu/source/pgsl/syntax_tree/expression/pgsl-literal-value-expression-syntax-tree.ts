import { Exception } from '@kartoffelgames/core';
import { PgslTypeName } from '../../enum/pgsl-type-name.enum';
import { BasePgslSyntaxTree, PgslSyntaxTreeDataStructure } from '../base-pgsl-syntax-tree';

/**
 * PGSL syntax tree for a single literal value of boolean, float, integer or uinteger.
 */
export class PgslLiteralValueExpressionSyntaxTree extends BasePgslSyntaxTree<PgslLiteralValueExpressionSyntaxTreeStructureData['meta']['type'], PgslLiteralValueExpressionSyntaxTreeStructureData['data']> {
    private mScalarType: PgslTypeName;
    private mValue: number;

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
     * Sets default to a zero signed integer.
     */
    public constructor() {
        super('Expression-LiteralValue');

        this.mScalarType = PgslTypeName.Integer;
        this.mValue = 0;
    }

    /**
     * Apply data to current structure.
     * Any thrown error is converted into a parser error.
     * 
     * @param pData - Structure data.
     * 
     * @throws {@link Exception}
     * When a unsupported type should be set or the {@link lTextValue} value does not fit the {@link lLiteralType}.
     */
    protected override applyData(pData: PgslLiteralValueExpressionSyntaxTreeStructureData['data']): void {
        const lTextValue: string = pData.textValue;
        const lLiteralType: PgslTypeName = pData.literalType;

        switch (lLiteralType) {
            case PgslTypeName.Integer:
            case PgslTypeName.UnsignedInteger: {
                // Try to parse signed integer value.
                if (/(0[i]?)|([1-9][0-9]*[i]?)|(0[xX][0-9a-fA-F]+[i]?)/.test(lTextValue)) {
                    this.mScalarType = PgslTypeName.Integer;
                    this.mValue = parseInt(lTextValue);

                    break;
                }

                if (/(0[u])|([1-9][0-9]*[u])|(0[xX][0-9a-fA-F]+[u])/.test(lTextValue)) {
                    this.mScalarType = PgslTypeName.UnsignedInteger;
                    this.mValue = parseInt(lTextValue);

                    break;
                }

                throw new Exception(`Value "${lTextValue}" can not be parsed into a ${lTextValue}`, this);
            }

            case PgslTypeName.Float: {
                // Parse float non hex literals.
                if (/(0[f])|([1-9][0-9]*[f])|([0-9]*\.[0-9]+([eE][+-]?[0-9]+)?[f]?)|([0-9]+\.[0-9]*([eE][+-]?[0-9]+)?[f]?)|([0-9]+[eE][+-]?[0-9]+[f]?)/.test(lTextValue)) {
                    this.mScalarType = PgslTypeName.Float;
                    this.mValue = parseInt(lTextValue);

                    break;
                }

                // Parse float hex literals.
                if (/(0[xX][0-9a-fA-F]*\.[0-9a-fA-F]+([pP][+-]?[0-9]+[f]?)?)|(0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*([pP][+-]?[0-9]+[f]?)?)|(0[xX][0-9a-fA-F]+[pP][+-]?[0-9]+[f]?)/.test(lTextValue)) {
                    // Remove staring 0x or 0X
                    const lNumber = lTextValue.slice(2);

                    // Split float part from exponential.
                    const [lFloatPart, lExponential] = lNumber.split(/pP/g) as [string, string | undefined];

                    // Integer part can be empty, decimal part can be undefined.
                    const [lInteger, lFracture] = lFloatPart.split('.') as [string, string | undefined];

                    // Parse text values to seperate parts as number.
                    const lIntegerNumber = lInteger ? parseInt(lInteger, 16) : 0;
                    const lFractureNumber = lFracture ? parseInt(lFracture, 16) * Math.pow(16, -lFracture.length) : 0;
                    const lExponentialNumber = lExponential ? parseInt(lExponential, 10) : 0;

                    // Construct and set float value.
                    this.mScalarType = PgslTypeName.Float;
                    this.mValue = (lIntegerNumber + lFractureNumber) * Math.pow(2, lExponentialNumber);

                    break;
                }

                throw new Exception(`Value "${lTextValue}" can not be parsed into a ${lTextValue}`, this);
            }

            case PgslTypeName.Boolean: {
                // Validate text to be a boolean value.
                if (lTextValue !== 'true' && lTextValue !== 'false') {
                    throw new Exception(`Value "${lTextValue}" can not be parsed into a boolean.`, this);
                }

                // Set boolean values.
                this.mScalarType = PgslTypeName.Boolean;
                this.mValue = lTextValue === 'true' ? 1 : 0;

                break;
            }

            default: {
                throw new Exception(`Type "${lLiteralType}" not valid for literal "${lTextValue}".`, this);
            }
        }
    }

    /**
     * Retrieve data of current structure.
     */
    protected override retrieveData(): PgslLiteralValueExpressionSyntaxTreeStructureData['data'] {
        return {
            textValue: this.mValue.toString(),
            literalType: this.mScalarType
        };
    }
}

export type PgslLiteralValueExpressionSyntaxTreeStructureData = PgslSyntaxTreeDataStructure<'Expression-LiteralValue', {
    textValue: string,
    literalType: PgslTypeName;
}>;

export type PgslLiteralValueExpressionSyntaxTreeData = PgslLiteralValueExpressionSyntaxTreeStructureData['meta'];