import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { BindType } from '../enum/bind-type.enum';
import { ShaderStage } from '../enum/shader-stage.enum';
import { Gpu } from '../gpu';
import { GpuNativeObject } from '../gpu-native-object';
import { BindGroup } from './bind-group';

export class BindGroupLayout extends GpuNativeObject<GPUBindGroupLayout> {
    private readonly mGroupBinds: Dictionary<string, BindLayout>;
    private mRequestUpdate: boolean;

    /**
     * Get basic information of group binds.
     */
    public get binds(): Array<BindInformation> {
        const lResult: Array<BindInformation> = new Array<BindInformation>();

        // Fetch general and basic information from group bind.
        const lBindList: Array<BindLayout> = [...this.mGroupBinds.values()];
        for (let lIndex: number = 0; lIndex < lBindList.length; lIndex++) {
            const lBind = lBindList[lIndex];
            lResult.push({
                name: lBind.name,
                type: lBind.bindType,
                index: lIndex
            });
        }

        return lResult;
    }

    /**
     * Constructor.
     * @param pGpu - GPU.
     */
    public constructor(pGpu: Gpu) {
        super(pGpu);
        this.mGroupBinds = new Dictionary<string, BindLayout>();
        this.mRequestUpdate = false;
    }

    /**
     * Add buffer bind.
     * @param pName - Bind name.
     * @param pVisibility - Visibility.
     * @param pBindingType - Bind type.
     * @param pHasDynamicOffset - Has dynamic offset.
     * @param pMinBindingSize - min binding size.
     */
    public addBuffer(pName: string, pVisibility: ShaderStage, pBindingType: GPUBufferBindingType = 'uniform', pHasDynamicOffset: boolean = false, pMinBindingSize: GPUSize64 = 0): void {
        this.mGroupBinds.set(pName, {
            bindType: BindType.Buffer,
            name: pName,
            visibility: pVisibility,
            type: pBindingType,
            hasDynamicOffset: pHasDynamicOffset,
            minBindingSize: pMinBindingSize
        });

        // Request native object update.
        this.mRequestUpdate = true;
    }

    /**
     * Add external texture bind.
     * @param pName - Bind name.
     * @param pVisibility - Visibility.
     */
    public addExternalTexture(pName: string, pVisibility: ShaderStage): void {
        this.mGroupBinds.set(pName, {
            bindType: BindType.ExternalTexture,
            name: pName,
            visibility: pVisibility,
        });

        // Request native object update.
        this.mRequestUpdate = true;
    }

    /**
     * Add sampler bind.
     * @param pName - Bind name.
     * @param pVisibility - Visibility.
     * @param pSampleType - Sample type.
     */
    public addSampler(pName: string, pVisibility: ShaderStage, pSampleType: GPUSamplerBindingType = 'filtering'): void {
        this.mGroupBinds.set(pName, {
            bindType: BindType.Sampler,
            name: pName,
            visibility: pVisibility,
            type: pSampleType
        });

        // Request native object update.
        this.mRequestUpdate = true;
    }

    /**
     * Add storage texture bind.
     * @param pName - Bind name.
     * @param pVisibility - Visibility.
     * @param pFormat - Color format.
     * @param storageAccess - Storage access.
     * @param pDimension - Texture dimension.
     */
    public addStorageTexture(pName: string, pVisibility: ShaderStage, pFormat: GPUTextureFormat, pStorageAccess: GPUStorageTextureAccess = 'write-only', pDimension: GPUTextureViewDimension = '2d'): void {
        this.mGroupBinds.set(pName, {
            name: pName,
            bindType: BindType.StorageTexture,
            visibility: pVisibility,
            access: pStorageAccess,
            format: pFormat,
            viewDimension: pDimension
        });

        // Request native object update.
        this.mRequestUpdate = true;
    }

    /**
     * Add texture bind.
     * @param pName - Bind name.
     * @param pVisibility - Visibility.
     * @param pSampleType - Sample type.
     * @param pViewDimension - View dimension.
     * @param pMultisampled - Is multisampled.
     */
    public addTexture(pName: string, pVisibility: ShaderStage, pSampleType: GPUTextureSampleType = 'float', pViewDimension: GPUTextureViewDimension = '2d', pMultisampled: boolean = false): void {
        this.mGroupBinds.set(pName, {
            name: pName,
            bindType: BindType.Texture,
            visibility: pVisibility,
            sampleType: pSampleType,
            viewDimension: pViewDimension,
            multisampled: pMultisampled
        });

        // Request native object update.
        this.mRequestUpdate = true;
    }

    /**
     * Create bind group based on this layout.
     */
    public createBindGroup(): BindGroup{
        return new BindGroup(this.gpu, this);
    }

    /**
     * Get full bind information.
     * @param pName - Bind name.
     */
    public getBind(pName: string): Readonly<BindLayout> {
        if (!this.mGroupBinds.has(pName)) {
            throw new Exception(`Bind ${pName} does not exist.`, this);
        }

        return this.mGroupBinds.get(pName)!;
    }

    /** 
     * Remove bind.
     */
    public removeBind(pName: string): void {
        this.mGroupBinds.delete(pName);

        // Request native object update.
        this.mRequestUpdate = true;
    }

    /**
     * Destory and free storage of native object.
     * @param _pNativeObject - Native layout object.
     */
    protected async destroyNative(_pNativeObject: GPUBindGroupLayout): Promise<void> {
        // No action needed.
    }

    /**
     * Generate layout.
     */
    protected async generate(): Promise<GPUBindGroupLayout> {
        const lEntryList: Array<GPUBindGroupLayoutEntry> = new Array<GPUBindGroupLayoutEntry>();

        // Generate layout entry for each binding.
        const lBindList: Array<BindLayout> = [...this.mGroupBinds.values()];
        for (let lIndex: number = 0; lIndex < lBindList.length; lIndex++) {
            const lEntry = lBindList[lIndex];

            // Generate default properties.
            const lLayoutEntry: GPUBindGroupLayoutEntry = {
                visibility: lEntry.visibility,
                binding: lIndex
            };

            switch (lEntry.bindType) {
                case BindType.Buffer: {
                    const lBufferLayout: Required<GPUBufferBindingLayout> = {
                        type: lEntry.type,
                        minBindingSize: lEntry.minBindingSize,
                        hasDynamicOffset: lEntry.hasDynamicOffset
                    };
                    lLayoutEntry.buffer = lBufferLayout;
                    break;
                }
                case BindType.Texture: {
                    const lTextureLayout: Required<GPUTextureBindingLayout> = {
                        sampleType: lEntry.sampleType,
                        multisampled: lEntry.multisampled,
                        viewDimension: lEntry.viewDimension
                    };
                    lLayoutEntry.texture = lTextureLayout;
                    break;
                }
                case BindType.ExternalTexture: {
                    const lExternalTextureLayout: Required<GPUExternalTextureBindingLayout> = {};
                    lLayoutEntry.externalTexture = lExternalTextureLayout;
                    break;
                }
                case BindType.StorageTexture: {
                    const lStorageTextureLayout: Required<GPUStorageTextureBindingLayout> = {
                        access: lEntry.access,
                        format: lEntry.format,
                        viewDimension: lEntry.viewDimension
                    };
                    lLayoutEntry.storageTexture = lStorageTextureLayout;
                    break;
                }
                case BindType.Sampler: {
                    const lSamplerLayout: Required<GPUSamplerBindingLayout> = {
                        type: lEntry.type
                    };
                    lLayoutEntry.sampler = lSamplerLayout;
                    break;
                }
            }

            lEntryList.push(lLayoutEntry);
        }

        // Reset update request.
        this.mRequestUpdate = false;

        // Create binding group layout.
        return this.gpu.device.createBindGroupLayout({
            entries: lEntryList
        });
    }

    /**
     * Invalidate native object when binding group changes. 
     */
    protected override async validateState(): Promise<boolean> {
        return !this.mRequestUpdate;
    }
}

interface BaseBindLayout {
    name: string;
    bindType: BindType;
    visibility: ShaderStage;
}

interface BufferBindLayout extends BaseBindLayout, Required<GPUBufferBindingLayout> {
    bindType: BindType.Buffer;
}

interface SamplerBindLayout extends BaseBindLayout, Required<GPUSamplerBindingLayout> {
    bindType: BindType.Sampler;
}

interface TextureBindLayout extends BaseBindLayout, Required<GPUTextureBindingLayout> {
    bindType: BindType.Texture;
}

interface StorageTextureBindLayout extends BaseBindLayout, Required<GPUStorageTextureBindingLayout> {
    bindType: BindType.StorageTexture;
}

interface ExternalTextureBindLayout extends BaseBindLayout, Required<GPUExternalTextureBindingLayout> {
    bindType: BindType.ExternalTexture;
}

export type BindLayout = BufferBindLayout | SamplerBindLayout | TextureBindLayout | StorageTextureBindLayout | ExternalTextureBindLayout;

export type BindInformation = {
    name: string,
    type: BindType,
    index: number;
};