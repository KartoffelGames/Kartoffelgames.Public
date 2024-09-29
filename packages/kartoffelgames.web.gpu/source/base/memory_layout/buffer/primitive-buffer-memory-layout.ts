import { Exception } from '@kartoffelgames/core';
import { GpuDevice } from '../../gpu/gpu-device';
import { BaseBufferMemoryLayout, BufferLayoutLocation } from './base-buffer-memory-layout';
import { PrimitiveBufferFormat } from './enum/primitive-buffer-format.enum';
import { PrimitiveBufferMultiplier } from './enum/primitive-buffer-multiplier.enum';

export class PrimitiveBufferMemoryLayout extends BaseBufferMemoryLayout {
    private readonly mAlignment: number;
    private readonly mSize: number;

    /**
     * Type byte alignment.
     */
    public override get alignment(): number {
        return this.mAlignment;
    }

    /**
     * Fixed buffer size in bytes.
     */
    public get fixedSize(): number {
        return this.mSize;
    }

    /**
     * Buffer size in bytes.
     */
    public get variableSize(): number {
        return 0;
    }

    /**
     * Constructor.
     * 
     * @param pDevice - Device reference.
     * @param pParameter - Parameter.
     */
    public constructor(pDevice: GpuDevice, pParameter: LinearBufferMemoryLayoutParameter) {
        super(pDevice);

        // Set default size by format.
        this.mSize = ((): number => {
            switch (pParameter.primitiveFormat) {
                case PrimitiveBufferFormat.Float16: return 2;
                case PrimitiveBufferFormat.Float32: return 4;
                case PrimitiveBufferFormat.Uint32: return 4;
                case PrimitiveBufferFormat.Sint32: return 4;
            }
        })();

        // Calculate alignment and size.
        [this.mAlignment, this.mSize] = ((): [number, number] => {
            switch (pParameter.primitiveMultiplier) {
                case PrimitiveBufferMultiplier.Single: return [this.mSize, this.mSize];
                case PrimitiveBufferMultiplier.Vector2: return [this.mSize * 2, this.mSize * 2];
                case PrimitiveBufferMultiplier.Vector3: return [this.mSize * 4, this.mSize * 3];
                case PrimitiveBufferMultiplier.Vector4: return [this.mSize * 4, this.mSize * 4];
                case PrimitiveBufferMultiplier.Matrix22: return [this.mSize * 2, this.mSize * 2 * 2];
                case PrimitiveBufferMultiplier.Matrix23: return [this.mSize * 4, this.mSize * 2 * 3];
                case PrimitiveBufferMultiplier.Matrix24: return [this.mSize * 4, this.mSize * 2 * 4];
                case PrimitiveBufferMultiplier.Matrix32: return [this.mSize * 2, this.mSize * 3 * 2];
                case PrimitiveBufferMultiplier.Matrix33: return [this.mSize * 4, this.mSize * 3 * 3];
                case PrimitiveBufferMultiplier.Matrix34: return [this.mSize * 4, this.mSize * 3 * 4];
                case PrimitiveBufferMultiplier.Matrix42: return [this.mSize * 2, this.mSize * 4 * 2];
                case PrimitiveBufferMultiplier.Matrix43: return [this.mSize * 4, this.mSize * 4 * 3];
                case PrimitiveBufferMultiplier.Matrix44: return [this.mSize * 4, this.mSize * 4 * 4];
            }
        })();

        // Override size of primitive.
        if (pParameter.overrideSize) {
            if (this.mSize > pParameter.overrideSize) {
                throw new Exception('Overriden buffer byte size can not be lower than the actual byte size.', this);
            }

            this.mAlignment = pParameter.overrideSize;
        }

        // Override alignment of primitive.
        if (pParameter.overrideAlignment) {
            if (pParameter.overrideAlignment % this.mAlignment !== 0) {
                throw new Exception('Overriden alignment must be dividable by its actual alignment value.', this);
            }

            this.mAlignment = pParameter.overrideAlignment;
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

export interface LinearBufferMemoryLayoutParameter {
    overrideAlignment?: number;
    overrideSize?: number;
    primitiveFormat: PrimitiveBufferFormat;
    primitiveMultiplier: PrimitiveBufferMultiplier;
}