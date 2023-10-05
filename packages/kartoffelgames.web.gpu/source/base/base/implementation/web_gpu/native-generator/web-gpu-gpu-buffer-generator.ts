import { TypedArray } from '@kartoffelgames/core.data';
import { BaseNativeBufferGenerator } from '../../../generator/base-native-buffer-generator';
import { NativeObjectLifeTime } from '../../../generator/base-native-generator';
import { NativeWebGpuMap, WebGpuGeneratorFactory } from '../web-gpu-generator-factory';
import { GpuBuffer } from '../../../buffer/gpu-buffer';
import { BufferBindType } from '../../../../constant/buffer-bind-type.enum';
import { MemoryCopyType } from '../../../../constant/memory-copy-type.enum';

export class WebGpuGpuBufferGenerator extends BaseNativeBufferGenerator<NativeWebGpuMap, 'gpuBuffer'> {
    private readonly mReadyBufferList: Array<GPUBuffer>;
    private readonly mWavingBufferList: Array<GPUBuffer>;

    /**
     * Set life time of generated native.
     */
    protected override get nativeLifeTime(): NativeObjectLifeTime {
        return NativeObjectLifeTime.Persistent;
    }

    public constructor(pFactory: WebGpuGeneratorFactory, pBaseObject: GpuBuffer<TypedArray>) {
        super(pFactory, pBaseObject);

        // Waving buffer list.
        this.mReadyBufferList = new Array<GPUBuffer>();
        this.mWavingBufferList = new Array<GPUBuffer>();
    }

    /**
     * Read raw buffer data.
     * @param pOffset - Data read offset.
     * @param pSize - Data read size.
     */
    public override async readRaw(pOffset: number, pSize: number): Promise<TypedArray> {
        // Get buffer and map data.
        const lBuffer: GPUBuffer = this.create();
        await lBuffer.mapAsync(GPUMapMode.READ, pOffset, pSize);

        // Get mapped data and force it into typed array.
        const lData = new this.gpuObject.dataType(lBuffer.getMappedRange());
        return lData;
    }

    /**
     * Write data raw.
     * @param pData - Data.
     * @param pOffset - Data offset.
     * @param pSize - Data size.
     */
    public override async writeRaw(pData: ArrayLike<number>, pOffset: number, pSize: number): Promise<void> {
        // Create new buffer when no mapped buffer is available. 
        let lStagingBuffer: GPUBuffer;
        if (this.mReadyBufferList.length === 0) {
            lStagingBuffer = this.factory.gpu.createBuffer({
                label: `RingBuffer-WaveBuffer-${this.mWavingBufferList.length}`,
                size: this.gpuObject.size,
                usage: GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC,
                mappedAtCreation: true,
            });

            // Add new buffer to complete list.
            this.mWavingBufferList.push(lStagingBuffer);
        } else {
            lStagingBuffer = this.mReadyBufferList.pop()!;
        }

        // Execute write operations.
        const lBufferArray: TypedArray = new this.gpuObject.dataType(lStagingBuffer.getMappedRange(pOffset, pSize));
        lBufferArray.set(pData);

        // Unmap for copying data.
        lStagingBuffer.unmap();

        // Copy buffer data from staging into wavig buffer.
        const lCommandDecoder: GPUCommandEncoder = this.factory.gpu.createCommandEncoder();
        lCommandDecoder.copyBufferToBuffer(lStagingBuffer, 0, this.create(), 0, this.gpuObject.size);
        this.factory.gpu.queue.submit([lCommandDecoder.finish()]);

        // Shedule staging buffer remaping.
        lStagingBuffer.mapAsync(GPUMapMode.WRITE).then(() => {
            this.mReadyBufferList.push(lStagingBuffer);
        });
    }

    /**
     * Destroy wave and ready buffer.
     */
    protected override destroy(pNativeObject: GPUBuffer): void {
        pNativeObject.destroy();

        // Destroy all wave buffer and clear list.
        for (let lCount: number = 0; this.mWavingBufferList.length < lCount; lCount++) {
            this.mWavingBufferList.pop()?.destroy();
        }

        // Clear ready buffer list.
        for (let lCount: number = 0; this.mReadyBufferList.length < lCount; lCount++) {
            // No need to destroy. All buffers have already destroyed.
            this.mReadyBufferList.pop();
        }
    }

    /**
     * Generate buffer. Write local gpu object data as initial native buffer data.
     */
    protected override generate(): GPUBuffer {
        let lUsage: number = 0;

        // Append usage type from abstract bind type.
        switch (this.gpuObject.memoryLayout.bindType) {
            case BufferBindType.Undefined: {
                // Just an layout indicator. Does nothing to usage type.
                break;
            }
            case BufferBindType.Index: {
                lUsage |= GPUBufferUsage.INDEX;
                break;
            }
            case BufferBindType.Storage: {
                lUsage |= GPUBufferUsage.STORAGE;
                break;
            }
            case BufferBindType.Uniform: {
                lUsage |= GPUBufferUsage.UNIFORM;
                break;
            }
            case BufferBindType.Vertex: {
                lUsage |= GPUBufferUsage.VERTEX;
                break;
            }
        }

        // Append usage type from abstract usage type.
        if ((this.gpuObject.memoryLayout.memoryType & MemoryCopyType.CopyDestination) !== 0) {
            lUsage |= GPUBufferUsage.COPY_DST;
        }
        if ((this.gpuObject.memoryLayout.memoryType & MemoryCopyType.CopySource) !== 0) {
            lUsage |= GPUBufferUsage.COPY_SRC;
        }

        // Create gpu buffer mapped
        const lBuffer: GPUBuffer = this.factory.gpu.createBuffer({
            label: 'Ring-Buffer-Static-Buffer',
            size: this.gpuObject.size,
            usage: lUsage,
            mappedAtCreation: true // Map data when buffer would receive initial data.
        });

        const lData = new this.gpuObject.dataType(lBuffer.getMappedRange());
        lData.set(this.gpuObject.localData, 0);

        // unmap buffer.
        lBuffer.unmap();

        return lBuffer;
    }

}