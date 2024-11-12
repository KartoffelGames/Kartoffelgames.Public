import { Exception } from '@kartoffelgames/core';
import { SyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../../expression/base-pgsl-expression-syntax-tree';
import { PgslTypeName } from '../../type/enum/pgsl-type-name.enum';
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
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslSwitchStatementSyntaxTreeStructureData, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
        // Create and check if structure was loaded from cache. Skip additional processing by returning early.
        super(pData, pMeta, pBuildIn);

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
        if (this.mExpression.resolveType.baseType !== PgslTypeName.UnsignedInteger) {
            throw new Exception('Switch expression must be of a unsigned integer type.', this);
        }

        // Validate each case.
        for (const lCase of this.mCases) {
            // Validate any case value.
            for (const lCaseValue of lCase.cases) {
                // Must be unsigned integer.
                if (this.mExpression.resolveType.baseType !== PgslTypeName.UnsignedInteger) {
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