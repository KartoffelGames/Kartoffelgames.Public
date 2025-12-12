import type { ExpressionAst } from '../abstract_syntax_tree/expression/pgsl-expression.ts';
import type { PgslType } from '../type/pgsl-type.ts';

/**
 * Trace information for PGSL enum declarations and usage.
 * Tracks enum values, their underlying types, and usage contexts.
 */
export class PgslEnumTrace {
    private readonly mName: string;
    private readonly mUnderlyingType: PgslType;
    private readonly mValues: Map<string, ExpressionAst>;

    /**
     * Gets the name of the enum.
     * 
     * @returns The enum name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Gets the underlying type of the enum.
     * 
     * @returns The underlying PgslType of the enum.
     */
    public get underlyingType(): PgslType {
        return this.mUnderlyingType;
    }

    /**
     * Gets the map of enum member names to their corresponding expressions/values.
     * @returns A read-only map of enum member names to expressions.
     */
    public get values(): ReadonlyMap<string, ExpressionAst> {
        return this.mValues;
    }

    /**
     * Constructor.
     * @param pName - Name of the enum.
     * @param pUnderlyingType - Underlying type of the enum (e.g., int, uint).
     * @param pValues - Map of enum member names to their corresponding expressions/values.
     */
    public constructor(pName: string, pUnderlyingType: PgslType, pValues: PgslEnumTraceValues) {
        this.mName = pName;
        this.mUnderlyingType = pUnderlyingType;

        // Convert array of values to a map for efficient lookup.
        this.mValues = new Map<string, ExpressionAst>(pValues.map(pItem => [pItem.name, pItem.value]));
    }
}

export type PgslEnumTraceValues = Array<{ name: string; value: ExpressionAst; }>;