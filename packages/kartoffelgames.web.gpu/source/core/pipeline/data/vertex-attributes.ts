import { TypedArray } from '@kartoffelgames/core.data';
import { Gpu } from '../../gpu';
import { GpuNativeObject } from '../../gpu-native-object';
import { BufferDataType } from '../../resource/buffer/base-buffer';

export class VertexAttributes<T extends TypedArray> extends GpuNativeObject<GPUVertexBufferLayout> {
    private readonly mAttributes: Array<AttributeFormatDefinition>;
    private readonly mBufferDataType: BufferDataType<T>;
    private mLocationOffset: number;
    private mStrideLength: number;

    /**
     * Get underlying type of buffer.
     */
    public get bufferDataType(): BufferDataType<T> {
        return this.mBufferDataType;
    }

    /**
     * Attribute location index offset..
     */
    public get locationOffset(): number {
        return this.mLocationOffset;
    } set locationOffset(pValue: number) {
        this.mLocationOffset = pValue;
    }

    /**
     * Get buffer item length that the assigned buffer should have.
     */
    public get strideLength(): number {
        return this.mStrideLength;
    }

    /**
     * Constructor.
     * @param pBuffer - Buffer.
     */
    public constructor(pGpu: Gpu, pType: BufferDataType<T>) {
        super(pGpu);

        this.mStrideLength = 0;
        this.mLocationOffset = 0;
        this.mBufferDataType = pType;
        this.mAttributes = new Array<AttributeFormatDefinition>();
    }

    /**
     * Add vertex attribute.
     * @param pFormat - Attribute format.
     */
    public addAttributeLocation(pFormat: AttributeFormat): void {
        const lItemStride: number = gAttributeTypeToBufferType[pFormat].itemStride;

        // Increase item size.
        this.mStrideLength += lItemStride;

        // Add attribute.
        this.mAttributes.push({
            format: pFormat,
            itemStride: lItemStride
        });
    }

    /**
     * Free storage of native object.
     * @param _pNativeObject - Native object. 
     */
    protected async destroyNative(_pNativeObject: GPUVertexBufferLayout): Promise<void> {
        // Nothing to destroy.
    }

    /**
     * Generate native object.
     */
    protected async generate(): Promise<GPUVertexBufferLayout> {
        // Count overall used bytes.
        let lTotalBytes: number = 0;

        // Generate attributes.
        const lAttributes: Array<GPUVertexAttribute> = new Array<GPUVertexAttribute>();
        for (let lIndex: number = 0; lIndex < this.mAttributes.length; lIndex++) {
            const lAttribute = this.mAttributes[lIndex];
            lAttributes.push({
                format: lAttribute.format,
                offset: lTotalBytes, // Current counter of bytes.
                shaderLocation: lIndex + this.mLocationOffset
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
     * Invalidate native object on different stride lengths.
     */
    protected override async validateState(): Promise<boolean> {
        const lLastArrayStrideLength: number | undefined = this.generatedNative?.arrayStride;
        const lCurrentArrayStideLength: number = this.mBufferDataType.BYTES_PER_ELEMENT * this.mStrideLength;

        return lLastArrayStrideLength === lCurrentArrayStideLength;
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