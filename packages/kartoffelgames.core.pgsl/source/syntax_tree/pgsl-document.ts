import { PgslTrace } from "../trace/pgsl-trace.ts";
import { BasePgslSyntaxTree, PgslSyntaxTreeConstructor, type BasePgslSyntaxTreeMeta } from './base-pgsl-syntax-tree.ts';
import { PgslAliasDeclaration } from "./declaration/pgsl-alias-declaration.ts";
import { PgslEnumDeclaration } from "./declaration/pgsl-enum-declaration.ts";
import { PgslFunctionDeclaration } from "./declaration/pgsl-function-declaration.ts";
import { PgslStructDeclaration } from "./declaration/pgsl-struct-declaration.ts";
import { PgslVariableDeclaration } from "./declaration/pgsl-variable-declaration.ts";

export class PgslDocument extends BasePgslSyntaxTree {
    private readonly mBuildInContent: Array<BasePgslSyntaxTree>;

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
     * Trace syntax tree for validation and transpilation.
     * Wraps all child nodes into a global scope.
     * 
     * @param pTrace - Trace instance.
     */
    protected override onTrace(pTrace: PgslTrace): void {
        const lValidChilds = new Set<PgslSyntaxTreeConstructor>([
            PgslAliasDeclaration, PgslEnumDeclaration, PgslFunctionDeclaration, PgslVariableDeclaration, PgslStructDeclaration
        ]);

        // Create new scope for the current node.
        pTrace.newScope("global", () => {
            // Trace documents build-ins first.
            for (const lBuildInContent of this.mBuildInContent) {
                // Validate build-in structure.
                if (!lValidChilds.has(lBuildInContent.constructor as PgslSyntaxTreeConstructor)) {
                    pTrace.pushIncident(`Invalid build-in structure in document. Expected declaration but found '${lBuildInContent.constructor.name}'.`, lBuildInContent);
                }

                lBuildInContent.trace(pTrace);
            }

            // Trace all child structures.
            for (const lChild of this.childNodes) {
                // Validate child structure.
                if (!lValidChilds.has(lChild.constructor as PgslSyntaxTreeConstructor)) {
                    pTrace.pushIncident(`Invalid child structure in document. Expected declaration but found '${lChild.constructor.name}'.`, lChild);
                }

                lChild.trace(pTrace);
            }
        }, this);
    }
}