import { Dictionary } from '@kartoffelgames/core';
import { BasePgslSyntaxTree, PgslSyntaxTreeDataStructure } from './base-pgsl-syntax-tree';
import { PgslVariableDeclarationStatement } from './statement/pgsl-variable-declaration-statement';
import { PgslFunction } from '../very_old_structure/pgsl-function';
import { PgslStruct } from '../very_old_structure/struct/pgsl-struct';

export class PgslModuleSyntaxTree extends BasePgslSyntaxTree<PgslModuleSyntaxTreeStructureData['meta']['type'], PgslModuleSyntaxTreeStructureData['data']> {
    // Values
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

        this.mGlobals = new Dictionary<string, PgslVariableDeclarationStatement>();
        this.mStructs = new Dictionary<string, PgslStruct>();
        this.mFunctions = new Dictionary<string, PgslFunction>();
    }

    /**
     * Apply data to current structure.
     * Any thrown error is converted into a parser error.
     * 
     * @param pData - Structure data.
     */
    protected override applyData(_pData: PgslModuleSyntaxTreeStructureData['data']): void {
        // TODO:
    }

    /**
     * Retrieve data of current structure.
     */
    protected override retrieveData(): PgslModuleSyntaxTreeStructureData['data'] {
        // TODO:
    }
}

export type PgslModuleSyntaxTreeStructureData = PgslSyntaxTreeDataStructure<'Module', {

}>;

export type PgslModuleSyntaxTreeData = PgslModuleSyntaxTreeStructureData['meta'];