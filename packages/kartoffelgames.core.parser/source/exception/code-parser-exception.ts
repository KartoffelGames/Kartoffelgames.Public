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
     * Push a new error incident.
     * 
     * @param pError - General error element.
     * @param pGraph - Graph where error occurred.
     * @param pStartToken - Staring token of error.
     * @param pEndToken - End topen of error. 
     */
    public push(pError: Error, pGraph: Graph<TTokenType>, pStartToken: LexerToken<TTokenType>, pEndToken: LexerToken<TTokenType>): void {
        // Calculate priority
        const lStartPriority: number = (pStartToken.lineNumber * 10000) + pStartToken.columnNumber;
        const lEndPriority: number = (pEndToken.lineNumber * 10000) + pEndToken.columnNumber;
        const lGeneralPriority: number = (lStartPriority > lEndPriority) ? lStartPriority : lEndPriority;

        // Create and push a debuging incident when debugging is enabled.
        if (this.mIncidents !== null) {
            // Create new incident. Only purpose is that not every time a incident is pushed a new item must be generated without debug mode.
            const lDebugIncident: CodeParserExceptionIncident<TTokenType> = {
                error: pError,
                priority: lGeneralPriority,
                graph: pGraph,
                token: {
                    start: pStartToken,
                    end: pEndToken
                }
            };

            this.mIncidents.push(lDebugIncident);
        }

        // Skip incident creation when priority is lower than previous top incident.
        if (this.mTop && lGeneralPriority < this.mTop.priority) {
            return;
        }

        // Create new Incident and push to top.
        this.mTop = {
            error: pError,
            priority: lGeneralPriority,
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