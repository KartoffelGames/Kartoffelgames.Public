import { Exception } from '@kartoffelgames/core';
import type { IAnyParameterConstructor } from '../../../../kartoffelgames.core/source/interface/i-constructor.ts';
import type { IType } from '../../abstract_syntax_tree/type/i-type.interface.ts';
import { PgslArrayType } from '../../abstract_syntax_tree/type/pgsl-array-type.ts';
import { PgslBooleanType } from '../../abstract_syntax_tree/type/pgsl-boolean-type.ts';
import { PgslBuildInType } from '../../abstract_syntax_tree/type/pgsl-build-in-type.ts';
import { PgslInvalidType } from '../../abstract_syntax_tree/type/pgsl-invalid-type.ts';
import { PgslMatrixType } from '../../abstract_syntax_tree/type/pgsl-matrix-type.ts';
import { PgslNumericType } from '../../abstract_syntax_tree/type/pgsl-numeric-type.ts';
import { PgslPointerType } from '../../abstract_syntax_tree/type/pgsl-pointer-type.ts';
import { PgslSamplerType } from '../../abstract_syntax_tree/type/pgsl-sampler-type.ts';
import { PgslStringType } from '../../abstract_syntax_tree/type/pgsl-string-type.ts';
import { PgslStructType } from '../../abstract_syntax_tree/type/pgsl-struct-type.ts';
import { PgslTextureType, type PgslTextureTypeName } from '../../abstract_syntax_tree/type/pgsl-texture-type.ts';
import { PgslVectorType } from '../../abstract_syntax_tree/type/pgsl-vector-type.ts';
import { PgslVoidType } from '../../abstract_syntax_tree/type/pgsl-void-type.ts';
import { PgslAccessModeEnum } from '../../buildin/enum/pgsl-access-mode-enum.ts';
import { PgslTexelFormatEnum } from '../../buildin/enum/pgsl-texel-format-enum.ts';
import { PgslValueAddressSpace } from '../../enum/pgsl-value-address-space.enum.ts';
import type { ITranspilerProcessor, PgslTranspilerProcessorTranspile } from '../i-transpiler-processor.interface.ts';

/**
 * Function type for transpiling PGSL types to WGSL.
 */
export class TypeAstTranspilerProcessor implements ITranspilerProcessor<IType> {
    /**
     * Map of PGSL type constructors to their WGSL transpilation functions.
     */
    private readonly mTypeTranspilers: Map<IAnyParameterConstructor<IType>, TypeAstTranspilerProcessorFunction<any>>;

    /**
     * Gets the target type that this processor handles.
     */
    public get target(): Array<IAnyParameterConstructor<IType>> {
        return [
            PgslArrayType,
            PgslBooleanType,
            PgslBuildInType,
            PgslInvalidType,
            PgslMatrixType,
            PgslNumericType,
            PgslPointerType,
            PgslSamplerType,
            PgslStringType,
            PgslStructType,
            PgslTextureType,
            PgslVectorType,
            PgslVoidType,
        ];
    }

    /**
     * Creates a new type definition transpiler processor.
     */
    public constructor() {
        this.mTypeTranspilers = new Map<IAnyParameterConstructor<IType>, TypeAstTranspilerProcessorFunction<IType>>();

        // Register all type transpilers.
        this.mTypeTranspilers.set(PgslBooleanType, this.transpileBooleanType);
        this.mTypeTranspilers.set(PgslNumericType, this.transpileNumericType);
        this.mTypeTranspilers.set(PgslVectorType, this.transpileVectorType);
        this.mTypeTranspilers.set(PgslMatrixType, this.transpileMatrixType);
        this.mTypeTranspilers.set(PgslArrayType, this.transpileArrayType);
        this.mTypeTranspilers.set(PgslStructType, this.transpileStructType);
        this.mTypeTranspilers.set(PgslPointerType, this.transpilePointerType);
        this.mTypeTranspilers.set(PgslTextureType, this.transpileTextureType);
        this.mTypeTranspilers.set(PgslSamplerType, this.transpileSamplerType);
        this.mTypeTranspilers.set(PgslBuildInType, this.transpileBuildInType);

        // Invalid types.
        this.mTypeTranspilers.set(PgslVoidType, this.transpileInvalidType);
        this.mTypeTranspilers.set(PgslStringType, this.transpileInvalidType);
        this.mTypeTranspilers.set(PgslInvalidType, this.transpileInvalidType);
    }

    /**
     * Processes a PGSL type definition and transpiles it to WGSL.
     * 
     * @param pInstance - The type definition instance to transpile.
     * @param pTrace - The trace context for error reporting.
     * @param pSendResult - Function to send the transpiled result.
     * @param pTranspile - Function to transpile child nodes.
     */
    public process(pInstance: IType, pTranspile: PgslTranspilerProcessorTranspile): string {
        return this.processType(pInstance, pTranspile);
    }

    /**
     * Processes a PGSL type and transpiles it to WGSL.
     * 
     * @param pType - The PGSL type to transpile.
     * @param pTrace - The trace context for error reporting.
     * @param pSendResult - Function to send the transpiled result.
     * @param pTranspile - Function to transpile child nodes.
     */
    private processType(pType: IType, pTranspile: PgslTranspilerProcessorTranspile): string {
        // Get the appropriate transpiler for the type.
        const lTranspiler = this.mTypeTranspilers.get(pType.constructor as IAnyParameterConstructor<IType>);
        if (!lTranspiler) {
            throw new Error(`No transpilation processor found for type of type '${pType.constructor.name}'.`);
        }

        // Call the transpiler function.
        return lTranspiler.apply(this, [pType, pTranspile]);
    }

    /**
     * Transpiles array type to WGSL.
     * 
     * @param pType - The array type instance to transpile.
     * @param pTrace - The trace context for error reporting.
     * @param pTranspile - The transpile function for processing inner types.
     * 
     * @returns The WGSL array type string.
     */
    private transpileArrayType(pType: PgslArrayType, pTranspile: PgslTranspilerProcessorTranspile): string {
        // None concrete inner types are expressed as an unknown array.
        if (!pType.innerType.data.concrete) {
            return `array`;
        }

        const lInnerTypeWgsl = this.processType(pType.innerType, pTranspile);

        if (pType.length !== null) {
            // Fixed-size array
            return `array<${lInnerTypeWgsl},${pType.length}>`;
        } else {
            // Runtime-sized array
            return `array<${lInnerTypeWgsl}>`;
        }
    }

    /**
     * Transpiles boolean type to WGSL.
     * 
     * @returns The WGSL boolean type string.
     */
    private transpileBooleanType(): string {
        return 'bool';
    }


    /**
     * Transpiles built-in type to WGSL.
     * 
     * @param pType - The built-in type instance to transpile.
     * @param pTrace - The trace context for error reporting.
     * @param pTranspile - The transpile function for processing underlying types.
     * 
     * @returns The WGSL representation of the underlying type.
     */
    private transpileBuildInType(pType: PgslBuildInType, pTranspile: PgslTranspilerProcessorTranspile): string {
        // Just transpile to the underlying type.
        return this.processType(pType.underlyingType, pTranspile);
    }

    /**
     * Transpiles invalid type to WGSL.
     * 
     * @param _pType - The invalid type instance (unused).
     * @param pTrace - The trace context for error reporting.
     * 
     * @returns The fallback invalid type string.
     */
    private transpileInvalidType(_pType: IType, _pTranspile: PgslTranspilerProcessorTranspile): string {
        throw new Exception('Invalid type encountered during transpilation', this);
    }

    /**
     * Transpiles matrix type to WGSL.
     * 
     * @param pType - The matrix type instance to transpile.
     * @param pTrace - The trace context for error reporting.
     * @param pTranspile - The transpile function for processing inner types.
     * 
     * @returns The WGSL matrix type string.
     */
    private transpileMatrixType(pType: PgslMatrixType, pTranspile: PgslTranspilerProcessorTranspile): string {
        const lMatrixTypename: string = `mat${pType.columnCount}x${pType.rowCount}`;

        // None concrete inner types are expressed as unknown matrices.
        if (!pType.data.concrete) {
            return lMatrixTypename;
        }

        const lInnerTypeWgsl = this.processType(pType.innerType, pTranspile);
        return `${lMatrixTypename}<${lInnerTypeWgsl}>`;
    }

    /**
     * Transpiles numeric type to WGSL.
     * 
     * @param pType - The numeric type instance to transpile.
     * @param pTrace - The trace context for error reporting.
     * 
     * @returns The WGSL numeric type string.
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
     * @param pTrace - The trace context for error reporting.
     * @param pTranspile - The transpile function for processing referenced types.
     * 
     * @returns The WGSL pointer type string.
     */
    private transpilePointerType(pType: PgslPointerType, pTranspile: PgslTranspilerProcessorTranspile): string {
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
        const lReferencedTypeWgsl = this.processType(pType.referencedType, pTranspile);

        return `ptr<${lAddressSpace},${lReferencedTypeWgsl}>`;
    }

    /**
     * Transpiles sampler type to WGSL.
     * 
     * @param pType - The sampler type instance to transpile.
     * 
     * @returns The WGSL sampler type string.
     */
    private transpileSamplerType(pType: PgslSamplerType): string {
        if (pType.comparison) {
            return 'sampler_comparison';
        } else {
            return 'sampler';
        }
    }

    /**
     * Transpiles struct type to WGSL.
     * 
     * @param pType - The struct type instance to transpile.
     * 
     * @returns The WGSL struct type string.
     */
    private transpileStructType(pType: PgslStructType): string {
        return pType.structName;
    }

    /**
     * Transpiles texture type to WGSL.
     * 
     * @param pType - The texture type instance to transpile.
     * @param pTrace - The trace context for error reporting.
     * @param pTranspile - The transpile function for processing sampled types.
     * 
     * @returns The WGSL texture type string.
     */
    private transpileTextureType(pType: PgslTextureType, pTranspile: PgslTranspilerProcessorTranspile): string {
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
            const lSampledTypeWgsl = this.processType(pType.sampledType, pTranspile);
            return `${lWgslTextureName}<${lSampledTypeWgsl}>`;
        }

        // For storage textures, include format and access mode
        if (lWgslTextureMode === 'storage') {
            // Convert the format to WGSL format string.
            const lFormatWgsl: string = (() => {
                switch (pType.format) {
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
                switch (pType.access) {
                    case PgslAccessModeEnum.VALUES.Read: return 'read';
                    case PgslAccessModeEnum.VALUES.Write: return 'write';
                    case PgslAccessModeEnum.VALUES.ReadWrite: return 'read_write';
                }
            })();

            return `${lWgslTexture}<${lFormatWgsl},${lAccessMode}>`;
        }

        // For depth and external textures, no template parameters
        return lWgslTextureName;
    }

    /**
     * Transpiles vector type to WGSL.
     * 
     * @param pType - The vector type instance to transpile.
     * @param pTrace - The trace context for error reporting.
     * @param pTranspile - The transpile function for processing inner types.
     * 
     * @returns The WGSL vector type string.
     */
    private transpileVectorType(pType: PgslVectorType, pTranspile: PgslTranspilerProcessorTranspile): string {
        const lVectorTypename: string = `vec${pType.dimension}`;

        // None concrete inner types are expressed as unknown matrices.
        if (!pType.data.concrete) {
            return lVectorTypename;
        }

        const lInnerTypeWgsl = this.processType(pType.innerType, pTranspile);
        return `${lVectorTypename}<${lInnerTypeWgsl}>`;
    }
}

/**
 * Function type for transpiling PGSL types to WGSL.
 * 
 * @param pType - The PGSL type instance to transpile.
 * @param pTrace - The trace context for error reporting.
 * @param pTranspile - Function to transpile child nodes.
 * 
 * @returns The transpiled WGSL type string.
 */
type TypeAstTranspilerProcessorFunction<TType extends IType> = (pType: TType, pTranspile: PgslTranspilerProcessorTranspile) => string;