/**
 * Access types of module and extensions.
 */
export enum AccessMode {
    /**
     * Reads information from target.
     */
    Read = 1,

    /**
     * Writes into target.
     */
    Write = 2,

    /**
     * Read and write into target.
     */
    ReadWrite = 3
}