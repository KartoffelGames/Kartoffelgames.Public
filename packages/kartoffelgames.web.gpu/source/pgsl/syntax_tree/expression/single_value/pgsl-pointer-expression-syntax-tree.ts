import { Exception } from '@kartoffelgames/core';
import { PgslTypeDefinitionSyntaxTree } from '../../general/pgsl-type-definition-syntax-tree';
import { BasePgslSingleValueExpressionSyntaxTree } from './base-pgsl-single-value-expression-syntax-tree';
import { PgslIndexedValueExpressionSyntaxTree } from './pgsl-indexed-value-expression-syntax-tree';
import { PgslValueDecompositionExpressionSyntaxTree } from './pgsl-value-decomposition-expression-syntax-tree';
import { PgslVariableNameExpressionSyntaxTree } from './pgsl-variable-name-expression-syntax-tree';

/**
 * PGSL structure holding a variable name used as a pointer value.
 */
export class PgslPointerExpressionSyntaxTree extends BasePgslSingleValueExpressionSyntaxTree<PgslPointerExpressionSyntaxTreeStructureData> {
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

        // Validate that it needs to be a variable name, index value or value decomposition. // TODO: Or a parentheses with variable or addressof as expression. 
        if (!(pData.variable instanceof PgslVariableNameExpressionSyntaxTree || pData.variable instanceof PgslIndexedValueExpressionSyntaxTree || pData.variable instanceof PgslValueDecompositionExpressionSyntaxTree)) {
            throw new Exception('Pointer value can only be a variable', this);
        }

        // Set data.
        this.mVariable = pData.variable;
    }

    /**
     * On constant state request.
     */
    protected onConstantStateSet(): boolean {
        // Expression is constant when variable is a constant.
        return this.mVariable.isConstant;
    }

    /**
     * On type resolve of expression
     */
    protected onResolveType(): PgslTypeDefinitionSyntaxTree {
        // Pointer value will allways be a pointer.
        return this.mVariable.resolveType;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // TODO: Variable needs to be a address.
    }
}

export type PgslPointerExpressionSyntaxTreeStructureData = {
    variable: BasePgslSingleValueExpressionSyntaxTree;
};