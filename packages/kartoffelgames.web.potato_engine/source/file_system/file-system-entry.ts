import { WebDatabase } from '@kartoffelgames/web-database';

/**
 * Internal database table for storing serialized file entries.
 * Each entry maps a lowercase-normalized path to serialized binary data.
 *
 * Data is stored as ArrayBuffer because Deno's structuredClone does not
 * support Blob, which breaks IndexedDB round-tripping via fake-indexeddb.
 */
@WebDatabase.table('files')
export class FileSystemEntry {
    @WebDatabase.field()
    public data!: ArrayBuffer; // TODO: When Deno supports Blob in structuredClone, switch to Blob for more efficient storage and retrieval.

    @WebDatabase.field({ as: { identity: 'manual' } })
    public filePath!: string;
}
