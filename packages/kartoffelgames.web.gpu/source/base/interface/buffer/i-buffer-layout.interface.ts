import { IGpuObject } from '../i-gpu-object.interface';

export interface IBufferLayout extends IGpuObject {
    /**
     * Layout byte alignment.
     */
    readonly alignment: number;

    /**
     * Layout size in bytes.
     */
    readonly size: number;

    /**
     * Name of layout used for path tracing.
     */
    readonly name: string;

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