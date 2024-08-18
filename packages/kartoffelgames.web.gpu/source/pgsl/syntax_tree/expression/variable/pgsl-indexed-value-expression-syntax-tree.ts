import { Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTree, PgslSyntaxTreeDataStructure } from '../../base-pgsl-syntax-tree';
import { PgslExpressionSyntaxTree, PgslExpressionSyntaxTreeFactory, PgslExpressionSyntaxTreeStructureData, PgslVariableExpressionSyntaxTree, PgslVariableExpressionSyntaxTreeStructureData } from '../pgsl-expression-syntax-tree-factory';

/**
 * PGSL structure holding a variable with index expression.
 */
export class PgslIndexedValueExpressionSyntaxTree extends BasePgslSyntaxTree<PgslIndexedValueExpressionSyntaxTreeStructureData['meta']['type'], PgslIndexedValueExpressionSyntaxTreeStructureData['data']> {
    private mIndex: PgslExpressionSyntaxTree | null;
    private mValue: PgslVariableExpressionSyntaxTree | null;

    /**
     * Index expression of variable index expression.
     */
    public get index(): PgslExpressionSyntaxTree {
        if (this.mIndex === null) {
            throw new Exception('Index value not set.', this);
        }

        return this.mIndex;
    }

    /**
     * Value reference.
     */
    public get value(): PgslVariableExpressionSyntaxTree {
        if (this.mValue === null) {
            throw new Exception('Value not set.', this);
        }

        return this.mValue;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super('Expression-IndexedValue');

        this.mIndex = null;
        this.mValue = null;
    }
    
    /**
     * Apply data to current structure.
     * Any thrown error is converted into a parser error.
     * 
     * @param pData - Structure data.
     */
    protected override applyData(pData: PgslIndexedValueExpressionSyntaxTreeStructureData['data']): void {
        this.mValue = PgslExpressionSyntaxTreeFactory.createFrom(pData.value, this) as PgslVariableExpressionSyntaxTree;
        this.mIndex = PgslExpressionSyntaxTreeFactory.createFrom(pData.index, this);
    }

    /**
     * Retrieve data of current structure.
     */
    protected override retrieveData(): PgslIndexedValueExpressionSyntaxTreeStructureData['data'] {
        // Value validation.
        if (this.mValue === null) {
            throw new Exception('Variable not set.', this);
        }
        if (this.mIndex === null) {
            throw new Exception('Index value not set.', this);
        }

        return {
            value: this.mValue.retrieveDataStructure(),
            index: this.mIndex.retrieveDataStructure()
        };
    }
}

export type PgslIndexedValueExpressionSyntaxTreeStructureData = PgslSyntaxTreeDataStructure<'Expression-IndexedValue', {
    value: PgslVariableExpressionSyntaxTreeStructureData;
    index: PgslExpressionSyntaxTreeStructureData;
}>;