import { GpuObjectChildSetup } from '../../gpu/object/gpu-object-child-setup';
import { ArrayBufferMemoryLayout } from './array-buffer-memory-layout';
import { BaseBufferMemoryLayout } from './base-buffer-memory-layout';
import { PrimitiveBufferFormat } from './enum/primitive-buffer-format.enum';
import { PrimitiveBufferMultiplier } from './enum/primitive-buffer-multiplier.enum';
import { PrimitiveBufferMemoryLayout } from './primitive-buffer-memory-layout';
import { StructBufferMemoryLayout } from './struct-buffer-memory-layout';
import { StructBufferMemoryLayoutSetup, StructBufferMemoryLayoutSetupData } from './struct-buffer-memory-layout-setup';

export class StructBufferMemoryLayoutPropertySetup extends GpuObjectChildSetup<StructBufferMemoryLayoutSetupData, MemoryLayoutCallback> {
    /**
     * Buffer as array.
     * 
     * @param pSize - Optional. Set size fixed.
     *  
     * @returns array setup. 
     */
    public asArray(pSize: number = -1): StructBufferMemoryLayoutPropertySetup {
        return new StructBufferMemoryLayoutPropertySetup(this.setupReferences, (pMemoryLayout: BaseBufferMemoryLayout) => {
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
    public asPrimitive(pPrimitiveFormat: PrimitiveBufferFormat, pPrimitiveMultiplier: PrimitiveBufferMultiplier): void {
        const lLayout: PrimitiveBufferMemoryLayout = new PrimitiveBufferMemoryLayout(this.device, {
            primitiveFormat: pPrimitiveFormat,
            primitiveMultiplier: pPrimitiveMultiplier,
        });

        // Send created data.
        this.sendData(lLayout);
    }

    /**
     * Memory layout as struct
     * 
     * @param pSetupCall - Struct setup call.
     */
    public asStruct(pSetupCall: (pSetup: StructBufferMemoryLayoutSetup) => void): void {
        // Create and setup struct buffer memory layout.
        const lLayout: StructBufferMemoryLayout = new StructBufferMemoryLayout(this.device);
        lLayout.setup(pSetupCall);

        // Send created data.
        this.sendData(lLayout);
    }
}


type MemoryLayoutCallback = (pMemoryLayout: BaseBufferMemoryLayout) => void;