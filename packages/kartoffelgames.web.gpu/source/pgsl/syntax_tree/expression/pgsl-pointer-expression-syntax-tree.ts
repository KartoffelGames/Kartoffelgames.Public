import { Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTree, PgslSyntaxTreeDataStructure } from '../base-pgsl-syntax-tree';
import { PgslExpressionSyntaxTreeFactory, PgslVariableExpressionSyntaxTree, PgslVariableExpressionSyntaxTreeStructureData } from './pgsl-expression-syntax-tree';

export class PgslPointerExpressionSyntaxTree extends BasePgslSyntaxTree<PgslPointerExpressionSyntaxTreeStructureData['meta']['type'], PgslPointerExpressionSyntaxTreeStructureData['data']> {
    private mVariable: PgslVariableExpressionSyntaxTree | null;

    /**
     * Variable reference.
     */
    public get variable(): PgslVariableExpressionSyntaxTree {
        if (this.mVariable === null) {
            throw new Exception('Variable not set.', this);
        }

        return this.mVariable;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super('Expression-Pointer');

        this.mVariable = null;
    }

    /**
     * Apply data to current structure.
     * Any thrown error is converted into a parser error.
     * 
     * @param pData - Structure data.
     */
    protected override applyData(pData: PgslPointerExpressionSyntaxTreeStructureData['data']): void {
        this.mVariable = PgslExpressionSyntaxTreeFactory.createFrom(pData.variable, this) as PgslVariableExpressionSyntaxTree;
    }

    /**
     * Retrieve data of current structure.
     */
    protected override retrieveData(): PgslPointerExpressionSyntaxTreeStructureData['data'] {
        // Value validation.
        if (this.mVariable === null) {
            throw new Exception('Variable not set.', this);
        }

        return {
            variable: this.mVariable.retrieveDataStructure(),
        };
    }
}

export type PgslPointerExpressionSyntaxTreeStructureData = PgslSyntaxTreeDataStructure<'Expression-Pointer', {
    variable: PgslVariableExpressionSyntaxTreeStructureData;
}>;