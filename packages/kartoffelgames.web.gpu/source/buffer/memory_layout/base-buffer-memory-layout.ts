import { BaseMemoryLayout } from '../../base-memory-layout.ts';
import type { BufferAlignmentType } from '../../constant/buffer-alignment-type.enum.ts';
import type { GpuDevice } from '../../device/gpu-device.ts';
import type { GpuObjectSetup } from '../../gpu_object/gpu-object-setup.ts';

/**
 * Basic memory layout for gpu buffers. 
 */
export abstract class BaseBufferMemoryLayout<TSetupObject extends GpuObjectSetup<any> | null = any> extends BaseMemoryLayout<TSetupObject> {
    private readonly mAlignmentType: BufferAlignmentType;

    /**
     * Type byte alignment.
     */
    public abstract readonly alignment: number;

    /**
     * Fixed buffer size in bytes.
     */
    public abstract readonly fixedSize: number;

    /**
     * Size of the variable part of layout in bytes.
     */
    public abstract readonly variableSize: number;

    /**
     * Buffer value alignment type.
     */
    public get alignmentType(): BufferAlignmentType {
        return this.mAlignmentType;
    }

    /**
     * Constructor.
     * 
     * @param pDevice - Device reference.
     */
    public constructor(pDevice: GpuDevice, pAlignmentType: BufferAlignmentType) {
        super(pDevice);
        this.mAlignmentType = pAlignmentType;
    }

    /**
     * Get location of path.
     * @param pPathName - Path name. Divided by dots.
     */
    public abstract locationOf(pPathName: Array<string>): BufferLayoutLocation;
}

export type BufferLayoutLocation = {
    /**
     * Offset in bytes.
     */
    offset: number;

    /**
     * Size in byte.
     */
    size: number;
};