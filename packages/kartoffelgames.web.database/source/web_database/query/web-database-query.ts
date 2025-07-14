import { Dictionary, Exception } from '@kartoffelgames/core';
import type { TableLayoutIndex, TableType, WebDatabaseTableLayout } from '../web-database-table-layout.ts';
import type { WebDatabaseTable } from '../web-database-table.ts';
import { WebDatabaseQueryAction, WebDatabaseQueryActionBoundRange } from './web-database-query-action.ts';

export class WebDatabaseQuery<TTableType extends TableType> {
    private readonly mQueryList: Array<WebDatabaseQueryPart>;
    private readonly mTable: WebDatabaseTable<TTableType>;

    /**
     * Constructor.
     * 
     * @param pTable - Table of query.
     */
    public constructor(pTable: WebDatabaseTable<TTableType>) {
        this.mTable = pTable;
        this.mQueryList = new Array<WebDatabaseQueryPart>();
    }

    /**
     * Chain database query with "AND".
     * 
     * @param pPropertyName - Property name.
     *  
     * @returns query action. 
     */
    public and(pPropertyName: string): WebDatabaseQueryAction<TTableType> {
        // Create query part.
        const lPart: WebDatabaseQueryPart = {
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

    public async delete(): Promise<void> {

    }

    /**
     * Chain database query with "OR".
     * 
     * @param pPropertyName - Property name.
     *  
     * @returns query action. 
     */
    public or(pPropertyName: string): WebDatabaseQueryAction<TTableType> {
        // Create query part.
        const lPart: WebDatabaseQueryPart = {
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
        const lQueryBlockList: Array<Array<WebDatabaseQueryPart>> = this.groupQueryBlock(this.mQueryList);

        // Convert each query block into a indexable key range.
        let lContainsUnindexableKeyRange: boolean = false;
        const lIndexableKeyRangeList: Array<WebDatabaseQueryIndexableKeyRange> = lQueryBlockList.map((pBlock: WebDatabaseQueryBlock): WebDatabaseQueryIndexableKeyRange => {
            // Convert block into indexable key range.
            const lIndexableKeyRange: WebDatabaseQueryIndexableKeyRange | null = this.generateIndexableKeyRange(pBlock);
            if (!lIndexableKeyRange) {
                throw new Exception(`No indexable key range for block found.`, this);
            }

            return lIndexableKeyRange;
        });

        // Shortcut when block contains a single indexable key range.
        if (lIndexableKeyRangeList.length === 1 && !lContainsUnindexableKeyRange) {
            // Read and convert single block.
            return this.mTable.parseToType(await this.readQuery(lIndexableKeyRangeList[0]));
        }










        // TODO: Optimize for single query blocks.
        // ---- ReadQueryBlock(block) => 
        // ---- OpenCursor(block, action) => Open a cursor and filter it with the block.

        // TODO: On 









        // Special solution for single query single block queries.
        // Not neet to filter or merge.
        if (lQueryBlockList.length === 1 && lQueryBlockList[0].length === 1) {
            // Read and convert single block.
            return this.mTable.parseToType(await this.readQuery(lQueryBlockList[0][0]));
        }

        // Special solution for single block queries.
        // No need to merge.
        if (lQueryBlockList.length === 1) {
            const lQueryResult: Dictionary<string | number, any> = await this.readQueryBlock(lQueryBlockList[0]);

            // Read and convert single block.
            return this.mTable.parseToType(lQueryResult.values());
        }

        // Read all query blocks.
        const lQueryBlockResultList: Set<Dictionary<string | number, any>> = new Set<Dictionary<string | number, any>>();
        for (const lQueryBlock of lQueryBlockList) {
            lQueryBlockResultList.add(await this.readQueryBlock(lQueryBlock));
        }

        // Find the greatest result set and use it as starting point.
        // Greater performance when you only need to merge 1 entry in a set of 100 instead.
        let lGreatestResultSet: Dictionary<string | number, any> = <any>null; // Will be set after the loop.
        for (const lQueryBlockResult of lQueryBlockResultList) {
            if (!lGreatestResultSet) {
                lGreatestResultSet = lQueryBlockResult;
                continue;
            }

            if (lGreatestResultSet.size < lQueryBlockResult.size) {
                lGreatestResultSet = lQueryBlockResult;
            }
        }

        // Remove the found set from iterator list.
        lQueryBlockResultList.delete(lGreatestResultSet!);

        // Merge remaining block result into.
        for (const lQueryBlockResult of lQueryBlockResultList) {
            for (const lQueryResultItem of lQueryBlockResult) {
                lGreatestResultSet.set(...lQueryResultItem);
            }
        }

        // Convert merged block.
        return this.mTable.parseToType(lGreatestResultSet.values());
    }

    /**
     * Group queries into blocks.
     * A block is a set of queries that are linked with "AND".
     * 
     * @param pQueryList - Query list.
     * 
     * @returns Query blocks.
     */
    private groupQueryBlock(pQueryList: Array<WebDatabaseQueryPart>): Array<WebDatabaseQueryBlock> {
        // Devide queries into "AND" blocks.
        const lQueryBlockList: Array<WebDatabaseQueryBlock> = new Array<WebDatabaseQueryBlock>();

        // Add first block.
        lQueryBlockList.push(new Array<WebDatabaseQueryPart>());

        // Assign every query into a block.
        for (const lQuery of pQueryList) {
            // Create new block on any or chain.
            if (lQuery.link === 'OR') {
                lQueryBlockList.push(new Array<WebDatabaseQueryPart>());
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
    private generateIndexableKeyRange(pBlock: WebDatabaseQueryBlock): WebDatabaseQueryIndexableKeyRange | null {
        // Read table layout for easy access.
        const lTableLayout: WebDatabaseTableLayout = this.mTable.tableLayout;

        // When block is single, only check if a index for it exists.
        if (pBlock.length === 1) {
            const lQueryPart: WebDatabaseQueryPart = pBlock[0];

            // When no index exists for the property.
            if (!lTableLayout.index(lQueryPart.property)) {
                return null;
            }

            return {
                indexName: lQueryPart.property,
                keyRange: IDBKeyRange.bound(lQueryPart.action!.lower, lQueryPart.action!.upper, true, true)
            };
        }

        // Read all used properties of the block.
        const lBlockPropertyList: Map<string, WebDatabaseQueryActionBoundRange> = new Map<string, WebDatabaseQueryActionBoundRange>();
        for (const pQuery of pBlock) {
            lBlockPropertyList.set(pQuery.property, pQuery.action!);
        }

        // Iterate each table index and check if it matches the block.
        const lMatchingIndex: TableLayoutIndex | null = (() => {
            // Iterate each table index.
            LAYOUT_INDEX: for (const lIndexName of this.mTable.tableLayout.indices) {
                // Read index from table layout.
                const lIndex: TableLayoutIndex = this.mTable.tableLayout.index(lIndexName)!;

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
            keyRange: IDBKeyRange.bound(lLowerFilterValueList, lUpperFilterValueList, true, true)
        };
    }

    private openCursor(pBlockList: Array<WebDatabaseQueryIndexableKeyRange>, pAction: (pCursor: IDBCursorWithValue) => boolean): Promise<Array<any>> {
        // Get table connection.
        const lTableConnection: IDBObjectStore = this.mTable.transaction.transaction.objectStore(this.mTable.tableLayout.tableName);

        // When a indexable key range was found, use it.
        let lCursorRequest: IDBRequest<IDBCursorWithValue | null>;
        if (pBlockList.length > 0) {
            lCursorRequest = lTableConnection.index(pBlockList[0].indexName).openCursor(pBlockList[0].keyRange);
        } else {
            lCursorRequest = lTableConnection.openCursor();
        }

        // List of remaining unprocessed blocks.
        const lRemainingBlocks: Array<WebDatabaseQueryIndexableKeyRange> = pBlockList.slice(1);

        // Read anything and filter.
        const lFiteredList: Array<any> = new Array<any>();
        return new Promise<Array<any>>((pResolve, pReject) => {
            // Reject on error.
            lCursorRequest.addEventListener('error', () => {
                pReject(new Exception(`Error fetching table.` + lCursorRequest.error, this));
            });

            // Resolve on success.
            lCursorRequest.addEventListener('success', () => {
                // Read event target like a shithead and resolve when cursor is eof.
                const lCursorResult: IDBCursorWithValue | null = lCursorRequest.result;
                if (!lCursorResult) {
                    pResolve(lFiteredList);
                    return;
                }

                // TODO: Filter result with remaining blocks.
                // THAT IS FUCKED UP FOR MULTIPLE REASONS. 
                // Find a good way to check if the current value matches a IDBKeyRange.
                // Read index.

                // TODO: That will not work as blocks can be chained with "OR" and not "AND". You useless. 
                for (const lBlock of lRemainingBlocks) {
                    // Read index of block.
                    const lIndex: TableLayoutIndex = this.mTable.tableLayout.index(lBlock.indexName)!;

                    // Create value range.
                    const lIndexValues: Array<string | number> = lIndex.keys.map((pKey) => {
                        // Get value of cursor for index key.
                        return lCursorResult!.value[pKey];
                    });

                    // Check if value is in range. // TODO: Make it cleaner.
                    if (!lBlock.keyRange.includes(lIndexValues)) {
                        // When value is not in range, continue with next value.
                        lCursorResult.continue();
                        return;
                    }
                }

                // Append row when value is included in assigned action.
                if (pAction(lCursorResult)) {
                    lFiteredList.push(lCursorResult.value);
                }

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
            lRequest.addEventListener('error', (pEvent) => {
                const lTarget: IDBRequest<Array<any>> = (<IDBRequest<Array<any>>>pEvent.target);
                pReject(new Exception(`Error fetching table.` + lTarget.error, this));
            });

            // Resolve on success.
            lRequest.addEventListener('success', () => {
                pResolve(lRequest.result);
            });
        });
    }

    /**
     * Read the result of a query block.
     * 
     * @param pBlock - Query block. Queries that are linked with an "AND"-Connection.
     * 
     * return filtered query result.
     */
    private async readQueryBlock(pBlock: Array<WebDatabaseQueryPart>): Promise<Dictionary<string | number, any>> {
        const lTableConnection: IDBObjectStore = this.mTable.transaction.transaction.objectStore(this.mTable.tableLayout.tableName);

        // Read all queries in parallel.
        const lQueryResultRequestList: Array<Promise<Array<any>>> = new Array<Promise<Array<any>>>();
        for (const lQuery of pBlock) {
            lQueryResultRequestList.push(this.readQuery(lQuery));
        }

        // Wait for all queries to finish.
        const lQueryResultList: Array<Array<any>> = await Promise.all(lQueryResultRequestList);

        // Get key of identity, identity is allways set and a single key.
        const lIdentityKey: string = lTableConnection.keyPath as string;

        // Conver all result list into an identity map.
        const lIdentityMapList: Array<Dictionary<string | number, any>> = new Array<Dictionary<string | number, any>>();
        for (const lQueryResult of lQueryResultList) {
            // Map each item with its identity.
            const lItemMap: Dictionary<string | number, any> = new Dictionary<string | number, any>();
            for (const lItem of lQueryResult) {
                lItemMap.set(lItem[lIdentityKey], lItem);
            }

            lIdentityMapList.push(lItemMap);
        }

        // Find the smallest identity set.
        let lSmallestItemSet: Dictionary<string | number, any> = lIdentityMapList[0];
        for (const lIdentityMap of lIdentityMapList) {
            if (lIdentityMap.size < lSmallestItemSet.size) {
                lSmallestItemSet = lIdentityMap;
            }
        }

        // Remove smallest identity set from map list.
        lIdentityMapList.splice(lIdentityMapList.indexOf(lSmallestItemSet), 1);

        // Filter the smallest set for each remaining query.
        for (const lFilteringQuery of lIdentityMapList) {
            // Remove item from result list, when it does not exists in any other query result.
            for (const lResultItemKey of lSmallestItemSet.keys()) {
                if (!lFilteringQuery.has(lResultItemKey)) {
                    lSmallestItemSet.delete(lResultItemKey);
                }
            }
        }

        return lSmallestItemSet;
    }
}

type WebDatabaseQueryPart = {
    property: string;
    action: WebDatabaseQueryActionBoundRange | null;
    link: WebDatabaseQueryLink;
};

type WebDatabaseQueryBlock = Array<WebDatabaseQueryPart>;

type WebDatabaseQueryLink = 'AND' | 'OR';

type WebDatabaseQueryIndexableKeyRange = {
    indexName: string;
    keyRange: IDBKeyRange;
};