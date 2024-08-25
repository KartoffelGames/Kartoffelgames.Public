import { BasePgslExpressionSyntaxTree } from '../../expression/base-pgsl-expression-syntax-tree';
import { BasePgslStatementSyntaxTree } from '../base-pgsl-statement-syntax-tree';
import { PgslBlockStatementSyntaxTree } from '../pgsl-block-statement-syntax-tree';

/**
 * PGSL structure for a switch statement with optional default block.
 */
export class PgslSwitchStatementSyntaxTree extends BasePgslStatementSyntaxTree<PgslSwitchStatementSyntaxTreeStructureData> {
    private readonly mCases: Array<PgslSwitchStatementSwitchCase>;
    private readonly mDefault: PgslBlockStatementSyntaxTree | null;
    private readonly mExpression: BasePgslExpressionSyntaxTree;

    /**
     * Switch cases.
     */
    public get cases(): Array<PgslSwitchStatementSwitchCase> {
        return [...this.mCases];
    }

    /**
     * Default block.
     */
    public get default(): PgslBlockStatementSyntaxTree | null {
        return this.mDefault;
    }

    /**
     * Switch boolean expression reference.
     */
    public get expression(): BasePgslExpressionSyntaxTree {
        return this.mExpression;
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
    public constructor(pData: PgslSwitchStatementSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set data.
        this.mCases = pData.cases;
        this.mExpression = pData.expression;
        this.mDefault = pData.default ?? null;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // TODO: Expression and cases should all be the same integer scalar type.
        // TODO: All cases must be const.
    }
}

type PgslSwitchStatementSwitchCase = {
    readonly cases: Array<BasePgslStatementSyntaxTree>,
    readonly block: PgslBlockStatementSyntaxTree;
};

type PgslSwitchStatementSyntaxTreeStructureData = {
    expression: BasePgslExpressionSyntaxTree,
    cases: Array<PgslSwitchStatementSwitchCase>;
    default?: PgslBlockStatementSyntaxTree;
};