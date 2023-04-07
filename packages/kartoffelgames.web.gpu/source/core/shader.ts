import { BindGroupLayout } from './bind_group/bind-group-layout';
import { BindGroups } from './bind_group/bind-groups';
import { BindType } from './enum/bind-type.enum';
import { ShaderStage } from './enum/shader-stage.enum';
import { Gpu } from './gpu';
import { GpuNativeObject } from './gpu-native-object';
import { VertexAttribute } from './pipeline/vertex-attribute';
import { ShaderEntryPointFunction, ShaderInformation, WgslTypeDescription } from './shader/shader-analyzer';
import { WgslTypeNumber } from './shader/wgsl_type_handler/wgsl-type-collection';
import { WgslType } from './shader/wgsl_type_handler/wgsl-type.enum';

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
    public get computeEntryPoint(): ShaderEntryPoint | undefined {
        return this.mEntryPoints.compute;
    }

    /**
     * Fragment entry point name.
     */
    public get fragmentEntryPoint(): ShaderEntryPoint | undefined {
        return this.mEntryPoints.fragment;
    }

    /**
     * Vertex entry point name.
     */
    public get vertexEntryPoint(): ShaderEntryPoint | undefined {
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
            vertex: this.generateEntryPoint(this.mShaderInformation, ShaderStage.Vertex),
            fragment: this.generateEntryPoint(this.mShaderInformation, ShaderStage.Fragment),
            compute: this.generateEntryPoint(this.mShaderInformation, ShaderStage.Compute),
        };
    }

    /**
     * Destory native object.
     * @param _pNativeObject - Native object.
     */
    protected async destroyNative(_pNativeObject: GPUShaderModule): Promise<void> {
        /* Nothing to destroy */
    }

    /***
     * Generate shader module.
     */
    protected async generate(): Promise<GPUShaderModule> {
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
     * Generate entry point.
     * @param pShaderInformation - Shader information.
     * @param pShaderEntryPoint - Entry point that should be generated.
     */
    private generateEntryPoint(pShaderInformation: ShaderInformation, pShaderEntryPoint: ShaderStage): ShaderEntryPoint | undefined {
        // Find entry point information.
        let lShaderEntryPointFunction: ShaderEntryPointFunction | undefined;
        switch (pShaderEntryPoint) {
            case ShaderStage.Vertex: {
                lShaderEntryPointFunction = pShaderInformation.entryPoints.vertex;
                break;
            }
            case ShaderStage.Fragment: {
                lShaderEntryPointFunction = pShaderInformation.entryPoints.fragment;
                break;
            }
            case ShaderStage.Compute: {
                lShaderEntryPointFunction = pShaderInformation.entryPoints.compute;
                break;
            }
        }

        // Exit on not set entry point.
        if (!lShaderEntryPointFunction) {
            return undefined;
        }

        const lShaderEntryPoint: ShaderEntryPoint = {
            name: lShaderEntryPointFunction.name,
            attributes: new Array<VertexAttribute>()
        };

        // Generate vertex attributes for vertex entry points.
        if (pShaderEntryPoint === ShaderStage.Vertex) {
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
        }

        return lShaderEntryPoint;
    }
}

export type ShaderEntryPoint = {
    name: string,
    attributes: Array<VertexAttribute>;
};

type EntryPoints = {
    fragment?: ShaderEntryPoint | undefined;
    vertex?: ShaderEntryPoint | undefined;
    compute?: ShaderEntryPoint | undefined;
};