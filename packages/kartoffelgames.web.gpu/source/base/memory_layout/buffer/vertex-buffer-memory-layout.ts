import { Exception } from '@kartoffelgames/core';
import { GpuDevice } from '../../gpu/gpu-device';
import { BaseBufferMemoryLayout, BufferLayoutLocation } from './base-buffer-memory-layout';
import { PrimitiveBufferFormat } from './enum/primitive-buffer-format.enum';
import { PrimitiveBufferMultiplier } from './enum/primitive-buffer-multiplier.enum';

export class VertexBufferMemoryLayout extends BaseBufferMemoryLayout {
    private readonly mFormat: PrimitiveBufferFormat;
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
    public get format(): PrimitiveBufferFormat {
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
                case PrimitiveBufferFormat.Float16: return 2;
                case PrimitiveBufferFormat.Float32: return 4;
                case PrimitiveBufferFormat.Uint32: return 4;
                case PrimitiveBufferFormat.Sint32: return 4;
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
                    case PrimitiveBufferMultiplier.Single: return lPrimitiveByteCount;
                    case PrimitiveBufferMultiplier.Vector2: return lPrimitiveByteCount * 2;
                    case PrimitiveBufferMultiplier.Vector3: return lPrimitiveByteCount * 3;
                    case PrimitiveBufferMultiplier.Vector4: return lPrimitiveByteCount * 4;
                    case PrimitiveBufferMultiplier.Matrix22: return lPrimitiveByteCount * 2 * 2;
                    case PrimitiveBufferMultiplier.Matrix23: return lPrimitiveByteCount * 2 * 3;
                    case PrimitiveBufferMultiplier.Matrix24: return lPrimitiveByteCount * 2 * 4;
                    case PrimitiveBufferMultiplier.Matrix32: return lPrimitiveByteCount * 3 * 2;
                    case PrimitiveBufferMultiplier.Matrix33: return lPrimitiveByteCount * 3 * 3;
                    case PrimitiveBufferMultiplier.Matrix34: return lPrimitiveByteCount * 3 * 4;
                    case PrimitiveBufferMultiplier.Matrix42: return lPrimitiveByteCount * 4 * 2;
                    case PrimitiveBufferMultiplier.Matrix43: return lPrimitiveByteCount * 4 * 3;
                    case PrimitiveBufferMultiplier.Matrix44: return lPrimitiveByteCount * 4 * 4;
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
    primitiveMultiplier: PrimitiveBufferMultiplier;
    offset: number;
};

export type VertexBufferMemoryLayoutParameter = {
    format: PrimitiveBufferFormat;
    parameter: Array<VertexBufferMemoryLayoutParameterParameter>;
};