import { Dictionary, Exception } from '@kartoffelgames/core';
import { TableType } from '../layout/web-database-table-layout.ts';
import { WebDatabaseTable } from '../web-database-table.ts';
import { WebDatabaseQueryAction } from './web-database-query-action.ts';

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
     * @param pIndexOrPropertyName - A index or a property name.
     *  
     * @returns query action. 
     */
    public and(pIndexOrPropertyName: string): WebDatabaseQueryAction<TTableType> {
        // Create query part.
        const lPart: WebDatabaseQueryPart = {
            indexKey: pIndexOrPropertyName,
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
     * Execute query and get all values.
     * 
     * @returns filtered query result. 
     */
    public async execute(): Promise<Array<InstanceType<TTableType>>> {
        // Must have queries.
        if (this.mQueryList.length === 0) {
            throw new Exception('No queries specified.', this);
        }

        // Devide queries into "AND" blocks.
        const lQueryBlockList: Array<Array<WebDatabaseQueryPart>> = new Array<Array<WebDatabaseQueryPart>>();

        // Add first block.
        lQueryBlockList.push(new Array<WebDatabaseQueryPart>());

        // Assign every query into a block.
        for (const lQuery of this.mQueryList) {
            // Create new block on any or chain.
            if (lQuery.link === 'OR') {
                lQueryBlockList.push(new Array<WebDatabaseQueryPart>());
            }

            // Add query to latest block.
            lQueryBlockList.at(-1)!.push(lQuery);
        }

        // Special solution for single query single block queries.
        // Not neet to filter or merge.
        if (lQueryBlockList.length === 1 && lQueryBlockList[0].length === 1) {
            // Read and convert single block.
            return this.convertDataToTableType(await this.readQuery(lQueryBlockList[0][0]));
        }

        // Special solution for single block queries.
        // No need to merge.
        if (lQueryBlockList.length === 1) {
            const lQueryResult: Dictionary<string | number, any> = await this.readQueryBlock(lQueryBlockList[0]);

            // Read and convert single block.
            return this.convertDataToTableType(lQueryResult.values());
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
        return this.convertDataToTableType(lGreatestResultSet.values());
    }

    /**
     * Chain database query with "OR".
     * 
     * @param pIndexOrPropertyName - A index or a property name.
     *  
     * @returns query action. 
     */
    public or(pIndexOrPropertyName: string): WebDatabaseQueryAction<TTableType> {
        // Create query part.
        const lPart: WebDatabaseQueryPart = {
            indexKey: pIndexOrPropertyName,
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
     * Convert all data items into table type objects.
     * 
     * @param pData - Data objects.
     * 
     * @returns converted data list. 
     */
    private convertDataToTableType(pData: Iterable<any>): Array<InstanceType<TTableType>> {
        const lResultList: Array<InstanceType<TTableType>> = new Array<InstanceType<TTableType>>();

        // Convert each item into type.
        for (const lSourceObject of pData) {
            const lTargetObject: InstanceType<TTableType> = new this.mTable.tableType() as InstanceType<TTableType>;

            for (const lKey of Object.keys(lSourceObject)) {
                (<any>lTargetObject)[lKey] = lSourceObject[lKey];
            }

            lResultList.push(lTargetObject);
        }

        return lResultList;
    }

    /**
     * Read data from table filtered by query.
     * When query index does not exists, it uses a expensive cursor filter.
     * 
     * @param pQuery - Query.
     * 
     * @returns Filtered item list. 
     */
    private async readQuery(pQuery: WebDatabaseQueryPart): Promise<Array<any>> {
        // Query must have a action.
        if (!pQuery.action) {
            throw new Exception('Query has no assigned action.', this);
        }

        // Get table connection.
        const lTableConnection: IDBObjectStore = this.mTable.transaction.transaction.objectStore(this.mTable.tableType.name);

        // Try to find index key.
        const lIndexName: string | null = (() => {
            const lIndexNameList: DOMStringList = lTableConnection.indexNames;
            for (let lIndexNameListIndex: number = 0; lIndexNameListIndex < lIndexNameList.length; lIndexNameListIndex++) {
                const lIndexName: string = lIndexNameList[lIndexNameListIndex];
                if (lIndexName === pQuery.indexKey) {
                    return lIndexName;
                }
            }

            return null;
        })();

        // When index was found, use index.
        if (lIndexName) {
            const lIndex: IDBIndex = lTableConnection.index(lIndexName);

            // Execute read request with the set query action.
            const lRequest: IDBRequest<Array<any>> = lIndex.getAll(pQuery.action);
            return new Promise<Array<any>>((pResolve, pReject) => {
                // Reject on error.
                lRequest.addEventListener('error', (pEvent) => {
                    const lTarget: IDBRequest<Array<any>> = (<IDBRequest<Array<any>>>pEvent.target);
                    pReject(new Exception(`Error fetching table.` + lTarget.error, this));
                });

                // Resolve on success.
                lRequest.addEventListener('success', (pEvent) => {
                    // Read event target like a shithead.
                    const lTarget: IDBRequest<Array<any>> = pEvent.target as IDBRequest<Array<any>>;

                    pResolve(lTarget.result);
                });
            });
        }

        // When no index was found you fucked up.
        // Read anything and filter.
        const lCursorRequest: IDBRequest<IDBCursorWithValue | null> = lTableConnection.openCursor();
        const lFiteredList: Array<any> = new Array<any>();
        return new Promise<Array<any>>((pResolve, pReject) => {
            // Reject on error.
            lCursorRequest.addEventListener('error', (pEvent) => {
                const lTarget: IDBRequest<IDBCursorWithValue | null> = (<IDBRequest<IDBCursorWithValue | null>>pEvent.target);
                pReject(new Exception(`Error fetching table.` + lTarget.error, this));
            });

            // Resolve on success.
            lCursorRequest.addEventListener('success', (pEvent) => {
                // Read event target like a shithead and resolve when cursor is eof.
                const lTarget: IDBRequest<IDBCursorWithValue | null> = pEvent.target as IDBRequest<IDBCursorWithValue | null>;
                const lCursorResult: IDBCursorWithValue | null = lTarget.result;
                if (!lCursorResult) {
                    pResolve(lFiteredList);
                    return;
                }

                // Get value of filtered propery.
                const lFiltedValue: any = lCursorResult.value[pQuery.indexKey];

                // Append row when value is included in assigned action.
                if (pQuery.action!.includes(lFiltedValue)) {
                    lFiteredList.push(lCursorResult.value);
                }

                // Continue next value.
                lCursorResult.continue();
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
        const lTableConnection: IDBObjectStore = this.mTable.transaction.transaction.objectStore(this.mTable.tableType.name);

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
    indexKey: string;
    action: IDBKeyRange | null;
    link: WebDatabaseQueryLink;
};

type WebDatabaseQueryLink = 'AND' | 'OR';