import { WebDatabase } from '@kartoffelgames/web-database';
import { FileSystem, type FileSystemDirectory, type FileSystemDirectoryEntry } from '../file-system.ts';
import { IndexDbFileSystemItem } from "./index-db-file-system-item.ts";


/**
 * IndexedDB-backed file system implementation.
 * Stores blobs in a key-value table (referenced by UUID) and the directory tree
 * in a separate table where each root-level entry has its own row.
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
        super();
        this.mDatabase = new WebDatabase(pScope, [IndexDbFileSystemItem]);
    }

    /**
     * Close the underlying database connection.
     */
    public close(): void {
        this.mDatabase.close();
    }

    /**
     * Delete a file from the storage backend.
     * 
     * @param pFileReference - The file reference of the file to delete.
     * 
     * @returns `true` if the file was deleted, `false` if it did not exist.
     */
    protected override async deleteFile(pFileReference: string): Promise<boolean> {
        // Open database transaction to delete the file entry with the given reference.
        return this.mDatabase.transaction([IndexDbFileSystemItem], 'readwrite', async (pTransaction) => {
            // Find the file entry with the given reference.
            const lFileEntries: Array<IndexDbFileSystemFile> = await pTransaction.table(IndexDbFileSystemFile).where('reference').is(pFileReference).read();
            if (lFileEntries.length === 0) {
                return false;
            }

            // Remove the file entry from the database.
            await pTransaction.table(IndexDbFileSystemFile).delete(lFileEntries[0]);

            // Directory item can be left dangling.

            return true;
        });
    }

    /**
     * @inheritdoc
     */
    protected override async readDirectoryTree(): Promise<FileSystemDirectory> {
        const lRows: Array<IndexDbFileSystemDirectory> = await this.mDatabase.transaction([IndexDbFileSystemDirectory], 'readonly', async (pTransaction) => {
            return pTransaction.table(IndexDbFileSystemDirectory).getAll();
        });

        // Reconstruct the root directory tree from stored rows.
        const lTree: FileSystemDirectory = { files: {} };
        for (const lRow of lRows) {
            lTree.files[lRow.name] = JSON.parse(lRow.data) as FileSystemDirectoryEntry;
        }

        return lTree;
    }

    /**
     * Read a file blob from the storage backend.
     * 
     * @param pFileReference - The file reference of the file to read.
     * 
     * @returns The file's Blob data.
     */
    protected override async readFile(pFileReference: string): Promise<Blob> {
        // Open database as readonly.
        return this.mDatabase.transaction([IndexDbFileSystemFile], 'readonly', async (pTransaction) => {
            // Read all file entries with the given reference.
            const lFileEntries: Array<IndexDbFileSystemFile> = await pTransaction.table(IndexDbFileSystemFile).where('reference').is(pFileReference).read();
            if (lFileEntries.length === 0) {
                throw new Error(`File not found in IndexedDB: ${pFileReference}`);
            }

            return lFileEntries[0].data;
        });
    }

    /**
     * Store a file blob in the storage backend.
     * 
     * @param pPath - The file path where the file should be stored.
     * @param pFileClass - The class constructor associated with the file.
     * @param pFile - The file's Blob data.
     * @param _pClassUuid - The class UUID associated with the file.
     * 
     * @returns The file reference of the stored file.
     */
    protected override async storeFile(pPath: string, pFileClass: IVoidParameterConstructor<object>, pFile: Blob): Promise<string> {

        // Open the databse file and directory tables as readwrite to store the new file and update the directory tree if needed.
        return await this.mDatabase.transaction([IndexDbFileSystemFile, IndexDbFileSystemDirectory], 'readwrite', async (pTransaction) => {
            // Create a unique file reference (UUID) for the new file entry.
            const lFileReference: string = crypto.randomUUID();

            // Create a new file entry.
            const lFileEntry: IndexDbFileSystemFile = new IndexDbFileSystemFile();
            lFileEntry.classIdentifier = FileSystem.identifierOfClass(pFileClass);
            lFileEntry.reference = lFileReference;
            lFileEntry.data = pFile;
            await pTransaction.table(IndexDbFileSystemFile).put(lFileEntry);

            // Split path into segments and update the directory tree accordingly.
            const lPathSegments: Array<string> = pPath.split('/').filter((pSegment) => pSegment.length > 0);

            // Iterate through path segments to find the correct directory to store the file reference in.
            let lCurrentDirectory: IndexDbFileSystemDirectory| undefined = (await pTransaction.table(IndexDbFileSystemDirectory).where('reference').is(IndexDbFileSystem.ROOT_DIRECTORY_REFERENCE).read())[0];
            do{
                // Validate that the current directory exists.
                if (!lCurrentDirectory) {
                    throw new Error('Invalid file path: ' + pPath);
                }

                const lNextSegment: string | undefined = lPathSegments.shift();
                if (!lNextSegment) {
                    throw new Error('Invalid file path: ' + pPath);
                }


            } while (lPathSegments.length > 1);


            return lFileReference;
        });
    }
}
