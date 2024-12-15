import { Dictionary, Exception } from '@kartoffelgames/core';
import { TableLayoutConfig, TableLayoutConfigIndex, TableType, WebDatabaseTableLayout } from './layout/web-database-table-layout';
import { WebDatabaseTransaction, WebDbTransactionMode } from './web-database-transaction';

export class WebDatabase {
    private static readonly ANONYMOUS_IDENTITIY_KEY: string = '__id__';

    private mDatabaseConnection: IDBDatabase | null;
    private readonly mDatabaseName: string;
    private readonly mTableLayouts: WebDatabaseTableLayout;
    private readonly mTableTypes: Dictionary<string, TableType>;

    /**
     * Constructor.
     * 
     * @param pName - Database name.
     * @param pTables - Database tables.
     */
    public constructor(pName: string, pTables: Array<TableType>) {
        this.mDatabaseName = pName;
        this.mDatabaseConnection = null;
        this.mTableLayouts = new WebDatabaseTableLayout();

        this.mTableTypes = new Dictionary<string, TableType>();
        for (const lTableType of pTables) {
            this.mTableTypes.set(lTableType.name, lTableType);
        }
    }

    /**
     * Close current database connections.
     */
    public close(): void {
        // Skip when it is already closed.
        if (this.mDatabaseConnection === null) {
            return;
        }

        // Close and clear database connection.
        this.mDatabaseConnection.close();
        this.mDatabaseConnection = null;
    }

    /**
     * Delete database and resolve on success.
     */
    public async delete(): Promise<void> {
        const lDeleteRequest: IDBOpenDBRequest = window.indexedDB.deleteDatabase(this.mDatabaseName);
        return new Promise<void>((pResolve, pReject) => {
            // Reject on error.
            lDeleteRequest.addEventListener('error', (pEvent) => {
                const lTarget: IDBOpenDBRequest = pEvent.target as IDBOpenDBRequest;

                pReject(new Exception('Error deleting database. ' + lTarget.error, this));
            });

            // Databse delete success.
            lDeleteRequest.onsuccess = () => {
                pResolve();
            };
        });

    }

    /**
     * Open database connection.
     * Resolve once the connection is set.
     */
    public async open(): Promise<IDBDatabase> {
        // Dont open another connection when one is open.
        if (this.mDatabaseConnection) {
            return this.mDatabaseConnection;
        }

        // Open db with current version. Read all object stores and all indices and compare.
        const lDatabaseUpdate: DatabaseUpdate = await new Promise((pResolve, pReject) => {
            const lDatabaseUpdate: DatabaseUpdate = {
                version: 0,
                updateNeeded: false,
                tableUpdates: new Array<TableUpdate>()
            };

            // Open database with current version.
            const lOpenRequest: IDBOpenDBRequest = window.indexedDB.open(this.mDatabaseName);

            // Set defaults when no database exists.
            lOpenRequest.addEventListener('upgradeneeded', () => {
                // Empty update.
            });

            // Reject on block or error. 
            lOpenRequest.addEventListener('blocked', (pEvent) => {
                pReject(new Exception(`Database locked from another tab. Unable to update from "${pEvent.oldVersion}" to "${pEvent.newVersion}"`, this));
            });
            lOpenRequest.addEventListener('error', (pEvent) => {
                const lTarget: IDBOpenDBRequest = pEvent.target as IDBOpenDBRequest;
                pReject(new Exception('Error opening database. ' + lTarget.error, this));
            });

            // Save open state.
            lOpenRequest.addEventListener('success', (pEvent) => {
                const lDatabaseConnection: IDBDatabase = (<IDBOpenDBRequest>pEvent.target).result;

                // Set current loaded database version.
                lDatabaseUpdate.version = lDatabaseConnection.version;

                // Read current tables names and tables names that should be created.
                const lCurrentTableNames: Set<string> = new Set<string>(Array.from(lDatabaseConnection.objectStoreNames));
                const lUncreatedTableNames: Set<string> = new Set<string>(Array.from(this.mTableTypes.keys()));

                // Check current tables. When no tables exists, skip it, so no "Empty Transaction"-Error is thrown.
                if (lCurrentTableNames.size > 0) {
                    // Open a read transaction to read current table configurations.
                    const lReadTransaction: IDBTransaction = lDatabaseConnection.transaction([...lCurrentTableNames], 'readonly');

                    // Read all existing databases. 
                    for (const lTableName of lCurrentTableNames) {
                        // Mark table as deleteable when it does not exists anymore.
                        if (!lUncreatedTableNames.has(lTableName)) {
                            lDatabaseUpdate.tableUpdates.push({
                                name: lTableName,
                                action: 'delete',
                                indices: []
                            });
                            continue;
                        }

                        // Read table configuration.
                        const lTableConfiguration: TableLayoutConfig = this.mTableLayouts.configOf(this.mTableTypes.get(lTableName)!);

                        // Open database table.
                        const lTable: IDBObjectStore = lReadTransaction.objectStore(lTableName);

                        // Validate correct identity, update table when it differs.
                        const lConfiguratedKeyPath: string = lTableConfiguration.identity.key;
                        const lConfiguratedAutoIncrement: boolean = lTableConfiguration.identity.autoIncrement;
                        if (lTable.keyPath !== lConfiguratedKeyPath || lTable.autoIncrement !== lConfiguratedAutoIncrement) {
                            lDatabaseUpdate.tableUpdates.push({
                                name: lTableName,
                                action: 'delete',
                                indices: []
                            });
                            continue;
                        }

                        // Remove table from uncreated table list, so it doesnt get created again.
                        lUncreatedTableNames.delete(lTableName);

                        // Read current tables indeces and tables indecies that should be created.
                        const lCurrentTableIndices: Set<string> = new Set<string>(Array.from(lTable.indexNames));
                        const lUncreatedTableIndices: Set<string> = new Set<string>(Array.from(lTableConfiguration.indices.keys()));

                        const lIndexUpdates: Array<IndexUpdate> = new Array<IndexUpdate>();
                        for (const lIndexName of lCurrentTableIndices) {
                            // Mark index as deleteable when it does not exists anymore.
                            if (!lUncreatedTableIndices.has(lIndexName)) {
                                lIndexUpdates.push({
                                    name: lIndexName,
                                    action: 'delete',
                                });
                                continue;
                            }

                            // Read current index
                            const lCurrentIndex: IDBIndex = lTable.index(lIndexName);
                            const lIndexConfiguration: TableLayoutConfigIndex = lTableConfiguration.indices.get(lIndexName)!;

                            // Read index keys.
                            const lCurrentIndexKey: string = Array.isArray(lCurrentIndex.keyPath) ? lCurrentIndex.keyPath.join(',') : lCurrentIndex.keyPath;
                            const lConfiguratedIndexKey: string = lIndexConfiguration.keys.join(',');

                            // Validate same index configuration. Delete the current index when it differs.
                            if (lCurrentIndexKey !== lConfiguratedIndexKey || lCurrentIndex.multiEntry !== lIndexConfiguration.options.multiEntity || lCurrentIndex.unique !== lIndexConfiguration.options.unique) {
                                lIndexUpdates.push({
                                    name: lIndexName,
                                    action: 'delete',
                                });
                                continue;
                            }

                            // Remove index from uncreated index list, so it doesnt get created again.
                            lUncreatedTableIndices.delete(lIndexName);
                        }

                        // Create all remaing missing indices.
                        for (const lIndexName of lUncreatedTableIndices) {
                            lIndexUpdates.push({
                                name: lIndexName,
                                action: 'create',
                            });
                        }

                        // Add index update table update when any index is not created or must be deleted.
                        if (lIndexUpdates.length > 0) {
                            lDatabaseUpdate.tableUpdates.push({
                                name: lTableName,
                                action: 'none',
                                indices: lIndexUpdates
                            });
                            continue;
                        }
                    }
                }

                // Create all remaining tables.
                for (const lTableName of lUncreatedTableNames) {
                    // Read table and index configuration.
                    const lTableConfiguration: TableLayoutConfig = this.mTableLayouts.configOf(this.mTableTypes.get(lTableName)!);

                    // Add all indices to the index update list.
                    const lIndexUpdates: Array<IndexUpdate> = new Array<IndexUpdate>();
                    for (const lIndexName of lTableConfiguration.indices.keys()) {
                        lIndexUpdates.push({
                            name: lIndexName,
                            action: 'create',
                        });
                    }

                    // Add create table update to database update.
                    lDatabaseUpdate.tableUpdates.push({
                        name: lTableName,
                        action: 'create',
                        indices: lIndexUpdates
                    });
                }

                // Check for any update.
                for (const lTableUpdate of lDatabaseUpdate.tableUpdates) {
                    // Set database to need a update when any update should be made.
                    if (lTableUpdate.action !== 'none' || lTableUpdate.indices.length > 0) {
                        lDatabaseUpdate.updateNeeded = true;
                        break;
                    }
                }

                // Close connection before resolving.
                lDatabaseConnection.close();

                pResolve(lDatabaseUpdate);
            });
        });

        // Get current or next version when a update must be made.
        const lDatabaseVersion: number = (lDatabaseUpdate.updateNeeded) ? lDatabaseUpdate.version + 1 : lDatabaseUpdate.version;

        // Open database request.
        const lOpenRequest: IDBOpenDBRequest = window.indexedDB.open(this.mDatabaseName, lDatabaseVersion);
        return new Promise<IDBDatabase>((pResolve, pReject) => {
            // Init tables on upgradeneeded.
            lOpenRequest.addEventListener('upgradeneeded', (pEvent) => {
                const lTarget: IDBOpenDBRequest = pEvent.target as IDBOpenDBRequest;
                const lDatabaseConnection: IDBDatabase = lTarget.result;
                const lDatabaseTransaction: IDBTransaction = lTarget.transaction!;

                for (const lTableUpdate of lDatabaseUpdate.tableUpdates) {
                    // Delete action.
                    if (lTableUpdate.action === 'delete') {
                        lDatabaseConnection.deleteObjectStore(lTableUpdate.name);
                        continue;
                    }

                    // Read table configuration.
                    const lTableType: TableType = this.mTableTypes.get(lTableUpdate.name)!;
                    const lTableConfiguration = this.mTableLayouts.configOf(lTableType);

                    // Create table with correct identity.
                    if (lTableUpdate.action === 'create') {
                        if (lTableConfiguration.identity) {
                            lDatabaseConnection.createObjectStore(lTableUpdate.name, {
                                keyPath: lTableConfiguration.identity.key,
                                autoIncrement: lTableConfiguration.identity.autoIncrement
                            });
                        } else {
                            // Create object store without an identity.
                            lDatabaseConnection.createObjectStore(lTableUpdate.name);
                        }
                    }

                    // Update indices.
                    if (lTableUpdate.indices.length > 0) {
                        const lTable: IDBObjectStore = lDatabaseTransaction.objectStore(lTableUpdate.name);

                        // Create indices.
                        for (const lIndexUpdate of lTableUpdate.indices) {
                            // Index delete action.
                            if (lIndexUpdate.action === 'delete') {
                                lTable.deleteIndex(lIndexUpdate.name);
                                continue;
                            }

                            // Read index configuration.
                            const lIndexConfiguration: TableLayoutConfigIndex = lTableConfiguration.indices.get(lIndexUpdate.name)!;

                            // Read single keys as string, so multientries are recognized as single key.
                            const lIndexKeys: string | Array<string> = lIndexConfiguration.keys.length > 1 ? lIndexConfiguration.keys : lIndexConfiguration.keys[0];

                            // Index create action.
                            if (lIndexUpdate.action === 'create') {
                                lTable.createIndex(lIndexUpdate.name, lIndexKeys, {
                                    unique: lIndexConfiguration.options.unique,
                                    multiEntry: lIndexConfiguration.options.multiEntity
                                });
                                continue;
                            }
                        }
                    }
                }
            });

            // Reject when update is blocked.
            lOpenRequest.addEventListener('blocked', (pEvent) => {
                pReject(new Exception(`Database locked from another tab. Unable to update from "${pEvent.oldVersion}" to "${pEvent.newVersion}"`, this));
            });

            // Reject on error.
            lOpenRequest.addEventListener('error', (pEvent) => {
                const lTarget: IDBOpenDBRequest = pEvent.target as IDBOpenDBRequest;

                pReject(new Exception('Error opening database. ' + lTarget.error, this));
            });

            // Save open state.
            lOpenRequest.addEventListener('success', (pEvent) => {
                // Save and resolve
                this.mDatabaseConnection = (<IDBOpenDBRequest>pEvent.target).result;
                pResolve(this.mDatabaseConnection);
            });
        });

    }

    /**
     * Create a synchron action where data can be read or written.
     * 
     * @param pTables - Tabes for this transaction.
     * @param pAction - Action withing this transaction.
     */
    public async transaction<TTables extends TableType>(pTables: Array<TTables>, pMode: WebDbTransactionMode, pAction: (pTransaction: WebDatabaseTransaction<TTables>) => void): Promise<void> {
        // Tables should exists.
        for (const lTableType of pTables) {
            if (!this.mTableTypes.has(lTableType.name)) {
                throw new Exception(`Table "${lTableType.name}" does not exists in this database.`, this);
            }
        }

        // Create and open transaction.
        const lTransaction: WebDatabaseTransaction<TTables> = new WebDatabaseTransaction(this, pTables, pMode);
        await lTransaction.open();

        // Call action within the transaction.
        // eslint-disable-next-line @typescript-eslint/await-thenable
        await pAction(lTransaction);

        // Commit transaction.
        lTransaction.commit();
    }
}

type IndexUpdate = {
    name: string;
    action: 'delete' | 'create';
};

type TableUpdate = {
    name: string;
    action: 'delete' | 'create' | 'none';
    indices: Array<IndexUpdate>;
};

type DatabaseUpdate = {
    version: number;
    updateNeeded: boolean;
    tableUpdates: Array<TableUpdate>;
};