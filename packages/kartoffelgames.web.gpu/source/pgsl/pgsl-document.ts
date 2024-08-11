import { Dictionary } from '@kartoffelgames/core';
import { PgslFunction } from './very_old_structure/pgsl-function';
import { PgslVariable } from './very_old_structure/pgsl-variable';
import { PgslStruct } from './very_old_structure/struct/pgsl-struct';
import { BasePgslStructure } from './base-pgsl-structure';

export class PgslDocument extends BasePgslStructure {
    // Values
    private readonly mFunctions: Dictionary<string, PgslFunction>;
    private readonly mGlobals: Dictionary<string, PgslVariable>;
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

        this.mGlobals = new Dictionary<string, PgslVariable>();
        this.mStructs = new Dictionary<string, PgslStruct>();
        this.mFunctions = new Dictionary<string, PgslFunction>();
    }
}