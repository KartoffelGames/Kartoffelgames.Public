/**
 * Basic result object for PGSL parser, containing meta values and incidents.
 */
export class PgslParserResultObject {
    private mMetaValues: Map<string, string>;

    /**
     * Get meta values of result object, such as custom annotations or compiler directives.
     * 
     * @returns A readonly map of meta values by their keys.
     */
    public get metaValues(): ReadonlyMap<string, string> {
        return this.mMetaValues;
    }

    /**
     * Creates a new PGSL parser result object.
     */
    public constructor(pMetaValues: Map<string, string>) {
        this.mMetaValues = new Map<string, string>(pMetaValues);
    }
}