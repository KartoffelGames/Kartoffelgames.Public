import { PgslValueAddressSpace } from "../enum/pgsl-value-address-space.enum.ts";
import { PgslValueFixedState } from "../enum/pgsl-value-fixed-state.ts";
import { PgslType } from "../type/pgsl-type.ts";

/**
 * Trace information for PGSL expression evaluation and type inference.
 * Tracks expression types, values, and evaluation context during transpilation.
 */
export class PgslExpressionTrace {
    // TODO: Implement expression tracing functionality
    // This should include:
    // - Expression type information
    // - Value tracking
    // - Evaluation context
    // - Type inference results

    /**
     * If expression is a constant expression.
     */
    fixedState: PgslValueFixedState;

    /**
     * If expression is a value storage.
     * This is used to determine if the expression can be used to assign a value.
     */
    isStorage: boolean;

    /**
     * Type the expression will resolve into.
     */
    resolveType: PgslType;

    constantValue: number | string | null;

    storageAddressSpace: PgslValueAddressSpace; 
}
