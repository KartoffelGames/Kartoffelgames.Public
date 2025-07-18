import type { WebDatabaseTableType } from '../web-database-table-layout.ts';
import type { WebDatabaseQuery } from './web-database-query.ts';

/**
 * Provides chainable query actions for filtering table rows by value ranges or exact matches.
 */
export class WebDatabaseQueryAction<TTableType extends WebDatabaseTableType> {
    // Hardcoded constants for minimum and maximum values.
    private static readonly MIN_STRING_VALUE: string = '\u0000';
    private static readonly MAX_STRING_VALUE_LENGTH: string = '\uffff';
    private static readonly MIN_NUMBER_VALUE: number = Number.MIN_VALUE;
    private static readonly MAX_NUMBER_VALUE_LENGTH: number = Number.MAX_VALUE;

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
     * Bound values are exclusive by default.
     * 
     * @param pLowerValue - Lower value.
     * @param pUpperValue - Upper value.
     * 
     * @returns query. 
     */
    public between<T extends WebDatabaseQueryActionValue>(pLowerValue: T, pUpperValue: T): WebDatabaseQuery<TTableType> {
        // Create database range action.
        const lAction: WebDatabaseQueryActionBoundRange = {
            lower: this.alterValueSpecificity(pLowerValue, 1),
            upper: this.alterValueSpecificity(pUpperValue, -1)
        };

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
    public greaterThan<T extends WebDatabaseQueryActionValue>(pValue: T): WebDatabaseQuery<TTableType> {
        const lIsKeyString: boolean = typeof pValue === 'string';

        // Create database range action.
        const lAction: WebDatabaseQueryActionBoundRange = {
            lower: this.alterValueSpecificity(pValue, 1),
            upper: lIsKeyString ? WebDatabaseQueryAction.MAX_STRING_VALUE_LENGTH : WebDatabaseQueryAction.MAX_NUMBER_VALUE_LENGTH,
        };

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
    public is<T extends WebDatabaseQueryActionValue>(pValue: T): WebDatabaseQuery<TTableType> {
        // Create database range action.
        const lAction: WebDatabaseQueryActionBoundRange = {
            lower: pValue,
            upper: pValue
        };

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
    public lowerThan<T extends WebDatabaseQueryActionValue>(pValue: T): WebDatabaseQuery<TTableType> {
        const lIsKeyString: boolean = typeof pValue === 'string';

        // Create database range action.
        const lAction: WebDatabaseQueryActionBoundRange = {
            lower: lIsKeyString ? WebDatabaseQueryAction.MIN_STRING_VALUE : WebDatabaseQueryAction.MIN_NUMBER_VALUE,
            upper: this.alterValueSpecificity(pValue, -1),
        };

        // Send action to parent query.
        this.mActionCallback(lAction);

        // Return parent query to chain another.
        return this.mDatabaseQuery;
    }

    /**
     * Slightly adjusts the specificity of a value for range queries.
     * For numbers, it adds or subtracts a very small epsilon to move the value just above or below the original.
     * For strings, it modifies the last character's Unicode code point by one, making the string slightly greater or lesser.
     * This is useful for creating exclusive or inclusive bounds in database queries.
     *
     * @param pValue - The value to adjust (number or string).
     * @param pSpecificityDirection - Direction of adjustment: 1 for greater, -1 for lesser.
     * 
     * @returns The adjusted value with slightly increased or decreased specificity.
     */
    private alterValueSpecificity<T extends WebDatabaseQueryActionValue>(pValue: T, pSpecificityDirection: 1 | -1): T {
        let pSpecificityChange: number = pSpecificityDirection * 0.000000000000001;

        // If value is a number, apply specificity change directly.
        if (typeof pValue === 'number') {
            return Math.max(Math.min(pValue + pSpecificityChange, Number.MAX_VALUE), Number.MIN_VALUE) as T;
        }

        // Ceil specificity change value ceil to nearest absolute value as unicode characters are integers.
        pSpecificityChange = pSpecificityChange >= 0 ? Math.ceil(pSpecificityChange) : Math.floor(pSpecificityChange);

        // Read last character of string and apply specificity change.
        let lLastCharCode: number = pValue.charCodeAt(pValue.length - 1);
        lLastCharCode += pSpecificityChange;

        // Ensure we do not go below 0x0000 or above 0x0fff.
        lLastCharCode = Math.max(Math.min(lLastCharCode, 0xfff), 0);

        // Remove last character and add new one.
        return pValue.slice(0, -1) + String.fromCharCode(lLastCharCode) as T;
    }
}

/**
 * Defines the structure of a range action for querying a web database.
 * Lower and upper bounds are inclusive by default.
 */
export type WebDatabaseQueryActionBoundRange = {
    lower: WebDatabaseQueryActionValue;
    upper: WebDatabaseQueryActionValue;
};

type WebDatabaseQueryActionValue = number | string;
type WebDatabaseQueryActionCallback = (pAction: WebDatabaseQueryActionBoundRange) => void;