import { Exception } from "@kartoffelgames/core";
import { PgslDeclarationType } from "../enum/pgsl-declaration-type.enum.ts";
import { PgslParserResultType, PgslParserResultTypeAlignmentType } from "./type/pgsl-parser-result-type.ts";
import { PgslType } from "../type/pgsl-type.ts";
import { PgslNumericType } from "../type/pgsl-numeric-type.ts";
import { PgslParserResultNumericType } from "./type/pgsl-parser-result-numeric-type.ts";
import { PgslVectorType } from "../type/pgsl-vector-type.ts";
import { PgslParserResultVectorType } from "./type/pgsl-parser-result-vector-type.ts";
import { PgslMatrixType } from "../type/pgsl-matrix-type.ts";
import { PgslParserResultMatrixType } from "./type/pgsl-parser-result-matrix-type.ts";
import { PgslArrayType } from "../type/pgsl-array-type.ts";
import { PgslParserResultArrayType } from "./type/pgsl-parser-result-array-type.ts";
import { PgslStructType } from "../type/pgsl-struct-type.ts";
import { PgslParserResultStructProperty, PgslParserResultStructType } from "./type/pgsl-parser-result-struct-type.ts";
import { PgslSamplerType } from "../type/pgsl-sampler-type.ts";
import { PgslParserResultSamplerType } from "./type/pgsl-parser-result-sampler-type.ts";
import { PgslTextureType } from "../type/pgsl-texture-type.ts";
import { PgslParserResultTextureDimensionType, PgslParserResultTextureType } from "./type/pgsl-parser-result-texture-type.ts";

/**
 * Represents a binding result from PGSL parser with type and location information.
 */
export class PgslParserResultBinding {
    private readonly mType: PgslParserResultType;
    private readonly mBindingType: PgslParserResultBindingType;
    private readonly mBindGroupName: string;
    private readonly mBindGroupIndex: number;
    private readonly mBindLocationName: string;
    private readonly mBindLocationIndex: number;

    /**
     * Gets the type information for the binding.
     *
     * @returns The parser result type.
     */
    public get type(): PgslParserResultType {
        return this.mType;
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
     * Gets the name of the bind group.
     *
     * @returns The bind group name.
     */
    public get bindGroupName(): string {
        return this.mBindGroupName;
    }

    /**
     * Gets the index of the bind group.
     *
     * @returns The bind group index.
     */
    public get bindGroupIndex(): number {
        return this.mBindGroupIndex;
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
     * Gets the index of the bind location.
     *
     * @returns The bind location index.
     */
    public get bindLocationIndex(): number {
        return this.mBindLocationIndex;
    }

    /**
     * Creates a new PGSL parser result binding.
     *
     * @param pParameters - The constructor parameters containing all binding information.
     */
    public constructor(pBinding: PgslValueTrace, pTrace: PgslTrace) {
        // Convert binding type from trace.
        this.mBindingType = (() => {
            switch (pBinding.declarationType) {
                case PgslDeclarationType.Uniform: return 'uniform';
                case PgslDeclarationType.Storage: return 'storage';
                default: throw new Exception(`Unsupported binding declaration type in PgslValueTrace: ${pBinding.declarationType}`, this);
            }
        })();

        // Check for null binding information.
        if (pBinding.bindingInformation === null) {
            throw new Exception('Binding information is null in PgslValueTrace.', this);
        }

        // Set binding information.
        this.mBindGroupName = pBinding.bindingInformation.bindGroupName;
        this.mBindGroupIndex = pBinding.bindingInformation.bindGroupIndex;
        this.mBindLocationName = pBinding.bindingInformation.bindLocationName;
        this.mBindLocationIndex = pBinding.bindingInformation.bindLocationIndex;

        // Convert type.
        this.mType = this.convertType(pBinding.type, pTrace);
    }

    /**
     * Converts a PGSL traced type to a parser result type.
     *
     * @param pType - pgsl traced type.
     *
     * @returns The parser result type.
     */
    private convertType(pType: PgslType, pTrace: PgslTrace, pEnforceAlignmentType?: PgslParserResultTypeAlignmentType): PgslParserResultType {
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
                const elementType = this.convertType(pType.innerType, pTrace) as PgslParserResultNumericType;
                return new PgslParserResultVectorType(elementType, pType.dimension, lAlignmentType);
            }

            // Matrix types.
            case pType instanceof PgslMatrixType: {
                const elementType = this.convertType(pType.innerType, pTrace) as PgslParserResultNumericType;
                return new PgslParserResultMatrixType(elementType, pType.rowCount, pType.columnCount, lAlignmentType);
            }

            // Array types.
            case pType instanceof PgslArrayType: {
                const elementType = this.convertType(pType.innerType, pTrace) as PgslParserResultNumericType;
                return new PgslParserResultArrayType(elementType, pType.length, lAlignmentType);
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
                        case PgslTextureType.typeName.textureStorage2dArray:{
                            return '2d-array';
                        }

                        // 3D textures
                        case PgslTextureType.typeName.texture3d:
                        case PgslTextureType.typeName.textureStorage3d:{
                            return '3d';
                        }

                        // Cube textures
                        case PgslTextureType.typeName.textureCube:
                        case PgslTextureType.typeName.textureDepthCube:{
                            return 'cube';
                        }

                        // Cube array textures
                        case PgslTextureType.typeName.textureCubeArray:
                        case PgslTextureType.typeName.textureDepthCubeArray:{
                            return 'cube-array';
                        }
                    }
                })();

                // Convert sampled type.
                const lSampledType: PgslParserResultNumericType = this.convertType(pType.sampledType, pTrace, 'packed') as PgslParserResultNumericType;

                return new PgslParserResultTextureType(lDimensionType, lSampledType, pType.format);
            }

            // Sampler type
            case pType instanceof PgslSamplerType: {
                // Samplers are always packed alignment.
                return new PgslParserResultSamplerType(pType.comparison);
            }

            // Struct types.
            case pType instanceof PgslStructType: {
                const lStruct: PgslStructTrace | undefined = pTrace.getStruct(pType.structName);
                if (!lStruct) {
                    throw new Exception(`Struct trace not found for struct: ${pType.structName}`, this);
                }

                const lPropertyArray: Array<PgslParserResultStructProperty> = new Array<PgslParserResultStructProperty>();

                // Convert property types.
                for (const lStructPropertyDeclaration of lStruct.declaration.properties) {
                    const lStructProperty: PgslStructPropertyTrace = pTrace.getStructProperty(lStructPropertyDeclaration); // TODO: THIS SHIT NEEDS TO BE CLEANED UP ASAP!!!

                    // Create default property result.
                    const lPropertyResult: PgslParserResultStructProperty = {
                        name: lStructProperty.name,
                        type: this.convertType(lStructProperty.type, pTrace),
                    };

                    // Apply size override if present.
                    if (typeof lStructProperty.meta.size === 'number') {
                        lPropertyResult.sizeOverride = lStructProperty.meta.size;
                    }

                    // Apply alignment override if present.
                    if (typeof lStructProperty.meta.alignment === 'number') {
                        lPropertyResult.alignmentOverride = lStructProperty.meta.alignment;
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

