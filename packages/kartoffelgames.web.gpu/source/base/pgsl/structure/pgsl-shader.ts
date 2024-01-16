import { Dictionary } from '@kartoffelgames/core.data';
import { PgslStruct } from './type/pgsl-struct';

export class PgslShader {
    public readonly mStructs: Dictionary<string, PgslStruct>;
}