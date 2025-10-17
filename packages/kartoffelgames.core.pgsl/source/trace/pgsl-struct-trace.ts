/**
 * Trace information for PGSL struct declarations and usage.
 * Tracks properties, their types, and struct instantiation contexts.
 */
export class PgslStructTrace {
    private readonly mName: string;

    /**
     * Gets the name of the struct.
     * 
     * @returns The struct name as declared in source code.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Creates a new struct trace.
     * 
     * @param pConstructorData - The data needed to construct the struct trace.
     */
    public constructor(pName: string) {
        this.mName = pName;
    }
}