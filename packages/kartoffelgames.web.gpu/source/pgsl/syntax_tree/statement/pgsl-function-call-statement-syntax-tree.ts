import { PgslSyntaxTreeInitData, SyntaxTreeMeta } from '../base-pgsl-syntax-tree';
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
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslFunctionCallStatementSyntaxTreeStructureData, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
        super(pData, pMeta, pBuildIn);

        // Create and validate expression instead.
        this.mFunctionExpression = new PgslFunctionCallExpressionSyntaxTree({
            name: pData.name,
            parameterList: pData.parameterList
        }, this.meta).setParent(this);
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