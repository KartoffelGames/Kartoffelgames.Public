import { Dictionary, Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTree, BasePgslSyntaxTreeMeta } from './base-pgsl-syntax-tree';
import { PgslAliasDeclarationSyntaxTree } from './declaration/pgsl-alias-declaration-syntax-tree';
import { PgslEnumDeclarationSyntaxTree } from './declaration/pgsl-enum-declaration-syntax-tree';
import { PgslFunctionDeclarationSyntaxTree } from './declaration/pgsl-function-declaration-syntax-tree';
import { PgslStructDeclarationSyntaxTree } from './declaration/pgsl-struct-declaration-syntax-tree';
import { PgslVariableDeclarationSyntaxTree } from './declaration/pgsl-variable-declaration-syntax-tree';
import { IPgslVariableDeclarationSyntaxTree } from './interface/i-pgsl-variable-declaration-syntax-tree.interface';

export class PgslModuleSyntaxTree extends BasePgslSyntaxTree<PgslModuleSyntaxTreeConstructorParameter> {
    // Values
    private readonly mAlias: Dictionary<string, PgslAliasDeclarationSyntaxTree>;
    private readonly mEnums: Dictionary<string, PgslEnumDeclarationSyntaxTree>;
    private readonly mFunctions: Dictionary<string, PgslFunctionDeclarationSyntaxTree>;

    private readonly mGlobalVariables: Dictionary<string, PgslVariableDeclarationSyntaxTree>;
    private readonly mStructs: Dictionary<string, PgslStructDeclarationSyntaxTree>;

    /**
     * This document.
     */
    public override get document(): PgslModuleSyntaxTree {
        return this;
    }

    /**
     * Get all scoped variables of scope.
     */
    protected override get scopedVariables(): Dictionary<string, IPgslVariableDeclarationSyntaxTree> {
        // Read parent scoped variables
        const lParentVariables: Dictionary<string, IPgslVariableDeclarationSyntaxTree> = super.scopedVariables;

        // Append current scoped variables. Override parent.
        for (const lVariable of this.mGlobalVariables.values()) {
            lParentVariables.set(lVariable.name, lVariable);
        }

        return lParentVariables;
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
    public constructor(pData: PgslModuleSyntaxTreeConstructorParameter, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // TODO: All in one declaration list to setup in correct order.
        this.appendChild(...pData.enums);
        this.appendChild(...pData.aliases);
        this.appendChild(...pData.structs);
        this.appendChild(...pData.variables);
        this.appendChild(...pData.functions);
        
        // TODO: Move into setup.
        this.mAlias = new Dictionary<string, PgslAliasDeclarationSyntaxTree>();
        this.mEnums = new Dictionary<string, PgslEnumDeclarationSyntaxTree>();
        this.mGlobalVariables = new Dictionary<string, PgslVariableDeclarationSyntaxTree>();
        this.mStructs = new Dictionary<string, PgslStructDeclarationSyntaxTree>();
        this.mFunctions = new Dictionary<string, PgslFunctionDeclarationSyntaxTree>();

        // Apply alias data.
        for (const lAlias of pData.aliases) {
            if (this.mAlias.has(lAlias.name)) {
                throw new Exception(`Alias "${lAlias.name}" is already defined.`, this);
            }

            // Apply alias.
            this.mAlias.set(lAlias.name, lAlias);
        }

        // Apply enum data.
        for (const lEnum of pData.enums) {
            // Enum data does not merge.
            if (this.mEnums.has(lEnum.name)) {
                throw new Exception(`Enum "${lEnum.name}" is already defined.`, this);
            }

            // Apply new enum.
            this.mEnums.set(lEnum.name, lEnum);
        }

        // Apply enum data.
        for (const lFunction of pData.functions) {
            // Enum data does not merge.
            if (this.mFunctions.has(lFunction.name)) {
                throw new Exception(`Function "${lFunction.name}" is already defined.`, this);
            }

            // Apply new function.
            this.mFunctions.set(lFunction.name, lFunction);
        }

        // Apply variables data.
        for (const lVariable of pData.variables) {
            // Variables data does not merge.
            if (this.mGlobalVariables.has(lVariable.name)) {
                throw new Exception(`Variable declaration "${lVariable.name}" is already defined.`, this);
            }

            // Apply new variable.
            this.mGlobalVariables.set(lVariable.name, lVariable);
        }

        // Apply struct data.
        for (const lStruct of pData.structs) {
            // Struct data does not merge.
            if (this.mStructs.has(lStruct.name)) {
                throw new Exception(`Struct declaration "${lStruct.name}" is already defined.`, this);
            }

            // Apply new variable.
            this.mStructs.set(lStruct.name, lStruct);
        }

        // TODO: Maybe sort things, idk. 
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
     * Resolve enum name to its declaration.
     * 
     * @param pName - Enum name.
     * 
     * @returns enum declaration  
     */
    public resolveEnum(pName: string): PgslEnumDeclarationSyntaxTree | null {
        return this.mEnums.get(pName) ?? null;
    }

    /**
     * Resolve function name to its declaration.
     * 
     * @param pName - Function name.
     * 
     * @returns function declaration.
     */
    public resolveFunction(pName: string): PgslFunctionDeclarationSyntaxTree | null {
        return this.mFunctions.get(pName) ?? null;
    }

    /**
     * Resolve struct name to its declaration.
     * 
     * @param pName - Struct name.
     * 
     * @returns struct declaration  
     */
    public resolveStruct(pName: string): PgslStructDeclarationSyntaxTree | null {
        return this.mStructs.get(pName) ?? null;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // TODO: Validate function parameter and template.
    }
}

type PgslModuleSyntaxTreeConstructorParameter = {
    aliases: Array<PgslAliasDeclarationSyntaxTree>;
    enums: Array<PgslEnumDeclarationSyntaxTree>;
    functions: Array<PgslFunctionDeclarationSyntaxTree>;
    variables: Array<PgslVariableDeclarationSyntaxTree>;
    structs: Array<PgslStructDeclarationSyntaxTree>;
};