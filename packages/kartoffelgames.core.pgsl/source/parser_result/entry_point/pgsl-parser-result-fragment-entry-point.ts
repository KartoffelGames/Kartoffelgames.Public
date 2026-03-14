import { Exception } from '@kartoffelgames/core';
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

export class PgslParserResultFragmentEntryPoint extends PgslParserResultEntryPoint {
    private readonly mRenderTargets: Array<PgslParserResultFragmentEntryPointTargets>;

    /**
     * Gets the render targets of the fragment entry point.
     */
    public get renderTargets(): ReadonlyArray<PgslParserResultFragmentEntryPointTargets> {
        return this.mRenderTargets;
    }

    /**
     * Creates a new fragment entry point parser result instance.
     *
     * @param pFunctionDeclaration - The function declaration AST containing entry point information.
     * @param pReturnType - Fragment return struct.
     * @param pDocument - Document AST.
     * @param pMeta - Transpilation meta data.
     */
    public constructor(pFunctionDeclaration: FunctionDeclarationAstDataDeclaration, pReturnType: PgslStructType, pDocument: DocumentAst, pMeta: TranspilationMeta) {
        super('fragment', pFunctionDeclaration);

        this.mRenderTargets = this.convertRenderTargets(pReturnType, pDocument, pMeta);
    }

    /**
     * Convert fragment entry point parameters to parser result format.
     * 
     * @param pParameterType - The parameters of the fragment entry point.
     * 
     * @returns An array of PgslParserResultFragmentEntryPointTargets instances.
     */
    private convertRenderTargets(pParameterType: PgslStructType, pDocument: DocumentAst, pMeta: TranspilationMeta): Array<PgslParserResultFragmentEntryPointTargets> {
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

        const lParameters: Array<PgslParserResultFragmentEntryPointTargets> = [];

        for (const lProperty of lStruct.data.properties) {
            // Skip properties without location meta data.
            if (!lProperty.data.meta.locationName) {
                continue;
            }

            // Read or create location index for this property.
            const lLocationIndex: number = pMeta.createLocationFor(lStruct, lProperty);

            lParameters.push({
                metaValues: new Map<string, string>(lProperty.data.attributes.data.metaValues),
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
        // Build the parser result type based on the specific traced type.
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
                    throw new Exception(`Unsupported type in PgslParserResultFragmentEntryPoint conversion.`, this);
            }
        })();

        // Set packed alignment for fragment output types.
        lType.alignmentType = 'packed';

        return lType;
    }
}

type PgslParserResultFragmentEntryPointTargets = {
    metaValues: Map<string, string>
    name: string;
    location: number;
    type: PgslParserResultType;
};