import { Exception } from '@kartoffelgames/core';
import type { PgslDeclarationType } from '../enum/pgsl-declaration-type.enum.ts';
import type { PgslValueAddressSpace } from '../enum/pgsl-value-address-space.enum.ts';
import type { PgslValueFixedState } from '../enum/pgsl-value-fixed-state.ts';
import type { PgslAccessMode } from '../abstract_syntax_tree/buildin/pgsl-access-mode.enum.ts';
import type { PgslType } from '../type/pgsl-type.ts';

/**
 * Trace information for PGSL variable declarations.
 * Tracks variable types, scopes, and value flow through the program.
 */
export class PgslValueTrace {
    private readonly mFixedState: PgslValueFixedState;
    private readonly mDeclarationType: PgslDeclarationType;
    private readonly mAddressSpace: PgslValueAddressSpace;
    private readonly mType: PgslType;
    private readonly mName: string;
    private readonly mConstantValue: number | null;
    private readonly mAccessMode: PgslAccessMode;
    private readonly mBindingInformation: PgslValueTraceBindingInformation | null;

    /**
     * Gets the fixed state of the value.
     * 
     * @returns The fixed state indicating how the value can be modified.
     */
    public get fixedState(): PgslValueFixedState {
        return this.mFixedState;
    }

    /**
     * Gets the declaration type of the value.
     * 
     * @returns The declaration type (variable, constant, etc.).
     */
    public get declarationType(): PgslDeclarationType {
        return this.mDeclarationType;
    }

    /**
     * Gets the address space where the value resides.
     * 
     * @returns The address space of the value.
     */
    public get addressSpace(): PgslValueAddressSpace {
        return this.mAddressSpace;
    }

    /**
     * Gets the type of the value.
     * 
     * @returns The PGSL type of the value.
     */
    public get type(): PgslType {
        return this.mType;
    }

    /**
     * Gets the name of the value.
     * 
     * @returns The variable name as declared in source code.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Gets the constant value if this is a compile-time constant.
     * 
     * @returns The constant value or null if not a constant.
     */
    public get constantValue(): number | null {
        return this.mConstantValue;
    }

    /**
     * Gets the access mode for the value.
     * 
     * @returns The access mode (read, write, read_write).
     */
    public get accessMode(): PgslAccessMode {
        return this.mAccessMode;
    }

    /**
     * Gets the binding information for the value.
     * 
     * @returns The binding information or null if not bound.
     */
    public get bindingInformation(): Readonly<PgslValueTraceBindingInformation> | null {
        return this.mBindingInformation;
    }

    /**
     * Creates a new value trace.
     * 
     * @param pConstructorData - The data needed to construct the value trace.
     */
    public constructor(pConstructorData: PgslValueTraceConstructorParameter) {
        this.mFixedState = pConstructorData.fixedState;
        this.mDeclarationType = pConstructorData.declarationType;
        this.mAddressSpace = pConstructorData.addressSpace;
        this.mType = pConstructorData.type;
        this.mName = pConstructorData.name;
        this.mConstantValue = pConstructorData.constantValue;
        this.mAccessMode = pConstructorData.accessMode;

        // Create unresolved binding information if provided.
        if (pConstructorData.bindingInformation) {
            this.mBindingInformation = {
                bindGroupName: pConstructorData.bindingInformation.bindGroupName,
                bindLocationName: pConstructorData.bindingInformation.bindLocationName,

                // Unresolved indices, to be filled in later.
                bindGroupIndex: -1,
                bindLocationIndex: -1
            };
        } else {
            this.mBindingInformation = null;
        }
    }

    /**
     * Resolves the binding indices for the value.
     * 
     * @param pBindGroupIndex - The index of the bind group.
     * @param pBindLocationIndex - The index of the bind location.
     */
    public resolveBindingIndices(pBindGroupIndex: number, pBindLocationIndex: number): void {
        if (!this.mBindingInformation) {
            throw new Exception(`Value '${this.mName}' has no binding information to resolve.`, this);
        }

        // Throw if binding is already resolved.
        if (this.mBindingInformation.bindGroupIndex !== -1 || this.mBindingInformation.bindLocationIndex !== -1) {
            throw new Exception(`Binding for value '${this.mName}' is already resolved.`, this);
        }

        this.mBindingInformation.bindGroupIndex = pBindGroupIndex;
        this.mBindingInformation.bindLocationIndex = pBindLocationIndex;
    }
}

/**
 * Constructor type for creating PgslValueTrace instances.
 * Contains all the data needed to initialize a value trace.
 */
export type PgslValueTraceConstructorParameter = {
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

    /**
     * Optional binding information for the value
     */
    bindingInformation: {
        bindGroupName: string;
        bindLocationName: string;
    } | null;
};

/**
 * Binding information for values that are bound to specific locations.
 * Used for shader inputs, outputs, and resource bindings.
 */
export type PgslValueTraceBindingInformation = {
    /**
     * The name of the bind group
     */
    bindGroupName: string;

    /**
     * The index of the bind group
     */
    bindGroupIndex: number;

    /**
     * The name of the bind location
     */
    bindLocationName: string;

    /**
     * The index of the bind location
     */
    bindLocationIndex: number;
};