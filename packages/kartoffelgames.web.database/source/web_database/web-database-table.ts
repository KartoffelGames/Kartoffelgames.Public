import { Exception } from '@kartoffelgames/core';
import type { WebDatabaseQueryAction } from './query/web-database-query-action.ts';
import { WebDatabaseQuery } from './query/web-database-query.ts';
import type { WebDatabaseTableLayout, WebDatabaseTableLayoutFieldName, WebDatabaseTableType } from './web-database-table-layout.ts';
import type { WebDatabaseTransaction } from './web-database-transaction.ts';

/**
 * Represents a table within a WebDatabase transaction, providing methods to manipulate and query table data.
 * Supports CRUD operations, type-safe data conversion, and fluent query building for indexed fields.
 * Each instance is bound to a specific table layout and transaction context.
 *
 * @typeParam TTableType - The table type this instance operates on.
 */
export class WebDatabaseTable<TTableType extends WebDatabaseTableType> {
    private readonly mTableLayout: WebDatabaseTableLayout<TTableType>;
    private readonly mTransaction: WebDatabaseTransaction<WebDatabaseTableType>;

    /**
     * Get table layout.
     */
    public get tableLayout(): WebDatabaseTableLayout<TTableType> {
        return this.mTableLayout;
    }

    /**
     * Get transaction.
     */
    public get transaction(): WebDatabaseTransaction<WebDatabaseTableType> {
        return this.mTransaction;
    }

    /**
     * Constructor.
     * 
     * @param pTypeLayout - Table layout.
     * @param pDatabase - Database.
     */
    public constructor(pTypeLayout: WebDatabaseTableLayout<TTableType>, pTransaction: WebDatabaseTransaction<WebDatabaseTableType>) {
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
            lRequest.addEventListener('error', () => {
                pReject(new Exception(`Error clearing table data.` + lRequest.error, this));
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
            lRequest.addEventListener('error', () => {
                pReject(new Exception(`Error counting table rows.` + lRequest.error, this));
            });

            // Resolve on success.
            lRequest.addEventListener('success', () => {
                pResolve(lRequest.result);
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

        // Get table connection.
        const lTable: IDBObjectStore = this.mTransaction.transaction.objectStore(this.mTableLayout.tableName);

        // Get identity value from data.
        const lIdentityProperty: string = this.mTableLayout.identity.key;
        const lIdentityValue: string | number = (<any>pData)[lIdentityProperty];

        // Validate identity value.
        if (typeof lIdentityValue !== 'number' && typeof lIdentityValue !== 'string') {
            throw new Exception(`Data has no valid identity value.`, this);
        }

        // Delete data.
        const lRequest: IDBRequest<undefined> = lTable.delete(lIdentityValue);

        // Wait for completion.
        return new Promise<void>((pResolve, pReject) => {
            // Reject on error.
            lRequest.addEventListener('error', () => {
                pReject(new Exception(`Error deleting data.` + lRequest.error, this));
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
            lRequest.addEventListener('error', () => {
                pReject(new Exception(`Error fetching table.` + lRequest.error, this));
            });

            // Resolve on success.
            lRequest.addEventListener('success', () => {
                // Convert each item into type.
                const lResult: Array<InstanceType<TTableType>> = this.parseToType(lRequest.result);

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
            const lData = (<any>pData)[lField];

            // Detect identity field when a identity is defined.
            if (this.mTableLayout.identity.key === lField && this.mTableLayout.identity.autoIncrement) {
                // Skip adding identity value when auto increment is enabled and the value is not a number.
                if (typeof lData !== 'number') {
                    continue;
                }
            }

            // Copy only the fields defined in the table layout.
            lCleanedData[lField] = (<any>pData)[lField];
        }

        // Put data.
        const lRequest: IDBRequest<IDBValidKey> = (() => {
            // Put data with identity.
            return lTable.put(lCleanedData);
        })();

        // Wait for completion.
        return new Promise<void>((pResolve, pReject) => {
            // Reject on error.
            lRequest.addEventListener('error', () => {
                pReject(new Exception(`Error put data.` + lRequest.error, this));
            });

            // Resolve on success.
            lRequest.addEventListener('success', () => {
                // Update object with the new identity.
               (<any>pData)[this.mTableLayout.identity.key] = lRequest.result;
               
                pResolve();
            });
        });
    }

    /**
     * Create a new table query.
     * 
     * @param pIndexOrPropertyName - Indexed property name of the table to filter by.
     * 
     * @returns a new chainable table query.
     */
    public where(pIndexOrPropertyName: WebDatabaseTableLayoutFieldName<TTableType>): WebDatabaseQueryAction<TTableType> {
        return new WebDatabaseQuery<TTableType>(this).and(pIndexOrPropertyName);
    }
}