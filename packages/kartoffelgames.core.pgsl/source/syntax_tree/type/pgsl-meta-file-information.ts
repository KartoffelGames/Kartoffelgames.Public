import { PgslEnumDeclaration } from "../declaration/pgsl-enum-declaration.ts";
import { PgslFunctionDeclaration } from "../declaration/pgsl-function-declaration.ts";
import { BasePgslTypeDefinition } from "./base-pgsl-type-definition.ts";

export class PgslFileMetaInformation {
    private readonly mBindGroups: Map<number, PgslFileMetaInformationBindGroup>;
    private readonly mParameter: Map<string, BasePgslTypeDefinition>;
    private readonly mEnums: Map<string, PgslEnumDeclaration>;
    private readonly mEntryPoints: Map<string, PgslFunctionDeclaration>;

    public constructor() {
        this.mBindGroups = new Map<number, PgslFileMetaInformationBindGroup>();
        this.mParameter = new Map<string, BasePgslTypeDefinition>();
        this.mEnums = new Map<string, PgslEnumDeclaration>();
        this.mEntryPoints = new Map<string, PgslFunctionDeclaration>();
    }
}

export type PgslFileMetaInformationBindingLocation = {
    name: string;
    index: number;
    type: BasePgslTypeDefinition;
    declaration: 'uniform' | 'read-storage' | 'write-storage' | 'read-write-storage';
};

export type PgslFileMetaInformationBindGroup = {
    name: string;
    index: number;
    bindings: Map<number, PgslFileMetaInformationBindingLocation>;
};
