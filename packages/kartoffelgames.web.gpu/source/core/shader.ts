import { TypedArray } from '@kartoffelgames/core.data';
import { BindGroups } from './bind_group/bind-groups';
import { Gpu } from './gpu';
import { GpuNativeObject } from './gpu-native-object';
import { VertexAttributes } from './pipeline/vertex-attributes';
import { ShaderInformation } from './shader/shader-analyzer';

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


        // TODO: Generate from ShaderInformation.
        this.mEntryPoints = <any>null;
        this.mBindGroups = <any>null;
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
}

export type ShaderEntryPoint = {
    name: string,
    attributes: Array<VertexAttributes<TypedArray>>;
};


type EntryPoints = {
    fragment?: ShaderEntryPoint | undefined;
    vertex?: ShaderEntryPoint | undefined;
    compute?: ShaderEntryPoint | undefined;
};