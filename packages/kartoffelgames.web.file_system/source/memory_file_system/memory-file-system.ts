import { Exception } from '@kartoffelgames/core';
import { FileSystem, FileSystemFileType, type FileSystemDirectoryEntry } from '../file-system.ts';

/**
 * In-memory file system implementation.
 * All data is temporary and lost when the instance is garbage collected.
 * Uses UUID references for all entries and stores blobs in a separate map.
 */
export class MemoryFileSystem extends FileSystem {
    private static readonly ROOT_REFERENCE: string = 'memory-root';

    private readonly mFileSystemItems: Map<string, MemoryFileSystemItem>;

    /**
     * Constructor.
     */
    public constructor() {
        super(MemoryFileSystem.ROOT_REFERENCE);
        this.mFileSystemItems = new Map();

        // Create root directory entry in native storage.
        this.mFileSystemItems.set(MemoryFileSystem.ROOT_REFERENCE, {
            name: '',
            itemType: FileSystemFileType.Directory,
            data: {},
        });
    }

    /**
     * Delete a file system item by reference. Updates the parent directory's children mapping.
     *
     * @param pReference - The reference of the item to delete.
     * @param pParentReference - The reference of the parent directory.
     *
     * @returns `true` if the item was deleted, `false` if it did not exist.
     */
    protected override async deleteReference(pReference: string, pParentReference: string): Promise<boolean> {
        // Read the item that should be deleted.
        const lRemovedItem: MemoryFileSystemItem | undefined = this.mFileSystemItems.get(pReference);
        if (!lRemovedItem) {
            return false;
        }

        // Delete item.
        this.mFileSystemItems.delete(pReference);

        // Update the parent's children mapping.
        const lParent: MemoryFileSystemItem | undefined = this.mFileSystemItems.get(pParentReference);
        if (lParent && lParent.itemType === FileSystemFileType.Directory) {
            delete lParent.data[lRemovedItem.name];
        }

        return true;
    }

    /**
     * Read the immediate children of a directory from memory storage.
     *
     * @param pReference - The reference of the directory to list.
     *
     * @returns array of directory entries, or an empty array when the directory is empty or not found.
     */
    protected override async readDirectoryItems(pReference: string): Promise<Array<FileSystemDirectoryEntry>> {
        // Read the directory item from storage.
        const lDirectoryItem: MemoryFileSystemItem | undefined = this.mFileSystemItems.get(pReference);
        if (!lDirectoryItem || lDirectoryItem.itemType !== FileSystemFileType.Directory) {
            return [];
        }

        // Convert directory items to FileSystemDirectoryEntry format.
        const lResult: Array<FileSystemDirectoryEntry> = [];
        for (const lItemReference of Object.values(lDirectoryItem.data)) {
            // Get child item reference.
            const lChildItem: MemoryFileSystemItem | undefined = this.mFileSystemItems.get(lItemReference);
            if (!lChildItem) {
                continue;
            }

            // Try to read class identifier for files.
            let lClassIdentifier: string | null = null;
            if (lChildItem.itemType === FileSystemFileType.File) {
                lClassIdentifier = lChildItem.data.classIdentifier;
            }

            lResult.push({
                name: lChildItem.name,
                type: lChildItem.itemType,
                reference: lItemReference,
                classIdentifier: lClassIdentifier,
            });
        }

        return lResult;
    }

    /**
     * Read a file blob from memory storage.
     *
     * @param pFileReference - The reference of the file to read.
     *
     * @returns the file's Blob data.
     */
    protected override async readFile(pFileReference: string): Promise<Blob> {
        // Read the directory item from storage.
        const lDirectoryItem: MemoryFileSystemItem | undefined = this.mFileSystemItems.get(pFileReference);
        if (!lDirectoryItem || lDirectoryItem.itemType !== FileSystemFileType.File) {
            throw new Exception(`File with reference "${pFileReference}" not found.`, this);
        }

        return lDirectoryItem.data.blob;
    }

    /**
     * Create a directory in memory storage. Updates the parent directory's children mapping.
     *
     * @param pParentReference - The reference of the parent directory.
     * @param pDirectoryName - The name of the new directory.
     *
     * @returns the generated UUID reference for the new directory.
     */
    protected override async storeDirectory(pParentReference: string, pDirectoryName: string): Promise<string> {
        const lDirReference: string = crypto.randomUUID();

        // Store the directory item with empty children.
        this.mFileSystemItems.set(lDirReference, {
            name: pDirectoryName,
            itemType: FileSystemFileType.Directory,
            data: {},
        });

        // Update parent's children mapping.
        const lParent: MemoryFileSystemItem | undefined = this.mFileSystemItems.get(pParentReference);
        if (lParent && lParent.itemType === FileSystemFileType.Directory) {
            (lParent.data as MemoryFileSystemDirectoryData)[pDirectoryName] = lDirReference;
        }

        return lDirReference;
    }

    /**
     * Store a file blob in memory storage. Updates the parent directory's children mapping.
     *
     * @param pParentReference - The reference of the parent directory.
     * @param pFileName - The name of the file within the parent directory.
     * @param pFileClassIdentifier - The class identifier of the stored object.
     * @param pFile - The file's Blob data.
     *
     * @returns the generated UUID reference for the stored file.
     */
    protected override async storeFile(pParentReference: string, pFileName: string, pFileClassIdentifier: string, pFile: Blob): Promise<string> {
        // Generate a unique reference for the new file.
        const lFileReference: string = crypto.randomUUID();

        // Store the item metadata.
        this.mFileSystemItems.set(lFileReference, {
            name: pFileName,
            itemType: FileSystemFileType.File,
            data: {
                classIdentifier: pFileClassIdentifier,
                blob: pFile
            },
        });

        // Update parent's children mapping.
        const lParent: MemoryFileSystemItem | undefined = this.mFileSystemItems.get(pParentReference);
        if (lParent && lParent.itemType === FileSystemFileType.Directory) {
            lParent.data[pFileName] = lFileReference;
        }

        return lFileReference;
    }
}

/**
 * Internal type for items stored in memory.
 */
type MemoryFileSystemFileData = {
    classIdentifier: string;
    blob: Blob;
};

type MemoryFileSystemDirectoryData = {
    [name: string]: string;
};

type MemoryFileSystemItem = {
    name: string;
    itemType: FileSystemFileType.Directory;
    data: MemoryFileSystemDirectoryData;
} | {
    name: string;
    itemType: FileSystemFileType.File;
    data: MemoryFileSystemFileData;
}

