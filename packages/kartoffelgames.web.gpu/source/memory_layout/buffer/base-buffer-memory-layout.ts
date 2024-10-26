import { BufferAlignmentType } from '../../constant/buffer-alignment-type.enum';
import { GpuDevice } from '../../gpu/gpu-device';
import { GpuObjectSetup } from '../../gpu/object/gpu-object-setup';
import { BaseMemoryLayout } from '../base-memory-layout';

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