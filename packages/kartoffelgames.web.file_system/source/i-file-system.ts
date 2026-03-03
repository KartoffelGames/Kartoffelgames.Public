import type { IVoidParameterConstructor } from '@kartoffelgames/core';

/**
 * Interface for file system implementations.
 * Provides methods for storing, reading, and deleting serializable objects.
 */
export interface IFileSystem {
    /**
     * List the immediate children of the given path as a virtual directory tree.
     * Each stored read path is treated as a hierarchical path (separated by `/`).
     *
     * Items whose segment is itself a read path (File) but also has deeper children
     * are classified as {@link FileSystemItemType.Directory}.
     *
     * @param pPath - Parent path to list children of. Case-insensitive.
     *                An empty string lists root-level items.
     *
     * @returns array of immediate child items, or an empty array when no children exist.
     */
    contentOf(pPath: string): Promise<Array<FileSystemItem>>;

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
     * Check whether a given path exists in the file system.
     * First checks read paths, then file paths.
     *
     * @param pPath - Read path or file path to check. Case-insensitive.
     *
     * @returns `true` when a matching read path or file path exists.
     */
    has(pPath: string): Promise<boolean>;

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

/**
 * Determines the type of a virtual file system entry.
 */
export enum FileSystemItemType {
    /**
     * A leaf entry that holds a stored (serialized) object.
     */
    File,

    /**
     * An intermediate path segment that contains child entries.
     */
    Directory
}

/**
 * Describes a single entry returned by {@link IFileSystem.contentOf}.
 */
export type FileSystemItem = {
    /**
     * The class constructor of the stored object.
     * Only available for {@link FileSystemItemType.File} items; `null` for directories.
     */
    classType: IVoidParameterConstructor<object> | null;

    /**
     * The direct segment name (e.g. `'b'` when the full path is `'a/b'`).
     */
    name: string;

    /**
     * The full (absolute) path of the item.
     */
    path: string;

    /**
     * Whether this entry is a file or a directory.
     */
    type: FileSystemItemType;
};
