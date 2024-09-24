import { BufferUsage } from '../../../constant/buffer-usage.enum';
import { GpuObjectChildSetup } from '../../gpu/object/gpu-object-child-setup';
import { BaseMemoryLayout } from '../../memory_layout/base-memory-layout';
import { PrimitiveBufferFormat } from '../../memory_layout/buffer/enum/primitive-buffer-format.enum';
import { PrimitiveBufferMultiplier } from '../../memory_layout/buffer/enum/primitive-buffer-multiplier.enum';
import { PrimitiveBufferMemoryLayout } from '../../memory_layout/buffer/primitive-buffer-memory-layout';
import { BindGroupLayoutSetupData } from './bind-group-layout-setup';

export class BindGroupLayoutMemoryLayoutSetup extends GpuObjectChildSetup<BindGroupLayoutSetupData, MemoryLayoutCallback> {
    public asArray(): void {
        // TODO:
    }

    /**
     * Memory layout as primitive.
     * 
     * @param pPrimitiveFormat - Primitive format.
     * @param pPrimitiveMultiplier - Value multiplier.
     * @param pUsage - Memory usage.
     */
    public asPrimitive(pPrimitiveFormat: PrimitiveBufferFormat, pPrimitiveMultiplier: PrimitiveBufferMultiplier, pUsage: BufferUsage): void {
        const lLayout: PrimitiveBufferMemoryLayout = new PrimitiveBufferMemoryLayout({
            primitiveFormat: pPrimitiveFormat,
            primitiveMultiplier: pPrimitiveMultiplier,
            usage: pUsage
        });

        // Send created data.
        this.sendData(lLayout);
    }

    public asStruct(): void {
        // TODO:
    }


}

type MemoryLayoutCallback = (pMemoryLayout: BaseMemoryLayout) => void;