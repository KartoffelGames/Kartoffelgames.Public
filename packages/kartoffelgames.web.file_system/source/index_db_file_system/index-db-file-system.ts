import { Exception } from '@kartoffelgames/core';
import { WebDatabase } from '@kartoffelgames/web-database';
import { FileSystem, FileSystemFileType, type FileSystemDirectoryEntry } from '../file-system.ts';
import { IndexDbFileSystemItem, type IndexDbFileSystemItemDirectoryData, type IndexDbFileSystemItemFileData } from './index-db-file-system-item.ts';

/**
 * IndexedDB-backed file system implementation.
 * Stores file blobs and directory structure in a single IndexedDB table
 * where each entry is keyed by a unique UUID reference.
 */
export class IndexDbFileSystem extends FileSystem {
    private static readonly ROOT_DIRECTORY_REFERENCE: string = 'b2b479cb-587d-4815-a39e-906565b58344';

    private readonly mDatabase: WebDatabase<typeof IndexDbFileSystemItem>;

    /**
     * Constructor.
     *
     * @param pScope - Database scope name. Used as the IndexedDB database name.
     */
    public constructor(pScope: string) {
        super(IndexDbFileSystem.ROOT_DIRECTORY_REFERENCE);
        this.mDatabase = new WebDatabase(pScope, [IndexDbFileSystemItem]);
    }

    /**
     * Close the underlying database connection.
     */
    public close(): void {
        this.mDatabase.close();
    }

    /**
     * Delete a file system item by reference. Updates the parent directory's children mapping.
     *
     * @param pParentReference - The reference of the parent directory.
     * @param pReference - The reference of the item to delete.
     *
     * @returns `true` if the item was deleted, `false` if it did not exist.
     */
    protected override async deleteReference(pParentReference: string, pReference: string): Promise<boolean> {
        // Open a read-write transaction to delete the item and update the parent directory's children mapping.
        return this.mDatabase.transaction([IndexDbFileSystemItem], 'readwrite', async (pTransaction) => {
            // Find the item entry.
            const lRemovedItem: IndexDbFileSystemItem | undefined = (await pTransaction.table(IndexDbFileSystemItem).where('reference').is(pReference).read()).at(0);
            if (!lRemovedItem) {
                return false;
            }

            // Update parent directory's children mapping.
            const lDirectoryItem: IndexDbFileSystemItem | undefined = (await pTransaction.table(IndexDbFileSystemItem).where('reference').is(pParentReference).read()).at(0);
            if (lDirectoryItem) {
                // Parse the directory's children mapping, delete the entry.
                const lParentData: IndexDbFileSystemItemDirectoryData = lDirectoryItem.data as IndexDbFileSystemItemDirectoryData;
                delete lParentData[lRemovedItem.name];

                // Write updated directory entry back to the database.
                await pTransaction.table(IndexDbFileSystemItem).put(lDirectoryItem);
            }

            // Delete the item entry.
            await pTransaction.table(IndexDbFileSystemItem).delete(lRemovedItem);

            return true;
        });
    }

    /**
     * Read the immediate children of a directory from the IndexedDB backend.
     *
     * @param pReference - The reference of the directory to list.
     *
     * @returns array of directory entries, or an empty array when the directory is empty or not found.
     */
    protected override async readDirectoryItems(pReference: string): Promise<Array<FileSystemDirectoryEntry>> {
        // Open a read-only transaction to get the directory entry by reference.
        return this.mDatabase.transaction([IndexDbFileSystemItem], 'readonly', async (pTransaction) => {
            // Read the directory entry.
            const lDirectoryItem: IndexDbFileSystemItem | undefined = (await pTransaction.table(IndexDbFileSystemItem).where('reference').is(pReference).read()).at(0);
            if (!lDirectoryItem) {
                return [];
            }

            const lDirectoryData: IndexDbFileSystemItemDirectoryData = lDirectoryItem.data as IndexDbFileSystemItemDirectoryData;

            // For each child, read its entry to get type and class identifier.
            const lResult: Array<FileSystemDirectoryEntry> = [];
            for (const lChildReference of Object.values(lDirectoryData)) {
                // Get child item reference.
                const lChildItem: IndexDbFileSystemItem | undefined = (await pTransaction.table(IndexDbFileSystemItem).where('reference').is(lChildReference).read()).at(0);
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
                    reference: lChildReference,
                    classIdentifier: lClassIdentifier,
                });
            }

            return lResult;
        });
    }

    /**
     * Read a file blob from the IndexedDB backend.
     *
     * @param pFileReference - The reference of the file to read.
     *
     * @returns the file's Blob data.
     */
    protected override async readFile(pFileReference: string): Promise<Blob> {
        // Open a read-only transaction to get the file entry by reference, then return its blob data.
        return this.mDatabase.transaction([IndexDbFileSystemItem], 'readonly', async (pTransaction) => {
            // Read the file entry.
            const lFileItem: IndexDbFileSystemItem | undefined = (await pTransaction.table(IndexDbFileSystemItem).where('reference').is(pFileReference).read()).at(0);
            if (!lFileItem) {
                throw new Exception(`File not found in IndexedDB: ${pFileReference}`, this);
            }

            // Return the blob data.
            return (lFileItem.data as IndexDbFileSystemItemFileData).data;
        });
    }

    /**
     * Store a file blob in the IndexedDB backend. Updates the parent directory's children mapping.
     *
     * @param pParentReference - The reference of the parent directory.
     * @param pFileName - The name of the file within the parent directory.
     * @param _pFileClass - The class constructor of the stored object.
     * @param pFile - The file's Blob data.
     *
     * @returns the generated UUID reference for the stored file.
     */
    protected override async storeFile(pParentReference: string, pFileName: string, pFileClassIdentifier: string, pFile: Blob): Promise<string> {
        // Create a unique reference for the new file entry.
        const lFileReference: string = crypto.randomUUID();

        // Create the file entry.
        const lFileItem: IndexDbFileSystemItem = new IndexDbFileSystemItem();
        lFileItem.itemType = FileSystemFileType.File;
        lFileItem.name = pFileName;
        lFileItem.reference = lFileReference;
        lFileItem.data = {
            classIdentifier: pFileClassIdentifier,
            data: pFile,
        };

        return this.mDatabase.transaction([IndexDbFileSystemItem], 'readwrite', async (pTransaction) => {
            // Store the file entry in the database.
            await pTransaction.table(IndexDbFileSystemItem).put(lFileItem);

            // Try to read the parent directory entry.
            const lParentDirectoryItem: IndexDbFileSystemItem | undefined = (await pTransaction.table(IndexDbFileSystemItem).where('reference').is(pParentReference).read()).at(0);
            if (!lParentDirectoryItem) {
                throw new Exception(`Parent directory entry not found for reference: ${pParentReference}`, this);
            }

            // Update its children mapping.
            const lParentData: IndexDbFileSystemItemDirectoryData = lParentDirectoryItem.data as IndexDbFileSystemItemDirectoryData;
            lParentData[pFileName] = lFileReference;

            // Store the updated parent entry back to the database.
            await pTransaction.table(IndexDbFileSystemItem).put(lParentDirectoryItem);

            return lFileReference;
        });
    }

    /**
     * Create a directory in the IndexedDB backend. Updates the parent directory's children mapping.
     *
     * @param pParentReference - The reference of the parent directory.
     * @param pDirectoryName - The name of the new directory.
     *
     * @returns the generated UUID reference for the new directory.
     */
    protected override async storeDirectory(pParentReference: string, pDirectoryName: string): Promise<string> {
        // Create a unique reference for the new directory entry.
        const lDirReference: string = crypto.randomUUID();

        // Create the directory entry with empty children.
        const lDirectoryItem: IndexDbFileSystemItem = new IndexDbFileSystemItem();
        lDirectoryItem.itemType = FileSystemFileType.Directory;
        lDirectoryItem.name = pDirectoryName;
        lDirectoryItem.reference = lDirReference;
        lDirectoryItem.data = {};

        return this.mDatabase.transaction([IndexDbFileSystemItem], 'readwrite', async (pTransaction) => {
            // Store the directory entry in the database.
            await pTransaction.table(IndexDbFileSystemItem).put(lDirectoryItem);

            // Try to read the parent directory entry.
            const lParentDirectoryItem: IndexDbFileSystemItem | undefined = (await pTransaction.table(IndexDbFileSystemItem).where('reference').is(pParentReference).read()).at(0);
            if (!lParentDirectoryItem) {
                throw new Exception(`Parent directory entry not found for reference: ${pParentReference}`, this);
            }

            // Update its children mapping.
            const lParentData: IndexDbFileSystemItemDirectoryData = lParentDirectoryItem.data as IndexDbFileSystemItemDirectoryData;
            lParentData[pDirectoryName] = lDirReference;

            // Store the updated parent entry back to the database.
            await pTransaction.table(IndexDbFileSystemItem).put(lParentDirectoryItem);

            return lDirReference;
        });
    }
}
