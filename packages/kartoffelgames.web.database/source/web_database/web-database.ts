import { Dictionary, Exception, type ClassDecorator, type ClassFieldDecorator } from '@kartoffelgames/core';
import { Metadata } from '@kartoffelgames/core-dependency-injection';
import { WebDatabaseTableLayout, type TableLayoutIndex, type TableType } from './web-database-table-layout.ts';
import { WebDatabaseTransaction, type WebDbTransactionMode } from './web-database-transaction.ts';

export class WebDatabase {
    /**
     * Set propery as table field.
     * 
     * @param pIndexName - Index name.
     * @param pUnique - Index should be unique.
     * @param pMultiEntry - Index is a multi entry index. Only supported for arrays.
     */
    public static field(pIndexName?: string, pUnique: boolean = false, pMultiEntry: boolean = false): ClassFieldDecorator<any, any> {
        return function (_pTarget: any, pContext: WebDatabaseFieldDecoratorContext<any, any>): void {
            // Decorator can not be used on static propertys.
            if (pContext.static) {
                throw new Exception('Index property can not be a static property.', WebDatabase);
            }

            // Decorator can only be attached to string named properties.
            if (typeof pContext.name !== 'string') {
                throw new Exception('Index name must be a string.', WebDatabase);
            }

            // Read metadata from metadata...
            const lConstructorMetadata = Metadata.forInternalDecorator(pContext.metadata);

            // Try to read table layout from metadata.
            let lTableLayout: WebDatabaseTableLayout | null = lConstructorMetadata.getMetadata(WebDatabaseTableLayout.METADATA_KEY);
            if (!lTableLayout) {
                lTableLayout = new WebDatabaseTableLayout();
            }

            // Add table type index to layout.
            lTableLayout.setTableField(pContext.name, pIndexName, pUnique, pMultiEntry);

            // Set the table layout to the metadata.
            lConstructorMetadata.setMetadata(WebDatabaseTableLayout.METADATA_KEY, lTableLayout);
        };
    }

    /**
     * Add identity to table type.
     * Auto incremented identity is only supported for number types.
     * 
     * @param pAutoIncrement - Auto incremented identity.
     */
    public static identity<TAutoIncrement extends true | false>(pAutoIncrement: TAutoIncrement): ClassFieldDecorator<any, TAutoIncrement extends true ? number : any> {
        return (_pTarget: any, pContext: WebDatabaseFieldDecoratorContext<any, TAutoIncrement extends true ? number : any>): void => {
            // Decorator can not be used on static propertys.
            if (pContext.static) {
                throw new Exception('Identity property can not be a static property.', WebDatabase);
            }

            // Decorator can only be attached to string named properties.
            if (typeof pContext.name !== 'string') {
                throw new Exception('Identity name must be a string.', WebDatabase);
            }

            // Read metadata from metadata...
            const lConstructorMetadata = Metadata.forInternalDecorator(pContext.metadata);

            // Try to read table layout from metadata.
            let lTableLayout: WebDatabaseTableLayout | null = lConstructorMetadata.getMetadata(WebDatabaseTableLayout.METADATA_KEY);
            if (!lTableLayout) {
                lTableLayout = new WebDatabaseTableLayout();
            }

            // Add table type index to layout.
            lTableLayout.setTableIdentity(pContext.name, pAutoIncrement);

            // Set the table layout to the metadata.
            lConstructorMetadata.setMetadata(WebDatabaseTableLayout.METADATA_KEY, lTableLayout);
        };
    }

    /**
     * Decorator for the database table.
     * 
     * @param pTableName - Table name.
     */
    public static table(pTableName: string): ClassDecorator<TableType, void> {
        return function (pTableClass: any, pContext: ClassDecoratorContext): void {
            // Read metadata from metadata...
            const lConstructorMetadata = Metadata.forInternalDecorator(pContext.metadata);

            // Try to read table layout from metadata.
            let lTableLayout: WebDatabaseTableLayout | null = lConstructorMetadata.getMetadata(WebDatabaseTableLayout.METADATA_KEY);
            if (!lTableLayout) {
                lTableLayout = new WebDatabaseTableLayout();
            }

            // Set table name.
            lTableLayout.setTableName(pTableClass, pTableName);

            // Set the table layout to the metadata.
            lConstructorMetadata.setMetadata(WebDatabaseTableLayout.METADATA_KEY, lTableLayout);
        };
    }

    private mDatabaseConnection: IDBDatabase | null;
    private readonly mDatabaseName: string;
    private readonly mTableTypes: Map<string, WebDatabaseTableLayout>;

    /**
     * Constructor.
     * 
     * @param pName - Database name.
     * @param pTables - Database tables.
     */
    public constructor(pName: string, pTables: Array<TableType>) {
        this.mDatabaseName = pName;
        this.mDatabaseConnection = null;

        // Map table types to their name and layouts.
        this.mTableTypes = new Map<string, WebDatabaseTableLayout>();
        for (const pTableType of pTables) {
            // Read table layout from type.
            const lTableLayout: WebDatabaseTableLayout = WebDatabaseTableLayout.configOf(pTableType);

            // Check if table name is already set.
            if (this.mTableTypes.has(lTableLayout.tableName)) {
                throw new Exception(`Table "${lTableLayout.tableName}" already exists in this database.`, this);
            }

            // Set table type and layout.
            this.mTableTypes.set(lTableLayout.tableName, lTableLayout);
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
            lDeleteRequest.addEventListener('error', (pEvent) => {
                const lTarget: IDBOpenDBRequest = pEvent.target as IDBOpenDBRequest;

                pReject(new Exception('Error deleting database. ' + lTarget.error, this));
            });

            // Databse delete success.
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
        const lDatabaseUpdate: DatabaseUpdate = await new Promise((pResolve, pReject) => {
            const lDatabaseUpdate: DatabaseUpdate = {
                version: 0,
                updateNeeded: false,
                tableUpdates: new Array<TableUpdate>()
            };

            // Open database with current version.
            const lOpenRequest: IDBOpenDBRequest = globalThis.indexedDB.open(this.mDatabaseName);

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
                        const lTableLayout: WebDatabaseTableLayout = this.mTableTypes.get(lTableName)!;

                        // Open database table.
                        const lTable: IDBObjectStore = lReadTransaction.objectStore(lTableName);

                        // Validate correct identity, update table when it differs.
                        const lConfiguratedKeyPath: string = lTableLayout.identity.key;
                        const lConfiguratedAutoIncrement: boolean = lTableLayout.identity.autoIncrement;
                        if (lTable.keyPath !== lConfiguratedKeyPath || lTable.autoIncrement !== lConfiguratedAutoIncrement) {
                            lDatabaseUpdate.tableUpdates.push({
                                name: lTableName,
                                action: 'delete',
                                indices: []
                            });

                            // Continue without deleting it from the uncreated table list, so it can be created again with the correct identity.
                            continue;
                        }

                        // Remove table from uncreated table list, so it doesnt get created again.
                        lUncreatedTableNames.delete(lTableName);

                        // Read current tables indeces and tables indecies that should be created.
                        const lCurrentTableIndices: Set<string> = new Set<string>(Array.from(lTable.indexNames));
                        const lUncreatedTableIndices: Set<string> = new Set<string>(lTableLayout.indices);

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
                            const lIndexConfiguration: TableLayoutIndex = lTableLayout.index(lIndexName)!;

                            // Read index keys. A Compound index is already checked by creating index key.
                            const lCurrentIndexKey: string = Array.isArray(lCurrentIndex.keyPath) ? lCurrentIndex.keyPath.join(',') : lCurrentIndex.keyPath;
                            const lConfiguratedIndexKey: string = lIndexConfiguration.keys.join(',');

                            // Configurated entry is a multi entry index.
                            const lConfiguratedIsMultiEntry: boolean = lIndexConfiguration.type === 'multiEntryIndex';

                            // Validate same index configuration. Delete the current index when it differs.
                            if (lCurrentIndexKey !== lConfiguratedIndexKey || lCurrentIndex.multiEntry !== lConfiguratedIsMultiEntry || lCurrentIndex.unique !== lIndexConfiguration.unique) {
                                lIndexUpdates.push({
                                    name: lIndexName,
                                    action: 'delete',
                                });

                                // Continue without deleting it from the uncreated index list, so it can be created again with the correct configuration.
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
                    const lTableLayout: WebDatabaseTableLayout = this.mTableTypes.get(lTableName)!;

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
        const lOpenRequest: IDBOpenDBRequest = globalThis.indexedDB.open(this.mDatabaseName, lDatabaseVersion);
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
                    const lTableConfiguration = this.mTableTypes.get(lTableUpdate.name)!;

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
                            const lIndexConfiguration: TableLayoutIndex = lTableConfiguration.index(lIndexUpdate.name)!;

                            // Read single keys as string, so multientries are recognized as single key.
                            const lIndexKeys: string | Array<string> = lIndexConfiguration.keys.length > 1 ? lIndexConfiguration.keys : lIndexConfiguration.keys[0];

                            // Index create action.
                            if (lIndexUpdate.action === 'create') {
                                lTable.createIndex(lIndexUpdate.name, lIndexKeys, {
                                    unique: lIndexConfiguration.unique,
                                    multiEntry: lIndexConfiguration.type === 'multiEntryIndex'
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
    public async transaction<TTables extends TableType, TResult>(pTables: Array<TTables>, pMode: WebDbTransactionMode, pAction: (pTransaction: WebDatabaseTransaction<TTables>) => TResult): Promise<TResult> {
        const lTableLayoutList: Array<WebDatabaseTableLayout> = new Array<WebDatabaseTableLayout>();

        // Tables should exists.
        for (const lTableType of pTables) {
            // Read table layout from type.
            const lTableLayout: WebDatabaseTableLayout = WebDatabaseTableLayout.configOf(lTableType);

            if (!this.mTableTypes.has(lTableLayout.tableName)) {
                throw new Exception(`Table "${lTableLayout.tableName}" does not exists in this database.`, this);
            }

            lTableLayoutList.push(lTableLayout);
        }

        // Create and open transaction.
        const lTransaction: WebDatabaseTransaction<TTables> = new WebDatabaseTransaction(this, lTableLayoutList, pMode);
        await lTransaction.open();

        // Call action within the transaction.
        // eslint-disable-next-line @typescript-eslint/await-thenable
        const lResult: TResult = await pAction(lTransaction);

        // Commit transaction.
        lTransaction.commit();

        // Return result.
        return lResult;
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

type WebDatabaseFieldDecoratorContext<TThis, TValue> = ClassGetterDecoratorContext<TThis, TValue> | ClassSetterDecoratorContext<TThis, TValue> | ClassFieldDecoratorContext<TThis, TValue> | ClassAccessorDecoratorContext<TThis, TValue>;