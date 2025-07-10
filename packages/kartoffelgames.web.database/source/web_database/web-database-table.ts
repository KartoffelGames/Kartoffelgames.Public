
import { Exception } from '@kartoffelgames/core';
import { type TableType, WebDatabaseTableLayout } from './web-database-table-layout.ts';
import type { WebDatabaseQueryAction } from './query/web-database-query-action.ts';
import { WebDatabaseQuery } from './query/web-database-query.ts';
import type { WebDatabaseTransaction } from './web-database-transaction.ts';

export class WebDatabaseTable<TTableType extends TableType> {
    private readonly mTableLayout: WebDatabaseTableLayout;
    private readonly mTransaction: WebDatabaseTransaction<TableType>;

    /**
     * Get table layout.
     */
    public get tableLayout(): WebDatabaseTableLayout {
        return this.mTableLayout;
    }

    /**
     * Get transaction.
     */
    public get transaction(): WebDatabaseTransaction<TableType> {
        return this.mTransaction;
    }

    /**
     * Constructor.
     * 
     * @param pTypeLayout - Table layout.
     * @param pDatabase - Database.
     */
    public constructor(pTypeLayout: WebDatabaseTableLayout, pTransaction: WebDatabaseTransaction<TableType>) {
        this.mTableLayout = pTypeLayout;
        this.mTransaction = pTransaction;
    }

    /**
     * Clear table data.
     */
    public async clear(): Promise<void> {
        // Get table connection.
        const lTable: IDBObjectStore = this.mTransaction.transaction.objectStore(this.mTableLayout.tableName);

        // Clear data.
        const lRequest: IDBRequest<undefined> = lTable.clear();

        // Wait for completion.
        return new Promise<void>((pResolve, pReject) => {
            // Reject on error.
            lRequest.addEventListener('error', (pEvent) => {
                const lTarget: IDBRequest<IDBValidKey> = pEvent.target as IDBRequest<IDBValidKey>;
                pReject(new Exception(`Error clearing table data.` + lTarget.error, this));
            });

            lRequest.addEventListener('success', () => {
                pResolve();
            });
        });
    }

    /**
     * Get row count of table.
     */
    public async count(): Promise<number> {
        // Get table connection.
        const lTable: IDBObjectStore = this.mTransaction.transaction.objectStore(this.mTableLayout.tableName);

        // Clear data data.
        const lRequest: IDBRequest<number> = lTable.count();

        // Wait for completion.
        return new Promise<number>((pResolve, pReject) => {
            // Reject on error.
            lRequest.addEventListener('error', (pEvent) => {
                const lTarget: IDBRequest<number> = (<IDBRequest<number>>pEvent.target);
                pReject(new Exception(`Error counting table rows.` + lTarget.error, this));
            });

            // Resolve on success.
            lRequest.addEventListener('success', (pEvent) => {
                // Read event target like a shithead.
                const lTarget: IDBRequest<number> = pEvent.target as IDBRequest<number>;

                pResolve(lTarget.result);
            });
        });
    }

    /**
     * Delete data.
     * 
     * @param pData - Data. Must be an instance of the table type.
     */
    public async delete(pData: InstanceType<TTableType>): Promise<void> {
        // Validate data type.
        if (!(pData instanceof this.mTableLayout.tableType)) {
            throw new Exception(`Invalid data type.`, this);
        }

        // Get identity value from data.
        const lIdentityProperty: string = this.mTableLayout.identity.key;
        const lIdentityValue: string | number = (<any>pData)[lIdentityProperty];

        // Get table connection.
        const lTable: IDBObjectStore = this.mTransaction.transaction.objectStore(this.mTableLayout.tableName);

        // Delete data.
        const lRequest: IDBRequest<undefined> = lTable.delete(lIdentityValue);

        // Wait for completion.
        return new Promise<void>((pResolve, pReject) => {
            // Reject on error.
            lRequest.addEventListener('error', (pEvent) => {
                const lTarget: IDBRequest<undefined> = pEvent.target as IDBRequest<undefined>;
                pReject(new Exception(`Error deleting data.` + lTarget.error, this));
            });

            // Resolve on success.
            lRequest.addEventListener('success', () => {
                pResolve();
            });
        });
    }

    /**
     * Get all table data. Can be limited by count.
     */
    public async getAll(pCount?: number): Promise<Array<InstanceType<TTableType>>> {
        // Get table connection.
        const lTable: IDBObjectStore = this.mTransaction.transaction.objectStore(this.mTableLayout.tableName);

        // Clear data data.
        const lRequest: IDBRequest<Array<any>> = lTable.getAll(null, pCount);

        // Wait for completion.
        return new Promise<Array<InstanceType<TTableType>>>((pResolve, pReject) => {
            // Reject on error.
            lRequest.addEventListener('error', (pEvent) => {
                const lTarget: IDBRequest<number> = (<IDBRequest<number>>pEvent.target);
                pReject(new Exception(`Error fetching table.` + lTarget.error, this));
            });

            // Resolve on success.
            lRequest.addEventListener('success', (pEvent) => {
                // Read event target like a shithead.
                const lTarget: IDBRequest<Array<any>> = pEvent.target as IDBRequest<Array<any>>;

                // Convert each item into type.
                const lResult: Array<InstanceType<TTableType>> = this.parseToType(lTarget.result);

                // Resolve converted data.
                pResolve(lResult);
            });
        });
    }

    /**
     * Convert all data items into table type objects.
     * 
     * @param pData - Data objects.
     * 
     * @returns converted data list. 
     */
    public parseToType(pData: Iterable<Record<string, any>>): Array<InstanceType<TTableType>> {
        const lResultList: Array<InstanceType<TTableType>> = new Array<InstanceType<TTableType>>();

        // Convert each item into type.
        for (const lSourceObject of pData) {
            const lTargetObject: InstanceType<TTableType> = new this.mTableLayout.tableType() as InstanceType<TTableType>;

            for (const lKey of this.mTableLayout.fields) {
                (<any>lTargetObject)[lKey] = lSourceObject[lKey];
            }

            lResultList.push(lTargetObject);
        }

        return lResultList;
    }

    /**
     * Put data.
     * 
     * @param pData - Data. Must be an instance of the table type.
     */
    public async put(pData: InstanceType<TTableType>): Promise<void> {
        // Validate data type.
        if (!(pData instanceof this.mTableLayout.tableType)) {
            throw new Exception(`Invalid data type.`, this);
        }

        // Get table connection.
        const lTable: IDBObjectStore = this.mTransaction.transaction.objectStore(this.mTableLayout.tableName);

        // Cleanup data to use only the fields defined in the table layout.
        const lCleanedData: Record<string, any> = {};
        for (const lField of this.mTableLayout.fields) {
            // Copy only the fields defined in the table layout.
            lCleanedData[lField] = (<any>pData)[lField];
        }

        // Put data.
        const lRequest: IDBRequest<IDBValidKey> = lTable.put(lCleanedData);

        // Wait for completion.
        return new Promise<void>((pResolve, pReject) => {
            // Reject on error.
            lRequest.addEventListener('error', (pEvent) => {
                const lTarget: IDBRequest<IDBValidKey> = pEvent.target as IDBRequest<IDBValidKey>;
                pReject(new Exception(`Error put data.` + lTarget.error, this));


            });

            // Resolve on success.
            lRequest.addEventListener('success', (pEvent) => {
                // Read event target like a shithead.
                const lTarget: IDBRequest<IDBValidKey> = pEvent.target as IDBRequest<IDBValidKey>;

                // Update object with the new identity when any identity is specified.
                const lIdentityProperty: string = this.mTableLayout.identity.key;
                (<any>pData)[lIdentityProperty] = lTarget.result;

                pResolve();
            });
        });
    }

    /**
     * Create a new table query.
     * 
     * @param pIndexOrPropertyName - A index or a property name.
     * 
     * @returns a new chainable table query.
     */
    public where(pIndexOrPropertyName: string): WebDatabaseQueryAction<TTableType> {
        return new WebDatabaseQuery<TTableType>(this).and(pIndexOrPropertyName);
    }
}