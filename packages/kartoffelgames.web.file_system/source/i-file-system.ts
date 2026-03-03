/**
 * Interface for file system implementations.
 * Provides methods for storing, reading, and deleting serializable objects.
 */
export interface IFileSystem {
    /**
     * Close the file system and release resources.
     */
    close(): void;

    /**
     * Delete from the file system by path.
     * First tries to match as a read path (single class). If no read path matches,
     * tries to match as a file path (deletes the entire file and all its sub-entries).
     *
     * @param pPath - Read path or file path to delete. Case-insensitive.
     *
     * @throws if the path does not match any read path or file path.
     */
    delete(pPath: string): Promise<void>;

    /**
     * Read a serialized object from the file system by path.
     *
     * @param pPath - Read path to the stored object. Case-insensitive.
     *
     * @returns the deserialized object.
     *
     * @throws if no entry exists at the given path.
     */
    read<T extends object>(pPath: string): Promise<T>;

    /**
     * Serialize a single object and store it in the file system.
     * The full path is used as both the file path and the read path.
     *
     * @param pPath - Full path (used as key and read path). Case-insensitive.
     * @param pObject - The serializable object to store.
     */
    store(pPath: string, pObject: object): Promise<void>;

    /**
     * Serialize an object and store it in a multi-class blob.
     * Multiple objects can share the same file path with different sub-paths.
     * The read path is constructed as `filePath/subPath` (case-insensitive).
     *
     * @param pFilePath - File path (storage key). Case-insensitive.
     * @param pSubPath - Sub-path within the blob. Case-insensitive.
     * @param pObject - The serializable object to store.
     */
    storeMulti(pFilePath: string, pSubPath: string, pObject: object): Promise<void>;
}
