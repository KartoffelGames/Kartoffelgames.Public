import { Exception, type IVoidParameterConstructor } from '@kartoffelgames/core';
import { BlobSerializer } from '@kartoffelgames/core-serializer';
import { FileSystem, FileSystemReferenceType } from '../file-system.ts';
import type { IFileSystem } from '../i-file-system.ts';

/**
 * File System Access API-backed file system implementation.
 * Uses a {@link FileSystemDirectoryHandle} for persistent storage.
 * Multiple objects can be stored in a single blob via sub-paths, and each object is
 * addressable by a single read path.
 *
 * Objects are serialized via {@link BlobSerializer} and stored as files via the File System Access API.
 * A JSON index file maps single read paths to their (filePath, subPath) pairs.
 */
export class FileApiFileSystem implements IFileSystem {
    private static readonly INDEX_FILE_NAME: string = '_file_system_index_.json';

    private readonly mDirectoryHandle: FileSystemDirectoryHandle;
    private readonly mSingletonCache: Map<string, WeakRef<object>>;

    /**
     * Constructor.
     *
     * @param pDirectoryHandle - The directory handle to use for storage.
     */
    public constructor(pDirectoryHandle: FileSystemDirectoryHandle) {
        this.mDirectoryHandle = pDirectoryHandle;
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
        const lIndex: Array<FileApiFileSystemPathEntry> = await this.readFileSystemIndex();

        // Try to find as a read path first (single class deletion).
        const lPathEntry: FileApiFileSystemPathEntry | undefined = lIndex.find((pEntry) => pEntry.readPath === lNormalizedPath);
        if (lPathEntry) {
            return this.deleteSubPath(lPathEntry, lIndex);
        }

        // Try as a file path (delete entire file).
        const lFileEntries: Array<FileApiFileSystemPathEntry> = lIndex.filter((pEntry) => pEntry.filePath === lNormalizedPath);

        if (lFileEntries.length > 0) {
            return this.deleteFile(lNormalizedPath, lIndex);
        }

        throw new Exception(`File not found: ${pPath}`, this);
    }

    /**
     * Read a serialized object from the file system by path.
     * The path is resolved via the index to find the correct blob file and sub-path.
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
        const lIndex: Array<FileApiFileSystemPathEntry> = await this.readFileSystemIndex();
        const lPathEntry: FileApiFileSystemPathEntry | undefined = lIndex.find((pEntry) => pEntry.readPath === lNormalizedPath);
        if (!lPathEntry) {
            throw new Exception(`File not found: ${pPath}`, this);
        }

        // Read the blob from the file.
        const lBlob: Blob = await this.readBlobFile(lPathEntry.filePath);

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
     * @param pPath - Full path (used as file name and read path). Case-insensitive.
     * @param pObject - The serializable object to store.
     */
    public async store(pPath: string, pObject: object): Promise<void> {
        const lNormalizedPath: string = pPath.toLowerCase();

        // Serialize the single object into a new blob (empty sub-path key).
        const lSerializer: BlobSerializer = new BlobSerializer();
        lSerializer.store('', pObject);
        const lBlob: Blob = await lSerializer.save();

        // Write the blob file.
        await this.writeBlobFile(lNormalizedPath, lBlob);

        // Update the index.
        const lIndex: Array<FileApiFileSystemPathEntry> = await this.readFileSystemIndex();

        // Remove any existing entry for this read path.
        const lFilteredIndex: Array<FileApiFileSystemPathEntry> = lIndex.filter((pEntry) => pEntry.readPath !== lNormalizedPath);

        // Add the new entry.
        lFilteredIndex.push({
            readPath: lNormalizedPath,
            filePath: lNormalizedPath,
            subPath: ''
        });

        await this.writeIndex(lFilteredIndex);
    }

    /**
     * Serialize an object and store it in a multi-class blob.
     * Multiple objects can share the same file path with different sub-paths.
     * The read path is constructed as `filePath/subPath` (case-insensitive).
     *
     * @param pFilePath - File path (file name). Case-insensitive.
     * @param pSubPath - Sub-path within the blob. Case-insensitive.
     * @param pObject - The serializable object to store.
     */
    public async storeMulti(pFilePath: string, pSubPath: string, pObject: object): Promise<void> {
        const lNormalizedFilePath: string = pFilePath.toLowerCase();
        const lNormalizedSubPath: string = pSubPath.toLowerCase();
        const lReadPath: string = `${lNormalizedFilePath}/${lNormalizedSubPath}`;

        // Read existing blob for this file path (if any) to append to it.
        let lExistingBlob: Blob | null = null;
        try {
            lExistingBlob = await this.readBlobFile(lNormalizedFilePath);
        } catch {
            // File doesn't exist yet, that's fine.
        }

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

        // Write the blob file.
        await this.writeBlobFile(lNormalizedFilePath, lBlob);

        // Update the index.
        const lIndex: Array<FileApiFileSystemPathEntry> = await this.readFileSystemIndex();

        // Remove any existing entry for this read path.
        const lFilteredIndex: Array<FileApiFileSystemPathEntry> = lIndex.filter((pEntry) => pEntry.readPath !== lReadPath);

        // Add the new entry.
        lFilteredIndex.push({
            readPath: lReadPath,
            filePath: lNormalizedFilePath,
            subPath: lNormalizedSubPath
        });

        await this.writeIndex(lFilteredIndex);
    }

    /**
     * Delete an entire file and all its path index entries.
     *
     * @param pFilePath - The normalized file path to delete.
     * @param pIndex - The current path index.
     */
    private async deleteFile(pFilePath: string, pIndex: Array<FileApiFileSystemPathEntry>): Promise<void> {
        // Remove all path index entries for this file.
        const lFilteredIndex: Array<FileApiFileSystemPathEntry> = pIndex.filter((pEntry) => pEntry.filePath !== pFilePath);
        await this.writeIndex(lFilteredIndex);

        // Delete the blob file.
        await this.deleteBlobFile(pFilePath);
    }

    /**
     * Delete a single sub-path from a file blob. If the blob becomes empty,
     * the entire file entry is removed.
     *
     * @param pPathEntry - The path index entry to delete.
     * @param pIndex - The current path index.
     */
    private async deleteSubPath(pPathEntry: FileApiFileSystemPathEntry, pIndex: Array<FileApiFileSystemPathEntry>): Promise<void> {
        // Try to load the existing blob.
        let lBlob: Blob | null = null;
        try {
            lBlob = await this.readBlobFile(pPathEntry.filePath);
        } catch {
            // File doesn't exist.
        }

        if (lBlob === null) {
            // File entry doesn't exist, just clean up the path index.
            const lFilteredIndex: Array<FileApiFileSystemPathEntry> = pIndex.filter((pEntry) => pEntry.readPath !== pPathEntry.readPath);
            await this.writeIndex(lFilteredIndex);
            return;
        }

        // Load blob and delete the sub-path.
        const lSerializer: BlobSerializer = new BlobSerializer();
        await lSerializer.load(lBlob);
        lSerializer.delete(pPathEntry.subPath);

        // Check if the blob still has entries.
        if (lSerializer.contents.length > 0) {
            // Save the modified blob back and remove only the path index entry.
            const lUpdatedBlob: Blob = await lSerializer.save();
            await this.writeBlobFile(pPathEntry.filePath, lUpdatedBlob);

            const lFilteredIndex: Array<FileApiFileSystemPathEntry> = pIndex.filter((pEntry) => pEntry.readPath !== pPathEntry.readPath);
            await this.writeIndex(lFilteredIndex);
        } else {
            // Blob is empty, delete the entire file.
            await this.deleteFile(pPathEntry.filePath, pIndex);
        }
    }

    /**
     * Encode a file path into a safe filename for the File System Access API.
     * Uses base64url encoding to avoid issues with special characters.
     *
     * @param pFilePath - The file path to encode.
     *
     * @returns the encoded filename with .bin extension.
     */
    private encodeFileName(pFilePath: string): string {
        // Convert to base64 and make it URL-safe.
        return btoa(pFilePath).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') + '.bin';
    }

    /**
     * Delete a blob file from the directory.
     *
     * @param pFilePath - The normalized file path (used to derive the filename).
     */
    private async deleteBlobFile(pFilePath: string): Promise<void> {
        const lFileName: string = this.encodeFileName(pFilePath);
        await this.mDirectoryHandle.removeEntry(lFileName);
    }

    /**
     * Read a blob from a file in the directory.
     *
     * @param pFilePath - The normalized file path (used to derive the filename).
     *
     * @returns the blob read from the file.
     *
     * @throws if the file does not exist.
     */
    private async readBlobFile(pFilePath: string): Promise<Blob> {
        const lFileName: string = this.encodeFileName(pFilePath);
        const lFileHandle: FileSystemFileHandle = await this.mDirectoryHandle.getFileHandle(lFileName);
        return lFileHandle.getFile();
    }

    /**
     * Read the path index from the index file.
     *
     * @returns the array of path entries, or empty array if no index exists.
     */
    private async readFileSystemIndex(): Promise<Array<FileApiFileSystemPathEntry>> {
        try {
            const lFileHandle: FileSystemFileHandle = await this.mDirectoryHandle.getFileHandle(FileApiFileSystem.INDEX_FILE_NAME);
            const lFile: File = await lFileHandle.getFile();
            const lText: string = await lFile.text();

            return JSON.parse(lText) as Array<FileApiFileSystemPathEntry>;
        } catch {
            // Index file doesn't exist yet.
            return [];
        }
    }

    /**
     * Write a blob to a file in the directory.
     *
     * @param pFilePath - The normalized file path (used to derive the filename).
     * @param pBlob - The blob to write.
     */
    private async writeBlobFile(pFilePath: string, pBlob: Blob): Promise<void> {
        const lFileName: string = this.encodeFileName(pFilePath);
        const lFileHandle: FileSystemFileHandle = await this.mDirectoryHandle.getFileHandle(lFileName, { create: true });
        const lWritable: FileSystemWritableFileStream = await lFileHandle.createWritable();

        await lWritable.write(pBlob);
        await lWritable.close();
    }

    /**
     * Write the path index to the index file.
     *
     * @param pIndex - The array of path entries to persist.
     */
    private async writeIndex(pIndex: Array<FileApiFileSystemPathEntry>): Promise<void> {
        const lFileHandle: FileSystemFileHandle = await this.mDirectoryHandle.getFileHandle(FileApiFileSystem.INDEX_FILE_NAME, { create: true });
        const lWritable: FileSystemWritableFileStream = await lFileHandle.createWritable();

        await lWritable.write(JSON.stringify(pIndex));
        await lWritable.close();
    }
}

/**
 * Path index entry for the FileApiFileSystem.
 * Maps a read path to its file path and sub-path within the blob.
 */
type FileApiFileSystemPathEntry = {
    filePath: string;
    readPath: string;
    subPath: string;
};