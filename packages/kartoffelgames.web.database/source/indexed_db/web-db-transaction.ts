import { Exception } from '@kartoffelgames/core';
import { TableType } from './table/table-layout';
import { WebDb } from './web-db';
import { WebDbTable } from './web-db-table';

export class WebDbTransaction<TTables extends TableType> {
    private readonly mDatabase: WebDb;
    private mMode: TransactionMode;
    private mState: TransactionState;
    private readonly mTableTypes: Set<TTables>;

    public constructor(pDatabase: WebDb, pTables: Array<TTables>, pMode: TransactionMode = 'readwrite') {
        this.mDatabase = pDatabase;
        this.mTableTypes = new Set<TTables>(pTables);
        this.mMode = pMode;
        this.mState = 'open';
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

    public async open(): Promise<void> {

    }

    public commit(): void {

    }
}

type TransactionState = 'open' | 'closed' | 'commited';
type TransactionMode = 'read' | 'write' | 'readwrite';