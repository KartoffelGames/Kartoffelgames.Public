import { SamplerType } from '../../constant/sampler-type.enum';
import { TextureFormat } from '../../constant/texture-format.enum';
import { TextureViewDimension } from '../../constant/texture-view-dimension.enum';
import { BaseMemoryLayout } from '../../memory_layout/base-memory-layout';
import { SamplerMemoryLayout } from '../../memory_layout/texture/sampler-memory-layout';
import { TextureViewMemoryLayout } from '../../memory_layout/texture/texture-view-memory-layout';
import { BindGroupLayoutArrayMemoryLayoutSetup } from './bind-group-layout-array-memory-layout-setup';

export class BindGroupLayoutMemoryLayoutSetup extends BindGroupLayoutArrayMemoryLayoutSetup<BaseMemoryLayout> {
    /**
     * Memory layout as sampler.
     * 
     * @param pSamplerType - Sampler type.
     */
    public withSampler(pSamplerType: SamplerType): void {
        const lLayout: SamplerMemoryLayout = new SamplerMemoryLayout(this.device, pSamplerType);

        // Send created data.
        this.sendData(lLayout);
    }

    /**
     * Memory layout as texture.
     * 
     * @param pTextureDimension - Texture dimension.
     * @param pTextureFormat - Texture format.
     * @param pTextureBindType - Texture binding.
     */
    public withTexture(pTextureDimension: TextureViewDimension, pTextureFormat: TextureFormat): void {
        const lLayout: TextureViewMemoryLayout = new TextureViewMemoryLayout(this.device, {
            dimension: pTextureDimension,
            format: pTextureFormat,
            multisampled: false
        });

        // Send created data.
        this.sendData(lLayout);
    }
}