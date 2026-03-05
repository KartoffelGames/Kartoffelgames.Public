import { BlobSerializer } from "@kartoffelgames/core-serializer";
import { FileSystem, FileSystemFileType, type FileSystemDirectoryEntry } from '../file-system.ts';

/**
 * File system implementation backed by the File System Access API.
 * Stores blobs as `.bin` files in real directories mirroring the logical path structure.
 * Each directory has a companion `_directory.meta` JSON file mapping file names to class identifiers.
 *
 * References are path strings relative to the root directory handle.
 */
export class FileApiFileSystem extends FileSystem {
    private static readonly BIN_EXTENSION: string = '.bin';
    private static readonly DIRECTORY_META_FILE: string = '_directory.meta';

    private readonly mRootDirectoryHandle: FileSystemDirectoryHandle;

    /**
     * Constructor.
     *
     * @param pDirectoryHandle - Handle to the root directory used for storage.
     */
    public constructor(pDirectoryHandle: FileSystemDirectoryHandle) {
        super('');
        this.mRootDirectoryHandle = pDirectoryHandle;
    }

    /**
     * Delete a file system item by reference. Updates the parent directory's native mapping.
     *
     * @param pParentReference - The reference (path) of the parent directory.
     * @param pName - The name of the item within the parent directory.
     * @param _pReference - The reference of the item to delete (unused — parent + name is sufficient for FileApi).
     *
     * @returns `true` if the item was deleted, `false` if it did not exist.
     */
    protected override async deleteReference(pParentReference: string, pReference: string): Promise<boolean> {
        // Find last segment to separate directory path from file name.
        const lLastIndexOfSeperator = pReference.lastIndexOf('/');
        const lItemName = pReference.substring(lLastIndexOfSeperator + 1);

        const lParentHandle: FileSystemDirectoryHandle = await this.getDirectoryHandle(pParentReference);

        // Remove file or directory entry from native storage.
        try {
            await lParentHandle.removeEntry(lItemName);
        } catch {
            // If removal fails, the item likely doesn't exist. Return false to indicate nothing was deleted.
            return false;
        }

        // Update meta file to remove the potential file entry.
        const lMeta: FileApiFileSystemMeta = await this.readDirectoryMeta(lParentHandle);
        delete lMeta[lItemName];
        await this.writeDirectoryMeta(lParentHandle, lMeta);

        return true;
    }

    /**
     * Read the immediate children of a directory from the File System Access API backend.
     *
     * @param pReference - The reference (path) of the directory to list.
     *
     * @returns array of directory entries, or an empty array when the directory is empty or not found.
     */
    protected override async readDirectoryItems(pReference: string): Promise<Array<FileSystemDirectoryEntry>> {
        // Read the directory handle for the given reference.
        const lDirectoryHandle: FileSystemDirectoryHandle = await this.getDirectoryHandle(pReference);

        // Read directory metadata to get class identifiers.
        const lDirectoryMeta: FileApiFileSystemMeta = await this.readDirectoryMeta(lDirectoryHandle);
        let lDirectoryMetaUpdated: boolean = false;

        // Create parent path
        const lParentPath: string = pReference === '' ? '' : `${pReference}/`;

        // Iterate over directory entries and construct the result array.
        const lResult: Array<FileSystemDirectoryEntry> = [];
        for await (const [lEntryName, lEntryHandle] of lDirectoryHandle.entries()) {
            // Check if entry is a directory.
            if (lEntryHandle.kind === 'directory') {
                // Add directory entry to result.
                lResult.push({
                    name: lEntryName,
                    type: FileSystemFileType.Directory,
                    reference: `${lParentPath}${lEntryName}`,
                    classIdentifier: null,
                });

                continue;
            }

            // Ignore files that don't end with .bin, as they are not part of the logical file system (like _directory.meta).
            if (!lEntryName.endsWith(FileApiFileSystem.BIN_EXTENSION)) {
                continue;
            }

            // Ignore anything that is not a file. For maybe future-proofing in case the API adds new kinds.
            if (lEntryHandle.kind !== 'file') {
                continue;
            }

            // Get Class identifier. Can be null if meta is corrupted or missing.
            let lClassIdentifier: string | undefined = lDirectoryMeta[lEntryName];
            if (!lClassIdentifier) {
                // "Parse" handle into a file handle.
                const lFileSystemFileHandle: FileSystemFileHandle = lEntryHandle as FileSystemFileHandle;

                // Reconstruct class identifier by reading the file and checking for a valid header.
                const lClassFile: File = await lFileSystemFileHandle.getFile();

                // Create a blob serializer to read the header of the file and extract the class identifier.
                const lBlobSerializer: BlobSerializer = new BlobSerializer();
                lBlobSerializer.load(lClassFile);

                // Should have at least one content.
                if (lBlobSerializer.contents.length === 0) {
                    continue;
                }

                // Read the first contents class identifier.
                lClassIdentifier = FileSystem.identifierOfClass(lBlobSerializer.contents.at(0)!.classType);
            }

            lResult.push({
                // Strip the .bin extension from the file name to get the logical file name.
                name: lEntryName.slice(0, -FileApiFileSystem.BIN_EXTENSION.length),
                type: FileSystemFileType.File,
                reference: `${lParentPath}${lEntryName}`,
                classIdentifier: lClassIdentifier,
            });
        }

        // Update directory meta if we found entries that were missing from it, to avoid expensive header reads in the future.
        if (lDirectoryMetaUpdated) {
            await this.writeDirectoryMeta(lDirectoryHandle, lDirectoryMeta);
        }

        return lResult;
    }

    /**
     * Read a file blob from the File System Access API backend.
     *
     * @param pFileReference - The reference (path) of the file to read.
     *
     * @returns the file's Blob data.
     */
    protected override async readFile(pFileReference: string): Promise<Blob> {
        // Find last segment to separate directory path from file name.
        const lLastIndexOfSeperator = pFileReference.lastIndexOf('/');
        const lDirectoryPath = pFileReference.substring(0, lLastIndexOfSeperator);
        const lFileName = pFileReference.substring(lLastIndexOfSeperator + 1);

        // Navigate to the parent directory.
        const lDirectory: FileSystemDirectoryHandle = await this.getDirectoryHandle(lDirectoryPath);

        // Read the .bin file for the blob data.
        const lFileHandle: FileSystemFileHandle = await lDirectory.getFileHandle(lFileName);

        // Read the actual binary data from the file handle and return it.
        return lFileHandle.getFile();
    }

    /**
     * Store a file blob in the File System Access API backend. Updates the parent directory's meta file.
     *
     * @param pParentReference - The reference (path) of the parent directory.
     * @param pFileName - The name of the file within the parent directory.
     * @param pFileClassIdentifier - The class identifier of the stored object.
     * @param pFile - The file's Blob data.
     *
     * @returns the reference (path) for the stored file.
     */
    protected override async storeFile(pParentReference: string, pFileName: string, pFileClassIdentifier: string, pFile: Blob): Promise<string> {
        // Navigate/create real subdirectories.
        const lDirectory: FileSystemDirectoryHandle = await this.getDirectoryHandle(pParentReference);

        // Create native filename by appending .bin extension to the logical filename.
        const lNativeFileName: string = `${pFileName}${FileApiFileSystem.BIN_EXTENSION}`;

        // Write the blob as <fileName>.bin.
        const lFileHandle: FileSystemFileHandle = await lDirectory.getFileHandle(lNativeFileName, { create: true });
        const lFileWriter: FileSystemWritableFileStream = await lFileHandle.createWritable();
        await lFileWriter.write(pFile);
        await lFileWriter.close();

        // Read existing metadata for the directory to update it with the new file's class UUID.
        const lMetaFileJson: FileApiFileSystemMeta = await this.readDirectoryMeta(lDirectory);

        // Update the metadata json with the new file's class UUID and write it back to the .meta file.
        lMetaFileJson[lNativeFileName] = pFileClassIdentifier;

        // Write updated metadata back to the .meta file.
        await this.writeDirectoryMeta(lDirectory, lMetaFileJson);

        // Return the logical file reference (path) for the stored file.
        return pParentReference === '' ? lNativeFileName : `${pParentReference}/${lNativeFileName}`;
    }

    /**
     * Create a directory in the File System Access API backend.
     *
     * @param pParentReference - The reference (path) of the parent directory.
     * @param pDirectoryName - The name of the new directory.
     *
     * @returns the reference (path) for the new directory.
     */
    protected override async storeDirectory(pParentReference: string, pDirectoryName: string): Promise<string> {
        // Create the actual directory path.
        const lDirectoryPath: string = pParentReference === '' ? pDirectoryName : `${pParentReference}/${pDirectoryName}`;

        // Get the directory handle of the new directory.
        // This will create it.
        await this.getDirectoryHandle(lDirectoryPath);

        return lDirectoryPath;
    }

    /**
     * Get a directory handle for the given reference path, navigating from the root handle.
     *
     * @param pReference - The reference path to navigate to. Empty string returns the root handle.
     *
     * @returns the directory handle at the given path.
     */
    private async getDirectoryHandle(pReference: string): Promise<FileSystemDirectoryHandle> {
        // Return root handle if reference is empty.
        if (pReference === '') {
            return this.mRootDirectoryHandle;
        }

        // Split reference into path segments.
        const lSegments: Array<string> = pReference.split('/');

        // Iteratively navigate through the directory segments to get the target handle.
        let lHandle: FileSystemDirectoryHandle = this.mRootDirectoryHandle;
        for (const lSegment of lSegments) {
            lHandle = await lHandle.getDirectoryHandle(lSegment, { create: true });
        }

        return lHandle;
    }

    /**
     * Read a directory's `_directory.meta` JSON file.
     *
     * @param pDirectoryHandle - The directory handle to read meta from.
     *
     * @returns the parsed meta object mapping file names to class identifiers, or an empty object if missing/corrupt.
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
     * Write a directory's `_directory.meta` JSON file.
     *
     * @param pDirectoryHandle - The directory handle to write meta to.
     * @param pMeta - The meta object to serialize and write.
     */
    private async writeDirectoryMeta(pDirectoryHandle: FileSystemDirectoryHandle, pMeta: FileApiFileSystemMeta): Promise<void> {
        // Get the meta file from native storage.
        const lMetaHandle: FileSystemFileHandle = await pDirectoryHandle.getFileHandle(FileApiFileSystem.DIRECTORY_META_FILE, { create: true });

        // Write serialized metadata to the meta file.
        const lWritable: FileSystemWritableFileStream = await lMetaHandle.createWritable();
        await lWritable.write(JSON.stringify(pMeta));
        await lWritable.close();
    }
}

type FileApiFileSystemMeta = Record<string, string>;
