import { Exception } from '@kartoffelgames/core.data';
import { WebGpuBindType } from '../../../abstraction_layer/webgpu/bind_group/web-gpu-bind-type.enum';
import { WebGpuShader } from '../../../abstraction_layer/webgpu/shader/web-gpu-shader';
import { WebGpuDevice } from '../../../abstraction_layer/webgpu/web-gpu-device';
import { IShader } from '../../interface/i-shader.interface';
import { WgslShaderStage } from './wgsl_enum/wgsl-shader-stage.enum';
import { WgslType } from './wgsl_enum/wgsl-type.enum';
import { VertexAttribute } from '../../../abstraction_layer/webgpu/pipeline/data/vertex-attribute';
import { SimpleBufferLayout } from '../memory_layout/simple-buffer-layout';
import { WgslTexelFormat } from './wgsl_enum/wgsl-texel-format.enum';
import { WgslShaderInformation, WgslBind, WgslFunction } from './wgsl-shader-information';
import { StructBufferLayout } from '../memory_layout/struct-buffer-layout';
import { WebGpuBindGroupLayout } from '../../../abstraction_layer/webgpu/bind_group/web-gpu-bind-group-layout';
import { WebGpuBindGroups } from '../../../abstraction_layer/webgpu/bind_group/web-gpu-bind-groups';
import { BufferLayout } from '../memory_layout/buffer-memory-layout';

export class Shader extends WebGpuShader implements IShader {
    private readonly mBindGroups: WebGpuBindGroups;
    private readonly mEntryPoints: EntryPoints;
    private readonly mShaderInformation: WgslShaderInformation;

    /**
     * Get bind groups of shader.
     */
    public get bindGroups(): WebGpuBindGroups {
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

    public constructor(pDevice: WebGpuDevice, pSource: string) {
        super(pDevice, pSource);

        this.mShaderInformation = new WgslShaderInformation(pSource);

        // Generate from ShaderInformation. 
        this.mBindGroups = this.generateBindGroups(this.mShaderInformation);
        this.mEntryPoints = {
            vertex: this.generateVertexEntryPoint(this.mShaderInformation),
            fragment: this.generateFragmentEntryPoint(this.mShaderInformation),
            compute: this.generateComputeEntryPoint(this.mShaderInformation)
        };
    }

    /**
     * Generate bind groups based on shader information.
     * @param pShaderInformation - Shader information.
     */
    private generateBindGroups(pShaderInformation: WgslShaderInformation): WebGpuBindGroups {
        const lBindGroups: WebGpuBindGroups = new WebGpuBindGroups(this.gpu);

        // Create new bing groups.
        for (const lBindGroupInformation of pShaderInformation.bindings) {
            const lBindGroup: WebGpuBindGroupLayout = lBindGroups.addGroup(lBindGroupInformation.group);

            // Create each binding of group.
            for (const lWgslBind of lBindGroupInformation.binds) {
                const lShaderBind: ShaderBind = this.getBindBasedOnType(lWgslBind);
                switch (lShaderBind.bindType) {
                    case WebGpuBindType.Texture: {
                        lBindGroup.addTexture(lShaderBind.name, lShaderBind.index, lShaderBind.visibility, lShaderBind.sampleType, lShaderBind.viewDimension, lShaderBind.multisampled);
                        break;
                    }
                    case WebGpuBindType.Buffer: {
                        lBindGroup.addBuffer(lShaderBind.name, lShaderBind.index, lShaderBind.visibility, lShaderBind.type, lShaderBind.hasDynamicOffset, lShaderBind.minBindingSize);
                        break;
                    }
                    case WebGpuBindType.Sampler: {
                        lBindGroup.addSampler(lShaderBind.name, lShaderBind.index, lShaderBind.visibility, lShaderBind.type);
                        break;
                    }
                    case WebGpuBindType.StorageTexture: {
                        lBindGroup.addStorageTexture(lShaderBind.name, lShaderBind.index, lShaderBind.visibility, lShaderBind.format, lShaderBind.access, lShaderBind.viewDimension);
                        break;
                    }
                    case WebGpuBindType.ExternalTexture: {
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
    private generateComputeEntryPoint(pShaderInformation: WgslShaderInformation): ShaderComputeEntryPoint | undefined {
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
    private generateFragmentEntryPoint(pShaderInformation: WgslShaderInformation): ShaderFragmentEntryPoint | undefined {
        // Find entry point information.
        const lShaderEntryPointFunction: WgslFunction | undefined = pShaderInformation.entryPoints.get(WgslShaderStage.Fragment);
        if (!lShaderEntryPointFunction) {
            return undefined;
        }

        // Get count of all result types with location attribute.
        let lResultLength: number = 1;
        if (lShaderEntryPointFunction.return instanceof StructBufferLayout) {
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
    private generateVertexEntryPoint(pShaderInformation: WgslShaderInformation): ShaderVertexEntryPoint | undefined {
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
        const lParameterLocationTypes: Array<BufferLayout> = new Array<BufferLayout>();
        for (const lParameter of lShaderEntryPointFunction.parameter) {
            if (lParameter instanceof StructBufferLayout) {
                for (const lType of lParameter.innerLocations()) {
                    lParameterLocationTypes.push(lType);
                }
            } else if (lParameter?.location) {
                lParameterLocationTypes.push(lParameter);
            }
        }

        // Generate new vertex attribute for each location.
        for (const lParameter of lParameterLocationTypes) {
            if (!(lParameter instanceof SimpleBufferLayout)) {
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
                bindType: WebGpuBindType.Buffer,
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
                bindType: WebGpuBindType.ExternalTexture,
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
                bindType: WebGpuBindType.Sampler,
                index: pBind.index,
                name: pBind.variable.name,
                visibility: pBind.visibility,
                type: lFilterType
            };
        }

        // First generic texture is a wgsl type on color textures or nothing on depth textures.
        if (!(pBind.variable instanceof SimpleBufferLayout)) {
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
                bindType: WebGpuBindType.StorageTexture,
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
                bindType: WebGpuBindType.Texture,
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
    bindType: WebGpuBindType;
    visibility: WgslShaderStage;
}

interface ShaderBufferBind extends ShaderBaseBind, Required<GPUBufferBindingLayout> {
    bindType: WebGpuBindType.Buffer;
}

interface ShaderSamplerBind extends ShaderBaseBind, Required<GPUSamplerBindingLayout> {
    bindType: WebGpuBindType.Sampler;
}

interface ShaderTextureBind extends ShaderBaseBind, Required<GPUTextureBindingLayout> {
    bindType: WebGpuBindType.Texture;
}

interface ShaderStorageTextureBind extends ShaderBaseBind, Required<GPUStorageTextureBindingLayout> {
    bindType: WebGpuBindType.StorageTexture;
}

interface ShaderExternalTextureBind extends ShaderBaseBind, Required<GPUExternalTextureBindingLayout> {
    bindType: WebGpuBindType.ExternalTexture;
}

export type ShaderBind = ShaderBufferBind | ShaderSamplerBind | ShaderTextureBind | ShaderStorageTextureBind | ShaderExternalTextureBind;

export type ShaderBindGroup = {
    groupIndex: number;
    binds: Array<ShaderBind>;
};