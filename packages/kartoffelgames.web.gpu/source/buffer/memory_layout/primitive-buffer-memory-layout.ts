import { Exception } from '@kartoffelgames/core';
import { BufferAlignmentType } from '../../constant/buffer-alignment-type.enum.ts';
import { BufferItemFormat } from '../../constant/buffer-item-format.enum.ts';
import { BufferItemMultiplier } from '../../constant/buffer-item-multiplier.enum.ts';
import type { GpuDevice } from '../../device/gpu-device.ts';
import { BaseBufferMemoryLayout, type BufferLayoutLocation } from './base-buffer-memory-layout.ts';

/**
 * Memory layout for a primitive number buffer or part of a buffer.
 */
export class PrimitiveBufferMemoryLayout extends BaseBufferMemoryLayout {
    /**
     * Get item count for multiplier type.
     * 
     * @param pMultiplier - Multiplier type.
     * 
     * @returns item count of multiplier. 
     */
    public static itemCountOfMultiplier(pMultiplier: BufferItemMultiplier): number {
        switch (pMultiplier) {
            case BufferItemMultiplier.Single: { return 1; }
            case BufferItemMultiplier.Vector2: { return 2; }
            case BufferItemMultiplier.Vector3: { return 3; }
            case BufferItemMultiplier.Vector4: { return 4; }
            case BufferItemMultiplier.Matrix22: { return 4; }
            case BufferItemMultiplier.Matrix23: { return 6; }
            case BufferItemMultiplier.Matrix24: { return 8; }
            case BufferItemMultiplier.Matrix32: { return 6; }
            case BufferItemMultiplier.Matrix33: { return 9; }
            case BufferItemMultiplier.Matrix34: { return 12; }
            case BufferItemMultiplier.Matrix42: { return 8; }
            case BufferItemMultiplier.Matrix43: { return 0; }
            case BufferItemMultiplier.Matrix44: { return 16; }
        }
    }

    /**
     * Get byte count of item format.
     * 
     * @param pItemFormat - Item format.
     * 
     * @returns byte count of format. 
     */
    public static itemFormatByteCount(pItemFormat: BufferItemFormat): number {
        switch (pItemFormat) {
            case BufferItemFormat.Float16: return 2;
            case BufferItemFormat.Float32: return 4;
            case BufferItemFormat.Uint32: return 4;
            case BufferItemFormat.Sint32: return 4;
            case BufferItemFormat.Uint8: return 1;
            case BufferItemFormat.Sint8: return 1;
            case BufferItemFormat.Uint16: return 2;
            case BufferItemFormat.Sint16: return 2;
            case BufferItemFormat.Unorm16: return 2;
            case BufferItemFormat.Snorm16: return 2;
            case BufferItemFormat.Unorm8: return 1;
            case BufferItemFormat.Snorm8: return 1;
        }
    }

    private readonly mAlignment: number;
    private readonly mFormatByteCount: number;
    private readonly mItemFormat: BufferItemFormat;
    private readonly mItemMultiplier: BufferItemMultiplier;
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
     * Byte count of underlying format.
     */
    public get formatByteCount(): number {
        return this.mFormatByteCount;
    }

    /**
     * Format of single value.
     */
    public get itemFormat(): BufferItemFormat {
        return this.mItemFormat;
    }

    /**
     * Format multiplication.
     */
    public get itemMultiplier(): BufferItemMultiplier {
        return this.mItemMultiplier;
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
        super(pDevice, pParameter.alignmentType);

        // Set default size by format.
        this.mFormatByteCount = PrimitiveBufferMemoryLayout.itemFormatByteCount(pParameter.primitiveFormat);
        this.mItemFormat = pParameter.primitiveFormat;
        this.mItemMultiplier = pParameter.primitiveMultiplier;
        this.mSize = this.mFormatByteCount * PrimitiveBufferMemoryLayout.itemCountOfMultiplier(pParameter.primitiveMultiplier);

        // Calculate alignment and size.
        this.mAlignment = ((): number => {
            switch (pParameter.primitiveMultiplier) {
                case BufferItemMultiplier.Single: return this.mFormatByteCount;
                case BufferItemMultiplier.Vector2: return this.mFormatByteCount * 2;
                case BufferItemMultiplier.Vector3: return this.mFormatByteCount * 4;
                case BufferItemMultiplier.Vector4: return this.mFormatByteCount * 4;
                case BufferItemMultiplier.Matrix22: return this.mFormatByteCount * 2;
                case BufferItemMultiplier.Matrix23: return this.mFormatByteCount * 4;
                case BufferItemMultiplier.Matrix24: return this.mFormatByteCount * 4;
                case BufferItemMultiplier.Matrix32: return this.mFormatByteCount * 2;
                case BufferItemMultiplier.Matrix33: return this.mFormatByteCount * 4;
                case BufferItemMultiplier.Matrix34: return this.mFormatByteCount * 4;
                case BufferItemMultiplier.Matrix42: return this.mFormatByteCount * 2;
                case BufferItemMultiplier.Matrix43: return this.mFormatByteCount * 4;
                case BufferItemMultiplier.Matrix44: return this.mFormatByteCount * 4;
            }
        })();

        // Override size of primitive.
        if (pParameter.overrideSize) {
            if (this.mSize > pParameter.overrideSize) {
                throw new Exception('Overriden buffer byte size can not be lower than the actual byte size.', this);
            }

            this.mAlignment = pParameter.overrideSize;
        }

        // Change alignment based on alignment type.
        this.mAlignment = (() => {
            switch (pParameter.alignmentType) {
                case BufferAlignmentType.Packed: {
                    return 1;
                }
                case BufferAlignmentType.Storage:
                case BufferAlignmentType.Uniform: {
                    return this.mAlignment;
                }
            }
        })();

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
    alignmentType: BufferAlignmentType;
    overrideAlignment?: number | null;
    overrideSize?: number | null;
    primitiveFormat: BufferItemFormat;
    primitiveMultiplier: BufferItemMultiplier;
}