import { Exception } from '@kartoffelgames/core';
import { BasePgslExpressionSyntaxTree } from '../../expression/base-pgsl-expression-syntax-tree';
import { PgslNumericTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-numeric-type-definition-syntax-tree';
import { PgslNumericTypeName } from '../../type/enum/pgsl-numeric-type-name.enum';
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
        // Switch statement must be of a unsigned integer type.
        if (!(this.mExpression.resolveType instanceof PgslNumericTypeDefinitionSyntaxTree) || this.mExpression.resolveType.typeName !== PgslNumericTypeName.UnsignedInteger) {
            throw new Exception('Switch expression must be of a unsigned integer type.', this);
        }

        // Validate each case.
        for (const lCase of this.mCases) {
            // Validate any case value.
            for (const lCaseValue of lCase.cases) {
                // Must be unsigned integer.
                if (!(lCaseValue.resolveType instanceof PgslNumericTypeDefinitionSyntaxTree) || this.mExpression.resolveType.typeName !== PgslNumericTypeName.UnsignedInteger) {
                    throw new Exception('Case expression must be of a unsigned integer type.', this);
                }

                if (!lCaseValue.isConstant) {
                    throw new Exception('Case expression must be a constant.', this);
                }
            }
        }
    }
}

type PgslSwitchStatementSwitchCase = {
    readonly cases: Array<BasePgslExpressionSyntaxTree>,
    readonly block: PgslBlockStatementSyntaxTree;
};

type PgslSwitchStatementSyntaxTreeStructureData = {
    expression: BasePgslExpressionSyntaxTree,
    cases: Array<PgslSwitchStatementSwitchCase>;
    default?: PgslBlockStatementSyntaxTree;
};