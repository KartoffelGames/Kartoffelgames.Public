import { Exception } from "../../../kartoffelgames.core/source/index.ts";
import { Graph } from "../graph/graph.ts";
import { LexerToken } from "../index.ts";

/**
 * Code parser exceptions holding the top incident.
 * Can save a complete incident list on debug mode.
 */
export class CodeParserException<TTokenType extends string> {
    private readonly mIncidents: Array<CodeParserExceptionIncident<TTokenType>> | null;
    private mTop: CodeParserExceptionIncident<TTokenType> | null;

    /**
     * Get the top incident of all parser incidents.
     * The top incident is the furthest incident in the parsing process.
     */
    public get top(): CodeParserExceptionIncident<TTokenType> {
        if (!this.mTop) {
            throw new Exception('No incidents are available', this);
        }

        return this.mTop;
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
     * Constructor.
     * 
     * @param pDebug - Keeps a complete list of all incidents.
     */
    public constructor(pDebug: boolean) {
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
        if (!this.mTop || pException.top.priority > this.mTop.priority) {
            this.mTop = pException.top;
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
    public push(pError: Error, pGraph: Graph<TTokenType>, pStartToken: LexerToken<TTokenType>, pEndToken: LexerToken<TTokenType>): void {
        // TODO: Dont use token. Use line and column number directly.

        // Calculate priority
        const lPriority: number = (pEndToken.lineNumber * 10000) + pEndToken.columnNumber;

        // Create and push a debuging incident when debugging is enabled.
        if (this.mIncidents !== null) {
            // Create new incident. Only purpose is that not every time a incident is pushed a new item must be generated without debug mode.
            const lDebugIncident: CodeParserExceptionIncident<TTokenType> = {
                error: pError,
                priority: lPriority,
                graph: pGraph,
                token: {
                    start: pStartToken,
                    end: pEndToken
                }
            };

            this.mIncidents.push(lDebugIncident);
        }

        // Skip incident creation when priority is lower than previous top incident.
        if (this.mTop && lPriority < this.mTop.priority) {
            return;
        }

        // Create new Incident and push to top.
        this.mTop = {
            error: pError,
            priority: lPriority,
            graph: pGraph,
            token: {
                start: pStartToken,
                end: pEndToken
            }
        };
    }
}

type CodeParserExceptionIncident<TTokenType extends string> = {
    error: Error,
    priority: number;
    graph: Graph<TTokenType>;
    token: {
        start: LexerToken<TTokenType>;
        end: LexerToken<TTokenType>;
    };
};