import { Exception } from '@kartoffelgames/core';
import { BasePgslExpressionSyntaxTree } from '../base-pgsl-expression-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from '../../type/definition/base-pgsl-type-definition-syntax-tree';
import { PgslPointerTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-pointer-type-definition-syntax-tree';

/**
 * PGSL structure holding a variable name used as a pointer value.
 */
export class PgslPointerExpressionSyntaxTree extends BasePgslExpressionSyntaxTree<PgslPointerExpressionSyntaxTreeStructureData> {
    private readonly mVariable: BasePgslExpressionSyntaxTree;

    /**
     * Variable reference.
     */
    public get variable(): BasePgslExpressionSyntaxTree {
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
    protected determinateIsConstant(): boolean {
        // Expression is constant when variable is a constant.
        return this.mVariable.isConstant;
    }

    /**
     * On is storage set.
     */
    protected determinateIsStorage(): boolean {
        return true;
    }

    /**
     * On type resolve of expression
     */
    protected determinateResolveType(): BasePgslTypeDefinitionSyntaxTree {
        // Pointer value will allways be a pointer.
        return this.mVariable.resolveType; // TODO: Should not return the pointer but the type instead.
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Validate that it needs to be a variable name, index value or value decomposition.
        if (this.mVariable.resolveType instanceof PgslPointerTypeDefinitionSyntaxTree) {
            throw new Exception('Value of a pointer expression needs to be a pointer', this);
        }

        // TODO: Is the pointer used in the right context?
    }
}

export type PgslPointerExpressionSyntaxTreeStructureData = {
    variable: BasePgslExpressionSyntaxTree;
};