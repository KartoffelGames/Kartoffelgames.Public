import { WebDatabase } from '@kartoffelgames/web-database';
import { FileSystemFileType } from "../file-system.ts";

/**
 * Internal database table for storing file system entries.
 * Each entry maps a unique reference to either file data (blob + class identifier)
 * or directory data (children name-to-reference mapping).
 */
@WebDatabase.table('files')
export class IndexDbFileSystemItem {
    /**
     * The binary data of the entry.
     * For files: contains classIdentifier and blob data.
     * For directories: contains a name-to-reference mapping of children.
     */
    @WebDatabase.field()
    public data!: IndexDbFileSystemItemData;

    /**
     * Type of the file system item (file or directory).
     */
    @WebDatabase.field()
    public itemType!: FileSystemFileType;

    /**
     * The display name of this entry within its parent directory.
     */
    @WebDatabase.field()
    public name!: string;

    /**
     * Unique reference for this entry, used as the primary key. Can be a UUID or any unique string.
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
