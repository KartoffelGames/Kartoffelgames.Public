import { BasePgslSyntaxTree, type BasePgslSyntaxTreeMeta } from './base-pgsl-syntax-tree.ts';
import { PgslAliasDeclarationSyntaxTree } from './declaration/pgsl-alias-declaration-syntax-tree.ts';
import { PgslEnumDeclarationSyntaxTree } from './declaration/pgsl-enum-declaration-syntax-tree.ts';
import { PgslFunctionDeclarationSyntaxTree } from './declaration/pgsl-function-declaration-syntax-tree.ts';
import { PgslStructDeclarationSyntaxTree } from './declaration/pgsl-struct-declaration-syntax-tree.ts';
import { PgslVariableDeclarationSyntaxTree } from './declaration/pgsl-variable-declaration-syntax-tree.ts';
import { PgslSyntaxTreeValidationTrace } from "./pgsl-syntax-tree-validation-trace.ts";

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
     * Transpile syntax tree to WGSL code.
     */
    protected override onTranspile(): string {
        // Transpile all childs.
        return this.childNodes
            .reduce((pCurrentValue: string, pChild: BasePgslSyntaxTree) => {
                return pCurrentValue + pChild.transpile();
            }, '');
    }

    /**
     * Validate syntax tree.
     */
    protected override onValidateIntegrity(pTrace: PgslSyntaxTreeValidationTrace): void {
        // Create new scope.
        pTrace.newScope(() => {
            // Validate all child structures.
            for (const lChild of this.childNodes) {
                // Module scope content must be a specific tree type.
                switch (true) {
                    case lChild instanceof PgslAliasDeclarationSyntaxTree: break;
                    case lChild instanceof PgslEnumDeclarationSyntaxTree: break;
                    case lChild instanceof PgslFunctionDeclarationSyntaxTree: break;
                    case lChild instanceof PgslVariableDeclarationSyntaxTree: break;
                    case lChild instanceof PgslStructDeclarationSyntaxTree: break;
                    default: {
                        pTrace.pushError(`Unknown module structure.`, lChild.meta, lChild);
                    }
                }

                // Validate child structure.
                lChild.validate(pTrace);
            }
        });
    }
}