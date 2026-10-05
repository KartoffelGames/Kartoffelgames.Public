import { Exception } from '@kartoffelgames/core';
import { TypeDeclarationAst } from '../../../abstract_syntax_tree/general/type-declaration-ast.ts';
import { type BasePgslType, BasePgslTypeKind } from '../../../abstract_syntax_tree/type/definition/base-pgsl-type.ts';
import { PgslArrayType } from '../../../abstract_syntax_tree/type/definition/pgsl-array-type.ts';
import { PgslBooleanType } from '../../../abstract_syntax_tree/type/definition/pgsl-boolean-type.ts';
import { PgslBuildInType } from '../../../abstract_syntax_tree/type/definition/pgsl-build-in-type.ts';
import { PgslInvalidType } from '../../../abstract_syntax_tree/type/definition/pgsl-invalid-type.ts';
import { PgslMatrixType } from '../../../abstract_syntax_tree/type/definition/pgsl-matrix-type.ts';
import { PgslNumericType } from '../../../abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslPointerType } from '../../../abstract_syntax_tree/type/definition/pgsl-pointer-type.ts';
import { PgslSamplerType } from '../../../abstract_syntax_tree/type/definition/pgsl-sampler-type.ts';
import { PgslStringType } from '../../../abstract_syntax_tree/type/definition/pgsl-string-type.ts';
import { PgslStructType } from '../../../abstract_syntax_tree/type/definition/pgsl-struct-type.ts';
import { PgslTextureType, type PgslTextureTypeName, type PgslTextureTypeStorage } from '../../../abstract_syntax_tree/type/definition/pgsl-texture-type.ts';
import { PgslVectorType } from '../../../abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslVoidType } from '../../../abstract_syntax_tree/type/definition/pgsl-void-type.ts';
import { PgslAccessModeEnum } from '../../../feature_set/enum/pgsl-access-mode-enum.ts';
import { PgslTexelFormatEnum } from '../../../feature_set/enum/pgsl-texel-format-enum.ts';
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import { TranspilerProcessor } from '../../transpiler-processor.ts';

/**
 * Transpiles PGSL type declarations and the types they resolve to into WGSL.
 */
export class TypeDeclarationAstTranspilerProcessor extends TranspilerProcessor<TypeDeclarationAst> {
    /**
     * Gets the target type that this processor handles.
     */
    public get target(): typeof TypeDeclarationAst {
        return TypeDeclarationAst;
    }

    /**
     * Processes a PGSL type declaration and transpiles its resolved type to WGSL.
     *
     * @param pInstance - The type declaration instance to transpile.
     *
     * @returns The transpiled WGSL type string.
     */
    protected override onProcess(pInstance: TypeDeclarationAst): string {
        return this.transpileType(pInstance.data.type);
    }

    /**
     * Transpiles array type to WGSL.
     *
     * @param pType - The array type instance to transpile.
     *
     * @returns The WGSL array type string.
     */
    private transpileArrayType(pType: PgslArrayType): string {
        // None concrete inner types are expressed as an unknown array.
        if (!pType.innerType.isKind(BasePgslTypeKind.Concrete)) {
            return `array`;
        }

        const lInnerTypeWgsl: string = this.transpileType(pType.innerType);

        if (pType.length !== null) {
            // Fixed-size array
            return `array<${lInnerTypeWgsl},${pType.length}>`;
        } else {
            // Runtime-sized array
            return `array<${lInnerTypeWgsl}>`;
        }
    }

    /**
     * Transpiles matrix type to WGSL.
     *
     * @param pType - The matrix type instance to transpile.
     *
     * @returns The WGSL matrix type string.
     */
    private transpileMatrixType(pType: PgslMatrixType): string {
        const lMatrixTypename: string = `mat${pType.columnCount}x${pType.rowCount}`;

        // None concrete inner types are expressed as unknown matrices.
        if (!pType.isKind(BasePgslTypeKind.Concrete)) {
            return lMatrixTypename;
        }

        const lInnerTypeWgsl: string = this.transpileType(pType.innerType);
        return `${lMatrixTypename}<${lInnerTypeWgsl}>`;
    }

    /**
     * Transpiles numeric type to WGSL.
     *
     * @param pType - The numeric type instance to transpile.
     *
     * @returns The WGSL numeric type string.
     *
     * @throws {Exception} Abstract numeric types should not appear in WGSL output.
     */
    private transpileNumericType(pType: PgslNumericType): string {
        switch (pType.numericTypeName) {
            case PgslNumericType.typeName.signedInteger: return 'i32';
            case PgslNumericType.typeName.unsignedInteger: return 'u32';
            case PgslNumericType.typeName.float16: return 'f16';
            case PgslNumericType.typeName.float32: return 'f32';

            // Invalid types.
            default:
                throw new Exception(`Numeric type ${pType.numericTypeName} should not appear in WGSL output`, this);
        }
    }

    /**
     * Transpiles pointer type to WGSL.
     *
     * @param pType - The pointer type instance to transpile.
     *
     * @returns The WGSL pointer type string.
     */
    private transpilePointerType(pType: PgslPointerType): string {
        // Convert address space.
        const lAddressSpace: string = (() => {
            switch (pType.assignedAddressSpace) {
                case PgslValueAddressSpace.Function: return 'function';
                case PgslValueAddressSpace.Module: return 'private';
                case PgslValueAddressSpace.Workgroup: return 'workgroup';
                case PgslValueAddressSpace.Uniform: return 'uniform';
                case PgslValueAddressSpace.Storage: return 'storage';
                case PgslValueAddressSpace.Texture: return 'handle';
                case PgslValueAddressSpace.Inherit: return '__UNKNOWN__';
            }
        })();

        // Transpile the referenced type.
        const lReferencedTypeWgsl: string = this.transpileType(pType.referencedType);

        return `ptr<${lAddressSpace},${lReferencedTypeWgsl}>`;
    }

    /**
     * Transpiles sampler type to WGSL.
     *
     * @param pType - The sampler type instance to transpile.
     *
     * @returns The WGSL sampler type string ("sampler" or "sampler_comparison").
     */
    private transpileSamplerType(pType: PgslSamplerType): string {
        if (pType.comparison) {
            return 'sampler_comparison';
        } else {
            return 'sampler';
        }
    }

    /**
     * Transpiles texture type to WGSL.
     *
     * @param pType - The texture type instance to transpile.
     *
     * @returns The WGSL texture type string.
     *
     * @throws {Exception} If texture type is not supported for WGSL transpilation.
     */
    private transpileTextureType(pType: PgslTextureType): string {
        // Texture mode where depth also counts as a external texture.
        type TextureMode = 'depth' | 'storage' | 'regular';

        const lTextureMapping: Record<PgslTextureTypeName, [string, TextureMode]> = {
            // Regular textures
            'Texture1d': ['texture_1d', 'regular'],
            'Texture2d': ['texture_2d', 'regular'],
            'Texture2dArray': ['texture_2d_array', 'regular'],
            'Texture3d': ['texture_3d', 'regular'],
            'TextureCube': ['texture_cube', 'regular'],
            'TextureCubeArray': ['texture_cube_array', 'regular'],
            'TextureMultisampled2d': ['texture_multisampled_2d', 'regular'],
            'TextureExternal': ['texture_external', 'regular'],

            // Depth textures
            'TextureDepth2d': ['texture_depth_2d', 'depth'],
            'TextureDepth2dArray': ['texture_depth_2d_array', 'depth'],
            'TextureDepthCube': ['texture_depth_cube', 'depth'],
            'TextureDepthCubeArray': ['texture_depth_cube_array', 'depth'],
            'TextureDepthMultisampled2d': ['texture_depth_multisampled_2d', 'depth'],

            // Storage textures
            'TextureStorage1d': ['texture_storage_1d', 'storage'],
            'TextureStorage2d': ['texture_storage_2d', 'storage'],
            'TextureStorage2dArray': ['texture_storage_2d_array', 'storage'],
            'TextureStorage3d': ['texture_storage_3d', 'storage']
        };

        // Map PGSL texture names to WGSL texture names
        const lWgslTexture: [name: string, mode: TextureMode] | undefined = lTextureMapping[pType.textureType];
        if (!lWgslTexture) {
            throw new Exception(`Unsupported texture type for WGSL transpilation: ${pType.textureType}`, this);
        }

        const [lWgslTextureName, lWgslTextureMode] = lWgslTexture;

        // For regular textures, include the sampled type
        if (lWgslTextureMode === 'regular') {
            const lSampledTypeWgsl: string = this.transpileType(pType.sampledType);
            return `${lWgslTextureName}<${lSampledTypeWgsl}>`;
        }

        // For storage textures, include format and access mode
        if (lWgslTextureMode === 'storage') {
            // Storage textures always carry a format and access mode.
            const lStorage: PgslTextureTypeStorage | null = pType.storage;
            if (!lStorage) {
                throw new Exception(`Storage texture "${pType.textureType}" has no texel format and access mode.`, this);
            }

            // Convert the format to WGSL format string.
            const lFormatWgsl: string = (() => {
                switch (lStorage.format) {
                    case PgslTexelFormatEnum.VALUES.Rgba8unorm: return 'rgba8unorm';
                    case PgslTexelFormatEnum.VALUES.Rgba8snorm: return 'rgba8snorm';
                    case PgslTexelFormatEnum.VALUES.Rgba8uint: return 'rgba8uint';
                    case PgslTexelFormatEnum.VALUES.Rgba8sint: return 'rgba8sint';
                    case PgslTexelFormatEnum.VALUES.Rgba16unorm: return 'rgba16unorm';
                    case PgslTexelFormatEnum.VALUES.Rgba16snorm: return 'rgba16snorm';
                    case PgslTexelFormatEnum.VALUES.Rgba16uint: return 'rgba16uint';
                    case PgslTexelFormatEnum.VALUES.Rgba16sint: return 'rgba16sint';
                    case PgslTexelFormatEnum.VALUES.Rgba16float: return 'rgba16float';
                    case PgslTexelFormatEnum.VALUES.Rg8unorm: return 'rg8unorm';
                    case PgslTexelFormatEnum.VALUES.Rg8snorm: return 'rg8snorm';
                    case PgslTexelFormatEnum.VALUES.Rg8uint: return 'rg8uint';
                    case PgslTexelFormatEnum.VALUES.Rg8sint: return 'rg8sint';
                    case PgslTexelFormatEnum.VALUES.Rg16unorm: return 'rg16unorm';
                    case PgslTexelFormatEnum.VALUES.Rg16snorm: return 'rg16snorm';
                    case PgslTexelFormatEnum.VALUES.Rg16uint: return 'rg16uint';
                    case PgslTexelFormatEnum.VALUES.Rg16sint: return 'rg16sint';
                    case PgslTexelFormatEnum.VALUES.Rg16float: return 'rg16float';
                    case PgslTexelFormatEnum.VALUES.R32uint: return 'r32uint';
                    case PgslTexelFormatEnum.VALUES.R32sint: return 'r32sint';
                    case PgslTexelFormatEnum.VALUES.R32float: return 'r32float';
                    case PgslTexelFormatEnum.VALUES.Rg32uint: return 'rg32uint';
                    case PgslTexelFormatEnum.VALUES.Rg32sint: return 'rg32sint';
                    case PgslTexelFormatEnum.VALUES.Rg32float: return 'rg32float';
                    case PgslTexelFormatEnum.VALUES.Rgba32uint: return 'rgba32uint';
                    case PgslTexelFormatEnum.VALUES.Rgba32sint: return 'rgba32sint';
                    case PgslTexelFormatEnum.VALUES.Rgba32float: return 'rgba32float';
                    case PgslTexelFormatEnum.VALUES.Bgra8unorm: return 'bgra8unorm';
                    case PgslTexelFormatEnum.VALUES.R8unorm: return 'r8unorm';
                    case PgslTexelFormatEnum.VALUES.R8snorm: return 'r8snorm';
                    case PgslTexelFormatEnum.VALUES.R8uint: return 'r8uint';
                    case PgslTexelFormatEnum.VALUES.R8sint: return 'r8sint';
                    case PgslTexelFormatEnum.VALUES.R16unorm: return 'r16unorm';
                    case PgslTexelFormatEnum.VALUES.R16snorm: return 'r16snorm';
                    case PgslTexelFormatEnum.VALUES.R16uint: return 'r16uint';
                    case PgslTexelFormatEnum.VALUES.R16sint: return 'r16sint';
                    case PgslTexelFormatEnum.VALUES.R16float: return 'r16float';
                    case PgslTexelFormatEnum.VALUES.Rgb10a2unorm: return 'rgb10a2unorm';
                    case PgslTexelFormatEnum.VALUES.Rgb10a2uint: return 'rgb10a2uint';
                    case PgslTexelFormatEnum.VALUES.Rg11b10ufloat: return 'rg11b10ufloat';
                }
            })();

            // Convert the access mode to WGSL access mode string.
            const lAccessMode = (() => {
                switch (lStorage.access) {
                    case PgslAccessModeEnum.VALUES.Read: return 'read';
                    case PgslAccessModeEnum.VALUES.Write: return 'write';
                    case PgslAccessModeEnum.VALUES.ReadWrite: return 'read_write';
                }
            })();

            return `${lWgslTextureName}<${lFormatWgsl},${lAccessMode}>`;
        }

        // For depth and external textures, no template parameters
        return lWgslTextureName;
    }

    /**
     * Transpiles a PGSL type into its WGSL type string.
     * Dispatches to the type specific transpilation, also used for inner types.
     *
     * @param pType - The PGSL type to transpile.
     *
     * @returns The transpiled WGSL type string.
     *
     * @throws {Exception} When the type has no WGSL representation.
     */
    private transpileType(pType: BasePgslType): string {
        switch (true) {
            case pType instanceof PgslArrayType: return this.transpileArrayType(pType);
            case pType instanceof PgslBooleanType: return 'bool';
            case pType instanceof PgslMatrixType: return this.transpileMatrixType(pType);
            case pType instanceof PgslNumericType: return this.transpileNumericType(pType);
            case pType instanceof PgslPointerType: return this.transpilePointerType(pType);
            case pType instanceof PgslSamplerType: return this.transpileSamplerType(pType);
            case pType instanceof PgslStructType: return pType.structName;
            case pType instanceof PgslTextureType: return this.transpileTextureType(pType);
            case pType instanceof PgslVectorType: return this.transpileVectorType(pType);

            // Build in types are resolved to their underlying type by the type declaration.
            case pType instanceof PgslBuildInType: {
                throw new Exception('Build in type can not be transpiled directly', this);
            }

            // Invalid types.
            case pType instanceof PgslInvalidType:
            case pType instanceof PgslStringType:
            case pType instanceof PgslVoidType: {
                throw new Exception('Invalid type encountered during transpilation', this);
            }
        }

        throw new Exception(`No transpilation found for type '${pType.constructor.name}'.`, this);
    }

    /**
     * Transpiles vector type to WGSL.
     *
     * @param pType - The vector type instance to transpile.
     *
     * @returns The WGSL vector type string.
     */
    private transpileVectorType(pType: PgslVectorType): string {
        const lVectorTypename: string = `vec${pType.dimension}`;

        // None concrete inner types are expressed as unknown matrices.
        if (!pType.isKind(BasePgslTypeKind.Concrete)) {
            return lVectorTypename;
        }

        const lInnerTypeWgsl: string = this.transpileType(pType.innerType);
        return `${lVectorTypename}<${lInnerTypeWgsl}>`;
    }
}
