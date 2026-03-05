import { WebDatabase } from '@kartoffelgames/web-database';
import { FileSystemFileType } from "../file-system.ts";

/**
 * Internal database table for storing serialized file entries.
 * Each entry maps a file reference to serialized binary data.
 */
@WebDatabase.table('files')
export class IndexDbFileSystemItem {
    /**
     * The binary data of the file.
     */
    @WebDatabase.field()
    public data!: IndexDbFileSystemItemData;

    /**
     * Type of the file system item (file or directory).
     */
    @WebDatabase.field()
    public itemType!: FileSystemFileType;

    /**
     * Unique reference for this file entry, used as the primary key. Can be a UUID or any unique string.
     */
    @WebDatabase.field({ as: { identity: 'manual' } })
    public reference!: string;
}

export type IndexDbFileSystemItemFileData = {
    classIdentifier: string;
    data: Blob;
};

export type IndexDbFileSystemItemDirectoryData = {
    /**
     * Name of directory entries mapped to their references.
     * The reference can be a file or directory reference.
     */
    [name: string]: string;
};

export type IndexDbFileSystemItemData = IndexDbFileSystemItemFileData | IndexDbFileSystemItemDirectoryData;