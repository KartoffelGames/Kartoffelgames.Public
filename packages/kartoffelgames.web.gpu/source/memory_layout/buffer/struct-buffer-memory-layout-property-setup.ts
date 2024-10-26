import { GpuObjectChildSetup } from '../../gpu/object/gpu-object-child-setup';
import { ArrayBufferMemoryLayout } from './array-buffer-memory-layout';
import { BaseBufferMemoryLayout } from './base-buffer-memory-layout';
import { BufferItemFormat } from '../../constant/buffer-item-format.enum';
import { BufferItemMultiplier } from '../../constant/buffer-item-multiplier.enum';
import { PrimitiveBufferMemoryLayout } from './primitive-buffer-memory-layout';
import { StructBufferMemoryLayout } from './struct-buffer-memory-layout';
import { StructBufferMemoryLayoutSetup, StructBufferMemoryLayoutSetupData } from './struct-buffer-memory-layout-setup';
import { GpuObjectSetupReferences } from '../../gpu/object/gpu-object';
import { BufferAlignmentType } from '../../constant/buffer-alignment-type.enum';

export class StructBufferMemoryLayoutPropertySetup extends GpuObjectChildSetup<StructBufferMemoryLayoutSetupData, MemoryLayoutCallback> {
    private readonly mAlignmentType: BufferAlignmentType;

    /**
     * Constructor.
     * 
     * @param pUsage - Buffer usage. 
     * @param pSetupReference - Setup references.
     * @param pDataCallback - Data callback.
     */
    public constructor(pSetupReference: GpuObjectSetupReferences<StructBufferMemoryLayoutSetupData>, pAlignmentType: BufferAlignmentType, pDataCallback: MemoryLayoutCallback) {
        super(pSetupReference, pDataCallback);

        this.mAlignmentType = pAlignmentType;
    }

    /**
     * Buffer as array.
     * 
     * @param pSize - Optional. Set size fixed.
     *  
     * @returns array setup. 
     */
    public asArray(pSize: number = -1): StructBufferMemoryLayoutPropertySetup {
        return new StructBufferMemoryLayoutPropertySetup(this.setupReferences, this.mAlignmentType, (pMemoryLayout: BaseBufferMemoryLayout) => {
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
    public asPrimitive(pPrimitiveFormat: BufferItemFormat, pPrimitiveMultiplier: BufferItemMultiplier, pAlignment: number | null = null): void {
        const lLayout: PrimitiveBufferMemoryLayout = new PrimitiveBufferMemoryLayout(this.device, {
            alignmentType: this.mAlignmentType,
            primitiveFormat: pPrimitiveFormat,
            primitiveMultiplier: pPrimitiveMultiplier,
            overrideAlignment: pAlignment
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
        const lLayout: StructBufferMemoryLayout = new StructBufferMemoryLayout(this.device, this.mAlignmentType);
        lLayout.setup(pSetupCall);

        // Send created data.
        this.sendData(lLayout);
    }
}


type MemoryLayoutCallback = (pMemoryLayout: BaseBufferMemoryLayout) => void;