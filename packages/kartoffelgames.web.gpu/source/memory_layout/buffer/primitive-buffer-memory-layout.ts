import { Exception } from '@kartoffelgames/core';
import { GpuDevice } from '../../gpu/gpu-device';
import { BaseBufferMemoryLayout, BufferLayoutLocation } from './base-buffer-memory-layout';
import { BufferItemFormat } from '../../constant/buffer-item-format.enum';
import { BufferItemMultiplier } from '../../constant/buffer-item-multiplier.enum';

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
                case BufferItemFormat.Float32: return 4;
                case BufferItemFormat.Uint32: return 4;
                case BufferItemFormat.Sint32: return 4;
            }
        })();

        // Calculate alignment and size.
        [this.mAlignment, this.mSize] = ((): [number, number] => {
            switch (pParameter.primitiveMultiplier) {
                case BufferItemMultiplier.Single: return [this.mSize, this.mSize];
                case BufferItemMultiplier.Vector2: return [this.mSize * 2, this.mSize * 2];
                case BufferItemMultiplier.Vector3: return [this.mSize * 4, this.mSize * 3];
                case BufferItemMultiplier.Vector4: return [this.mSize * 4, this.mSize * 4];
                case BufferItemMultiplier.Matrix22: return [this.mSize * 2, this.mSize * 2 * 2];
                case BufferItemMultiplier.Matrix23: return [this.mSize * 4, this.mSize * 2 * 3];
                case BufferItemMultiplier.Matrix24: return [this.mSize * 4, this.mSize * 2 * 4];
                case BufferItemMultiplier.Matrix32: return [this.mSize * 2, this.mSize * 3 * 2];
                case BufferItemMultiplier.Matrix33: return [this.mSize * 4, this.mSize * 3 * 3];
                case BufferItemMultiplier.Matrix34: return [this.mSize * 4, this.mSize * 3 * 4];
                case BufferItemMultiplier.Matrix42: return [this.mSize * 2, this.mSize * 4 * 2];
                case BufferItemMultiplier.Matrix43: return [this.mSize * 4, this.mSize * 4 * 3];
                case BufferItemMultiplier.Matrix44: return [this.mSize * 4, this.mSize * 4 * 4];
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
    primitiveFormat: BufferItemFormat;
    primitiveMultiplier: BufferItemMultiplier;
}