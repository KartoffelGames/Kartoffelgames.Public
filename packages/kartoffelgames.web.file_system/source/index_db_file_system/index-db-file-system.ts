import { Exception, type IVoidParameterConstructor } from '@kartoffelgames/core';
import { BlobSerializer } from '@kartoffelgames/core-serializer';
import { WebDatabase } from '@kartoffelgames/web-database';
import { FileSystem, FileSystemReferenceType } from '../file-system.ts';
import type { IFileSystem } from '../i-file-system.ts';
import { IndexDbFileSystemEntry } from './index-db-file-system-entry.ts';
import { IndexDbFileSystemPath } from './index-db-file-system-path.ts';

/**
 * IndexedDB-backed file system implementation.
 * Combines blob serialization with a web database for persistent storage.
 * Multiple objects can be stored in a single blob via sub-paths, and each object is
 * addressable by a single read path.
 *
 * Objects are serialized via {@link BlobSerializer} and stored in an IndexedDB-backed {@link WebDatabase}.
 * An index table ({@link IndexDbFileSystemPath}) maps single read paths to their (filePath, subPath) pairs.
 */
export class IndexDbFileSystem implements IFileSystem {
    private readonly mDatabase: WebDatabase<typeof IndexDbFileSystemEntry | typeof IndexDbFileSystemPath>;
    private readonly mSingletonCache: Map<string, WeakRef<object>>;

    /**
     * Constructor.
     *
     * @param pScope - Database scope name. Used as the IndexedDB database name.
     */
    public constructor(pScope: string) {
        this.mDatabase = new WebDatabase(pScope, [IndexDbFileSystemEntry, IndexDbFileSystemPath]);
        this.mSingletonCache = new Map();
    }

    /**
     * Close the underlying database connection.
     */
    public close(): void {
        this.mSingletonCache.clear();
        this.mDatabase.close();
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
        const lPathEntry: IndexDbFileSystemPath | null = await this.mDatabase.transaction([IndexDbFileSystemPath], 'readonly', async (pTransaction) => {
            const lEntries: Array<IndexDbFileSystemPath> = await pTransaction.table(IndexDbFileSystemPath).where('readPath').is(lNormalizedPath).read();
            if (lEntries.length === 0) {
                return null;
            }

            return lEntries[0];
        });

        if (lPathEntry !== null) {
            // Single class deletion: remove the sub-path from the blob.
            return this.deleteSubPath(lPathEntry);
        }

        // Try as a file path (delete entire file).
        const lFileExists: boolean = await this.mDatabase.transaction([IndexDbFileSystemEntry], 'readonly', async (pTransaction) => {
            const lEntries: Array<IndexDbFileSystemEntry> = await pTransaction.table(IndexDbFileSystemEntry).where('filePath').is(lNormalizedPath).read();
            return lEntries.length > 0;
        });

        if (lFileExists) {
            return this.deleteFile(lNormalizedPath);
        }

        throw new Exception(`File not found: ${pPath}`, this);
    }

    /**
     * Read a serialized object from the file system by path.
     * The path is resolved via the index table to find the correct blob and sub-path.
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
        if (lCachedReference !== undefined) {
            const lCachedInstance: object | undefined = lCachedReference.deref();
            if (lCachedInstance !== undefined) {
                return lCachedInstance as T;
            }

            // WeakRef expired, remove stale entry.
            this.mSingletonCache.delete(lNormalizedPath);
        }

        // Look up the index to find filePath and subPath.
        const lFileSystemPath: IndexDbFileSystemPath = await this.mDatabase.transaction([IndexDbFileSystemPath], 'readonly', async (pTransaction) => {
            const lEntries: Array<IndexDbFileSystemPath> = await pTransaction.table(IndexDbFileSystemPath).where('readPath').is(lNormalizedPath).read();
            if (lEntries.length === 0) {
                throw new Exception(`File not found: ${pPath}`, this);
            }

            return lEntries[0];
        });

        // Read the blob from the file entry table.
        const lBlob: Blob = await this.mDatabase.transaction([IndexDbFileSystemEntry], 'readonly', async (pTransaction) => {
            const lEntries: Array<IndexDbFileSystemEntry> = await pTransaction.table(IndexDbFileSystemEntry).where('filePath').is(lFileSystemPath.filePath).read();
            if (lEntries.length === 0) {
                throw new Exception(`File data not found for: ${lFileSystemPath.filePath}`, this);
            }

            return lEntries[0].data;
        });

        // Deserialize the blob and read the sub-path.
        const lSerializer: BlobSerializer = new BlobSerializer();
        await lSerializer.load(lBlob);

        const lInstance: T = await lSerializer.read<T>(lFileSystemPath.subPath);

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
     * @param pPath - Full path (used as IndexedDB key and read path). Case-insensitive.
     * @param pObject - The serializable object to store.
     */
    public async store(pPath: string, pObject: object): Promise<void> {
        const lNormalizedPath: string = pPath.toLowerCase();

        // Serialize the single object into a new blob (empty sub-path key).
        const lSerializer: BlobSerializer = new BlobSerializer();
        lSerializer.store('', pObject);
        const lBlob: Blob = await lSerializer.save();

        // Write blob and path index.
        await this.mDatabase.transaction([IndexDbFileSystemEntry, IndexDbFileSystemPath], 'readwrite', async (pTransaction) => {
            const lEntry: IndexDbFileSystemEntry = new IndexDbFileSystemEntry();
            lEntry.filePath = lNormalizedPath;
            lEntry.data = lBlob;
            await pTransaction.table(IndexDbFileSystemEntry).put(lEntry);

            const lPathEntry: IndexDbFileSystemPath = new IndexDbFileSystemPath();
            lPathEntry.readPath = lNormalizedPath;
            lPathEntry.filePath = lNormalizedPath;
            lPathEntry.subPath = '';
            await pTransaction.table(IndexDbFileSystemPath).put(lPathEntry);
        });
    }

    /**
     * Serialize an object and store it in a multi-class blob.
     * Multiple objects can share the same file path with different sub-paths.
     * The read path is constructed as `filePath/subPath` (case-insensitive).
     *
     * @param pFilePath - File path (IndexedDB key). Case-insensitive.
     * @param pSubPath - Sub-path within the blob. Case-insensitive.
     * @param pObject - The serializable object to store.
     */
    public async storeMulti(pFilePath: string, pSubPath: string, pObject: object): Promise<void> {
        const lNormalizedFilePath: string = pFilePath.toLowerCase();
        const lNormalizedSubPath: string = pSubPath.toLowerCase();
        const lReadPath: string = `${lNormalizedFilePath}/${lNormalizedSubPath}`;

        // Read existing blob for this file path (if any) to append to it.
        const lExistingBlob: Blob | null = await this.mDatabase.transaction([IndexDbFileSystemEntry], 'readonly', async (pTransaction) => {
            const lTable = pTransaction.table(IndexDbFileSystemEntry);
            const lEntries: Array<IndexDbFileSystemEntry> = await lTable.where('filePath').is(lNormalizedFilePath).read();

            if (lEntries.length === 0) {
                return null;
            }

            return lEntries[0].data;
        });

        // Create a serializer and load existing blob if it exists to preserve existing entries.
        const lSerializer: BlobSerializer = new BlobSerializer();

        // If a blob already exists for this file path, load it to preserve existing entries.
        if (lExistingBlob !== null) {
            await lSerializer.load(lExistingBlob);
        }

        // Store the new object at the sub-path.
        lSerializer.store(lNormalizedSubPath, pObject);

        // Save the serializer to a new blob.
        const lBlob: Blob = await lSerializer.save();

        // Write the blob and path index in a single transaction.
        await this.mDatabase.transaction([IndexDbFileSystemEntry, IndexDbFileSystemPath], 'readwrite', async (pTransaction) => {
            // Update the file entry.
            const lEntry: IndexDbFileSystemEntry = new IndexDbFileSystemEntry();
            lEntry.filePath = lNormalizedFilePath;
            lEntry.data = lBlob;
            await pTransaction.table(IndexDbFileSystemEntry).put(lEntry);

            // Update the path index.
            const lPathEntry: IndexDbFileSystemPath = new IndexDbFileSystemPath();
            lPathEntry.readPath = lReadPath;
            lPathEntry.filePath = lNormalizedFilePath;
            lPathEntry.subPath = lNormalizedSubPath;
            await pTransaction.table(IndexDbFileSystemPath).put(lPathEntry);
        });
    }

    /**
     * Delete an entire file and all its path index entries.
     *
     * @param pFilePath - The normalized file path to delete.
     */
    private async deleteFile(pFilePath: string): Promise<void> {
        await this.mDatabase.transaction([IndexDbFileSystemEntry, IndexDbFileSystemPath], 'readwrite', async (pTransaction) => {
            // Delete all path index entries for this file.
            await pTransaction.table(IndexDbFileSystemPath).where('filePath').is(pFilePath).delete();

            // Create a file entry instance with the file path to delete the file entry.
            const lEntry: IndexDbFileSystemEntry = new IndexDbFileSystemEntry();
            lEntry.filePath = pFilePath;

            // Delete the file entry.
            await pTransaction.table(IndexDbFileSystemEntry).delete(lEntry);
        });
    }

    /**
     * Delete a single sub-path from a file blob. If the blob becomes empty,
     * the entire file entry is removed.
     *
     * @param pPathEntry - The path index entry to delete.
     */
    private async deleteSubPath(pPathEntry: IndexDbFileSystemPath): Promise<void> {
        // Load the existing blob.
        const lBlob: Blob | null = await this.mDatabase.transaction([IndexDbFileSystemEntry], 'readonly', async (pTransaction) => {
            const lTable = pTransaction.table(IndexDbFileSystemEntry);
            const lEntries: Array<IndexDbFileSystemEntry> = await lTable.where('filePath').is(pPathEntry.filePath).read();

            if (lEntries.length === 0) {
                return null;
            }

            return lEntries[0].data;
        });

        if (lBlob === null) {
            // File entry doesn't exist, just clean up the path index.
            return this.mDatabase.transaction([IndexDbFileSystemPath], 'readwrite', async (pTransaction) => {
                const lEntry: IndexDbFileSystemPath = new IndexDbFileSystemPath();
                lEntry.readPath = pPathEntry.readPath;
                await pTransaction.table(IndexDbFileSystemPath).delete(lEntry);
            });
        }

        // Load blob and delete the sub-path.
        const lSerializer: BlobSerializer = new BlobSerializer();
        await lSerializer.load(lBlob);
        lSerializer.delete(pPathEntry.subPath);

        // Check if the blob still has entries.
        if (lSerializer.contents.length > 0) {
            // Save the modified blob back and remove only the path index entry.
            const lUpdatedBlob: Blob = await lSerializer.save();

            await this.mDatabase.transaction([IndexDbFileSystemEntry, IndexDbFileSystemPath], 'readwrite', async (pTransaction) => {
                // Update the file entry with the modified blob.
                const lEntry: IndexDbFileSystemEntry = new IndexDbFileSystemEntry();
                lEntry.filePath = pPathEntry.filePath;
                lEntry.data = lUpdatedBlob;
                await pTransaction.table(IndexDbFileSystemEntry).put(lEntry);

                // Delete the path index entry.
                const lPathToDelete: IndexDbFileSystemPath = new IndexDbFileSystemPath();
                lPathToDelete.readPath = pPathEntry.readPath;
                await pTransaction.table(IndexDbFileSystemPath).delete(lPathToDelete);
            });
        } else {
            // Blob is empty, delete the entire file.
            await this.deleteFile(pPathEntry.filePath);
        }
    }
}
