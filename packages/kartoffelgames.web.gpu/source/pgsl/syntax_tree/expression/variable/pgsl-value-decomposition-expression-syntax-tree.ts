import { Exception } from '@kartoffelgames/core';
import { PgslExpressionSyntaxTreeFactory, PgslVariableExpressionSyntaxTree, PgslVariableExpressionSyntaxTreeStructureData } from '../pgsl-expression-syntax-tree-factory';
import { BasePgslSyntaxTree, PgslSyntaxTreeDataStructure } from '../../base-pgsl-syntax-tree';

export class PgslValueDecompositionExpressionSyntaxTree extends BasePgslSyntaxTree<PgslValueDecompositionExpressionSyntaxTreeStructureData['meta']['type'], PgslValueDecompositionExpressionSyntaxTreeStructureData['data']> {
    private mProperty: string;
    private mValue: PgslVariableExpressionSyntaxTree | null;

    /**
     * Index expression of variable index expression.
     */
    public get property(): string {
        return this.mProperty;
    }

    /**
     * Value reference.
     */
    public get value(): PgslVariableExpressionSyntaxTree {
        if (this.mValue === null) {
            throw new Exception('Variable not set.', this);
        }

        return this.mValue;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super('Expression-ValueDecomposition');

        this.mProperty = '';
        this.mValue = null;
    }

    /**
     * Apply data to current structure.
     * Any thrown error is converted into a parser error.
     * 
     * @param pData - Structure data.
     */
    protected override applyData(pData: PgslValueDecompositionExpressionSyntaxTreeStructureData['data']): void {
        this.mValue = PgslExpressionSyntaxTreeFactory.createFrom(pData.value, this) as PgslVariableExpressionSyntaxTree;
        this.mProperty = pData.property;
    }

    /**
     * Retrieve data of current structure.
     */
    protected override retrieveData(): PgslValueDecompositionExpressionSyntaxTreeStructureData['data'] {
        if (this.mValue === null) {
            throw new Exception('Variable not set.', this);
        }
        
        return {
            value: this.mValue.retrieveDataStructure(),
            property: this.mProperty
        };
    }
}

export type PgslValueDecompositionExpressionSyntaxTreeStructureData = PgslSyntaxTreeDataStructure<'Expression-ValueDecomposition', {
    value: PgslVariableExpressionSyntaxTreeStructureData;
    property: string;
}>;