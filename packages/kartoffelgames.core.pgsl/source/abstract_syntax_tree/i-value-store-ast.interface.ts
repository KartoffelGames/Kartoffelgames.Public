import type { PgslDeclarationType } from '../enum/pgsl-declaration-type.enum.ts';
import type { PgslValueAddressSpace } from '../enum/pgsl-value-address-space.enum.ts';
import type { PgslValueFixedState } from '../enum/pgsl-value-fixed-state.ts';
import type { PgslAccessMode } from '../buildin/enum/pgsl-access-mode-enum.ts';
import type { PgslType } from './type/pgsl-type.ts';

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