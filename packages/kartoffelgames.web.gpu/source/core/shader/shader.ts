import { BindGroupLayout } from '../bind_group/bind-group-layout';
import { BindGroups } from '../bind_group/bind-groups';
import { BindType } from '../enum/bind-type.enum';
import { Gpu } from '../gpu';
import { GpuNativeObject } from '../gpu-native-object';
import { VertexAttribute } from '../pipeline/data/vertex-attribute';
import { ShaderEntryPointFunction, ShaderInformation, WgslTypeDescription } from './shader-analyzer';
import { WgslTypeNumber } from './wgsl_type_handler/wgsl-type-collection';
import { WgslType } from './wgsl_type_handler/wgsl-type.enum';

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
            const lBindGroup: BindGroupLayout = lBindGroups.addGroup(lBindGroupInformation.groupIndex);

            // Create each binding of group.
            for (const lBind of lBindGroupInformation.binds) {
                switch (lBind.bindType) {
                    case BindType.Texture: {
                        lBindGroup.addTexture(lBind.name, lBind.index, lBind.visibility, lBind.sampleType, lBind.viewDimension, lBind.multisampled);
                        break;
                    }
                    case BindType.Buffer: {
                        lBindGroup.addBuffer(lBind.name, lBind.index, lBind.visibility, lBind.type, lBind.hasDynamicOffset, lBind.minBindingSize);
                        break;
                    }
                    case BindType.Sampler: {
                        lBindGroup.addSampler(lBind.name, lBind.index, lBind.visibility, lBind.type);
                        break;
                    }
                    case BindType.StorageTexture: {
                        lBindGroup.addStorageTexture(lBind.name, lBind.index, lBind.visibility, lBind.format, lBind.access, lBind.viewDimension);
                        break;
                    }
                    case BindType.ExternalTexture: {
                        lBindGroup.addExternalTexture(lBind.name, lBind.index, lBind.visibility);
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
        const lShaderEntryPointFunction: ShaderEntryPointFunction | undefined = pShaderInformation.entryPoints.compute;
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
        const lShaderEntryPointFunction: ShaderEntryPointFunction | undefined = pShaderInformation.entryPoints.fragment;
        if (!lShaderEntryPointFunction) {
            return undefined;
        }

        const lShaderEntryPoint: ShaderFragmentEntryPoint = {
            name: lShaderEntryPointFunction.name,
            renderTargetCount: lShaderEntryPointFunction.returnValues.length
        };

        return lShaderEntryPoint;
    }

    /**
     * Generate vertex entry point.
     * @param pShaderInformation - Shader information.
     */
    private generateVertexEntryPoint(pShaderInformation: ShaderInformation): ShaderVertexEntryPoint | undefined {
        // Find entry point information.
        const lShaderEntryPointFunction: ShaderEntryPointFunction | undefined = pShaderInformation.entryPoints.vertex;
        if (!lShaderEntryPointFunction) {
            return undefined;
        }

        const lShaderEntryPoint: ShaderVertexEntryPoint = {
            name: lShaderEntryPointFunction.name,
            attributes: new Array<VertexAttribute>()
        };

        // Generate new vertex attribute for each location.
        for (const lAttribute of lShaderEntryPointFunction.parameter) {
            if (typeof lAttribute.location === 'number') {
                const lVertexAttribute: VertexAttribute = new VertexAttribute(this.gpu, lAttribute.name);

                // Set attribute based on type and generic.
                const lGeneric: WgslType | undefined = (<WgslTypeDescription | undefined>lAttribute.type.generics[0])?.type;
                lVertexAttribute.setAttributeLocation(lAttribute.type.type, <WgslTypeNumber>lGeneric ?? null, lAttribute.location);

                // Add generated attribute to shader entry point.
                lShaderEntryPoint.attributes.push(lVertexAttribute);
            }
        }

        return lShaderEntryPoint;
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