import { Exception, TypedArray } from '@kartoffelgames/core.data';
import { BufferLayout } from '../../../../base/webgpu/memory_layout/buffer-memory-layout';
import { SimpleBufferLayout } from '../../../../base/webgpu/memory_layout/simple-buffer-layout';
import { WebGpuDevice } from '../../web-gpu-device';
import { GpuNativeObject } from '../../gpu-native-object';
import { BufferDataType } from '../../buffer/web-gpu-buffer';
import { WgslType } from '../../../../base/webgpu/shader/wgsl_enum/wgsl-type.enum';

export class VertexAttribute extends GpuNativeObject<GPUVertexBufferLayout> {
    private readonly mAttribute: AttributeFormatDefinition;
    private readonly mName: string;

    /**
     * Get underlying type of buffer.
     */
    public get bufferDataType(): BufferDataType<TypedArray> {
        return this.mAttribute.dataType;
    }

    /**
     * Get attribute location.
     */
    public get location(): number {
        return this.mAttribute.type.location!;
    }

    /**
     * Attribute name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Constructor.
     * @param pBuffer - Buffer.
     */
    public constructor(pGpu: WebGpuDevice, pType: SimpleBufferLayout) {
        super(pGpu, 'VERTEX_ATTRIBUTE');

        // Format by type.
        const lGeneric: WgslType | undefined = pType.generics.at(0);
        const lFormatStride: { format: GPUVertexFormat, type: BufferDataType<TypedArray>; } | undefined = gTypeToBufferType[pType.type]?.[lGeneric!];

        // Throw on invalid parameter.
        if (!lFormatStride) {
            throw new Exception(`Invalid attribute type for "${pType}<${lGeneric}>"`, this);
        }

        // Build name.
        const lAttributeNameParts: Array<string> = new Array<string>();
        let lCurrentPathType: BufferLayout | null = pType;
        do {
            lAttributeNameParts.push(lCurrentPathType.name);
            lCurrentPathType = lCurrentPathType.parent;
        } while (lCurrentPathType !== null);

        this.mName = lAttributeNameParts.reverse().join('.');
        this.mAttribute = {
            type: pType,
            dataType: lFormatStride.type,
            format: lFormatStride.format
        };
    }

    /**
     * Generate native object.
     */
    protected generate(): GPUVertexBufferLayout {
        // Generate attributes.
        const lAttributes: Array<GPUVertexAttribute> = new Array<GPUVertexAttribute>();
        lAttributes.push({
            format: this.mAttribute.format,
            offset: 0, // Current counter of bytes.
            shaderLocation: this.mAttribute.type.location!
        });

        return {
            arrayStride: this.mAttribute.type.size,
            stepMode: 'vertex',
            attributes: lAttributes
        };
    }
}

const gTypeToBufferType: { [type: string]: { [generic: string]: { format: GPUVertexFormat, type: BufferDataType<TypedArray>; }; }; } = {
    // Single types.
    [WgslType.Float32]: {
        [WgslType.Any]: { format: 'float32', type: Float32Array }
    },
    [WgslType.Integer32]: {
        [WgslType.Any]: { format: 'sint32', type: Int32Array }
    },
    [WgslType.UnsignedInteger32]: {
        [WgslType.Any]: { format: 'uint32', type: Uint32Array }
    },

    // Vector types.
    [WgslType.Vector2]: {
        [WgslType.Float16]: { format: 'float16x2', type: Float32Array },
        [WgslType.Float32]: { format: 'float32x2', type: Float32Array },
        [WgslType.Integer32]: { format: 'sint32x2', type: Int32Array },
        [WgslType.UnsignedInteger32]: { format: 'uint32x2', type: Uint32Array }
    },
    [WgslType.Vector3]: {
        // [WgslType.Float16]: { format: 'float16x3', stride: 3 },
        [WgslType.Float32]: { format: 'float32x3', type: Float32Array },
        [WgslType.Integer32]: { format: 'sint32x3', type: Int32Array },
        [WgslType.UnsignedInteger32]: { format: 'uint32x3', type: Uint32Array }
    },
    [WgslType.Vector4]: {
        [WgslType.Float16]: { format: 'float16x4', type: Float32Array },
        [WgslType.Float32]: { format: 'float32x4', type: Float32Array },
        [WgslType.Integer32]: { format: 'sint32x4', type: Int32Array },
        [WgslType.UnsignedInteger32]: { format: 'uint32x3', type: Uint32Array }
    }
};

type AttributeFormatDefinition = {
    type: BufferLayout;
    format: GPUVertexFormat;
    dataType: BufferDataType<TypedArray>;
};