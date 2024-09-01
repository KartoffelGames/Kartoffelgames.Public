import { Exception } from '@kartoffelgames/core';
import { BaseBufferMemoryLayout, BufferMemoryLayoutParameter } from './base-buffer-memory-layout';
import { PrimitiveBufferFormat } from './enum/primitive-buffer-format';
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
     * Buffer size in bytes.
     */
    public get size(): number {
        return this.mSize;
    }

    /**
     * Constructor.
     * 
     * @param pParameter - Parameter.
     */
    public constructor(pParameter: LinearBufferMemoryLayoutParameter) {
        super(pParameter);

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
        [this.mSize, this.mAlignment] = ((): [number, number] => {
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
}

export interface LinearBufferMemoryLayoutParameter extends BufferMemoryLayoutParameter {
    overrideAlignment?: number;
    overrideSize?: number;
    primitiveFormat: PrimitiveBufferFormat;
    primitiveMultiplier: PrimitiveBufferMultiplier;
}