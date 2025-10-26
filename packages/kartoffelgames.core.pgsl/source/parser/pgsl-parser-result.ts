import type { PgslDocument } from '../syntax_tree/pgsl-document.ts';
import type { PgslTrace, PgslTraceIncident } from '../trace/pgsl-trace.ts';

export class PgslParserResult {
    private readonly mSource: string;
    private readonly mSourceMap: string | null;
    private readonly mMeta: PgslParserResultMeta;
    private readonly mDocument: PgslDocument;

    /**
     * Gets the PGSL document representation.
     * 
     * @returns The PgslDocument instance.
     */
    public get document(): PgslDocument {
        return this.mDocument;
    }

    /**
     * Gets the list of trace incidents encountered during parsing.
     * 
     * @returns A readonly array of PgslTraceIncident instances.
     */
    public get incidents(): ReadonlyArray<PgslTraceIncident> {
        return this.mMeta.incidents;
    }

    /**
     * Gets the transpiled source code.
     * 
     * @returns The transpiled PGSL source code as a string.
     */
    public get source(): string {
        return this.mSource;
    }

    /**
     * Gets the source map for the transpiled code, if available.
     * 
     * @returns The source map as a string or null if not available.
     */
    public get sourceMap(): string | null {
        return this.mSourceMap;
    }

    /**
     * Constructor.
     * 
     * @param pSource - The transpiled source code.
     * @param pSourceMap - The source map for the transpiled code, if available.
     * @param pDocument - The PGSL document representation.
     * @param pTrace - The trace information for debugging.
     */
    public constructor(pSource: string, pSourceMap: string | null, pDocument: PgslDocument, pTrace: PgslTrace) {
        this.mSource = pSource;
        this.mSourceMap = pSourceMap;
        this.mDocument = pDocument;
        this.mMeta = this.readFromTrace(pTrace);
    }

    /**
     * Reads metadata from the provided trace.
     * 
     * @param pTrace - The trace to read from.
     * 
     * @returns The extracted metadata.
     */
    private readFromTrace(pTrace: PgslTrace): PgslParserResultMeta {
        return {
            incidents: [...pTrace.incidents],
        };
    }
}

type PgslParserResultMeta = {
    incidents: Array<PgslTraceIncident>;
};