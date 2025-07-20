import { Exception } from '@kartoffelgames/core';
import type { Graph } from './graph/graph.ts';

/**
 * Code parser exceptions holding the top incident.
 * Can save a complete incident list on debug mode.
 */
export class CodeParserTrace<TTokenType extends string> {
    private readonly mIncidents: Array<CodeParserTraceIncident<TTokenType>> | null;
    private mTop: CodeParserTraceIncident<TTokenType>;

    /**
     * Get a complete incident list of all incidents.
     * Only available in debug mode.
     */
    public get incidents(): Array<CodeParserTraceIncident<TTokenType>> {
        if (this.mIncidents === null) {
            throw new Exception('A complete incident list is only available on debug mode.', this);
        }

        return this.mIncidents;
    }

    /**
     * Get the current top incident of trace.
     */
    public get top(): CodeParserTraceIncident<TTokenType> {
        return this.mTop;
    }

    /**
     * Constructor.
     * 
     * @param pKeepTraceIncidents - Keep a complete list of all incidents.
     */
    public constructor(pKeepTraceIncidents: boolean) {
        // Set a default top incident.
        this.mTop = {
            message: 'Unknown parser error',
            priority: 0,
            graph: null,
            range: {
                lineStart: 1,
                columnStart: 1,
                lineEnd: 1,
                columnEnd: 1,
            },
            cause: null
        };

        // Create a incident list when debug mode is enabled.
        if (pKeepTraceIncidents) {
            this.mIncidents = new Array<CodeParserTraceIncident<TTokenType>>();
        } else {
            this.mIncidents = null;
        }
    }

    /**
     * Push a new error incident.
     * 
     * @param pError - General error element.
     * @param pGraph - Graph where error occurred.
     * @param pStartToken - Staring token of error.
     * @param pEndToken - End topen of error. 
     */
    public push(pError: string, pGraph: Graph<TTokenType> | null, pLineStart: number, pColumnStart: number, pLineEnd: number, pColumnEnd: number, pOverridePriority: boolean = false, pErrorCause: unknown = null): void {
        // Calculate priority
        let lPriority: number;
        if (pOverridePriority) {
            // Set new top. :)
            lPriority = this.mTop.priority + 1;
        } else {
            lPriority = (pLineEnd * 10000) + pColumnEnd;
        }

        // Create and push a debuging incident when debugging is enabled.
        if (this.mIncidents !== null) {
            // Create new incident. Only purpose is that not every time a incident is pushed a new item must be generated without debug mode.
            const lDebugIncident: CodeParserTraceIncident<TTokenType> = {
                message: pError,
                priority: lPriority,
                graph: pGraph,
                range: {
                    lineStart: pLineStart,
                    columnStart: pColumnStart,
                    lineEnd: pLineEnd,
                    columnEnd: pColumnEnd,
                },
                cause: pErrorCause
            };

            this.mIncidents.push(lDebugIncident);
        }

        // Skip incident creation when priority is lower than previous top incident.
        if (this.mTop && lPriority < this.mTop.priority) {
            return;
        }

        // Create new Incident and push to top.
        this.setTop({
            message: pError,
            priority: lPriority,
            graph: pGraph,
            range: {
                lineStart: pLineStart,
                columnStart: pColumnStart,
                lineEnd: pLineEnd,
                columnEnd: pColumnEnd,
            },
            cause: pErrorCause
        });
    }

    /**
     * Sets the top incident for the code parser exception.
     * 
     * @param pIncident - The incident to set as the top incident.
     */
    private setTop(pIncident: CodeParserTraceIncident<TTokenType>): void {
        this.mTop = pIncident;
    }
}
export type CodeParserTraceIncident<TTokenType extends string> = {
    message: string,
    cause: unknown,
    priority: number;
    graph: Graph<TTokenType> | null;
    range: {
        lineStart: number;
        columnStart: number;
        lineEnd: number;
        columnEnd: number;
    };
};