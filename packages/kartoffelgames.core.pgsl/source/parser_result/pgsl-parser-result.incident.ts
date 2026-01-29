/**
 * Represents an incident (error or warning) encountered during PGSL parsing.
 */
export class PgslParserResultIncident {
    private readonly mBoundary: PgslParserResultIncidentBoundary;
    private readonly mMessage: string;
    
    /**
     * Gets the column number of the incident.
     *
     * @returns The column number as a number.
     */
    public get column(): number {
        return this.mBoundary.column;
    }

    /**
     * Gets the line number of the incident.
     *
     * @returns The line number as a number.
     */
    public get line(): number {
        return this.mBoundary.line;
    }

    /**
     * Gets the incident message.
     *
     * @returns The incident message string.
     */
    public get message(): string {
        return this.mMessage;
    }

    /**
     * Creates a new PGSL parser result incident.
     * 
     * @param pMessage The incident message.
     * @param pLine The line number of the incident.
     * @param pColumn The column number of the incident.
     */
    public constructor(pMessage: string, pLine: number, pColumn: number) {
        this.mMessage = pMessage;
        this.mBoundary = { line: pLine, column: pColumn };
    }
}

type PgslParserResultIncidentBoundary = {
    line: number;
    column: number;
};