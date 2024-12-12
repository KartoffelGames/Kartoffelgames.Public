import { Exception } from '@kartoffelgames/core';
import { TableType } from './table/table-layout';
import { WebDbTable } from './web-db-table';

export class WebDb {
    private mDatabaseConnection: IDBDatabase | null;
    private readonly mDatabaseName: string;
    private readonly mTableTypes: Set<TableType>;

    /**
     * Constructor.
     * 
     * @param pName - Database name.
     * @param pTables - Database tables.
     */
    public constructor(pName: string, pTables: Array<TableType>) {
        this.mDatabaseName = pName;
        this.mTableTypes = new Set(pTables);
        this.mDatabaseConnection = null;
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
                const lTarget: IDBOpenDBRequest = (<IDBOpenDBRequest>pEvent.target);

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
    public async open(): Promise<void> {
        // TODO: Autodetect version and increment it when any change exists.
        // Open db with current version. Read all object stores and all indices. // Compare.
        
        // Open database request.
        const lOpenRequest: IDBOpenDBRequest = window.indexedDB.open(this.mDatabaseName);
        return new Promise<void>((pResolve, pReject) => {
            // TODO: Init tables onupgradeneeded.
            lOpenRequest.addEventListener('upgradeneeded', (pEvent) => {
                const lTarget: IDBOpenDBRequest = (<IDBOpenDBRequest>pEvent.target);
                const lDatabaseConnection: IDBDatabase = lTarget.result;


                // TODO: Create datastores with all indices.
                // Try to merge already existing indices i dont know how.
            });

            // Reject when update is blocked.
            lOpenRequest.addEventListener('blocked', (pEvent) => {
                pReject(new Exception(`Database locked from another tab. Unable to update from "${pEvent.oldVersion}" to "${pEvent.newVersion}"`, this));
            });

            // Reject on error.
            lOpenRequest.addEventListener('error', (pEvent) => {
                const lTarget: IDBOpenDBRequest = (<IDBOpenDBRequest>pEvent.target);

                pReject(new Exception('Error opening database. ' + lTarget.error, this));
            });

            // Save open state.
            lOpenRequest.addEventListener('success', (pEvent) => {
                // Save and resolve
                this.mDatabaseConnection = (<IDBOpenDBRequest>pEvent.target).result;
                pResolve();
            });
        });

    }

    /**
     * Get table of database.
     * 
     * @param pType - Table type.
     * 
     * @returns Table connection. 
     */
    public table(pType: TableType): WebDbTable {
        // Table type must exists in table.
        if (!this.mTableTypes.has(pType)) {
            throw new Exception('Table type not set for database.', this);
        }

        // Create table object with attached opened db.
        return new WebDbTable(pType, this);
    }

    public transaction(pAction: () => void): void {
        // Call action in a db transaction.
        // TODO:
    }
}