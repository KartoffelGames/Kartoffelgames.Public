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

    // TODO: readFirst()
    // TODO: readList()
}

type WebDatabaseQueryPart = {
    indexKey: string;
    action: IDBKeyRange | null;
    link: WebDatabaseQueryLink;
};

type WebDatabaseQueryLink = 'AND' | 'OR';