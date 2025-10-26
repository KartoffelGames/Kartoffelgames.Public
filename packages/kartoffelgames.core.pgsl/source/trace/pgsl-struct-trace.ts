import type { PgslStructDeclaration } from '../syntax_tree/declaration/pgsl-struct-declaration.ts';

/**
 * Trace information for PGSL struct declarations and usage.
 * Tracks properties, their types, and struct instantiation contexts.
 */
export class PgslStructTrace {
    private readonly mName: string;
    private readonly mStructDeclaration: PgslStructDeclaration;

    /**
     * Gets the struct declaration.
     * 
     * @returns The struct declaration as defined in source code.
     */
    public get declaration(): PgslStructDeclaration {
        return this.mStructDeclaration;
    }

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
    public constructor(pName: string, pStructDeclaration: PgslStructDeclaration) {
        this.mName = pName;
        this.mStructDeclaration = pStructDeclaration;
    }
}