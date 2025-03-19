import { Exception } from '../../../kartoffelgames.core/source/index.ts';
import type { Graph } from '../graph/graph.ts';

/**
 * Code parser exceptions holding the top incident.
 * Can save a complete incident list on debug mode.
 */
export class CodeParserException<TTokenType extends string> extends Error {
    private readonly mIncidents: Array<CodeParserExceptionIncident<TTokenType>> | null;
    private mTop: CodeParserExceptionIncident<TTokenType> | null;
    private mIsAborted: boolean;

    /**
     * Affected graph of error.
     */
    public get affectedGraph(): Graph<TTokenType> | null {
        if (!this.mTop) {
            return null;
        }

        return this.mTop.graph;
    }

    /**
     * Cause of exception.
     */
    public override get cause(): unknown {
        if (!this.mTop) {
            return super.cause;
        }

        return this.mTop.error;
    }

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
     * Get a complete incident list of all incidents.
     * Only available in debug mode.
     */
    public get incidents(): Array<CodeParserExceptionIncident<TTokenType>> {
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

    /**
     * Constructor.
     * 
     * @param pDebug - Keeps a complete list of all incidents.
     */
    public constructor(pDebug: boolean) {
        super('Unknown parser error');

        this.mIsAborted = false;
        this.mTop = null;

        if (pDebug) {
            this.mIncidents = new Array<CodeParserExceptionIncident<TTokenType>>();
        } else {
            this.mIncidents = null;
        }
    }


    /**
     * Aborts the current parsing process and logs an error with the specified details.
     * 
     * @param pError - The error object or any value that can be converted to an error object.
     * @param pGraph - The graph associated with the error, or null if not applicable.
     * @param pLineStart - The starting line number of the error range.
     * @param pColumnStart - The starting column number of the error range.
     * @param pLineEnd - The ending line number of the error range.
     * @param pColumnEnd - The ending column number of the error range.
     */
    public abort(pError: unknown, pGraph: Graph<TTokenType> | null, pLineStart: number, pColumnStart: number, pLineEnd: number, pColumnEnd: number): void {
        // Convert any non error object to an error object.
        const lError: Error = (pError instanceof Error) ? pError : new Error((<any>pError).toString());

        // Set abort flag.
        this.mIsAborted = true;

        // Create new Incident and push to top.
        this.setTop({
            error: lError,
            priority: Number.MAX_VALUE,
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
     * Push a new error incident.
     * 
     * @param pError - General error element.
     * @param pGraph - Graph where error occurred.
     * @param pStartToken - Staring token of error.
     * @param pEndToken - End topen of error. 
     */
    public push(pError: unknown, pGraph: Graph<TTokenType> | null, pLineStart: number, pColumnStart: number, pLineEnd: number, pColumnEnd: number): void {
        // Calculate priority
        const lPriority: number = (pLineEnd * 10000) + pColumnEnd;

        // Create and push a debuging incident when debugging is enabled.
        if (this.mIncidents !== null) {
            const lError: Error = (pError instanceof Error) ? pError : new Error((<any>pError).toString());

            // Create new incident. Only purpose is that not every time a incident is pushed a new item must be generated without debug mode.
            const lDebugIncident: CodeParserExceptionIncident<TTokenType> = {
                error: lError,
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

        // Convert any non error object to an error object.
        const lError: Error = (pError instanceof Error) ? pError : new Error((<any>pError).toString());

        // Create new Incident and push to top.
        this.setTop({
            error: lError,
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
    private setTop(pIncident: CodeParserExceptionIncident<TTokenType>): void {
        this.mTop = pIncident;

        // Set error message as error message property can not be overriden.
        this.message = pIncident.error.message;
    }
}
type CodeParserExceptionIncident<TTokenType extends string> = {
    error: Error,
    priority: number;
    graph: Graph<TTokenType> | null;
    range: {
        lineStart: number;
        columnStart: number;
        lineEnd: number;
        columnEnd: number;
    };
};