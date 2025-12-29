import { Exception } from '@kartoffelgames/core';
import { StructDeclarationAst } from '../abstract_syntax_tree/declaration/struct-declaration-ast.ts';
import type { VariableDeclarationAst } from '../abstract_syntax_tree/declaration/variable-declaration-ast.ts';
import type { DocumentAst } from '../abstract_syntax_tree/document-ast.ts';
import { PgslArrayType } from '../abstract_syntax_tree/type/pgsl-array-type.ts';
import { PgslMatrixType } from '../abstract_syntax_tree/type/pgsl-matrix-type.ts';
import { PgslNumericType } from '../abstract_syntax_tree/type/pgsl-numeric-type.ts';
import { PgslSamplerType } from '../abstract_syntax_tree/type/pgsl-sampler-type.ts';
import { PgslStructType } from '../abstract_syntax_tree/type/pgsl-struct-type.ts';
import { PgslTextureType } from '../abstract_syntax_tree/type/pgsl-texture-type.ts';
import type { IType } from '../abstract_syntax_tree/type/i-type.interface.ts';
import { PgslVectorType } from '../abstract_syntax_tree/type/pgsl-vector-type.ts';
import { PgslDeclarationType } from '../enum/pgsl-declaration-type.enum.ts';
import type { TranspilationMeta, TranspilationMetaBinding } from '../transpilation/transpilation-meta.ts';
import { PgslParserResultArrayType } from './type/pgsl-parser-result-array-type.ts';
import { PgslParserResultMatrixType } from './type/pgsl-parser-result-matrix-type.ts';
import { PgslParserResultNumericType } from './type/pgsl-parser-result-numeric-type.ts';
import { PgslParserResultSamplerType } from './type/pgsl-parser-result-sampler-type.ts';
import { type PgslParserResultStructProperty, PgslParserResultStructType } from './type/pgsl-parser-result-struct-type.ts';
import { type PgslParserResultTextureDimensionType, PgslParserResultTextureType } from './type/pgsl-parser-result-texture-type.ts';
import type { PgslParserResultType, PgslParserResultTypeAlignmentType } from './type/pgsl-parser-result-type.ts';
import { PgslParserResultVectorType } from './type/pgsl-parser-result-vector-type.ts';

/**
 * Represents a binding result from PGSL parser with type and location information.
 */
export class PgslParserResultBinding {
    private readonly mBindGroupIndex: number;
    private readonly mBindGroupName: string;
    private readonly mBindLocationIndex: number;
    private readonly mBindLocationName: string;
    private readonly mBindingType: PgslParserResultBindingType;
    private readonly mType: PgslParserResultType;

    /**
     * Gets the index of the bind group.
     *
     * @returns The bind group index.
     */
    public get bindGroupIndex(): number {
        return this.mBindGroupIndex;
    }

    /**
     * Gets the name of the bind group.
     *
     * @returns The bind group name.
     */
    public get bindGroupName(): string {
        return this.mBindGroupName;
    }

    /**
     * Gets the index of the bind location.
     *
     * @returns The bind location index.
     */
    public get bindLocationIndex(): number {
        return this.mBindLocationIndex;
    }

    /**
     * Gets the name of the bind location.
     *
     * @returns The bind location name.
     */
    public get bindLocationName(): string {
        return this.mBindLocationName;
    }

    /**
     * Gets the type of binding.
     *
     * @returns The binding type (uniform or storage).
     */
    public get bindingType(): PgslParserResultBindingType {
        return this.mBindingType;
    }

    /**
     * Gets the type information for the binding.
     *
     * @returns The parser result type.
     */
    public get type(): PgslParserResultType {
        return this.mType;
    }

    /**
     * Creates a new PGSL parser result binding.
     *
     * @param pParameters - The constructor parameters containing all binding information.
     */
    public constructor(pValue: VariableDeclarationAst, pDocument: DocumentAst, pMeta: TranspilationMeta) {
        // Convert binding type from trace.
        this.mBindingType = (() => {
            switch (pValue.data.declarationType) {
                case PgslDeclarationType.Uniform: return 'uniform';
                case PgslDeclarationType.Storage: return 'storage';
                default: throw new Exception(`Unsupported binding declaration type in PgslValueTrace: ${pValue.data.declarationType}`, this);
            }
        })();

        // Check for null binding information.
        if (pValue.data.bindingInformation === null) {
            throw new Exception(`Binding information is not defined for variable ${pValue.data.name}.`, this);
        }

        // Read binding information incides from transpilation meta.
        const lTranspilationBindings: TranspilationMetaBinding | null = pMeta.bindingOf(pValue);
        if (lTranspilationBindings === null) {
            throw new Exception(`Binding information not found in transpilation meta for variable: ${pValue.data.name}`, this);
        }

        // Set binding information.
        this.mBindGroupName = pValue.data.bindingInformation.bindGroupName;
        this.mBindGroupIndex = lTranspilationBindings.bindGroupIndex;
        this.mBindLocationName = pValue.data.bindingInformation.bindLocationName;
        this.mBindLocationIndex = lTranspilationBindings.bindingIndex;

        // Convert type.
        this.mType = this.convertType(pValue.data.type, pDocument);
    }

    /**
     * Converts a PGSL traced type to a parser result type.
     *
     * @param pType - pgsl traced type.
     *
     * @returns The parser result type.
     */
    private convertType(pType: IType, pDocument: DocumentAst, pEnforceAlignmentType?: PgslParserResultTypeAlignmentType): PgslParserResultType {
        // Convert binding type to alignment type.
        const lAlignmentType: PgslParserResultTypeAlignmentType = pEnforceAlignmentType ?? (() => {
            switch (this.mBindingType) {
                case 'uniform': return 'uniform';
                case 'storage': return 'storage';
            }
        })();

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
                const lElementType = this.convertType(pType.innerType, pDocument) as PgslParserResultNumericType;
                return new PgslParserResultVectorType(lElementType, pType.dimension, lAlignmentType);
            }

            // Matrix types.
            case pType instanceof PgslMatrixType: {
                const lElementType = this.convertType(pType.innerType, pDocument) as PgslParserResultNumericType;
                return new PgslParserResultMatrixType(lElementType, pType.rowCount, pType.columnCount, lAlignmentType);
            }

            // Array types.
            case pType instanceof PgslArrayType: {
                const lElementType = this.convertType(pType.innerType, pDocument) as PgslParserResultNumericType;
                return new PgslParserResultArrayType(lElementType, pType.length, lAlignmentType);
            }

            // Texture types.
            case pType instanceof PgslTextureType: {
                // Parse texture dimension based on PGSL texture type.
                const lDimensionType: PgslParserResultTextureDimensionType = (() => { // TODO: Maybe move this to PgslTextureType as a method?
                    switch (pType.textureType) {
                        // 1D textures
                        case PgslTextureType.typeName.texture1d:
                        case PgslTextureType.typeName.textureStorage1d: {
                            return '1d';
                        }

                        // 2D textures
                        case PgslTextureType.typeName.texture2d:
                        case PgslTextureType.typeName.textureMultisampled2d:
                        case PgslTextureType.typeName.textureExternal:
                        case PgslTextureType.typeName.textureDepth2d:
                        case PgslTextureType.typeName.textureDepthMultisampled2d:
                        case PgslTextureType.typeName.textureStorage2d: {
                            return '2d';
                        }

                        // 2D array textures
                        case PgslTextureType.typeName.texture2dArray:
                        case PgslTextureType.typeName.textureDepth2dArray:
                        case PgslTextureType.typeName.textureStorage2dArray: {
                            return '2d-array';
                        }

                        // 3D textures
                        case PgslTextureType.typeName.texture3d:
                        case PgslTextureType.typeName.textureStorage3d: {
                            return '3d';
                        }

                        // Cube textures
                        case PgslTextureType.typeName.textureCube:
                        case PgslTextureType.typeName.textureDepthCube: {
                            return 'cube';
                        }

                        // Cube array textures
                        case PgslTextureType.typeName.textureCubeArray:
                        case PgslTextureType.typeName.textureDepthCubeArray: {
                            return 'cube-array';
                        }
                    }
                })();

                // Convert sampled type.
                const lSampledType: PgslParserResultNumericType = this.convertType(pType.sampledType, pDocument, 'packed') as PgslParserResultNumericType;

                return new PgslParserResultTextureType(lDimensionType, lSampledType, pType.format);
            }

            // Sampler type
            case pType instanceof PgslSamplerType: {
                // Samplers are always packed alignment.
                return new PgslParserResultSamplerType(pType.comparison);
            }

            // Struct types.
            case pType instanceof PgslStructType: {
                const lStruct: StructDeclarationAst | null = (() => {
                    for (const lValue of pDocument.data.content) {
                        if (!(lValue instanceof StructDeclarationAst)) {
                            continue;
                        }

                        if (lValue.data.name !== pType.structName) {
                            continue;
                        }

                        return lValue;
                    }

                    return null;
                })();

                if (!lStruct) {
                    throw new Exception(`Struct trace not found for struct: ${pType.structName}`, this);
                }

                const lPropertyArray: Array<PgslParserResultStructProperty> = new Array<PgslParserResultStructProperty>();

                // Convert property types.
                for (const lStructProperty of lStruct.data.properties) {
                    // Create default property result.
                    const lPropertyResult: PgslParserResultStructProperty = {
                        name: lStructProperty.data.name,
                        type: this.convertType(lStructProperty.data.typeDeclaration.data.type, pDocument),
                    };

                    // Apply size override if present.
                    if (typeof lStructProperty.data.meta.size === 'number') {
                        lPropertyResult.sizeOverride = lStructProperty.data.meta.size;
                    }

                    // Apply alignment override if present.
                    if (typeof lStructProperty.data.meta.alignment === 'number') {
                        lPropertyResult.alignmentOverride = lStructProperty.data.meta.alignment;
                    }

                    // Add property result to array.
                    lPropertyArray.push(lPropertyResult);
                }

                return new PgslParserResultStructType(lPropertyArray, lAlignmentType);
            }

            default:
                throw new Exception(`Unsupported type in PgslParserResultBinding conversion.`, this);
        }
    }
}

export type PgslParserResultBindingType = 'uniform' | 'storage';

