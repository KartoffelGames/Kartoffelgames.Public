import { Exception } from '@kartoffelgames/core.data';
import { BindGroupLayout } from '../bind_group/bind-group-layout';
import { BindGroups } from '../bind_group/bind-groups';
import { BufferType } from '../buffer/buffer_type/buffer-type';
import { SimpleBufferType } from '../buffer/buffer_type/simple-buffer-type';
import { StructBufferType } from '../buffer/buffer_type/struct-buffer-type';
import { BindType } from '../bind_group/bind-type.enum';
import { Gpu } from '../gpu';
import { GpuNativeObject } from '../gpu-native-object';
import { VertexAttribute } from '../pipeline/data/vertex-attribute';
import { WgslShaderStage } from './enum/wgsl-shader-stage.enum';
import { WgslTexelFormat } from './enum/wgsl-texel-format.enum';
import { WgslType } from './enum/wgsl-type.enum';
import { ShaderInformation, WgslBind, WgslFunction } from './shader-analyzer';

export class Shader extends GpuNativeObject<GPUShaderModule>{
    private readonly mBindGroups: BindGroups;
    private readonly mEntryPoints: EntryPoints;
    private readonly mShaderInformation: ShaderInformation;
    private readonly mSource: string;

    /**
     * Get bind groups of shader.
     */
    public get bindGroups(): BindGroups {
        return this.mBindGroups;
    }

    /**
     * Compute entry point name.
     */
    public get computeEntryPoint(): ShaderComputeEntryPoint | undefined {
        return this.mEntryPoints.compute;
    }

    /**
     * Fragment entry point name.
     */
    public get fragmentEntryPoint(): ShaderFragmentEntryPoint | undefined {
        return this.mEntryPoints.fragment;
    }

    /**
     * Vertex entry point name.
     */
    public get vertexEntryPoint(): ShaderVertexEntryPoint | undefined {
        return this.mEntryPoints.vertex;
    }

    /**
     * Constructor.
     * @param pGpu - GPU.
     * @param pSource - Shader module source code.
     */
    public constructor(pGpu: Gpu, pSource: string) {
        super(pGpu, 'SHADER');

        this.mSource = pSource;
        this.mShaderInformation = new ShaderInformation(pSource);

        // Generate from ShaderInformation. 
        this.mBindGroups = this.generateBindGroups(this.mShaderInformation);
        this.mEntryPoints = {
            vertex: this.generateVertexEntryPoint(this.mShaderInformation),
            fragment: this.generateFragmentEntryPoint(this.mShaderInformation),
            compute: this.generateComputeEntryPoint(this.mShaderInformation)
        };
    }

    /***
     * Generate shader module.
     */
    protected generate(): GPUShaderModule {
        return this.gpu.device.createShaderModule({ code: this.mSource });
    }

    /**
     * Generate bind groups based on shader information.
     * @param pShaderInformation - Shader information.
     */
    private generateBindGroups(pShaderInformation: ShaderInformation): BindGroups {
        const lBindGroups: BindGroups = new BindGroups(this.gpu);

        // Create new bing groups.
        for (const lBindGroupInformation of pShaderInformation.bindings) {
            const lBindGroup: BindGroupLayout = lBindGroups.addGroup(lBindGroupInformation.group);

            // Create each binding of group.
            for (const lWgslBind of lBindGroupInformation.binds) {
                const lShaderBind: ShaderBind = this.getBindBasedOnType(lWgslBind);
                switch (lShaderBind.bindType) {
                    case BindType.Texture: {
                        lBindGroup.addTexture(lShaderBind.name, lShaderBind.index, lShaderBind.visibility, lShaderBind.sampleType, lShaderBind.viewDimension, lShaderBind.multisampled);
                        break;
                    }
                    case BindType.Buffer: {
                        lBindGroup.addBuffer(lShaderBind.name, lShaderBind.index, lShaderBind.visibility, lShaderBind.type, lShaderBind.hasDynamicOffset, lShaderBind.minBindingSize);
                        break;
                    }
                    case BindType.Sampler: {
                        lBindGroup.addSampler(lShaderBind.name, lShaderBind.index, lShaderBind.visibility, lShaderBind.type);
                        break;
                    }
                    case BindType.StorageTexture: {
                        lBindGroup.addStorageTexture(lShaderBind.name, lShaderBind.index, lShaderBind.visibility, lShaderBind.format, lShaderBind.access, lShaderBind.viewDimension);
                        break;
                    }
                    case BindType.ExternalTexture: {
                        lBindGroup.addExternalTexture(lShaderBind.name, lShaderBind.index, lShaderBind.visibility);
                        break;
                    }
                }
            }
        }

        return lBindGroups;
    }

    /**
     * Generate compute entry point.
     * @param pShaderInformation - Shader information.
     */
    private generateComputeEntryPoint(pShaderInformation: ShaderInformation): ShaderComputeEntryPoint | undefined {
        // Find entry point information.
        const lShaderEntryPointFunction: WgslFunction | undefined = pShaderInformation.entryPoints.get(WgslShaderStage.Compute);
        if (!lShaderEntryPointFunction) {
            return undefined;
        }

        const lShaderEntryPoint: ShaderComputeEntryPoint = {
            name: lShaderEntryPointFunction.name
        };

        return lShaderEntryPoint;
    }

    /**
     * Generate compute entry point.
     * @param pShaderInformation - Shader information.
     */
    private generateFragmentEntryPoint(pShaderInformation: ShaderInformation): ShaderFragmentEntryPoint | undefined {
        // Find entry point information.
        const lShaderEntryPointFunction: WgslFunction | undefined = pShaderInformation.entryPoints.get(WgslShaderStage.Fragment);
        if (!lShaderEntryPointFunction) {
            return undefined;
        }

        // Get count of all result types with location attribute.
        let lResultLength: number = 1;
        if (lShaderEntryPointFunction.return instanceof StructBufferType) {
            lResultLength = lShaderEntryPointFunction.return.innerLocations().length;
        }

        const lShaderEntryPoint: ShaderFragmentEntryPoint = {
            name: lShaderEntryPointFunction.name,
            renderTargetCount: lResultLength
        };

        return lShaderEntryPoint;
    }

    /**
     * Generate vertex entry point.
     * @param pShaderInformation - Shader information.
     */
    private generateVertexEntryPoint(pShaderInformation: ShaderInformation): ShaderVertexEntryPoint | undefined {
        // Find entry point information.
        const lShaderEntryPointFunction: WgslFunction | undefined = pShaderInformation.entryPoints.get(WgslShaderStage.Vertex);
        if (!lShaderEntryPointFunction) {
            return undefined;
        }

        const lShaderEntryPoint: ShaderVertexEntryPoint = {
            name: lShaderEntryPointFunction.name,
            attributes: new Array<VertexAttribute>()
        };

        // Get all parameter locations of entry point.
        const lParameterLocationTypes: Array<BufferType> = new Array<BufferType>();
        for (const lParameter of lShaderEntryPointFunction.parameter) {
            if (lParameter instanceof StructBufferType) {
                for (const lType of lParameter.innerLocations()) {
                    lParameterLocationTypes.push(lType);
                }
            } else if (lParameter?.location) {
                lParameterLocationTypes.push(lParameter);
            }
        }

        // Generate new vertex attribute for each location.
        for (const lParameter of lParameterLocationTypes) {
            if (!(lParameter instanceof SimpleBufferType)) {
                throw new Exception('Vertex attributes can only be of a simple type.', this);
            }

            // Add generated attribute to shader entry point.
            lShaderEntryPoint.attributes.push(new VertexAttribute(this.gpu, lParameter));
        }

        return lShaderEntryPoint;
    }


    /**
     * Get bind based on binding information.
     * @param pBindGroup - Bind group.
     * @param pBindInformation - Bind information.
     */
    private getBindBasedOnType(pBind: WgslBind): ShaderBind {
        const lNumberTypeList: Array<WgslType> = [WgslType.Boolean, WgslType.Integer32, WgslType.UnsignedInteger32, WgslType.Float32, WgslType.Float16];
        const lVectorTypeList: Array<WgslType> = [WgslType.Vector2, WgslType.Vector3, WgslType.Vector4];
        const lMatrixTypeList: Array<WgslType> = [WgslType.Matrix22, WgslType.Matrix23, WgslType.Matrix24, WgslType.Matrix32, WgslType.Matrix33, WgslType.Matrix34, WgslType.Matrix42, WgslType.Matrix43, WgslType.Matrix44];
        const lTextureStorageTypeList: Array<WgslType> = [WgslType.TextureStorage1d, WgslType.TextureStorage2d, WgslType.TextureStorage2dArray, WgslType.TextureStorage3d,];
        const lTextureTypeList = [WgslType.Texture1d, WgslType.Texture2d, WgslType.Texture2dArray, WgslType.Texture3d, WgslType.TextureCube, WgslType.TextureCubeArray, WgslType.TextureMultisampled2d, WgslType.TextureExternal];
        const lDepthTextureTypeList = [WgslType.TextureDepth2d, WgslType.TextureDepth2dArray, WgslType.TextureDepthCube, WgslType.TextureDepthCubeArray, WgslType.TextureDepthMultisampled2d];

        // Buffer types.
        // Number, matrix, vector and array types.
        if ([...lNumberTypeList, ...lVectorTypeList, ...lMatrixTypeList, WgslType.Array, WgslType.Struct].includes(pBind.variable.type)) {
            // Validate address space.
            if (!pBind.variable.bindingType) {
                throw new Exception(`Buffer bind type needs to be set for buffer bindings (${pBind.variable.name}).`, this);
            }

            // Bind 
            return <ShaderBufferBind>{
                bindType: BindType.Buffer,
                index: pBind.index,
                name: pBind.variable.name,
                visibility: pBind.visibility,
                type: pBind.variable.bindingType,
                hasDynamicOffset: false,
                minBindingSize: 0
            };
        }

        // Bind only external textures.
        if (pBind.variable.type === WgslType.TextureExternal) {
            return <ShaderExternalTextureBind>{
                bindType: BindType.ExternalTexture,
                index: pBind.index,
                name: pBind.variable.name,
                visibility: pBind.visibility
            };
        }

        // Sampler types.
        else if ([WgslType.Sampler, WgslType.SamplerComparison].includes(pBind.variable.type)) {
            // Sampler bind type by sampler or comparison type.
            const lFilterType: GPUSamplerBindingType = (pBind.variable.type === WgslType.Sampler) ? 'filtering' : 'comparison';

            // Exit.
            return <ShaderSamplerBind>{
                bindType: BindType.Sampler,
                index: pBind.index,
                name: pBind.variable.name,
                visibility: pBind.visibility,
                type: lFilterType
            };
        }

        // First generic texture is a wgsl type on color textures or nothing on depth textures.
        if (!(pBind.variable instanceof SimpleBufferType)) {
            throw new Exception('Texture buffers can only be of simple buffer type', this);
        }

        // Storage texture.
        if (lTextureStorageTypeList.includes(pBind.variable.type)) {
            if (pBind.variable.generics.at(0) !== WgslType.Enum) {
                throw new Exception('Storage texture needs texel enum as first generic.', this);
            }

            // Storage texture first generics is allways the texel format.
            const lTexelFormat: GPUTextureFormat = <WgslTexelFormat>pBind.variable.genericsRaw.at(0)!;
            const lTextureAccess: GPUStorageTextureAccess = 'write-only';
            const lTextureDimension: GPUTextureViewDimension = this.texureDimensionFromType(pBind.variable.type);

            // Bind.
            return <ShaderStorageTextureBind>{
                bindType: BindType.StorageTexture,
                index: pBind.index,
                name: pBind.variable.name,
                visibility: pBind.visibility,
                access: lTextureAccess,
                format: lTexelFormat,
                viewDimension: lTextureDimension
            };
        }

        // Depth or color texture.
        if ([...lTextureTypeList, ...lDepthTextureTypeList].includes(pBind.variable.type)) {
            const lTextureDimension: GPUTextureViewDimension = this.texureDimensionFromType(pBind.variable.type);
            const lMultisampled: boolean = [WgslType.TextureMultisampled2d, WgslType.TextureDepthMultisampled2d].includes(pBind.variable.type);

            const lTextureWgslType: WgslType | undefined = pBind.variable.generics.at(0);
            let lTextureSampleType: GPUTextureSampleType;

            // Color textures. Based on generic type.
            if (lTextureTypeList.includes(pBind.variable.type)) {
                switch (lTextureWgslType) {
                    case WgslType.Float32: {
                        lTextureSampleType = 'float';
                        break;
                    }
                    case WgslType.Integer32: {
                        lTextureSampleType = 'sint';
                        break;
                    }
                    case WgslType.UnsignedInteger32: {
                        lTextureSampleType = 'uint';
                        break;
                    }
                    default: {
                        // Ignored "unfiltered float"
                        lTextureSampleType = 'unfilterable-float';
                        break;
                    }
                }
            } else {
                // Musst be and depth type.
                lTextureSampleType = 'depth';
            }

            // Exit.
            return <ShaderTextureBind>{
                bindType: BindType.Texture,
                index: pBind.index,
                name: pBind.variable.name,
                visibility: pBind.visibility,
                sampleType: lTextureSampleType,
                viewDimension: lTextureDimension,
                multisampled: lMultisampled
            };
        }

        throw new Exception(`Not implemented. Upps "${pBind.variable.type}"`, this);
    }

    /**
     * Get view dimension based on WGSL texture type.
     * @param pTextureType - Texture type.
     */
    private texureDimensionFromType(pTextureType: WgslType): GPUTextureViewDimension {
        // Map every texture type for view dimension.
        switch (pTextureType) {
            case WgslType.Texture1d:
            case WgslType.TextureStorage1d: {
                return '1d';
            }
            case WgslType.TextureDepth2d:
            case WgslType.Texture2d:
            case WgslType.TextureStorage2d:
            case WgslType.TextureDepthMultisampled2d:
            case WgslType.TextureMultisampled2d: {
                return '2d';
            }
            case WgslType.TextureDepth2dArray:
            case WgslType.Texture2dArray:
            case WgslType.TextureStorage2dArray: {
                return '2d-array';
            }
            case WgslType.Texture3d:
            case WgslType.TextureStorage3d: {
                return '3d';
            }
            case WgslType.TextureCube:
            case WgslType.TextureDepthCube: {
                return 'cube';
            }
            case WgslType.TextureCubeArray: {
                return 'cube-array';
            }
            default: {
                throw new Exception(`Texture type "${pTextureType}" not supported for any dimension.`, this);
            }
        }
    }
}

export type ShaderVertexEntryPoint = {
    name: string,
    attributes: Array<VertexAttribute>;
};

export type ShaderFragmentEntryPoint = {
    name: string,
    renderTargetCount: number;
};

export type ShaderComputeEntryPoint = {
    name: string,
    // TODO: Compute sizes.
};

type EntryPoints = {
    fragment?: ShaderFragmentEntryPoint | undefined;
    vertex?: ShaderVertexEntryPoint | undefined;
    compute?: ShaderComputeEntryPoint | undefined;
};

interface ShaderBaseBind {
    index: number;
    name: string;
    bindType: BindType;
    visibility: WgslShaderStage;
}

interface ShaderBufferBind extends ShaderBaseBind, Required<GPUBufferBindingLayout> {
    bindType: BindType.Buffer;
}

interface ShaderSamplerBind extends ShaderBaseBind, Required<GPUSamplerBindingLayout> {
    bindType: BindType.Sampler;
}

interface ShaderTextureBind extends ShaderBaseBind, Required<GPUTextureBindingLayout> {
    bindType: BindType.Texture;
}

interface ShaderStorageTextureBind extends ShaderBaseBind, Required<GPUStorageTextureBindingLayout> {
    bindType: BindType.StorageTexture;
}

interface ShaderExternalTextureBind extends ShaderBaseBind, Required<GPUExternalTextureBindingLayout> {
    bindType: BindType.ExternalTexture;
}

export type ShaderBind = ShaderBufferBind | ShaderSamplerBind | ShaderTextureBind | ShaderStorageTextureBind | ShaderExternalTextureBind;

export type ShaderBindGroup = {
    groupIndex: number;
    binds: Array<ShaderBind>;
};