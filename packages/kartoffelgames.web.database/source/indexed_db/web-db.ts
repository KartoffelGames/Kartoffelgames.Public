import { Exception } from '@kartoffelgames/core';
import { TableType } from './table/table-layout';

export class WebDb {
    private readonly mDatabaseName: string;
    private readonly mTableTypes: Array<TableType>;

    /**
     * Constructor.
     * 
     * @param pName - Database name.
     * @param pTables - Database tables.
     */
    public constructor(pName: string, pTables: Array<TableType>) {
        this.mDatabaseName = pName;
        this.mTableTypes = [...pTables];
    }

    /**
     * Delete database and resolve on success.
     */
    public async delete(): Promise<void> {
        const lDeleteRequest: IDBOpenDBRequest = window.indexedDB.deleteDatabase(this.mDatabaseName);
        return new Promise<void>((pResolve, pReject) => {
            // Reject on error.
            lDeleteRequest.onerror = () => {
                pReject(new Exception('Error deleting database', this));
            };

            // Databse delete success.
            lDeleteRequest.onsuccess = () => {
                pResolve();
            };
        });

    }

    public async table(pType: TableType): Promise<void> {
        // Create table object with attached opened db.
    }

    public transaction(pAction: () => void): void {
        // Call action in a db transaction.
    }

    public async open(): Promise<void> {
        // Open db.

        // Init tables.

        // Save open state.
    }


}