import { TypedArray } from '@kartoffelgames/core.data';
import { WebGpuBuffer } from '../../../abstraction_layer/webgpu/buffer/web-gpu-buffer';
import { MemoryType } from '../../constant/memory-type.enum';
import { Base } from '../../base/export.';
import { GpuDevice } from '../gpu-device';
import { BufferLayout } from '../memory_layout/buffer-memory-layout';
import { BindType } from '../../constant/bind-type.enum';

export class Buffer<T extends TypedArray> extends Base.Buffer<GpuDevice, WebGpuBuffer<T>, T>  {
    /**
     * Buffer size.
     */
    public get size(): number {
        return this.native.size;
    }

    /**
     * Constructor.
     * @param pDevice - GPU.
     * @param pLayout - Buffer layout.
     * @param pUsage - Buffer usage beside COPY_DST.
     * @param pInitialData  - Inital data. Can be empty.
     */
    public constructor(pDevice: GpuDevice, pLayout: BufferLayout, pUsage: MemoryType, pInitialData: T) {
        super(pDevice, pLayout, pUsage, pInitialData);
    }

    /**
     * Read data raw without layout.
     * @param pOffset - Data offset.
     * @param pSize - Data size.
     */
    public async readRaw(pOffset?: number, pSize?: number): Promise<T> {
        return this.native.read(pOffset, pSize);
    }

    /**
     * Write data raw without layout.
     * @param pData - Data.
     * @param pOffset - Data offset.
     * @param pSize - Data size.
     */
    public async writeRaw(pData: T, pOffset?: number, pSize?: number): Promise<void> {
        // Data write is synchron.
        this.native.write((pBuffer: T) => {
            pBuffer.set(pData);
        }, pOffset, pSize);
    }

    /**
     * Destroy buffer object.
     */
    protected destroyNative(pNativeObject: WebGpuBuffer<T>): void {
        pNativeObject.destroy();
    }

    /**
     * Generate native. Concat buffer usage bits from bind type and buffer usage.
     */
    protected override generate(): WebGpuBuffer<T> {
        let lUsage: number = 0;

        // Append usage type from abstract bind type.
        switch (this.memoryLayout.bindType) {
            case BindType.Attribute: {
                // Just an layout indicator. Does nothing to usage type.
                break;
            }
            case BindType.Index: {
                lUsage |= GPUBufferUsage.INDEX;
                break;
            }
            case BindType.Storage: {
                lUsage |= GPUBufferUsage.STORAGE;
                break;
            }
            case BindType.Uniform: {
                lUsage |= GPUBufferUsage.UNIFORM;
                break;
            }
            case BindType.Vertex: {
                lUsage |= GPUBufferUsage.VERTEX;
                break;
            }
        }

        // Append usage type from abstract usage type.
        if ((this.usage & MemoryType.CopyDestination) !== 0) {
            lUsage |= GPUBufferUsage.COPY_DST;
        }
        if ((this.usage & MemoryType.CopySource) !== 0) {
            lUsage |= GPUBufferUsage.COPY_SRC;
        }
        if ((this.usage & MemoryType.MapRead) !== 0) {
            lUsage |= GPUBufferUsage.MAP_READ;
        }
        if ((this.usage & MemoryType.MapWrite) !== 0) {
            lUsage |= GPUBufferUsage.MAP_WRITE;
        }

        return new WebGpuBuffer<T>(this.device.native, lUsage, this.initialData);
    }
}
