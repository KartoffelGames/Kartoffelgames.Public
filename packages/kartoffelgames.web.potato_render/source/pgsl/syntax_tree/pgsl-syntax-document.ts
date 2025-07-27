import { Exception } from "@kartoffelgames/core";
import { BasePgslSyntaxTree, BasePgslSyntaxTreeMeta } from "./base-pgsl-syntax-tree.ts";
import { PgslSyntaxTreeScope } from "./pgsl-syntax-tree-scope.ts";
import { PgslAliasDeclarationSyntaxTree } from "./declaration/pgsl-alias-declaration-syntax-tree.ts";
import { PgslEnumDeclarationSyntaxTree } from "./declaration/pgsl-enum-declaration-syntax-tree.ts";
import { PgslFunctionDeclarationSyntaxTree } from "./declaration/pgsl-function-declaration-syntax-tree.ts";
import { PgslStructDeclarationSyntaxTree } from "./declaration/pgsl-struct-declaration-syntax-tree.ts";
import { PgslVariableDeclarationSyntaxTree } from "./declaration/pgsl-variable-declaration-syntax-tree.ts";

export class PgslSyntaxDocument extends BasePgslSyntaxTree {
    /**
     * Assoziated document of pgsl structure.
     */
    public override get document(): PgslSyntaxDocument {
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
    public constructor(pMeta: BasePgslSyntaxTreeMeta, pContentList: Array<BasePgslSyntaxTree>) {
        super(pMeta);

        // All in one declaration list to setup in correct order.
        this.appendChild(...pContentList);
    }

    /**
     * Validate syntax tree.
     */
    protected override onValidateIntegrity(pScope: PgslSyntaxTreeScope): void {
        // Create new scope.
        pScope.valueScope(() => {
            // Validate all child structures.
            for (const lChild of this.childs) {
                // Module scope content must be a specific tree type.
                switch (true) {
                    case lChild instanceof PgslAliasDeclarationSyntaxTree: break;
                    case lChild instanceof PgslEnumDeclarationSyntaxTree: break;
                    case lChild instanceof PgslFunctionDeclarationSyntaxTree: break;
                    case lChild instanceof PgslVariableDeclarationSyntaxTree: break;
                    case lChild instanceof PgslStructDeclarationSyntaxTree: break;
                    default: {
                        throw new Exception(`Unknown module structure.`, this);
                    }
                }

                lChild.validate(pScope);
            }
        });
    }

    /**
     * Transpile syntax tree to WGSL code.
     */
    public override transpile(): string {
        // Transpile all childs.
        return this.childs
            .reduce((pCurrentValue: string, pChild: BasePgslSyntaxTree) => {
                return pCurrentValue + pChild.transpile();
            }, '');
    }
}