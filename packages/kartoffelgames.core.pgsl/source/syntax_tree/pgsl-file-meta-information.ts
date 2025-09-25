import type { PgslAliasDeclaration } from "./declaration/pgsl-alias-declaration.ts";
import type { PgslEnumDeclaration } from "./declaration/pgsl-enum-declaration.ts";
import type { PgslFunctionDeclaration } from "./declaration/pgsl-function-declaration.ts";
import type { BasePgslTypeDefinition } from "./type/base-pgsl-type-definition.ts";

export class PgslFileMetaInformation {
    private readonly mBindGroups: Map<string, PgslFileMetaInformationBindGroup>;
    private readonly mParameter: Map<string, BasePgslTypeDefinition>;
    private readonly mAliases: Map<string, PgslAliasDeclaration>;
    private readonly mEnums: Map<string, PgslEnumDeclaration>;
    private readonly mEntryPoints: Map<string, PgslFunctionDeclaration>;

    public constructor() {
        this.mAliases = new Map<string, PgslAliasDeclaration>();
        this.mBindGroups = new Map<string, PgslFileMetaInformationBindGroup>();
        this.mParameter = new Map<string, BasePgslTypeDefinition>();
        this.mEnums = new Map<string, PgslEnumDeclaration>();
        this.mEntryPoints = new Map<string, PgslFunctionDeclaration>();
    }

    /**
     * Resolves the binding for a given bind group and binding name.
     * 
     * @param pBindGroupName The name of the bind group.
     * @param pBindingName The name of the binding.
     * @param pType The type of the binding.
     * @param pDeclaration The declaration type of the binding.
     * 
     * @returns The resolved binding information.
     */
    public setBinding(pBindGroupName: string, pBindingName: string, pType: BasePgslTypeDefinition, pDeclaration: PgslFileMetaInformationBindingType): PgslFileMetaInformationResolvedBinding {
        // Try to get existing bind group
        let lBindGroup = this.mBindGroups.get(pBindGroupName);

        // Create bind group if it doesn't exist
        if (!lBindGroup) {
            lBindGroup = {
                name: pBindGroupName,
                index: this.mBindGroups.size,
                bindings: new Map<string, PgslFileMetaInformationBindingLocation>()
            };
            this.mBindGroups.set(pBindGroupName, lBindGroup);
        }

        // Try to get existing binding
        let lBinding = lBindGroup.bindings.get(pBindingName);

        // Create binding if it doesn't exist
        if (!lBinding) {
            lBinding = {
                name: pBindingName,
                index: lBindGroup.bindings.size,
                type: pType,
                declaration: pDeclaration
            };
            lBindGroup.bindings.set(pBindingName, lBinding);
        }

        // Return the resolved binding information
        return {
            bindGroup: lBindGroup.index,
            binding: lBinding.index
        };
    }


    private resolveAlias(_pAliasName: string): BasePgslTypeDefinition {
        return null as unknown as BasePgslTypeDefinition;
    }
}

export type PgslFileMetaInformationResolvedBinding = {
    bindGroup: number;
    binding: number;
};

export type PgslFileMetaInformationBindingType = 'uniform' | 'read-storage' | 'write-storage' | 'read-write-storage';

export type PgslFileMetaInformationBindingLocation = {
    name: string;
    index: number;
    type: BasePgslTypeDefinition;
    declaration: PgslFileMetaInformationBindingType;
};

export type PgslFileMetaInformationBindGroup = {
    name: string;
    index: number;
    bindings: Map<string, PgslFileMetaInformationBindingLocation>;
};