import { TypedArray } from '@kartoffelgames/core.data';
import { StructBufferMemoryLayout, StructBufferMemoryLayoutParameter } from '../../../../base/memory_layout/buffer/struct-buffer-memory-layout';
import { WebGpuBuffer } from '../../buffer/web-gpu-buffer';
import { WebGpuDevice, WebGpuTypes } from '../../web-gpu-device';

export class WebGpuStructBufferMemoryLayout extends StructBufferMemoryLayout<WebGpuTypes> {
    private mAlignment: number;
    private mSize: number;

    /**
     * Alignment of type.
     */
    public get alignment(): number {
        return this.mAlignment;
    }

    /**
     * Type size in byte.
     */
    public get size(): number {
        return this.mSize;
    }

    /**
     * Constructor.
     * @param pDevice - Device reference.
     * @param pParameter - Creation parameter.
     */
    public constructor(pDevice: WebGpuDevice, pParameter: StructBufferMemoryLayoutParameter) {
        super(pDevice, pParameter);

        this.mAlignment = 0;
        this.mSize = 0;
    }

    /**
     * Create buffer from layout.
     * @param pInitialData - Initial buffer data. Defines buffer length.
     */
    protected override createBuffer<TType extends TypedArray>(pInitialData: TType): WebGpuBuffer<TType> {
        return new WebGpuBuffer<TType>(this.device, this, pInitialData);
    }

    /**
     * Recalculate size and alignment.
     */
    protected override onProperyAdd(): void {
        // Recalculate size.
        let lRawDataSize: number = 0;
        for (const lType of this.properties) {
            // Increase offset to needed alignment.
            lRawDataSize = Math.ceil(lRawDataSize / lType.alignment) * lType.alignment;

            // Increase offset for type.
            lRawDataSize += lType.size;

            if (lType.alignment > this.mAlignment) {
                this.mAlignment = lType.alignment;
            }
        }

        // Apply struct alignment to raw data size.
        this.mSize = Math.ceil(lRawDataSize / this.mAlignment) * this.mAlignment;
    }
}