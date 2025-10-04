import { PgslType } from "../type/pgsl-type.ts";

/**
 * Trace information for PGSL type alias declarations and resolution.
 * Tracks completely resolved types and alias chain resolution to prevent
 * circular references and provide efficient type lookups.
 */
export class PgslAliasTrace {
    private readonly mAliasName: string;
    private readonly mUnderlyingType: PgslType;

    /**
     * Gets the name of the alias.
     *
     * @returns The alias name as declared in the source code.
     */
    public get aliasName(): string {
        return this.mAliasName;
    }

    /**
     * Gets the underlying type that this alias resolves to.
     * This is the fully resolved type after following any alias chains.
     *
     * @returns The underlying PGSL type that this alias represents.
     */
    public get underlyingType(): PgslType {
        return this.mUnderlyingType;
    }

    /**
     * Creates a new alias trace.
     *
     * @param pAliasName - The name of the alias as declared in source code.
     * @param pType - The underlying type that this alias resolves to.
     */
    public constructor(pAliasName: string, pType: PgslType) {
        this.mAliasName = pAliasName;
        this.mUnderlyingType = pType;
    }
}
