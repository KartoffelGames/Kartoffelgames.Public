import { Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTree, BasePgslSyntaxTreeMeta } from './base-pgsl-syntax-tree.ts';
import { PgslAliasDeclarationSyntaxTree } from './declaration/pgsl-alias-declaration-syntax-tree.ts';
import { PgslEnumDeclarationSyntaxTree } from './declaration/pgsl-enum-declaration-syntax-tree.ts';
import { PgslFunctionDeclarationSyntaxTree } from './declaration/pgsl-function-declaration-syntax-tree.ts';
import { PgslStructDeclarationSyntaxTree } from './declaration/pgsl-struct-declaration-syntax-tree.ts';
import { PgslVariableDeclarationSyntaxTree } from './declaration/pgsl-variable-declaration-syntax-tree.ts';

export class PgslModuleSyntaxTree extends BasePgslSyntaxTree {
    private readonly mContentList: Array<BasePgslSyntaxTree>;

    /**
     * This document.
     */
    public override get document(): PgslModuleSyntaxTree {
        return this;
    }

    // TODO: There was something with const. (Setable on Pipline creation).
    // TODO: Fast access bindings.

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pContentList: Array<BasePgslSyntaxTree>, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta, true);

        // All in one declaration list to setup in correct order.
        this.appendChild(...pContentList);

        // Save content list.
        this.mContentList = pContentList;
    }

    /**
     * Resolve alias name to its declaration.
     * 
     * @param pName - Alias name.
     * 
     * @returns alias declaration  
     */
    public resolveAlias(pName: string): PgslAliasDeclarationSyntaxTree {
        // Get declaration from scope.
        const lDeclaration: BasePgslSyntaxTree = this.getScopedValue(pName);
        if(!(lDeclaration instanceof PgslAliasDeclarationSyntaxTree)) {
            throw new Exception(`Name "${pName}" does not reference an alias.`, this);
        }

        return lDeclaration;
    }

    /**
     * Resolve enum name to its declaration.
     * 
     * @param pName - Enum name.
     * 
     * @returns enum declaration  
     */
    public resolveEnum(pName: string): PgslEnumDeclarationSyntaxTree {
        // Get declaration from scope.
        const lDeclaration: BasePgslSyntaxTree = this.getScopedValue(pName);
        if(!(lDeclaration instanceof PgslEnumDeclarationSyntaxTree)) {
            throw new Exception(`Name "${pName}" does not reference an enum.`, this);
        }

        return lDeclaration;
    }

    /**
     * Resolve function name to its declaration.
     * 
     * @param pName - Function name.
     * 
     * @returns function declaration.
     */
    public resolveFunction(pName: string): PgslFunctionDeclarationSyntaxTree {
        // Get declaration from scope.
        const lDeclaration: BasePgslSyntaxTree = this.getScopedValue(pName);
        if(!(lDeclaration instanceof PgslFunctionDeclarationSyntaxTree)) {
            throw new Exception(`Name "${pName}" does not reference a function.`, this);
        }

        return lDeclaration;
    }

    /**
     * Resolve struct name to its declaration.
     * 
     * @param pName - Struct name.
     * 
     * @returns struct declaration  
     */
    public resolveStruct(pName: string): PgslStructDeclarationSyntaxTree {
        // Get declaration from scope.
        const lDeclaration: BasePgslSyntaxTree = this.getScopedValue(pName);
        if(!(lDeclaration instanceof PgslStructDeclarationSyntaxTree)) {
            throw new Exception(`Name "${pName}" does not reference a struct.`, this);
        }

        return lDeclaration;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Loop data.
        for (const lContent of this.mContentList) {
            // Module scope content must be a specific tree type.
            switch (true) {
                case lContent instanceof PgslAliasDeclarationSyntaxTree: break;
                case lContent instanceof PgslEnumDeclarationSyntaxTree: break;
                case lContent instanceof PgslFunctionDeclarationSyntaxTree: break;
                case lContent instanceof PgslVariableDeclarationSyntaxTree: break;
                case lContent instanceof PgslStructDeclarationSyntaxTree: break;
                default: {
                    throw new Exception(`Unknown module structure.`, this);
                }
            }
        }
    }
}