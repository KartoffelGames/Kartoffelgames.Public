import { BaseMemoryLayout } from '../../base-memory-layout.ts';
import { BaseBufferMemoryLayout } from '../../buffer/memory_layout/base-buffer-memory-layout.ts';
import { BufferAlignmentType } from '../../constant/buffer-alignment-type.enum.ts';
import { SamplerType } from '../../constant/sampler-type.enum.ts';
import { TextureFormat } from '../../constant/texture-format.enum.ts';
import { TextureViewDimension } from '../../constant/texture-view-dimension.enum.ts';
import { GpuObjectSetupReferences } from '../../gpu_object/gpu-object.ts';
import { GpuObjectChildSetup } from '../../gpu_object/gpu-object-child-setup.ts';
import { SamplerMemoryLayout } from '../../texture/memory_layout/sampler-memory-layout.ts';
import { TextureViewMemoryLayout } from '../../texture/memory_layout/texture-view-memory-layout.ts';
import { BindGroupLayoutBufferMemoryLayoutSetup } from './bind-group-layout-buffer-memory-layout-setup.ts';
import { BindGroupLayoutSetupData } from './bind-group-layout-setup.ts';

/**
 * Child setup object to set types to single bindings.
 */
export class BindGroupLayoutMemoryLayoutSetup extends GpuObjectChildSetup<BindGroupLayoutSetupData, MemoryLayoutCallback> {
    private readonly mAlignmentType: BufferAlignmentType;

    /**
     * Constructor.
     * 
     * @param pSetupReference - Setup references.
     * @param pAlignmentType - Buffers alignment type.
     * @param pDataCallback - Data callback.
     */
    public constructor(pSetupReference: GpuObjectSetupReferences<BindGroupLayoutSetupData>, pAlignmentType: BufferAlignmentType, pDataCallback: MemoryLayoutCallback) {
        super(pSetupReference, pDataCallback);

        this.mAlignmentType = pAlignmentType;
    }

    /**
     * Memory layout as buffer with optional dynamic offsets.
     * Dynamic offsets are only available for fixed size layouts.
     * 
     * @param pDynamicOffsets - Number of available dynamic offsets.
     * 
     * @returns buffer setup.
     */
    public asBuffer(pHasDynamicOffset: boolean = false): BindGroupLayoutBufferMemoryLayoutSetup {
        return new BindGroupLayoutBufferMemoryLayoutSetup(this.setupReferences, this.mAlignmentType, (pMemoryLayout: BaseBufferMemoryLayout) => {
            this.sendData({
                layout: pMemoryLayout,
                hasDynamicOffset: pHasDynamicOffset
            });
        });
    }

    /**
     * Memory layout as sampler.
     * 
     * @param pSamplerType - Sampler type.
     */
    public asSampler(pSamplerType: SamplerType): void {
        const lLayout: SamplerMemoryLayout = new SamplerMemoryLayout(this.device, pSamplerType);

        // Send created data.
        this.sendData({
            layout: lLayout,
            hasDynamicOffset: false
        });
    }

    /**
     * Memory layout as texture.
     * 
     * @param pTextureDimension - Texture dimension.
     * @param pTextureFormat - Texture format.
     * @param pTextureBindType - Texture binding.
     */
    public asTexture(pTextureDimension: TextureViewDimension, pTextureFormat: TextureFormat): void {
        const lLayout: TextureViewMemoryLayout = new TextureViewMemoryLayout(this.device, {
            dimension: pTextureDimension,
            format: pTextureFormat,
            multisampled: false
        });

        // Send created data.
        this.sendData({
            layout: lLayout,
            hasDynamicOffset: false
        });
    }
}

export type BindGroupBindingMemoryLayoutSetuData = {
    layout: BaseMemoryLayout;
    hasDynamicOffset: boolean;
};
type MemoryLayoutCallback = (pMemoryLayout: BindGroupBindingMemoryLayoutSetuData) => void;