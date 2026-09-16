import type { CodeParserTrace, CodeParserTraceIncident } from './code-parser-trace.ts';
import type { Graph } from './graph/graph.ts';

/**
 * Code parser exceptions holding the top incident.
 * Can save a complete incident list on debug mode.
 */
export class CodeParserException<TTokenType extends string> extends Error {
    public static readonly PARSER_ERROR: unique symbol = Symbol('PARSER_ERROR');

    private readonly mTop: CodeParserTraceIncident<TTokenType>;

    /**
     * Error column end.
     */
    public get columnEnd(): number {
        return this.mTop.range.columnEnd;
    }

    /**
     * Error column start.
     */
    public get columnStart(): number {
        return this.mTop.range.columnStart;
    }

    /**
     * Affected graph of error.
     */
    public get graph(): Graph<TTokenType> | null {
        return this.mTop.graph;
    }

    /**
     * Error line end.
     */
    public get lineEnd(): number {
        return this.mTop.range.lineEnd;
    }

    /**
     * Error line start.
     */
    public get lineStart(): number {
        return this.mTop.range.lineStart;
    }

    /**
     * Constructor.
     * 
     * @param pDebug - Keeps a complete list of all incidents.
     */
    public constructor(pTrace: CodeParserTrace<TTokenType>) {
        super(pTrace.top.message, { cause: pTrace.top.cause });

        this.mTop = pTrace.top;
    }
}

export type CodeParserErrorSymbol = typeof CodeParserException.PARSER_ERROR;