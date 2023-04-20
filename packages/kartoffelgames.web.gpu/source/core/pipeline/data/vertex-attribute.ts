import { Exception, TypedArray } from '@kartoffelgames/core.data';
import { Gpu } from '../../gpu';
import { GpuNativeObject } from '../../gpu-native-object';
import { BufferDataType } from '../../resource/buffer/base-buffer';
import { WgslTypeNumber } from '../../shader/wgsl_type_handler/wgsl-type-collection';
import { WgslType } from '../../shader/wgsl_type_handler/wgsl-type.enum';

export class VertexAttribute extends GpuNativeObject<GPUVertexBufferLayout> {
    private mAttribute: AttributeFormatDefinition;
    private readonly mName: string;

    /**
     * Get underlying type of buffer.
     */
    public get bufferDataType(): BufferDataType<TypedArray> {
        return this.mAttribute.type;
    }

    /**
     * Get attribute location.
     */
    public get location(): number {
        return this.mAttribute.location;
    }

    /**
     * Attribute name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Get buffer item length that the assigned buffer should have.
     */
    public get strideLength(): number {
        return this.mAttribute.itemStride;
    }

    /**
     * Constructor.
     * @param pBuffer - Buffer.
     */
    public constructor(pGpu: Gpu, pName: string) {
        super(pGpu, 'VERTEX_ATTRIBUTE');

        this.mName = pName;
        this.mAttribute = {
            location: 0,
            type: Int32Array,
            itemStride: 1,
            format: 'uint32'
        };
    }

    /**
     * Add vertex attribute.
     * @param pFormat - Attribute format.
     */
    public setAttributeLocation(pType: WgslType, pGeneric: WgslTypeNumber | null, pLocation: number): void {
        // Format by type.
        const lFormatStride: { format: GPUVertexFormat, stride: number, type: BufferDataType<TypedArray>; } | undefined = gTypeToBufferType[pType]?.[pGeneric!];

        // Throw on invalid parameter.
        if (!lFormatStride) {
            throw new Exception(`Invalid attribute type for "${pType}<${pGeneric}>"`, this);
        }

        // Add attribute.
        this.mAttribute = {
            location: pLocation,
            format: lFormatStride.format,
            itemStride: lFormatStride.stride,
            type: lFormatStride.type
        };
    }

    /**
     * Generate native object.
     */
    protected async generate(): Promise<GPUVertexBufferLayout> {
        // Generate attributes.
        const lAttributes: Array<GPUVertexAttribute> = new Array<GPUVertexAttribute>();
        lAttributes.push({
            format: this.mAttribute.format,
            offset: 0, // Current counter of bytes.
            shaderLocation: this.mAttribute.location
        });

        // Overall used bytes.
        const lTotalBytes: number = this.mAttribute.type.BYTES_PER_ELEMENT * this.mAttribute.itemStride;

        return {
            arrayStride: lTotalBytes,
            stepMode: 'vertex',
            attributes: lAttributes
        };
    }

    /**
     * Invalidate native object on different stride lengths.
     */
    protected override async validateState(pGeneratedNative: GPUVertexBufferLayout): Promise<boolean> {
        const lLastArrayStrideLength: number | undefined = pGeneratedNative.arrayStride;
        const lCurrentArrayStideLength: number = this.mAttribute.type.BYTES_PER_ELEMENT * this.mAttribute.itemStride;

        return lLastArrayStrideLength === lCurrentArrayStideLength;
    }
}

const gTypeToBufferType: { [type: string]: { [generic: string]: { format: GPUVertexFormat, stride: number; type: BufferDataType<TypedArray>; }; }; } = {
    // Single types.
    [WgslType.Float32]: {
        [WgslType.Any]: { format: 'float32', stride: 1, type: Float32Array }
    },
    [WgslType.Integer32]: {
        [WgslType.Any]: { format: 'sint32', stride: 1, type: Int32Array }
    },
    [WgslType.UnsignedInteger32]: {
        [WgslType.Any]: { format: 'uint32', stride: 1, type: Uint32Array }
    },

    // Vector types.
    [WgslType.Vector2]: {
        [WgslType.Float16]: { format: 'float16x2', stride: 2, type: Float32Array },
        [WgslType.Float32]: { format: 'float32x2', stride: 2, type: Float32Array },
        [WgslType.Integer32]: { format: 'sint32x2', stride: 2, type: Int32Array },
        [WgslType.UnsignedInteger32]: { format: 'uint32x2', stride: 2, type: Uint32Array }
    },
    [WgslType.Vector3]: {
        // [WgslType.Float16]: { format: 'float16x3', stride: 3 },
        [WgslType.Float32]: { format: 'float32x3', stride: 3, type: Float32Array },
        [WgslType.Integer32]: { format: 'sint32x3', stride: 3, type: Int32Array },
        [WgslType.UnsignedInteger32]: { format: 'uint32x3', stride: 3, type: Uint32Array }
    },
    [WgslType.Vector4]: {
        [WgslType.Float16]: { format: 'float16x4', stride: 4, type: Float32Array },
        [WgslType.Float32]: { format: 'float32x4', stride: 4, type: Float32Array },
        [WgslType.Integer32]: { format: 'sint32x4', stride: 4, type: Int32Array },
        [WgslType.UnsignedInteger32]: { format: 'uint32x3', stride: 3, type: Uint32Array }
    }
};

type AttributeFormatDefinition = {
    location: number;
    format: GPUVertexFormat;
    itemStride: number;
    type: BufferDataType<TypedArray>;
};