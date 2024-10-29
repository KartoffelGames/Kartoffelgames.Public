import { BufferAlignmentType } from '../../constant/buffer-alignment-type.enum';
import { SamplerType } from '../../constant/sampler-type.enum';
import { TextureFormat } from '../../constant/texture-format.enum';
import { TextureViewDimension } from '../../constant/texture-view-dimension.enum';
import { GpuObjectSetupReferences } from '../../gpu/object/gpu-object';
import { GpuObjectChildSetup } from '../../gpu/object/gpu-object-child-setup';
import { BaseMemoryLayout } from '../../memory_layout/base-memory-layout';
import { BaseBufferMemoryLayout } from '../../memory_layout/buffer/base-buffer-memory-layout';
import { SamplerMemoryLayout } from '../../memory_layout/texture/sampler-memory-layout';
import { TextureViewMemoryLayout } from '../../memory_layout/texture/texture-view-memory-layout';
import { BindGroupLayoutBufferMemoryLayoutSetup } from './bind-group-layout-buffer-memory-layout-setup';
import { BindGroupLayoutSetupData } from './bind-group-layout-setup';

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
    public asBuffer(pDynamicOffsets: number = 1): BindGroupLayoutBufferMemoryLayoutSetup {
        return new BindGroupLayoutBufferMemoryLayoutSetup(this.setupReferences, this.mAlignmentType, (pMemoryLayout: BaseBufferMemoryLayout) => {
            this.sendData({
                layout: pMemoryLayout,
                dynamicOffsetCount: pDynamicOffsets
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
            dynamicOffsetCount: 1
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
            dynamicOffsetCount: 1
        });
    }
}

export type BindGroupBindingMemoryLayoutSetuData = {
    layout: BaseMemoryLayout;
    dynamicOffsetCount: number;
};
type MemoryLayoutCallback = (pMemoryLayout: BindGroupBindingMemoryLayoutSetuData) => void;