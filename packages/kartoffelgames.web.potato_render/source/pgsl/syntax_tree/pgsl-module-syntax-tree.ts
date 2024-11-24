import { Dictionary, Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTree, BasePgslSyntaxTreeMeta } from './base-pgsl-syntax-tree';
import { PgslAliasDeclarationSyntaxTree } from './declaration/pgsl-alias-declaration-syntax-tree';
import { PgslEnumDeclarationSyntaxTree } from './declaration/pgsl-enum-declaration-syntax-tree';
import { PgslFunctionDeclarationSyntaxTree } from './declaration/pgsl-function-declaration-syntax-tree';
import { PgslStructDeclarationSyntaxTree } from './declaration/pgsl-struct-declaration-syntax-tree';
import { PgslVariableDeclarationSyntaxTree } from './declaration/pgsl-variable-declaration-syntax-tree';
import { IPgslVariableDeclarationSyntaxTree } from './interface/i-pgsl-variable-declaration-syntax-tree.interface';

export class PgslModuleSyntaxTree extends BasePgslSyntaxTree<PgslModuleSyntaxTreeSetupData> {
    private readonly mContentList: Array<BasePgslSyntaxTree>;

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
        this.ensureSetup();

        // Read parent scoped variables
        const lParentVariables: Dictionary<string, IPgslVariableDeclarationSyntaxTree> = super.scopedVariables;

        // Append current scoped variables. Override parent.
        for (const lVariable of this.setupData.globalVariables.values()) {
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
    public constructor(pContentList: Array<BasePgslSyntaxTree>, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

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
    public resolveAlias(pName: string): PgslAliasDeclarationSyntaxTree | null {
        this.ensureSetup();

        return this.setupData.alias.get(pName) ?? null;
    }

    /**
     * Resolve enum name to its declaration.
     * 
     * @param pName - Enum name.
     * 
     * @returns enum declaration  
     */
    public resolveEnum(pName: string): PgslEnumDeclarationSyntaxTree | null {
        this.ensureSetup();

        return this.setupData.enums.get(pName) ?? null;
    }

    /**
     * Resolve function name to its declaration.
     * 
     * @param pName - Function name.
     * 
     * @returns function declaration.
     */
    public resolveFunction(pName: string): PgslFunctionDeclarationSyntaxTree | null {
        this.ensureSetup();

        return this.setupData.functions.get(pName) ?? null;
    }

    /**
     * Resolve struct name to its declaration.
     * 
     * @param pName - Struct name.
     * 
     * @returns struct declaration  
     */
    public resolveStruct(pName: string): PgslStructDeclarationSyntaxTree | null {
        this.ensureSetup();

        return this.setupData.structs.get(pName) ?? null;
    }

    protected override onSetup(): PgslModuleSyntaxTreeSetupData {
        const lSavedContent: PgslModuleSyntaxTreeSetupData = {
            alias: new Dictionary<string, PgslAliasDeclarationSyntaxTree>(),
            enums: new Dictionary<string, PgslEnumDeclarationSyntaxTree>(),
            globalVariables: new Dictionary<string, PgslVariableDeclarationSyntaxTree>(),
            structs: new Dictionary<string, PgslStructDeclarationSyntaxTree>(),
            functions: new Dictionary<string, PgslFunctionDeclarationSyntaxTree>(),
        };

        // Loop data.
        for (const lContent of this.mContentList) {
            // Set data to correct buckets.
            switch (true) {
                case lContent instanceof PgslAliasDeclarationSyntaxTree: {
                    if (lSavedContent.alias.has(lContent.name)) {
                        throw new Exception(`Alias "${lContent.name}" is already defined.`, this);
                    }

                    // Apply alias.
                    lSavedContent.alias.set(lContent.name, lContent);

                    break;
                }
                case lContent instanceof PgslEnumDeclarationSyntaxTree: {
                    // Enum data does not merge.
                    if (lSavedContent.enums.has(lContent.name)) {
                        throw new Exception(`Enum "${lContent.name}" is already defined.`, this);
                    }

                    // Apply new enum.
                    lSavedContent.enums.set(lContent.name, lContent);

                    break;
                }
                case lContent instanceof PgslFunctionDeclarationSyntaxTree: {
                    // Function data does not merge.
                    if (lSavedContent.functions.has(lContent.name)) {
                        throw new Exception(`Function "${lContent.name}" is already defined.`, this);
                    }

                    // Apply new function.
                    lSavedContent.functions.set(lContent.name, lContent);

                    break;
                }
                case lContent instanceof PgslVariableDeclarationSyntaxTree: {
                    // Variables data does not merge.
                    if (lSavedContent.globalVariables.has(lContent.name)) {
                        throw new Exception(`Variable declaration "${lContent.name}" is already defined.`, this);
                    }

                    // Apply new variable.
                    lSavedContent.globalVariables.set(lContent.name, lContent);

                    break;
                }
                case lContent instanceof PgslStructDeclarationSyntaxTree: {
                    // Struct data does not merge.
                    if (lSavedContent.structs.has(lContent.name)) {
                        throw new Exception(`Struct declaration "${lContent.name}" is already defined.`, this);
                    }

                    // Apply new variable.
                    lSavedContent.structs.set(lContent.name, lContent);

                    break;
                }
            }
        }

        return lSavedContent;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // TODO: Validate function parameter and template.
    }
}

type PgslModuleSyntaxTreeSetupData = {
    alias: Dictionary<string, PgslAliasDeclarationSyntaxTree>;
    enums: Dictionary<string, PgslEnumDeclarationSyntaxTree>;
    globalVariables: Dictionary<string, PgslVariableDeclarationSyntaxTree>;
    structs: Dictionary<string, PgslStructDeclarationSyntaxTree>;
    functions: Dictionary<string, PgslFunctionDeclarationSyntaxTree>;
};