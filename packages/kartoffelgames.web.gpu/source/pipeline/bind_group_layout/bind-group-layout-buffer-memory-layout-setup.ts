import { Exception } from '@kartoffelgames/core';
import { ArrayBufferMemoryLayout } from '../../buffer/memory_layout/array-buffer-memory-layout.ts';
import { BaseBufferMemoryLayout } from '../../buffer/memory_layout/base-buffer-memory-layout.ts';
import { PrimitiveBufferMemoryLayout } from '../../buffer/memory_layout/primitive-buffer-memory-layout.ts';
import { StructBufferMemoryLayout } from '../../buffer/memory_layout/struct-buffer-memory-layout.ts';
import { StructBufferMemoryLayoutSetup } from '../../buffer/memory_layout/struct-buffer-memory-layout-setup.ts';
import { BufferAlignmentType } from '../../constant/buffer-alignment-type.enum.ts';
import { BufferItemFormat } from '../../constant/buffer-item-format.enum.ts';
import { BufferItemMultiplier } from '../../constant/buffer-item-multiplier.enum.ts';
import { GpuObjectSetupReferences } from '../../gpu_object/gpu-object.ts';
import { GpuObjectChildSetup } from '../../gpu_object/gpu-object-child-setup.ts';
import { BindGroupLayoutSetupData } from './bind-group-layout-setup.ts';

/**
 * Buffer memory layout setup object for bind group layouts.
 */
export class BindGroupLayoutBufferMemoryLayoutSetup extends GpuObjectChildSetup<BindGroupLayoutSetupData, MemoryLayoutCallback> {
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
     * Inner type as array.
     * 
     * @param pSize - Optional. Set size fixed.
     *  
     * @returns array setup. 
     */
    public withArray(pSize: number = -1): BindGroupLayoutBufferMemoryLayoutSetup {
        return new BindGroupLayoutBufferMemoryLayoutSetup(this.setupReferences, this.mAlignmentType, (pMemoryLayout: BaseBufferMemoryLayout) => {
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
    public withPrimitive(pPrimitiveFormat: BufferItemFormat, pPrimitiveMultiplier: BufferItemMultiplier): void {
        // Validate for 32bit formats.
        if (pPrimitiveFormat !== BufferItemFormat.Float32 && pPrimitiveFormat !== BufferItemFormat.Uint32 && pPrimitiveFormat !== BufferItemFormat.Sint32) {
            throw new Exception('Uniform layout must be a 32bit format.', this);
        }

        const lLayout: PrimitiveBufferMemoryLayout = new PrimitiveBufferMemoryLayout(this.device, {
            alignmentType: this.mAlignmentType,
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
        const lLayout: StructBufferMemoryLayout = new StructBufferMemoryLayout(this.device, this.mAlignmentType);
        lLayout.setup(pSetupCall);

        // Send created data.
        this.sendData(lLayout);
    }
}

type MemoryLayoutCallback = (pMemoryLayout: BaseBufferMemoryLayout) => void;