import { BindType } from '../enum/bind-type.enum';
import { ShaderStage } from '../enum/shader-stage.enu';
import { Gpu } from '../gpu';
import { GpuNativeObject } from '../gpu-native-object';

export class BindGroupLayout extends GpuNativeObject<GPUBindGroupLayout> {
    private readonly mGroupBindList: Array<TextureBindLayout | BufferBindLayout>;

    public constructor(pGpu: Gpu) {
        super(pGpu);
        this.mGroupBindList = new Array<TextureBindLayout | BufferBindLayout>();
    }

    /**
     * Add buffer bind.
     * @param pName - Bind name.
     * @param pVisibility - Visibility.
     * @param pType - Bind type.s
     * @param pHasDynamicOffset - Has dynamic offset.
     * @param pMinBindingSize - min binding size.
     */
    public addBuffer(pName: string, pVisibility: BindVisibility, pType: GPUBufferBindingType = 'uniform', pHasDynamicOffset: boolean = false, pMinBindingSize: GPUSize64 = 0): void {
        this.mGroupBindList.push({
            name: pName,
            bindType: 'Buffer',
            visibility: pVisibility,
            type: pType,
            hasDynamicOffset: pHasDynamicOffset,
            minBindingSize: pMinBindingSize
        });
    }

    // TODO: Sampler.

    /**
     * Add texture bind.
     * @param pName - Bind name.
     * @param pVisibility - Visibility.
     * @param pSampleType - Sample type.
     * @param pViewDimension - View dimension.
     * @param pMultisampled - Is multisampled.
     */
    public addTexture(pName: string, pVisibility: BindVisibility, pSampleType: GPUTextureSampleType = 'float', pViewDimension: GPUTextureViewDimension = '2d', pMultisampled: boolean = false): void {
        this.mGroupBindList.push({
            name: pName,
            bindType: 'Texture',
            visibility: pVisibility,
            sampleType: pSampleType,
            viewDimension: pViewDimension,
            multisampled: pMultisampled
        });
    }

    /**
     * Generate layout.
     */
    protected async generate(): Promise<GPUBindGroupLayout> {
        const lEntryList: Array<GPUBindGroupLayoutEntry> = new Array<GPUBindGroupLayoutEntry>();

        // Generate layout entry for each binding.
        for (let lIndex: number = 0; lIndex < this.mGroupBindList.length; lIndex++) {
            const lEntry = this.mGroupBindList[lIndex];
            switch (lEntry.bindType) {
                case 'Buffer': {
                    lEntryList.push({
                        visibility: lEntry.visibility,
                        binding: lIndex,
                        buffer: {
                            type: lEntry.type,
                            minBindingSize: lEntry.minBindingSize,
                            hasDynamicOffset: lEntry.hasDynamicOffset
                        }
                    });
                    break;
                }
                case 'Texture': {
                    lEntryList.push({
                        visibility: lEntry.visibility,
                        binding: lIndex,
                        texture: {
                            sampleType: lEntry.sampleType,
                            multisampled: lEntry.multisampled,
                            viewDimension: lEntry.viewDimension
                        }
                    });
                    break;
                }
            }
        }

        // Create binding group layout.
        return this.gpu.device.createBindGroupLayout({
            entries: lEntryList
        });
    }
}

interface BindLayout {
    name: string;
    bindType: BindType;
    visibility: ShaderStage;
}

interface TextureBindLayout extends BindLayout {
    bindType: 'Texture';
    sampleType: GPUTextureSampleType;
    viewDimension: GPUTextureViewDimension;
    multisampled: boolean;
}

interface BufferBindLayout extends BindLayout {
    bindType: 'Buffer';
    type: GPUBufferBindingType;
    hasDynamicOffset: boolean;
    minBindingSize: GPUSize64;
}
