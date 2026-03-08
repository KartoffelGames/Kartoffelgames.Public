import { Exception } from '@kartoffelgames/core';
import type { VariableDeclarationAst } from '../abstract_syntax_tree/declaration/variable-declaration-ast.ts';
import { PgslBooleanType } from '../abstract_syntax_tree/type/pgsl-boolean-type.ts';
import { PgslNumericType } from '../abstract_syntax_tree/type/pgsl-numeric-type.ts';
import type { IType } from '../abstract_syntax_tree/type/i-type.interface.ts';
import { PgslParserResultBooleanType } from './type/pgsl-parser-result-boolean-type.ts';
import { PgslParserResultNumericType } from './type/pgsl-parser-result-numeric-type.ts';
import type { PgslParserResultType } from './type/pgsl-parser-result-type.ts';
import { PgslParserResultObject } from './pgsl-parser-result-object.ts';

/**
 * Represents a parameter result from PGSL parser with name and type information.
 */
export class PgslParserResultParameter extends PgslParserResultObject {
    private readonly mName: string;
    private readonly mType: PgslParserResultType;

    /**
     * Gets the name of the parameter.
     *
     * @returns The parameter name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Gets the type information for the parameter.
     *
     * @returns The parser result type.
     */
    public get type(): PgslParserResultType {
        return this.mType;
    }

    /**
     * Creates a new PGSL parser result parameter.
     *
     * @param pValue - The variable declaration AST containing parameter information.
     */
    public constructor(pValue: VariableDeclarationAst) {
        super(pValue.data.attributes.data.metaValues);

        this.mName = pValue.data.name;
        this.mType = this.convertType(pValue.data.type);
    }

    /**
     * Converts a IType to a PgslParserResultType.
     *
     * @param pType - The IType to convert.
     *
     * @returns The converted PgslParserResultType.
     */
    private convertType(pType: IType): PgslParserResultType {
        // Handle numeric types
        const lType = (() => {
            if (pType instanceof PgslNumericType) {
                // Build numeric type based on the specific numeric type.
                const lNumericType: PgslParserResultNumericType = new PgslParserResultNumericType();
                switch (pType.numericTypeName) {
                    case PgslNumericType.typeName.float32:
                        lNumericType.numberType = 'float';
                        break;
                    case PgslNumericType.typeName.signedInteger:
                        lNumericType.numberType = 'integer';
                        break;
                    case PgslNumericType.typeName.unsignedInteger:
                        lNumericType.numberType = 'unsigned-integer';
                        break;
                    case PgslNumericType.typeName.float16:
                        lNumericType.numberType = 'float16';
                        break;
                }

                return lNumericType;
            }

            // Handle boolean type
            if (pType instanceof PgslBooleanType) {
                return new PgslParserResultBooleanType();
            }

            // Any other types are not supported and should be catched by the tracer.
            throw new Exception(`Unsupported parameter type`, this);
        })();

        // Set alignment type on the result.
        lType.alignmentType = 'packed';

        return lType;
    }
}