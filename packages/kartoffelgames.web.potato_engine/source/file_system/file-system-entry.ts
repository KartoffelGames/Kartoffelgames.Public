import { WebDatabase } from '@kartoffelgames/web-database';

/**
 * Internal database table for storing serialized file entries.
 * Each entry maps a lowercase-normalized path to serialized binary data.
 */
@WebDatabase.table('files')
export class FileSystemEntry {
    @WebDatabase.field()
    public data!: Blob;

    @WebDatabase.field({ as: { identity: 'manual' } })
    public filePath!: string;
}
