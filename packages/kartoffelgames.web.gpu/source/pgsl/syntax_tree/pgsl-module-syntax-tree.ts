import { Dictionary, Exception } from '@kartoffelgames/core';
import { PgslFunction } from '../very_old_structure/pgsl-function';
import { PgslStruct } from '../very_old_structure/struct/pgsl-struct';
import { BasePgslSyntaxTree, PgslSyntaxTreeDataStructure } from './base-pgsl-syntax-tree';
import { PgslAliasDeclarationSyntaxTree, PgslAliasDeclarationSyntaxTreeStructureData } from './declarations/pgsl-alias-declaration-syntax-tree';
import { PgslVariableDeclarationStatement } from './statement/pgsl-variable-declaration-statement';

export class PgslModuleSyntaxTree extends BasePgslSyntaxTree<PgslModuleSyntaxTreeStructureData['meta']['type'], PgslModuleSyntaxTreeStructureData['data']> {
    // Values
    private readonly mAlias: Dictionary<string, PgslAliasDeclarationSyntaxTree>;

    private readonly mFunctions: Dictionary<string, PgslFunction>;
    private readonly mGlobals: Dictionary<string, PgslVariableDeclarationStatement>;
    private readonly mStructs: Dictionary<string, PgslStruct>;

    /**
     * This document.
     */
    public override get document(): PgslModuleSyntaxTree {
        return this;
    }

    // TODO: There was something with const. (Setable on Pipline creation).
    // TODO: Fast access bindings.


    // TODO: Predefine type aliases.
    // TODO: Predefine enums.

    /**
     * Constructor.
     */
    public constructor() {
        super('Module');

        this.mAlias = new Dictionary<string, PgslAliasDeclarationSyntaxTree>();

        this.mGlobals = new Dictionary<string, PgslVariableDeclarationStatement>();
        this.mStructs = new Dictionary<string, PgslStruct>();
        this.mFunctions = new Dictionary<string, PgslFunction>();
    }

    /**
     * Resolve alias name to its declaration.
     * 
     * @param pName - Alias name.
     * 
     * @returns alias declaration  
     */
    public resolveAlias(pName: string): PgslAliasDeclarationSyntaxTree | null {
        return this.mAlias.get(pName) ?? null;
    }

    /**
     * Resolve struct name to its declaration.
     * 
     * @param pName - Struct name.
     * 
     * @returns struct declaration  
     */
    public resolveStruct(pName: string): PgslStruct | null {
        return this.mStructs.get(pName) ?? null;
    }

    /**
     * Apply data to current structure.
     * Any thrown error is converted into a parser error.
     * 
     * @param pData - Structure data.
     */
    protected override applyData(pData: PgslModuleSyntaxTreeStructureData['data']): void {
        // Apply alias data.
        for (const lAlias of pData.alias) {
            if (this.mAlias.has(lAlias.data.name)) {
                throw new Exception(`Alias "${lAlias.data.name}" is already defined.`, this);
            }

            // Apply alias.
            this.mAlias.set(lAlias.data.name, new PgslAliasDeclarationSyntaxTree().applyDataStructure(lAlias, this));
        }

        // TODO: Other globals
    }

    /**
     * Retrieve data of current structure.
     */
    protected override retrieveData(): PgslModuleSyntaxTreeStructureData['data'] {
        return {
            // Add all none buildin alias to structure data.
            alias: [...this.mAlias.values()]
                .filter((pAlias: PgslAliasDeclarationSyntaxTree) => { return !pAlias.buildIn; })
                .map((pAlias: PgslAliasDeclarationSyntaxTree) => { return pAlias.retrieveDataStructure(); })
        };
    }
}

export type PgslModuleSyntaxTreeStructureData = PgslSyntaxTreeDataStructure<'Module', {
    alias: Array<PgslAliasDeclarationSyntaxTreeStructureData>;
}>;

export type PgslModuleSyntaxTreeData = PgslModuleSyntaxTreeStructureData['meta'];