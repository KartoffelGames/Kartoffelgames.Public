/**
 * Provides a fluent API for building and executing queries on a WebDatabaseTable.
 * Supports chaining of query conditions using AND/OR logic, and allows for reading or deleting records
 * that match the specified conditions. Queries are mapped to available indices for efficient execution,
 * and will throw if no suitable index exists for a query block. Each query instance is bound to a specific table.
 *
 * @typeParam TTableType - The table type this query operates on.
 */
import { Dictionary, Exception } from '@kartoffelgames/core';
import type { WebDatabaseTableLayoutTableLayoutIndex, WebDatabaseTableType, WebDatabaseTableLayout, WebDatabaseTableLayoutFieldName } from '../web-database-table-layout.ts';
import type { WebDatabaseTable } from '../web-database-table.ts';
import { WebDatabaseQueryAction, type WebDatabaseQueryActionBoundRange } from './web-database-query-action.ts';


export class WebDatabaseQuery<TTableType extends WebDatabaseTableType> {
    private readonly mQueryList: Array<WebDatabaseQueryPart<TTableType>>;
    private readonly mTable: WebDatabaseTable<TTableType>;

    /**
     * Constructor.
     * 
     * @param pTable - Table of query.
     */
    public constructor(pTable: WebDatabaseTable<TTableType>) {
        this.mTable = pTable;
        this.mQueryList = new Array<WebDatabaseQueryPart<TTableType>>();
    }

    /**
     * Chain database query with "AND".
     * 
     * @param pPropertyName - Property name.
     *  
     * @returns query action. 
     */
    public and(pPropertyName: WebDatabaseTableLayoutFieldName<TTableType>): WebDatabaseQueryAction<TTableType> {
        // Create query part.
        const lPart: WebDatabaseQueryPart<TTableType> = {
            property: pPropertyName,
            action: null,
            link: 'AND'
        };

        // Add part to query list.
        this.mQueryList.push(lPart);

        // Create query action that sets the action on a chained call.
        return new WebDatabaseQueryAction(this, (pAction) => {
            lPart.action = pAction;
        });
    }

    /**
     * Executes the query and deletes all matching records from the table.
     * Queries are grouped into blocks (OR logic), and for each block, a cursor iterates over matching records.
     * Each record is deleted only once, even if it matches multiple blocks, by tracking deleted identities.
     * Throws an error if no queries are specified or if a block cannot be mapped to an indexable key range.
     *
     * @throws {Exception} If no queries are specified or no indexable key range is found for a block.
     * @returns A promise that resolves when all matching records have been deleted.
     */
    public async delete(): Promise<void> {
        // Must have queries.
        if (this.mQueryList.length === 0) {
            throw new Exception('No queries specified.', this);
        }

        // Divide queries into "OR" blocks.
        const lQueryBlockList: Array<Array<WebDatabaseQueryPart<TTableType>>> = this.groupQueryBlock(this.mQueryList);

        // Set to track already deleted items by their identity.
        const lDeletedIdentities: Set<string | number> = new Set<string | number>();

        // Get identity key for tracking deletions.
        const lIdentityKey: string = this.mTable.tableLayout.identity.key;

        for (const lBlock of lQueryBlockList) {
            // Convert block into indexable key range.
            const lIndexableKeyRange: WebDatabaseQueryIndexableKeyRange | null = this.generateIndexableKeyRange(lBlock);
            if (!lIndexableKeyRange) {
                throw new Exception(`No indexable key range for block found.`, this);
            }

            // Open cursor for the indexable key range and delete items.
            // Await as delete cursors are linear anyway.
            await this.openCursor(lIndexableKeyRange, (pCursor: IDBCursorWithValue) => {
                // Get identity value to check if already deleted.
                const lIdentityValue: string | number = pCursor.value[lIdentityKey];

                // Skip if already deleted.
                if (lDeletedIdentities.has(lIdentityValue)) {
                    return;
                }

                // Mark as deleted.
                lDeletedIdentities.add(lIdentityValue);

                // Delete the current item.
                pCursor.delete();
            });
        }
    }

    /**
     * Chain database query with "OR".
     * 
     * @param pPropertyName - Property name.
     *  
     * @returns query action. 
     */
    public or(pPropertyName: WebDatabaseTableLayoutFieldName<TTableType>): WebDatabaseQueryAction<TTableType> {
        // Create query part.
        const lPart: WebDatabaseQueryPart<TTableType> = {
            property: pPropertyName,
            action: null,
            link: 'OR'
        };

        // Add part to query list.
        this.mQueryList.push(lPart);

        // Create query action that sets the action on a chained call.
        return new WebDatabaseQueryAction(this, (pAction) => {
            lPart.action = pAction;
        });
    }

    /**
     * Execute query and get all values.
     * 
     * @returns filtered query result. 
     */
    public async read(): Promise<Array<InstanceType<TTableType>>> {
        // Must have queries.
        if (this.mQueryList.length === 0) {
            throw new Exception('No queries specified.', this);
        }
        
        // Devide queries into "AND" blocks.
        const lQueryBlockList: Array<Array<WebDatabaseQueryPart<TTableType>>> = this.groupQueryBlock(this.mQueryList);

        // Convert each query block into a indexable key range.
        const lIndexableKeyRangeList: Array<WebDatabaseQueryIndexableKeyRange> = lQueryBlockList.map((pBlock: WebDatabaseQueryBlock<TTableType>): WebDatabaseQueryIndexableKeyRange => {
            // Convert block into indexable key range.
            const lIndexableKeyRange: WebDatabaseQueryIndexableKeyRange | null = this.generateIndexableKeyRange(pBlock);
            if (!lIndexableKeyRange) {
                throw new Exception(`No indexable key range for block found.`, this);
            }

            return lIndexableKeyRange;
        });

        // Read all indexable key ranges and save the largest result set.
        const lRequestList: Array<Promise<Array<any>>> = new Array<Promise<Array<any>>>();
        for (const lIndexableKeyRange of lIndexableKeyRangeList) {
            lRequestList.push(this.readQuery(lIndexableKeyRange));
        }

        // Wait for all requests to finish.
        const lQueryResultList: Array<Array<any>> = await Promise.all(lRequestList);

        // Shortcut when block contains a single indexable key range.
        if (lQueryResultList.length === 1) {
            // Read and convert single block.
            return this.mTable.parseToType(lQueryResultList[0]);
        }

        // Buffer for identity key.
        const lIdentityKey: string = this.mTable.tableLayout.identity.key;

        // Merge results.
        const lMergedResult: Dictionary<string | number, any> = new Dictionary<string | number, any>();
        for (const lQueryResult of lQueryResultList) {
            for (const lResultItem of lQueryResult) {
                const lIdentityValue: string = lResultItem[lIdentityKey];
                if (!lMergedResult.has(lIdentityValue)) {
                    lMergedResult.set(lIdentityValue, lResultItem);
                }
            }
        }

        // Convert merged block.
        return this.mTable.parseToType(lMergedResult.values());
    }

    /**
     * Group queries into blocks.
     * A block is a set of queries that are linked with "AND".
     * 
     * @param pQueryList - Query list.
     * 
     * @returns Query blocks.
     */
    private groupQueryBlock(pQueryList: Array<WebDatabaseQueryPart<TTableType>>): Array<WebDatabaseQueryBlock<TTableType>> {
        // Devide queries into "AND" blocks.
        const lQueryBlockList: Array<WebDatabaseQueryBlock<TTableType>> = new Array<WebDatabaseQueryBlock<TTableType>>();

        // Add first block.
        lQueryBlockList.push(new Array<WebDatabaseQueryPart<TTableType>>());

        // Assign every query into a block.
        for (const lQuery of pQueryList) {
            // Create new block on any or chain.
            if (lQuery.link === 'OR') {
                lQueryBlockList.push(new Array<WebDatabaseQueryPart<TTableType>>());
            }

            // Add query to latest block.
            lQueryBlockList.at(-1)!.push(lQuery);
        }

        return lQueryBlockList;
    }

    /**
     * Generate a single key range for a query block.
     * When no index exists for the block, it returns null.
     * 
     * @param pBlock - Query block.
     * 
     * @returns IDBKeyRange or null when no index exists for the block. 
     */
    private generateIndexableKeyRange(pBlock: WebDatabaseQueryBlock<TTableType>): WebDatabaseQueryIndexableKeyRange | null {
        // Read table layout for easy access.
        const lTableLayout: WebDatabaseTableLayout<TTableType> = this.mTable.tableLayout;

        // When block is single, only check if a index for it exists.
        if (pBlock.length === 1) {
            const lQueryPart: WebDatabaseQueryPart<TTableType> = pBlock[0];

            // When no index exists for the property.
            if (!lTableLayout.index(lQueryPart.property)) {
                return null;
            }

            return {
                indexName: lQueryPart.property,
                keyRange: IDBKeyRange.bound(lQueryPart.action!.lower, lQueryPart.action!.upper, false, false)
            };
        }

        // Read all used properties of the block.
        const lBlockPropertyList: Map<WebDatabaseTableLayoutFieldName<TTableType>, WebDatabaseQueryActionBoundRange> = new Map<WebDatabaseTableLayoutFieldName<TTableType>, WebDatabaseQueryActionBoundRange>();
        for (const pQuery of pBlock) {
            lBlockPropertyList.set(pQuery.property, pQuery.action!);
        }

        // Iterate each table index and check if it matches the block.
        const lMatchingIndex: WebDatabaseTableLayoutTableLayoutIndex<TTableType> | null = (() => {
            // Iterate each table index.
            LAYOUT_INDEX: for (const lIndexName of this.mTable.tableLayout.indices) {
                // Read index from table layout.
                const lIndex: WebDatabaseTableLayoutTableLayoutIndex<TTableType> = this.mTable.tableLayout.index(lIndexName)!;

                // Must be the same number of properties.
                if (lIndex.keys.length !== lBlockPropertyList.size) {
                    continue;
                }

                // Check if each property of the block is included in the index.
                for (const lBlockPropertyKey of lBlockPropertyList.keys()) {
                    // When the index does not include the property, continue with next index.
                    if (!lIndex.keys.includes(lBlockPropertyKey)) {
                        continue LAYOUT_INDEX;
                    }
                }

                // When all properties are included, return the index.
                return lIndex;
            }

            // No matching index found.
            return null;
        })();

        // When no matching index was found, return null.
        if (!lMatchingIndex) {
            return null;
        }

        // When a matching index was found, generate a key range.
        const lLowerFilterValueList: Array<string | number> = new Array<string | number>();
        const lUpperFilterValueList: Array<string | number> = new Array<string | number>();

        // Add each bound range values to in specified index key order.
        for (const lIndexKey of lMatchingIndex.keys) {
            // Get the action for the index key. Key exists as the index was filtered by it.
            const lActionBoundRange: WebDatabaseQueryActionBoundRange = lBlockPropertyList.get(lIndexKey)!;

            // Set lower and upper filter value.
            lLowerFilterValueList.push(lActionBoundRange.lower);
            lUpperFilterValueList.push(lActionBoundRange.upper);
        }

        return {
            indexName: lMatchingIndex.name,
            keyRange: IDBKeyRange.bound(lLowerFilterValueList, lUpperFilterValueList, false, false)
        };
    }

    /**
     * Opens a cursor on the specified index and key range, iterating over all matching records.
     * For each record, the provided action callback is invoked with the current cursor.
     * The cursor continues automatically until all matching records have been processed.
     *
     * @param pQuery - The index name and key range to use for the cursor.
     * @param pAction - Callback function to execute for each cursor result.
     * 
     * @returns A promise that resolves when the cursor has iterated over all matching records.
     */
    private async openCursor(pQuery: WebDatabaseQueryIndexableKeyRange, pAction: (pCursor: IDBCursorWithValue) => void): Promise<void> {
        // Get table connection.
        const lTableConnection: IDBObjectStore = this.mTable.transaction.transaction.objectStore(this.mTable.tableLayout.tableName);

        // When a indexable key range was found, use it.
        const lCursorRequest: IDBRequest<IDBCursorWithValue | null> = lTableConnection.index(pQuery.indexName).openCursor(pQuery.keyRange);

        // Read anything and filter.
        return new Promise<void>((pResolve, pReject) => {
            // Reject on error.
            lCursorRequest.addEventListener('error', () => {
                pReject(new Exception(`Error fetching table.` + lCursorRequest.error, this));
            });

            // Resolve on success.
            lCursorRequest.addEventListener('success', () => {
                // Read event target like a shithead and resolve when cursor is eof.
                const lCursorResult: IDBCursorWithValue | null = lCursorRequest.result;
                if (!lCursorResult) {
                    pResolve();
                    return;
                }

                // Call action with the cursor result.
                pAction(lCursorResult);

                // Continue next value.
                lCursorResult.continue();
            });
        });
    }

    /**
     * Read data from table filtered by query.
     * When query index does not exists, it uses a expensive cursor filter.
     * 
     * @param pQuery - Query.
     * 
     * @returns Filtered item list. 
     */
    private async readQuery(pQuery: WebDatabaseQueryIndexableKeyRange): Promise<Array<any>> {
        // Get table connection.
        const lTableConnection: IDBObjectStore = this.mTable.transaction.transaction.objectStore(this.mTable.tableLayout.tableName);

        const lIndex: IDBIndex = lTableConnection.index(pQuery.indexName);

        // Execute read request with the set query action.
        const lRequest: IDBRequest<Array<any>> = lIndex.getAll(pQuery.keyRange);
        return new Promise<Array<any>>((pResolve, pReject) => {
            // Reject on error.
            lRequest.addEventListener('error', () => {
                pReject(new Exception(`Error fetching table.` + lRequest.error, this));
            });

            // Resolve on success.
            lRequest.addEventListener('success', () => {
                pResolve(lRequest.result);
            });
        });
    }
}

type WebDatabaseQueryPart<TTableType extends WebDatabaseTableType> = {
    property: WebDatabaseTableLayoutFieldName<TTableType>;
    action: WebDatabaseQueryActionBoundRange | null;
    link: WebDatabaseQueryLink;
};

type WebDatabaseQueryBlock<TTableType extends WebDatabaseTableType> = Array<WebDatabaseQueryPart<TTableType>>;

type WebDatabaseQueryLink = 'AND' | 'OR';

type WebDatabaseQueryIndexableKeyRange = {
    indexName: string;
    keyRange: IDBKeyRange;
};