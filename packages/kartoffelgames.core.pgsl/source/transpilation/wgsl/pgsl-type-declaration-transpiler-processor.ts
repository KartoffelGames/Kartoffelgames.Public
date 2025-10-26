import type { IAnyParameterConstructor } from '../../../../kartoffelgames.core/source/interface/i-constructor.ts';
import { PgslValueAddressSpace } from '../../enum/pgsl-value-address-space.enum.ts';
import { PgslAccessMode } from '../../syntax_tree/buildin/pgsl-access-mode.enum.ts';
import { PgslTexelFormat } from '../../syntax_tree/buildin/pgsl-texel-format.enum.ts';
import { PgslTypeDeclaration } from '../../syntax_tree/general/pgsl-type-declaration.ts';
import type { PgslTrace } from '../../trace/pgsl-trace.ts';
import { PgslArrayType } from '../../type/pgsl-array-type.ts';
import { PgslBooleanType } from '../../type/pgsl-boolean-type.ts';
import { PgslBuildInType } from '../../type/pgsl-build-in-type.ts';
import { PgslInvalidType } from '../../type/pgsl-invalid-type.ts';
import { PgslMatrixType } from '../../type/pgsl-matrix-type.ts';
import { PgslNumericType } from '../../type/pgsl-numeric-type.ts';
import { PgslPointerType } from '../../type/pgsl-pointer-type.ts';
import { PgslSamplerType } from '../../type/pgsl-sampler-type.ts';
import { PgslStringType } from '../../type/pgsl-string-type.ts';
import { PgslStructType } from '../../type/pgsl-struct-type.ts';
import { PgslTextureType, type PgslTextureTypeName } from '../../type/pgsl-texture-type.ts';
import type { PgslType } from '../../type/pgsl-type.ts';
import { PgslVectorType } from '../../type/pgsl-vector-type.ts';
import { PgslVoidType } from '../../type/pgsl-void-type.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../i-pgsl-transpiler-processor.interface.ts';

/**
 * Function type for transpiling PGSL types to WGSL.
 */
export class PgslTypeDeclarationTranspilerProcessor implements IPgslTranspilerProcessor<PgslTypeDeclaration> {
    /**
     * Fallback WGSL type for invalid or unsupported types.
     */
    private static readonly INVALID_TYPE = 'invalid_type';

    /**
     * Map of PGSL type constructors to their WGSL transpilation functions.
     */
    private readonly mTypeTranspilers: Map<IAnyParameterConstructor<PgslType>, PgslTypeTranspilerFunction<any>>;

    /**
     * Gets the target type that this processor handles.
     */
    public get target(): typeof PgslTypeDeclaration {
        return PgslTypeDeclaration;
    }

    /**
     * Creates a new type definition transpiler processor.
     */
    public constructor() {
        this.mTypeTranspilers = new Map<IAnyParameterConstructor<PgslType>, PgslTypeTranspilerFunction<PgslType>>();

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
    public process(pInstance: PgslTypeDeclaration, pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        return this.processType(pInstance.type, pInstance, pTrace, pTranspile);
    }

    /**
     * Processes a PGSL type and transpiles it to WGSL.
     * 
     * @param pType - The PGSL type to transpile.
     * @param pDefinition - The type definition instance.
     * @param pTrace - The trace context for error reporting.
     * @param pSendResult - Function to send the transpiled result.
     * @param pTranspile - Function to transpile child nodes.
     */
    private processType(pType: PgslType, pDefinition: PgslTypeDeclaration, pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        // Get the appropriate transpiler for the type.
        const lTranspiler = this.mTypeTranspilers.get(pType.constructor as IAnyParameterConstructor<PgslType>);
        if (!lTranspiler) {
            throw new Error(`No transpilation processor found for type of type '${pType.constructor.name}'.`);
        }

        // Call the transpiler function.
        return lTranspiler(pType, pTrace, pDefinition, pTranspile);
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
     * Transpiles numeric type to WGSL.
     * 
     * @param pType - The numeric type instance to transpile.
     * @param pTrace - The trace context for error reporting.
     * @param pDefinition - The type definition instance for error context.
     * 
     * @returns The WGSL numeric type string.
     */
    private transpileNumericType(pType: PgslNumericType, pTrace: PgslTrace, pDefinition: PgslTypeDeclaration): string {
        switch (pType.numericTypeName) {
            case PgslNumericType.typeName.signedInteger: return 'i32';
            case PgslNumericType.typeName.unsignedInteger: return 'u32';
            case PgslNumericType.typeName.float16: return 'f16';
            case PgslNumericType.typeName.float32: return 'f32';

            // Invalid types.
            default:
                pTrace.pushIncident(`Numeric type ${pType.numericTypeName} should not appear in WGSL output`, pDefinition);
                return PgslTypeDeclarationTranspilerProcessor.INVALID_TYPE;
        }
    }

    /**
     * Transpiles vector type to WGSL.
     * 
     * @param pType - The vector type instance to transpile.
     * @param pTrace - The trace context for error reporting.
     * @param pDefinition - The type definition instance for context.
     * @param pTranspile - The transpile function for processing inner types.
     * 
     * @returns The WGSL vector type string.
     */
    private transpileVectorType(pType: PgslVectorType, pTrace: PgslTrace, pDefinition: PgslTypeDeclaration, pTranspile: PgslTranspilerProcessorTranspile): string {
        const lInnerTypeWgsl = this.processType(pType.innerType, pDefinition, pTrace, pTranspile);
        return `vec${pType.dimension}<${lInnerTypeWgsl}>`;
    }

    /**
     * Transpiles matrix type to WGSL.
     * 
     * @param pType - The matrix type instance to transpile.
     * @param pTrace - The trace context for error reporting.
     * @param pDefinition - The type definition instance for context.
     * @param pTranspile - The transpile function for processing inner types.
     * 
     * @returns The WGSL matrix type string.
     */
    private transpileMatrixType(pType: PgslMatrixType, pTrace: PgslTrace, pDefinition: PgslTypeDeclaration, pTranspile: PgslTranspilerProcessorTranspile): string {
        const lInnerTypeWgsl = this.processType(pType.innerType, pDefinition, pTrace, pTranspile);
        return `mat${pType.rowCount}x${pType.columnCount}<${lInnerTypeWgsl}>`;
    }

    /**
     * Transpiles array type to WGSL.
     * 
     * @param pType - The array type instance to transpile.
     * @param pTrace - The trace context for error reporting.
     * @param pDefinition - The type definition instance for context.
     * @param pTranspile - The transpile function for processing inner types.
     * 
     * @returns The WGSL array type string.
     */
    private transpileArrayType(pType: PgslArrayType, pTrace: PgslTrace, pDefinition: PgslTypeDeclaration, pTranspile: PgslTranspilerProcessorTranspile): string {
        const lInnerTypeWgsl = this.processType(pType.innerType, pDefinition, pTrace, pTranspile);

        if (pType.length !== null) {
            // Fixed-size array
            return `array<${lInnerTypeWgsl}, ${pType.length}>`;
        } else {
            // Runtime-sized array
            return `array<${lInnerTypeWgsl}>`;
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
     * Transpiles pointer type to WGSL.
     * 
     * @param pType - The pointer type instance to transpile.
     * @param pTrace - The trace context for error reporting.
     * @param pDefinition - The type definition instance for context.
     * @param pTranspile - The transpile function for processing referenced types.
     * 
     * @returns The WGSL pointer type string.
     */
    private transpilePointerType(pType: PgslPointerType, pTrace: PgslTrace, pDefinition: PgslTypeDeclaration, pTranspile: PgslTranspilerProcessorTranspile): string {
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
        const lReferencedTypeWgsl = this.processType(pType.referencedType, pDefinition, pTrace, pTranspile);

        return `ptr<${lAddressSpace}, ${lReferencedTypeWgsl}>`;
    }

    /**
     * Transpiles texture type to WGSL.
     * 
     * @param pType - The texture type instance to transpile.
     * @param pTrace - The trace context for error reporting.
     * @param pDefinition - The type definition instance for context.
     * @param pTranspile - The transpile function for processing sampled types.
     * 
     * @returns The WGSL texture type string.
     */
    private transpileTextureType(pType: PgslTextureType, pTrace: PgslTrace, pDefinition: PgslTypeDeclaration, pTranspile: PgslTranspilerProcessorTranspile): string {
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
            pTrace.pushIncident(`Unsupported texture type for WGSL transpilation: ${pType.textureType}`, pDefinition);
            return PgslTypeDeclarationTranspilerProcessor.INVALID_TYPE;
        }

        const [lWgslTextureName, lWgslTextureMode] = lWgslTexture;

        // For regular textures, include the sampled type
        if (lWgslTextureMode === 'regular') {
            const lSampledTypeWgsl = this.processType(pType.sampledType, pDefinition, pTrace, pTranspile);
            return `${lWgslTextureName}<${lSampledTypeWgsl}>`;
        }

        // For storage textures, include format and access mode
        if (lWgslTextureMode === 'storage') {
            // Convert the format to WGSL format string.
            const lFormatWgsl: string = (() => {
                switch (pType.format) {
                    case PgslTexelFormat.Rgba8unorm: return 'rgba8unorm';
                    case PgslTexelFormat.Rgba8snorm: return 'rgba8snorm';
                    case PgslTexelFormat.Rgba8uint: return 'rgba8uint';
                    case PgslTexelFormat.Rgba8sint: return 'rgba8sint';
                    case PgslTexelFormat.Rgba16uint: return 'rgba16uint';
                    case PgslTexelFormat.Rgba16sint: return 'rgba16sint';
                    case PgslTexelFormat.Rgba16float: return 'rgba16float';
                    case PgslTexelFormat.R32uint: return 'r32uint';
                    case PgslTexelFormat.R32sint: return 'r32sint';
                    case PgslTexelFormat.R32float: return 'r32float';
                    case PgslTexelFormat.Rg32uint: return 'rg32uint';
                    case PgslTexelFormat.Rg32sint: return 'rg32sint';
                    case PgslTexelFormat.Rg32float: return 'rg32float';
                    case PgslTexelFormat.Rgba32uint: return 'rgba32uint';
                    case PgslTexelFormat.Rgba32sint: return 'rgba32sint';
                    case PgslTexelFormat.Rgba32float: return 'rgba32float';
                    case PgslTexelFormat.Bgra8unorm: return 'bgra8unorm';
                }
            })();

            // Convert the access mode to WGSL access mode string.
            const lAccessMode = (() => {
                switch (pType.access) {
                    case PgslAccessMode.Read: return 'read';
                    case PgslAccessMode.Write: return 'write';
                    case PgslAccessMode.ReadWrite: return 'read_write';
                }
            })();

            return `${lWgslTexture}<${lFormatWgsl}, ${lAccessMode}>`;
        }

        // For depth and external textures, no template parameters
        return lWgslTextureName;
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
     * Transpiles built-in type to WGSL.
     * 
     * @param pType - The built-in type instance to transpile.
     * @param pTrace - The trace context for error reporting.
     * @param pDefinition - The type definition instance for context.
     * @param pTranspile - The transpile function for processing underlying types.
     * 
     * @returns The WGSL representation of the underlying type.
     */
    private transpileBuildInType(pType: PgslBuildInType, pTrace: PgslTrace, pDefinition: PgslTypeDeclaration, pTranspile: PgslTranspilerProcessorTranspile): string {
        // Just transpile to the underlying type.
        return this.processType(pType.underlyingType, pDefinition, pTrace, pTranspile);
    }

    /**
     * Transpiles invalid type to WGSL.
     * 
     * @param _pType - The invalid type instance (unused).
     * @param pTrace - The trace context for error reporting.
     * @param pDefinition - The type definition instance for error context.
     * 
     * @returns The fallback invalid type string.
     */
    private transpileInvalidType(_pType: PgslType, pTrace: PgslTrace, pDefinition: PgslTypeDeclaration): string {
        pTrace.pushIncident('Invalid type encountered during transpilation', pDefinition);
        return PgslTypeDeclarationTranspilerProcessor.INVALID_TYPE;
    }
}

/**
 * Function type for transpiling PGSL types to WGSL.
 * 
 * @param pType - The PGSL type instance to transpile.
 * @param pTrace - The trace context for error reporting.
 * @param pDefinition - The type definition instance for error context.
 * @param pTranspile - Function to transpile child nodes.
 * 
 * @returns The transpiled WGSL type string.
 */
type PgslTypeTranspilerFunction<TType extends PgslType> = (pType: TType, pTrace: PgslTrace, pDefinition: PgslTypeDeclaration, pTranspile: PgslTranspilerProcessorTranspile) => string;