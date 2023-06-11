import { IMemoryLayout } from '../i-memory-layout.interface';

export interface IBufferMemoryLayout extends IMemoryLayout {
    /**
     * Layout byte alignment.
     */
    readonly alignment: number;

    /**
     * Layout size in bytes.
     */
    readonly size: number;

    /**
     * Get location of path.
     * @param pPathName - Path name.
     */
    locationOf(pPathName: Array<string>): BufferLayoutLocation;
}

export type BufferLayoutLocation = {
    offset: number;
    size: number;
};