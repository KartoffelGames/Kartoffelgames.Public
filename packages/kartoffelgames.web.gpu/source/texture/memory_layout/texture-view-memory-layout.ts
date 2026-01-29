import { BaseMemoryLayout } from '../../base-memory-layout.ts';
import type { TextureFormat } from '../../constant/texture-format.enum.ts';
import type { TextureViewDimension } from '../../constant/texture-view-dimension.enum.ts';
import type { GpuDevice } from '../../device/gpu-device.ts';

/**
 * Memory layout for textures views.
 */
export class TextureViewMemoryLayout extends BaseMemoryLayout {
    private readonly mDimension: TextureViewDimension;
    private readonly mFormat: TextureFormat;
    private readonly mMultisampled: boolean;

    /**
     * Texture dimension.
     */
    public get dimension(): TextureViewDimension {
        return this.mDimension;
    }

    /**
     * Texture format.
     */
    public get format(): TextureFormat {
        return this.mFormat;
    }

    /**
     * Texture uses multisample.
     */
    public get multisampled(): boolean {
        return this.mMultisampled;
    }

    /**
     * Constructor.
     * 
     * @param pDevice - Device reference.
     * @param pParameter - Parameter.
     */
    public constructor(pDevice: GpuDevice, pParameter: TextureViewMemoryLayoutParameter) {
        super(pDevice);

        // Set defauls.
        this.mDimension = pParameter.dimension;
        this.mFormat = pParameter.format;
        this.mMultisampled = pParameter.multisampled;
    }
}

type TextureViewMemoryLayoutParameter = {
    dimension: TextureViewDimension;
    format: TextureFormat;
    multisampled: boolean;
};
