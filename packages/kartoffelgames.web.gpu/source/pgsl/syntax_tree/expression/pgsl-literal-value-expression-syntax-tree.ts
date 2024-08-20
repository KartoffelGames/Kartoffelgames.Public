import { Exception } from '@kartoffelgames/core';
import { PgslBuildInTypeName } from '../../enum/pgsl-type-name.enum';
import { BasePgslExpressionSyntaxTree } from './base-pgsl-expression-syntax-tree';

/**
 * PGSL syntax tree for a single literal value of boolean, float, integer or uinteger.
 */
export class PgslLiteralValueExpressionSyntaxTree extends BasePgslExpressionSyntaxTree<PgslLiteralValueExpressionSyntaxTreeStructureData> {
    private readonly mScalarType: PgslBuildInTypeName;
    private readonly mValue: number;

    /**
     * Type name of literal value.
     */
    public get type(): PgslBuildInTypeName {
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
     * @param pStartColumn - Parsing start column.
     * @param pStartLine - Parsing start line.
     * @param pEndColumn - Parsing end column.
     * @param pEndLine - Parsing end line.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslLiteralValueExpressionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set data.
        [this.mScalarType, this.mValue] = this.convertData(pData.literalType, pData.textValue);
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Nothing to validate 
    }

    /**
     * Apply data to current structure.
     * Any thrown error is converted into a parser error.
     * 
     * @param pData - Structure data.
     * 
     * @throws {@link Exception}
     * When a unsupported type should be set or the {@link pTextValue} value does not fit the {@link pType}.
     */
    private convertData(pType: PgslBuildInTypeName, pTextValue: string): [PgslBuildInTypeName, number] {
        switch (pType) {
            case PgslBuildInTypeName.Integer:
            case PgslBuildInTypeName.UnsignedInteger: {
                // Try to parse signed integer value.
                if (/(0[i]?)|([1-9][0-9]*[i]?)|(0[xX][0-9a-fA-F]+[i]?)/.test(pTextValue)) {
                    return [PgslBuildInTypeName.Integer, parseInt(pTextValue)];
                }

                if (/(0[u])|([1-9][0-9]*[u])|(0[xX][0-9a-fA-F]+[u])/.test(pTextValue)) {
                    return [PgslBuildInTypeName.UnsignedInteger, parseInt(pTextValue)];
                }

                throw new Exception(`Value "${pTextValue}" can not be parsed into a ${pTextValue}`, this);
            }

            case PgslBuildInTypeName.Float: {
                // Parse float non hex literals.
                if (/(0[f])|([1-9][0-9]*[f])|([0-9]*\.[0-9]+([eE][+-]?[0-9]+)?[f]?)|([0-9]+\.[0-9]*([eE][+-]?[0-9]+)?[f]?)|([0-9]+[eE][+-]?[0-9]+[f]?)/.test(pTextValue)) {
                    return [PgslBuildInTypeName.Float, parseFloat(pTextValue)];
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
                    return [PgslBuildInTypeName.Float, (lIntegerNumber + lFractureNumber) * Math.pow(2, lExponentialNumber)];
                }

                throw new Exception(`Value "${pTextValue}" can not be parsed into a ${pTextValue}`, this);
            }

            case PgslBuildInTypeName.Boolean: {
                // Validate text to be a boolean value.
                if (pTextValue !== 'true' && pTextValue !== 'false') {
                    throw new Exception(`Value "${pTextValue}" can not be parsed into a boolean.`, this);
                }

                // Set boolean values.
                return [PgslBuildInTypeName.Boolean, pTextValue === 'true' ? 1 : 0];
            }

            default: {
                throw new Exception(`Type "${pType}" not valid for literal "${pTextValue}".`, this);
            }
        }
    }
}

export type PgslLiteralValueExpressionSyntaxTreeStructureData = {
    textValue: string,
    literalType: PgslBuildInTypeName;
};