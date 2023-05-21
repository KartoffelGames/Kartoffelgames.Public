import { TypedArray } from '@kartoffelgames/core.data';
import { IBufferLayout } from './i-buffer-layout.interface';

export interface IBuffer<T extends TypedArray> {
    /**
     * Buffer size in bytes.
     */
    readonly size: number;

    /**
     * Buffer layout.
     */
    readonly layout: IBufferLayout;

    /**
     * Read data mapped to layout.
     * @param pLayoutPath - Path to data inside buffer layout.
     */
    read(pLayoutPath: Array<string>): Promise<T>;

    /**
     * WriRead data from buffer.
     * @param pOffset - Offset of data.
     * @param pSize - Size of data.
     * @throws Exception - Range overflow.
     */
    readRaw(pOffset?: number, pSize?: number): Promise<T>;

    /**
     * Read data mapped to layout.
     * @param pData - Data.
     * @param pLayoutPath - Path to data inside buffer layout.
     */
    write(pData: T, pLayoutPath: Array<string>): Promise<void>;

    /**
     * Write data into buffer.
     * @param pData - Write data.
     * @param pOffset - Offset of data to write.
     * @param pSize - Size of data to write.
     * @throws Exception - Data length or type missmatch.
     */
    writeRaw(pData: T, pOffset?: number, pSize?: number): Promise<void>;
}