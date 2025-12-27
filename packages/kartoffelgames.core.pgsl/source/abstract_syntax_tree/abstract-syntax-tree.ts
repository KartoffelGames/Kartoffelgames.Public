import type { IAnyParameterConstructor } from '../../../kartoffelgames.core/source/interface/i-constructor.ts';
import type { Cst } from '../concrete_syntax_tree/general.type.ts';
import type { AbstractSyntaxTreeContext } from './abstract-syntax-tree-context.ts';

/**
 * Base pgsl syntax tree object.
 */
export abstract class AbstractSyntaxTree<TCst extends Cst<string> = Cst<string>, TData extends object = {}> {
    private readonly mMeta: AbstractSyntaxTreeMeta;
    private mData: TData | null;
    private readonly mConcreteSyntaxTree: TCst;

    /**
     * Get concrete syntax tree node.
     */
    public get cst(): Readonly<TCst> {
        return this.mConcreteSyntaxTree;
    }

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
     * Get syntax tree meta.
     */
    public get meta(): Readonly<AbstractSyntaxTreeMeta> {
        return this.mMeta;
    }

    /**
     * Constructor.
     * 
     * @param pConcreteSyntaxTree - Concrete syntax tree node.
     */
    public constructor(pConcreteSyntaxTree: TCst,) {
        // Save meta information.
        this.mMeta = [
            pConcreteSyntaxTree.range[0],
            pConcreteSyntaxTree.range[1],
            pConcreteSyntaxTree.range[2],
            pConcreteSyntaxTree.range[3]
        ];

        this.mConcreteSyntaxTree = pConcreteSyntaxTree;

        // Set empty initial data.
        this.mData = null;
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
        // Process syntax tree to build up data.
        this.mData = this.onProcess(pContext);

        return this;
    }

    /**
     * Process the concrete syntax tree.
     * Builds up the abstract structure of the syntax tree.
     * 
     * @param pContext - Processing context.
     */
    protected abstract onProcess(pContext: AbstractSyntaxTreeContext): TData;
}

/**
 * Type representing a constructor function for PGSL syntax tree nodes.
 * Used as a key in the validation processor map to associate constructors with their corresponding validation logic.
 */
export type AbstractSyntaxTreeConstructor = IAnyParameterConstructor<AbstractSyntaxTree>;

export type AbstractSyntaxTreeMeta = [lineStart: number, columnStart: number, lineEnd: number, columnEnd: number];