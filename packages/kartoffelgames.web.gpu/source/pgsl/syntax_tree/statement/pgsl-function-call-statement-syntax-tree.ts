import { PgslSyntaxTreeInitData } from '../base-pgsl-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree';
import { PgslFunctionCallExpressionSyntaxTree } from '../expression/single_value/pgsl-function-call-expression-syntax-tree';
import { BasePgslStatementSyntaxTree } from './base-pgsl-statement-syntax-tree';

/**
 * PGSL syntax tree of a function call statement with optional template list.
 */
export class PgslFunctionCallStatementSyntaxTree extends BasePgslStatementSyntaxTree<PgslFunctionCallStatementSyntaxTreeStructureData> {
    private readonly mFunctionExpression: PgslFunctionCallExpressionSyntaxTree;

    /**
     * Function expression of statement.
     */
    public get functionExpression(): PgslFunctionCallExpressionSyntaxTree {
        return this.mFunctionExpression;
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
    public constructor(pData: PgslFunctionCallStatementSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Create and validate expression instead.
        this.mFunctionExpression = new PgslFunctionCallExpressionSyntaxTree({
            name: pData.name,
            parameterList: pData.parameterList
        },0,0,0,0).setParent(this);
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        this.mFunctionExpression.validateIntegrity();
    }
}

type PgslFunctionCallStatementSyntaxTreeStructureData = {
    name: string;
    parameterList: Array<BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>>;
};