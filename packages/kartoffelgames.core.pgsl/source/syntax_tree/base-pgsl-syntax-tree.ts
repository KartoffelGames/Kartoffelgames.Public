import { Exception } from '@kartoffelgames/core';
import type { PgslDocument } from './pgsl-document.ts';
import type { PgslValidationTrace } from './pgsl-validation-trace.ts';
import { PgslFileMetaInformation } from "./pgsl-file-meta-information.ts";

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
    /**
     * Convert meta data to a syntax tree meta object.
     * 
     * @param pMeta - Meta data to convert.
     * 
     * @returns Converted meta data. 
     */
    public static convertMeta(pMeta: SyntaxTreeMeta): BasePgslSyntaxTreeMeta {
        return {
            range: [
                pMeta.position.start.line,
                pMeta.position.start.column,
                pMeta.position.end.line,
                pMeta.position.end.column,
            ]
        };
    }

    /**
     * Create empty meta data.
     * 
     * @returns Empty meta data.
     */
    public static emptyMeta(): BasePgslSyntaxTreeMeta {
        return {
            range: [0, 0, 0, 0],
            buildIn: true
        };
    }

    private readonly mBuildIn: boolean;
    private readonly mChildNodes: Array<BasePgslSyntaxTree>;
    private readonly mMeta: SyntaxTreeMeta;
    private mParent: BasePgslSyntaxTree | null;

    /**
     * Child nodes of the syntax tree.
     */
    public get childNodes(): ReadonlyArray<BasePgslSyntaxTree> {
        return this.mChildNodes;
    }

    /**
     * Assoziated document of pgsl structure.
     */
    public get document(): PgslDocument {
        if (!this.mParent) {
            throw new Exception('PGSL-Structure not attached to any document', this);
        }

        return this.mParent.document;
    }

    /**
     * Parent node of the syntax tree.
     */
    public get parent(): BasePgslSyntaxTree {
        if (!this.mParent) {
            throw new Exception('PGSL-Structure not attached to any parent', this);
        }

        return this.mParent;
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
     * @param pTrace - Transpilation trace.
     * 
     * @returns transpiled wgsl code.
     */
    public transpile(pTrace: PgslFileMetaInformation): string {
        // If build in, return empty string.
        if (this.mBuildIn) {
            return '';
        }

        // Call transpile function.
        return this.onTranspile(pTrace);
    }

    /**
     * Validate tree structure.
     * 
     * @param pTrace - Validation trace.
     * 
     * @return this - Reference to the current syntax tree.
     */
    public validate(pTrace: PgslValidationTrace): this {
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
     * 
     * @param pTrace - Transpilation trace.
     * 
     * @returns transpiled wgsl code.
     */
    protected abstract onTranspile(pTrace: PgslFileMetaInformation): string;

    /**
     * Validate syntax tree.
     * Shouldn't throw. Errors should be added to the scope.
     */
    protected abstract onValidateIntegrity(pTrace: PgslValidationTrace): TValidationAttachment;
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