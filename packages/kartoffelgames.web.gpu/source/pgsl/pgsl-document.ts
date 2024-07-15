import { Dictionary } from '@kartoffelgames/core';
import { PgslFunction } from './structure/pgsl-function';
import { PgslVariable } from './structure/pgsl-variable';
import { PgslStruct } from './structure/struct/pgsl-struct';

export class PgslDocument {
    // Values
    private readonly mFunctions: Dictionary<string, PgslFunction>;
    private readonly mGlobals: Dictionary<string, PgslVariable>;
    private readonly mStructs: Dictionary<string, PgslStruct>;

    // TODO: There was something with const. (Setable on Pipline creation).
    // TODO: Fast access bindings.
    

    public constructor() {
        this.mGlobals = new Dictionary<string, PgslVariable>();
        this.mStructs = new Dictionary<string, PgslStruct>();
        this.mFunctions = new Dictionary<string, PgslFunction>();
    }
}