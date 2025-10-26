import type { IAnyParameterConstructor } from '../../../kartoffelgames.core/source/interface/i-constructor.ts';
import { PgslTrace } from '../trace/pgsl-trace.ts';

/**
 * Base pgsl syntax tree object.
 */
export abstract class BasePgslSyntaxTree {
    /**
     * Convert meta data to a syntax tree meta object.
     * 
     * @param pMeta - Meta data to convert.
     * 
     * @returns Converted meta data. 
     */
    public static convertMeta(pMeta: SyntaxTreeMeta): BasePgslSyntaxTreeMeta {
        return {
            range: [
                pMeta.position.start.line,
                pMeta.position.start.column,
                pMeta.position.end.line,
                pMeta.position.end.column,
            ]
        };
    }

    private readonly mChildNodes: Array<BasePgslSyntaxTree>;
    private readonly mMeta: SyntaxTreeMeta;

    /**
     * Child nodes of the syntax tree.
     */
    public get childNodes(): ReadonlyArray<BasePgslSyntaxTree> {
        return this.mChildNodes;
    }

    /**
     * Get syntax tree meta.
     */
    public get meta(): SyntaxTreeMeta {
        return this.mMeta;
    }

    /**
     * Constructor.
     * 
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pMeta?: BasePgslSyntaxTreeMeta) {
        // Use provided meta or create empty one.
        const lMeta: BasePgslSyntaxTreeMeta = pMeta ?? {
            range: [0, 0, 0, 0]
        };

        // Save meta information.
        this.mMeta = {
            position: {
                start: {
                    line: lMeta.range[0],
                    column: lMeta.range[1],
                },
                end: {
                    line: lMeta.range[2],
                    column: lMeta.range[3]
                }
            }
        };

        // Hirachy information.
        this.mChildNodes = new Array<BasePgslSyntaxTree>();
    }

    /**
     * Trace the syntax tree.
     * Builds up the traceable structure of the syntax tree.
     * 
     * @param pTrace - Existing trace to use. If not provided a new one is created.
     * 
     * @returns Trace.
     */
    public trace(pTrace?: PgslTrace): PgslTrace {
        // Use existing trace or create a new one.
        const lTrace: PgslTrace = pTrace ?? new PgslTrace();
        this.onTrace(lTrace);

        return lTrace;
    }

    /**
     * Add child syntax tree.
     * Sets childs parent.
     * 
     * @param pChilds - Child syntax tree.
     */
    protected appendChild(...pChilds: Array<BasePgslSyntaxTree>): void {
        // Append to child list. 
        this.mChildNodes.push(...pChilds);
    }

    /**
     * Trace the syntax tree.
     * Builds up the traceable structure of the syntax tree.
     * 
     * @param pTrace - Trace.
     */
    protected abstract onTrace(pTrace: PgslTrace): void;
}

/**
 * Type representing a constructor function for PGSL syntax tree nodes.
 * Used as a key in the validation processor map to associate constructors with their corresponding validation logic.
 */
export type PgslSyntaxTreeConstructor = IAnyParameterConstructor<BasePgslSyntaxTree>;

export type BasePgslSyntaxTreeMeta = {
    range: [number, number, number, number],
};

export type SyntaxTreeMeta = {
    position: {
        start: {
            column: number;
            line: number;
        };
        end: {
            column: number;
            line: number;
        };
    };
};