import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { PgslStruct } from './pgsl-struct';

export class PgslStructMap {
    private readonly mStructs: Dictionary<string, PgslStruct>;

    /**
     * Constructor.
     * Inits lists.
     */
    public constructor() {
        this.mStructs = new Dictionary<string, PgslStruct>();
    }

    /**
     * Add struct to struct map.
     * @param pStruct - Struct.
     */
    public add(pStruct: PgslStruct): void {
        if (this.has(pStruct.name)) {
            throw new Exception(`Struct "${pStruct.name}" allready exists.`, this);
        }

        this.mStructs.set(pStruct.name, pStruct);
    }

    /**
     * Get struct definition.
     * @param pStructName - Struct name.
     */
    public get(pStructName: string): PgslStruct {
        if (this.has(pStructName)) {
            throw new Exception(`Struct "${pStructName}" does not exists.`, this);
        }

        return this.mStructs.get(pStructName)!;
    }

    /**
     * Validate existance of struct.
     * @param pStructName - Struct name.
     */
    public has(pStructName: string): boolean {
        return this.mStructs.has(pStructName);
    }
}