
import { Exception } from '@kartoffelgames/core';
import { type TableLayoutConfig, type TableType, WebDatabaseTableLayout } from './layout/web-database-table-layout.ts';
import { WebDatabaseQuery } from './query/web-database-query.ts';
import type { WebDatabaseQueryAction } from './query/web-database-query-action.ts';
import type { WebDatabaseTransaction } from './web-database-transaction.ts';

export class WebDatabaseTable<TTableType extends TableType> {
    private readonly mTableLayout: WebDatabaseTableLayout;
    private readonly mTableType: TTableType;
    private readonly mTransaction: WebDatabaseTransaction<TableType>;

    /**
     * Get table type.
     */
    public get tableType(): TTableType {
        return this.mTableType;
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
     * @param pType - Table type.
     * @param pDatabase - Database.
     */
    public constructor(pType: TTableType, pTransaction: WebDatabaseTransaction<TableType>) {
        this.mTableType = pType;
        this.mTransaction = pTransaction;
        this.mTableLayout = new WebDatabaseTableLayout();
    }

    /**
     * Clear table data.
     */
    public async clear(): Promise<void> {
        // Get table connection.
        const lTable: IDBObjectStore = this.mTransaction.transaction.objectStore(this.mTableType.name);

        // Clear data data.
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
        const lTable: IDBObjectStore = this.mTransaction.transaction.objectStore(this.mTableType.name);

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
        if (!(pData instanceof this.mTableType)) {
            throw new Exception(`Invalid data type.`, this);
        }

        // Get identity value from data.
        const lTableLayout: TableLayoutConfig = this.mTableLayout.configOf(this.mTableType);
        const lIdentityProperty: string = lTableLayout.identity.key;
        const lIdentityValue: string | number = (<any>pData)[lIdentityProperty];

        // Get table connection.
        const lTable: IDBObjectStore = this.mTransaction.transaction.objectStore(this.mTableType.name);

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
        const lTable: IDBObjectStore = this.mTransaction.transaction.objectStore(this.mTableType.name);

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
                const lResult: Array<InstanceType<TTableType>> = lTarget.result.map((pSourceObject: any) => {
                    const lTargetObject: InstanceType<TTableType> = new this.mTableType() as InstanceType<TTableType>;

                    for (const lKey of Object.keys(pSourceObject)) {
                        (<any>lTargetObject)[lKey] = pSourceObject[lKey];
                    }

                    return lTargetObject;
                });

                // Resolve converted data.
                pResolve(lResult);
            });
        });
    }


    /**
     * Put data.
     * 
     * @param pData - Data. Must be an instance of the table type.
     */
    public async put(pData: InstanceType<TTableType>): Promise<void> {
        // Validate data type.
        if (!(pData instanceof this.mTableType)) {
            throw new Exception(`Invalid data type.`, this);
        }

        // Get table connection.
        const lTable: IDBObjectStore = this.mTransaction.transaction.objectStore(this.mTableType.name);

        // Put data.
        const lRequest: IDBRequest<IDBValidKey> = lTable.put(pData);

        // Wait for completion.
        return new Promise<void>((pResolve, pReject) => {
            // Reject on error.
            lRequest.addEventListener('error', (pEvent) => {
                const lTarget: IDBRequest<IDBValidKey> = pEvent.target as IDBRequest<IDBValidKey>;
                pReject(new Exception(`Error put data.` + lTarget.error, this));
            });

            // Resolve on success.
            lRequest.addEventListener('success', (pEvent) => {
                // Get table layout.
                const lTableLayout: TableLayoutConfig = this.mTableLayout.configOf(this.mTableType);

                // Read event target like a shithead.
                const lTarget: IDBRequest<IDBValidKey> = pEvent.target as IDBRequest<IDBValidKey>;

                // Update object with the new identity when any identity is specified.
                const lIdentityProperty: string = lTableLayout.identity.key;
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