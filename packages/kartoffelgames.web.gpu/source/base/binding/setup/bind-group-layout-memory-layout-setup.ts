import { SamplerType } from '../../../constant/sampler-type.enum';
import { TextureDimension } from '../../../constant/texture-dimension.enum';
import { TextureFormat } from '../../../constant/texture-format.enum';
import { GpuObjectSetupReferences } from '../../gpu/object/gpu-object';
import { GpuObjectChildSetup } from '../../gpu/object/gpu-object-child-setup';
import { BaseMemoryLayout } from '../../memory_layout/base-memory-layout';
import { ArrayBufferMemoryLayout } from '../../memory_layout/buffer/array-buffer-memory-layout';
import { BaseBufferMemoryLayout } from '../../memory_layout/buffer/base-buffer-memory-layout';
import { PrimitiveBufferFormat } from '../../memory_layout/buffer/enum/primitive-buffer-format.enum';
import { PrimitiveBufferMultiplier } from '../../memory_layout/buffer/enum/primitive-buffer-multiplier.enum';
import { PrimitiveBufferMemoryLayout } from '../../memory_layout/buffer/primitive-buffer-memory-layout';
import { StructBufferMemoryLayout } from '../../memory_layout/buffer/struct-buffer-memory-layout';
import { StructBufferMemoryLayoutSetup } from '../../memory_layout/buffer/struct-buffer-memory-layout-setup';
import { SamplerMemoryLayout } from '../../memory_layout/texture/sampler-memory-layout';
import { TextureMemoryLayout } from '../../memory_layout/texture/texture-memory-layout';
import { BindGroupLayoutArrayMemoryLayoutSetup } from './bind-group-layout-array-memory-layout-setup';
import { BindGroupLayoutSetupData } from './bind-group-layout-setup';

export class BindGroupLayoutMemoryLayoutSetup extends GpuObjectChildSetup<BindGroupLayoutSetupData, MemoryLayoutCallback> {
    /**
     * Constructor.
     * 
     * @param pUsage - Buffer usage. 
     * @param pSetupReference - Setup references.
     * @param pDataCallback - Data callback.
     */
    public constructor(pSetupReference: GpuObjectSetupReferences<BindGroupLayoutSetupData>, pDataCallback: MemoryLayoutCallback) {
        super(pSetupReference, pDataCallback);
    }

    /**
     * Buffer as array.
     * 
     * @param pSize - Optional. Set size fixed.
     *  
     * @returns array setup. 
     */
    public withArray(pSize: number = -1): BindGroupLayoutArrayMemoryLayoutSetup {
        return new BindGroupLayoutArrayMemoryLayoutSetup(this.setupReferences, (pMemoryLayout: BaseBufferMemoryLayout) => {
            const lLayout: ArrayBufferMemoryLayout = new ArrayBufferMemoryLayout(this.device, {
                arraySize: pSize,
                innerType: pMemoryLayout
            });

            this.sendData(lLayout);
        });
    }

    /**
     * Memory layout as primitive.
     * 
     * @param pPrimitiveFormat - Primitive format.
     * @param pPrimitiveMultiplier - Value multiplier.
     */
    public withPrimitive(pPrimitiveFormat: PrimitiveBufferFormat, pPrimitiveMultiplier: PrimitiveBufferMultiplier): void {
        const lLayout: PrimitiveBufferMemoryLayout = new PrimitiveBufferMemoryLayout(this.device, {
            primitiveFormat: pPrimitiveFormat,
            primitiveMultiplier: pPrimitiveMultiplier,
        });

        // Send created data.
        this.sendData(lLayout);
    }

    /**
     * Memory layout as sampler.
     * 
     * @param pSamplerType - Sampler type.
     */
    public withSampler(pSamplerType: SamplerType): void {
        const lLayout: SamplerMemoryLayout = new SamplerMemoryLayout(this.device, {
            samplerType: pSamplerType
        });

        // Send created data.
        this.sendData(lLayout);
    }

    /**
     * Memory layout as struct
     * 
     * @param pSetupCall - Struct setup call.
     */
    public withStruct(pSetupCall: (pSetup: StructBufferMemoryLayoutSetup) => void): void {
        // Create and setup struct buffer memory layout.
        const lLayout: StructBufferMemoryLayout = new StructBufferMemoryLayout(this.device);
        lLayout.setup(pSetupCall);

        // Send created data.
        this.sendData(lLayout);
    }

    /**
     * Memory layout as texture.
     * 
     * @param pTextureDimension - Texture dimension.
     * @param pTextureFormat - Texture format.
     * @param pTextureBindType - Texture binding.
     * @param pMultisampled  - Is texture multisampled. 
     */
    public withTexture(pTextureDimension: TextureDimension, pTextureFormat: TextureFormat, pMultisampled: boolean): void {
        const lLayout: TextureMemoryLayout = new TextureMemoryLayout(this.device, {
            dimension: pTextureDimension,
            format: pTextureFormat,
            multisampled: pMultisampled
        });

        // Send created data.
        this.sendData(lLayout);
    }
}

type MemoryLayoutCallback = (pMemoryLayout: BaseMemoryLayout) => void;