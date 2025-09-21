import { BasePgslSyntaxTree, type BasePgslSyntaxTreeMeta } from './base-pgsl-syntax-tree.ts';
import { PgslAliasDeclaration } from './declaration/pgsl-alias-declaration.ts';
import { PgslEnumDeclaration } from './declaration/pgsl-enum-declaration.ts';
import { PgslFunctionDeclaration } from './declaration/pgsl-function-declaration.ts';
import { PgslStructDeclaration } from './declaration/pgsl-struct-declaration.ts';
import { PgslVariableDeclaration } from './declaration/pgsl-variable-declaration.ts';
import { PgslValidationTrace } from "./pgsl-validation-trace.ts";

export class PgslDocument extends BasePgslSyntaxTree {
    private readonly mBuildInContent: Array<BasePgslSyntaxTree>;

    /**
     * Assoziated document of pgsl structure.
     */
    public override get document(): PgslDocument {
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

        // Initialize build in content list.
        this.mBuildInContent = new Array<BasePgslSyntaxTree>();

        // All in one declaration list to setup in correct order.
        this.appendChild(...pContentList);
    }

    /**
     * Add content to the build in list.
     * 
     * @param pContent - Content to add as build in.
     */
    public addBuildInContent<T extends BasePgslSyntaxTree>(pContent: T): T {
        this.mBuildInContent.push(pContent);
        return pContent;
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
    protected override onValidateIntegrity(pTrace: PgslValidationTrace): void {
        // Create new scope.
        pTrace.newScope(this, () => {
            // Validate documents build ins first.
            for (const lBuildInContent of this.mBuildInContent) {
                lBuildInContent.validate(pTrace);
            }

            // Validate all child structures.
            for (const lChild of this.childNodes) {
                // Module scope content must be a specific tree type.
                switch (true) {
                    case lChild instanceof PgslAliasDeclaration: break; // TODO: Cant do this, as alias types could be that as well.
                    case lChild instanceof PgslEnumDeclaration: break; // TODO: Cant do this, as alias types could be that as well.
                    case lChild instanceof PgslFunctionDeclaration: break; // TODO: Cant do this, as alias types could be that as well.
                    case lChild instanceof PgslVariableDeclaration: break; // TODO: Cant do this, as alias types could be that as well.
                    case lChild instanceof PgslStructDeclaration: break; // TODO: Cant do this, as alias types could be that as well.
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