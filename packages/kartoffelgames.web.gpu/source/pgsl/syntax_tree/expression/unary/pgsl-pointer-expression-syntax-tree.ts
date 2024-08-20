import { Exception } from '@kartoffelgames/core';
import { BasePgslExpressionSyntaxTree } from '../base-pgsl-expression-syntax-tree';
import { BasePgslSingleValueExpressionSyntaxTree } from '../single_value/base-pgsl-single-value-expression-syntax-tree';
import { PgslIndexedValueExpressionSyntaxTree } from '../single_value/pgsl-indexed-value-expression-syntax-tree';
import { PgslValueDecompositionExpressionSyntaxTree } from '../single_value/pgsl-value-decomposition-expression-syntax-tree';
import { PgslVariableNameExpressionSyntaxTree } from '../single_value/pgsl-variable-name-expression-syntax-tree';

/**
 * PGSL structure holding a variable name used as a pointer value.
 */
export class PgslPointerExpressionSyntaxTree extends BasePgslExpressionSyntaxTree<PgslPointerExpressionSyntaxTreeStructureData> {
    private readonly mVariable: BasePgslSingleValueExpressionSyntaxTree;

    /**
     * Variable reference.
     */
    public get variable(): BasePgslSingleValueExpressionSyntaxTree {
        return this.mVariable;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pStartColumn - Parsing start column.
     * @param pStartLine - Parsing start line.
     * @param pEndColumn - Parsing end column.
     * @param pEndLine - Parsing end line.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslPointerExpressionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Validate that it needs to be a variable name, index value or value decomposition.
        if (!(pData.variable instanceof PgslVariableNameExpressionSyntaxTree || pData.variable instanceof PgslIndexedValueExpressionSyntaxTree || pData.variable instanceof PgslValueDecompositionExpressionSyntaxTree)) {
            throw new Exception('Pointer value can only be a variable', this);
        }

        // Set data.
        this.mVariable = pData.variable;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Nothing to validate eighter.
    }
}

export type PgslPointerExpressionSyntaxTreeStructureData = {
    variable: BasePgslSingleValueExpressionSyntaxTree;
};