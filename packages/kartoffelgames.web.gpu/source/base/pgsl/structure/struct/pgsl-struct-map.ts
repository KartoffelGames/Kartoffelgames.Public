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
     * 
     * @throws {@link Exception} 
     * When no struct for this name already exists.
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
     * 
     * @throws {@link Exception} 
     * When no struct for this name was found.
     * 
     * @returns Struct definition for struct name.
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
     * 
     * @returns true when struct with the specified name exists.
     */
    public has(pStructName: string): boolean {
        return this.mStructs.has(pStructName);
    }
}