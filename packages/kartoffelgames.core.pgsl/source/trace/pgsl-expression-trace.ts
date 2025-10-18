import { PgslValueAddressSpace } from "../enum/pgsl-value-address-space.enum.ts";
import { PgslValueFixedState } from "../enum/pgsl-value-fixed-state.ts";
import { PgslType } from "../type/pgsl-type.ts";

/**
 * Trace information for PGSL expression evaluation and type inference.
 * Tracks expression types, values, and evaluation context during transpilation.
 */
export class PgslExpressionTrace {
    private readonly mFixedState: PgslValueFixedState;
    private readonly mIsStorage: boolean;
    private readonly mResolveType: PgslType;
    private readonly mConstantValue: number | string | null;
    private readonly mStorageAddressSpace: PgslValueAddressSpace;

    /**
     * Gets whether the expression is a constant expression.
     * 
     * @returns The fixed state indicating how the expression can be modified.
     */
    public get fixedState(): PgslValueFixedState {
        return this.mFixedState;
    }

    /**
     * Gets whether the expression is a value storage.
     * This is used to determine if the expression can be used to assign a value.
     * 
     * @returns True if the expression can be used for storage, false otherwise.
     */
    public get isStorage(): boolean {
        return this.mIsStorage;
    }

    /**
     * Gets the type the expression will resolve into.
     * 
     * @returns The PGSL type that this expression evaluates to.
     */
    public get resolveType(): PgslType {
        return this.mResolveType;
    }

    /**
     * Gets the constant value if this expression is a compile-time constant.
     * 
     * @returns The constant value or null if not a constant.
     */
    public get constantValue(): number | string | null {
        return this.mConstantValue;
    }

    /**
     * Gets the storage address space for this expression.
     * 
     * @returns The address space where the expression's storage resides.
     */
    public get storageAddressSpace(): PgslValueAddressSpace {
        return this.mStorageAddressSpace;
    }

    /**
     * Creates a new expression trace.
     * 
     * @param pConstructorData - The data needed to construct the expression trace.
     */
    public constructor(pConstructorData: PgslExpressionTraceConstructorParameter) {
        this.mFixedState = pConstructorData.fixedState;
        this.mIsStorage = pConstructorData.isStorage;
        this.mResolveType = pConstructorData.resolveType;
        this.mConstantValue = pConstructorData.constantValue;
        this.mStorageAddressSpace = pConstructorData.storageAddressSpace;
    }
}

/**
 * Constructor type for creating PgslExpressionTrace instances.
 * Contains all the data needed to initialize an expression trace.
 */
export type PgslExpressionTraceConstructorParameter = {
    /**
     * The fixed state of the expression
     */
    fixedState: PgslValueFixedState;

    /**
     * Whether the expression is a value storage
     */
    isStorage: boolean;

    /**
     * The type the expression will resolve into
     */
    resolveType: PgslType;

    /**
     * The constant value if this is a compile-time constant
     */
    constantValue: number | string | null;

    /**
     * The storage address space for this expression
     */
    storageAddressSpace: PgslValueAddressSpace;
};
