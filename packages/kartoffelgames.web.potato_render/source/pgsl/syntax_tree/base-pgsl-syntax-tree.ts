import { Exception } from '@kartoffelgames/core';
import { PgslSyntaxDocument } from "./pgsl-syntax-document.ts";
import { PgslSyntaxTreeScope } from "./pgsl-syntax-tree-scope.ts";

/**
 * Base pgsl syntax tree object.
 */
export abstract class BasePgslSyntaxTree {
    private readonly mBuildIn: boolean;
    private readonly mChilds: Array<BasePgslSyntaxTree>;
    private readonly mMeta: SyntaxTreeMeta;
    private mParent: BasePgslSyntaxTree | null;

    /**
     * Structure is build in and does not be included in the final output.
     * Can still be used for validation.
     */
    public get buildIn(): boolean {
        return this.mBuildIn;
    }

    /**
     * Child nodes of the syntax tree.
     */
    public get childs(): ReadonlyArray<BasePgslSyntaxTree> {
        return this.mChilds;
    }

    /**
     * Assoziated document of pgsl structure.
     */
    public get document(): PgslSyntaxDocument {
        if (!this.mParent) {
            throw new Exception('PGSL-Structure not attached to any document', this);
        }

        return this.mParent.document;
    }

    /**
     * Get syntax tree meta.
     */
    public get meta(): SyntaxTreeMeta {
        return this.mMeta;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pMeta: BasePgslSyntaxTreeMeta) {
        // Save meta information.
        this.mMeta = {
            position: {
                start: {
                    line: pMeta.range[0],
                    column: pMeta.range[1],
                },
                end: {
                    line: pMeta.range[2],
                    column: pMeta.range[3]
                }
            }
        };
        this.mBuildIn = pMeta.buildIn ?? false;

        // Hirachy information.
        this.mParent = null;
        this.mChilds = new Array<BasePgslSyntaxTree>();
    }

    /**
     * Add child syntax tree.
     * Sets childs parent.
     * 
     * @param pChild - Child syntax tree.
     */
    public appendChild(...pChild: Array<BasePgslSyntaxTree>): void {
        // Add any child.
        for (const lChild of pChild) {
            // Append to child list. 
            this.mChilds.push(lChild);

            // Set childs parent.
            lChild.setParent(this);
        }
    }

    /**
     * Validate tree structure. 
     */
    public validate(pScope: PgslSyntaxTreeScope): this {
        // Call structure validate function.
        this.onValidateIntegrity(pScope);

        // Return reference.
        return this;
    }

    /**
     * Validate syntax tree.
     * Shouldn't throw. Errors should be added to the scope.
     */
    protected abstract onValidateIntegrity(pScope: PgslSyntaxTreeScope): void;

    /**
     * Set parent tree of syntax tree.
     * 
     * @param pParent - Parent of structure.
     */
    private setParent(pParent: BasePgslSyntaxTree): this {
        // Set parent.
        this.mParent = pParent;

        // Return reference.
        return this;
    }

    /**
     * Transpile the syntax tree into wgsl.
     */
    public abstract transpile(): string;
}


export type BasePgslSyntaxTreeMeta = {
    range: [number, number, number, number],
    buildIn?: boolean;
};

export type SyntaxTreeMeta = {
    position: {
        start: {
            column: number;
            line: number;
        };
        end: {
            column: number;
            line: number;
        };
    };
};