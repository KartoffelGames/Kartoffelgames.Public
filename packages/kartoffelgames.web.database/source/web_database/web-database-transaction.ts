import { Exception } from '@kartoffelgames/core';
import { type WebDatabaseTableType, WebDatabaseTableLayout } from './web-database-table-layout.ts';
import type { WebDatabase } from './web-database.ts';
import { WebDatabaseTable } from './web-database-table.ts';

/**
 * Represents a database transaction that provides access to multiple tables with specified access modes.
 * 
 * @template TTables - The table types that are included in this transaction.
 */
export class WebDatabaseTransaction<TTables extends WebDatabaseTableType> {
    private readonly mDatabase: WebDatabase<TTables>;
    private readonly mMode: WebDbTransactionMode;
    private mState: IDBTransaction | null;
    private readonly mTableLayouts: Set<WebDatabaseTableLayout<TTables>>;

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
     * @param pTableLayouts - Tables layouts of transaction.
     * @param pMode - Transaction mode.
     */
    public constructor(pDatabase: WebDatabase<TTables>, pTableLayouts: Array<WebDatabaseTableLayout<TTables>>, pMode: WebDbTransactionMode) {
        this.mDatabase = pDatabase;
        this.mTableLayouts = new Set<WebDatabaseTableLayout<TTables>>(pTableLayouts);
        this.mMode = pMode;
        this.mState = null;
    }

    /**
     * Force commit transaction and wait for completion.
     */
    public async commit(): Promise<void> {
        return new Promise<void>((pResolve) => {
            // Transaction is already closed.
            if (!this.mState) {
                return;
            }

            // Wait for transaction to really complete.
            this.mState.addEventListener('complete', () => {
                pResolve();
            });

            this.mState.commit();
        });
    }

    /**
     * Open the transaction.
     */
    public async open(): Promise<IDBTransaction> {
        // Transaction is already open.
        if (this.mState) {
            return this.mState;
        }

        const lDatabaseConnection: IDBDatabase = await this.mDatabase.open();

        // Convert types into names.
        const lTableNames: Array<string> = Array.from(this.mTableLayouts).map((pTableLayout: WebDatabaseTableLayout<TTables>) => {
            return pTableLayout.tableName;
        });

        this.mState = lDatabaseConnection.transaction(lTableNames, this.mMode);
        this.mState.addEventListener('complete', () => {
            // Clear state on complete.
            this.mState = null;
        });

        return this.mState;
    }

    /**
     * Get table of database.
     * 
     * @param pType - Table type.
     * 
     * @returns Table connection. 
     */
    public table<T extends TTables>(pType: T): WebDatabaseTable<T> {
        const lTableLayout: WebDatabaseTableLayout<T> = WebDatabaseTableLayout.configOf(pType);

        // Table type must exists in table.
        if (!this.mTableLayouts.has(lTableLayout)) {
            throw new Exception('Table is not part of this transaction.', this);
        }

        // Create table object with attached opened db.
        return new WebDatabaseTable<T>(lTableLayout, this);
    }
}

export type WebDbTransactionMode = 'readwrite' | 'readonly';