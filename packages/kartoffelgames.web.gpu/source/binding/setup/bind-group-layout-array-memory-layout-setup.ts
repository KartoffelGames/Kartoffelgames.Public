import { Exception } from '@kartoffelgames/core';
import { BufferAlignmentType } from '../../constant/buffer-alignment-type.enum';
import { BufferItemFormat } from '../../constant/buffer-item-format.enum';
import { BufferItemMultiplier } from '../../constant/buffer-item-multiplier.enum';
import { GpuObjectSetupReferences } from '../../gpu/object/gpu-object';
import { GpuObjectChildSetup } from '../../gpu/object/gpu-object-child-setup';
import { BaseMemoryLayout } from '../../memory_layout/base-memory-layout';
import { ArrayBufferMemoryLayout } from '../../memory_layout/buffer/array-buffer-memory-layout';
import { BaseBufferMemoryLayout } from '../../memory_layout/buffer/base-buffer-memory-layout';
import { PrimitiveBufferMemoryLayout } from '../../memory_layout/buffer/primitive-buffer-memory-layout';
import { StructBufferMemoryLayout } from '../../memory_layout/buffer/struct-buffer-memory-layout';
import { StructBufferMemoryLayoutSetup } from '../../memory_layout/buffer/struct-buffer-memory-layout-setup';
import { BindGroupLayoutSetupData } from './bind-group-layout-setup';

export class BindGroupLayoutArrayMemoryLayoutSetup<TLayout extends BaseMemoryLayout> extends GpuObjectChildSetup<BindGroupLayoutSetupData, MemoryLayoutCallback<TLayout>> {
    private readonly mAlignmentType: BufferAlignmentType;

    /**
     * Constructor.
     * 
     * @param pSetupReference - Setup references.
     * @param pAlignmentType - Buffers alignment type.
     * @param pDataCallback - Data callback.
     */
    public constructor(pSetupReference: GpuObjectSetupReferences<BindGroupLayoutSetupData>, pAlignmentType: BufferAlignmentType, pDataCallback: MemoryLayoutCallback<TLayout>) {
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
    public withArray(pSize: number = -1): BindGroupLayoutArrayMemoryLayoutSetup<BaseBufferMemoryLayout> {
        return new BindGroupLayoutArrayMemoryLayoutSetup(this.setupReferences, this.mAlignmentType, (pMemoryLayout: BaseBufferMemoryLayout) => {
            const lLayout: ArrayBufferMemoryLayout = new ArrayBufferMemoryLayout(this.device, {
                arraySize: pSize,
                innerType: pMemoryLayout
            });

            this.sendData(lLayout as unknown as TLayout);
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
        this.sendData(lLayout as unknown as TLayout);
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
        this.sendData(lLayout as unknown as TLayout);
    }
}

type MemoryLayoutCallback<TLayout extends BaseMemoryLayout> = (pMemoryLayout: TLayout) => void;