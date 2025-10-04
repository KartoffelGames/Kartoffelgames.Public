import { PgslType } from "../type/pgsl-type.ts";

/**
 * Trace information for PGSL struct declarations and usage.
 * Tracks properties, their types, and struct instantiation contexts.
 */
export class PgslStructTrace {
    // TODO: Implement struct tracing functionality
    // This should include:
    // - Property definitions
    // - Property types
    // - Struct inheritance information
    // - Usage tracking
    // - Memory layout information

    public get properties(): Array<PgslStructTraceProperty> {
        return this.mProperties;
    }
}

export type PgslStructTraceProperty = {
    name: string;
    type: PgslType;
    extensions: {
        // TODO: Aligmnent, size, location, interpolation, blend_src???, 
    }
};