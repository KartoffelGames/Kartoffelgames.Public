import { Exception, TypedArray } from '@kartoffelgames/core.data';
import { BaseBuffer, BufferDataType } from '../../buffer/base-buffer';

export class VertexAttributes<T extends TypedArray> {
    private readonly mAttributes: Array<AttributeFormatDefinition>;
    private mBuffer: BaseBuffer<T> | null;
    private readonly mBufferDataType: BufferDataType<T>;

    /**
     * Attribute buffer.
     */
    public get buffer(): BaseBuffer<T> | null {
        return this.mBuffer;
    }

    /**
     * Get underlying type of buffer.
     */
    public get bufferDataType(): BufferDataType<T> {
        return this.mBufferDataType;
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
    public constructor(pType: BufferDataType<T>) {
        this.mBufferDataType = pType;
        this.mBuffer = null;
        this.mAttributes = new Array<AttributeFormatDefinition>();
    }

    /**
     * Add vertex attribute.
     * @param pFormat - Attribute format.
     */
    public addAttributeLocation(pFormat: AttributeFormat): void {
        this.mAttributes.push({
            format: pFormat,
            itemStride: gAttributeTypeToBufferType[pFormat].itemStride
        });
    }

    /**
     * Generate buffer layout.
     */
    public generateBufferLayout(pLocationOffset: number = 0): GPUVertexBufferLayout {
        // Count overall used bytes.
        let lTotalBytes: number = 0;

        // Generate attributes.
        const lAttributes: Array<GPUVertexAttribute> = new Array<GPUVertexAttribute>();
        for (let lIndex: number = 0; lIndex < this.mAttributes.length; lIndex++) {
            const lAttribute = this.mAttributes[lIndex];
            lAttributes.push({
                format: lAttribute.format,
                offset: lTotalBytes, // Current counter of bytes.
                shaderLocation: lIndex + pLocationOffset
            });

            lTotalBytes += this.mBufferDataType.BYTES_PER_ELEMENT * lAttribute.itemStride;
        }

        return {
            arrayStride: lTotalBytes,
            stepMode: 'vertex',
            attributes: lAttributes
        };
    }

    /**
     * Update or replace buffer of attribute.
     * @param pBuffer - New buffer.
     */
    public setBuffer(pBuffer: BaseBuffer<T>): void {
        // Validate new buffer.
        if (pBuffer.type !== this.mBufferDataType) {
            throw new Exception('Buffer type does not match.', this);
        }

        this.mBuffer = pBuffer;
    }
}

const gAttributeTypeToBufferType = {
    'uint8x2': { type: Uint8Array, itemStride: 2 },
    'uint8x4': { type: Uint8Array, itemStride: 4 },
    'sint8x2': { type: Int8Array, itemStride: 2 },
    'sint8x4': { type: Int8Array, itemStride: 4 },
    'unorm8x2': { type: Float32Array, itemStride: 2 },
    'unorm8x4': { type: Float32Array, itemStride: 4 },
    'snorm8x2': { type: Float32Array, itemStride: 2 },
    'snorm8x4': { type: Float32Array, itemStride: 4 },
    'uint16x2': { type: Uint16Array, itemStride: 2 },
    'uint16x4': { type: Uint16Array, itemStride: 4 },
    'sint16x2': { type: Int16Array, itemStride: 2 },
    'sint16x4': { type: Int16Array, itemStride: 4 },
    'unorm16x2': { type: Float32Array, itemStride: 2 },
    'unorm16x4': { type: Float32Array, itemStride: 4 },
    'snorm16x2': { type: Float32Array, itemStride: 2 },
    'snorm16x4': { type: Float32Array, itemStride: 4 },
    'float16x2': { type: Float32Array, itemStride: 2 },
    'float16x4': { type: Float32Array, itemStride: 4 },
    'float32': { type: Float32Array, itemStride: 1 },
    'float32x2': { type: Float32Array, itemStride: 2 },
    'float32x3': { type: Float32Array, itemStride: 3 },
    'float32x4': { type: Float32Array, itemStride: 4 },
    'uint32': { type: Uint32Array, itemStride: 1 },
    'uint32x2': { type: Uint32Array, itemStride: 2 },
    'uint32x3': { type: Uint32Array, itemStride: 3 },
    'uint32x4': { type: Uint32Array, itemStride: 4 },
    'sint32': { type: Int32Array, itemStride: 1 },
    'sint32x2': { type: Int32Array, itemStride: 2 },
    'sint32x3': { type: Int32Array, itemStride: 3 },
    'sint32x4': { type: Int32Array, itemStride: 4 },
} as const;

type AttributeFormat = keyof typeof gAttributeTypeToBufferType;
type AttributeFormatDefinition = { format: AttributeFormat, itemStride: number; };