import { Exception, TypedArray } from '@kartoffelgames/core.data';
import { Gpu } from '../../gpu';
import { GpuNativeObject } from '../../gpu-native-object';

export abstract class BaseBuffer<T extends TypedArray> extends GpuNativeObject<GPUBuffer> {
    private readonly mBufferLength: number;
    private readonly mBufferUsage: GPUFlagsConstant;
    private readonly mDataType: BufferDataType<T>;
    private mInitData: T | null;

    /**
     * Buffer size in items.
     */
    public get length(): number {
        return this.mBufferLength;
    }

    /**
     * Buffer size in bytes aligned to 4 bytes.
     */
    public get size(): number {
        return ((this.mBufferLength * this.type.BYTES_PER_ELEMENT) + 3) & ~3;
    }

    /**
     * Underlying data type.
     */
    public get type(): BufferDataType<T> {
        return this.mDataType;
    }

    /**
     * Constructor.
     * @param pGpu - GPU.
     * @param pUsage - Buffer usage beside COPY_DST.
     * @param pData  - Inital data. Can be empty.
     */
    public constructor(pGpu: Gpu, pUsage: GPUFlagsConstant, pData: T) {
        super(pGpu, 'BUFFER');

        this.mBufferUsage = pUsage;
        this.mInitData = pData;
        this.mBufferLength = pData.length;
        this.mDataType = <BufferDataType<T>>pData.constructor;
    }

    /**
     * Destroy native object.
     * @param pNativeObject - Native object.
     */
    protected async destroyNative(pNativeObject: GPUBuffer): Promise<void>{
        pNativeObject.destroy();
    }

    /**
     * Generate native object.
     */
    protected async generate(): Promise<GPUBuffer> {
        // Generate new empty init data.
        if (!this.mInitData) {
            this.mInitData = new this.mDataType(this.mBufferLength);
        }

        // Create gpu buffer mapped
        const lBuffer: GPUBuffer = this.gpu.device.createBuffer({
            label: this.label,
            size: this.size,
            usage: this.mBufferUsage,
            mappedAtCreation: this.mInitData.length > 0 // Map data when buffer would receive initial data.
        });

        // Copy only when data is available.
        if (this.mInitData.length > 0) {
            if (this.mInitData.length > this.size) {
                throw new Exception('Buffer data exeedes buffer size.', this);
            }

            const lData = new this.mDataType(lBuffer.getMappedRange());
            lData.set(this.mInitData, 0);

            // unmap buffer.
            lBuffer.unmap();
        }

        // Clear init data.
        this.mInitData = null;

        return lBuffer;
    }

    /**
     * Request buffer write.
     * @param pBufferCallback - Callback called on buffer access.
     */
    public abstract write(pBufferCallback: (pBuffer: T) => Promise<void>): Promise<void>;
}

export type BufferDataType<T extends TypedArray> = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    BYTES_PER_ELEMENT: number;
    new(pInitValues: ArrayBuffer | number | TypedArray): T;
};