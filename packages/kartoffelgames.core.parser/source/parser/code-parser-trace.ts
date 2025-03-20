import { Exception } from '../../../kartoffelgames.core/source/index.ts';
import type { Graph } from '../graph/graph.ts';

/**
 * Code parser exceptions holding the top incident.
 * Can save a complete incident list on debug mode.
 */
export class CodeParserTrace<TTokenType extends string> {
    private readonly mIncidents: Array<CodeParserTraceIncident<TTokenType>> | null;
    private mTop: CodeParserTraceIncident<TTokenType> | null;
    private mIsAborted: boolean;

    /**
     * Error column end.
     */
    public get columnEnd(): number {
        if (!this.mTop) {
            return 1;
        }

        return this.mTop.range.columnEnd;
    }

    /**
     * Error column start.
     */
    public get columnStart(): number {
        if (!this.mTop) {
            return 1;
        }

        return this.mTop.range.columnStart;
    }

    /**
     * Affected graph of error.
     */
    public get graph(): Graph<TTokenType> | null {
        if (!this.mTop) {
            return null;
        }

        return this.mTop.graph;
    }

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
     * Is the parsing process aborted.
     */
    public get isAborted(): boolean {
        return this.mIsAborted;
    }

    /**
     * Error line end.
     */
    public get lineEnd(): number {
        if (!this.mTop) {
            return 1;
        }

        return this.mTop.range.lineEnd;
    }

    /**
     * Error line start.
     */
    public get lineStart(): number {
        if (!this.mTop) {
            return 1;
        }

        return this.mTop.range.lineStart;
    }

    public get message(): string {
        if (!this.mTop) {
            return 'Unknown parser error';
        }

        return this.mTop.error;
    }

    /**
     * Constructor.
     * 
     * @param pDebug - Keeps a complete list of all incidents.
     */
    public constructor(pDebug: boolean) {
        this.mIsAborted = false;
        this.mTop = null;

        if (pDebug) {
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
    public push(pError: string, pGraph: Graph<TTokenType> | null, pLineStart: number, pColumnStart: number, pLineEnd: number, pColumnEnd: number): void {
        // Calculate priority
        const lPriority: number = (pLineEnd * 10000) + pColumnEnd;

        // Create and push a debuging incident when debugging is enabled.
        if (this.mIncidents !== null) {
            // Create new incident. Only purpose is that not every time a incident is pushed a new item must be generated without debug mode.
            const lDebugIncident: CodeParserTraceIncident<TTokenType> = {
                error: pError,
                priority: lPriority,
                graph: pGraph,
                range: {
                    lineStart: pLineStart,
                    columnStart: pColumnStart,
                    lineEnd: pLineEnd,
                    columnEnd: pColumnEnd,
                }
            };

            this.mIncidents.push(lDebugIncident);
        }

        // Skip incident creation when priority is lower than previous top incident.
        if (this.mTop && lPriority < this.mTop.priority) {
            return;
        }

        // Create new Incident and push to top.
        this.setTop({
            error: pError,
            priority: lPriority,
            graph: pGraph,
            range: {
                lineStart: pLineStart,
                columnStart: pColumnStart,
                lineEnd: pLineEnd,
                columnEnd: pColumnEnd,
            }
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
type CodeParserTraceIncident<TTokenType extends string> = {
    error: string,
    priority: number;
    graph: Graph<TTokenType> | null;
    range: {
        lineStart: number;
        columnStart: number;
        lineEnd: number;
        columnEnd: number;
    };
};