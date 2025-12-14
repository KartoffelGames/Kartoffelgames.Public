import { PgslDeclarationType } from "../enum/pgsl-declaration-type.enum.ts";
import { PgslValueAddressSpace } from "../enum/pgsl-value-address-space.enum.ts";
import { PgslValueFixedState } from "../enum/pgsl-value-fixed-state.ts";
import { PgslType } from "../type/pgsl-type.ts";
import { PgslAccessMode } from "../buildin/pgsl-access-mode-enum.ts";

/**
 * Interface representing a value storage in the abstract syntax tree.
 */
export interface IValueStoreAst {
    readonly data: Readonly<ValueStoreAstData>
}

export type ValueStoreAstData = {
    /**
     * The fixed state of the value
     */
    fixedState: PgslValueFixedState;

    /**
     * The declaration type of the value
     */
    declarationType: PgslDeclarationType;

    /**
     * The address space where the value resides
     */
    addressSpace: PgslValueAddressSpace;

    /**
     * The type of the value
     */
    type: PgslType;

    /**
     * The name of the value
     */
    name: string;

    /**
     * The constant value if this is a compile-time constant
     */
    constantValue: number | null;

    /**
     * The access mode for the value
     */
    accessMode: PgslAccessMode;
}