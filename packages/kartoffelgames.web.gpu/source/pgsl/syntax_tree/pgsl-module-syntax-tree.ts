import { Dictionary, Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTree } from './base-pgsl-syntax-tree';
import { PgslAliasDeclarationSyntaxTree } from './declarations/pgsl-alias-declaration-syntax-tree';
import { PgslEnumDeclarationSyntaxTree } from './declarations/pgsl-enum-declaration-syntax-tree';
import { PgslFunctionDeclarationSyntaxTree } from './declarations/pgsl-function-declaration-syntax-tree';
import { PgslStructDeclarationSyntaxTree } from './declarations/pgsl-struct-declaration-syntax-tree';
import { PgslVariableDeclarationSyntaxTree } from './declarations/pgsl-variable-declaration-syntax-tree';
import { PgslVariableDeclarationStatementSyntaxTree } from './statement/pgsl-variable-declaration-statement-syntax-tree';

export class PgslModuleSyntaxTree extends BasePgslSyntaxTree<PgslModuleSyntaxTreeStructureData> {
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
    protected override get scopedVariables(): Dictionary<string, PgslVariableDeclarationStatementSyntaxTree | PgslVariableDeclarationSyntaxTree> {
        // Read parent scoped variables
        const lParentVariables: Dictionary<string, PgslVariableDeclarationStatementSyntaxTree | PgslVariableDeclarationSyntaxTree> = super.scopedVariables;

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
     * @param pStartColumn - Parsing start column.
     * @param pStartLine - Parsing start line.
     * @param pEndColumn - Parsing end column.
     * @param pEndLine - Parsing end line.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslModuleSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

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

type PgslModuleSyntaxTreeStructureData = {
    aliases: Array<PgslAliasDeclarationSyntaxTree>;
    enums: Array<PgslEnumDeclarationSyntaxTree>;
    functions: Array<PgslFunctionDeclarationSyntaxTree>;
    variables: Array<PgslVariableDeclarationSyntaxTree>;
    structs: Array<PgslStructDeclarationSyntaxTree>;
};