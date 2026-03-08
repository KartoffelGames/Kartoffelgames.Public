import { Exception } from '../../../../kartoffelgames.core/source/exception/exception.ts';
import type { FunctionDeclarationAstDataDeclaration } from '../../abstract_syntax_tree/declaration/function-declaration-ast.ts';
import { StructDeclarationAst } from '../../abstract_syntax_tree/declaration/struct-declaration-ast.ts';
import type { DocumentAst } from '../../abstract_syntax_tree/document-ast.ts';
import type { IType } from '../../abstract_syntax_tree/type/i-type.interface.ts';
import { PgslNumericType } from '../../abstract_syntax_tree/type/pgsl-numeric-type.ts';
import type { PgslStructType } from '../../abstract_syntax_tree/type/pgsl-struct-type.ts';
import { PgslVectorType } from '../../abstract_syntax_tree/type/pgsl-vector-type.ts';
import type { TranspilationMeta } from '../../transpilation/transpilation-meta.ts';
import { PgslParserResultNumericType } from '../type/pgsl-parser-result-numeric-type.ts';
import type { PgslParserResultType } from '../type/pgsl-parser-result-type.ts';
import { PgslParserResultVectorType } from '../type/pgsl-parser-result-vector-type.ts';
import { PgslParserResultEntryPoint } from './pgsl-parser-result-entry-point.ts';

export class PgslParserResultVertexEntryPoint extends PgslParserResultEntryPoint {
    private readonly mParameters: Array<PgslParserResultVertexEntryPointParameter>;

    /**
     * Gets the parameters of the vertex entry point.
     */
    public get parameters(): ReadonlyArray<PgslParserResultVertexEntryPointParameter> {
        return this.mParameters;
    }

    /**
     * Creates a new vertex entry point parser result instance.
     * 
     * @param pFunctionDeclaration - The function declaration AST containing entry point information.
     * @param pParameters - Vertex parameter struct.
     */
    public constructor(pFunctionDeclaration: FunctionDeclarationAstDataDeclaration, pParameters: PgslStructType, pDocument: DocumentAst, pMeta: TranspilationMeta) {
        super('vertex', pFunctionDeclaration);

        this.mParameters = this.convertParameters(pParameters, pDocument, pMeta);
    }

    /**
     * Convert vertex entry point parameters to parser result format.
     * 
     * @param pParameterType - The parameters of the vertex entry point.
     * 
     * @returns An array of PgslParserResultVertexEntryPointParameter instances.
     */
    public convertParameters(pParameterType: PgslStructType, pDocument: DocumentAst, pMeta: TranspilationMeta): Array<PgslParserResultVertexEntryPointParameter> {
        // Try to find struct declaration for parameter type.
        const lStruct: StructDeclarationAst | null = (() => {
            for (const lValue of pDocument.data.content) {
                if (!(lValue instanceof StructDeclarationAst)) {
                    continue;
                }

                if (lValue.data.name !== pParameterType.structName) {
                    continue;
                }

                return lValue;
            }

            return null;
        })();

        // Validate struct existence.
        if (!lStruct) {
            throw new Exception(`Struct not found for struct: ${pParameterType.structName}`, this);
        }

        const lParameters: Array<PgslParserResultVertexEntryPointParameter> = [];

        for (const lProperty of lStruct.data.properties) {
            // Skip properties without location meta data.
            if (!lProperty.data.meta.locationName) {
                continue;
            }

            // Read or create location index for this property.
            const lLocationIndex: number = pMeta.createLocationFor(lStruct, lProperty);

            lParameters.push({
                name: lProperty.data.name,
                location: lLocationIndex,
                type: this.convertType(lProperty.data.typeDeclaration.data.type)
            });
        }

        return lParameters;
    }

    /**
     * Converts a PGSL traced type to a parser result type.
     *
     * @param pType - pgsl traced type.
     *
     * @returns The parser result type.
     */
    private convertType(pType: IType): PgslParserResultType {
        const lType: PgslParserResultType = (() => {
            switch (true) {
                // Numeric types.
                case pType instanceof PgslNumericType: {
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

                // Vector types.
                case pType instanceof PgslVectorType: {
                    const lElementType = this.convertType(pType.innerType) as PgslParserResultNumericType;
                    return new PgslParserResultVectorType(lElementType, pType.dimension);
                }

                default:
                    throw new Exception(`Unsupported type in PgslParserResultVertexEntryPoint conversion.`, this);
            }
        })();

        // Set packed alignment for fragment output types.
        lType.alignmentType = 'packed';

        return lType;
    }
}

type PgslParserResultVertexEntryPointParameter = {
    name: string;
    location: number;
    type: PgslParserResultType;
};