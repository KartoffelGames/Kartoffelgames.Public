/**
 * Access types of module and extensions.
 */
export enum AccessMode {
    /**
     * Reads information from target.
     */
    Read = 1,

    /**
     * Read and write into target.
     */
    ReadWrite = 2,

    /**
     * Writes into target.
     */
    Write = 3
}