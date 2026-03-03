import { WebDatabase } from '@kartoffelgames/web-database';

/**
 * Internal database table for mapping read paths to their file and sub-path.
 * Each entry maps a case-insensitive read path to its (filePath, subPath) pair.
 */
@WebDatabase.table('file-paths')
export class IndexDbFileSystemPath {
    @WebDatabase.field({ as: { index: {} } })
    public filePath!: string;

    @WebDatabase.field({ as: { identity: 'manual' } })
    public readPath!: string;

    @WebDatabase.field()
    public subPath!: string;
}
