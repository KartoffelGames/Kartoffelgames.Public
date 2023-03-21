import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { BindGroupLayout } from './bind_group/bind-group-layout';
import { BindGroups } from './bind_group/bind-groups';
import { ShaderStage } from './enum/shader-stage.enum';
import { Gpu } from './gpu';
import { GpuNativeObject } from './gpu-native-object';
import { TypeHandler, WgslTypeDefinition } from './type_handler/type-handler';
import { WgslTypeMatrix, WgslTypeNumbers, WgslTypeVectors } from './type_handler/type-information';
import { WgslType } from './type_handler/wgsl-type.enum';

// TODO: Add VertexAttributes for vertex shader.

export class Shader extends GpuNativeObject<GPUShaderModule>{
    private readonly mBindGroups: BindGroups;
    private readonly mEntryPoints: EntryPoints;
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

    /**
     * Create bind layout from shader code.
     * @param pSource - Shader source code as string.
     */
    private getBindInformation(pSource: string): BindGroups {
        // Regex for binding index, group index, modifier, variable name and type.
        const lBindInformationRegex: RegExp = /^\s*@group\((?<group>\d+)\)\s*@binding\((?<binding>\d+)\)\s+var(?:<(?<addressspace>[\w,\s]+)>)?\s*(?<name>\w+)\s*:\s*(?<type>[\w,\s<>]*[\w,<>]).*$/gm;

        const lBindInformationList: Array<BindGroupInformation> = new Array<BindGroupInformation>();

        // Get bind information for every group binding.
        let lMatch: RegExpExecArray | null;
        while ((lMatch = lBindInformationRegex.exec(pSource)) !== null) {
            lBindInformationList.push({
                groupIndex: parseInt(lMatch.groups!['group']),
                bindingIndex: parseInt(lMatch.groups!['binding']),
                addressSpace: <GPUBufferBindingType>lMatch.groups!['addressspace'] ?? null,
                variableName: lMatch.groups!['name'],
                type: TypeHandler.typeInformationByString(lMatch.groups!['type'])
            });
        }

        // Group bind information by group and bind index.
        const lGroups: Dictionary<number, Array<BindGroupInformation>> = new Dictionary<number, Array<BindGroupInformation>>();
        for (const lBind of lBindInformationList) {
            let lGroupList: Array<BindGroupInformation> | undefined = lGroups.get(lBind.groupIndex);
            if (!lGroupList) {
                lGroupList = new Array<BindGroupInformation>();
                lGroups.set(lBind.groupIndex, lGroupList);
            }

            lGroupList.push(lBind);
        }

        // Add BindGroupInformation to bind group.
        const lBindGroups: BindGroups = new BindGroups(this.gpu);
        for (const [lGroupIndex, lBindList] of lGroups) {
            const lBindGroup: BindGroupLayout = lBindGroups.addGroup(lGroupIndex);
            for (const lBind of lBindList) {
                this.setBindBasedOnType(lBindGroup, lBind);
            }
        }

        return lBindGroups;
    }

    /**
     * Adds bind to bind group based on binding information.
     * @param pBindGroup - Bind group.
     * @param pBindInformation - Bind information.
     */
    private setBindBasedOnType(pBindGroup: BindGroupLayout, pBindInformation: BindGroupInformation): void {
        // TODO: Calculate correct shaderstage.
        const lShaderStage: ShaderStage = ShaderStage.Vertex | ShaderStage.Fragment | ShaderStage.Compute;

        // Buffer types.
        if ([...WgslTypeNumbers, ...WgslTypeMatrix, ...WgslTypeVectors, WgslType.Array, WgslType.Any].includes(pBindInformation.type.type)) {
            // Validate address space.
            if (!pBindInformation.addressSpace) {
                throw new Exception(`Buffer bind type needs to be set for buffer bindings (${pBindInformation.variableName}).`, this);
            }

            pBindGroup.addBuffer(pBindInformation.variableName, pBindInformation.bindingIndex, lShaderStage, pBindInformation.addressSpace);
        } else {
            throw new Exception('Not implemented. Upps', this);
        }
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