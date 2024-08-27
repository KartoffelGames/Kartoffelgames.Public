import { Exception } from '@kartoffelgames/core';
import { BasePgslTypeDefinitionSyntaxTree } from '../../type/base-pgsl-type-definition-syntax-tree';
import { PgslPointerTypeDefinitionSyntaxTree } from '../../type/pgsl-pointer-type-definition-syntax-tree';
import { BasePgslSingleValueExpressionSyntaxTree } from './base-pgsl-single-value-expression-syntax-tree';

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
    protected onResolveType(): BasePgslTypeDefinitionSyntaxTree {
        // Pointer value will allways be a pointer.
        return this.mVariable.resolveType; // TODO: Should not return the pointer but the type instead.
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Validate that it needs to be a variable name, index value or value decomposition.
        if(this.mVariable.resolveType instanceof PgslPointerTypeDefinitionSyntaxTree){
            throw new Exception('Value of a pointer expression needs to be a pointer', this);
        }

        // TODO: Is the pointer used in the right context?
    }
}

export type PgslPointerExpressionSyntaxTreeStructureData = {
    variable: BasePgslSingleValueExpressionSyntaxTree;
};