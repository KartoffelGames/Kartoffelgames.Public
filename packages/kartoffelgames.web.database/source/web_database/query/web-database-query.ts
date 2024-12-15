import { Dictionary, Exception } from '@kartoffelgames/core';
import { TableType } from '../layout/web-database-table-layout';
import { WebDatabaseTable } from '../web-database-table';
import { WebDatabaseQueryAction } from './web-database-query-action';

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

        // Get key of identity, identity is allways set.
        const lTableConnection: IDBObjectStore = this.mTable.transaction.transaction.objectStore(this.mTable.tableType.name);
        const lIdentityKey: string = lTableConnection.keyPath as string;

        const lQueryBlockValueList: Array<Dictionary<string | number, any>> = new Array<Dictionary<string | number, any>>();
        for (const lQueryBlock of lQueryBlockList) {
            lQueryBlockValueList.push();
        }
    }

    private readQueryBlock(pBlock: Array<WebDatabaseQueryPart>): Promise<Array<any>> {

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
    private convertDataToTableType(pData: Array<any>): Array<InstanceType<TTableType>> {
        // Convert each item into type.
        return pData.map((pSourceObject: any) => {
            const lTargetObject: InstanceType<TTableType> = new this.mTable.tableType() as InstanceType<TTableType>;

            for (const lKey of Object.keys(pSourceObject)) {
                (<any>lTargetObject)[lKey] = pSourceObject[lKey];
            }

            return lTargetObject;
        });
    }
}

type WebDatabaseQueryPart = {
    indexKey: string;
    action: IDBKeyRange | null;
    link: WebDatabaseQueryLink;
};

type WebDatabaseQueryLink = 'AND' | 'OR';