import type { Graph } from '../graph/graph.ts';
import { CodeParserTrace } from "../parser/code-parser-trace.ts";

/**
 * Code parser exceptions holding the top incident.
 * Can save a complete incident list on debug mode.
 */
export class CodeParserException<TTokenType extends string> extends Error {
    private readonly mTrace: CodeParserTrace<TTokenType>;

    /**
     * Affected graph of error.
     */
    public get affectedGraph(): Graph<TTokenType> | null {
        return this.mTrace.graph;
    }

    /**
     * Error column end.
     */
    public get columnEnd(): number {
        return this.mTrace.columnEnd;
    }

    /**
     * Error column start.
     */
    public get columnStart(): number {
        return this.mTrace.columnStart;
    }

    /**
     * Error line end.
     */
    public get lineEnd(): number {
        return this.mTrace.lineEnd;
    }

    /**
     * Error line start.
     */
    public get lineStart(): number {
        return this.mTrace.lineStart;
    }

    /**
     * Constructor.
     * 
     * @param pDebug - Keeps a complete list of all incidents.
     */
    public constructor(pTrace: CodeParserTrace<TTokenType>) {
        super(pTrace.message);

        this.mTrace = pTrace;
    }
}