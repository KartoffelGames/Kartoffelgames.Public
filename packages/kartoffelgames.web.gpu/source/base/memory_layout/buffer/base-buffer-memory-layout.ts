import { Exception } from '@kartoffelgames/core';
import { BufferUsage } from '../../../constant/buffer-usage.enum';
import { UpdateReason } from '../../gpu/gpu-object-update-reason';
import { BaseMemoryLayout, MemoryLayoutParameter } from '../base-memory-layout';

export abstract class BaseBufferMemoryLayout extends BaseMemoryLayout {
    private mUsage: BufferUsage;


    /**
     * Type byte alignment.
     */
    public abstract readonly alignment: number;

    /**
     * Buffer size in bytes.
     */
    public abstract readonly size: number;

    /**
     * Buffer usage. Bitmask.
     */
    public get usage(): BufferUsage {
        return this.mUsage;
    } set usage(pUsage: BufferUsage) {
        this.mUsage = pUsage;

        // Trigger auto update.
        this.triggerAutoUpdate(UpdateReason.Setting);
    }

    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    public constructor(pParameter: BufferMemoryLayoutParameter) {
        super(pParameter);

        // Settings.
        this.mUsage = pParameter.usage;
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

        return { size: this.size, offset: 0 };
    }
}

export interface BufferMemoryLayoutParameter extends MemoryLayoutParameter {
    usage: BufferUsage;
}

export type BufferLayoutLocation = {
    offset: number;
    size: number;
};