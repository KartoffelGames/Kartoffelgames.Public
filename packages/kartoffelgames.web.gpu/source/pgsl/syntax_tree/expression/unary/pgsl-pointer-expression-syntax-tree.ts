import { BasePgslExpressionSyntaxTree } from '../base-pgsl-expression-syntax-tree';
import { PgslVariableNameExpressionSyntaxTree } from '../single_value/pgsl-variable-name-expression-syntax-tree';

/**
 * PGSL structure holding a variable name used as a pointer value.
 */
export class PgslPointerExpressionSyntaxTree extends BasePgslExpressionSyntaxTree<PgslPointerExpressionSyntaxTreeStructureData> {
    private readonly mVariable: PgslVariableNameExpressionSyntaxTree;

    /**
     * Variable reference.
     */
    public get variable(): PgslVariableNameExpressionSyntaxTree {
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
     * Validate data of current structure.
     */
    protected override onValidate(): void {
        // Nothing to validate eighter.
    }
}

export type PgslPointerExpressionSyntaxTreeStructureData = {
    variable: PgslVariableNameExpressionSyntaxTree;
};