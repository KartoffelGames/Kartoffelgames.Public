import { TextureFormat } from '../../constant/texture-format.enum';
import { TextureViewDimension } from '../../constant/texture-view-dimension.enum';
import { GpuDevice } from '../../gpu/gpu-device';
import { BaseMemoryLayout } from '../base-memory-layout';

/**
 * Memory layout for textures.
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
