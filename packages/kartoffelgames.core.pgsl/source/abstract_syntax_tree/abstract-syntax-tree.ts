import { Exception } from '@kartoffelgames/core';
import type { IAnyParameterConstructor } from '../../../kartoffelgames.core/source/interface/i-constructor.ts';
import type { Cst } from '../concrete_syntax_tree/general.type.ts';
import type { AbstractSyntaxTreeContext } from './abstract-syntax-tree-context.ts';

/**
 * Base pgsl syntax tree object.
 */
export abstract class AbstractSyntaxTree<TCst extends Cst<string> = Cst<string>, TData extends object = object> {
    private readonly mConcreteSyntaxTree: TCst | null;
    private mData: TData | null;
    private readonly mMeta: AbstractSyntaxTreeMeta;

    /**
     * Get syntax tree data.
     */
    public get data(): Readonly<TData> {
        if (this.mData === null) {
            throw new Error('Abstract syntax tree data is not yet processed.');
        }

        return this.mData;
    }

    /**
     * Check if syntax tree is processed.
     */
    public get isProcessed(): boolean {
        return this.mData !== null;
    }

    /**
     * Get syntax tree meta.
     */
    public get meta(): Readonly<AbstractSyntaxTreeMeta> {
        return this.mMeta;
    }

    /**
     * Constructor.
     * 
     * @param pTreeData - Concrete syntax tree node.
     */
    public constructor(pTreeData: TCst | TData) {
        // Tree data is a CST
        if ('type' in pTreeData && 'range' in pTreeData) {
            // Save meta information.
            this.mMeta = [
                pTreeData.range[0],
                pTreeData.range[1],
                pTreeData.range[2],
                pTreeData.range[3]
            ];

            this.mConcreteSyntaxTree = pTreeData;

            // Set empty initial data.
            this.mData = null;
            return;
        }

        // Init this AST with full processed data.
        this.mMeta = [0, 0, 0, 0];
        this.mConcreteSyntaxTree = null;
        this.mData = pTreeData;
    }

    /**
     * Process the concrete syntax tree.
     * Builds up the abstract structure of the syntax tree.
     * 
     * @param pContext - Processing context.
     * 
     * @returns This syntax tree node. 
     */
    public process(pContext: AbstractSyntaxTreeContext): this {
        // Prevent double process.
        if(this.mData){
            throw new Exception('Tree is already processed.', this);
        }

        // Checking for data also guards unset CST. As the data is set cst is unset.

        // Process syntax tree to build up data.
        this.mData = this.onProcess(pContext, this.mConcreteSyntaxTree!);

        return this;
    }

    /**
     * Process the concrete syntax tree.
     * Builds up the abstract structure of the syntax tree.
     * 
     * @param pContext - Processing context.
     */
    protected abstract onProcess(pContext: AbstractSyntaxTreeContext, pCst: TCst): TData;
}

/**
 * Type representing a constructor function for PGSL syntax tree nodes.
 * Used as a key in the validation processor map to associate constructors with their corresponding validation logic.
 */
export type AbstractSyntaxTreeConstructor = IAnyParameterConstructor<AbstractSyntaxTree>;

export type AbstractSyntaxTreeMeta = [lineStart: number, columnStart: number, lineEnd: number, columnEnd: number];