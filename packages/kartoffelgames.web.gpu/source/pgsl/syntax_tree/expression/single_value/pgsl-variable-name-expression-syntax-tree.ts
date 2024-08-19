import { Exception } from '@kartoffelgames/core';
import { BasePgslSingleValueExpressionSyntaxTree } from './base-pgsl-single-value-expression-syntax-tree';

/**
 * PGSL structure holding single variable name.
 */
export class PgslVariableNameExpressionSyntaxTree extends BasePgslSingleValueExpressionSyntaxTree<PgslVariableNameExpressionSyntaxTreeStructureData> {
    private readonly mName: string;

    /**
     * Variable name.
     */
    public get name(): string {
        return this.mName;
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
    public constructor(pData: PgslVariableNameExpressionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set data.
        this.mName = pData.name;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidate(): void {
        // Catch undefined variables.
        if (!this.scopedVariables.has(this.name)) {
            throw new Exception(`Variable "${this.name}" not defined.`, this);
        }
    }
}

export type PgslVariableNameExpressionSyntaxTreeStructureData = {
    name: string;
};