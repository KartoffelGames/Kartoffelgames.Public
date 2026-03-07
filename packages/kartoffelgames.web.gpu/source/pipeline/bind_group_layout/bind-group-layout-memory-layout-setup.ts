import type { SamplerType } from '../../constant/sampler-type.enum.ts';
import type { TextureFormat } from '../../constant/texture-format.enum.ts';
import type { TextureViewDimension } from '../../constant/texture-view-dimension.enum.ts';
import type { GpuObjectSetupReferences } from '../../gpu_object/gpu-object.ts';
import { GpuObjectChildSetup } from '../../gpu_object/gpu-object-child-setup.ts';
import type { BindLayoutBinding } from './bind-group-layout.ts';
import type { BindGroupLayoutSetupData } from './bind-group-layout-setup.ts';

/**
 * Child setup object to set types to single bindings.
 */
export class BindGroupLayoutMemoryLayoutSetup extends GpuObjectChildSetup<BindGroupLayoutSetupData, BindGroupLayoutMemoryLayoutSetupResourceCallback> {
    /**
     * Constructor.
     *
     * @param pSetupReference - Setup references.
     * @param pDataCallback - Data callback.
     */
    public constructor(pSetupReference: GpuObjectSetupReferences<BindGroupLayoutSetupData>, pDataCallback: BindGroupLayoutMemoryLayoutSetupResourceCallback) {
        super(pSetupReference, pDataCallback);
    }

    /**
     * Resource as buffer with size parameters and optional dynamic offsets.
     *
     * @param pFixedSize - Fixed byte size of the buffer.
     * @param pVariableSize - Variable byte size per element. Default 0.
     * @param pHasDynamicOffset - Has dynamic offset. Default false.
     */
    public asBuffer(pFixedSize: number, pVariableSize: number = 0, pHasDynamicOffset: boolean = false): void {
        this.sendData({
            resource: {
                type: 'buffer',
                fixedSize: pFixedSize,
                variableSize: pVariableSize
            },
            hasDynamicOffset: pHasDynamicOffset
        });
    }

    /**
     * Resource as sampler.
     *
     * @param pSamplerType - Sampler type.
     */
    public asSampler(pSamplerType: SamplerType): void {
        // Send created data.
        this.sendData({
            resource: {
                type: 'sampler',
                samplerType: pSamplerType
            },
            hasDynamicOffset: false
        });
    }

    /**
     * Resource as texture.
     *
     * @param pTextureDimension - Texture dimension.
     * @param pTextureFormat - Texture format.
     */
    public asTexture(pTextureDimension: TextureViewDimension, pTextureFormat: TextureFormat): void {
        // Send created data.
        this.sendData({
            resource: {
                type: 'texture',
                dimension: pTextureDimension,
                format: pTextureFormat,
                multisampled: false
            },
            hasDynamicOffset: false
        });
    }
}

export type BindGroupLayoutMemoryLayoutSetupData = {
    resource: BindLayoutBinding;
    hasDynamicOffset: boolean;
};
type BindGroupLayoutMemoryLayoutSetupResourceCallback = (pResourceData: BindGroupLayoutMemoryLayoutSetupData) => void;
