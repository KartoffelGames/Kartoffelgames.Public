import { Dictionary } from '@kartoffelgames/core.data';
import { PgslFunction } from './pgsl-function';
import { PgslVariable } from './pgsl-variable';
import { PgslStruct } from './struct/pgsl-struct';

export class PgslShader {
    // Values
    private readonly mGlobals: Dictionary<string, PgslVariable>;
    private readonly mStructs: Dictionary<string, PgslStruct>;
    private readonly mFunctions: Dictionary<string, PgslFunction>;

    
}       