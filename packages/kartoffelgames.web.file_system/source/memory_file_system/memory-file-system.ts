import { IVoidParameterConstructor } from "@kartoffelgames/core";
import { FileSystem, type FileSystemDirectory } from '../file-system.ts';

/**
 * In-memory file system implementation.
 * All data is temporary and lost when the instance is garbage collected.
 */
export class MemoryFileSystem extends FileSystem {
    private readonly mBlobStorage: Map<string, Blob>;

    /**
     * Constructor.
     */
    public constructor() {
        super();
        this.mBlobStorage = new Map();
    }

    /**
     * Delete file from memory storage.
     * 
     * @param pFileReference - File reference of file to delete.
     * 
     * @returns `true` if the file was deleted, `false` if it did not exist.
     */
    protected override async deleteFile(pFileReference: string): Promise<boolean> {
        return this.mBlobStorage.delete(pFileReference);
    }

    /**
     * Read the directory tree.
     */
    protected override async readDirectoryTree(): Promise<FileSystemDirectory> {
        // Memory file system is always empty on creation.
        return { files: {} };
    }

    /**
     * Read file from memory storage.
     * 
     * @param pFileReference - File reference of file to read.
     * 
     * @returns The file's Blob data.
     */
    protected override async readFile(pFileReference: string): Promise<Blob> {
        return this.mBlobStorage.get(pFileReference)!;
    }

    /**
     * Store a file in memory storage under the given path.
     * 
     * @param pPath - The normalized path to store the file under. Should be unique and consistent for the same logical file.
     * @param _pFileClass - The class constructor of the file's type.
     * @param pFile - The file's Blob data to store.
     * 
     * @returns The file reference to use for future access,. 
     */
    protected override async storeFile(pPath: string, _pFileClass: IVoidParameterConstructor<object>, pFile: Blob): Promise<string> {
        // Use the normalized path as the reference.
        this.mBlobStorage.set(pPath, pFile);

        return pPath;
    }
}
