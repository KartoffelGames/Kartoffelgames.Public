import { Exception } from '@kartoffelgames/core.data';
import { ArrayBufferMemoryLayoutParameter, IArrayBufferMemoryLayout } from '../../../interface/memory_layout/buffer/i-array-buffer.memory-layout.interface';
import { BufferLayoutLocation, IBufferMemoryLayout } from '../../../interface/memory_layout/buffer/i-buffer-memory-layout.interface';
import { GpuDevice } from '../../gpu/gpu-device';
import { BufferMemoryLayout } from './buffer-memory-layout';

export abstract class ArrayBufferMemoryLayout<TGpu extends GpuDevice> extends BufferMemoryLayout<TGpu> implements IArrayBufferMemoryLayout {
    private readonly mArraySize: number;
    private readonly mInnerType: IBufferMemoryLayout;

    /**
     * Array item count.
     */
    public get arraySize(): number {
        return this.mArraySize;
    }

    /**
     * Array type.
     */
    public get innerType(): IBufferMemoryLayout {
        return this.mInnerType;
    }

    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    public constructor(pGpu: TGpu, pParameter: ArrayBufferMemoryLayoutParameter) {
        super(pGpu, pParameter);

        // Static properties.
        this.mArraySize = pParameter.arraySize;
        this.mInnerType = pParameter.innerType;
    }

    /**
     * Get location of path.
     * @param pPathName - Path name. Divided by dots.
     */
    public override locationOf(pPathName: Array<string>): BufferLayoutLocation {
        const lPathName: Array<string> = [...pPathName];

        // Complete array.
        const lItemIndexString: string | undefined = lPathName.shift();
        if (!lItemIndexString) {
            // Only valid for ststic arrays.
            if (this.mArraySize < 0) {
                throw new Exception('No size can be calculated for dynamic array buffer locations.', this);
            }

            return { size: this.size, offset: 0 };
        }

        // Validate item index.
        if (isNaN(<any>lItemIndexString)) {
            throw new Exception('Array index must be a number.', this);
        }

        // Calculate size of single item.s
        const lArrayItemSize: number = Math.ceil(this.innerType.size / this.innerType.alignment) * this.innerType.alignment;
        const lArrayItemOffset: number = parseInt(lItemIndexString) * lArrayItemSize;

        // Single item.
        if (lPathName.length === 0) {
            return { size: lArrayItemSize, offset: lArrayItemSize * lArrayItemOffset };
        }

        // Inner property.
        const lInnerLocation = this.innerType.locationOf(lPathName);
        return { size: lInnerLocation.size, offset: lArrayItemOffset + lInnerLocation.offset };
    }
}