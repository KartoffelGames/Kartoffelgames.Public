import { Exception, type IVoidParameterConstructor } from '@kartoffelgames/core';
import { BlobSerializer } from '@kartoffelgames/core-serializer';
import { FileSystem, FileSystemReferenceType } from '../file-system.ts';
import type { IFileSystem } from '../i-file-system.ts';

/**
 * In-memory file system implementation.
 * Holds all data in memory without writing to any disk or database.
 * Multiple objects can be stored in a single blob via sub-paths, and each object is
 * addressable by a single read path.
 *
 * Objects are serialized via {@link BlobSerializer} and stored as {@link Blob} instances in a {@link Map}.
 * An in-memory index maps single read paths to their (filePath, subPath) pairs.
 */
export class MemoryFileSystem implements IFileSystem {
    private readonly mBlobStorage: Map<string, Blob>;
    private readonly mPathIndex: Array<MemoryFileSystemPathEntry>;
    private readonly mSingletonCache: Map<string, WeakRef<object>>;

    /**
     * Constructor.
     */
    public constructor() {
        this.mBlobStorage = new Map();
        this.mPathIndex = [];
        this.mSingletonCache = new Map();
    }

    /**
     * Delete from the file system by path.
     * First tries to match as a read path (single class). If no read path matches,
     * tries to match as a file path (deletes the entire file and all its sub-entries).
     *
     * @param pPath - Read path or file path to delete. Case-insensitive.
     *
     * @throws Exception if the path does not match any read path or file path.
     */
    public async delete(pPath: string): Promise<void> {
        const lNormalizedPath: string = pPath.toLowerCase();

        // Try to find as a read path first (single class deletion).
        const lPathEntry: MemoryFileSystemPathEntry | undefined = this.mPathIndex.find((pEntry) => pEntry.readPath === lNormalizedPath);
        if (lPathEntry) {
            return this.deleteSubPath(lPathEntry);
        }

        // Try as a file path (delete entire file).
        const lFileEntries: Array<MemoryFileSystemPathEntry> = this.mPathIndex.filter((pEntry) => pEntry.filePath === lNormalizedPath);

        if (lFileEntries.length > 0) {
            return this.deleteFile(lNormalizedPath);
        }

        throw new Exception(`File not found: ${pPath}`, this);
    }

    /**
     * Read a serialized object from the file system by path.
     * The path is resolved via the index to find the correct blob and sub-path.
     *
     * For classes decorated with {@link FileSystemReferenceType.Singleton}, the deserialized
     * instance is cached per path (as a {@link WeakRef}). Subsequent reads return the cached
     * instance as long as the reference is still alive.
     *
     * @param pPath - Read path to the stored object. Case-insensitive.
     *
     * @returns the deserialized object.
     *
     * @throws Exception if no entry exists at the given path.
     */
    public async read<T extends object>(pPath: string): Promise<T> {
        const lNormalizedPath: string = pPath.toLowerCase();

        // Check singleton cache before deserializing.
        const lCachedReference: WeakRef<object> | undefined = this.mSingletonCache.get(lNormalizedPath);
        if (lCachedReference) {
            const lCachedInstance: object | undefined = lCachedReference.deref();
            if (lCachedInstance) {
                return lCachedInstance as T;
            }

            // WeakRef expired, remove stale entry.
            this.mSingletonCache.delete(lNormalizedPath);
        }

        // Look up the index to find filePath and subPath.
        const lPathEntry: MemoryFileSystemPathEntry | undefined = this.mPathIndex.find((pEntry) => pEntry.readPath === lNormalizedPath);
        if (!lPathEntry) {
            throw new Exception(`File not found: ${pPath}`, this);
        }

        // Read the blob from storage.
        const lBlob: Blob | undefined = this.mBlobStorage.get(lPathEntry.filePath);
        if (!lBlob) {
            throw new Exception(`File data not found for: ${lPathEntry.filePath}`, this);
        }

        // Deserialize the blob and read the sub-path.
        const lSerializer: BlobSerializer = new BlobSerializer();
        await lSerializer.load(lBlob);

        const lInstance: T = await lSerializer.read<T>(lPathEntry.subPath);

        // Cache singleton instances.
        const lReferenceType: FileSystemReferenceType = FileSystem.referenceTypeOf(lInstance.constructor as IVoidParameterConstructor<object>);
        if (lReferenceType === FileSystemReferenceType.Singleton) {
            this.mSingletonCache.set(lNormalizedPath, new WeakRef(lInstance));
        }

        return lInstance;
    }

    /**
     * Serialize a single object and store it in the file system.
     * The full path is used as both the file path and the read path.
     *
     * @param pPath - Full path (used as storage key and read path). Case-insensitive.
     * @param pObject - The serializable object to store.
     */
    public async store(pPath: string, pObject: object): Promise<void> {
        const lNormalizedPath: string = pPath.toLowerCase();

        // Serialize the single object into a new blob (empty sub-path key).
        const lSerializer: BlobSerializer = new BlobSerializer();
        lSerializer.store('', pObject);

        // Write the blob to storage.
        this.mBlobStorage.set(lNormalizedPath, await lSerializer.save());

        // Remove any existing entry for this read path.
        const lExistingIndex: number = this.mPathIndex.findIndex((pEntry) => pEntry.readPath === lNormalizedPath);
        if (lExistingIndex !== -1) {
            this.mPathIndex.splice(lExistingIndex, 1);
        }

        // Add the new entry.
        this.mPathIndex.push({
            readPath: lNormalizedPath,
            filePath: lNormalizedPath,
            subPath: ''
        });
    }

    /**
     * Serialize an object and store it in a multi-class blob.
     * Multiple objects can share the same file path with different sub-paths.
     * The read path is constructed as `filePath/subPath` (case-insensitive).
     *
     * @param pFilePath - File path (storage key). Case-insensitive.
     * @param pSubPath - Sub-path within the blob. Case-insensitive.
     * @param pObject - The serializable object to store.
     */
    public async storeMulti(pFilePath: string, pSubPath: string, pObject: object): Promise<void> {
        const lNormalizedFilePath: string = pFilePath.toLowerCase();
        const lNormalizedSubPath: string = pSubPath.toLowerCase();
        const lReadPath: string = `${lNormalizedFilePath}/${lNormalizedSubPath}`;

        // Read existing blob for this file path (if any) to append to it.
        const lExistingBlob: Blob | undefined = this.mBlobStorage.get(lNormalizedFilePath);

        // Create a serializer and load existing blob if it exists to preserve existing entries.
        const lSerializer: BlobSerializer = new BlobSerializer();

        // If a blob already exists for this file path, load it to preserve existing entries.
        if (lExistingBlob) {
            await lSerializer.load(lExistingBlob);
        }

        // Store the new object at the sub-path.
        lSerializer.store(lNormalizedSubPath, pObject);

        // Save the serializer to a new blob.
        const lBlob: Blob = await lSerializer.save();

        // Write the blob to storage.
        this.mBlobStorage.set(lNormalizedFilePath, lBlob);

        // Remove any existing entry for this read path.
        const lExistingIndex: number = this.mPathIndex.findIndex((pEntry) => pEntry.readPath === lReadPath);
        if (lExistingIndex !== -1) {
            this.mPathIndex.splice(lExistingIndex, 1);
        }

        // Add the new entry.
        this.mPathIndex.push({
            readPath: lReadPath,
            filePath: lNormalizedFilePath,
            subPath: lNormalizedSubPath
        });
    }

    /**
     * Delete an entire file and all its path index entries.
     *
     * @param pFilePath - The normalized file path to delete.
     */
    private deleteFile(pFilePath: string): void {
        // Remove all path index entries for this file.
        for (let lFilePathIndex = this.mPathIndex.length - 1; lFilePathIndex >= 0; lFilePathIndex--) {
            if (this.mPathIndex[lFilePathIndex].filePath === pFilePath) {
                this.mPathIndex.splice(lFilePathIndex, 1);
            }
        }

        // Delete the blob from storage.
        this.mBlobStorage.delete(pFilePath);
    }

    /**
     * Delete a single sub-path from a file blob. If the blob becomes empty,
     * the entire file entry is removed.
     *
     * @param pPathEntry - The path index entry to delete.
     */
    private async deleteSubPath(pPathEntry: MemoryFileSystemPathEntry): Promise<void> {
        // Try to find a blob for the file path.
        const lBlob: Blob | undefined = this.mBlobStorage.get(pPathEntry.filePath);
        if (!lBlob) {
            // File entry doesn't exist, just clean up the path index.
            const lIndex: number = this.mPathIndex.findIndex((pEntry) => pEntry.readPath === pPathEntry.readPath);
            if (lIndex !== -1) {
                this.mPathIndex.splice(lIndex, 1);
            }
            return;
        }

        // Load blob and delete the sub-path.
        const lSerializer: BlobSerializer = new BlobSerializer();
        await lSerializer.load(lBlob);
        lSerializer.delete(pPathEntry.subPath);

        // Check if the blob still has entries.
        if (lSerializer.contents.length > 0) {
            // Save the modified blob back and remove only the path index entry.
            this.mBlobStorage.set(pPathEntry.filePath, await lSerializer.save());

            const lIndex: number = this.mPathIndex.findIndex((pEntry) => pEntry.readPath === pPathEntry.readPath);
            if (lIndex !== -1) {
                this.mPathIndex.splice(lIndex, 1);
            }
        } else {
            // Blob is empty, delete the entire file.
            this.deleteFile(pPathEntry.filePath);
        }
    }
}

/**
 * Path index entry for the MemoryFileSystem.
 * Maps a read path to its file path and sub-path within the blob.
 */
type MemoryFileSystemPathEntry = {
    filePath: string;
    readPath: string;
    subPath: string;
};
