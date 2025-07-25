import { Exception, type ClassDecorator, type ClassFieldDecorator } from '@kartoffelgames/core';
import { WebDatabaseFieldDecorator, type WebDatabaseFieldDecoratorExtension } from './layout_decorator/web-database-field.decorator.ts';
import { WebDatabaseTableDecorator, type WebDatabaseTableDecoratorExtension } from './layout_decorator/web-database-table.decorator.ts';
import { type WebDatabaseTableLayoutTableLayoutIdentity, WebDatabaseTableLayout, type WebDatabaseTableLayoutTableLayoutIndex, type WebDatabaseTableType } from './web-database-table-layout.ts';
import { WebDatabaseTransaction, type WebDbTransactionMode } from './web-database-transaction.ts';

/**
 * WebDatabase provides a high-level, type-safe, decorator-based API for working with IndexedDB in web applications.
 * It manages database schema, tables, indexes, and transactions automatically based on TypeScript decorators.
 */
export class WebDatabase<TTables extends WebDatabaseTableType> {
    /**
     * Decorator for defining a field in a web database table.
     * 
     * @template T - The property type.
     * @param pExtension - Optional extension for configuring the field as an identity or index.
     * 
     * @remarks
     * This decorator registers the property as a field in the table layout. 
     * You can use the `as` property in the extension to mark the field as an identity (primary key) or as an index.
     * For number properties, you can specify auto-increment or manual identity. 
     * For array properties, you can enable multiEntry indices.
     * 
     * @example
     * ```typescript
     * class User {
     *   @WebDatabase.field({ as: { identity: 'auto' } })
     *   public id!: number;
     * 
     *   @WebDatabase.field({ as: { index: { unique: true } } })
     *   public email!: string;
     * 
     *   @WebDatabase.field({ as: { index: { multiEntry: true } } })
     *   public tags!: string[];
     * }
     * ```
     */
    public static field: <T>(pExtension?: WebDatabaseFieldDecoratorExtension<T>) => ClassFieldDecorator<any, T> = WebDatabaseFieldDecorator;

    /**
     * Decorator for defining a web database table.
     * 
     * @template T - The table class type.
     * @param pTableName - The name of the table.
     * @param pExtension - Optional extension for defining compound indices.
     * 
     * @remarks
     * This decorator sets up the table layout, including its name and indices, and stores the configuration in metadata.
     * Use the `with` property in the extension to define compound indices, specifying property names and uniqueness.
     * 
     * @example
     * ```typescript
     * @WebDatabase.table('users', {
     *   with: [
     *     { properties: ['firstName', 'lastName'], unique: true }
     *   ]
     * })
     * class User {
     *   public firstName!: string;
     *   public lastName!: string;
     * }
     * ```
     */
    public static table: <T extends WebDatabaseTableType>(pTableName: string, pExtension?: WebDatabaseTableDecoratorExtension<T>) => ClassDecorator<T, void> = WebDatabaseTableDecorator;

    private mDatabaseConnection: IDBDatabase | null;
    private readonly mDatabaseName: string;
    private readonly mTableLayouts: Map<string, WebDatabaseTableLayout<TTables>>;

    /**
     * Constructor.
     * 
     * @param pName - Database name.
     * @param pTables - Database tables.
     */
    public constructor(pName: string, pTables: Array<TTables>) {
        this.mDatabaseName = pName;
        this.mDatabaseConnection = null;

        // Map table types to their name and layouts.
        this.mTableLayouts = new Map<string, WebDatabaseTableLayout<TTables>>();
        for (const lTableType of pTables) {
            // Read table layout from type.
            const lTableLayout: WebDatabaseTableLayout<typeof lTableType> = WebDatabaseTableLayout.configOf(lTableType);

            // Check if table name is already set.
            if (this.mTableLayouts.has(lTableLayout.tableName)) {
                throw new Exception(`Table "${lTableLayout.tableName}" already exists in this database.`, this);
            }

            // Set table type and layout.
            this.mTableLayouts.set(lTableLayout.tableName, lTableLayout);
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
        // Close database connection before deleting.
        this.close();

        const lDeleteRequest: IDBOpenDBRequest = globalThis.indexedDB.deleteDatabase(this.mDatabaseName);
        return new Promise<void>((pResolve, pReject) => {
            // Reject on error.
            lDeleteRequest.addEventListener('error', () => {
                pReject(new Exception('Error deleting database. ' + lDeleteRequest.error, this));
            });

            // Database delete success.
            lDeleteRequest.addEventListener('success', () => {
                // Resolve on success.
                pResolve();
            });
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
        const lDatabaseUpdate: DatabaseUpdate = await this.detectDatabaseLayoutChanges();

        const lDatabaseConnection: IDBDatabase = await (async () => {
            // When no update is needed, just return the current connection.
            if (lDatabaseUpdate.tableUpdates.length === 0) {
                return lDatabaseUpdate.connection;
            }

            // Close the old versions database connection.
            lDatabaseUpdate.connection.close();

            // Open database request with an incremented version.
            return this.openDatabaseWithAction(lDatabaseUpdate.version + 1, (pDatabase: IDBDatabase, pTransaction: IDBTransaction) => {
                // ORDER OF UPDATES IS IMPORTANT!!!

                // Iterate over all table updates and apply them. 
                for (const lTableUpdate of lDatabaseUpdate.tableUpdates) {
                    // Delete action.
                    if (lTableUpdate.action === 'delete') {
                        pDatabase.deleteObjectStore(lTableUpdate.name);
                        continue;
                    }

                    // Read table configuration.
                    const lTableConfiguration = this.mTableLayouts.get(lTableUpdate.name)!;

                    // Create table with correct identity.
                    const lTable: IDBObjectStore = (() => {
                        // No action, so just return the existing table.
                        if (lTableUpdate.action === 'none') {
                            return pTransaction.objectStore(lTableUpdate.name);
                        }

                        // Create object store with identity.
                        return pDatabase.createObjectStore(lTableUpdate.name, {
                            keyPath: lTableConfiguration.identity.key,
                            autoIncrement: lTableConfiguration.identity.autoIncrement
                        });
                    })();

                    // No other update needed, so continue.
                    if (lTableUpdate.indices.length === 0) {
                        continue;
                    }

                    // Iterate over all index updates and apply them.
                    for (const lIndexUpdate of lTableUpdate.indices) {
                        // Index delete action.
                        if (lIndexUpdate.action === 'delete') {
                            lTable.deleteIndex(lIndexUpdate.name);
                            continue;
                        }

                        // Read index configuration.
                        const lIndexConfiguration: WebDatabaseTableLayoutTableLayoutIndex<WebDatabaseTableType> = lTableConfiguration.index(lIndexUpdate.name)!;

                        // Read single keys as string, so multientries are recognized as single key.
                        const lIndexKeys: string | Array<string> = lIndexConfiguration.keys.length > 1 ? lIndexConfiguration.keys : lIndexConfiguration.keys[0];

                        // Create index with correct configuration.
                        lTable.createIndex(lIndexUpdate.name, lIndexKeys, {
                            unique: lIndexConfiguration.unique,
                            multiEntry: lIndexConfiguration.type === 'multiEntry'
                        });
                    }
                }
            }, (pDatabase: IDBDatabase) => {
                // Return database connection after update.
                return pDatabase;
            });
        })();

        // Clear database connection on close.
        lDatabaseConnection.addEventListener('close', () => {
            if (this.mDatabaseConnection === lDatabaseConnection) {
                this.close();
            }
        });

        // Clear database connection onversion change.
        lDatabaseConnection.addEventListener('versionchange', () => {
            if (this.mDatabaseConnection === lDatabaseConnection) {
                this.close();
            }
        });        

        // Set database connection.
        this.mDatabaseConnection = lDatabaseConnection;

        // Return database connection.
        return lDatabaseConnection;
    }

    /**
     * Create a synchron action where data can be read or written.
     * 
     * @param pTables - Tabes for this transaction.
     * @param pAction - Action withing this transaction.
     */
    public async transaction<TResult>(pTables: Array<TTables>, pMode: WebDbTransactionMode, pAction: (pTransaction: WebDatabaseTransaction<TTables>) => TResult): Promise<TResult> {
        const lTableLayoutList: Array<WebDatabaseTableLayout<TTables>> = new Array<WebDatabaseTableLayout<TTables>>();

        // Tables should exists.
        for (const lTableType of pTables) {
            // Read table layout from type.
            const lTableLayout: WebDatabaseTableLayout<typeof lTableType> = WebDatabaseTableLayout.configOf(lTableType);

            if (!this.mTableLayouts.has(lTableLayout.tableName)) {
                throw new Exception(`Table "${lTableLayout.tableName}" does not exists in this database.`, this);
            }

            lTableLayoutList.push(lTableLayout);
        }

        // Create and open transaction.
        const lTransaction: WebDatabaseTransaction<TTables> = new WebDatabaseTransaction(this, lTableLayoutList, pMode);
        await lTransaction.open();

        // Call action within the transaction.
        const lResult: TResult = await pAction(lTransaction);

        // Commit transaction.
        await lTransaction.commit();

        // Return result.
        return lResult;
    }

    /**
     * Detect database layout changes and return a list of updates.
     * 
     * @returns Database update information.
     */
    private async detectDatabaseLayoutChanges(): Promise<DatabaseUpdate> {
        // Open database with current version. Read all object stores and all indices and compare.
        return this.openDatabaseWithAction(undefined, () => { }, (pDatabase: IDBDatabase) => {
            // Create database update object.
            const lDatabaseUpdate: DatabaseUpdate = {
                connection: pDatabase,
                version: pDatabase.version,
                tableUpdates: new Array<TableUpdate>()
            };

            // Read current tables names and tables names that should be created.
            const lExistingTableNames: Set<string> = new Set<string>(Array.from(pDatabase.objectStoreNames));
            const lMissingTableNames: Set<string> = new Set<string>(Array.from(this.mTableLayouts.keys()));

            // Check current tables. When no tables exists, skip it, so no "Empty Transaction"-Error is thrown.
            if (lExistingTableNames.size > 0) {
                // Open a read transaction to read current table configurations.
                const lTransaction: IDBTransaction = pDatabase.transaction([...lExistingTableNames], 'readonly');

                // Read all existing databases. 
                for (const lTableName of lExistingTableNames) {
                    // Mark table as deleteable when it does not exists anymore.
                    if (!lMissingTableNames.has(lTableName)) {
                        lDatabaseUpdate.tableUpdates.push({ name: lTableName, action: 'delete', indices: [] });
                        continue;
                    }

                    // Read table configuration.
                    const lTableLayout: WebDatabaseTableLayout<WebDatabaseTableType> = this.mTableLayouts.get(lTableName)!;

                    // Open database table.
                    const lDatabaseTable: IDBObjectStore = lTransaction.objectStore(lTableName);

                    // Validate correct identity, update table when it differs.
                    const lHasChangedIdentity: boolean = (() => {
                        const lTableLayoutIdentity: Readonly<WebDatabaseTableLayoutTableLayoutIdentity> = lTableLayout.identity;

                        // Identity is not set, but keyPath is set.
                        if (lDatabaseTable.keyPath === null) {
                            return true;
                        }

                        // Compare identity with keyPath and autoIncrement.
                        if (lTableLayoutIdentity.key !== lDatabaseTable.keyPath || lTableLayoutIdentity.autoIncrement !== lDatabaseTable.autoIncrement) {
                            return true;
                        }

                        return false;
                    })();

                    // Identity changed, identity cant be updated, so delete table and create it again with the correct identity.
                    if (lHasChangedIdentity) {
                        lDatabaseUpdate.tableUpdates.push({ name: lTableName, action: 'delete', indices: [] });

                        // Continue without deleting it from the missing table list, so it will be created again with the correct identity.
                        continue;
                    }

                    // Remove table from uncreated table list, so it doesnt get created again.
                    lMissingTableNames.delete(lTableName);

                    // Read current tables indeces and tables indecies that should be created.
                    const lExistingTableIndices: Set<string> = new Set<string>(Array.from(lDatabaseTable.indexNames));
                    const lMissingTableIndices: Set<string> = new Set<string>(lTableLayout.indices);

                    const lIndexUpdates: Array<IndexUpdate> = new Array<IndexUpdate>();
                    for (const lIndexName of lExistingTableIndices) {
                        // Mark index as deleteable when it does not exists anymore.
                        if (!lMissingTableIndices.has(lIndexName)) {
                            lIndexUpdates.push({
                                name: lIndexName,
                                action: 'delete',
                            });
                            continue;
                        }

                        // Read current index
                        const lCurrentIndex: IDBIndex = lDatabaseTable.index(lIndexName);
                        const lIndexLayout: WebDatabaseTableLayoutTableLayoutIndex<WebDatabaseTableType> = lTableLayout.index(lIndexName)!;

                        // Read index keys. A Compound index is already checked by creating index key. Join with space, as space is not a valid keypath name.
                        const lCurrentIndexKey: string = Array.isArray(lCurrentIndex.keyPath) ? lCurrentIndex.keyPath.join(' ') : lCurrentIndex.keyPath;
                        const lConfiguratedIndexKey: string = lIndexLayout.keys.join(' ');

                        // Configurated entry is a multi entry index.
                        const lConfiguratedIsMultiEntry: boolean = lIndexLayout.type === 'multiEntry';

                        // Validate same index configuration. Delete the current index when it differs.
                        if (lCurrentIndexKey !== lConfiguratedIndexKey || lCurrentIndex.multiEntry !== lConfiguratedIsMultiEntry || lCurrentIndex.unique !== lIndexLayout.unique) {
                            lIndexUpdates.push({
                                name: lIndexName,
                                action: 'delete',
                            });

                            // Continue without deleting it from the missing index list, so it will created again with the correct configuration.
                            continue;
                        }

                        // Remove index from uncreated index list, so it doesnt get created again.
                        lMissingTableIndices.delete(lIndexName);
                    }

                    // Create all remaing missing indices.
                    for (const lIndexName of lMissingTableIndices) {
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
            for (const lTableName of lMissingTableNames) {
                // Read table and index configuration.
                const lTableLayout: WebDatabaseTableLayout<WebDatabaseTableType> = this.mTableLayouts.get(lTableName)!;

                // Add all indices to the index update list.
                const lIndexUpdates: Array<IndexUpdate> = new Array<IndexUpdate>();
                for (const lIndexName of lTableLayout.indices) {
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

            return lDatabaseUpdate;
        });
    }

    /**
     * Open database with action and resolve on success.
     * 
     * @param pUpgradeAction - Action to perform on upgrade.
     * @param pSuccessAction - Action to perform on success.
     */
    private async openDatabaseWithAction<T>(pVersion: number | undefined, pUpgradeAction: WebDatabaseUpdateAction, pSuccessAction: WebDatabaseSuccessAction<T>): Promise<T> {
        return new Promise<T>((pResolve, pReject) => {
            // Open database with current version.
            const lOpenRequest: IDBOpenDBRequest = globalThis.indexedDB.open(this.mDatabaseName, pVersion);

            // Reject on block or error. 
            lOpenRequest.addEventListener('blocked', (pEvent) => {
                pReject(new Exception(`Database locked from another tab. Unable to update from "${pEvent.oldVersion}" to "${pEvent.newVersion}"`, this));
            });
            lOpenRequest.addEventListener('error', () => {
                pReject(new Exception('Error opening database. ' + lOpenRequest.error, this));
            });

            // Set defaults when no database exists.
            lOpenRequest.addEventListener('upgradeneeded', () => {
                try {
                    pUpgradeAction(lOpenRequest.result, lOpenRequest.transaction!);
                } catch (pError) {
                    pReject(pError);
                }
            });

            // Save open state.
            lOpenRequest.addEventListener('success', () => {
                try {
                    pResolve(pSuccessAction(lOpenRequest.result));
                } catch (pError) {
                    pReject(pError);
                }
            });
        });
    }
}

type WebDatabaseUpdateAction = (pDatabase: IDBDatabase, pTransaction: IDBTransaction) => void;
type WebDatabaseSuccessAction<T> = (pDatabase: IDBDatabase) => T;

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
    connection: IDBDatabase;
    version: number;
    tableUpdates: Array<TableUpdate>;
};