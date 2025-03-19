import { Exception } from "../../../kartoffelgames.core/source/index.ts";
import { Graph } from "../graph/graph.ts";

/**
 * Code parser exceptions holding the top incident.
 * Can save a complete incident list on debug mode.
 */
export class CodeParserException<TTokenType extends string> extends Error {
    private readonly mIncidents: Array<CodeParserExceptionIncident<TTokenType>> | null;
    private mTop: CodeParserExceptionIncident<TTokenType> | null;

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
     * Error line start.
     */
    public get lineStart(): number {
        if (!this.mTop) {
            return 1;
        }

        return this.mTop.range.lineStart;
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
     * Error line end.
     */
    public get lineEnd(): number {
        if (!this.mTop) {
            return 1;
        }

        return this.mTop.range.lineEnd;
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
     * Constructor.
     * 
     * @param pDebug - Keeps a complete list of all incidents.
     */
    public constructor(pDebug: boolean) {
        super('Unknown parser error');

        this.mTop = null;

        if (pDebug) {
            this.mIncidents = new Array<CodeParserExceptionIncident<TTokenType>>();
        } else {
            this.mIncidents = null;
        }
    }

    /**
     * Integrates another `CodeParserException` into the current exception.
     * When debug mode is enabled, all incidents from the provided exception are pushed to the current incident list.
     * If the priority of the top incident in the provided exception is higher than the current top incident, 
     * the top incident is replaced.
     * 
     * @param pException - The `CodeParserException` to integrate.
     */
    public integrate(pException: CodeParserException<TTokenType>): void {
        // Skip integration when there is no top incident.
        if (pException.mTop === null) {
            return;
        }

        // When debug mode is enabled, push all incidents to the current incident list.
        if (this.mIncidents !== null && pException.mIncidents !== null) {
            this.mIncidents.push(...pException.incidents);
        }

        // Check if priority is higher than current top incident and replace it when necessary.
        if (!this.mTop || pException.mTop.priority > this.mTop.priority) {
            this.setTop(pException.mTop);
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
    public push(pError: Error, pGraph: Graph<TTokenType>, pLineStart: number, pColumnStart: number, pLineEnd: number, pColumnEnd: number): void {
        // Calculate priority
        const lPriority: number = (pLineEnd * 10000) + pColumnEnd;

        // Create and push a debuging incident when debugging is enabled.
        if (this.mIncidents !== null) {
            // Create new incident. Only purpose is that not every time a incident is pushed a new item must be generated without debug mode.
            const lDebugIncident: CodeParserExceptionIncident<TTokenType> = {
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
    private setTop(pIncident: CodeParserExceptionIncident<TTokenType>): void {
        this.mTop = pIncident;

        // Set error message as error message property can not be overriden.
        this.message = pIncident.error.message;
    }
}
type CodeParserExceptionIncident<TTokenType extends string> = {
    error: Error,
    priority: number;
    graph: Graph<TTokenType>;
    range: {
        lineStart: number;
        columnStart: number;
        lineEnd: number;
        columnEnd: number;
    };
};