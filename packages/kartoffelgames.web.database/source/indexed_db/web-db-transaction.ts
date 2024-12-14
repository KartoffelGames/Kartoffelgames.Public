import { Exception } from '@kartoffelgames/core';
import { TableType } from './table/table-layout';
import { WebDb } from './web-db';
import { WebDbTable } from './web-db-table';

export class WebDbTransaction<TTables extends TableType> {
    private readonly mDatabase: WebDb;
    private readonly mMode: WebDbTransactionMode;
    private mState: IDBTransaction | null;
    private readonly mTableTypes: Set<TTables>;

    /**
     * Underlying transaction.
     */
    public get transaction(): IDBTransaction {
        if (!this.mState) {
            throw new Exception(`Transaction is closed. Transactions can't be used with asynchronous calls.`, this);
        }

        return this.mState;
    }

    /**
     * Constructor.
     * 
     * @param pDatabase - Database-
     * @param pTables - Tables of transaction.
     * @param pMode - Transaction mode.
     */
    public constructor(pDatabase: WebDb, pTables: Array<TTables>, pMode: WebDbTransactionMode) {
        this.mDatabase = pDatabase;
        this.mTableTypes = new Set<TTables>(pTables);
        this.mMode = pMode;
        this.mState = null;
    }

    /**
     * Force commit transaction.
     */
    public commit(): void {
        if (!this.mState) {
            return;
        }

        this.mState.commit();
    }

    /**
     * Open the transaction.
     */
    public async open(): Promise<void> {
        if (this.mState) {
            return;
        }

        const lDatabaseConnection: IDBDatabase = await this.mDatabase.open();

        // Convert types into names.
        const lTableNames: Array<string> = Array.from(this.mTableTypes).map((pTableType: TTables) => {
            return pTableType.name;
        });

        this.mState = lDatabaseConnection.transaction(lTableNames, this.mMode);
        this.mState.addEventListener('complete', () => {
            // Clear state on complete.
            this.mState = null;
        });
    }

    /**
     * Get table of database.
     * 
     * @param pType - Table type.
     * 
     * @returns Table connection. 
     */
    public table<T extends TTables>(pType: T): WebDbTable<T> {
        // Table type must exists in table.
        if (!this.mTableTypes.has(pType)) {
            throw new Exception('Table type not set for database.', this);
        }

        // Create table object with attached opened db.
        return new WebDbTable<T>(pType, this);
    }

}

export type WebDbTransactionMode = 'readwrite' | 'readonly';