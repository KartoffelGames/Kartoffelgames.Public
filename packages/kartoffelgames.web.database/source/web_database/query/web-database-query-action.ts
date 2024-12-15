import { TableType } from '../layout/web-database-table-layout';
import { WebDatabaseQuery } from './web-database-query';

export class WebDatabaseQueryAction<TTableType extends TableType> {
    private readonly mActionCallback: WebDatabaseQueryActionCallback;
    private readonly mDatabaseQuery: WebDatabaseQuery<TTableType>;

    /**
     * Constructor.
     * 
     * @param pActionCallback - Callback to send back action of query.
     * @param pQuery - Parent query.
     */
    public constructor(pQuery: WebDatabaseQuery<TTableType>, pActionCallback: WebDatabaseQueryActionCallback) {
        this.mActionCallback = pActionCallback;
        this.mDatabaseQuery = pQuery;
    }

    /**
     * Request rows with the value between lower and upper value.
     * 
     * @param pLowerValue - Lower value.
     * @param pUpperValue - Upper value.
     * 
     * @returns query. 
     */
    public between(pLowerValue: WebDatabaseQueryActionValue, pUpperValue: WebDatabaseQueryActionValue): WebDatabaseQuery<TTableType> {
        // Create database range action.
        const lAction: IDBKeyRange = IDBKeyRange.bound(pLowerValue, pUpperValue, false, false);

        // Send action to parent query.
        this.mActionCallback(lAction);

        // Return parent query to chain another.
        return this.mDatabaseQuery;
    }

    /**
     * Request rows with the value greather than {@link pValue}.
     * 
     * @param pValue - Value.
     * 
     * @returns query. 
     */
    public greaterThan(pValue: WebDatabaseQueryActionValue): WebDatabaseQuery<TTableType> {
        // Create database range action.
        const lAction: IDBKeyRange = IDBKeyRange.lowerBound(pValue, false);

        // Send action to parent query.
        this.mActionCallback(lAction);

        // Return parent query to chain another.
        return this.mDatabaseQuery;
    }

    /**
     * Request rows with the exact value.
     * 
     * @param pValue - Value.
     * 
     * @returns query. 
     */
    public is(pValue: WebDatabaseQueryActionValue): WebDatabaseQuery<TTableType> {
        // Create database range action.
        const lAction: IDBKeyRange = IDBKeyRange.only(pValue);

        // Send action to parent query.
        this.mActionCallback(lAction);

        // Return parent query to chain another.
        return this.mDatabaseQuery;
    }

    /**
     * Request rows with the value lower than {@link pValue}.
     * 
     * @param pValue - Value.
     * 
     * @returns query. 
     */
    public lowerThan(pValue: WebDatabaseQueryActionValue): WebDatabaseQuery<TTableType> {
        // Create database range action.
        const lAction: IDBKeyRange = IDBKeyRange.upperBound(pValue, false);

        // Send action to parent query.
        this.mActionCallback(lAction);

        // Return parent query to chain another.
        return this.mDatabaseQuery;
    }
}

type WebDatabaseQueryActionValue = number | string | Array<number | string>;
type WebDatabaseQueryActionCallback = (pAction: IDBKeyRange) => void;