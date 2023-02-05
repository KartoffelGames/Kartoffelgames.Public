import { TypedArray } from '@kartoffelgames/core.data';
import { BaseBuffer } from './buffer/base-buffer';

export class VertexAttributes<T extends TypedArray> {
    private readonly mAttributes: Array<AttributeFormatDefinition>;
    private readonly mBuffer: BaseBuffer<T>;

    /**
     * Attribute buffer.
     */
    public get buffer(): BaseBuffer<T> {
        return this.mBuffer;
    }

    /**
     * Attribute count.
     */
    public get count(): number {
        return this.mAttributes.length;
    }

    /**
     * Constructor.
     * @param pBuffer - Buffer.
     */
    public constructor(pBuffer: BaseBuffer<T>) {
        this.mBuffer = pBuffer;
        this.mAttributes = new Array<AttributeFormatDefinition>();
    }

    /**
     * Add vertex attribute.
     * @param pFormat - Attribute format.
     */
    public addAttributeLocation(pFormat: AttributeFormat): void {
        this.mAttributes.push({
            format: pFormat,
            itemCount: gAttributeTypeToBufferType[pFormat].itemCount
        });
    }

    /**
     * Generate buffer layout.
     */
    public generateBufferLayout(): GPUVertexBufferLayout {
        // Count overall used bytes.
        let lTotalBytes: number = 0;

        // Generate attributes.
        const lAttributes: Array<GPUVertexAttribute> = new Array<GPUVertexAttribute>();
        for (let lIndex: number = 0; lIndex < this.mAttributes.length; lIndex++) {
            const lAttribute = this.mAttributes[lIndex];
            lAttributes.push({
                format: lAttribute.format,
                offset: lTotalBytes, // Current counter of bytes.
                shaderLocation: lIndex
            });

            lTotalBytes += lAttribute.itemCount;
        }

        return {
            arrayStride: this.mBuffer.type.BYTES_PER_ELEMENT * lTotalBytes,
            stepMode: 'vertex',
            attributes: lAttributes
        };
    }
}

const gAttributeTypeToBufferType = {
    'uint8x2': { type: Uint8Array, itemCount: 2 },
    'uint8x4': { type: Uint8Array, itemCount: 4 },
    'sint8x2': { type: Int8Array, itemCount: 2 },
    'sint8x4': { type: Int8Array, itemCount: 4 },
    'unorm8x2': { type: Float32Array, itemCount: 2 },
    'unorm8x4': { type: Float32Array, itemCount: 4 },
    'snorm8x2': { type: Float32Array, itemCount: 2 },
    'snorm8x4': { type: Float32Array, itemCount: 4 },
    'uint16x2': { type: Uint16Array, itemCount: 2 },
    'uint16x4': { type: Uint16Array, itemCount: 4 },
    'sint16x2': { type: Int16Array, itemCount: 2 },
    'sint16x4': { type: Int16Array, itemCount: 4 },
    'unorm16x2': { type: Float32Array, itemCount: 2 },
    'unorm16x4': { type: Float32Array, itemCount: 4 },
    'snorm16x2': { type: Float32Array, itemCount: 2 },
    'snorm16x4': { type: Float32Array, itemCount: 4 },
    'float16x2': { type: Float32Array, itemCount: 2 },
    'float16x4': { type: Float32Array, itemCount: 4 },
    'float32': { type: Float32Array, itemCount: 1 },
    'float32x2': { type: Float32Array, itemCount: 2 },
    'float32x3': { type: Float32Array, itemCount: 3 },
    'float32x4': { type: Float32Array, itemCount: 4 },
    'uint32': { type: Uint32Array, itemCount: 1 },
    'uint32x2': { type: Uint32Array, itemCount: 2 },
    'uint32x3': { type: Uint32Array, itemCount: 3 },
    'uint32x4': { type: Uint32Array, itemCount: 4 },
    'sint32': { type: Int32Array, itemCount: 1 },
    'sint32x2': { type: Int32Array, itemCount: 2 },
    'sint32x3': { type: Int32Array, itemCount: 3 },
    'sint32x4': { type: Int32Array, itemCount: 4 },
} as const;

type AttributeFormat = keyof typeof gAttributeTypeToBufferType;
type AttributeFormatDefinition = { format: AttributeFormat, itemCount: number; };