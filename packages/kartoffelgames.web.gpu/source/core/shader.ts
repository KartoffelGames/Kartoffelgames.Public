import { BindGroups } from './bind_group/bind-groups';
import { Gpu } from './gpu';
import { GpuNativeObject } from './gpu-native-object';
import { WgslTypeDefinition } from './type_handler/type-handler';

// TODO: Add VertexAttributes for vertex shader.

export class Shader extends GpuNativeObject<GPUShaderModule>{
    private readonly mBindGroups: BindGroups;
    private readonly mEntryPoints: EntryPoints;
    private readonly mSource: string;


    /**
     * Compute entry point name.
     */
    public get computeEntryPoint(): string | undefined {
        return this.mEntryPoints.compute;
    }

    /**
     * Fragment entry point name.
     */
    public get fragmentEntryPoint(): string | undefined {
        return this.mEntryPoints.fragment;
    }

    /**
     * Vertex entry point name.
     */
    public get vertexEntryPoint(): string | undefined {
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
        this.mBindGroups = this.getBindInformation(pSource);

        // Fetch entry points.
        this.mEntryPoints = {
            fragment: /(@fragment(.|\r?\n)*?fn )(\w*)/gm.exec(pSource)?.[3],
            vertex: /(@vertex(.|\r?\n)*?fn )(\w*)/gm.exec(pSource)?.[3],
            compute: /(@compute(.|\r?\n)*?fn )(\w*)/gm.exec(pSource)?.[3]
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

    private getBindInformation(pSource: string): BindGroups {
        // Regex for binding index, group index, modifier, variable name and type.
        const lBindInformationRegex: RegExp = /^(?:\s*@group\((?<group>\d+)\)|\s*@binding\((?<binding>\d+)\)){2}\s+var(?:<(?<addressspace>[\w,\s]+)>)?\s*(?<name>\w+)\s*:\s*(?<type>[\w,\s<>]*[\w,<>]).*$/gm;

        const lBindInformationList: Array<BindGroupInformation> = new Array<BindGroupInformation>();

        // Get bind information for every group binding.
        let lMatch: RegExpExecArray | null;
        while ((lMatch = lBindInformationRegex.exec(pSource)) !== null) {
            // TODO: Create bind layout from typehandler.
        }

        const lBindGroups: BindGroups = new BindGroups(this.gpu);
        // TODO: Add BindGroupInformation to bind group.

        return lBindGroups;
    }
}

type BindGroupInformation = {
    groupIndex: number;
    bindingIndex: number;
    addressSpace: GPUBufferBindingType | null;
    variableName: string;
    type: WgslTypeDefinition;
};

type EntryPoints = {
    fragment?: string | undefined;
    vertex?: string | undefined;
    compute?: string | undefined;
};