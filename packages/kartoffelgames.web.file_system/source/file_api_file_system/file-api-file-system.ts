import { IVoidParameterConstructor } from "@kartoffelgames/core";
import { FileSystem, FileSystemFileType, type FileSystemDirectory, type FileSystemDirectoryEntry } from '../file-system.ts';

/**
 * File system implementation backed by the File System Access API.
 * Stores blobs as `.bin` files in real directories mirroring the logical path structure.
 * Each `.bin` file has a companion `.meta` sidecar file containing the class UUID.
 */
export class FileApiFileSystem extends FileSystem {
    private static readonly BIN_EXTENSION: string = '.bin';
    private static readonly DIRECTORY_META_FILE: string = '_directory.meta';

    private readonly mDirectoryHandle: FileSystemDirectoryHandle;

    /**
     * Constructor.
     *
     * @param pDirectoryHandle - Handle to the root directory used for storage.
     */
    public constructor(pDirectoryHandle: FileSystemDirectoryHandle) {
        super();
        this.mDirectoryHandle = pDirectoryHandle;
    }

    /**
     * Delete a file from the storage backend.
     * 
     * @param pFileReference - The file reference to delete, which is the logical path used when storing.
     * 
     * @returns `true` if the file was deleted, `false` if it did not exist.
     */
    protected override async deleteFile(pFileReference: string): Promise<boolean> {
        try {
            // Find last segment to separate directory path from file name.
            const lLastIndexOfSeperator = pFileReference.lastIndexOf('/');
            const lDirectoryPath = pFileReference.substring(0, lLastIndexOfSeperator);
            const lFileName = pFileReference.substring(lLastIndexOfSeperator + 1);

            // Navigate to the parent directory.
            const lDirectory: FileSystemDirectoryHandle = await this.getDirectoryHandle(lDirectoryPath);

            // Remove the .bin.
            await lDirectory.removeEntry(`${lFileName}${FileApiFileSystem.BIN_EXTENSION}`);

            // Ignore meta file, as the empty reference does nothing harmful.

            return true;
        } catch {
            return false;
        }
    }

    /**
     * Load the full directory tree from the storage backend. Called once lazily on the first public method invocation.
     *
     * @returns - the stored directory tree, or an empty tree if none exists.
     */
    protected override async readDirectoryTree(): Promise<FileSystemDirectory> {
        return this.scanDirectory(this.mDirectoryHandle, '');
    }

    /**
     * Read a file's blob data from storage.
     *
     * @param pFileReference - The file reference to read, which is the logical path used when storing.
     */
    protected override async readFile(pFileReference: string): Promise<Blob> {
        // Find last segment to separate directory path from file name.
        const lLastIndexOfSeperator = pFileReference.lastIndexOf('/');
        const lDirectoryPath = pFileReference.substring(0, lLastIndexOfSeperator);
        const lFileName = pFileReference.substring(lLastIndexOfSeperator + 1);

        // Navigate to the parent directory.
        const lDirectory: FileSystemDirectoryHandle = await this.getDirectoryHandle(lDirectoryPath);

        // Read the .bin file for the blob data.
        const lFileHandle: FileSystemFileHandle = await lDirectory.getFileHandle(`${lFileName}.bin`);

        // Read the actual binary data from the file handle and return it.
        return lFileHandle.getFile();
    }

    /**
     * Store a file blob in the storage backend.
     * 
     * @param pFilePath - The logical file path to store under. Should be unique and consistent for the same logical file.
     * @param pFile - The file's blob data to store.
     * @param pClassUuid - The class UUID to store in the companion metadata file.
     * 
     * @returns The file reference to use for future access, which is the same as the logical path.
     */
    protected override async storeFile(pFilePath: string, pFileClass: IVoidParameterConstructor<object>, pFile: Blob): Promise<string> {
        // Find last segment to separate directory path from file name.
        const lLastIndexOfSeperator = pFilePath.lastIndexOf('/');
        const lDirectoryPath = pFilePath.substring(0, lLastIndexOfSeperator);
        const lFileName = pFilePath.substring(lLastIndexOfSeperator + 1);

        // Navigate/create real subdirectories.
        const lDirectory: FileSystemDirectoryHandle = await this.getDirectoryHandle(lDirectoryPath);

        // Write the blob as <fileName>.bin.
        const lBinHandle: FileSystemFileHandle = await lDirectory.getFileHandle(`${lFileName}.bin`, { create: true });
        const lBinWritable: FileSystemWritableFileStream = await lBinHandle.createWritable();
        await lBinWritable.write(pFile);
        await lBinWritable.close();

        // Read existing metadata for the directory to update it with the new file's class UUID.
        const lMetaFileJson: FileApiFileSystemMeta = await this.readDirectoryMeta(lDirectory);

        // Update the metadata json with the new file's class UUID and write it back to the .meta file.
        lMetaFileJson[lFileName] = FileSystem.identifierOfClass(pFileClass);

        // Write updated metadata back to the .meta file.
        const lMetaFileHandle: FileSystemFileHandle = await lDirectory.getFileHandle(FileApiFileSystem.DIRECTORY_META_FILE, { create: true });
        const lMetaWritable: FileSystemWritableFileStream = await lMetaFileHandle.createWritable();
        await lMetaWritable.write(JSON.stringify(lMetaFileJson));
        await lMetaWritable.close();

        return pFilePath;
    }

    /**
     * Get a directory handle for the given logical path, creating directories along the way if necessary.
     *
     * @param pPath - The logical path to navigate to.
     *
     * @returns the directory handle for the given path.
     */
    private async getDirectoryHandle(pPath: string): Promise<FileSystemDirectoryHandle> {
        const lPathSegments: Array<string> = pPath.split('/');

        // Navigate to the parent directory.
        let lDirectory: FileSystemDirectoryHandle = this.mDirectoryHandle;
        for (const lSegment of lPathSegments) {
            lDirectory = await lDirectory.getDirectoryHandle(lSegment, { create: true });
        }

        return lDirectory;
    }

    /**
     * Read the directory's metadata file and parse it into an object mapping file names to class UUIDs.
     *
     * @param pDirectoryHandle - The directory handle to read the metadata for.
     *
     * @returns the parsed metadata object, or an empty object if no metadata exists or parsing fails.
     */
    private async readDirectoryMeta(pDirectoryHandle: FileSystemDirectoryHandle): Promise<FileApiFileSystemMeta> {
        // Read current metadata and try to parse its json content.
        const lMetaFileHandle: FileSystemFileHandle = await pDirectoryHandle.getFileHandle(FileApiFileSystem.DIRECTORY_META_FILE, { create: true });
        const lMetaFile: File = await lMetaFileHandle.getFile();
        const lMetaFileText: string = await lMetaFile.text();

        // Deserialize metadata, or return empty object if it doesn't exist or fails to parse.
        // We don't want to block saving just because the metadata is corrupted.
        return (() => {
            if (!lMetaFileText) {
                return {};
            }

            try {
                return JSON.parse(lMetaFileText) as { [FileName: string]: string; };
            } catch {
                // If parsing fails, overwrite with a new object to avoid blocking the save.
                return {};
            }
        })();
    }

    /**
     * Recursively scan a directory handle and build a {@link FileSystemDirectory} tree.
     *
     * @param pHandle - The directory handle to scan.
     * @param pPath - Current path that led to this directory. Can be empty.
     *
     * @returns the directory tree for this level.
     */
    private async scanDirectory(pHandle: FileSystemDirectoryHandle, pPath: string): Promise<FileSystemDirectory> {
        const lTree: FileSystemDirectory = { files: {} };

        // Read and deserialize the directory's metadata file to get class identifier for contained files.
        const lMetaFileJson: FileApiFileSystemMeta = await this.readDirectoryMeta(pHandle);

        for await (const [lFileSystemEntryName, lFileSystemHandle] of pHandle.entries()) {
            if (lFileSystemHandle.kind === 'directory') {
                // "Parse" handle into a directory handle.
                const lDirectoryHandle: FileSystemDirectoryHandle = lFileSystemHandle as FileSystemDirectoryHandle;

                // Recurse into subdirectory.
                const lDirectoryPath: string = pPath === '' ? lFileSystemEntryName : `${pPath}/${lFileSystemEntryName}`;

                // Recursive save result as a dictionary entry.
                lTree.files[lFileSystemEntryName] = {
                    type: FileSystemFileType.Directory,
                    data: await this.scanDirectory(lDirectoryHandle, lDirectoryPath)
                };
            } else if (lFileSystemHandle.kind === 'file' && lFileSystemEntryName.endsWith(FileApiFileSystem.BIN_EXTENSION)) {
                // File entry — strip .bin extension to get the logical name.
                const lFileName: string = lFileSystemEntryName.slice(0, -FileApiFileSystem.BIN_EXTENSION.length);
                const lFullPath: string = pPath === '' ? lFileName : `${pPath}/${lFileName}`;

                // Read companion .meta file for class UUID.
                const lClassIdentifier: string | undefined = lMetaFileJson[lFileName];
                if (!lClassIdentifier) {
                    // No class identifier, skip this file as it's likely a stray .bin without metadata.
                    continue;
                }

                // Save file entry with reference to the logical path and the class identifier from metadata.
                lTree.files[lFileName] = {
                    type: FileSystemFileType.File,
                    data: { reference: lFullPath, classIdentifier: lClassIdentifier }
                };
            }
        }

        return lTree;
    }
}

type FileApiFileSystemMeta = Record<string, string>;