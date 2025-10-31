import type { PgslTrace, PgslTraceIncident } from '../trace/pgsl-trace.ts';
import { PgslParserResultBinding } from "./pgsl-parser-result-binding.ts";

export class PgslParserResult {
    private readonly mSource: string;
    private readonly mSourceMap: string | null;
    private readonly mMeta: PgslParserResultMeta;

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
    public constructor(pSource: string, pSourceMap: string | null, pTrace: PgslTrace) {
        this.mSource = pSource;
        this.mSourceMap = pSourceMap;
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
            bindings: this.readBindingsFromTrace(pTrace)
        };
    }

    private readBindingsFromTrace(pTrace: PgslTrace): Array<PgslParserResultBinding> {
        const lBindings: Array<PgslParserResultBinding> = [];
        for (const lBinding of pTrace.valueDeclarations) {
            // Skip non-binding values.
            if(lBinding.bindingInformation === null) {
                continue;
            }

            lBindings.push(null); // TODO:
        }
        return lBindings;
    }
}

type PgslParserResultMeta = {
    incidents: Array<PgslTraceIncident>;
    bindings: Array<PgslParserResultBinding>;
};