import { Dictionary } from '@kartoffelgames/core';
import { BasePgslStructure } from './base-pgsl-structure';
import { PgslVariableDeclarationStatement } from './structure/statement/pgsl-variable-declaration-statement';
import { PgslFunction } from './very_old_structure/pgsl-function';
import { PgslStruct } from './very_old_structure/struct/pgsl-struct';

export class PgslDocument extends BasePgslStructure {
    // Values
    private readonly mFunctions: Dictionary<string, PgslFunction>;
    private readonly mGlobals: Dictionary<string, PgslVariableDeclarationStatement>;
    private readonly mStructs: Dictionary<string, PgslStruct>;

    /**
     * This document.
     */
    public get document(): PgslDocument {
        return this;
    }

    // TODO: There was something with const. (Setable on Pipline creation).
    // TODO: Fast access bindings.


    // TODO: Predefine type aliases.
    // TODO: Predefine enums.

    public constructor() {
        super();

        this.mGlobals = new Dictionary<string, PgslVariableDeclarationStatement>();
        this.mStructs = new Dictionary<string, PgslStruct>();
        this.mFunctions = new Dictionary<string, PgslFunction>();
    }

    /**
     * Validate existance of global variable by returning its reference.
     * 
     * @param pVariableName - Variable name. case sensitive.
     * 
     * @returns the reference of the variable expression or null when not found.
     */
    public validVariable(pVariableName: string): PgslVariableDeclarationStatement | null {
        return this.mGlobals.get(pVariableName) ?? null;
    }
}