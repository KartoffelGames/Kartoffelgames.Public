import { Exception } from '@kartoffelgames/core';
import { PgslTypeName } from '../type/pgsl-type-name.enum';
import { PgslExpression } from './pgsl-expression';

export class PgslLiteralValue extends PgslExpression {
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
        super();

        this.mScalarType = PgslTypeName.Integer;
        this.mValue = 0;
    }

    /**
     * Set value by text.
     * 
     * @throws {@link Exception}
     * When a unsupported type should be set or the {@link pTextValue} value does not fit the {@link pLiteralType}.
     * 
     * @param pTextValue - Value as text.
     * @param pLiteralType - Type the text should have.
     */
    public setFromText(pTextValue: string, pLiteralType: PgslTypeName): void {
        switch (pLiteralType) {
            case PgslTypeName.Integer:
            case PgslTypeName.UnsignedInteger: {
                // Try to parse signed integer value.
                if (/(0[i]?)|([1-9][0-9]*[i]?)|(0[xX][0-9a-fA-F]+[i]?)/.test(pTextValue)) {
                    this.mScalarType = PgslTypeName.Integer;
                    this.mValue = parseInt(pTextValue);

                    break;
                }

                if (/(0[u])|([1-9][0-9]*[u])|(0[xX][0-9a-fA-F]+[u])/.test(pTextValue)) {
                    this.mScalarType = PgslTypeName.UnsignedInteger;
                    this.mValue = parseInt(pTextValue);

                    break;
                }

                throw new Exception(`Value "${pTextValue}" can not be parsed into a ${pTextValue}`, this);
            }

            case PgslTypeName.Float: {
                // Parse float non hex literals.
                if (/(0[f])|([1-9][0-9]*[f])|([0-9]*\.[0-9]+([eE][+-]?[0-9]+)?[f]?)|([0-9]+\.[0-9]*([eE][+-]?[0-9]+)?[f]?)|([0-9]+[eE][+-]?[0-9]+[f]?)/.test(pTextValue)) {
                    this.mScalarType = PgslTypeName.Float;
                    this.mValue = parseInt(pTextValue);

                    break;
                }

                // Parse float hex literals.
                if (/(0[xX][0-9a-fA-F]*\.[0-9a-fA-F]+([pP][+-]?[0-9]+[f]?)?)|(0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*([pP][+-]?[0-9]+[f]?)?)|(0[xX][0-9a-fA-F]+[pP][+-]?[0-9]+[f]?)/.test(pTextValue)) {
                    // Remove staring 0x or 0X
                    const lNumber = pTextValue.slice(2);

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

                throw new Exception(`Value "${pTextValue}" can not be parsed into a ${pTextValue}`, this);
            }

            case PgslTypeName.Boolean: {
                // Validate text to be a boolean value.
                if (pTextValue !== 'true' && pTextValue !== 'false') {
                    throw new Exception(`Value "${pTextValue}" can not be parsed into a boolean.`, this);
                }

                // Set boolean values.
                this.mScalarType = PgslTypeName.Boolean;
                this.mValue = pTextValue === 'true' ? 1 : 0;

                break;
            }

            default: {
                throw new Exception(`Type "${pLiteralType}" not valid for literal "${pTextValue}".`, this);
            }
        }
    }
}