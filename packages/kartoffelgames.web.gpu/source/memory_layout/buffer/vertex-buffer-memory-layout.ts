import { Exception } from '@kartoffelgames/core';
import { BufferItemMultiplier } from '../../constant/buffer-item-multiplier.enum';
import { VertexBufferItemFormat } from '../../constant/vertex-buffer-item-format.enum';
import { GpuDevice } from '../../gpu/gpu-device';
import { BaseBufferMemoryLayout, BufferLayoutLocation } from './base-buffer-memory-layout';

export class VertexBufferMemoryLayout extends BaseBufferMemoryLayout {
    private readonly mFormat: VertexBufferItemFormat;
    private readonly mFormatByteCount: number;
    private readonly mSize: number;

    /**
     * Type byte alignment.
     */
    public override get alignment(): number {
        return this.mSize;
    }

    /**
     * Fixed buffer size in bytes.
     */
    public get fixedSize(): number {
        return 0;
    }

    /**
     * Underlying format of all parameters.
     */
    public get format(): VertexBufferItemFormat {
        return this.mFormat;
    }

    /**
     * Byte count of underlying format.
     */
    public get formatByteCount(): number {
        return this.mFormatByteCount;
    }

    /**
     * Buffer size in bytes.
     */
    public get variableSize(): number {
        return this.mSize;
    }

    /**
     * Constructor.
     * 
     * @param pDevice - Device reference.
     * @param pParameter - Parameter.
     */
    public constructor(pDevice: GpuDevice, pParameter: VertexBufferMemoryLayoutParameter) {
        super(pDevice);

        // Set default size by format.
        const lPrimitiveByteCount: number = ((): number => {
            switch (pParameter.format) {
                case VertexBufferItemFormat.Float16: return 2;
                case VertexBufferItemFormat.Float32: return 4;
                case VertexBufferItemFormat.Uint32: return 4;
                case VertexBufferItemFormat.Sint32: return 4;
                case VertexBufferItemFormat.Uint8: return 1;
                case VertexBufferItemFormat.Sint8: return 1;
                case VertexBufferItemFormat.Uint16: return 2;
                case VertexBufferItemFormat.Sint16: return 2;
                case VertexBufferItemFormat.Unorm16: return 2;
                case VertexBufferItemFormat.Snorm16: return 2;
                case VertexBufferItemFormat.Unorm8: return 1;
                case VertexBufferItemFormat.Snorm8: return 1;
            }
        })();

        // Set default size and init format values.
        this.mSize = 0;
        this.mFormat = pParameter.format;
        this.mFormatByteCount = lPrimitiveByteCount;

        // Calculate size of all parameter.
        for (const lParameter of pParameter.parameter) {
            // Calculate alignment and size.
            const lParameterSize: number = ((): number => {
                switch (lParameter.primitiveMultiplier) {
                    case BufferItemMultiplier.Single: return lPrimitiveByteCount;
                    case BufferItemMultiplier.Vector2: return lPrimitiveByteCount * 2;
                    case BufferItemMultiplier.Vector3: return lPrimitiveByteCount * 3;
                    case BufferItemMultiplier.Vector4: return lPrimitiveByteCount * 4;
                    default: {
                        throw new Exception(`Item multipier "${lParameter.primitiveMultiplier}" not supported for vertex buffer.`, this);
                    }
                }
            })();
            
            // Extend buffer size.
            this.mSize = lParameterSize + lParameter.offset;
        }
    }

    /**
     * Get location of path.
     * @param pPathName - Path name. Divided by dots.
     */
    public locationOf(pPathName: Array<string>): BufferLayoutLocation {
        // Only validate name.
        if (pPathName.length !== 0) {
            throw new Exception(`Simple buffer layout has no properties.`, this);
        }

        return { size: this.fixedSize, offset: 0 };
    }
}

export type VertexBufferMemoryLayoutParameterParameter = {
    primitiveMultiplier: BufferItemMultiplier;
    offset: number;
};

export type VertexBufferMemoryLayoutParameter = {
    format: VertexBufferItemFormat;
    parameter: Array<VertexBufferMemoryLayoutParameterParameter>;
};