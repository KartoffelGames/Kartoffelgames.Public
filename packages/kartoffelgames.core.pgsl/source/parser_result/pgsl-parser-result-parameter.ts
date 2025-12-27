import { Exception } from '@kartoffelgames/core';
import type { VariableDeclarationAst } from '../abstract_syntax_tree/declaration/variable-declaration-ast.ts';
import { PgslBooleanType } from '../abstract_syntax_tree/type/pgsl-boolean-type.ts';
import { PgslNumericType } from '../abstract_syntax_tree/type/pgsl-numeric-type.ts';
import type { PgslType } from '../abstract_syntax_tree/type/pgsl-type.ts';
import { PgslParserResultBooleanType } from './type/pgsl-parser-result-boolean-type.ts';
import { PgslParserResultNumericType } from './type/pgsl-parser-result-numeric-type.ts';
import type { PgslParserResultType } from './type/pgsl-parser-result-type.ts';

/**
 * Represents a parameter result from PGSL parser with name and type information.
 */
export class PgslParserResultParameter {
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
        this.mName = pValue.data.name;
        this.mType = this.convertType(pValue.data.type);
    }

    /**
     * Converts a PgslType to a PgslParserResultType.
     *
     * @param pType - The PgslType to convert.
     *
     * @returns The converted PgslParserResultType.
     */
    private convertType(pType: PgslType): PgslParserResultType {
        // Handle numeric types
        if (pType instanceof PgslNumericType) {
            switch (pType.numericTypeName) {
                case PgslNumericType.typeName.float32:
                    return new PgslParserResultNumericType('float', 'packed');
                case PgslNumericType.typeName.signedInteger:
                    return new PgslParserResultNumericType('integer', 'packed');
                case PgslNumericType.typeName.unsignedInteger:
                    return new PgslParserResultNumericType('unsigned-integer', 'packed');
            }
        }

        // Handle boolean type
        if (pType instanceof PgslBooleanType) {
            return new PgslParserResultBooleanType('packed');
        }

        // Any other types are not supported and should be catched by the tracer.
        throw new Exception(`Unsupported parameter type`, this);
    }
}