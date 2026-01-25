import { Exception } from '../../../../kartoffelgames.core/source/exception/exception.ts';
import { StructDeclarationAst } from '../../abstract_syntax_tree/declaration/struct-declaration-ast.ts';
import type { DocumentAst } from '../../abstract_syntax_tree/document-ast.ts';
import type { IType } from '../../abstract_syntax_tree/type/i-type.interface.ts';
import { PgslNumericType } from '../../abstract_syntax_tree/type/pgsl-numeric-type.ts';
import type { PgslStructType } from '../../abstract_syntax_tree/type/pgsl-struct-type.ts';
import { PgslVectorType } from '../../abstract_syntax_tree/type/pgsl-vector-type.ts';
import type { TranspilationMeta } from '../../transpilation/transpilation-meta.ts';
import { PgslParserResultNumericType } from '../type/pgsl-parser-result-numeric-type.ts';
import type { PgslParserResultType, PgslParserResultTypeAlignmentType } from '../type/pgsl-parser-result-type.ts';
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
     * @param pName - Entry point name.
     * @param pParameters - Vertex parameter struct.
     */
    public constructor(pName: string, pParameters: PgslStructType, pDocument: DocumentAst, pMeta: TranspilationMeta) {
        super('vertex', pName);

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
        // Convert binding type to alignment type.
        const lAlignmentType: PgslParserResultTypeAlignmentType = 'packed';

        switch (true) {
            // Numeric types.
            case pType instanceof PgslNumericType: {
                switch (pType.numericTypeName) {
                    case PgslNumericType.typeName.float32:
                        return new PgslParserResultNumericType('float', lAlignmentType);
                    case PgslNumericType.typeName.signedInteger:
                        return new PgslParserResultNumericType('integer', lAlignmentType);
                    case PgslNumericType.typeName.unsignedInteger:
                        return new PgslParserResultNumericType('unsigned-integer', lAlignmentType);
                }
                throw new Exception(`Unsupported numeric type in PgslNumericType: ${pType.numericTypeName}`, this);
            }

            // Vector types.
            case pType instanceof PgslVectorType: {
                const lElementType = this.convertType(pType.innerType) as PgslParserResultNumericType;
                return new PgslParserResultVectorType(lElementType, pType.dimension, lAlignmentType);
            }

            default:
                throw new Exception(`Unsupported type in PgslParserResultVertexEntryPoint conversion.`, this);
        }
    }
}

type PgslParserResultVertexEntryPointParameter = {
    name: string;
    location: number;
    type: PgslParserResultType;
};