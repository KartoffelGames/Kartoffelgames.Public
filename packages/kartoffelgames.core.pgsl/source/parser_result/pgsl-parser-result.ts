import { PgslDeclarationType } from "../enum/pgsl-declaration-type.enum.ts";
import type { PgslTrace } from '../trace/pgsl-trace.ts';
import { PgslParserResultBinding } from "./pgsl-parser-result-binding.ts";
import { PgslParserResultParameter } from "./pgsl-parser-result-parameter.ts";
import { PgslParserResultIncident } from "./pgsl-parser-result.incident.ts";

/**
 * Represents the result of parsing PGSL source code, including transpiled code,
 * source maps, metadata, and any incidents encountered during parsing.
 */
export class PgslParserResult {
    private readonly mSource: string;
    private readonly mSourceMap: string | null;
    private readonly mMeta: PgslParserResultMeta;
    private readonly mIncidents: Array<PgslParserResultIncident>;

    /**
     * Gets the list of bindings extracted from the PGSL source.
     * 
     * @returns A readonly array of PgslParserResultBinding instances.
     */
    public get bindings(): ReadonlyArray<PgslParserResultBinding> {
        return this.mMeta.bindings;
    }

    /**
     * Gets the list of trace incidents encountered during parsing.
     * 
     * @returns A readonly array of PgslTraceIncident instances.
     */
    public get incidents(): ReadonlyArray<PgslParserResultIncident> {
        return this.mIncidents;
    }

    /**
     * Gets the list of shader parameters extracted from the PGSL source.
     * 
     * @returns A readonly array of PgslParserResultParameter instances.
     */
    public get parameters(): ReadonlyArray<PgslParserResultParameter> {
        return this.mMeta.parameters;
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
        this.mIncidents = this.convertIncidents(pTrace);

        // Skip metadata extraction if there are incidents.
        if (pTrace.incidents.length > 0) {
            // Set empty metadata on incidents.
            this.mMeta = {
                bindings: [],
                parameters: [],
            };
        } else {
            this.mMeta = {
                bindings: this.convertBindings(pTrace),
                parameters: this.convertShaderParameter(pTrace),
                // TODO: entry points
            };
        }
    }

    /**
     * Converts trace incidents to parser result incidents.
     * 
     * @param pTrace - The trace containing incidents. 
     * 
     * @returns An array of parser result incidents.
     */
    private convertIncidents(pTrace: PgslTrace): Array<PgslParserResultIncident> {
        return pTrace.incidents.map(incident => new PgslParserResultIncident(
            incident.message,
            incident.syntaxTree?.meta.position.start.line ?? 0,
            incident.syntaxTree?.meta.position.end.column ?? 0
        ));
    }

    /**
     * Converts trace bindings to parser result bindings.
     * 
     * @param pTrace - Parser trace.
     * 
     * @returns Array of parser result bindings. 
     */
    private convertBindings(pTrace: PgslTrace): Array<PgslParserResultBinding> {
        const lBindings: Array<PgslParserResultBinding> = [];
        for (const lBinding of pTrace.valueDeclarations) {
            // Skip non-binding values.
            if (lBinding.bindingInformation === null) {
                continue;
            }

            // Create a new parser result binding.
            lBindings.push(new PgslParserResultBinding(lBinding, pTrace));
        }
        return lBindings;
    }

    /**
     * Converts trace shader parameters to parser result parameters.
     * 
     * @param pTrace - Parser trace.
     * 
     * @returns Array of parser result parameters. 
     */
    private convertShaderParameter(pTrace: PgslTrace): Array<PgslParserResultParameter> {
        const lParameters: Array<PgslParserResultParameter> = [];
        for (const lValue of pTrace.valueDeclarations) {
            // Skip non-parameter values.
            if (lValue.declarationType !== PgslDeclarationType.Param) {
                continue;
            }

            // Map parameter names to their types.
            lParameters.push(new PgslParserResultParameter(lValue));
        }
        return lParameters;
    }
}

type PgslParserResultMeta = {
    bindings: Array<PgslParserResultBinding>;
    parameters: Array<PgslParserResultParameter>;
};