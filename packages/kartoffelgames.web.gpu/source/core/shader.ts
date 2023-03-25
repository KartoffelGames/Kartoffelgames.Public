import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { BindGroupLayout } from './bind_group/bind-group-layout';
import { BindGroups } from './bind_group/bind-groups';
import { ShaderStage } from './enum/shader-stage.enum';
import { Gpu } from './gpu';
import { GpuNativeObject } from './gpu-native-object';
import { TypeHandler, WgslTypeDefinition } from './type_handler/type-handler';
import { WgslTypeDepthTexture, WgslTypeDepthTextures, WgslTypeMatrices, WgslTypeNumbers, WgslTypeStorageTexture, WgslTypeStorageTextures, WgslTypeTexelFormat, WgslTypeTexture, WgslTypeTextures, WgslTypeVectors } from './type_handler/type-information';
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

        // Fetch entry points.
        this.mEntryPoints = {
            fragment: /(@fragment(.|\r?\n)*?fn )(\w*)/gm.exec(pSource)?.[3],
            vertex: /(@vertex(.|\r?\n)*?fn )(\w*)/gm.exec(pSource)?.[3],
            compute: /(@compute(.|\r?\n)*?fn )(\w*)/gm.exec(pSource)?.[3]
        };

        this.mBindGroups = this.getBindInformation(pSource);
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
                typeDefinition: TypeHandler.typeInformationByString(lMatch.groups!['type'])
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
        // Available shader states based on entry points.
        // Not the best, but better than nothing.
        let lShaderStage: ShaderStage = 0;
        if (this.mEntryPoints.compute) {
            lShaderStage |= ShaderStage.Compute;
        }
        if (this.mEntryPoints.fragment) {
            lShaderStage |= ShaderStage.Fragment;
        }
        if (this.mEntryPoints.vertex) {
            lShaderStage |= ShaderStage.Vertex;
        }

        // Buffer types.
        // Number, matrix, vector and array types.
        if ([...WgslTypeNumbers, ...WgslTypeMatrices, ...WgslTypeVectors, WgslType.Array, WgslType.Any].includes(pBindInformation.typeDefinition.type)) {
            // Validate address space.
            if (!pBindInformation.addressSpace) {
                throw new Exception(`Buffer bind type needs to be set for buffer bindings (${pBindInformation.variableName}).`, this);
            }

            // Bind 
            pBindGroup.addBuffer(pBindInformation.variableName, pBindInformation.bindingIndex, lShaderStage, pBindInformation.addressSpace);

            // Exit.
            return;
        }

        // Bind only external textures.
        if (pBindInformation.typeDefinition.type === WgslType.TextureExternal) {
            // Bind.
            pBindGroup.addExternalTexture(pBindInformation.variableName, pBindInformation.bindingIndex, lShaderStage);

            // Exit.
            return;
        }

        // Sampler types.
        else if ([WgslType.Sampler, WgslType.SamplerComparison].includes(pBindInformation.typeDefinition.type)) {
            // Sampler bind type by sampler or comparison type.
            if (pBindInformation.typeDefinition.type === WgslType.Sampler) {
                pBindGroup.addSampler(pBindInformation.variableName, pBindInformation.bindingIndex, lShaderStage, 'filtering');
            } else if (pBindInformation.typeDefinition.type === WgslType.SamplerComparison) {
                pBindGroup.addSampler(pBindInformation.variableName, pBindInformation.bindingIndex, lShaderStage, 'comparison');
            }

            // Exit.
            return;
        }

        // Storage texture.
        if (WgslTypeStorageTextures.includes(<WgslTypeStorageTexture>pBindInformation.typeDefinition.type)) {
            // Storage texture first generics is allways the texel format.
            const lTexelFormat: GPUTextureFormat = <WgslTypeTexelFormat>pBindInformation.typeDefinition.generics[0];
            const lTextureAccess: GPUStorageTextureAccess = 'write-only';
            const lTextureDimension: GPUTextureViewDimension = TypeHandler.getTexureDimensionFromType(<WgslTypeStorageTexture>pBindInformation.typeDefinition.type);

            // Bind storage texture.
            pBindGroup.addStorageTexture(pBindInformation.variableName, pBindInformation.bindingIndex, lShaderStage, lTexelFormat, lTextureAccess, lTextureDimension);

            // Exit.
            return;
        }

        // Depth or color texture.
        if ([...WgslTypeTextures, ...WgslTypeDepthTextures].includes(<WgslTypeDepthTexture | WgslTypeTexture>pBindInformation.typeDefinition.type)) {
            const lTextureDimension: GPUTextureViewDimension = TypeHandler.getTexureDimensionFromType(<WgslTypeDepthTexture | WgslTypeTexture>pBindInformation.typeDefinition.type);
            const lTextureSampleType: GPUTextureSampleType = TypeHandler.getTextureSampleTypeFromGeneric(pBindInformation.typeDefinition);

            if ([WgslType.TextureMultisampled2d, WgslType.TextureDepthMultisampled2d].includes(pBindInformation.typeDefinition.type)) {
                pBindGroup.addTexture(pBindInformation.variableName, pBindInformation.bindingIndex, lShaderStage, lTextureSampleType, lTextureDimension, true);
            } else {
                pBindGroup.addTexture(pBindInformation.variableName, pBindInformation.bindingIndex, lShaderStage, lTextureSampleType, lTextureDimension, false);
            }

            // Exit.
            return;
        }

        throw new Exception(`Not implemented. Upps "${pBindInformation.typeDefinition.type}"`, this);
    }
}

type BindGroupInformation = {
    groupIndex: number;
    bindingIndex: number;
    addressSpace: GPUBufferBindingType | null;
    variableName: string;
    typeDefinition: WgslTypeDefinition;
};

type EntryPoints = {
    fragment?: string | undefined;
    vertex?: string | undefined;
    compute?: string | undefined;
};