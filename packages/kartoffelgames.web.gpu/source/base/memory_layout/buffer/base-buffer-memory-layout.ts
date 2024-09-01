import { Exception } from '@kartoffelgames/core';
import { BaseMemoryLayout, MemoryLayoutParameter } from '../base-memory-layout';

export abstract class BaseBufferMemoryLayout extends BaseMemoryLayout {
    /**
     * Type byte alignment.
     */
    public abstract readonly alignment: number;

    /**
     * Buffer size in bytes.
     */
    public abstract readonly size: number;

    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    public constructor(pParameter: BufferMemoryLayoutParameter) {
        super(pParameter);
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

export interface BufferMemoryLayoutParameter extends MemoryLayoutParameter { }

export type BufferLayoutLocation = {
    offset: number;
    size: number;
};