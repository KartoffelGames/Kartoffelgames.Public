import { GpuObjectChildSetup } from '../../gpu/object/gpu-object-child-setup';
import { ArrayBufferMemoryLayout } from '../../memory_layout/buffer/array-buffer-memory-layout';
import { BaseBufferMemoryLayout } from '../../memory_layout/buffer/base-buffer-memory-layout';
import { PrimitiveBufferFormat } from '../../memory_layout/buffer/enum/primitive-buffer-format.enum';
import { PrimitiveBufferMultiplier } from '../../memory_layout/buffer/enum/primitive-buffer-multiplier.enum';
import { PrimitiveBufferMemoryLayout } from '../../memory_layout/buffer/primitive-buffer-memory-layout';
import { StructBufferMemoryLayout } from '../../memory_layout/buffer/struct-buffer-memory-layout';
import { StructBufferMemoryLayoutSetup } from '../../memory_layout/buffer/struct-buffer-memory-layout-setup';
import { BindGroupLayoutSetupData } from './bind-group-layout-setup';

export class BindGroupLayoutArrayMemoryLayoutSetup extends GpuObjectChildSetup<BindGroupLayoutSetupData, MemoryLayoutCallback> {
    /**
     * Inner type as array.
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
     * Inner type as primitive.
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
     * Inner type as struct
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
}

type MemoryLayoutCallback = (pMemoryLayout: BaseBufferMemoryLayout) => void;