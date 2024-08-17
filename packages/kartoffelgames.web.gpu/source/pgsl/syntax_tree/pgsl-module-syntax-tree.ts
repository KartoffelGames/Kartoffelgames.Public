import { Dictionary, Exception } from '@kartoffelgames/core';
import { PgslFunction } from '../very_old_structure/pgsl-function';
import { PgslStruct } from '../very_old_structure/struct/pgsl-struct';
import { BasePgslSyntaxTree, PgslSyntaxTreeDataStructure } from './base-pgsl-syntax-tree';
import { PgslAliasDeclarationSyntaxTree, PgslAliasDeclarationSyntaxTreeStructureData } from './declarations/pgsl-alias-declaration-syntax-tree';
import { PgslEnumDeclarationSyntaxTree, PgslEnumDeclarationSyntaxTreeStructureData } from './declarations/pgsl-enum-declaration-syntax-tree';
import { PgslVariableDeclarationStatement } from './statement/pgsl-variable-declaration-statement';

export class PgslModuleSyntaxTree extends BasePgslSyntaxTree<PgslModuleSyntaxTreeStructureData['meta']['type'], PgslModuleSyntaxTreeStructureData['data']> {
    // Values
    private readonly mAlias: Dictionary<string, PgslAliasDeclarationSyntaxTree>;
    private readonly mEnums: Dictionary<string, PgslEnumDeclarationSyntaxTree>;

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
        this.mEnums = new Dictionary<string, PgslEnumDeclarationSyntaxTree>();

        this.mGlobals = new Dictionary<string, PgslVariableDeclarationStatement>();
        this.mStructs = new Dictionary<string, PgslStruct>();
        this.mFunctions = new Dictionary<string, PgslFunction>();

        // Add buildin enums.
        this.mEnums.set('AccessMode', new PgslEnumDeclarationSyntaxTree(true).applyDataStructure({
            meta: {
                type: 'Declaration-Enum', file: 'BUILD-IN',
                position: {
                    start: { column: 0, line: 0 },
                    end: { column: 0, line: 0 }
                }
            },
            data: {
                name: 'AccessMode',
                items: [
                    { name: 'Read', value: 'read' },
                    { name: 'Write', value: 'write' },
                    { name: 'ReadWrite', value: 'read_write' }
                ]
            }
        }, this));

        this.mEnums.set('TexelFormat', new PgslEnumDeclarationSyntaxTree(true).applyDataStructure({
            meta: {
                type: 'Declaration-Enum', file: 'BUILD-IN',
                position: {
                    start: { column: 0, line: 0 },
                    end: { column: 0, line: 0 }
                }
            },
            data: {
                name: 'TexelFormat',
                items: [
                    { name: 'Rgba8unorm', value: 'rgba8unorm' },
                    { name: 'Rgba8snorm', value: 'rgba8snorm' },
                    { name: 'Rgba8uint', value: 'rgba8uint' },
                    { name: 'Rgba8sint', value: 'rgba8sint' },
                    { name: 'Rgba16uint', value: 'rgba16uint' },
                    { name: 'Rgba16sint', value: 'rgba16sint' },
                    { name: 'Rgba16float', value: 'rgba16float' },
                    { name: 'R32uint', value: 'r32uint' },
                    { name: 'R32sint', value: 'r32sint' },
                    { name: 'R32float', value: 'r32float' },
                    { name: 'Rg32uint', value: 'rg32uint' },
                    { name: 'Rg32sint', value: 'rg32sint' },
                    { name: 'Rg32float', value: 'rg32float' },
                    { name: 'Rgba32uint', value: 'rgba32uint' },
                    { name: 'Rgba32sint', value: 'rgba32sint' },
                    { name: 'Rgba32float', value: 'rgba32float' },
                    { name: 'Bgra8unorm', value: 'bgra8unorm' }
                ]
            }
        }, this));
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
                .map((pAlias: PgslAliasDeclarationSyntaxTree) => { return pAlias.retrieveDataStructure(); }),

            // Add all none buildin enum to structure data.
            enum: [...this.mEnums.values()]
                .filter((pEnum: PgslEnumDeclarationSyntaxTree) => { return !pEnum.buildIn; })
                .map((pEnum: PgslEnumDeclarationSyntaxTree) => { return pEnum.retrieveDataStructure(); })
        };
    }
}

export type PgslModuleSyntaxTreeStructureData = PgslSyntaxTreeDataStructure<'Module', {
    alias: Array<PgslAliasDeclarationSyntaxTreeStructureData>;
    enum: Array<PgslEnumDeclarationSyntaxTreeStructureData>;
}>;

export type PgslModuleSyntaxTreeData = PgslModuleSyntaxTreeStructureData['meta'];