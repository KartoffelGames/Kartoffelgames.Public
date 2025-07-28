import { Exception } from '@kartoffelgames/core';
import type { PgslSyntaxDocument } from './pgsl-syntax-document.ts';
import type { PgslSyntaxTreeValidationTrace } from './pgsl-syntax-tree-validation-trace.ts';

/**
 * Base pgsl syntax tree object.
 * 
 * @remark
 * Lifecycle:
 * - constructor():,
 *     - No parent node is available.
 *     - Definition of scope. Should it define a new scope or use any parent scope.
 *     - appendChild() can be called to add child nodes.
 * 
 * - validate():
 *    - onScopeBuild() is called on the current node. Append 
 */
export abstract class BasePgslSyntaxTree<TValidationAttachment extends object | void = void> {
    private readonly mBuildIn: boolean;
    private readonly mChildNodes: Array<BasePgslSyntaxTree>;
    private readonly mMeta: SyntaxTreeMeta;
    private mParent: BasePgslSyntaxTree | null;

    /**
     * Child nodes of the syntax tree.
     */
    protected get childNodes(): ReadonlyArray<BasePgslSyntaxTree> {
        return this.mChildNodes;
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
     * @param pMeta - Syntax tree meta data.
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
        this.mChildNodes = new Array<BasePgslSyntaxTree>();
    }

    /**
     * Transpile the syntax tree into wgsl.
     * If the structure is build in, it will return an empty string.
     * 
     * @returns transpiled wgsl code.
     */
    public transpile(): string {
        // If build in, return empty string.
        if (this.mBuildIn) {
            return '';
        }

        // Call transpile function.
        return this.onTranspile();
    }

    /**
     * Validate tree structure.
     * 
     * @param pTrace - Validation trace.
     * 
     * @return this - Reference to the current syntax tree.
     */
    public validate(pTrace: PgslSyntaxTreeValidationTrace): this {
        // Call structure validate function.
        const lValidationAttachment: TValidationAttachment = this.onValidateIntegrity(pTrace);
        if (typeof lValidationAttachment !== 'undefined') {
            // I did this because i don't care. Hehehe
            pTrace.attachValue(this, lValidationAttachment as any);
        }

        // Return reference.
        return this;
    }

    /**
     * Add child syntax tree.
     * Sets childs parent.
     * 
     * @param pChild - Child syntax tree.
     */
    protected appendChild(...pChild: Array<BasePgslSyntaxTree>): void {
        // Add any child.
        for (const lChild of pChild) {
            // Append to child list. 
            this.mChildNodes.push(lChild);

            // Set childs parent.
            lChild.setParent(this);
        }
    }

    /**
     * Set parent tree of syntax tree.
     * 
     * @param pParent - Parent of structure.
     * 
     * @return this - Reference to the current syntax tree.
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
    protected abstract onTranspile(): string;

    /**
     * Validate syntax tree.
     * Shouldn't throw. Errors should be added to the scope.
     */
    protected abstract onValidateIntegrity(pScope: PgslSyntaxTreeValidationTrace): TValidationAttachment;
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